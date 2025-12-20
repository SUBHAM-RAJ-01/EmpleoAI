'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="EmpleoAI" width={32} height={32} className="rounded-lg" />
              <span className="text-xl font-bold text-gray-900">EmpleoAI</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              AI-powered placement co-pilot helping university students automate applications, 
              tailor resumes, and track their placement journey.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/SUBHAM-RAJ-01/EmpleoAI" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-600 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/auth/signup" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://github.com/SUBHAM-RAJ-01/EmpleoAI" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600 transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © {currentYear} EmpleoAI. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <p>
              Built with ❤️ by <a href="https://github.com/SUBHAM-RAJ-01" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">Subham Raj</a>
            </p>
            <span className="text-gray-300">•</span>
            <a href="https://github.com/SUBHAM-RAJ-01/EmpleoAI" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary-600 transition-colors">
              <Github className="w-4 h-4" />
              <span>Contribute</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
