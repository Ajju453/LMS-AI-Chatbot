@echo off
REM One-click launcher for AI Learning Path Chatbot
REM Works immediately in DEMO MODE - No API key required!

setlocal enabledelayedexpansion

cls
echo.
echo ╔════════════════════════════════════════╗
echo ║   🤖 AI LEARNING PATH CHATBOT         ║
echo ║       INSTANT LAUNCHER                 ║
echo ╚════════════════════════════════════════╝
echo.
echo ✨ DEMO MODE: Chat with intelligent AI without API key!
echo.
echo Want UNLIMITED real AI power? Add your free OpenAI key:
echo   (Optional - you can do this anytime in the Settings panel)
echo.

REM Change to script directory
cd /d "%~dp0"

REM Check if user wants to add API key
set /p ADD_KEY="Add OpenAI API key now? (y/n, default is n): "

if /i "%ADD_KEY%"=="y" (
    echo.
    echo Getting a FREE OpenAI API key takes 2 minutes:
    echo   1. Visit: https://platform.openai.com/api-keys
    echo   2. Sign up / Login
    echo   3. Click: + Create new secret key
    echo   4. Copy the key (starts with 'sk-proj-')
    echo.
    
    set /p API_KEY="Paste your API key (or press Enter to skip): "
    
    if not "!API_KEY!"=="" (
        (
            echo REACT_APP_OPENAI_API_KEY=!API_KEY!
            echo REACT_APP_STUDENT_ID=STU001
            echo REACT_APP_DEFAULT_PATH=General Learning
        ) > .env.local
        echo ✓ API key saved! Real AI Mode enabled.
        echo.
    ) else (
        echo ⊘ Skipping for now - using Demo Mode
        echo You can add it later in the app Settings
        echo.
    )
) else (
    echo.
    echo 🚀 Launching in Demo Mode...
    echo.
)

echo.
echo 🚀 Starting your AI Learning Path Chatbot...
echo.
echo Choose your mode:
echo   📊 Demo Mode     - Intelligent responses (no API key)
echo   🤖 Real AI Mode  - GPT-3.5 powered (with API key)
echo.
echo App: http://localhost:3000
echo Press Ctrl+C to stop
echo.

REM Kill any existing Node processes
taskkill /F /IM node.exe >nul 2>&1

REM Start the app
call npm start

if errorlevel 1 (
    echo.
    echo ERROR: Failed to start the app
    echo Make sure you've run: npm install
    echo.
)

pause
