@echo off
REM ═══════════════════════════════════════════════════════════════
REM 🚀 AUTOMATED REPLIT DEPLOYMENT SETUP
REM ═══════════════════════════════════════════════════════════════

SETLOCAL ENABLEDELAYEDEXPANSION

echo.
echo ╔═════════════════════════════════════════════════════════╗
echo ║  CHATBOT DEPLOYMENT SETUP FOR REPLIT                  ║
echo ║  This script prepares everything for you              ║
echo ╚═════════════════════════════════════════════════════════╝
echo.

REM Step 1: Check if Node.js is installed
echo [1/5] Checking Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo WARNING: Node.js not found on your computer
    echo But you don't need it - Replit has it built-in!
    echo Just upload your files to Replit.
) else (
    echo OK: Node.js found
)

echo.
echo [2/5] Creating deployment package...

REM Create a folder for Replit
if not exist "replit-deploy" mkdir replit-deploy

REM Copy all necessary files
echo   Copying frontend...
if exist "frontend-chatbot\build" (
    xcopy /E /I /Y "frontend-chatbot" "replit-deploy\frontend-chatbot" >nul
    echo   OK: Frontend copied
) else (
    echo   WARNING: frontend-chatbot\build not found
    echo   Run this first:
    echo   cd frontend-chatbot ^&^& npm run build ^&^& cd ..
)

echo   Copying server files...
copy "server.js" "replit-deploy\server.js" >nul
copy ".replit" "replit-deploy\.replit" >nul
echo   OK: Server files copied

echo   Creating package.json...
(
echo {
echo   "name": "chatbot-app",
echo   "version": "1.0.0",
echo   "description": "Student Chatbot Application",
echo   "main": "server.js",
echo   "scripts": {
echo     "start": "node server.js",
echo     "dev": "node server.js"
echo   },
echo   "dependencies": {
echo     "express": "^4.18.2",
echo     "cors": "^2.8.5"
echo   }
echo }
) > "replit-deploy\package.json"
echo   OK: package.json created

echo.
echo [3/5] Creating README for Replit...
(
echo # Student Chatbot
echo.
echo A beautiful interactive chatbot application for students to access:
echo - Personal academic information
echo - Attendance records
echo - Course details
echo - AI-powered Q^&A
echo.
echo ## How to Run
echo.
echo Just click the "Run" button! That's it.
echo.
echo ## Test Authentication
echo.
echo Roll Numbers to try: 2223810-2223889
echo Example: 2223850
echo.
echo ## Features
echo.
echo - Student authentication by roll number
echo - Personal profile and score display
echo - Course information with TA 1 marks
echo - 4 months of attendance data
echo - AI chatbot with Google Gemini
echo - Beautiful interactive UI
echo.
echo Made with ❤️ for learning
) > "replit-deploy\README.md"
echo   OK: README.md created

echo.
echo [4/5] Creating quick commands file...
(
echo REM COPY AND PASTE THESE COMMANDS INTO REPLIT TERMINAL
echo REM.
echo REM When you first run your Replit app, use these commands:
echo REM.
echo npm install
echo npm start
echo.
echo REM That's it! Your app will start running.
echo REM Look for the URL at the top of Replit (https://...repl.co)
) > "replit-deploy\REPLIT_COMMANDS.txt"
echo   OK: Commands file created

echo.
echo [5/5] Preparing upload...

REM Create a ZIP file for easy uploading
echo   Creating compressed package...
cd replit-deploy
powershell -Command "Compress-Archive -Path '*' -DestinationPath '..\chatbot-for-replit.zip' -Force" >nul 2>&1
cd ..

if exist "chatbot-for-replit.zip" (
    echo   OK: Package ready at chatbot-for-replit.zip
) else (
    echo   Note: ZIP not created but files are in replit-deploy\ folder
)

echo.
echo ╔═════════════════════════════════════════════════════════╗
echo ║  SETUP COMPLETE! ✅                                     ║
echo ╚═════════════════════════════════════════════════════════╝
echo.

echo YOUR FILES ARE READY IN: replit-deploy\
echo.
echo NEXT STEPS (Super Simple):
echo.
echo 1. Go to https://replit.com
echo 2. Click "Sign Up" (FREE - no credit card!)
echo 3. Click "Create Repl"
echo 4. Choose Template: "Node.js"
echo 5. Name it: "chatbot-app"
echo 6. Drag these folders INTO Replit:
echo    - replit-deploy\frontend-chatbot
echo    - replit-deploy\server.js
echo    - replit-deploy\package.json
echo 7. Click "Run" button
echo 8. Wait 1-2 minutes
echo 9. Your chatbot is LIVE at the URL shown!
echo.
echo THAT'S IT! No complicated setup needed! 🎉
echo.
echo Test Credentials:
echo   Roll Number: 2223850 (or any 2223810-2223889)
echo.
echo ═════════════════════════════════════════════════════════
echo Questions? Read: START_REPLIT_DEPLOYMENT.txt
echo ═════════════════════════════════════════════════════════
echo.

pause
