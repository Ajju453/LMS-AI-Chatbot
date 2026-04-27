@echo off
setlocal EnableDelayedExpansion

REM ================================================================
REM  LMS AI CHATBOT - FULL STACK LOCAL LAUNCHER
REM  Starts: MongoDB, Backend, Frontend LMS, Chatbot, Angular App
REM ================================================================

title LMS AI Chatbot - Launcher
color 0A

echo.
echo  ============================================================
echo   LMS AI CHATBOT ^| Full Stack Launcher
echo  ============================================================
echo.

REM ── Step 1: Check Prerequisites ─────────────────────────────────
echo [CHECK] Verifying prerequisites...
echo.

REM Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js not found. Download from https://nodejs.org
    pause & exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do echo  [OK] Node.js %%v

REM Check Java
where java >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Java not found. Download from https://adoptium.net
    pause & exit /b 1
)
for /f "tokens=3" %%v in ('java -version 2^>^&1 ^| findstr /i "version"') do echo  [OK] Java %%v

REM Check Maven
where mvn >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Maven not found. Download from https://maven.apache.org
    pause & exit /b 1
)
for /f "tokens=3" %%v in ('mvn -version 2^>^&1 ^| findstr /i "Apache Maven"') do echo  [OK] Maven %%v

REM Check Angular CLI
where ng >nul 2>&1
if %errorlevel% neq 0 (
    echo  [WARN] Angular CLI not found. Installing globally...
    call npm install -g @angular/cli
)

echo.
echo  ============================================================
echo  All prerequisites OK. Starting services...
echo  ============================================================
echo.

REM ── Step 2: Start MongoDB ────────────────────────────────────────
echo [1/5] Starting MongoDB...
net start MongoDB >nul 2>&1
if %errorlevel% == 0 (
    echo  [OK] MongoDB service started.
) else (
    REM Try starting mongod directly if service not installed
    where mongod >nul 2>&1
    if %errorlevel% == 0 (
        start "MongoDB" cmd /k "echo Starting MongoDB... && mongod --dbpath C:\data\db"
        echo  [OK] MongoDB started in new window.
        timeout /t 3 /nobreak >nul
    ) else (
        echo  [WARN] MongoDB not found as service or command.
        echo         Make sure MongoDB is running manually.
        pause
    )
)

REM ── Step 3: Build & Start Backend ───────────────────────────────
echo.
echo [2/5] Building Backend (Java/Spring Boot)...
if not exist "backend\target\*.jar" (
    echo  Building Maven project (first time may take a few minutes)...
    cd backend
    call mvn clean package -DskipTests -q
    if %errorlevel% neq 0 (
        echo  [ERROR] Maven build failed! Check backend code.
        cd ..
        pause & exit /b 1
    )
    cd ..
    echo  [OK] Backend built successfully.
) else (
    echo  [OK] Backend JAR already exists, skipping build.
)

echo  Starting Backend on http://localhost:8080 ...
start "Backend (Java)" cmd /k "cd /d %~dp0backend && mvn spring-boot:run"
echo  [OK] Backend starting in new window...
echo  Waiting 10 seconds for backend to initialize...
timeout /t 10 /nobreak >nul

REM ── Step 4: Install & Start Frontend LMS ────────────────────────
echo.
echo [3/5] Starting Frontend LMS (React)...
if not exist "frontend\node_modules" (
    echo  Installing npm packages (first time)...
    cd frontend
    call npm install --silent
    cd ..
)
start "Frontend LMS (React)" cmd /k "cd /d %~dp0frontend && npm start"
echo  [OK] Frontend LMS starting on http://localhost:3000 ...

REM ── Step 5: Install & Start Chatbot ─────────────────────────────
echo.
echo [4/5] Starting Chatbot Frontend (React)...

REM Check for .env.local
if not exist "frontend-chatbot\.env.local" (
    echo  [WARN] frontend-chatbot\.env.local not found!
    if exist "frontend-chatbot\.env.local.example" (
        copy "frontend-chatbot\.env.local.example" "frontend-chatbot\.env.local" >nul
        echo  [INFO] Created .env.local from example.
        echo  [ACTION NEEDED] Open frontend-chatbot\.env.local and add your OpenAI API key.
    )
)

if not exist "frontend-chatbot\node_modules" (
    echo  Installing npm packages (first time)...
    cd frontend-chatbot
    call npm install --silent
    cd ..
)
start "Chatbot (React)" cmd /k "cd /d %~dp0frontend-chatbot && npm start"
echo  [OK] Chatbot starting on http://localhost:3001 ...

REM ── Step 6: Install & Start Angular App ─────────────────────────
echo.
echo [5/5] Starting Angular App...
if not exist "node_modules" (
    echo  Installing npm packages (first time)...
    call npm install --silent
)
start "Angular App" cmd /k "cd /d %~dp0 && ng serve --open"
echo  [OK] Angular app starting on http://localhost:4200 ...

REM ── Done ─────────────────────────────────────────────────────────
echo.
echo  ============================================================
echo   ALL SERVICES LAUNCHED!
echo  ============================================================
echo.
echo   Service              URL
echo   ─────────────────────────────────────────────────
echo   Backend API          http://localhost:8080
echo   Frontend LMS         http://localhost:3000
echo   Chatbot              http://localhost:3001
echo   Angular App          http://localhost:4200
echo   MongoDB              localhost:27017
echo  ─────────────────────────────────────────────────
echo.
echo   Each service runs in its own terminal window.
echo   Close those windows to stop individual services.
echo.
echo   Press any key to close this launcher window...
pause >nul
