import Link from 'next/link'
import { Briefcase, Mail, FileText, TrendingUp, CheckCircle, ArrowRight, Sparkles, Zap, Target, Users } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Navigation */}
      <nav className="glass sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                <img src="/logo.png" alt="EmpleoAI" className="relative w-10 h-10 rounded-xl" />
              </div>
              <span className="text-2xl font-bold gradient-text">EmpleoAI</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="text-gray-700 hover:text-primary-600 font-medium transition-colors px-4 py-2">
                Sign In
              </Link>
              <Link href="/auth/signup" className="btn-primary">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              AI-Powered Placement Management
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-slide-up">
              Land Your Dream Job with{' '}
              <span className="gradient-text">AI Assistance</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto animate-slide-up" style={{animationDelay: '0.1s'}}>
              Automate placement emails, tailor resumes intelligently, and track every application. 
              The smartest way for students to manage their job search.
            </p>
            
            <div className="flex gap-4 justify-center mb-12 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <Link href="/auth/signup" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2 group">
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#features" className="btn-secondary text-lg px-8 py-4">
                See How It Works
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12 border-t border-gray-200 animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">AI-Powered</div>
                <div className="text-sm text-gray-600">Smart Automation</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">100%</div>
                <div className="text-sm text-gray-600">Free to Start</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">2 Min</div>
                <div className="text-sm text-gray-600">Setup Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full blur-3xl opacity-50 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-50 animate-float" style={{animationDelay: '1s'}}></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to ace your placement season</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Mail className="w-8 h-8" />}
              title="Email Integration"
              description="Paste placement emails and let AI extract company, role, package, and deadlines automatically."
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon={<FileText className="w-8 h-8" />}
              title="Smart Resume Tailoring"
              description="AI analyzes job descriptions and suggests targeted improvements to boost your chances."
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Application Tracking"
              description="Visual Kanban board to track applications from discovery to offer with drag-and-drop."
              gradient="from-orange-500 to-red-500"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-br from-primary-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in three simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <StepCard
              number="1"
              icon={<Zap className="w-6 h-6" />}
              title="Import Opportunities"
              description="Connect your email or paste placement notifications. AI extracts all details instantly."
            />
            <StepCard
              number="2"
              icon={<Target className="w-6 h-6" />}
              title="Tailor Your Resume"
              description="Upload your master resume. AI suggests improvements for each specific job."
            />
            <StepCard
              number="3"
              icon={<Users className="w-6 h-6" />}
              title="Track & Apply"
              description="Manage applications through visual stages. Never miss a deadline or interview."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-blue-600"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="relative px-12 py-20 text-center text-white">
              <h2 className="text-5xl font-bold mb-6">Ready to Land Your Dream Job?</h2>
              <p className="text-xl mb-10 text-primary-100 max-w-2xl mx-auto">
                Join thousands of students who are already using AI to ace their placements
              </p>
              <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-white text-primary-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="mt-6 text-primary-100 text-sm">No credit card required • Free forever</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description, gradient }) {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 rounded-2xl blur transition duration-500" style={{backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`}}></div>
      <div className="relative card hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
        <div className={`inline-flex p-4 bg-gradient-to-br ${gradient} rounded-xl mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function StepCard({ number, icon, title, description }) {
  return (
    <div className="relative group">
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-primary-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300">
        {number}
      </div>
      <div className="card pt-16 text-center hover:shadow-xl transition-all duration-300">
        <div className="inline-flex p-3 bg-primary-100 rounded-xl mb-4 text-primary-600">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="EmpleoAI" className="w-10 h-10 rounded-xl" />
              <span className="text-2xl font-bold">EmpleoAI</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              AI-powered placement co-pilot helping university students automate applications, 
              tailor resumes, and track their placement journey.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Product</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/auth/signup" className="hover:text-white transition-colors">Get Started</Link></li>
              <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 EmpleoAI. All rights reserved.</p>
          <p className="text-gray-500 text-sm mt-4 md:mt-0">Built with ❤️ for students</p>
        </div>
      </div>
    </footer>
  )
}
