# Vercel + Turso Deployment Guide

## Overview

Website: Vercel (Free Plan)  
Database: Turso (Free Plan - 500MB storage, 1B row reads/month)

---

## Step 1: Install Turso CLI

Windows (PowerShell):
```powershell
scoop install turso
```

Ya phir:
```bash
npm install -g @tursodatabase/cli
```

Login:
```bash
turso auth login
```

---

## Step 2: Create Turso Database

```bash
# Create database
turso db create glovax-db

# Get the URL (save this)
turso db show glovax-db --url
# Output example: libsql://glovax-db-ahmad.turso.io

# Create auth token (save this)
turso db tokens create glovax-db
# Output example: eyJhbGciOiJFZERTQSJ9...
```

---

## Step 3: Seed Turso Database

Uncomment ya add these in your `.env.local`:

```env
DATABASE_URL=libsql://glovax-db-YOURNAME.turso.io
DATABASE_AUTH_TOKEN=YOUR-TURSO-AUTH-TOKEN
```

Then run:
```bash
# Generate migration
npm run db:generate

# Apply migration to Turso
npm run db:migrate

# Seed data
npm run db:seed
```

---

## Step 4: Push to GitHub

```bash
git add .
git commit -m "Add admin panel with Turso DB"
git push
```

---

## Step 5: Create Vercel Project

1. Go to [vercel.com](https://vercel.com) and Sign Up (Free)
2. Click **Add New Project**
3. Connect your GitHub repo
4. Framework: Next.js (auto-detected)
5. Click **Deploy**

After deploy, go to project Settings:

### Environment Variables

Add these in **Settings > Environment Variables**:

| Name | Value |
|------|-------|
| `DATABASE_URL` | `libsql://glovax-db-YOURNAME.turso.io` |
| `DATABASE_AUTH_TOKEN` | `YOUR-TURSO-AUTH-TOKEN` |
| `ADMIN_PASSWORD` | `glovax-admin-2026` (or your own) |
| `JWT_SECRET` | Generate a random 32+ char string |
| `RESEND_API_KEY` | `re_YOUR-RESEND-API-KEY` (from resend.com/api-keys) |
| `OWNER_EMAIL` | `ahmad765rajput@gmail.com` |

**IMPORTANT**: Add the same variables in:
- Production
- Preview
- Development (if you want preview deployments to work too)

Then click **Redeploy**.

---

## Step 6: Access Admin Panel

- Website: `https://your-project.vercel.app`
- Admin: `https://your-project.vercel.app/admin`
- Password: Whatever you set in `ADMIN_PASSWORD`

---

## Cost (Both Free Plans)

| Service | Free Tier |
|---------|-----------|
| Vercel | Unlimited bandwidth, 100GB-hours/month |
| Turso | 500MB storage, 1 billion row reads/month |

---

## Troubleshooting

### Build fails with DB error?
Vercel build step mein static pages generate hoti hain. API routes runtime pe chalti hain, isliye DB error production mein nahi ayega agar env vars sahi set hain.

### Admin login kaam nahi karta?
`JWT_SECRET` env var check karein. Local `.env.local` mein jo value hai wo Vercel pe match nahi karegi agar alag set ki ho.

### Data gayab ho gaya?
Turso database persistent hai. Agar local dev karte waqt data gayab hua to local SQLite (`sqlite.db`) delete ho sakti hai. Production mein Turso pe data safe hai.
