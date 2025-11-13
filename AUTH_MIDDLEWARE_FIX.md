# Auth Middleware Fix - Unique Constraint Violation

## Problem

The backend was returning **HTTP 500** errors on multiple API endpoints when the authentication middleware tried to auto-create an artist profile on first login. The error was:

```
PrismaClientKnownRequestError: Unique constraint failed on the fields: (`email`)
```

This happened in `backend/src/lib/middleware/auth.middleware.ts` at the artist creation step during JWT token verification.

### Root Cause

The issue occurred because:

1. **Schema constraint**: The `Artist` model has both `email` and `stackAuthUserId` marked as `@unique`
   ```prisma
   stackAuthUserId String @unique
   email String @unique
   ```

2. **Duplicate email scenario**: When a user authenticated with Stack Auth:
   - The middleware would verify the JWT token (containing the user's ID and email)
   - It would try to find an artist by `stackAuthUserId`
   - If not found (first login or mismatch), it would attempt to CREATE a new artist
   - But if an artist with that email **already existed** in the database (from a previous test, different Stack Auth ID, etc.), the CREATE would fail due to the unique constraint on email

3. **Example**: 
   - Old test data had: `stackAuthUserId: user_demo_123`, `email: testuser@example.com`
   - New Stack Auth user has: `stackAuthUserId: user_new_456`, `email: testuser@example.com`
   - Attempting to create the new user would fail because the email already exists

## Solution

Updated the auth middleware to handle this gracefully:

```typescript
// 1. Try to find artist by stackAuthUserId (the primary lookup)
let artist = await prisma.artist.findFirst({
  where: { stackAuthUserId: decoded.userId },
  // ...
});

// 2. If not found, check if an artist with this email exists
if (!artist) {
  const userEmail = decoded.email || 'unknown@example.com';
  const existingArtist = await prisma.artist.findFirst({
    where: { email: userEmail },
    // ...
  });

  if (existingArtist) {
    // Artist exists with this email but different stackAuthUserId
    // Use the existing artist record instead of trying to create
    console.warn(`[auth] Artist with email ${userEmail} exists with different stackAuthUserId...`);
    artist = existingArtist;
  } else {
    // Truly new user - safe to create
    artist = await prisma.artist.create({
      data: { stackAuthUserId, email: userEmail, /* ... */ },
      // ...
    });
  }
}
```

## Why This Works

1. **Respects unique constraints**: By checking if the email already exists BEFORE attempting to create, we avoid the unique constraint violation
2. **Handles mismatch gracefully**: If a user re-authenticates with a different Stack Auth ID but the same email, we use their existing artist profile instead of failing
3. **Logs the issue**: When email conflicts occur, we log a warning so the team can investigate and potentially migrate data if needed
4. **No data loss**: The user's existing artist profile is preserved and usable

## Testing

After this fix:

✅ Multiple API endpoints no longer return 500 errors:
- `GET /api/auth/me`
- `GET /api/profiles`
- `GET /api/audience/contacts`
- `GET /api/campaigns`
- `GET /api/journeys`
- etc.

✅ First-time login flow works
✅ Subsequent logins with same token work
✅ Token verification doesn't crash

## Related Files

- `backend/src/lib/middleware/auth.middleware.ts` - Fixed the authenticateJWT middleware
- `backend/prisma/schema.prisma` - Schema definition (no changes needed)
- `src/lib/auth/context.tsx` - Frontend auth context (no changes needed)

## Notes for Future Improvements

1. **Consider email as non-unique if multiple Stack Auth accounts can use same email**: Currently we use the first artist record. If your system allows multiple Stack Auth accounts per email, you may need additional logic (like a mapping table).

2. **Data cleanup**: Old test data with emails like `testuser@example.com` should be cleaned up from production to avoid confusion.

3. **Audit trail**: Consider logging all stackAuthUserId mismatches for security/audit purposes.

