# NASA Explorer - Vercel Deployment Guide

This guide will help you deploy your NASA Explorer application to Vercel with both frontend and backend functionality.

## Deployment Steps

### 1. Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- NASA API key (get one at [api.nasa.gov](https://api.nasa.gov))

### 2. Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

### 3. Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. **Connect Repository:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings:**
   - **Framework Preset:** Other
   - **Root Directory:** Leave empty (monorepo setup)
   - **Build Command:** `cd frontend && npm ci && npm run build`
   - **Output Directory:** `frontend/dist`
   - **Install Command:** `cd frontend && npm ci`

3. **Set Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add the following variables:
     ```
     NASA_API_KEY=your_nasa_api_key_here
     NODE_ENV=production
     ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete

#### Option B: Using Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables:**
   ```bash
   vercel env add NASA_API_KEY
   vercel env add NODE_ENV
   ```

### 4. Configure Environment Variables

In your Vercel dashboard, add these environment variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `NASA_API_KEY` | Your NASA API key | Required for NASA API access |
| `NODE_ENV` | `production` | Sets the environment mode |

### 5. Verify Deployment

After deployment, test these endpoints:

- **Health Check:** `https://your-app.vercel.app/api/health`
- **APOD:** `https://your-app.vercel.app/api/apod`
- **NEO:** `https://your-app.vercel.app/api/neo`
- **Frontend:** `https://your-app.vercel.app`

## API Endpoints

### APOD (Astronomy Picture of the Day)
- `GET /api/apod` - Today's APOD
- `GET /api/apod?date=YYYY-MM-DD` - Specific date
- `GET /api/apod?count=5` - Random APODs (1-10)
- `GET /api/apod?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` - Date range

### NEO (Near Earth Objects)
- `GET /api/neo` - Current week's NEOs
- `GET /api/neo?today=true` - Today's NEOs
- `GET /api/neo?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` - Date range (max 7 days)
- `GET /api/neo?stats=true` - NEO statistics
- `GET /api/neo?id=123456` - Specific NEO by ID

### Health Check
- `GET /api/health` - API health status

## Troubleshooting

### Common Issues

1. **Build Fails:**
   - Check that all dependencies are listed in `package.json`
   - Verify TypeScript compilation passes locally
   - Check build logs in Vercel dashboard

2. **API Returns 500 Errors:**
   - Verify NASA_API_KEY is set correctly
   - Check function logs in Vercel dashboard
   - Test API endpoints locally first

3. **Frontend Not Loading:**
   - Verify build output directory is correct
   - Check that `VITE_API_URL=/api` is set
   - Ensure all assets are being built correctly

4. **CORS Issues:**
   - API functions include CORS headers
   - Frontend and API are on same domain (no CORS needed)

### Debugging

1. **Check Function Logs:**
   - Go to Vercel Dashboard → Functions
   - Click on a function to see logs

2. **Test Locally:**
   ```bash
   # Test frontend
   cd frontend
   npm run dev

   # Test API functions with Vercel CLI
   vercel dev
   ```

## Performance Optimization

1. **Caching:**
   - API responses are cached at the edge
   - Static assets are served from CDN

2. **Cold Starts:**
   - Functions warm up automatically
   - Consider upgrading to Pro for better performance

## Security

1. **Environment Variables:**
   - Never commit API keys to repository
   - Use Vercel's environment variable system

2. **API Rate Limiting:**
   - NASA API has rate limits
   - Consider implementing client-side caching

## Monitoring

1. **Analytics:**
   - Enable Vercel Analytics in dashboard
   - Monitor function performance

2. **Error Tracking:**
   - Check function logs regularly
   - Set up alerts for errors

## Custom Domain (Optional)

1. **Add Domain:**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed

## Continuous Deployment

- Automatic deployments on git push to main branch
- Preview deployments for pull requests
- Rollback capability in Vercel dashboard