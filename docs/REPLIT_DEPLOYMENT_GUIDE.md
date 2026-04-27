# Deploy on Replit (FREE - No Credit Card)

**REPLIT IS THE EASIEST OPTION!** ✨

## What is Replit?

- **Free cloud IDE** - Code in the browser
- **Instant deployment** - Click "Run" and get a live URL
- **No credit card needed** - Just sign up
- **Supports full-stack apps** - Frontend + Backend together
- **Live URL in seconds** - Share with anyone

---

## STEP-BY-STEP DEPLOYMENT (5 Minutes)

### Step 1: Create Replit Account (1 minute)

1. Go to: https://replit.com
2. Click **"Sign Up"**
3. Use Google/GitHub account (fastest) OR email
4. **No credit card required!**

---

### Step 2: Create New Replit (1 minute)

1. Click **"Create"** button (top left)
2. Click **"Create Repl"**
3. Choose template: **"Node.js"**
4. Name: `chatbot-app`
5. Click **"Create Repl"**

---

### Step 3: Upload Your Code (2 minutes)

You'll see a code editor. Now upload your project files:

**Option A: Upload via UI (Easiest)**

1. Click **"Upload file"** button (folder icon at top)
2. Drag and drop your entire project folder
3. Or select files manually

**Option B: Initialize Git (If familiar with Git)**

```bash
git clone https://github.com/YOUR_REPO
```

---

### Step 4: Configure Package.json

Replit needs a `package.json` to know how to run your app.

Create a file called `package.json` in the root with:

```json
{
  "name": "chatbot-app",
  "version": "1.0.0",
  "description": "Student Chatbot Application",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "body-parser": "^1.20.2",
    "axios": "^1.4.0"
  }
}
```

---

### Step 5: Create Server File

Create `server.js` in root directory:

```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend-chatbot/build')));

// Backend API Routes (if you're connecting to separate backend)
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

// Serve React Frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend-chatbot/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Chatbot running at http://localhost:${PORT}`);
});
```

---

### Step 6: Install Dependencies

In Replit terminal (bottom of screen), type:

```bash
npm install
```

---

### Step 7: Run Your App

Click the **"Run"** button (top center)

You should see:
```
🚀 Chatbot running at http://localhost:3000
```

---

### Step 8: Get Your Live URL

Look for the **URL** displayed after "Run" completes, like:

```
https://chatbot-app.YOUR_USERNAME.repl.co
```

Copy that URL and share with anyone! ✨

---

## IMPORTANT CONFIGURATION

### Update API URL in Frontend

Your frontend needs to know where your backend API is located.

**If backend is on separate server:**

Edit `frontend-chatbot/src/index.js`:

```javascript
// Add this before anything else
window.API_BASE_URL = 'https://your-backend-url/api';
```

**If backend is on same Replit:**

API URL is just `/api` (no changes needed - it's local!)

---

## TROUBLESHOOTING

### Problem: "Module not found"

**Solution:**
```bash
npm install
```

### Problem: "Port 3000 already in use"

**Solution:** Change PORT in server.js to 8080

### Problem: Frontend shows blank screen

**Solution:** 
1. Make sure `frontend-chatbot/build` exists
2. Run: `npm run build` from `frontend-chatbot` folder first

### Problem: Backend API not responding

**Solution:**
1. Check if backend is running on different server
2. Update `API_BASE_URL` in frontend with correct URL
3. Check CORS settings in server.js

---

## FEATURES YOU GET

✅ **FREE forever** (no expiration)
✅ **Live URL** - Share with anyone
✅ **Auto-restart** if it crashes
✅ **Built-in console** - See errors instantly
✅ **Easy editing** - Change code and auto-reload
✅ **Team collaboration** - Invite others
✅ **Multiplayer editing** - Work together in real-time
✅ **Free database** support (if you add one)

---

## LIMITS (Still Generous!)

| Feature | Limit |
|---------|-------|
| Monthly runtime | 50 hours (more than enough!) |
| Compute power | Shared resources |
| Storage | 5 GB total |
| Always-on | Not included (stops after 30 mins inactivity) |

**For your chatbot: PERFECT! You get 50 hours/month - that's 66 days of 24/7 running!**

---

## NEXT STEPS

1. **Sign up:** https://replit.com
2. **Create repl** with Node.js template
3. **Upload your files**
4. **Create package.json** (copy from above)
5. **Create server.js** (copy from above)
6. **Run npm install**
7. **Click Run**
8. **Share the URL!**

---

## ADMIN DASHBOARD (Optional)

After deployment, Replit gives you:
- **Real-time logs** - See what's happening
- **Restart button** - Quick restart if needed
- **Env variables** - Store secrets safely
- **Version history** - See all changes

---

## UPGRADE OPTIONS (If needed later)

Replit also has paid plans if you want:
- Always-on deployment (never stops)
- More compute power
- Priority support

But for now, the **FREE tier is perfect!**

---

## STILL NEED HELP?

**Replit Support:** https://docs.replit.com
**Discord Community:** https://discord.gg/replit

---

## SUMMARY

| Step | Time | Action |
|------|------|--------|
| 1 | 1 min | Sign up on Replit |
| 2 | 1 min | Create Node.js Repl |
| 3 | 2 min | Upload your code |
| 4 | - | Install dependencies |
| 5 | - | Click "Run" |
| 6 | INSTANT | Get live URL! |

**Total: 5 minutes from start to live website** 🚀

---

**Your chatbot will be live on:**
```
https://chatbot-app.YOUR_USERNAME.repl.co
```

**Share that URL with anyone and they can use your chatbot!**

---
