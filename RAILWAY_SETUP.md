# Railway Deployment - Complete Setup Guide

This guide will get ResearchOS fully deployed in ~5 minutes with database included.

---

## What You'll Get

✅ Full ResearchOS application running in the cloud  
✅ PostgreSQL database (free tier: 1GB)  
✅ Automatic HTTPS and custom domain  
✅ Auto-deploy on every GitHub push  
✅ $5 free monthly credit (enough for small projects)  

---

## Step-by-Step Setup

### 1. Sign Up for Railway

1. Go to: **https://railway.app**
2. Click **"Login"** or **"Start a New Project"**
3. Choose **"Login with GitHub"**
4. Authorize Railway to access your GitHub account

---

### 2. Create New Project

1. Click **"+ New Project"** button
2. Select **"Deploy from GitHub repo"**
3. Choose **`sukesh19o224-cpu/ElctrDc`** from the list
4. Click on the repository to deploy it

---

### 3. Add PostgreSQL Database

1. In your Railway project dashboard, click **"+ New"**
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Railway will automatically:
   - Create the database
   - Generate a `DATABASE_URL` environment variable
   - Link it to your application

---

### 4. Configure Environment Variables

1. Click on your **ResearchOS service** (not the database)
2. Go to the **"Variables"** tab
3. Click **"+ New Variable"**
4. Add these variables:

```bash
# This one is auto-created by Railway when you added PostgreSQL
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Generate a random secret (use the command below or generate online)
NEXTAUTH_SECRET=your-random-32-character-secret-key-here

# Railway provides this automatically
NEXTAUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}
```

**To generate NEXTAUTH_SECRET:**
- Windows PowerShell:
  ```powershell
  -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
  ```
- Or use: https://generate-secret.vercel.app/32

---

### 5. Set Build Configuration (Important!)

1. Still in your service settings, go to **"Settings"** tab
2. Find **"Build Command"**
3. Change it to:
   ```bash
   npm install --legacy-peer-deps && npx prisma generate && npm run build
   ```

4. Find **"Start Command"**
5. Set it to:
   ```bash
   npm run start
   ```

6. Under **"Environment"**, make sure:
   - **Node Version**: `20.x`

---

### 6. Deploy!

1. Railway will automatically start building
2. Wait 2-3 minutes for the build to complete
3. Once done, you'll see a **"Deployment successful"** message
4. Click on the **"Deployments"** tab
5. Click on your deployment to get the public URL

---

### 7. Set Up Database Schema

After first deployment, you need to initialize the database:

1. In Railway, click on your **ResearchOS service**
2. Go to **"Settings"** → **"Deploy"** → **"Custom Start Command"**
3. Temporarily change start command to:
   ```bash
   npx prisma db push --accept-data-loss && npm run start
   ```
4. This will create all database tables
5. After the deployment succeeds, you can change it back to `npm run start`

**OR** use Railway CLI (easier):

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run Prisma migration
railway run npx prisma db push
```

---

## Your App is Live! 🎉

Your ResearchOS instance will be available at:
- `https://your-project-name.up.railway.app`

You can also:
- Add a custom domain in **Settings** → **Networking**
- View logs in **Deployments** → **View Logs**
- Monitor usage in **Metrics** tab

---

## Auto-Deploy Setup

Railway automatically deploys when you push to GitHub!

Every time you push to the `main` branch:
1. Railway detects the change
2. Automatically builds and deploys
3. Updates your live site in ~2 minutes

---

## Troubleshooting

### Build Fails with "peer dependency" errors
- Make sure build command includes `--legacy-peer-deps`
- Command: `npm install --legacy-peer-deps && npm run build`

### Database Connection Errors
- Check that `DATABASE_URL` variable exists
- Should be set to `${{Postgres.DATABASE_URL}}`
- Make sure PostgreSQL service is running

### App Crashes on Start
- Check logs in **Deployments** → **View Logs**
- Make sure you ran `npx prisma db push` to create tables
- Verify `NEXTAUTH_SECRET` is set and at least 32 characters

### "prisma command not found"
- Make sure build command includes `npx prisma generate`
- Full command: `npm install --legacy-peer-deps && npx prisma generate && npm run build`

---

## Railway vs Vercel

| Feature | Railway | Vercel |
|---------|---------|--------|
| Free Tier | $5/month credit | 100GB bandwidth |
| Database | ✅ Included | ❌ Need external |
| Build Time | ~2-3 min | ~1-2 min |
| Deployment | Git push | Git push |
| Custom Domain | ✅ Free | ✅ Free |
| Best For | Full-stack apps | Frontend + API |

---

## Cost Estimate (Free Tier)

With $5 monthly credit:
- **App**: ~$2-3/month (always-on)
- **PostgreSQL**: ~$1-2/month (1GB)
- **Total**: ~$3-5/month (covered by free credit!)

If you exceed the free credit, you'll only pay for what you use beyond $5.

---

## Next Steps

After deployment:
1. Visit your app URL
2. Register a new account
3. Create your first project
4. Upload electrochemistry data
5. Create visualizations!

---

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- ResearchOS Issues: https://github.com/sukesh19o224-cpu/ElctrDc/issues

---

## Quick Deploy (One Command)

If you have Railway CLI installed:

```bash
# Login
railway login

# Deploy (will create project, add database, deploy)
railway up

# Add environment variables
railway variables set NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Run database migration
railway run npx prisma db push

# Get your URL
railway domain
```

---

**You're all set!** Your ResearchOS instance should now be fully functional with all features working. 🚀
