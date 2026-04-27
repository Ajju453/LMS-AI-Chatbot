@echo off
REM Automated OpenAI API Key Setup Script for AI Chatbot
REM This script will prompt for your API key and auto-configure the app

setlocal enabledelayedexpansion

echo.
echo ======================================================
echo     AI CHATBOT - AUTOMATED SETUP
echo ======================================================
echo.
echo This will configure your OpenAI API key automatically.
echo.
echo To get a FREE API key:
echo   1. Visit: https://platform.openai.com/api-keys
echo   2. Sign up or log in
echo   3. Click "+ Create new secret key"
echo   4. Copy the key (starts with sk-proj-)
echo.

set /p API_KEY="Paste your OpenAI API key here: "

if "%API_KEY%"=="" (
    echo.
    echo ERROR: No API key provided!
    echo.
    pause
    exit /b 1
)

REM Create .env.local file with the API key
REM Change to frontend-chatbot directory
cd /d "%~dp0"

if not exist ".env.local" (
    echo Creating .env.local file...
)

(
    echo REACT_APP_OPENAI_API_KEY=%API_KEY%
) > .env.local

echo.
echo ======================================================
echo   ✓ API Key configured successfully!
echo ======================================================
echo.
echo Starting the chatbot application...
echo Open your browser to: http://localhost:3000
echo.
echo Press Ctrl+C in this terminal to stop the server.
echo.
timeout /t 3

REM Kill any existing Node processes
taskkill /F /IM node.exe >nul 2>&1

REM Start the app
call npm start

pause
