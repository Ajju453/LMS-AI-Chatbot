# ═══════════════════════════════════════════════════════════════
# 🚀 START CHATBOT LOCALLY - ONE CLICK!
# ═══════════════════════════════════════════════════════════════

Write-Host ""
Write-Host "╔═════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  CHATBOT LOCAL SERVER - Starting...                    ║" -ForegroundColor Cyan
Write-Host "╚═════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if backend JAR exists
if (-not (Test-Path "backend\target\git-vscode-hub-1.0.0.jar.original")) {
    Write-Host "ERROR: Backend JAR not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Build backend first:" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor Yellow
    Write-Host "  mvn clean install -DskipTests" -ForegroundColor Yellow
    Write-Host "  cd .." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if frontend build exists
if (-not (Test-Path "frontend-chatbot\build")) {
    Write-Host "WARNING: Frontend build not found" -ForegroundColor Yellow
    Write-Host "Building frontend..." -ForegroundColor Yellow
    Set-Location "frontend-chatbot"
    npm run build
    Set-Location ".."
}

Write-Host ""
Write-Host "[1/2] Starting Backend on port 8080..." -ForegroundColor Green
Write-Host "      (Keep the window open!)" -ForegroundColor Gray
Write-Host ""

# Start backend in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$PWD\backend'; java -jar target/git-vscode-hub-1.0.0.jar.original`"" -WindowStyle Normal

# Wait for backend to start
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "[2/2] Starting Frontend on port 3000..." -ForegroundColor Green
Write-Host "      (Keep the window open!)" -ForegroundColor Gray
Write-Host ""

# Start frontend in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$PWD\frontend-chatbot'; npm start`"" -WindowStyle Normal

Write-Host ""
Write-Host "╔═════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  CHATBOT IS STARTING!                                  ║" -ForegroundColor Cyan
Write-Host "╚═════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host ""
Write-Host "WAIT 30-60 SECONDS for both windows to fully load..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Then open your browser and go to:" -ForegroundColor Green
Write-Host ""
Write-Host "    http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "SHARE THIS URL WITH YOUR MENTOR!" -ForegroundColor Green
Write-Host ""
Write-Host "Test with roll number: 2223850" -ForegroundColor Yellow
Write-Host "(or any number from 2223810-2223889)" -ForegroundColor Gray
Write-Host ""
Write-Host "To stop: Close both terminal windows" -ForegroundColor Gray
Write-Host ""

Read-Host "Press Enter to exit this window (backend/frontend will keep running)"
