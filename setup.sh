#!/bin/bash

# Lead Management Dashboard - Quick Start Script
# This script helps you set up and run the MERN application

set -e

echo "=========================================="
echo "  Lead Management Dashboard - Quick Start"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Backend Setup
echo "📦 Setting up Backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "   Installing backend dependencies..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "   Creating .env file from .env.example..."
    cp .env.example .env
    echo ""
    echo "   ⚠️  Please update the following in backend/.env:"
    echo "      - MONGODB_URI (if using cloud MongoDB)"
    echo "      - TWILIO_ACCOUNT_SID"
    echo "      - TWILIO_AUTH_TOKEN"
    echo "      - TWILIO_PHONE_NUMBER"
    echo ""
    read -p "   Press enter once you've updated the .env file..."
fi

cd ..
echo "✓ Backend setup complete"
echo ""

# Frontend Setup
echo "📦 Setting up Frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "   Installing frontend dependencies..."
    npm install
fi

cd ..
echo "✓ Frontend setup complete"
echo ""

echo "=========================================="
echo "  ✅ Setup Complete!"
echo "=========================================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Ensure MongoDB is running"
echo "   On Linux/Mac: mongod"
echo "   On Windows: 'C:\\Program Files\\MongoDB\\Server\\{version}\\bin\\mongod.exe'"
echo ""
echo "2. Start the Backend server:"
echo "   cd backend && npm run dev"
echo ""
echo "3. In a new terminal, start the Frontend:"
echo "   cd frontend && npm start"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "5. Create a lead and check your WhatsApp for the message!"
echo ""
echo "For more details, see README.md"
echo ""
