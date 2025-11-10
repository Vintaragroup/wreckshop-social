# Security: Environment Variables & Secret Management

## ⚠️ Critical Security Rules

**NEVER commit files containing:**
- API Keys (Spotify, Instagram, YouTube, etc.)
- OAuth secrets
- Database credentials
- Admin API keys
- MongoDB connection strings with passwords
- API tokens or keys

## Git Protection (`.gitignore`)

The `.gitignore` file is configured to **automatically prevent** committing sensitive files:

```gitignore
# Env files (CRITICAL: Never commit .env files with secrets)
.env                           # Blocks local development .env
.env.local                      # Blocks local overrides
.env.*.local                    # Blocks all local variants
.env.development.local          # Blocks dev-specific files
.env.test.local                 # Blocks test-specific files
.env.production.local           # Blocks production files
.env.docker                     # Blocks Docker env files
.env.docker.local               # Blocks Docker local variants
!.env.example                   # EXCEPTION: Template is safe

# Secret files
*.key                           # Private keys
*.pem                           # Certificates/keys
*.p8                            # Apple/private keys
*.p12, *.pfx, *.jks            # Certificate formats
secrets/                        # Secret directories
.secrets/                       # Secret directories
```

## Setup Instructions

### For Development

1. **Copy the template:**
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Fill in YOUR credentials** (never share these):
   ```bash
   SPOTIFY_CLIENT_ID=your_spotify_id
   SPOTIFY_CLIENT_SECRET=your_spotify_secret
   INSTAGRAM_APP_ID=your_instagram_id
   INSTAGRAM_APP_SECRET=your_instagram_secret
   MONGODB_URI=your_mongodb_uri_with_password
   ```

3. **Verify it's ignored:**
   ```bash
   git status backend/.env  # Should show: "new file mode 100644" with status ignored
   ```

### For Production

**Use your environment's secret management:**
- AWS Secrets Manager
- Azure Key Vault
- Google Cloud Secret Manager
- HashiCorp Vault
- GitHub Secrets (for CI/CD)
- Your hosting provider's env vars (Heroku, Railway, etc.)

**Never:**
- Use `.env` files in production
- Push credentials to version control
- Log credentials or API responses with keys

## Environment Files Explained

### `backend/.env` (Development Only - Locally Created, Never Committed)
- Created from `.env.example` template
- Contains YOUR local API keys and credentials
- Automatically ignored by git (`.gitignore`)
- Each developer has their own version

### `backend/.env.example` (Template - SAFE to Commit)
- Contains **placeholder values only** (`your_spotify_id`, etc.)
- Used as reference for required variables
- Shows structure and format
- Helps new developers know what to configure

### `.env.docker` (Docker Dev Environment - Template With Placeholders)
- Configuration for Docker Compose local development
- Previously had actual credentials - **FIXED**
- Now contains placeholders only

## Credentials Currently In Use

These are stored **locally in `backend/.env`** (not committed):

| Service | Credential | Type | Status |
|---------|-----------|------|--------|
| Spotify | `SPOTIFY_CLIENT_ID` | OAuth App ID | ✅ Locally stored |
| Spotify | `SPOTIFY_CLIENT_SECRET` | OAuth Secret | ✅ Locally stored |
| Instagram | `INSTAGRAM_APP_ID` | OAuth App ID | ✅ Locally stored |
| Instagram | `INSTAGRAM_APP_SECRET` | OAuth Secret | ✅ Locally stored |
| MongoDB | `MONGODB_URI` | Connection String | ✅ Locally stored |
| LastFM | `LASTFM_API_KEY` | API Key | ✅ Locally stored |
| Admin | `ADMIN_API_KEY` | Auth Token | ✅ Locally stored |

## Security Checklist

- ✅ `.gitignore` configured to block `.env` files
- ✅ `.env.example` contains placeholder values only
- ✅ `.env.docker` contains placeholder values only
- ✅ `backend/.env` is locally created and ignored by git
- ✅ Secret files (`.key`, `.pem`, etc.) are blocked
- ✅ Secret directories are blocked

## If You Accidentally Committed Secrets

**Immediate steps:**
1. Invalidate all exposed credentials (regenerate keys, reset passwords)
2. Remove from git history:
   ```bash
   # Option 1: Using BFG Repo-Cleaner (recommended)
   bfg --delete-files backend/.env --no-blob-protection
   git reflog expire --expire=now --all && git gc --prune=now --aggressive
   
   # Option 2: Using git filter-branch
   git filter-branch --tree-filter 'rm -f backend/.env' HEAD
   ```
3. Force push to remote:
   ```bash
   git push origin --force-with-lease
   ```
4. Notify team of history rewrite

## Verifying Security

Check what files are tracked by git:
```bash
# View all tracked files
git ls-files

# Verify no .env files are tracked
git ls-files | grep -E "\\.env"  # Should return NOTHING

# Verify only .env.example is tracked
git ls-files | grep -E "example"  # Should return: backend/.env.example
```

Check git will ignore specific files:
```bash
git check-ignore -v backend/.env        # Should show: gitignore pattern
git check-ignore -v backend/.env.example  # Should show: gitignore negation (!.env.example)
```

## Additional Resources

- [GitHub: Removing Sensitive Data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [OWASP: Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [12-Factor App: Environment Config](https://12factor.net/config)

---

**Last Updated:** November 10, 2025  
**Status:** ✅ Security configuration hardened  
**Version:** 1.0
