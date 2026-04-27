# Git-VSCode Integration App - Complete Setup Checklist

## ✅ Pre-Installation

- [ ] Node.js installed (18.x or higher)
- [ ] npm installed (9.x or higher)
- [ ] Git installed on your system
- [ ] Visual Studio Code installed
- [ ] Internet connection available
- [ ] Admin rights (for some Git operations)

**Verify Installation:**
```bash
node --version
npm --version
git --version
```

---

## ✅ Installation Phase

- [ ] Navigate to project directory
  ```bash
  cd "your/project/path"
  ```

- [ ] Install npm dependencies
  ```bash
  npm install
  ```

- [ ] Verify installation completed successfully
  - No error messages
  - node_modules folder created
  - package-lock.json generated

---

## ✅ First Run

- [ ] Start development server
  ```bash
  npm start
  ```

- [ ] Wait for compilation
  - Should see: "Compiled successfully"
  - Browser opens automatically

- [ ] Verify app loads
  - See navigation bar with "Git Setup" and "Task Manager"
  - Dashboard visible with status cards
  - No console errors (F12 to check)

---

## ✅ Git Configuration

### Basic Setup
- [ ] Click **"Git Setup"** in navigation
- [ ] Click **"Git Configuration"** tab
- [ ] Enter Git username: `abcd`
- [ ] Enter Git email: `ab.gf@siemens.com`
- [ ] Review preview on right side
- [ ] Click **"Save Configuration"**
- [ ] See "Configuration saved successfully!" message

### Core Settings
- [ ] Verify these are checked:
  - [ ] Auto CRLF (Line endings)
  - [ ] Symlinks Support
  - [ ] File System Cache
  - [ ] Long Paths Support

### Export Configuration
- [ ] Click **"Download"** button
- [ ] Save `.gitconfig` file
- [ ] Place in your user home directory:
  - **Windows**: `C:\Users\YOUR_USERNAME\.gitconfig`
  - **Linux/Mac**: `~/.gitconfig`

---

## ✅ SSH Key Generation

### Generate Keys
- [ ] In dashboard, go to **"SSH Keys"** tab
- [ ] Enter email: `ab.gf@siemens.com`
- [ ] Verify key type is: `ED25519` (recommended)
- [ ] Click **"Generate SSH Key"**
- [ ] Wait for "Generated successfully" message

### Copy Public Key
- [ ] Click **"Show"** button (if needed)
- [ ] Click **"Copy Public Key"** button
- [ ] Verify "copied to clipboard" message

### Save Keys
- [ ] Click **"Download"** button
- [ ] Save the public key file safely
- [ ] Keep private key path: **KEEP SECURE**

---

## ✅ Git Server Configuration

### Add SSH Key to Siemens Server
- [ ] Go to https://code.siemens.com
- [ ] Login with your credentials
- [ ] Navigate to Settings → SSH Keys
- [ ] Click **"Add SSH Key"**
- [ ] Paste public key (copied earlier)
- [ ] Give it a name: "My Dev Machine"
- [ ] Click **"Save"**

### Verify Key Added
- [ ] SSH Keys list shows your new key
- [ ] Key name is visible
- [ ] Fingerprint displayed correctly

---

## ✅ Connection Testing

### Test Git Connection
- [ ] Return to the app
- [ ] Click **"Test Connection"** button
- [ ] Status should show: **"Connected"**
- [ ] See green success message

### Troubleshoot If Failed
- [ ] Check internet connection
- [ ] Verify SSH key added to code.siemens.com
- [ ] Check firewall allows port 22
- [ ] Restart the app

---

## ✅ Clone a Repository

### Test Cloning
- [ ] Click **"Clone Repository"** button
- [ ] Enter a repository URL:
  ```
  https://code.siemens.com/your-username/test-repo.git
  ```
- [ ] Enter local path:
  ```
  C:\Users\YOUR_USERNAME\projects\test-repo
  ```
- [ ] Confirm clone success message

---

## ✅ VSCode Integration

### Open Project in VSCode
- [ ] Open Visual Studio Code
- [ ] File → Open Folder
- [ ] Navigate to cloned repository
- [ ] Select the folder
- [ ] Click **"Select Folder"**

### Verify Git Integration
- [ ] Click **"Source Control"** (left sidebar)
- [ ] Should show:
  - [ ] Repository connected
  - [ ] No pending changes (or your changes)
  - [ ] Branch information
  - [ ] Git commands available

---

## ✅ System Configuration

### Windows Users
- [ ] Run as Administrator (if needed)
- [ ] `.gitconfig` in home directory
- [ ] SSH keys in `.ssh` folder created
- [ ] Reboot your system
- [ ] Verify settings persist after reboot

### Linux/Mac Users
- [ ] Run in terminal
- [ ] `.gitconfig` in home directory
- [ ] `.ssh` folder permissions: `chmod 700 ~/.ssh`
- [ ] Private key permissions: `chmod 600 ~/.ssh/id_ed25519`
- [ ] Test SSH: `ssh -T git@code.siemens.com`

---

## ✅ Security Configuration

