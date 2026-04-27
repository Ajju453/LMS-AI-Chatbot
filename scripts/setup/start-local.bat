@echo off
REM ═══════════════════════════════════════════════════════════════
REM 🚀 START CHATBOT LOCALLY - ONE CLICK!
REM ═══════════════════════════════════════════════════════════════

echo.
echo ╔═════════════════════════════════════════════════════════╗
echo ║  CHATBOT LOCAL SERVER - Starting...                    ║
echo ╚═════════════════════════════════════════════════════════╝
echo.

REM Check if backend JAR exists
if not exist "backend\target\git-vscode-hub-1.0.0.jar.original" (
    echo ERROR: Backend JAR not found!
    echo.
    echo Build backend first:
    echo   cd backend
    echo   mvn clean install -DskipTests
    echo   cd ..
    pause
    exit /b 1
)

REM Check if frontend build exists
if not exist "frontend-chatbot\build" (
    echo WARNING: Frontend build not found
    echo Building frontend...
    cd frontend-chatbot
    call npm run build
    cd ..
)

echo.
echo [1/2] Starting Backend on port 8080...
echo       (Keep this window open!)
echo.

REM Start backend in a new window
start "Chatbot Backend" cmd /k "cd backend && java -jar target/git-vscode-hub-1.0.0.jar.original"

REM Wait for backend to start
timeout /t 5 /nobreak

echo.
echo [2/2] Starting Frontend on port 3000...
echo       (Keep this window open too!)
echo.

REM Start frontend in a new window
start "Chatbot Frontend" cmd /k "cd frontend-chatbot && npm start"

echo.
echo ╔═════════════════════════════════════════════════════════╗
echo ║  CHATBOT IS STARTING!                                  ║
echo ╚═════════════════════════════════════════════════════════╝
echo.
echo.
echo WAIT 30-60 SECONDS for both windows to fully load...
echo.
echo Then open your browser and go to:
echo.
echo    http://localhost:3000
echo.
echo SHARE THIS URL WITH YOUR MENTOR!
echo.
echo Test with roll number: 2223850
echo (or any number from 2223810-2223889)
echo.
echo To stop: Close both terminal windows
echo.
pause
