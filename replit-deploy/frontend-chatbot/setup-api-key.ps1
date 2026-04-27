#!/usr/bin/env powershell
# Automated OpenAI API Key Setup Script for AI Chatbot
# This script will prompt for your API key and auto-configure the app

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "     AI CHATBOT - AUTOMATED SETUP" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will configure your OpenAI API key automatically." -ForegroundColor Yellow
Write-Host ""
Write-Host "To get a FREE API key:" -ForegroundColor Cyan
Write-Host "  1. Visit: https://platform.openai.com/api-keys" -ForegroundColor White
Write-Host "  2. Sign up or log in" -ForegroundColor White
Write-Host "  3. Click '+ Create new secret key'" -ForegroundColor White
Write-Host "  4. Copy the key (starts with sk-proj-)" -ForegroundColor White
Write-Host ""

$ApiKey = Read-Host "Paste your OpenAI API key here"

if ([string]::IsNullOrWhiteSpace($ApiKey)) {
    Write-Host ""
    Write-Host "ERROR: No API key provided!" -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Create .env.local file with the API key
$envFilePath = Join-Path $PSScriptRoot ".env.local"

@"
REACT_APP_OPENAI_API_KEY=$ApiKey
"@ | Out-File -FilePath $envFilePath -Encoding UTF8 -Force

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "   ✓ API Key configured successfully!" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting the chatbot application..." -ForegroundColor Yellow
Write-Host "Open your browser to: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C in this terminal to stop the server." -ForegroundColor Yellow
Write-Host ""

# Kill any existing Node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Wait a moment
Start-Sleep -Seconds 2

# Start the app
npm start
