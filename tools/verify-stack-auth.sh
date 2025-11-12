#!/bin/bash

# Stack Auth Integration Verification Script
# Run this to verify all components are in place

echo "🔍 Stack Auth Integration Verification"
echo "======================================"
echo ""

# Check frontend files
echo "✓ Checking frontend files..."
frontend_files=(
  "src/stack/client.ts"
  "src/pages/auth/login-stack.tsx"
  "src/pages/auth/signup-stack.tsx"
)

for file in "${frontend_files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file - NOT FOUND"
  fi
done

# Check backend files
echo ""
echo "✓ Checking backend files..."
backend_files=(
  "backend/src/middleware/stack-auth.middleware.ts"
  "backend/src/routes/webhooks/stack-auth.routes.ts"
)

for file in "${backend_files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file - NOT FOUND"
  fi
done

# Check environment variables
echo ""
echo "✓ Checking environment variables..."
if [ -f "src/.env.local" ]; then
  if grep -q "VITE_STACK_PROJECT_ID" "src/.env.local"; then
    echo "  ✅ Frontend env vars configured"
  else
    echo "  ⚠️  Frontend env vars not configured (add VITE_STACK_PROJECT_ID and VITE_STACK_CLIENT_KEY)"
  fi
else
  echo "  ⚠️  Frontend .env.local not found (create with API keys)"
fi

if [ -f "backend/.env.local" ]; then
  if grep -q "STACK_PROJECT_ID" "backend/.env.local"; then
    echo "  ✅ Backend env vars configured"
  else
    echo "  ⚠️  Backend env vars not configured (add STACK_* keys)"
  fi
else
  echo "  ⚠️  Backend .env.local not found (create with API keys)"
fi

# Check dependencies
echo ""
echo "✓ Checking npm packages..."
if grep -q "@stackframe/stack" "package.json"; then
  echo "  ✅ @stackframe/stack in frontend"
else
  echo "  ❌ @stackframe/stack not in frontend (run: npm install @stackframe/stack)"
fi

if grep -q "axios" "backend/package.json"; then
  echo "  ✅ axios in backend"
else
  echo "  ❌ axios not in backend (run: cd backend && npm install axios)"
fi

# Check main.tsx
echo ""
echo "✓ Checking main.tsx updates..."
if grep -q "StackProvider" "src/main.tsx"; then
  echo "  ✅ StackProvider imported"
else
  echo "  ❌ StackProvider not in main.tsx"
fi

if grep -q "stackClientApp" "src/main.tsx"; then
  echo "  ✅ stackClientApp imported"
else
  echo "  ❌ stackClientApp not in main.tsx"
fi

# Check router.tsx
echo ""
echo "✓ Checking router.tsx updates..."
if grep -q "login-stack" "src/router.tsx"; then
  echo "  ✅ Login-stack component imported"
else
  echo "  ❌ Login-stack component not imported"
fi

if grep -q "signup-stack" "src/router.tsx"; then
  echo "  ✅ Signup-stack component imported"
else
  echo "  ❌ Signup-stack component not imported"
fi

if grep -q "useUser" "src/router.tsx"; then
  echo "  ✅ useUser hook imported"
else
  echo "  ❌ useUser hook not imported"
fi

# Check backend index.ts
echo ""
echo "✓ Checking backend/src/index.ts updates..."
if grep -q "stack-auth.routes" "backend/src/index.ts"; then
  echo "  ✅ Stack Auth routes imported"
else
  echo "  ❌ Stack Auth routes not imported"
fi

if grep -q "validateStackAuthToken" "backend/src/index.ts"; then
  echo "  ✅ Stack Auth middleware imported"
else
  echo "  ❌ Stack Auth middleware not imported"
fi

# Database check
echo ""
echo "✓ Checking database..."
if grep -q "stackAuthUserId" "backend/prisma/schema.prisma"; then
  echo "  ✅ Artist model has stackAuthUserId"
else
  echo "  ❌ Artist model missing stackAuthUserId"
fi

if [ -d "backend/prisma/migrations" ] && [ "$(ls -A backend/prisma/migrations)" ]; then
  echo "  ✅ Migrations exist"
else
  echo "  ❌ No migrations found (run: npx prisma migrate dev)"
fi

echo ""
echo "======================================"
echo "✅ Verification complete!"
echo ""
echo "Next steps:"
echo "1. Add API keys to .env.local files"
echo "2. Configure Stack Auth dashboard webhooks"
echo "3. Run: npm run dev (frontend)"
echo "4. Run: cd backend && npm run dev (backend)"
echo "5. Test at: http://localhost:5176/signup"
echo ""
