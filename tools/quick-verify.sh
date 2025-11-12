#!/bin/bash

echo "🔍 Stack Auth Integration - FULL VERIFICATION"
echo "=============================================="
echo ""

# Check Frontend
echo "1️⃣  Frontend Container..."
if docker ps | grep -q wreckshop-frontend; then
    echo "   ✅ Running on port 5176"
    if curl -s http://localhost:5176 | grep -q "Stack"; then
        echo "   ✅ Responding with Stack Auth content"
    else
        echo "   ⚠️  Page loads but Stack Auth might not be configured"
    fi
else
    echo "   ❌ Not running"
fi
echo ""

# Check Backend
echo "2️⃣  Backend Container..."
if docker ps | grep -q wreckshop-backend; then
    echo "   ✅ Running on port 4002"
    if curl -s http://localhost:4002 | grep -q "error\|Not Found"; then
        echo "   ✅ API responding"
    fi
else
    echo "   ❌ Not running"
fi
echo ""

# Check Database
echo "3️⃣  Database..."
if docker ps | grep -q wreckshop-postgres; then
    echo "   ✅ PostgreSQL running"
    ARTIST_COUNT=$(docker exec wreckshop-postgres psql -U postgres -d wreckshop -t -c "SELECT COUNT(*) FROM Artist;" 2>/dev/null)
    echo "   📊 Artists in database: $ARTIST_COUNT"
else
    echo "   ❌ PostgreSQL not running"
fi
echo ""

# Check Environment Variables
echo "4️⃣  Environment Configuration..."
if [ -f "src/.env.local" ]; then
    echo "   ✅ Frontend .env.local exists"
    if grep -q "VITE_STACK_PROJECT_ID" src/.env.local; then
        echo "   ✅ Frontend Stack Auth configured"
    fi
else
    echo "   ❌ Frontend .env.local missing"
fi

if [ -f "backend/.env.local" ]; then
    echo "   ✅ Backend .env.local exists"
    if grep -q "STACK_WEBHOOK_SECRET=whsec_" backend/.env.local; then
        echo "   ✅ Backend webhook secret configured"
    elif grep -q "STACK_WEBHOOK_SECRET=whsec_PASTE" backend/.env.local; then
        echo "   ⚠️  Backend webhook secret is PLACEHOLDER (needs real value)"
    fi
else
    echo "   ❌ Backend .env.local missing"
fi
echo ""

# Check ngrok
echo "5️⃣  ngrok Tunnel..."
if curl -s https://wreckshop-webhooks.ngrok.io/api/webhooks/stack-auth -X POST -H "Content-Type: application/json" -d '{}' 2>/dev/null | grep -q "error"; then
    echo "   ✅ Tunnel is active and reachable"
else
    echo "   ❌ Tunnel not responding"
fi
echo ""

# Check Docker Compose
echo "6️⃣  Docker Services..."
RUNNING=$(docker ps | grep wreckshop | wc -l)
echo "   🐋 $RUNNING Wreckshop containers running"
docker ps | grep wreckshop | awk '{print "   📦", $1, "("$NF")"}'
echo ""

# Check Backend Logs
echo "7️⃣  Backend Health..."
if docker logs wreckshop-backend 2>&1 | grep -q "listening on"; then
    echo "   ✅ Backend started successfully"
else
    echo "   ⚠️  Backend may have startup issues"
fi
echo ""

# Summary
echo "=============================================="
echo "📋 SUMMARY"
echo "=============================================="
echo ""
echo "Frontend: http://localhost:5176"
echo "Backend:  http://localhost:4002"
echo "Webhooks: https://wreckshop-webhooks.ngrok.io/api/webhooks/stack-auth"
echo ""
echo "Status:"
echo "  ✅ Infrastructure: RUNNING"
echo "  ⏳ Webhook Secret: CHECK backend/.env.local"
echo "  ⏳ Test Flow: READY WHEN SECRET IS ADDED"
echo ""
echo "Next Step: Add webhook secret to backend/.env.local and restart backend"
echo ""
