@echo off
setlocal EnableDelayedExpansion
title Vrikszon Occultaura - Laptop 2 Setup
echo ========================================================
echo   Vrikszon Occultaura - Laptop 2 Automated Setup
echo ========================================================
echo.

:: 1. Check Node.js
echo [1/5] Checking Node.js installation...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Node.js is NOT installed!
    echo Please download and install Node.js (LTS version 20 or 22) from:
    echo   https://nodejs.org
    echo After installing, restart this command prompt and run this script again.
    echo.
    pause
    exit /b 1
)
node -v
echo Node.js is detected.
echo.

:: 2. Check Git
echo [2/5] Checking Git installation...
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Git is not found in PATH.
    echo Make sure Git is installed from https://git-scm.com
) else (
    git --version
    echo Git is detected.
)
echo.

:: 3. Setup .env file
echo [3/5] Checking .env configuration file...
if not exist ".env" (
    echo .env file not found. Creating from .env.example...
    copy .env.example .env >nul
    echo.
    echo [IMPORTANT] .env file created!
    echo Please open the .env file and paste your database URL,
    echo NextAuth secrets, Razorpay keys, and Resend API key.
) else (
    echo .env file already exists.
)
echo.

:: 4. Install dependencies
echo [4/5] Installing npm packages (please wait a couple minutes)...
call npm install
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] npm install encountered an error. Please review the output above.
    pause
    exit /b 1
)
echo Dependencies installed successfully.
echo.

:: 5. Generate Prisma client
echo [5/5] Generating Prisma client...
call npx prisma generate
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Prisma generate failed.
    pause
    exit /b 1
)
echo Prisma client generated successfully.
echo.

echo ========================================================
echo   LAPTOP 2 SETUP COMPLETED SUCCESSFULLY!
echo ========================================================
echo.
echo What you should do next:
echo 1. Open this project folder in Antigravity IDE (File -^> Open Folder)
echo 2. Run "scripts\setup-antigravity.bat" to install Stitch MCP and AI plugins
echo 3. Start local server with: npm run dev
echo.
pause
