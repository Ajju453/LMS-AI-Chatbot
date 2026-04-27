@echo off
REM ==========================================
REM Learning Path Dashboard - Quick Setup (Batch)
REM ==========================================

echo.
echo ==========================================
echo Learning Path Dashboard - Auto Setup
echo ==========================================
echo.

REM Check Java
echo Checking Java...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java not found. Install Java 17+
    pause
    exit /b 1
)
echo [OK] Java is installed

REM Check Maven
echo Checking Maven...
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Maven not found. Install Maven
    pause
    exit /b 1
)
echo [OK] Maven is installed

REM Check Node.js
echo Checking Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found. Install Node.js 16+
    pause
    exit /b 1
)
echo [OK] Node.js is installed

REM Check npm
echo Checking npm...
npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm not found
    pause
    exit /b 1
)
echo [OK] npm is installed

echo.
echo ==========================================
echo Setup Configuration
echo ==========================================
echo.
echo MySQL Credentials:
echo   Username: root
echo   Password: root  
echo   Database: learning_path_db
echo.
echo OpenAI Configuration:
echo   Key (default): sk-proj-demokey123456789abcdefghijklmnopqrstuvwxyz
echo   Update at: backend/src/main/resources/application.yml
echo.

REM Build Backend
echo.
echo ==========================================
echo Building Backend...
echo ==========================================
cd backend
call mvn clean install -q
if %errorlevel% neq 0 (
    echo ERROR: Backend build failed
    pause
    exit /b 1
)
echo [OK] Backend built successfully

REM Setup Frontend
echo.
echo ==========================================
echo Setting up Frontend...
echo ==========================================
cd ../frontend-chatbot
echo Installing npm dependencies (2-3 minutes)...
call npm install -q
if %errorlevel% neq 0 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)
echo [OK] Frontend setup complete

echo.
echo ==========================================
echo SETUP COMPLETE!
echo ==========================================
echo.
echo NEXT STEPS:
echo.
echo 1) START BACKEND (Open New Terminal):
echo    cd backend
echo    mvn spring-boot:run
echo    Ready at: http://localhost:8080/api
echo.
echo 2) START FRONTEND (Open Another Terminal):
echo    cd frontend-chatbot
echo    npm start
echo    Opens at: http://localhost:3000
echo.
echo 3) TEST:
echo    - Open http://localhost:3000
echo    - Enter Student ID: STU001
echo    - Go to ChatBot tab
echo    - Type: "Show my attendance"
echo    - See AI response!
echo.
echo IMPORTANT:
echo   - Replace demo OpenAI key with your real one
echo   - Get key at: https://platform.openai.com/api-keys
echo   - Edit: backend/src/main/resources/application.yml
echo.
echo ==========================================
echo.
pause
