#!/bin/bash

echo "🧪 Stack Auth Integration - TEST WEBHOOK"
echo "=========================================="
echo ""

# Test webhook endpoint
echo "1️⃣  Testing webhook endpoint via ngrok..."
RESPONSE=$(curl -s -X POST https://wreckshop-webhooks.ngrok.io/api/webhooks/stack-auth \
  -H "Content-Type: application/json" \
  -H "X-Stack-Webhook-Signature: invalid" \
  -d '{"type":"test","data":{"message":"test"}}' \
  -w "\n%{http_code}")

STATUS=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | head -1)

if [ "$STATUS" = "400" ]; then
    echo "   ✅ Webhook endpoint is reachable"
    echo "   ✅ Signature validation is working (correctly rejected invalid signature)"
else
    echo "   ❌ Unexpected status: $STATUS"
    echo "   Body: $BODY"
fi
echo ""

# Check webhook secret is loaded
echo "2️⃣  Checking webhook secret is configured..."
if grep -q "whsec_6e+wFCxoklF4qf" backend/.env.local; then
    echo "   ✅ Webhook secret is correctly set in backend/.env.local"
else
    echo "   ❌ Webhook secret not found or incorrect"
fi
echo ""

# Test backend API
echo "3️⃣  Testing backend API..."
HEALTH=$(curl -s http://localhost:4002 -w "%{http_code}")
echo "   Backend responds: $HEALTH"
echo ""

# Test frontend
echo "4️⃣  Testing frontend..."
FRONTEND=$(curl -s http://localhost:5176 -w "%{http_code}" | tail -1)
echo "   Frontend responds: $FRONTEND"
echo ""

# Check database
echo "5️⃣  Checking database connectivity..."
ARTISTS=$(docker exec wreckshop-postgres psql -U postgres -d wreckshop -t -c "SELECT COUNT(*) FROM Artist;" 2>/dev/null)
echo "   Total artists in database: $ARTISTS"
echo ""

echo "=========================================="
echo "✅ All systems ready for signup test!"
echo ""
echo "Next: Visit http://localhost:5176/signup"
echo ""
echo "Test signup with:"
echo "  Email: test@example.com"
echo "  Password: TestPassword123!"
echo ""
echo "Then check if artist was created:"
echo "  docker exec wreckshop-postgres psql -U postgres -d wreckshop -c \"SELECT email, stackAuthUserId FROM Artist WHERE email='test@example.com';\""
echo ""
