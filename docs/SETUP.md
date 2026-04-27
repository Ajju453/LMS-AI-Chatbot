# Task Manager C++ - Complete Setup Guide

This guide covers all methods to download, build, and run the Task Manager application.

## Quick Start (Easiest - 1 Click)

### Option 1: Automatic Setup (Recommended)

**For Windows with PowerShell:**
```powershell
# Open PowerShell and run:
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\auto-setup.ps1
```

**For Windows with Batch:**
```cmd
# Double-click or run:
auto-setup.bat
```

**Then run the application:**
```cmd
run.bat
```

That's it! The script will:
- ✅ Check for required tools
- ✅ Download CMake if needed
- ✅ Detect Visual Studio compiler
- ✅ Configure the project
- ✅ Build the executable
- ✅ Create a desktop shortcut (optional)

---

## Manual Setup (If Preferred)

### Prerequisites

1. **Visual Studio 2022 Community Edition** (Free)
   - Download: https://visualstudio.microsoft.com/downloads/
   - Install with "Desktop development with C++"

2. **CMake 3.16 or newer**
   - Download: https://cmake.org/download/
   - Or let the auto-setup script install it

### Manual Build Steps

**Step 1: Create Build Directory**
```cmd
mkdir build
cd build
```

**Step 2: Generate Visual Studio Project**
```cmd
cmake .. -G "Visual Studio 17 2022"
```

**Step 3: Build the Project**
```cmd
cmake --build . --config Release
```

**Step 4: Run the Application**
```cmd
cd ..
.\bin\Release\task-manager.exe
```

---

## Script Options

### auto-setup.ps1 (PowerShell)

**Basic usage:**
```powershell
.\auto-setup.ps1
```

**Skip compiler check:**
```powershell
.\auto-setup.ps1 -SkipCompiler
```

**Skip CMake download:**
```powershell
.\auto-setup.ps1 -SkipCMake
```

**Clean build (remove old build):**
```powershell
.\auto-setup.ps1 -Clean
```

**Combine options:**
```powershell
.\auto-setup.ps1 -Clean -SkipCMake
```

### auto-setup.bat (Batch/Command Prompt)

**Basic usage:**
```cmd
auto-setup.bat
```

No additional options - it handles everything automatically.

### run.bat (Launcher)

**Simple launcher:**
```cmd
run.bat
```

Features:
- Checks if executable exists
- Runs the application
- If executable not found, offers to run auto-setup.bat

---

## Troubleshooting

### Issue: "CMake not found"

**Solution 1:** Download and install manually
- Download: https://cmake.org/download/
- Install to default location
- Run setup script again

**Solution 2:** Let auto-setup script install it
```powershell
.\auto-setup.ps1  # PowerShell will download CMake
```

### Issue: "Visual Studio not found"

**Solution:** Install Visual Studio 2022 Community Edition
- Download: https://visualstudio.microsoft.com/downloads/
- Select "Desktop development with C++"
- Install and run setup script again

### Issue: "Access Denied" error

**Solution:** Run PowerShell as Administrator
```powershell
# In PowerShell, press Win+X and select "Windows PowerShell (Admin)"
# Or right-click PowerShell → Run as Administrator
```

### Issue: Build fails with "-G error"

**Solution:** Update CMake
```cmd
cmake --version
# If version is < 3.16, download newer: https://cmake.org/download/
```

### Issue: Cannot execute PowerShell script

**Solution 1:** Use batch script instead
```cmd
auto-setup.bat
```

**Solution 2:** Allow script execution
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\auto-setup.ps1
```

---

## Advanced Options

### Clean Build

**Remove old build and rebuild:**
```cmd
rmdir /s build
auto-setup.bat
```

Or with PowerShell:
```powershell
.\auto-setup.ps1 -Clean
```

### Build Debug Version

Edit `auto-setup.bat` or in build directory:
```cmd
cmake --build . --config Debug
```

### Visual Studio Solution

After CMake configuration, you can open Visual Studio:
```cmd
cd build
start task-manager.sln
```

Then build from Visual Studio GUI.

---

## File Locations

After successful build:

```
project/
├── bin/
│   └── Release/
│       └── task-manager.exe    ← The actual application
├── build/                       ← CMake build directory (can delete to rebuild)
├── src/                         ← Source code
├── include/                     ← Header files
├── tasks.dat                    ← Your tasks (created at runtime)
└── auto-setup.ps1             ← Setup script
```

---

## First Run

When you run the application for the first time:

1. You'll see the main menu
2. Tasks will be saved to `tasks.dat` in the same directory
3. On next run, your tasks will still be there

---

## Creating a Shortcut

### Automatic (During Setup)
The PowerShell script offers to create a desktop shortcut automatically.

### Manual Shortcut

**Method 1: Using Windows Explorer**
1. Navigate to project folder
2. Right-click `bin/Release/task-manager.exe`
3. Select "Send to" → "Desktop (create shortcut)"

**Method 2: Using PowerShell**
```powershell
$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut("$env:USERPROFILE\Desktop\Task Manager.lnk")
$shortcut.TargetPath = "C:\full\path\to\task-manager.exe"
$shortcut.Save()
```

**Method 3: Using Batch**
Create a file called `shortcut.bat`:
```batch
@echo off
setlocal
set SCRIPT="%temp%\create_shortcut.vbs"
echo Set oWS = WScript.CreateObject("WScript.Shell") > %SCRIPT%
echo sLinkFile = "%USERPROFILE%\Desktop\Task Manager.lnk" >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = "%cd%\bin\Release\task-manager.exe" >> %SCRIPT%
echo oLink.Save >> %SCRIPT%
cscript /nologo %SCRIPT%
del %SCRIPT%
echo Shortcut created!
```

---

## Automated CI/CD Style Build

For fully automated builds in scripts:

```batch
@echo off
setlocal enabledelayedexpansion

REM Setup
call auto-setup.bat

REM Check result
if %errorlevel% neq 0 (
    echo Build failed with error code %errorlevel%
    exit /b %errorlevel%
)

REM Success
echo Build successful!
echo Running application...
call run.bat
```

---

## Removing/Cleaning Up

**To clean build directory (keep source):**
```cmd
rmdir /s /q build
```

**To reset everything:**
```cmd
rmdir /s /q build
rmdir /s /q bin
del tasks.dat 2>nul
```

---

## FAQ

**Q: Do I need to install anything else?**
- A: Just Visual Studio 2022 Community Edition. The auto-setup handles CMake.

**Q: Can I use a different Visual Studio version?**
- A: Yes, modify the `-G` parameter:
  - VS 2019: `-G "Visual Studio 16 2019"`
  - VS 2022: `-G "Visual Studio 17 2022"`

**Q: Is it safe to delete the build folder?**
- A: Yes, it will be recreated on next build.

**Q: Can I run multiple instances?**
- A: Yes, but they'll share the same `tasks.dat` file.

**Q: How do I update the application?**
- A: Pull latest code, run `auto-setup.bat` with `-Clean` flag.

---

## Getting Help

1. Check **DEVELOPMENT.md** for architecture details
2. Check **README.md** for feature overview
3. See **Troubleshooting** section above
4. Compiler errors? Run: `cmake --build . --config Release --verbose`

---

**Last Updated:** 2026-03-10
**Version:** 1.0
