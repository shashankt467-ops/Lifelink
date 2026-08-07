# 🚀 Step-by-Step Production Deployment Guide

This guide explains how to publish the **Anti Gravity Healthcare Platform** so it runs **24/7 in the cloud** and can be accessed from any mobile phone, tablet, or laptop even when your local computer is OFF.

---

## 📌 Production Architecture Overview

```
                          GitHub Repository
                                 │
           ┌─────────────────────┴─────────────────────┐
           ▼                                           ▼
  React / Vite Frontend                       FastAPI Python Backend
   (Deployed on Vercel)                        (Deployed on Render)
   https://your-app.vercel.app                  https://your-backend.onrender.com
           │                                           │
           ├─────────────────────┬─────────────────────┘
           ▼                     ▼
OpenStreetMap / Nominatim   Firebase Auth
 (Free Map Discovery)       (User Auth & Cloud)
```

---

## Step 1: Push Repository to GitHub

1. Open your terminal in the project root folder (`c:\Users\pc\Desktop\viki`).
2. Run the following Git commands:

```bash
# Check repository status
git status

# Add all files
git add .

# Commit changes
git commit -m "Prepare Anti Gravity Healthcare Platform for production deployment"

# Ensure main branch
git branch -M main

# Add your GitHub repository remote (replace <YOUR_GITHUB_REPO_URL> with your URL)
# Example: git remote add origin https://github.com/your-username/anti-gravity-healthcare.git
git remote add origin <YOUR_GITHUB_REPO_URL>

# Push to GitHub
git push -u origin main
```

*(Note: If `git remote origin` already exists, you can check it with `git remote -v` or update it with `git remote set-url origin <YOUR_GITHUB_REPO_URL>`)*

---

## Step 2: Deploy Frontend to Vercel (100% Free)

1. Go to [https://vercel.com](https://vercel.com) and log in (or sign up with GitHub).
2. Click **"Add New..."** → **"Project"**.
3. Import your GitHub repository (`anti-gravity-healthcare`).
4. Configure the Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` *(Click Edit and select the `frontend` directory)*
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**.
6. Once deployed, Vercel will give you a public URL (e.g. `https://my-healthcare-platform.vercel.app`).

---

## Step 3: Deploy Backend to Render (100% Free)

1. Go to [https://render.com](https://render.com) and log in (or sign up with GitHub).
2. Click **"New +"** → **"Web Service"**.
3. Connect your GitHub repository (`anti-gravity-healthcare`).
4. Configure the Web Service:
   - **Name**: `anti-gravity-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click **"Advanced"** → Add Environment Variable:
   - Key: `CORS_ORIGINS`
   - Value: `https://my-healthcare-platform.vercel.app` *(Your Vercel URL)*
6. Click **"Create Web Service"**.
7. Once deployed, copy your Render backend URL (e.g. `https://anti-gravity-backend.onrender.com`).

---

## Step 4: Link Frontend to Render Backend (Environment Variables)

1. Return to your Vercel Dashboard for the frontend project.
2. Go to **Settings** → **Environment Variables**.
3. Add a new variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://anti-gravity-backend.onrender.com`
4. Click **Save**.
5. Go to the **Deployments** tab in Vercel and click **"Redeploy"** to apply the new environment variable.

---

## Step 5: Configure Firebase Authorized Domains

If you are using real Firebase Authentication:
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your Firebase project.
3. Go to **Authentication** → **Settings** → **Authorized domains**.
4. Click **"Add domain"**.
5. Enter your Vercel deployment domain:
   `my-healthcare-platform.vercel.app`
6. Click **Save**.

---

## Step 6: Test from Mobile Phone & Laptop

1. Open your smartphone browser (Chrome, Safari, Firefox).
2. Visit your Vercel URL: `https://my-healthcare-platform.vercel.app`
3. Test key features:
   - ✅ **Use My Location**: Grant browser location access (HTTPS is automatically enabled on Vercel).
   - ✅ **Nearby Hospitals**: Confirm OpenStreetMap tile loading & hospital markers.
   - ✅ **Change Location**: Test changing city to Pune, Mumbai, Chennai, Bengaluru, Delhi.
   - ✅ **Find Doctors**: Search doctors & test appointment booking.
   - ✅ **Emergency SOS**: Test emergency hospital search.
