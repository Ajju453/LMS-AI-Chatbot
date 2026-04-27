@echo off
REM ═══════════════════════════════════════════════════════════════
REM 🚀 DEPLOY TO AZURE WITHOUT DOCKER (Azure CLI Only)
REM ═══════════════════════════════════════════════════════════════

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║ CHATBOT DEPLOYMENT TO AZURE (NO DOCKER)                  ║
echo ║ Using only Azure CLI - No Docker required!               ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM ═══════════════════════════════════════════════════════════════
REM STEP 1: Check Prerequisites
REM ═══════════════════════════════════════════════════════════════
echo [1/6] Checking prerequisites...

echo   Checking Azure CLI...
az --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Azure CLI NOT installed!
    echo.
    echo Download from: https://docs.microsoft.com/cli/azure/install-azure-cli
    pause
    exit /b 1
)
echo   ✅ Azure CLI found

echo   Checking Maven...
mvn --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo   ⚠️  Maven not found (but may still work if you have Java)
)

echo   Checking frontend build...
if not exist "frontend-chatbot\build" (
    echo.
    echo ❌ Frontend build not found!
    echo.
    echo Run this first:
    echo   cd frontend-chatbot
    echo   npm install
    echo   npm run build
    echo   cd ..
    pause
    exit /b 1
)
echo   ✅ Frontend build found

echo   Checking backend JAR...
if not exist "backend\target\git-vscode-hub-1.0.0.jar.original" (
    echo.
    echo ❌ Backend JAR not found!
    echo.
    echo Run this first:
    echo   cd backend
    echo   mvn clean install -DskipTests
    echo   cd ..
    pause
    exit /b 1
)
echo   ✅ Backend JAR found

REM ═══════════════════════════════════════════════════════════════
REM STEP 2: Get User Input
REM ═══════════════════════════════════════════════════════════════
echo.
echo [2/6] Configuration...
echo.
echo ═══════════════════════════════════════════════════════════
set /p resourceGroup="Resource Group name (e.g. chatbot-rg): "
set /p location="Azure location (e.g. eastus, westus, southcentralus): "
set /p backendAppName="Backend App name (e.g. chatbot-backend-app): "
set /p frontendAppName="Frontend App name (e.g. chatbot-frontend-app): "

echo.
echo Configuration Summary:
echo   Resource Group: %resourceGroup%
echo   Location: %location%
echo   Backend App: %backendAppName%
echo   Frontend App: %frontendAppName%
echo.
set /p confirm="Continue? (Y/N): "
if /i not "%confirm%"=="y" (
    echo Deployment cancelled.
    exit /b 0
)

REM ═══════════════════════════════════════════════════════════════
REM STEP 3: Create Azure Resources
REM ═══════════════════════════════════════════════════════════════
echo.
echo [3/6] Creating Azure resources...
echo   This may take 3-5 minutes...
echo.

echo   Creating resource group...
call az group create --name %resourceGroup% --location %location% >nul 2>&1

echo   Creating backend app service plan...
call az appservice plan create --name %backendAppName%-plan --resource-group %resourceGroup% --sku B1 --is-linux >nul 2>&1

echo   Creating backend web app...
call az webapp create --resource-group %resourceGroup% --plan %backendAppName%-plan --name %backendAppName% --runtime "JAVA|11-java11" >nul 2>&1

echo   Creating frontend app service plan...
call az appservice plan create --name %frontendAppName%-plan --resource-group %resourceGroup% --sku B1 >nul 2>&1

echo   Creating frontend web app...
call az webapp create --resource-group %resourceGroup% --plan %frontendAppName%-plan --name %frontendAppName% --runtime "NODE|18-lts" >nul 2>&1

echo ✅ Azure resources created

REM ═══════════════════════════════════════════════════════════════
REM STEP 4: Deploy Backend
REM ═══════════════════════════════════════════════════════════════
echo.
echo [4/6] Deploying backend...

echo   Preparing JAR file...
copy "backend\target\git-vscode-hub-1.0.0.jar.original" "backend\target\app.jar" >nul

echo   Uploading to Azure...
call az webapp deployment source config-zip --resource-group %resourceGroup% --name %backendAppName% --src "backend\target\app.jar" >nul 2>&1

