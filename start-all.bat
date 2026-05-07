@echo off
setlocal

REM ================================================================
REM  LMS - FULL STACK LOCAL LAUNCHER
REM ================================================================

title LMS - Launcher
color 0A

echo.
echo  ============================================================
echo   LMS Full Stack Launcher
echo  ============================================================
echo.

REM Step 1: Check Prerequisites
echo [CHECK] Verifying prerequisites...
echo.

where node >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Node.js not found. Download from https://nodejs.org
    pause
    exit /b 1
)
node -v

where java >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Java not found. Download from https://adoptium.net
    pause
    exit /b 1
)

where mvn >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Maven not found. Download from https://maven.apache.org
    pause
    exit /b 1
)
mvn -version 2>&1 | findstr /i "Apache Maven"

echo.
echo  All prerequisites OK. Starting services...
echo.

REM Step 2: Database check
echo [1/5] Checking Database...
echo  [OK] Backend uses H2 in-memory database. No MongoDB required.

REM Step 3: Build Backend
echo.
echo [2/5] Building Backend...
cd backend
call mvn clean package -DskipTests -q
if errorlevel 1 (
    echo  [ERROR] Maven build failed!
    cd ..
    pause
    exit /b 1
)
cd ..
echo  [OK] Backend built.

echo  Starting Backend on http://localhost:8080 ...
start "Backend" /d "%~dp0backend" cmd /k mvn spring-boot:run
echo  [OK] Backend starting...
echo  Waiting 15 seconds for backend to initialize...
timeout /t 15 /nobreak >nul

REM Step 4: Frontend LMS
echo.
echo [3/5] Starting Frontend LMS...
if not exist frontend\node_modules (
    echo  Installing npm packages...
    cd frontend
    call npm install
    cd ..
)
start "Frontend LMS" /d "%~dp0frontend" cmd /k npm start
echo  [OK] Frontend LMS starting on http://localhost:3000 ...

REM Step 5: Chatbot
echo.
echo [4/5] Starting Chatbot...
if not exist frontend-chatbot\node_modules (
    echo  Installing npm packages...
    cd frontend-chatbot
    call npm install
    cd ..
)
start "Chatbot" /d "%~dp0frontend-chatbot" cmd /k npm start
echo  [OK] Chatbot starting on http://localhost:3001 ...

REM Step 6: Angular App
echo.
echo [5/5] Starting Angular App...
if not exist node_modules (
    echo  Installing npm packages...
    call npm install
)
start "Angular App" /d "%~dp0" cmd /k ng serve --open
echo  [OK] Angular app starting on http://localhost:4200 ...

echo.
echo  ============================================================
echo   ALL SERVICES LAUNCHED
echo  ============================================================
echo.
echo   Backend API   : http://localhost:8080
echo   Frontend LMS  : http://localhost:3000
echo   Chatbot       : http://localhost:3001
echo   Angular App   : http://localhost:4200
echo.
echo  Press any key to close this launcher...
pause >nul
