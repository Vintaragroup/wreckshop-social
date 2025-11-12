#!/bin/bash

# Wreckshop Stack Auth - Complete Setup Script

echo "🚀 Starting Wreckshop Stack Auth Setup..."
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok not found. Install it with: brew install ngrok"
    exit 1
fi

# Check if .env.local files exist
if [ ! -f "src/.env.local" ]; then
    echo "❌ Frontend .env.local not found"
    exit 1
fi

if [ ! -f "backend/.env.local" ]; then
    echo "❌ Backend .env.local not found"
    exit 1
fi

echo "✅ Environment files configured"
echo ""

# Check database
echo "📊 Verifying database..."
cd backend
npx prisma migrate deploy > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Database ready"
else
    echo "⚠️  Database migration may need attention"
fi
cd ..
echo ""

# Start services
echo "🌐 Starting services..."
echo ""
echo "Terminal 1: Frontend (port 5176)"
echo "Terminal 2: Backend (port 4002)"
echo "Terminal 3: ngrok tunnel"
echo ""

# Create a command to run
echo "📋 Run these commands in separate terminals:"
echo ""
echo "Terminal 1:"
echo "  npm run dev"
echo ""
echo "Terminal 2:"
echo "  cd backend && npm run dev"
echo ""
echo "Terminal 3 (ngrok):"
echo "  ngrok http 4002 --domain wreckshop-webhooks.ngrok.io"
echo ""
echo "✅ Setup complete! Start the terminals above."
echo ""
echo "🔗 Webhook URL: https://wreckshop-webhooks.ngrok.io/api/webhooks/stack-auth"
