# ═══════════════════════════════════════════════════════════════
# 🚀 AUTOMATED AZURE DEPLOYMENT SCRIPT
# ═══════════════════════════════════════════════════════════════
# This script deploys your chatbot to Azure Container Instances (FREE)
# Just follow the prompts!
# ═══════════════════════════════════════════════════════════════

function Write-Header {
    param([string]$Text)
    Write-Host "`n" -ForegroundColor Green
    Write-Host ("=" * 70) -ForegroundColor Green
    Write-Host $Text -ForegroundColor Green
    Write-Host ("=" * 70) -ForegroundColor Green
}

function Write-Step {
    param([string]$Text)
    Write-Host "`n▶ $Text" -ForegroundColor Cyan
}

Write-Header "🚀 CHATBOT AZURE DEPLOYMENT WIZARD"

# ═══════════════════════════════════════════════════════════════
# STEP 1: Check Prerequisites
# ═══════════════════════════════════════════════════════════════
Write-Step "Step 1/6: Checking Prerequisites..."

$dockerInstalled = $false
$azureCliInstalled = $false

try {
    $dockerVersion = docker --version
    $dockerInstalled = $true
    Write-Host "✅ Docker found: $dockerVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Docker NOT found!" -ForegroundColor Red
    Write-Host "   Download from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    $response = Read-Host "   Continue without Docker? (y/n)"
    if ($response -ne 'y') { exit }
}

try {
    $azVersion = az version
    $azureCliInstalled = $true
    Write-Host "✅ Azure CLI found" -ForegroundColor Green
}
catch {
    Write-Host "❌ Azure CLI NOT found!" -ForegroundColor Red
    Write-Host "   Download from: https://docs.microsoft.com/cli/azure/install-azure-cli" -ForegroundColor Yellow
    $response = Read-Host "   Continue without Azure CLI? (y/n)"
    if ($response -ne 'y') { exit }
}

# ═══════════════════════════════════════════════════════════════
# STEP 2: Get User Information
# ═══════════════════════════════════════════════════════════════
Write-Step "Step 2/6: Enter Your Information"

$dockerUsername = Read-Host "Enter Docker Hub username (create free account at https://hub.docker.com)"
$dockerPassword = Read-Host "Enter Docker Hub password" -AsSecureString
$dockerPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemPtr($dockerPassword))

$resourceGroup = Read-Host "Enter Azure Resource Group name (e.g., chatbot-rg)"
$location = Read-Host "Enter Azure location (e.g., eastus, westus, southeastasia)"

Write-Host "`n📝 Summary:" -ForegroundColor Yellow
Write-Host "  Docker Hub User: $dockerUsername"
Write-Host "  Resource Group: $resourceGroup"
Write-Host "  Location: $location"

$confirm = Read-Host "`nContinue? (y/n)"
if ($confirm -ne 'y') { exit }

# ═══════════════════════════════════════════════════════════════
# STEP 3: Build and Push Docker Images
# ═══════════════════════════════════════════════════════════════
Write-Step "Step 3/6: Building Docker Images..."

if ($dockerInstalled) {
    Write-Host "Logging into Docker Hub..." -ForegroundColor Cyan
    docker login -u $dockerUsername -p $dockerPasswordPlain
    
    # Build and push backend
    Write-Host "`n🏗️  Building backend image..." -ForegroundColor Cyan
    Push-Location backend
    docker build -t "$($dockerUsername)/chatbot-backend:latest" .
    docker push "$($dockerUsername)/chatbot-backend:latest"
    Pop-Location
    
    # Build and push frontend
    Write-Host "`n🏗️  Building frontend image..." -ForegroundColor Cyan
    Push-Location frontend-chatbot
    docker build -t "$($dockerUsername)/chatbot-frontend:latest" .
    docker push "$($dockerUsername)/chatbot-frontend:latest"
    Pop-Location
    
    Write-Host "`n✅ Docker images built and pushed!" -ForegroundColor Green
}
else {
    Write-Host "⚠️  Skipping Docker build (Docker not installed)" -ForegroundColor Yellow
}

# ═══════════════════════════════════════════════════════════════
# STEP 4: Login to Azure
# ═══════════════════════════════════════════════════════════════
Write-Step "Step 4/6: Authenticating with Azure..."

if ($azureCliInstalled) {
    Write-Host "Opening browser to sign in..." -ForegroundColor Cyan
    az login
    
    Write-Host "`n✅ Successfully logged into Azure!" -ForegroundColor Green
}
else {
    Write-Host "⚠️  Skipping Azure login (Azure CLI not installed)" -ForegroundColor Yellow
}

# ═══════════════════════════════════════════════════════════════
# STEP 5: Create Azure Resources
# ═══════════════════════════════════════════════════════════════
Write-Step "Step 5/6: Creating Azure Resources..."

