# EmpleoAI Documentation

## Quick Start Guide

### 1. Sign Up
Create your free account at [empleoai.vercel.app/auth/signup](https://empleoai.vercel.app/auth/signup)

### 2. Upload Your Resume
- Go to **Resume** section
- Upload your master resume (PDF or TXT)
- Set it as your master resume

### 3. Add Applications

#### Option A: Import from Email
1. Go to **Email Import**
2. Paste the placement email
3. AI extracts company, role, package, and deadlines automatically
4. Review and save

#### Option B: Manual Entry
1. Go to **Applications** → **New Application**
2. Fill in company, role, and other details
3. Save

### 4. Tailor Your Resume
1. Open any application
2. Click **"Tailor Resume for This Job"**
3. AI analyzes your resume against the job
4. Get:
   - Match score (0-100%)
   - Matching keywords
   - Improvement suggestions
   - Your strengths
   - Skills gaps to address

### 5. Track Progress
- Use the **Kanban Board** to drag applications through stages:
  - 🔍 Discovered
  - 📝 Applied
  - 📋 Assessment
  - 🎤 Interview
  - 🎉 Offer
  - ❌ Rejected

## Features

### 📧 Email Import
Paste placement emails and AI automatically extracts:
- Company name
- Job role
- Package/salary
- Application deadline
- Assessment dates
- Interview dates
- Job description
- Requirements

### 📄 Resume Management
- Upload multiple resumes
- Set a master resume
- AI-powered resume tailoring
- Get specific suggestions for each job

### 🤖 AI Analysis
Get detailed insights:
- **Match Score**: How well your resume fits the job
- **Keywords**: Technical skills that match
- **Suggestions**: Specific improvements to make
- **Strengths**: What makes you a good fit
- **Gaps**: Missing skills to address

### 📊 Application Tracking
- Visual Kanban board
- Status updates
- Deadline tracking
- Progress monitoring

## Tips for Best Results

### Resume Upload
- Use TXT files for best parsing
- PDF files are supported but may have formatting issues
- Include all relevant skills and experience
- Keep it updated

### Email Import
- Copy the entire email including headers
- Works best with structured placement emails
- Review extracted data before saving

### Resume Tailoring
- Upload your resume before tailoring
- Add job description and requirements for better analysis
- Review AI suggestions carefully
- Use insights to update your actual resume

## Troubleshooting

### Resume Not Parsing
- Try converting PDF to TXT
- Ensure the file has actual text (not scanned images)
- Check file size (should be under 5MB)

### AI Analysis Not Working
- Ensure you've uploaded a resume
- Add job description and requirements
- Check your internet connection
- Try again after a few seconds (rate limiting)

### Email Import Issues
- Copy the full email text
- Include company name and role in the email
- Review and edit extracted data if needed

## Support

Need help? Reach out:
- **GitHub Issues**: [github.com/SUBHAM-RAJ-01/EmpleoAI/issues](https://github.com/SUBHAM-RAJ-01/EmpleoAI/issues)
- **Email**: Create an issue on GitHub
- **Contribute**: Pull requests welcome!

## Privacy & Data

- Your data is stored securely in Supabase
- Resumes are only used for AI analysis
- No data is shared with third parties
- You can delete your data anytime

## Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini 2.5 Flash
- **Hosting**: Vercel

## Contributing

Want to contribute? Check out our [GitHub repository](https://github.com/SUBHAM-RAJ-01/EmpleoAI)

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details

---

Built with ❤️ by [Subham Raj](https://github.com/SUBHAM-RAJ-01)
