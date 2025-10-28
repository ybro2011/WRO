# 🚀 How to Deploy MCP Hub to Render.com

## Quick Steps (10 minutes)

### Step 1: Create PostgreSQL Database
1. Go to https://render.com
2. Sign up/login with GitHub
3. Click "New +" → "PostgreSQL"
4. Name: `xiaozhi-mcphub-db`
5. Plan: Free
6. Click "Create Database"
7. Wait ~30 seconds

### Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Connect repository: `ybro2011/WRO`
3. Settings:
   - **Root Directory:** `xiaozhi-mcphub-main`
   - **Branch:** `main`
   - **Build Command:** `pnpm install && pnpm run build`
   - **Start Command:** `pnpm start`
   - **Plan:** Free

### Step 3: Link Database
1. Scroll to "Environment Variables"
2. Click "Link PostgreSQL Database"
3. Select `xiaozhi-mcphub-db`

### Step 4: Add Other Variables
Add these environment variables:
- `NODE_ENV` = `production`
- `SMART_ROUTING_ENABLED` = `false`
- `ENABLE_CORS` = `true`

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait ~5-10 minutes
3. Your app will be live at: `https://xiaozhi-mcphub.onrender.com`

## ✅ Done!

Your MCP Hub is now deployed to Render.com

