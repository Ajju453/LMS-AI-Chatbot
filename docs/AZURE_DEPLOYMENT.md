# 🚀 Azure Deployment Guide (FREE Tier)

## ✅ What You Get (FREE)
- Azure Container Instances: **50 ACU hours/month FREE**
- Docker Hub: FREE image hosting
- Total Cost: **$0**

---

## 📋 Prerequisites
1. **Azure Account** (FREE - sign up at https://azure.microsoft.com/free/)
2. **Docker Desktop** (already used locally)
3. **Docker Hub Account** (FREE - sign up at https://hub.docker.com/)
4. **Azure CLI** (download from https://docs.microsoft.com/cli/azure/)

---

## 🔧 Step 1: Build & Push Docker Images

### 1.1 Login to Docker Hub
```powershell
docker login
# Enter your Docker Hub username and password
```

### 1.2 Build and Push Backend Image
```powershell
cd backend

# Build image
docker build -t yourdockerhubusername/chatbot-backend:latest .

# Push to Docker Hub
docker push yourdockerhubusername/chatbot-backend:latest
```

### 1.3 Build and Push Frontend Image
```powershell
cd ../frontend-chatbot

# Build image
docker build -t yourdockerhubusername/chatbot-frontend:latest .

# Push to Docker Hub
docker push yourdockerhubusername/chatbot-frontend:latest
```

---

## ☁️ Step 2: Deploy to Azure Container Instances

### 2.1 Login to Azure
```powershell
az login
# This opens a browser to authenticate
```

### 2.2 Create Resource Group
```powershell
az group create `
  --name chatbot-rg `
  --location eastus
```

### 2.3 Create Container Registry (Optional, but recommended)
```powershell
az acr create `
  --resource-group chatbot-rg `
  --name chatbotregistry `
  --sku Basic
```

### 2.4 Deploy Backend Container
```powershell
az container create `
  --resource-group chatbot-rg `
  --name chatbot-backend `
  --image yourdockerhubusername/chatbot-backend:latest `
  --cpu 1 `
  --memory 1 `
  --port 8080 `
  --protocol TCP `
  --environment-variables `
    SPRING_PROFILES_ACTIVE=prod `
    SPRING_DATASOURCE_URL="jdbc:h2:mem:learning_path_db" `
    SPRING_H2_CONSOLE_ENABLED=true
```

### 2.5 Get Backend IP and Port
```powershell
az container show `
  --resource-group chatbot-rg `
  --name chatbot-backend `
  --query ipAddress.ip `
  --output table
```

### 2.6 Deploy Frontend Container
```powershell
az container create `
  --resource-group chatbot-rg `
  --name chatbot-frontend `
  --image yourdockerhubusername/chatbot-frontend:latest `
  --cpu 1 `
  --memory 1 `
  --port 3000 `
  --protocol TCP `
  --environment-variables `
    REACT_APP_API_URL="http://BACKEND_IP:8080/api"
```
*Replace BACKEND_IP with the IP from Step 2.5*

---

## 🌐 Access Your Application

### Check Container Status
```powershell
az container show `
  --resource-group chatbot-rg `
  --name chatbot-frontend `
  --query ipAddress.fqdns[0] `
  --output table
```

### Your App URL
```
http://FRONTEND_IP:3000
```

---

## 💰 Cost Breakdown (FREE Tier)

| Service | Free Usage | Your Usage | Cost |
|---------|-----------|-----------|------|
| ACU Hours/month | 50 ACU-hrs | ~25 hrs (2 containers × 12.5 hrs) | $0 |
| Storage | 5 GB | ~100 MB | $0 |
| Total Monthly Cost | - | - | **$0** ✅ |

---

## 📊 Monitoring

### View Container Logs
```powershell
az container logs `
  --resource-group chatbot-rg `
  --name chatbot-backend
```

### View Container Details
```powershell
az container show `
  --resource-group chatbot-rg `
  --name chatbot-frontend `
  --output table
```

---

## 🛑 Stop Containers (to save free hours)
```powershell
az container stop `
  --resource-group chatbot-rg `
  --name chatbot-backend

az container stop `
  --resource-group chatbot-rg `
  --name chatbot-frontend
```

---

## 🗑️ Delete Resources (Clean up)
```powershell
az group delete `
  --name chatbot-rg `
  --yes
```

---

## ⚠️ Important Notes

1. **Free tier limit**: 50 ACU hours/month
   - 1 ACU = 1 CPU core + 1 GB memory
   - Perfect for learning & development

2. **H2 In-Memory Database**: Data is lost when container restarts
   - For production, add Azure Database for PostgreSQL

3. **Public IP**: Each container gets a public IP
   - Accessible worldwide ✅

4. **No auto-scaling** on free tier
   - Manual scaling available

---

## 🎯 Alternative: Use Azure App Service (Even Simpler)

```powershell
# Create App Service Plan (F1 Free Tier)
az appservice plan create `
  --name chatbot-plan `
  --resource-group chatbot-rg `
  --sku F1 `
  --is-linux

# Deploy WAR file
az webapp create `
  --resource-group chatbot-rg `
  --plan chatbot-plan `
  --name chatbot-app `
  --runtime "JAVA|17-java17"
```

---

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| Containers won't start | Check logs: `az container logs --resource-group chatbot-rg --name chatbot-backend` |
| Frontend can't reach backend | Update `REACT_APP_API_URL` environment variable |
| Permission denied | Login: `az login` and ensure correct subscription |

---

**Your app is now live on Azure (FREE)! 🎉**
