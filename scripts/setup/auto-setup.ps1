#!/usr/bin/env pwsh
param([switch]$Clean)

Write-Host "Task Manager Setup"

$vs2022 = Test-Path "C:\Program Files\Microsoft Visual Studio\2022"
$vs2019 = Test-Path "C:\Program Files (x86)\Microsoft Visual Studio\2019"
if (-not ($vs2022 -or $vs2019)) {
    Write-Host "Error: Visual Studio 2022/2019 required"; exit 1
}
Write-Host "OK: Visual Studio found"

$hasCmake = $null -ne (Get-Command cmake -ErrorAction SilentlyContinue)
if (-not $hasCmake) {
    Write-Host "Downloading CMake..."
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $url = "https://github.com/Kitware/CMake/releases/download/v3.28.1/cmake-3.28.1-windows-x86_64.msi"
    $path = "$env:TEMP\cmake.msi"
    Invoke-WebRequest -Uri $url -OutFile $path
    Start-Process msiexec.exe -ArgumentList "/i `"$path`" /quiet" -Wait
    $env:PATH += ";C:\Program Files\CMake\bin"
    [Environment]::SetEnvironmentVariable("PATH", $env:PATH, "Machine")
    Remove-Item $path
    Write-Host "OK: CMake installed"
}
Write-Host "OK: CMake found"

if ($Clean -and (Test-Path "build")) { Remove-Item -Recurse -Force "build" }
if (-not (Test-Path "build")) { New-Item -ItemType Directory -Path "build" | Out-Null }

Push-Location build
cmake .. -G "Visual Studio 17 2022"
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: CMake config failed"; Pop-Location; exit 1 }
cmake --build . --config Release
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: Build failed"; Pop-Location; exit 1 }
Pop-Location

if (Test-Path ".\bin\Release\task-manager.exe") {
    Write-Host "OK: Build complete"
} else {
    Write-Host "ERROR: Executable not created"; exit 1
}