echo   Configuring backend...
call az webapp config appsettings set --resource-group %resourceGroup% --name %backendAppName% --settings JAVA_OPTS="-Dserver.port=80" WEBSITES_PORT=8080 >nul 2>&1

echo ✅ Backend deployed
echo.
echo ⏳ Waiting for backend to start (2 minutes)...
timeout /t 120 /nobreak

REM Get backend URL
for /f "tokens=*" %%i in ('az webapp show --resource-group %resourceGroup% --name %backendAppName% --query defaultHostName -o tsv') do set BACKEND_URL=%%i

REM ═══════════════════════════════════════════════════════════════
REM STEP 5: Deploy Frontend
REM ═══════════════════════════════════════════════════════════════
echo.
echo [5/6] Deploying frontend...

echo   Creating web.config for React routing...
(
echo ^<?xml version="1.0" encoding="utf-8"?^>
echo ^<configuration^>
echo   ^<system.webServer^>
echo     ^<rewrite^>
echo       ^<rules^>
echo         ^<rule name="React Routes" stopProcessing="true"^>
echo           ^<match url="^(.*^)" /^>
echo           ^<conditions^>
echo             ^<add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" /^>
echo             ^<add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" /^>
echo           ^</conditions^>
echo           ^<action type="Rewrite" url="/index.html" /^>
echo         ^</rule^>
echo       ^</rules^>
echo     ^</rewrite^>
echo   ^</system.webServer^>
echo ^</configuration^>
) > frontend-chatbot\build\web.config

echo   Creating deployment package...
cd frontend-chatbot\build
powershell -Command "Compress-Archive -Path '*' -DestinationPath '..\..\frontend-build.zip' -Force" >nul 2>&1
cd ..\..

echo   Uploading to Azure...
call az webapp deployment source config-zip --resource-group %resourceGroup% --name %frontendAppName% --src "frontend-build.zip" >nul 2>&1

echo   Configuring frontend...
call az webapp config appsettings set --resource-group %resourceGroup% --name %frontendAppName% --settings REACT_APP_API_URL="https://%BACKEND_URL%/api" >nul 2>&1

echo ✅ Frontend deployed

REM ═══════════════════════════════════════════════════════════════
REM STEP 6: Get Results
REM ═══════════════════════════════════════════════════════════════
echo.
echo [6/6] Getting URLs...

for /f "tokens=*" %%i in ('az webapp show --resource-group %resourceGroup% --name %frontendAppName% --query defaultHostName -o tsv') do set FRONTEND_URL=%%i

cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║      🎉 DEPLOYMENT COMPLETE! 🎉                         ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📱 FRONTEND (React Chatbot):
echo    https://%FRONTEND_URL%
echo.
echo 📊 BACKEND API:
echo    https://%BACKEND_URL%/api
echo.
echo 🔍 TEST AUTHENTICATION:
echo    Roll Numbers: 2223810 - 2223889
echo    Example: 2223850
echo.
echo 💰 COST:
echo    FREE - B1 tier (up to 750 hours/month per app)
echo.
echo 📌 USEFUL COMMANDS:
echo    View backend logs:
echo      az webapp log tail --resource-group %resourceGroup% --name %backendAppName%
echo.
echo    View frontend logs:
echo      az webapp log tail --resource-group %resourceGroup% --name %frontendAppName%
echo.
echo    Delete everything (STOP billing):
echo      az group delete --name %resourceGroup% --yes
echo.
echo ⏱️  Apps warming up... (takes 1-2 minutes for first request)
echo.

REM Save to file
(
echo ═════════════════════════════════════════════════════════════
echo CHATBOT DEPLOYMENT INFO
echo ═════════════════════════════════════════════════════════════
echo.
echo FRONTEND URL:
echo https://%FRONTEND_URL%
echo.
echo BACKEND URL:
echo https://%BACKEND_URL%/api
echo.
echo RESOURCE GROUP:
echo %resourceGroup%
echo.
echo COST:
echo FREE - Azure B1 tier
echo.
echo DELETE RESOURCES ^(STOP BILLING^):
echo az group delete --name %resourceGroup% --yes
echo.
echo ═════════════════════════════════════════════════════════════
) > azure-deployment-info.txt

echo ✅ Configuration saved to: azure-deployment-info.txt
echo.
pause