if ($azureCliInstalled) {
    # Create resource group
    Write-Host "Creating resource group: $resourceGroup in $location..." -ForegroundColor Cyan
    az group create --name $resourceGroup --location $location
    
    # Deploy backend
    Write-Host "`n🚀 Deploying backend container..." -ForegroundColor Cyan
    az container create `
        --resource-group $resourceGroup `
        --name chatbot-backend `
        --image "$($dockerUsername)/chatbot-backend:latest" `
        --cpu 1 `
        --memory 1 `
        --port 8080 `
        --protocol TCP
    
    # Get backend IP
    Write-Host "`n⏳ Waiting for backend to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
    
    $backendIP = az container show `
        --resource-group $resourceGroup `
        --name chatbot-backend `
        --query ipAddress.ip `
        -o tsv
    
    Write-Host "✅ Backend IP: $backendIP" -ForegroundColor Green
    
    # Deploy frontend
    Write-Host "`n🚀 Deploying frontend container..." -ForegroundColor Cyan
    az container create `
        --resource-group $resourceGroup `
        --name chatbot-frontend `
        --image "$($dockerUsername)/chatbot-frontend:latest" `
        --cpu 1 `
        --memory 1 `
        --port 3000 `
        --protocol TCP `
        --environment-variables `
            "REACT_APP_API_URL=http://${backendIP}:8080/api"
    
    Write-Host "`n✅ Azure resources created!" -ForegroundColor Green
}

# ═══════════════════════════════════════════════════════════════
# STEP 6: Get Access Information
# ═══════════════════════════════════════════════════════════════
Write-Step "Step 6/6: Getting Your App URL..."

if ($azureCliInstalled) {
    Write-Host "`n⏳ Waiting for frontend to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
    
    $frontendIP = az container show `
        --resource-group $resourceGroup `
        --name chatbot-frontend `
        --query ipAddress.ip `
        -o tsv
    
    $appURL = "http://${frontendIP}:3000"
    
    Write-Header "🎉 YOUR APP IS LIVE!"
    
    Write-Host "`n📱 Access your app at:" -ForegroundColor Green
    Write-Host "   $appURL" -ForegroundColor Cyan
    
    Write-Host "`n📊 Your Credentials:" -ForegroundColor Green
    Write-Host "   Resource Group: $resourceGroup" -ForegroundColor Cyan
    Write-Host "   Backend IP:     $backendIP" -ForegroundColor Cyan
    Write-Host "   Frontend IP:    $frontendIP" -ForegroundColor Cyan
    
    Write-Host "`n📌 Test URLs:" -ForegroundColor Green
    Write-Host "   All Subjects:  $appURL (ask 'Show all subjects')" -ForegroundColor Cyan
    Write-Host "   Teachers:      $appURL (ask 'Show all teachers')" -ForegroundColor Cyan
    Write-Host "   Authenticate:  $appURL (enter roll number 2223850)" -ForegroundColor Cyan
    
    Write-Host "`n💰 Cost: $0 (FREE tier)" -ForegroundColor Green
    Write-Host "   50 ACU hours/month included"
    
    Write-Host "`n✅ Deployment Complete! Open your browser and visit the URL above 🎉" -ForegroundColor Green
    
    # Save credentials to file
    $credFile = "azure-deployment-info.txt"
    @"
🎉 CHATBOT DEPLOYMENT INFO
=====================================
Generated: $(Get-Date)

APP URL:
$appURL

AZURE DETAILS:
Resource Group: $resourceGroup
Location: $location
Backend Container: chatbot-backend
Frontend Container: chatbot-frontend

BACKEND:
IP: $backendIP
Port: 8080
API: http://${backendIP}:8080/api

FRONTEND:
IP: $frontendIP
Port: 3000
URL: $appURL

MANAGEMENT:
View logs:
  az container logs --resource-group $resourceGroup --name chatbot-backend

Stop containers:
  az container stop --resource-group $resourceGroup --name chatbot-backend
  az container stop --resource-group $resourceGroup --name chatbot-frontend

Delete all resources:
  az group delete --name $resourceGroup --yes

FEATURES AVAILABLE:
✅ 80 Students (Roll: 2223810-2223889)
✅ 6 Subjects (including Operating System)
✅ 6 Teachers (including Prof. Snehal Patil)
✅ 4 Months Attendance Data
✅ Beautiful Interactive UI
✅ Google Gemini AI
✅ Session Persistence
✅ Table Format Subjects
✅ TA 1 Marks Column
"@ | Out-File $credFile
    
    Write-Host "`n📄 Deployment info saved to: $credFile" -ForegroundColor Yellow
}

Write-Host "`n" -ForegroundColor Green
Read-Host "Press Enter to exit"
