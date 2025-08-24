# Deployment Guide

This guide covers deployment strategies and configurations for the application.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Vercel Deployment](#vercel-deployment)
- [GitHub Actions CI/CD](#github-actions-cicd)
- [Database Setup](#database-setup)
- [Monitoring & Analytics](#monitoring--analytics)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- [ ] Vercel account
- [ ] GitHub repository configured
- [ ] Database (Neon) account
- [ ] Environment variables prepared
- [ ] Domain name (optional)

## Environment Configuration

### Required Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database
NEON_DATABASE_URL=your-neon-database-url

# Authentication
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key

# Stack Auth (if using)
STACK_PROJECT_ID=your-stack-project-id
STACK_PUBLISHABLE_CLIENT_KEY=your-publishable-key
STACK_SECRET_SERVER_KEY=your-secret-server-key

# Analytics & Monitoring
VERCEL_ANALYTICS_ID=your-analytics-id
SENTRY_DSN=your-sentry-dsn

# External Services
SLACK_WEBHOOK_URL=your-slack-webhook
```

### Environment-Specific Variables

#### Development
```env
NODE_ENV=development
LOG_LEVEL=debug
API_URL=http://localhost:3000
```

#### Staging
```env
NODE_ENV=staging
LOG_LEVEL=info
API_URL=https://staging.myapp.com
```

#### Production
```env
NODE_ENV=production
LOG_LEVEL=error
API_URL=https://myapp.com
```

## Vercel Deployment

### Initial Setup

1. **Connect Repository**
   ```bash
   vercel link
   ```

2. **Configure Project**
   ```bash
   vercel env pull .env.local
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add DATABASE_URL
   vercel env add NEXTAUTH_SECRET
   # Add all required variables
   ```

### Deployment Commands

#### Production Deployment
```bash
vercel --prod
```

#### Preview Deployment
```bash
vercel
```

#### Deploy from GitHub Actions
```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
    vercel-args: '--prod'
```

### Custom Domain Configuration

1. **Add Domain in Vercel Dashboard**
   - Go to Project Settings > Domains
   - Add your custom domain
   - Configure DNS records

2. **DNS Configuration**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

## GitHub Actions CI/CD

### Workflow Configuration

The CI/CD pipeline is configured in `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
```

### Deployment Strategy

#### Branch-Based Deployments

- **main** → Production environment
- **develop** → Staging environment
- **feature/** → Preview deployments

#### Deployment Flow

1. Push code to GitHub
2. GitHub Actions runs tests
3. If tests pass, deploy to Vercel
4. Send notifications to Slack/Discord

### Setting Up Secrets

```bash
# GitHub CLI
gh secret set VERCEL_TOKEN --body="your-token"
gh secret set VERCEL_ORG_ID --body="your-org-id"
gh secret set VERCEL_PROJECT_ID --body="your-project-id"
gh secret set DATABASE_URL --body="your-database-url"
```

## Database Setup

### Neon Database Configuration

1. **Create Database**
   ```sql
   CREATE DATABASE myapp_production;
   ```

2. **Run Migrations**
   ```bash
   npm run db:migrate
   ```

3. **Seed Data (Optional)**
   ```bash
   npm run db:seed
   ```

### Connection Pooling

Configure connection pooling for production:

```javascript
// lib/db.js
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL, {
  pooled: true,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## Monitoring & Analytics

### Vercel Analytics

1. **Enable Analytics**
   - Go to Project Settings > Analytics
   - Enable Web Analytics
   - Add to your app:

```javascript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Sentry Error Tracking

1. **Install Sentry**
   ```bash
   npm install @sentry/nextjs
   ```

2. **Configure Sentry**
   ```javascript
   // sentry.client.config.js
   import * as Sentry from '@sentry/nextjs';

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
     tracesSampleRate: 1.0,
   });
   ```

### Health Checks

Create health check endpoint:

```javascript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
}
```

## Troubleshooting

### Common Issues

#### Build Failures

**Problem**: Build fails on Vercel
**Solution**:
1. Check build logs
2. Verify environment variables
3. Test build locally: `npm run build`

#### Database Connection Issues

**Problem**: Cannot connect to database
**Solution**:
1. Verify DATABASE_URL is correct
2. Check IP whitelist settings
3. Test connection: `npm run db:test`

#### Environment Variables Not Loading

**Problem**: Environment variables undefined
**Solution**:
1. Check variable names match exactly
2. Verify variables are set in Vercel dashboard
3. Redeploy after adding variables

### Debug Commands

```bash
# Check Vercel deployment
vercel ls
vercel inspect [deployment-url]

# Check environment variables
vercel env ls

# Check logs
vercel logs [deployment-url]

# Local build test
npm run build && npm run start
```

### Performance Optimization

1. **Enable ISR (Incremental Static Regeneration)**
   ```javascript
   export const revalidate = 3600; // Revalidate every hour
   ```

2. **Optimize Images**
   ```javascript
   import Image from 'next/image';
   
   <Image
     src="/image.jpg"
     alt="Description"
     width={800}
     height={600}
     loading="lazy"
   />
   ```

3. **Enable Caching**
   ```javascript
   export const runtime = 'edge';
   export const dynamic = 'force-cache';
   ```

## Rollback Strategy

### Instant Rollback

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-id]
```

### Git-Based Rollback

```bash
# Revert commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard [commit-hash]
git push --force origin main
```

## Security Checklist

- [ ] Environment variables are properly secured
- [ ] API keys are not exposed in client code
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Security headers are configured
- [ ] SSL/TLS is enabled
- [ ] Database connections are encrypted
- [ ] Sensitive data is encrypted at rest

## Support

For deployment issues:
1. Check Vercel status page
2. Review deployment logs
3. Contact support with deployment ID