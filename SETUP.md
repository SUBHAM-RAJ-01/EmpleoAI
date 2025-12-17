# EmpleoAI Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Supabase Database

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Copy and paste the entire contents of `supabase/schema.sql`
4. Click "Run" to execute the schema

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Getting API Keys

### Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon/Public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service Role key → `SUPABASE_SERVICE_ROLE_KEY`

### Google Gemini

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key → `GEMINI_API_KEY`

## Project Structure

```
empleoai/
├── app/                    # Next.js pages
├── components/             # React components
├── lib/                    # Utilities
├── public/                 # Static files
├── supabase/              # Database schema
└── .env.local             # Environment variables (create this)
```

## Features to Test

1. **Sign Up/Login**: Create an account
2. **Dashboard**: View stats and recent applications
3. **Add Application**: Manually add a job
4. **Email Import**: Paste an email and extract job details
5. **Resume Upload**: Upload your master resume
6. **Kanban Board**: Drag applications between stages
7. **Profile**: Update your personal information

## Common Issues

### "Invalid API key" error
- Check your Gemini API key is correct
- Verify the key has proper permissions

### "Database error" or "RLS policy violation"
- Ensure you ran the complete schema from `supabase/schema.sql`
- Check RLS policies are enabled

### "Authentication failed"
- Verify Supabase URL and keys are correct
- Check you're using the anon key for client-side code

### Styles not loading
- Run `npm install` again
- Clear `.next` folder: `rm -rf .next`
- Restart dev server

## Development Tips

- Use Chrome DevTools to debug
- Check browser console for errors
- Monitor Supabase logs for database issues
- Test with real placement emails for best results

## Next Steps

1. Customize the logo (replace `public/logo.png`)
2. Adjust colors in `tailwind.config.js`
3. Add more features as needed
4. Deploy to Vercel (see DEPLOYMENT.md)
