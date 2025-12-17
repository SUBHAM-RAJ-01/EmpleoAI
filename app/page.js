import Link from 'next/link'
import Image from 'next/image'
import { Briefcase, Mail, FileText, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="EmpleoAI" width={32} height={32} className="rounded-lg" />
              <span className="text-xl font-semibold text-gray-900">EmpleoAI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                Sign In
              </Link>
              <Link href="/auth/signup" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Your AI-Powered Placement Co-Pilot
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Automate placement emails, tailor resumes intelligently, and track every application. 
            Built for university students who want to focus on landing their dream job.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup" className="btn-primary text-lg px-8 py-3 inline-flex items-center gap-2">
              Start Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#features" className="btn-secondary text-lg px-8 py-3">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need</h2>
          <p className="text-lg text-gray-600">Streamline your placement journey with intelligent automation</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Mail className="w-8 h-8 text-primary-600" />}
            title="Email Integration"
            description="Connect your email and let AI extract job details automatically from placement notifications."
          />
          <FeatureCard
            icon={<FileText className="w-8 h-8 text-primary-600" />}
            title="Smart Resume Tailoring"
            description="AI analyzes job descriptions and suggests targeted improvements to your resume for each application."
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8 text-primary-600" />}
            title="Application Tracking"
            description="Visual Kanban board to track applications from discovery to offer, with deadline reminders."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Three simple steps to placement success</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <StepCard
              number="1"
              title="Import Opportunities"
              description="Connect your email or manually add placement opportunities. AI extracts all relevant details."
            />
            <StepCard
              number="2"
              title="Tailor Your Resume"
              description="Upload your master resume. AI suggests improvements for each specific job application."
            />
            <StepCard
              number="3"
              title="Track & Apply"
              description="Manage applications through visual stages. Never miss a deadline or interview."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-primary-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Land Your Dream Job?</h2>
          <p className="text-xl mb-8 text-primary-100">Join students who are already using AI to ace their placements</p>
          <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="EmpleoAI" width={24} height={24} className="rounded" />
              <span className="font-semibold text-gray-900">EmpleoAI</span>
            </div>
            <p className="text-gray-600 text-sm">© 2024 EmpleoAI. Built for students, by students.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
