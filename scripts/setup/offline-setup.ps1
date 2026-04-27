#!/usr/bin/env pwsh
# Task Manager - Offline Setup Script
# NO EXTERNAL DOWNLOADS - Uses only local tools
# Requires: Visual Studio 2022/2019 with C++ and CMake already installed

param(
    [switch]$Help = $false
)

# Colors
$colors = @{
    Green  = "Green"
    Red    = "Red"
    Yellow = "Yellow"
    Cyan   = "Cyan"
}

function Write-Header {
    Write-Host "`n========================================" -ForegroundColor $colors.Cyan
    Write-Host "  Task Manager - Offline Setup"
    Write-Host "========================================`n" -ForegroundColor $colors.Cyan
}

function Write-Step {
    Write-Host "[STEP] $args[0]" -ForegroundColor $colors.Cyan
}

function Write-Success {
    Write-Host "[OK] $args[0]" -ForegroundColor $colors.Green
}

function Write-Err {
    Write-Host "[ERROR] $args[0]" -ForegroundColor $colors.Red
}

function Write-Warn {
    Write-Host "[WARNING] $args[0]" -ForegroundColor $colors.Yellow
}

# Check prerequisites
function Check-Prerequisites {
    Write-Step "Checking for Visual Studio..."
    
    $vs2022 = "C:\Program Files\Microsoft Visual Studio\2022"
    $vs2019 = "C:\Program Files (x86)\Microsoft Visual Studio\2019"
    $vsFound = $false
    $vsVersion = ""
    
    if (Test-Path $vs2022) {
        Write-Success "Visual Studio 2022 found"
        $vsFound = $true
        $vsVersion = "2022"
    }
    elseif (Test-Path $vs2019) {
        Write-Success "Visual Studio 2019 found"
        $vsFound = $true
        $vsVersion = "2019"
    }
    
    if (-not $vsFound) {
        Write-Host ""
        Write-Err "Visual Studio 2022 or 2019 not found!"
        Write-Host ""
        Write-Host "Required Software:" -ForegroundColor $colors.Yellow
        Write-Host "  - Visual Studio 2022 or 2019 Community Edition" -ForegroundColor $colors.Yellow
        Write-Host "  - C++ Desktop Development workload" -ForegroundColor $colors.Yellow
        Write-Host "  - CMake (included or install separately)" -ForegroundColor $colors.Yellow
        Write-Host ""
        Write-Host "Download from: https://visualstudio.microsoft.com/downloads/" -ForegroundColor $colors.Yellow
        Write-Host ""
        return $null
    }
    
    Write-Host ""
    Write-Step "Checking for CMake..."
    
    $cmake = Get-Command cmake -ErrorAction SilentlyContinue
    
    if ($cmake) {
        $version = & cmake --version | Select-Object -First 1
        Write-Success "CMake found: $version"
    }
    else {
        Write-Host ""
        Write-Warn "CMake not found in PATH"
        Write-Host ""
        Write-Host "Solutions:" -ForegroundColor $colors.Yellow
        Write-Host "  1. Install CMake: https://cmake.org/download/" -ForegroundColor $colors.Yellow
        Write-Host "  2. Or reinstall VS2022 and select CMake" -ForegroundColor $colors.Yellow
        Write-Host ""
        Write-Host "Then add CMake to PATH and run this script again." -ForegroundColor $colors.Yellow
        Write-Host ""
        return $null
    }
    
    return $vsVersion
}

function Build-Project {
    param([string]$vsVersion)
    
    Write-Host ""
    Write-Step "Creating build directory..."
    
    if (-not (Test-Path "build")) {
        New-Item -ItemType Directory -Path "build" | Out-Null
        Write-Success "Build directory created"
    }
    else {
        Write-Success "Build directory exists"
    }
    
    Write-Host ""
    Write-Step "Configuring with CMake..."
    
    Push-Location "build"
    
    $generator = if ($vsVersion -eq "2022") { "Visual Studio 17 2022" } else { "Visual Studio 16 2019" }
    
    & cmake .. -G $generator
    
    if ($LASTEXITCODE -ne 0) {
        Write-Err "CMake configuration failed"
        Pop-Location
        return $false
    }
    
    Write-Success "CMake configuration complete"
    
    Write-Host ""
    Write-Step "Building (this may take a moment)..."
    
    & cmake --build . --config Release
    
    if ($LASTEXITCODE -ne 0) {
        Write-Err "Build failed"
        Pop-Location
        return $false
    }
    
    Write-Success "Build complete"
    
    Pop-Location
    
    # Verify executable
    Write-Host ""
    Write-Step "Verifying executable..."
    
    $exe = "bin\Release\task-manager.exe"
    if (Test-Path $exe) {
        $size = (Get-Item $exe).Length / 1KB
        Write-Success "Executable created ($([math]::Round($size, 2)) KB)"
        Write-Host "         Location: $(Resolve-Path $exe)" -ForegroundColor $colors.Green
        return $true
    }
    else {
        Write-Err "Executable not found at $exe"
        return $false
    }
}

# Main
Clear-Host
Write-Header

if ($Help) {
    Write-Host "Usage: .\offline-setup.ps1 [options]`n" -ForegroundColor $colors.Cyan
    Write-Host "Description:" -ForegroundColor $colors.Cyan
    Write-Host "  Setup script for offline environments (no downloads)"
    Write-Host "  Requires Visual Studio 2022/2019 and CMake to be installed`n"
    Write-Host "Options:" -ForegroundColor $colors.Cyan
    Write-Host "  -Help     Show this message`n"
    exit 0
}

# Check prerequisites
$vsVersion = Check-Prerequisites

if (-not $vsVersion) {
    Write-Host "Setup incomplete. Install required software and try again.`n"
    exit 1
}

# Build
Write-Host ""
$buildOk = Build-Project -vsVersion $vsVersion

if ($buildOk) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor $colors.Cyan
    Write-Host "  Setup Complete!" -ForegroundColor $colors.Green
    Write-Host "========================================`n" -ForegroundColor $colors.Cyan
    
    Write-Host "To run Task Manager:" -ForegroundColor $colors.Yellow
    Write-Host "  Option 1: run.bat" -ForegroundColor $colors.Cyan
    Write-Host "  Option 2: .\bin\Release\task-manager.exe`n" -ForegroundColor $colors.Cyan
}
else {
    Write-Host ""
    Write-Host "Setup failed. Check errors above.`n" -ForegroundColor $colors.Red
    exit 1
}
