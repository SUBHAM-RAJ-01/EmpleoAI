# EmpleoAI - AI-Powered Placement Co-Pilot

An intelligent job application tracking system with AI-powered resume tailoring for university students.

## Features

- 🎯 **Application Tracking** - Visual Kanban board with drag-and-drop
- 📄 **Resume Management** - Upload PDF/TXT resumes with automatic parsing
- 🤖 **AI Resume Tailoring** - Analyze resume against job descriptions using Gemini AI
- 📧 **Email Import** - Extract job details from placement emails
- 📊 **Dashboard** - Track stats, deadlines, and progress
- 🔐 **Secure Auth** - Supabase authentication with session persistence

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini 2.5 Flash
- **Auth**: Supabase Auth
- **PDF Parsing**: pdf2json

## Getting Started

### Prerequisites

- Node.js 20+
- Supabase account
- Google AI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/empleoai.git
cd empleoai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

Run the SQL in `supabase/schema.sql` in your Supabase SQL Editor.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Auth pages
│   ├── applications/      # Applications page
│   ├── dashboard/         # Dashboard page
│   ├── profile/           # Profile page
│   └── resume/            # Resume page
├── components/            # React components
├── lib/                   # Utilities
│   ├── gemini.js         # AI functions
│   └── supabase/         # Supabase clients
└── supabase/             # Database schema
```

## License

MIT License - see [LICENSE](LICENSE)
