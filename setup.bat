@echo off
REM Lead Management Dashboard - Quick Start Script
REM This script helps you set up and run the MERN application

cls
echo.
echo ==========================================
echo   Lead Management Dashboard - Quick Start
echo ==========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo X Node.js is not installed. Please install Node.js first.
    echo   Download from: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo + Node.js version: %NODE_VERSION%
echo + npm version: %NPM_VERSION%
echo.

REM Backend Setup
echo Package Backend...
cd backend

if not exist "node_modules" (
    echo    Installing backend dependencies...
    call npm install
)

if not exist ".env" (
    echo    Creating .env file from .env.example...
    copy .env.example .env
    echo.
    echo    WARNING: Please update the following in backend\.env:
    echo       - MONGODB_URI (if using cloud MongoDB)
    echo       - TWILIO_ACCOUNT_SID
    echo       - TWILIO_AUTH_TOKEN
    echo       - TWILIO_PHONE_NUMBER
    echo.
    pause
)

cd ..
echo + Backend setup complete
echo.

REM Frontend Setup
echo Package Frontend...
cd frontend

if not exist "node_modules" (
    echo    Installing frontend dependencies...
    call npm install
)

cd ..
echo + Frontend setup complete
echo.

echo.
echo ==========================================
echo   Setup Complete!
echo ==========================================
echo.
echo Next Steps:
echo.
echo 1. Ensure MongoDB is running
echo    mongod
echo.
echo 2. Start the Backend server:
echo    cd backend ^&^& npm run dev
echo.
echo 3. In a new terminal, start the Frontend:
echo    cd frontend ^&^& npm start
echo.
echo 4. Open http://localhost:3000 in your browser
echo.
echo 5. Create a lead and check your WhatsApp for the message!
echo.
echo For more details, see README.md
echo.
pause
