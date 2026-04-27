@echo off
setlocal enabledelayedexpansion
cls

echo Task Manager - Auto Setup
echo.

if exist "C:\Program Files\Microsoft Visual Studio\2022" (set VS_VERSION=2022) else if exist "C:\Program Files (x86)\Microsoft Visual Studio\2019" (set VS_VERSION=2019) else (echo ERROR: Visual Studio not found&pause&exit /b 1)
echo [OK] Visual Studio %VS_VERSION% found

cmake --version >nul 2>&1 || (echo ERROR: CMake not found&pause&exit /b 1)
for /f "tokens=3" %%i in ('cmake --version ^| findstr "version"') do set CMAKE_VERSION=%%i
echo [OK] CMake %CMAKE_VERSION% found

if not exist "build" mkdir build
cd build

if "%VS_VERSION%"=="2022" (cmake .. -G "Visual Studio 17 2022") else (cmake .. -G "Visual Studio 16 2019")
if errorlevel 1 (echo ERROR: CMake config failed&cd ..&pause&exit /b 1)
echo [OK] Configuration complete

cmake --build . --config Release
if errorlevel 1 (echo ERROR: Build failed&cd ..&pause&exit /b 1)
cd ..
echo [OK] Build complete

if exist "bin\Release\task-manager.exe" (echo [OK] Executable created: !cd!\bin\Release\task-manager.exe) else (echo ERROR: Executable not found&pause&exit /b 1)
echo.
echo Done - run with: run.bat
)

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo To launch Task Manager:
echo   run.bat
echo or
echo   .\bin\Release\task-manager.exe
echo.

pause
