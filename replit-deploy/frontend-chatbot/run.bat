@echo off
REM Simplest possible launcher - just run the app!
cd /d "%~dp0"
taskkill /F /IM node.exe >nul 2>&1
npm start
