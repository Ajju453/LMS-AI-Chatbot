# Offline Setup Guide

If you **cannot download from external links**, follow this guide to set up and build the Task Manager locally.

## ⚠️ Prerequisites (Required Software)

You must **manually install** these tools **before running any setup script**:

### 1. Visual Studio 2022 or 2019
- **Download**: https://visualstudio.microsoft.com/downloads/
- **Edition**: Community (free) or Professional
- **Required Workload**: Desktop development with C++
- **Size**: ~15-30 GB including build tools

### 2. CMake
**Option A** (Recommended): Install via Visual Studio
- During VS installation, check "CMake tools for Windows"

**Option B**: Install separately
- **Download**: https://cmake.org/download/
- Choose: `Windows x86_64 Installer` (.msi file)
- **Install to**: Default path (C:\Program Files\CMake)
- **Size**: ~150 MB

## ✅ Verify Installation

Open PowerShell or Command Prompt and run:

```powershell
# Check Visual Studio
Get-ChildItem "C:\Program Files\Microsoft Visual Studio\2022"

# Check CMake
cmake --version
```

Both commands should show results without errors.

---

## 🚀 Setup Methods

### Method 1: Using Offline Setup Script (Recommended)

**Requirements**: PowerShell 5.0+ (built-in on Windows)

```powershell
cd C:\Users\YourName\Desktop\New folder (2)
.\offline-setup.ps1
```

**What it does:**
- ✓ Verifies Visual Studio installation
- ✓ Verifies CMake in PATH
- ✓ Creates build directory
- ✓ Runs CMake configuration
- ✓ Builds the application in Release mode
- ✓ Confirms executable was created

---

### Method 2: Using Batch Script

**Requirements**: Windows Command Prompt (built-in)

```batch
auto-setup.bat
```

**What it does:**
- Same as Method 1 but using batch scripting

---

### Method 3: Manual Command-Line Build

If both scripts fail, build manually:

```powershell
# Create build directory
mkdir build
cd build

# Configure (choose based on VS version)
cmake .. -G "Visual Studio 17 2022"   # If you have VS 2022
# OR
cmake .. -G "Visual Studio 16 2019"   # If you have VS 2019

# Build
cmake --build . --config Release

# Navigate to executable
cd ..
.\bin\Release\task-manager.exe
```

---

## 🐛 Troubleshooting

### "cmake is not recognized"

**Problem**: CMake is installed but not in system PATH

**Solution**:
```powershell
# Temporary fix (this session only)
$env:PATH += ";C:\Program Files\CMake\bin"
cmake --version

# Permanent fix: Add CMake to PATH
# Control Panel → System → Environment Variables → 
# Edit PATH and add: C:\Program Files\CMake\bin
```

### "Visual Studio not found"

**Problem**: VS installation not detected

**Verify paths:**
```powershell
# Check VS 2022
Test-Path "C:\Program Files\Microsoft Visual Studio\2022"

# Check VS 2019  
Test-Path "C:\Program Files (x86)\Microsoft Visual Studio\2019"
```

**Solution**: Reinstall Visual Studio with C++ workload

### "CMake configuration failed"

**Problem**: CMake can't find the compiler

**Solution**:
1. Verify Visual Studio installed with C++ tools
2. Restart computer after VS installation
3. Try manual command with full path:
   ```powershell
   & "C:\Program Files\CMake\bin\cmake.exe" .. -G "Visual Studio 17 2022"
   ```

### "Build failed" / Errors during compilation

**Problem**: Build errors

**Solution**:
1. Check Visual Studio version (2022 vs 2019)
2. Update VS to latest patches
3. Try a clean build:
   ```powershell
   rm -r build
   mkdir build
   cd build
   cmake .. -G "Visual Studio 17 2022"
   cmake --build . --config Release
   ```

### "Permission denied" on tasks.dat

**Problem**: Cannot save/load tasks

**Solution**:
1. Run application as Administrator
2. Check folder permissions
3. Delete `tasks.dat` file - it will be recreated

---

## 📁 Expected Layout After Setup

```
New folder (2)/
├── build/                    # Created by CMake
│   ├── CMakeFiles/
│   ├── CTestTestfile.txt
│   ├── CMakeCache.txt
│   └── task-manager.sln     # VS solution file (optional to open)
├── bin/
│   └── Release/
│       └── task-manager.exe ← THE APPLICATION
├── src/
│   ├── main.cpp
│   ├── Task.cpp
│   └── TaskManager.cpp
├── include/
│   ├── Task.h
│   └── TaskManager.h
├── CMakeLists.txt           # Build configuration
├── offline-setup.ps1        # This script
├── auto-setup.bat
├── run.bat
└── README.md
```

---

## 🎯 Quick Summary

**For Offline Environments:**

1. **Install prerequisites** (VS + CMake manually)
2. **Run**: `.\offline-setup.ps1` or `auto-setup.bat`
3. **Launch**: `run.bat` or `.\bin\Release\task-manager.exe`

**That's it!** No internet connection needed after prerequisites are installed.

---

## 📞 More Help

- **Project Overview**: [README.md](README.md)
- **Development Guide**: [DEVELOPMENT.md](DEVELOPMENT.md)
- **Script Documentation**: [SCRIPTS.md](SCRIPTS.md)
- **Online Setup** (with downloads): [SETUP.md](SETUP.md)

---

## ✨ Next Steps

After successful build:

```bash
# Run the application
run.bat

# Or directly
.\bin\Release\task-manager.exe

# Create desktop shortcut (optional)
# Right-click bin\Release\task-manager.exe → Send to → Desktop
```

Enjoy using Task Manager! 📋
