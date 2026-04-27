#!/usr/bin/env powershell
# AI Learning Path Chatbot Launcher
# Works immediately - No API key required for Demo Mode!

param(
    [string]$ApiKey = ""
)

$workingDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Color functions
function Write-Title { Write-Host $args[0] -ForegroundColor Cyan -BackgroundColor Black }
function Write-Success { Write-Host $args[0] -ForegroundColor Green }
function Write-Info { Write-Host $args[0] -ForegroundColor Yellow }

# Banner
Clear-Host
Write-Title "╔════════════════════════════════════════╗"
Write-Title "║  🤖 AI LEARNING PATH CHATBOT         ║"
Write-Title "║         INSTANT LAUNCHER              ║"
Write-Title "╚════════════════════════════════════════╝"
Write-Host ""
Write-Info "✨ DEMO MODE: Chat with intelligent AI without API key!"
Write-Host ""
Write-Host "Want UNLIMITED real AI power? Add your free OpenAI key:" -ForegroundColor Cyan
Write-Host "(Optional - you can do this anytime in Settings)" -ForegroundColor Gray
Write-Host ""

$addKey = Read-Host "Add OpenAI API key now? (y/n, default is n)"

if ($addKey -eq 'y' -or $addKey -eq 'Y') {
    Write-Host ""
    Write-Host "Getting a FREE OpenAI API key takes 2 minutes:" -ForegroundColor Cyan
    Write-Host "  1. Visit: https://platform.openai.com/api-keys" -ForegroundColor White
    Write-Host "  2. Sign up / Login" -ForegroundColor White
    Write-Host "  3. Click: + Create new secret key" -ForegroundColor White
    Write-Host "  4. Copy the key (starts with 'sk-proj-')" -ForegroundColor White
    Write-Host ""
    
    $ApiKey = Read-Host "Paste your API key (or press Enter to skip)"
    
    if (-not [string]::IsNullOrWhiteSpace($ApiKey)) {
        @"
REACT_APP_OPENAI_API_KEY=$ApiKey
REACT_APP_STUDENT_ID=STU001
REACT_APP_DEFAULT_PATH=General Learning
"@ | Out-File -FilePath "$workingDir\.env.local" -Encoding UTF8 -Force
        Write-Success "✓ API key saved! Real AI Mode enabled."
    } else {
        Write-Info "⊘ Skipping for now - using Demo Mode"
        Write-Host "You can add it later in the app Settings" -ForegroundColor Gray
    }
} else {
    Write-Info "🚀 Launching in Demo Mode..."
}

Write-Host ""
Write-Success "🚀 Starting your AI Learning Path Chatbot..."
Write-Host ""
Write-Host "Choose your mode:" -ForegroundColor Cyan
Write-Host "  📊 Demo Mode     - Intelligent responses (no API key)" -ForegroundColor White
Write-Host "  🤖 Real AI Mode  - GPT-3.5 powered (with API key)" -ForegroundColor White
Write-Host ""
Write-Host "App: http://localhost:3000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

# Kill any existing Node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue 2>$null
Start-Sleep -Milliseconds 500

npm start
