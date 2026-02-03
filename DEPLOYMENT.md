# Deploying Bourdain Tracker to bourdaintracker.com

## Prerequisites
- GitHub account
- Vercel account (free)
- Your domain: bourdaintracker.com

---

## Step 1: Push to GitHub

### 1.1 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `bourdain-tracker`
3. Keep it **Public** (or Private if you prefer)
4. Don't initialize with README (you already have files)
5. Click "Create repository"

### 1.2 Push Your Code
Run these commands in your terminal:

```powershell
# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/bourdain-tracker.git

# Rename branch to main
git branch -M main

# Push code
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Step 2: Deploy to Vercel

### 2.1 Sign Up for Vercel
1. Go to https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel to access your repositories

### 2.2 Import Your Project
1. Click "Add New..." → "Project"
2. Find "bourdain-tracker" in the list
3. Click "Import"
4. **No configuration needed** - click "Deploy"
5. Wait ~30 seconds for deployment

Your site is now live at: `https://bourdain-tracker.vercel.app`

---

## Step 3: Connect Your Custom Domain

### 3.1 Add Domain in Vercel
1. In your Vercel project, click "Settings"
2. Click "Domains" in the sidebar
3. Enter `bourdaintracker.com` and click "Add"
4. Also add `www.bourdaintracker.com`

### 3.2 Update DNS Settings
Vercel will show you which DNS records to add. Go to your domain registrar (where you bought bourdaintracker.com) and add:

**For bourdaintracker.com:**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21`

**For www.bourdaintracker.com:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`

### 3.3 Wait for DNS Propagation
- DNS changes can take 5-48 hours
- Usually works within 1-2 hours
- Vercel will show "Valid Configuration" when ready

---

## Step 4: Configure Firebase (Optional)

After deployment, update Firebase settings:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Project Settings → General
3. Under "Your apps", find your web app
4. Add authorized domains:
   - `bourdaintracker.com`
   - `www.bourdaintracker.com`
   - `bourdain-tracker.vercel.app`

5. In Authentication → Settings → Authorized domains:
   - Add `bourdaintracker.com`
   - Add `www.bourdaintracker.com`

---

## Step 5: Future Updates

### Making Changes
1. Edit files locally
2. Test by opening `index.html` in browser
3. Commit changes:
   ```powershell
   git add .
   git commit -m "Description of changes"
   git push
   ```
4. Vercel automatically redeploys within seconds!

### Add More Restaurants
1. Edit `data.js`
2. Add new restaurant objects
3. Update the count in `index.html` header
4. Push to GitHub → Auto-deploy

---

## Useful Commands

```powershell
# Check git status
git status

# Create a new commit
git add .
git commit -m "Your message here"
git push

# View git history
git log --oneline

# Undo last commit (keeps changes)
git reset --soft HEAD~1
```

---

## Troubleshooting

**Problem: Domain not working after 24 hours**
- Check DNS propagation: https://www.whatsmydns.net/
- Verify DNS records match Vercel's instructions exactly
- Try clearing browser cache (Ctrl+Shift+R)

**Problem: Firebase sign-in not working on live site**
- Make sure you added the domain to Firebase authorized domains
- Check browser console for errors (F12)
- Verify `firebase-config.js` has correct credentials

**Problem: Changes not showing after git push**
- Check Vercel dashboard for deployment status
- Look for build errors in Vercel logs
- Hard refresh browser (Ctrl+Shift+R)

---

## Success Checklist

✅ Code pushed to GitHub  
✅ Site deployed on Vercel  
✅ Domain connected (bourdaintracker.com)  
✅ HTTPS working automatically  
✅ Firebase configured (if using auth)  
✅ Can mark restaurants as visited  
✅ Data syncs across devices  

---

## What You Get

🚀 **Instant Deployments** - Push to GitHub, live in seconds  
🔒 **Free HTTPS** - Automatic SSL certificate  
🌍 **Global CDN** - Fast worldwide  
📱 **Mobile Optimized** - Works on all devices  
♾️ **Unlimited Bandwidth** - Vercel free tier  
🔄 **Auto Updates** - Just git push to deploy  

---

Your site will be live at:
- https://bourdaintracker.com
- https://www.bourdaintracker.com
- https://bourdain-tracker.vercel.app (backup URL)

Happy tracking! 🍴✈️
