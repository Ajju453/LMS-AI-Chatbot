# Task Manager - Scripts Summary

This document explains all the automated scripts included in the project.

## 📋 Available Scripts

### 1. **auto-setup.bat** - Automatic Setup (Batch Version)
**File:** `auto-setup.bat`
**How to use:** Double-click or run in Command Prompt
```cmd
auto-setup.bat
```

**What it does:**
- Checks for Visual Studio compiler
- Verifies or downloads CMake
- Creates build directory
- Configures the project
- Builds the executable
- Verifies the build was successful

**Best for:** Simple, one-click setup
**Requires:** Administrator privileges (on first run)

---

### 2. **auto-setup.ps1** - Automatic Setup (PowerShell Version)
**File:** `auto-setup.ps1`
**How to use:**
```powershell
# Allow script execution first (one-time)
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process

# Then run
.\auto-setup.ps1
```

**What it does:**
- Advanced compiler detection
- Downloads CMake automatically
- Beautiful colored output
- Can create desktop shortcut
- Detailed error messages
- Supports command-line options

**Command-line options:**
```powershell
.\auto-setup.ps1 -Clean              # Clean build (remove old build)
.\auto-setup.ps1 -SkipCompiler       # Skip compiler verification
.\auto-setup.ps1 -SkipCMake          # Skip CMake download
.\auto-setup.ps1 -Clean -SkipCMake   # Combine options
```

**Best for:** Advanced users, automation, detailed control
**Requires:** PowerShell 5.0+

---

### 3. **run.bat** - Quick Launcher
**File:** `run.bat`
**How to use:** Double-click or run in Command Prompt
```cmd
run.bat
```

**What it does:**
- Checks if executable exists
- Launches the application
- If not built yet, suggests running auto-setup.bat
- Handles missing files gracefully

**Best for:** Running the app after setup
**No configuration needed**

---

### 4. **build.bat** - Traditional Build Script
**File:** `build.bat`
**How to use:**
```cmd
build.bat
```

**What it does:**
- Creates build directory
- Runs CMake configuration
- Builds the project
- Shows build results

**Best for:** When you want more control
**More verbose than auto-setup.bat**

---

### 5. **build.ps1** - PowerShell Build Script
**File:** `build.ps1`
**How to use:**
```powershell
.\build.ps1
```

**What it does:**
- ColorfulPowerShell script
- Automatic build configuration
- Progress indication

**Best for:** PowerShell users who prefer it

---

## 🎯 Recommended Workflows

### First-Time Setup
**Option A (Easiest):**
1. Double-click `auto-setup.bat`
2. Wait for setup to complete
3. Double-click `run.bat`

**Option B (PowerShell):**
1. Run PowerShell as Administrator
2. Execute: `.\auto-setup.ps1`
3. Choose to create shortcut
4. Double-click shortcut or run `.\run.bat`

### Rebuild After Code Changes
```cmd
# Using batch
auto-setup.bat -Clean

# Or using PowerShell
.\auto-setup.ps1 -Clean

# Or traditional method
rmdir /s build
cmake .. && cmake --build . --config Release
```

### Quick Run After Build
```cmd
run.bat
```

### Advanced: Full Control
```cmd
mkdir build
cd build
cmake .. -G "Visual Studio 17 2022"
cmake --build . --config Release --verbose
cd ..
.\bin\Release\task-manager.exe
```

---

## 🔍 Script Comparison

| Feature | auto-setup.bat | auto-setup.ps1 | run.bat | build.bat |
|---------|---|---|---|---|
| One-click | ✅ | ✅ | ✅ | ✅ |
| Download CMake | ✅ | ✅ | ❌ | ❌ |
| Create shortcut | ❌ | ✅ | ❌ | ❌ |
| Colored output | ❌ | ✅ | ❌ | ❌ |
| Options/flags | ❌ | ✅ | ❌ | ❌ |
| Build project | ✅ | ✅ | ❌ | ✅ |
| Run application | ❌ | ❌ | ✅ | ❌ |

---

## 🛠️ Troubleshooting Scripts

### "Script execution disabled" (PowerShell)
**Error:** "Cannot be loaded because running scripts is disabled"

**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\auto-setup.ps1
```

### "Permission denied"
**Solution:** Run as Administrator
- Right-click PowerShell/Command Prompt
- Select "Run as Administrator"

### "CMake not found"
**Solution:** 
- Use PowerShell auto-setup (it downloads CMake)
- Or install manually: https://cmake.org/download/

### "Visual Studio not found"
**Solution:**
- Install Visual Studio 2022 Community: https://visualstudio.microsoft.com/
- Select "Desktop development with C++"

---

## 📝 Script Files

```
Project Root/
├── auto-setup.bat           ← Batch version (easiest)
├── auto-setup.ps1          ← PowerShell version (most features)
├── run.bat                  ← Quick launcher
├── build.bat                ← Traditional build
├── build.ps1                ← PowerShell builder
├── SETUP.md                 ← Complete setup guide
└── README.md                ← Main documentation
```

---

## 🚀 Quick Reference

| Task | Command |
|------|---------|
| **First setup** | `auto-setup.bat` |
| **Run app** | `run.bat` |
| **Rebuild** | `auto-setup.ps1 -Clean` |
| **Clean build** | `rmdir /s build` then `auto-setup.bat` |
| **Open in VS** | `start .\build\task-manager.sln` |
| **Manual build** | `mkdir build && cd build && cmake ..` |

---

## ✨ Features by Script

### auto-setup.bat ⭐ RECOMMENDED
✅ Easiest to use (just double-click)
✅ No configuration needed
✅ Handles all steps automatically
✅ Works for most users

### auto-setup.ps1
✅ More features (shortcut creation)
✅ Colored output (nicer looking)
✅ Command-line options
✅ Better error messages

### run.bat
✅ Launches the app
✅ Checks if app is built
✅ Suggests auto-setup if needed

---

## 💡 Tips

1. **First time?** Use `auto-setup.bat`
2. **Want desktop shortcut?** Use `auto-setup.ps1`
3. **Need to rebuild?** Use `auto-setup.ps1 -Clean`
4. **Just run the app?** Use `run.bat`
5. **Full control?** Use manual commands in SETUP.md

---

**Need help?** See [SETUP.md](SETUP.md) for detailed instructions!
