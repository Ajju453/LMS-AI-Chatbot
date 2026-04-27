@echo off
setlocal enabledelayedexpansion

echo.
echo ====================================
echo   Teacher Portal Application Startup
echo ====================================
echo.

REM Get the directory where this script is located
set SCRIPT_DIR=%~dp0

REM Check if required files exist
if not exist "%SCRIPT_DIR%backend\target\git-vscode-hub-1.0.0.jar" (
    echo Error: Backend jar file not found!
    echo Please run: mvn clean package -DskipTests in the backend directory
    pause
    exit /b 1
)

if not exist "%SCRIPT_DIR%frontend-chatbot\build\index.html" (
    echo Error: Frontend build directory not found!
    echo Please run: npm run build in the frontend-chatbot directory
    pause
    exit /b 1
)

echo.
echo Starting Backend Server (Port 8080)...
echo.

REM Start backend in a new window
start "Backend - Learning Path Server" cmd /k "cd /d "%SCRIPT_DIR%backend" && java -jar target/git-vscode-hub-1.0.0.jar"

REM Wait for backend to start
timeout /t 8 /nobreak

echo.
echo Starting Frontend Server (Port 3000)...
echo.

REM Start frontend in a new window
start "Frontend - Teacher Portal" cmd /k "cd /d "%SCRIPT_DIR%frontend-chatbot" && npm start"

REM Wait for frontend to start
timeout /t 5 /nobreak

echo.
echo ====================================
echo   Application Started Successfully!
echo ====================================
echo.
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:8080
echo.
echo Teacher Portal Features:
echo   - Click "Teacher Portal" button in student page
echo   - Select any teacher (e.g., Dr. Rajesh Kumar)
echo   - Use password: teacher123
echo.
echo Dashboard Features:
echo   - View all students and their academic status
echo   - Check attendance records
echo   - View grades and marks
echo   - Identify backlog students
echo   - Check subject enrollment statistics
echo   - View semester curriculum
echo.
echo To stop the application:
echo   1. Close the Backend window
echo   2. Close the Frontend window
echo   3. Or press Ctrl+C in each window
echo.
echo For detailed guide, see: TEACHER_PORTAL_GUIDE.md
echo.
pause
