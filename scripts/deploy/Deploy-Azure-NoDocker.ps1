#=============================================================================
# DEPLOY TO AZURE WITHOUT DOCKER (Azure CLI Only)
#=============================================================================
# This script deploys your chatbot to Azure using:
# - Azure App Service (Backend - Spring Boot JAR)
# - Azure Static Web Apps (Frontend - React)
# - NO Docker required!
#=============================================================================

# Colors
$Green = 'Green'
$Cyan = 'Cyan'
$Yellow = 'Yellow'
$Red = 'Red'

function Write-Header {
    param([string]$text)
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor $Cyan
    Write-Host "  $text" -ForegroundColor $Cyan
    Write-Host "============================================================" -ForegroundColor $Cyan
    Write-Host ""
}

function Write-Step {
    param([string]$step, [string]$text)
    Write-Host "[$step] $text" -ForegroundColor $Green
}

function Write-Error-Message {
    param([string]$text)
    Write-Host "[ERROR] $text" -ForegroundColor $Red
}

function Write-Success {
    param([string]$text)
    Write-Host "[OK] $text" -ForegroundColor $Green
}

# Start
Write-Header "CHATBOT DEPLOYMENT TO AZURE (NO DOCKER)"

#=============================================================================
# STEP 1: Verify Prerequisites
#=============================================================================
Write-Step "1/6" "Checking prerequisites..."

# Check Azure CLI
az --version | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Error-Message "Azure CLI not installed"
    Write-Host "Download from: https://docs.microsoft.com/cli/azure/install-azure-cli" -ForegroundColor $Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Success "Azure CLI found"

