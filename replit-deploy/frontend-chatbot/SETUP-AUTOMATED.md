# 🤖 AI Chatbot - Automated Setup Guide

## Quick Start (Automated)

### Option 1: Using PowerShell (Recommended)
```powershell
cd "C:\Users\Z00588XV\Desktop\New folder (2)\frontend-chatbot"
.\setup-api-key.ps1
```

### Option 2: Using Command Prompt (CMD)
```cmd
cd C:\Users\Z00588XV\Desktop\New folder (2)\frontend-chatbot
setup-api-key.bat
```

### Option 3: Manual Setup
1. Open the `frontend-chatbot` folder
2. Create a file named `.env.local` with:
   ```
   REACT_APP_OPENAI_API_KEY=sk-proj-your-key-here
   ```
3. Replace `sk-proj-your-key-here` with your actual OpenAI API key
4. Run: `npm start`

---

## Getting Your Free OpenAI API Key

1. **Visit:** https://platform.openai.com/api-keys
2. **Sign up** or **log in** with your OpenAI account
3. **Click:** `+ Create new secret key`
4. **Copy** the key (starts with `sk-proj-`)
5. **Paste** it into the setup script

### ✨ Free Tier Benefits
- **$5 monthly credits** included
- Perfect for testing and development
- No credit card required initially for free trial

---

## How It Works

The automated setup does the following:

1. ✅ Prompts you for your OpenAI API key
2. ✅ Creates a `.env.local` file (git-ignored for security)
3. ✅ Automatically loads the key when the app starts
4. ✅ Starts the development server
5. ✅ Opens the app at http://localhost:3000

---

## File Structure

```
frontend-chatbot/
├── setup-api-key.ps1          # PowerShell automated setup
├── setup-api-key.bat          # CMD automated setup
├── .env.local.example         # Example environment file
├── .env.local                 # Your actual API key (do NOT share!)
├── .gitignore                 # Prevents .env.local from being committed
├── src/
│   ├── components/
│   │   ├── SimpleChatbot.jsx  # Main chatbot component
│   │   └── SimpleChatbot.css  # Modern UI styling
│   ├── App.js
│   └── index.js
└── package.json
```

---

## Important Security Notes

🔒 **Your API key is stored locally in `.env.local`**
- This file is git-ignored (not committed to version control)
- Keep it private and never share it
- The key is only used in your browser
- Each request uses your account's API credits

---

## Troubleshooting

### "Port 3000 is already in use"
The script will automatically ask to use a different port. Answer `yes` to continue.

### "API key not working"
1. Verify the key starts with `sk-proj-`
2. Check you copied the entire key without spaces
3. Go to https://platform.openai.com/account/api-keys to verify the key exists
4. Make sure you have credits remaining

### "Command not found"
For PowerShell: Your execution policy might block scripts. Try:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## Start Chatting! 🚀

Once the setup is complete:
1. The browser opens automatically to http://localhost:3000
2. The chatbot is ready to use with your AI assistant
3. Chat history is saved locally in your browser
4. Your API key is never exposed to anyone

Enjoy your AI chatbot! 💬
