# FarmLife RPG - Vercel Deployment Guide

## Prerequisites

1. GitHub repository with your code (already done!)
2. Neon Postgres database (already configured)
3. Vercel account (free tier works great!)

## Deployment Steps

### 1. Import Project to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository: `comaeclipse/FarmLife`
4. Vercel will auto-detect Next.js

### 2. Configure Environment Variables

**IMPORTANT**: Add these BEFORE clicking Deploy!

During import or in Project Settings → Environment Variables, add:

**Name:** `DATABASE_URL`
**Value:** `your-neon-database-url-with-pooling`
**Environment:** Production, Preview, Development (select all)

**Name:** `DIRECT_URL`
**Value:** `your-neon-database-url-without-pooling`
**Environment:** Production, Preview, Development (select all)

Make sure to click "Add" after each variable!

**Where to find these values:**
- Go to your Neon dashboard at https://console.neon.tech
- Select your database project
- Copy the connection string (it starts with `postgresql://...`)
- For DATABASE_URL: Use the pooled connection (default)
- For DIRECT_URL: Use the direct connection (toggle "Pooled connection" off)

### 3. Build Settings

Vercel should auto-detect these, but verify:

- **Framework Preset**: Next.js
- **Build Command**: `npx prisma generate && next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 4. Deploy

1. Click "Deploy"
2. Wait for build to complete (1-2 minutes)
3. Your game will be live at `your-project-name.vercel.app`

## Post-Deployment

### Running Migrations

After first deployment, you need to run migrations:

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Pull env variables: `vercel env pull`
4. Run migrations: `npx prisma migrate deploy`

Alternatively, you can run migrations locally since you're using Neon's cloud database:

```bash
npx prisma migrate deploy
```

### Automatic Deployments

Every push to the `main` branch will automatically deploy to production!

## Vercel-Specific Configuration

The project is already configured for Vercel with:

- Next.js 15 App Router (fully compatible)
- Server Actions (no API routes needed)
- Neon Postgres with connection pooling
- Edge-ready Prisma setup

## Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Monitoring

Vercel provides:
- Real-time logs
- Performance analytics
- Error tracking
- Deployment history

Access these in your project dashboard.

## Troubleshooting

### Database Connection Issues

- Ensure `DATABASE_URL` is set correctly
- Check Neon dashboard for connection status
- Verify IP allowlist (Neon allows all by default)

### Build Failures

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

### Runtime Errors

- Check Function Logs in Vercel dashboard
- Verify Prisma schema matches database
- Check if migrations ran successfully

## Cost Considerations

**Free tier includes:**
- 100GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Global CDN

Perfect for hobby projects!

---

Your FarmLife RPG is now ready to share with the world! 🌾
