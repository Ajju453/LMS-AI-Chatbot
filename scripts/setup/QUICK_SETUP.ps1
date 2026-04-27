# ==========================================
# Learning Path Dashboard - Quick Setup
# ==========================================
# This script sets up the MySQL database and starts both backend and frontend

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "Learning Path Dashboard - Auto Setup" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Check Prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
$java = java -version 2>&1
$mvn = mvn -version 2>&1
$node = node -v 2>&1
$npm = npm -v 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Java installed: $(($java | Select-Object -Index 0))" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Java not found. Please install Java 17+" -ForegroundColor Red
    exit 1
}

if ($mvn -like "*Apache Maven*") {
    Write-Host "[OK] Maven installed: $(($mvn | Select-Object -Index 0))" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Maven not found. Please install Maven" -ForegroundColor Red
    exit 1
}

if ($node -match "v(\d+)") {
    Write-Host "[OK] Node.js installed: $node" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Node.js not found. Please install Node.js 16+" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] npm installed: $npm" -ForegroundColor Green
Write-Host ""

# Check MySQL
Write-Host "Checking MySQL..." -ForegroundColor Yellow
$mysqlCheck = mysql -u root -e "SELECT 1" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] MySQL is running" -ForegroundColor Green
    
    # Create database
    Write-Host "Creating database..." -ForegroundColor Yellow
    mysql -u root -e @"
CREATE DATABASE IF NOT EXISTS learning_path_db;
USE learning_path_db;
SHOW TABLES;
"@
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Database created successfully" -ForegroundColor Green
    }
} else {
    Write-Host "[WARNING] MySQL not running. Please start MySQL first:" -ForegroundColor Yellow
    Write-Host "  Windows: Search for MySQL and start the service" -ForegroundColor Yellow
    Write-Host "  Or: mysql.server start (if using Homebrew)" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter after MySQL is running"
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "Setup Details" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Database Credentials:" -ForegroundColor Green
Write-Host "  Username: root" -ForegroundColor White
Write-Host "  Password: root" -ForegroundColor White
Write-Host "  Database: learning_path_db" -ForegroundColor White
Write-Host "  URL: jdbc:mysql://localhost:3306/learning_path_db" -ForegroundColor White
Write-Host ""
Write-Host "OpenAI Configuration:" -ForegroundColor Green
Write-Host "  Current Key: sk-proj-demokey123456789abcdefghijklmnopqrstuvwxyz" -ForegroundColor Yellow
Write-Host "  Update at: backend/src/main/resources/application.yml" -ForegroundColor White
Write-Host "  Get your key: https://platform.openai.com/api-keys" -ForegroundColor Cyan
Write-Host ""

# Build Backend
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "Building Backend..." -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
cd backend
mvn clean install -q

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Backend built successfully" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Build failed. Check errors above" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "Frontend Setup..." -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

cd ../frontend-chatbot
Write-Host "Installing dependencies (this may take 2-3 minutes)..." -ForegroundColor Yellow
npm install -q

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "[ERROR] npm install failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "[OK] SETUP COMPLETE!" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📌 NEXT STEPS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  START BACKEND (Terminal 1):" -ForegroundColor Yellow
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   mvn spring-boot:run" -ForegroundColor White
Write-Host "   Backend will be ready at: http://localhost:8080/api" -ForegroundColor Green
Write-Host ""
Write-Host "2️⃣  START FRONTEND (Terminal 2):" -ForegroundColor Yellow
Write-Host "   cd frontend-chatbot" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor White
Write-Host "   Frontend will open at: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "3️⃣  TEST THE APPLICATION:" -ForegroundColor Yellow
Write-Host "   - Open browser to http://localhost:3000" -ForegroundColor White
Write-Host "   - Enter any Student ID (e.g., STU001)" -ForegroundColor White
Write-Host "   - Go to ChatBot tab" -ForegroundColor White
Write-Host "   - Type: 'Show my attendance'" -ForegroundColor White
Write-Host "   - See AI-powered response!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 IMPORTANT:" -ForegroundColor Cyan
Write-Host "   [WARNING] The OpenAI API key is a demo key. Replace it with your own:" -ForegroundColor Yellow
Write-Host "   - Get your key: https://platform.openai.com/api-keys" -ForegroundColor White
Write-Host "   - Edit: backend/src/main/resources/application.yml" -ForegroundColor White
Write-Host "   - Replace openai.api.key value with your real key" -ForegroundColor White
Write-Host ""
Write-Host "🐞 TROUBLESHOOTING:" -ForegroundColor Cyan
Write-Host "   Port 8080 in use?" -ForegroundColor Yellow
Write-Host "     netstat -ano | findstr :8080" -ForegroundColor White
Write-Host "     taskkill /PID [PID] /F" -ForegroundColor White
Write-Host ""
Write-Host "   MySQL not found?" -ForegroundColor Yellow
Write-Host "     Start MySQL service from Services (Windows)" -ForegroundColor White
Write-Host ""
Write-Host "   CORS Error?" -ForegroundColor Yellow
Write-Host "     Make sure backend is running before starting frontend" -ForegroundColor White
Write-Host ""
Write-Host "===========================================" -ForegroundColor Green
Write-Host "Happy Learning!" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host ""
