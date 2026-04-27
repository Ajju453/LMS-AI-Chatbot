@echo off
REM ═══════════════════════════════════════════════════════════════
REM 🚀 QUICK DEPLOYMENT SCRIPT (SIMPLIFIED)
REM ═══════════════════════════════════════════════════════════════

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     CHATBOT DEPLOYMENT TO AZURE (AUTOMATED)               ║
echo ║              Follow the prompts below                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if Docker is installed
echo Checking for Docker...
docker --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Docker is NOT installed!
    echo.
    echo 📥 Download Docker Desktop from:
    echo    https://www.docker.com/products/docker-desktop
    echo.
    echo After installing Docker, run this script again.
    pause
    exit /b 1
)
echo ✅ Docker found

REM Check if Azure CLI is installed
echo Checking for Azure CLI...
az --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Azure CLI is NOT installed!
    echo.
    echo 📥 Download Azure CLI from:
    echo    https://docs.microsoft.com/cli/azure/install-azure-cli
    echo.
    echo After installing Azure CLI, run this script again.
    pause
    exit /b 1
)
echo ✅ Azure CLI found

REM Get user inputs
echo.
echo ═══════════════════════════════════════════════════════════
echo              ENTER YOUR INFORMATION
echo ═══════════════════════════════════════════════════════════
echo.

set /p DOCKER_USER="Docker Hub username: "
set /p DOCKER_PASS="Docker Hub password: "
set /p AZURE_RG="Azure Resource Group (e.g., chatbot-rg): "
set /p AZURE_LOC="Azure location (e.g., eastus): "

echo.
echo ✅ Information gathered. Starting deployment...
echo.

REM Create working directory
cd /d "%~dp0"

REM Step 1: Login to Docker
echo.
echo [1/5] Logging into Docker Hub...
docker login -u %DOCKER_USER% -p %DOCKER_PASS%

REM Step 2: Build and push backend
echo.
echo [2/5] Building backend image...
cd backend
docker build -t %DOCKER_USER%/chatbot-backend:latest .
docker push %DOCKER_USER%/chatbot-backend:latest
cd ..

REM Step 3: Build and push frontend
echo.
echo [3/5] Building frontend image...
cd frontend-chatbot
docker build -t %DOCKER_USER%/chatbot-frontend:latest .
docker push %DOCKER_USER%/chatbot-frontend:latest
cd ..

REM Step 4: Login to Azure
echo.
echo [4/5] Authenticating with Azure (browser will open)...
timeout /t 2
az login

REM Step 5: Create resources
echo.
echo [5/5] Creating Azure resources...
echo.

echo Creating resource group: %AZURE_RG%
az group create --name %AZURE_RG% --location %AZURE_LOC%

echo.
echo Deploying backend container (this may take 2-3 minutes)...
az container create ^
    --resource-group %AZURE_RG% ^
    --name chatbot-backend ^
    --image %DOCKER_USER%/chatbot-backend:latest ^
    --cpu 1 ^
    --memory 1 ^
    --port 8080 ^
    --protocol TCP

echo.
echo Waiting for backend to start...
timeout /t 30

echo.
echo Getting backend IP address...
for /f "tokens=*" %%i in ('az container show --resource-group %AZURE_RG% --name chatbot-backend --query ipAddress.ip -o tsv') do set BACKEND_IP=%%i

echo Backend IP: %BACKEND_IP%

echo.
echo Deploying frontend container (this may take 2-3 minutes)...
az container create ^
    --resource-group %AZURE_RG% ^
    --name chatbot-frontend ^
    --image %DOCKER_USER%/chatbot-frontend:latest ^
    --cpu 1 ^
    --memory 1 ^
    --port 3000 ^
    --protocol TCP ^
    --environment-variables ^
        REACT_APP_API_URL="http://%BACKEND_IP%:8080/api"

echo.
echo Waiting for frontend to start...
timeout /t 30

echo.
echo Getting frontend IP address...
for /f "tokens=*" %%i in ('az container show --resource-group %AZURE_RG% --name chatbot-frontend --query ipAddress.ip -o tsv') do set FRONTEND_IP=%%i

REM Display results
cls
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║         🎉 YOUR CHATBOT IS LIVE ON AZURE! 🎉            ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo 📱 ACCESS YOUR APP:
echo    http://%FRONTEND_IP%:3000
echo.
echo 📊 BACKEND API:
echo    http://%BACKEND_IP%:8080/api
echo.
echo 💰 COST: $0 (FREE TIER)
echo    50 ACU hours/month included
echo.
echo 🔍 TEST AUTHENTICATION:
echo    Roll Number: 2223850
echo.
echo 📌 USEFUL COMMANDS:
echo    View logs: az container logs --resource-group %AZURE_RG% --name chatbot-backend
echo    Stop backend: az container stop --resource-group %AZURE_RG% --name chatbot-backend
echo    Delete all: az group delete --name %AZURE_RG% --yes
echo.
echo Save the URL above and share it with anyone!
echo.
pause