### Verify Security
- [ ] Private key NOT in any shared folders
- [ ] `.gitconfig` doesn't contain passwords
- [ ] SSH key has appropriate permissions
- [ ] Never share your private key
- [ ] Keep SSH key passphrase secure

---

## ✅ Task Manager (Optional)

### Explore Task Manager
- [ ] Click **"Task Manager"** tab
- [ ] Enter a test task title
- [ ] Enter a description
- [ ] Click **"Add Task"**
- [ ] Verify task appears in list

### Test Features
- [ ] Mark task completed (checkbox)
- [ ] Delete task (X button)
- [ ] Filter tasks (All/Active/Completed)
- [ ] Verify settings persist on refresh

---

## ✅ Final Verification

### Application Status
- [ ] App loads without errors
- [ ] All tabs accessible
- [ ] Forms submit correctly
- [ ] Buttons respond to clicks
- [ ] Navigation works smoothly

### Git Configuration
- [ ] Settings saved to localStorage
- [ ] Configuration appears in preview
- [ ] Download works correctly
- [ ] Clipboard copy works

### SSH Keys
- [ ] Keys generate successfully
- [ ] Public key displays correctly
- [ ] Copy/download functions work
- [ ] Instructions are clear

### Connection
- [ ] Connection test shows "Connected"
- [ ] Red error messages don't appear
- [ ] No console errors (F12)
- [ ] Git server responds

---

## ✅ Documentation Review

- [ ] Read QUICK_START.md (5-10 min)
- [ ] Review GIT_INTEGRATION_README.md if needed
- [ ] Check SUMMARY.md for overview
- [ ] Bookmark guides for future reference

---

## ✅ Troubleshooting

### If Something Doesn't Work

1. **App Won't Start**
   - [ ] Check internet connection
   - [ ] Verify Node.js/npm installed
   - [ ] Run: `npm cache clean --force`
   - [ ] Run: `npm install`
   - [ ] Try: `npm start`

2. **Port Already in Use**
   - [ ] Run: `ng serve --port 4201`
   - [ ] Use available port number

3. **Git Connection Fails**
   - [ ] Check firewall settings
   - [ ] Ensure SSH key added to server
   - [ ] Test manually: `ssh -T git@code.siemens.com`

4. **Configuration Not Saving**
   - [ ] Clear browser cache
   - [ ] Check localStorage enabled
   - [ ] Try different browser
   - [ ] Hard refresh (Ctrl+F5)

---

## ✅ Maintenance

### Weekly
- [ ] Check for Angular updates: `ng update`
- [ ] Verify Git settings still working
- [ ] Test SSH connection if needed

### Monthly
- [ ] Review stored configurations
- [ ] Backup SSH keys (if multiple machines)
- [ ] Update documentation if needed
- [ ] Clean up old repositories

### Quarterly
- [ ] Rotate SSH keys (security best practice)
- [ ] Update dependencies: `npm update`
- [ ] Review active projects
- [ ] Update Node.js/npm if available

---

## ✅ Going Live

When ready for team use:

- [ ] Document team setup process
- [ ] Create shared configuration
- [ ] Test on production-like environment
- [ ] Get team feedback
- [ ] Deploy with confidence

---

## ✅ Support Resources

### Quick Reference
- **Start App**: `npm start`
- **Stop App**: `Ctrl+C`
- **Test**: `npm test`
- **Build**: `npm build`

### Documentation
- QUICK_START.md - Fast setup
- GIT_INTEGRATION_README.md - Complete reference
- SUMMARY.md - Architecture overview

### Popular Commands
```bash
# Start development
npm start

# Run tests
npm test

# Build for production
npm build --configuration production

# Update packages
npm update

# Clear cache
npm cache clean --force
```

---

## ✅ Completion Certificate

**Congratulations!** 🎉

If you've checked all the boxes above, you've successfully:

✅ Installed the Git-VSCode Integration App  
✅ Configured Git settings  
✅ Generated SSH keys  
✅ Tested connections  
✅ Integrated with VSCode  
✅ Explored task management  
✅ Reviewed documentation  
✅ Verified troubleshooting  

**You're now ready to use the Git-VSCode Integration Hub!**

---

## 📝 Notes

### What to Remember
1. Save your SSH keys securely
2. Never commit .gitconfig to public repos
3. Keep your private key private
4. Test connections before using
5. Keep documentation handy

### Common Mistakes to Avoid
- ❌ Sharing private SSH keys
- ❌ Storing passwords in .gitconfig
- ❌ Forgetting to add key to server
- ❌ Using wrong email addresses
- ❌ Not backing up SSH keys

---

## 🎯 Next Steps After Setup

1. **Add Your First Project**
   - Clone real repository
   - Configure VSCode
   - Start coding

2. **Explore Features**
   - Fine-tune Git settings
   - Test cloning workflows
   - Use task manager

3. **Optimize Workflow**
   - Create custom scripts
   - Set up aliases
   - Integrate with CI/CD

4. **Team Collaboration**
   - Share setup guide
   - Create templates
   - Document best practices

---

**Setup Date**: _______________  
**Completed By**: _______________  
**Notes**: _______________________________________________

---

**Last Updated**: March 2026  
**Version**: 1.0.0  
**Status**: Ready for Use ✅
