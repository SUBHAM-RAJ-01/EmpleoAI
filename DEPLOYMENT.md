# EmpleoAI Deployment Guide

## Prerequisites

- Supabase account (free tier works)
- Vercel account (free tier works)
- Google Gemini API key (free tier available)
- GitHub account

## Step 1: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned
3. Go to SQL Editor and run the schema from `supabase/schema.sql`
4. Go to Settings > API to get your credentials:
   - Project URL
   - Anon/Public key
   - Service Role key (keep this secret!)

## Step 2: Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key for later use

## Step 3: Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Configure environment variables in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

4. Click Deploy

## Step 4: Configure Supabase Auth

1. In Supabase Dashboard, go to Authentication > URL Configuration
2. Add your Vercel URL to Site URL
3. Add redirect URLs:
   - `https://your-app.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for local dev)

## Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Sign up for a new account
3. Test all features:
   - Dashboard loads
   - Add new application
   - Import from email
   - Upload resume
   - Profile settings

## Production Checklist

- [ ] All environment variables set
- [ ] Database schema applied
- [ ] RLS policies enabled
- [ ] Auth redirect URLs configured
- [ ] Custom domain configured (optional)
- [ ] Error tracking set up (optional)
- [ ] Analytics configured (optional)

## Monitoring

- Check Vercel Analytics for performance
- Monitor Supabase Dashboard for database usage
- Check Gemini API usage in Google Cloud Console

## Troubleshooting

### Authentication Issues
- Verify redirect URLs in Supabase
- Check environment variables are set correctly

### Database Errors
- Ensure RLS policies are enabled
- Verify schema was applied correctly

### API Errors
- Check Gemini API key is valid
- Verify API quotas haven't been exceeded

## Scaling Considerations

### Free Tier Limits
- Supabase: 500MB database, 2GB bandwidth
- Vercel: 100GB bandwidth
- Gemini: 60 requests per minute

### When to Upgrade
- Database > 400MB: Upgrade Supabase
- High traffic: Upgrade Vercel
- Heavy AI usage: Upgrade Gemini quota

## Security Best Practices

1. Never commit `.env.local` to git
2. Use environment variables for all secrets
3. Enable RLS on all tables
4. Regularly rotate API keys
5. Monitor for suspicious activity