# Check frontend build
if (-not (Test-Path "frontend-chatbot\build")) {
    Write-Error-Message "Frontend build not found at frontend-chatbot/build"
    Write-Host "Run: cd frontend-chatbot && npm install && npm run build && cd .." -ForegroundColor $Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Success "Frontend build found"

# Check backend JAR
if (-not (Test-Path "backend\target\git-vscode-hub-1.0.0.jar.original")) {
    Write-Error-Message "Backend JAR not found"
    Write-Host "Run: cd backend && mvn clean install -DskipTests && cd .." -ForegroundColor $Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Success "Backend JAR found"

#=============================================================================
# STEP 2: Get User Input
#=============================================================================
Write-Step "2/6" "Collecting configuration..."
Write-Host ""

$resourceGroup = Read-Host "Enter Resource Group name (e.g. chatbot-rg)"
$location = Read-Host "Enter Azure location (e.g. eastus, westus, southcentralus)"
$backendAppName = Read-Host "Enter Backend App name (e.g. chatbot-backend-app)"
$frontendAppName = Read-Host "Enter Frontend App name (e.g. chatbot-frontend-app)"

Write-Host ""
Write-Host "Configuration Summary:" -ForegroundColor $Cyan
Write-Host "  Resource Group: $resourceGroup"
Write-Host "  Location: $location"
Write-Host "  Backend App: $backendAppName"
Write-Host "  Frontend App: $frontendAppName"
Write-Host ""

$confirm = Read-Host "Continue with deployment? (Y/N)"
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Deployment cancelled." -ForegroundColor $Yellow
    exit 0
}

#=============================================================================
# STEP 3: Create Azure Resources
#=============================================================================
Write-Step "3/6" "Creating Azure resources (this may take 5 minutes)..."

# Create resource group
Write-Host "  Creating resource group: $resourceGroup..."
az group create `
    --name $resourceGroup `
    --location $location | Out-Null

# Create App Service Plan for Backend
Write-Host "  Creating backend App Service plan..."
az appservice plan create `
    --name "$backendAppName-plan" `
    --resource-group $resourceGroup `
    --sku "B1" `
    --is-linux | Out-Null

# Create Web App for Backend
Write-Host "  Creating backend web app..."
az webapp create `
    --resource-group $resourceGroup `
    --plan "$backendAppName-plan" `
    --name $backendAppName `
    --runtime "JAVA|11-java11" | Out-Null

# Create App Service Plan for Frontend
Write-Host "  Creating frontend App Service plan..."
az appservice plan create `
    --name "$frontendAppName-plan" `
    --resource-group $resourceGroup `
    --sku "B1" | Out-Null

# Create Web App for Frontend
Write-Host "  Creating frontend web app..."
az webapp create `
    --resource-group $resourceGroup `
    --plan "$frontendAppName-plan" `
    --name $frontendAppName | Out-Null

Write-Success "Azure resources created"

#=============================================================================
# STEP 4: Deploy Backend
#=============================================================================
Write-Step "4/6" "Deploying backend application..."

Write-Host "  Preparing JAR file..."
Copy-Item "backend\target\git-vscode-hub-1.0.0.jar.original" -Destination "backend\target\app.jar" -Force

Write-Host "  Uploading to Azure..."
az webapp deployment source config-zip `
    --resource-group $resourceGroup `
    --name $backendAppName `
    --src "backend\target\app.jar" | Out-Null

Write-Host "  Configuring backend..."
az webapp config appsettings set `
    --resource-group $resourceGroup `
    --name $backendAppName `
    --settings "WEBSITES_PORT=8080" | Out-Null

Write-Success "Backend deployed"

Write-Host ""
Write-Host "Waiting for backend to start (120 seconds)..." -ForegroundColor $Yellow
for ($i = 120; $i -gt 0; $i--) {
    Write-Host -NoNewline "`rTime remaining: ${i}s  "
    Start-Sleep -Seconds 1
}
Write-Host ""

# Get backend URL
Write-Host "Getting backend URL..."
$backendUrl = az webapp show `
    --resource-group $resourceGroup `
    --name $backendAppName `
    --query "defaultHostName" `
    --output tsv

Write-Host "  Backend URL: https://$backendUrl" -ForegroundColor $Cyan

#=============================================================================
# STEP 5: Deploy Frontend
#=============================================================================
Write-Step "5/6" "Deploying frontend application..."

# Create web.config for React routing
Write-Host "  Creating web.config for React routing..."
$webConfig = @'
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url="^(?!.*\.js(?:\.map)?$|.*\.css(?:\.map)?$|.*\.woff(?:2)?$|.*\.ttf$|.*\.eot$|.*\.svg$|.*\.gif$|.*\.jpe?g$|.*\.png$|.*\.ico$|.*\.webmanifest$).*$" />
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <mimeMap fileExtension=".json" mimeType="application/json" />
    </staticContent>
  </system.webServer>
</configuration>
'@

Set-Content -Path "frontend-chatbot\build\web.config" -Value $webConfig

Write-Host "  Creating deployment package..."
$zipPath = "frontend-build.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path "frontend-chatbot\build\*" -DestinationPath $zipPath -Force

Write-Host "  Uploading to Azure..."
az webapp deployment source config-zip `
    --resource-group $resourceGroup `
    --name $frontendAppName `
    --src $zipPath | Out-Null

Write-Host "  Configuring frontend..."
az webapp config appsettings set `
    --resource-group $resourceGroup `
    --name $frontendAppName `
    --settings "REACT_APP_API_URL=https://$backendUrl/api" | Out-Null

Write-Success "Frontend deployed"

# Clean up ZIP
Remove-Item $zipPath -Force

#=============================================================================
# STEP 6: Get Results
#=============================================================================
Write-Step "6/6" "Finalizing deployment..."

$frontendUrl = az webapp show `
    --resource-group $resourceGroup `
    --name $frontendAppName `
    --query "defaultHostName" `
    --output tsv

Write-Header "DEPLOYMENT COMPLETE!"

Write-Host "Your chatbot is now live on Azure!" -ForegroundColor $Green
Write-Host ""
Write-Host "FRONTEND (React Chatbot):" -ForegroundColor $Cyan
Write-Host "   https://$frontendUrl" -ForegroundColor $Yellow
Write-Host ""
Write-Host "BACKEND API:" -ForegroundColor $Cyan
Write-Host "   https://$backendUrl/api" -ForegroundColor $Yellow
Write-Host ""
Write-Host "TEST AUTHENTICATION:" -ForegroundColor $Cyan
Write-Host "   Roll Numbers: 2223810 - 2223889" -ForegroundColor $Yellow
Write-Host "   Example: 2223850" -ForegroundColor $Yellow
Write-Host ""
Write-Host "COST:" -ForegroundColor $Cyan
Write-Host "   FREE - B1 App Service tier (750 hours/month)" -ForegroundColor $Yellow
Write-Host ""
Write-Host "USEFUL COMMANDS:" -ForegroundColor $Cyan
Write-Host "   View logs: az webapp log tail --resource-group $resourceGroup --name $backendAppName"
Write-Host "   Stop app: az webapp stop --resource-group $resourceGroup --name $backendAppName"
Write-Host "   Delete all: az group delete --name $resourceGroup --yes"
Write-Host ""
Write-Host "Apps warming up... (takes 1-2 minutes for first request)" -ForegroundColor $Yellow
Write-Host ""

# Save credentials to file
$credFile = "deployment-urls.txt"
$info = @"
============================================================
CHATBOT DEPLOYMENT INFO
============================================================
Generated: $(Get-Date)

FRONTEND URL:
https://$frontendUrl

BACKEND URL:
https://$backendUrl/api

RESOURCE GROUP:
$resourceGroup

RESOURCE NAMES:
- Backend App: $backendAppName
- Frontend App: $frontendAppName

TEST CREDENTIALS:
Roll Numbers: 2223810 - 2223889
Example: 2223850

COST:
FREE - Azure B1 tier (750 hrs/month per app)

CLEANUP (stops all resources):
az group delete --name $resourceGroup --yes

============================================================
"@

Set-Content -Path $credFile -Value $info

Write-Success "Configuration saved to: $credFile"
Write-Host ""
Read-Host "Press Enter to exit"
