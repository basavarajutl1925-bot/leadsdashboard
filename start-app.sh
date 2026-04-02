#!/bin/bash

echo "=========================================="
echo "  🚀 Lead Dashboard - Starting Application"
echo "=========================================="
echo ""

# Check if node_modules exists
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

echo ""
echo "✅ Starting services..."
echo ""
echo "📋 Services running:"
echo "  - Backend: http://localhost:5000"
echo "  - Frontend: http://localhost:3000"
echo ""
echo "🔐 Login Credentials:"
echo "  - Username: admin"
echo "  - Password: admin"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Kill any existing processes on these ports
pkill -f "node src/server.js" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true

# Start backend
echo "🔧 Starting Backend..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Frontend..."
cd ../frontend
PORT=3000 npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Both services are starting..."
echo "Frontend will open in your browser automatically."
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
