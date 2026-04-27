# Git-VSCode Integration App - Setup & Installation Guide

## Overview
This is a comprehensive Angular application that helps you:
- ✅ Configure Git with Siemens server settings
- ✅ Generate SSH keys securely
- ✅ Test Git connections
- ✅ Clone repositories
- ✅ Manage your development tasks

## Project Structure

```
src/app/
├── components/
│   ├── git-integration-dashboard/      # Main dashboard
│   ├── git-config/                      # Git configuration form
│   ├── ssh-key-generator/               # SSH key generation
│   ├── task-form/                       # Task creation form
│   ├── task-item/                       # Task display item
│   └── task-list/                       # Task list container
├── services/
│   ├── git-integration.service.ts       # Git operations service
│   └── task.service.ts                  # Task management service
├── models/
│   └── task.model.ts                    # TypeScript models
└── app.component.ts                     # Main app component
```

## Installation Steps

### 1. Install Dependencies

```bash
# Navigate to project directory
cd path/to/project

# Install Angular and required packages
npm install

# Install ngx-toastr for notifications
npm install ngx-toastr --save

# Install ngx-bootstrap for styling (optional, for better UI)
npm install ngx-bootstrap --save

# Install Bootstrap for styling
npm install bootstrap --save
```

### 2. Update angular.json

Add Bootstrap and Font Awesome to your `angular.json` styles array:

```json
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "node_modules/ngx-toastr/toastr.css",
  "src/styles.css"
]
```

And in the scripts array:

```json
"scripts": [
  "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
]
```

### 3. Add Font Awesome CDN

Update `src/index.html` to include Font Awesome:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

### 4. Update main.ts

Ensure the app bootstraps the root component:

```typescript
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserAnimationsModule)
  ]
});
```

## Features

### 1. Git Configuration
- Input your Git username and email
- Configure core settings (auto CRLF, symlinks, long paths, etc.)
- Download or copy the `.gitconfig` file
- Settings are saved to localStorage

### 2. SSH Key Generator
- Generate ED25519 or RSA SSH keys
- Specify where keys should be stored
- View and copy public key
- Download keys securely
- Step-by-step setup instructions

### 3. Dashboard
- Overview of configuration status
- Quick action buttons
- Test Git connection to Siemens server
- Clone repository functionality
- Comprehensive setup guides

### 4. Setup Guides
- Windows-specific setup instructions
- Linux/Mac setup instructions
- Troubleshooting section
- Step-by-step configuration walkthroughs

## Usage

### Start the Development Server

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`

### Configure Git

1. Click on **"Git Setup"** in the navigation bar
2. Navigate to **"Git Configuration"** tab
3. Enter your details:
   - Username: `abcd`
   - Email: `ab.gf@siemens.com`
4. Adjust core settings as needed
5. Click **"Save Configuration"**
6. Download the `.gitconfig` file and place it in your user home directory

### Generate SSH Keys

1. In the dashboard, click **"SSH Keys"** tab
2. Enter your email address
3. Specify the key storage path
4. Select key type (ED25519 recommended)
5. Click **"Generate SSH Key"**
6. Copy the public key and add it to code.siemens.com
7. Keep the private key secure locally

### Test Connection

1. Click the **"Test Connection"** button in the Quick Actions section
2. Review the connection status
3. Troubleshoot if needed using the Guides tab

## Keyboard Shortcuts & Tips

- Use **Tab** key to navigate between form fields
- **Ctrl+C** in terminal to stop the development server
- Browser **Developer Tools** (F12) for debugging
- **Clear localStorage** if you want to reset saved settings

## Troubleshooting

### Missing Dependencies Error
```bash
# If you see module not found errors, run:
npm install ngx-toastr bootstrap
```

### Port 4200 Already in Use
```bash
# Use a different port:
ng serve --port 4201
```

### Git Connection Test Fails
1. Verify your internet connection
2. Check firewall allows SSH (port 22)
3. Ensure SSH keys are properly configured
4. Use debug mode: `ssh -v -T git@code.siemens.com`

### Changes Not Showing
1. Clear browser cache (Ctrl+Shift+Del)
2. Restart development server
3. Hard refresh page (Ctrl+F5 on Windows, Cmd+Shift+R on Mac)

## Building for Production

```bash
# Build the project
ng build --configuration production

# Output will be in dist/ folder
```

## Testing

```bash
# Run unit tests
ng test

# Run tests with coverage
ng test --watch=false --code-coverage
```

## API Reference

### GitIntegrationService

```typescript
// Get current Git configuration
getGitConfig(): GitConfig | null

// Save Git configuration
saveGitConfig(config: GitConfig): Observable<any>

// Generate SSH key
generateSSHKey(email: string, keysPath: string): Observable<SSHKeyResponse>

// Clone repository
cloneRepository(repoUrl: string, localPath: string): Observable<any>

// Test Git connection
testGitConnection(serverUrl: string): Observable<any>

// Generate .gitconfig content
generateGitConfigContent(config: GitConfig): string
```

## Best Practices

1. **SSH Keys**: Never share your private key
2. **Git Config**: Use version-controlled `.gitconfig` for team settings
3. **Passwords**: Never add passwords to Git configuration
4. **Backups**: Backup your SSH keys to a secure location
5. **Updates**: Keep your Angular packages updated regularly

## Security Notes

- Your configuration is stored in browser's localStorage
- SSH keys are generated locally and never sent to servers
- Always use HTTPS for Git operations when possible
- Use SSH keys instead of passwords for authentication
- Regularly rotate SSH keys for security

## Support & Documentation

- [Angular Documentation](https://angular.io/docs)
- [Siemens Code Server](https://code.siemens.com)
- [SSH Key Generation Guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

## Version Info

- Angular: 17.x
- Node.js: 18.x or higher
- npm: 9.x or higher
- Bootstrap: 5.x
- RxJS: 7.x

## License

This project is part of your development toolkit.

---

**Last Updated**: March 2026
**Status**: Production Ready
