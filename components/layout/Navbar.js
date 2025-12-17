'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Menu, X, LogOut, User, Settings } from 'lucide-react'

export default function Navbar({ user }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="glass sticky top-0 z-50 border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                <Image src="/logo.png" alt="EmpleoAI" width={32} height={32} className="relative rounded-lg transition-transform group-hover:scale-110" />
              </div>
              <span className="text-xl font-bold gradient-text">EmpleoAI</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                Dashboard
              </Link>
              <Link href="/applications" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                Applications
              </Link>
              <Link href="/resume" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                Resume
              </Link>
              <Link href="/email-import" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                Import
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/50 transition-all duration-200 border border-transparent hover:border-primary-200"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {user.email?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-gray-700">{user.email}</span>
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 glass rounded-xl shadow-2xl border border-gray-200/50 py-2 animate-slide-down">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Account</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200/50 glass animate-slide-down">
          <div className="px-4 py-4 space-y-2">
            <Link href="/dashboard" className="block py-3 px-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors font-medium">Dashboard</Link>
            <Link href="/applications" className="block py-3 px-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors font-medium">Applications</Link>
            <Link href="/resume" className="block py-3 px-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors font-medium">Resume</Link>
            <Link href="/email-import" className="block py-3 px-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors font-medium">Import</Link>
            <Link href="/profile" className="block py-3 px-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors font-medium">Profile</Link>
            <button onClick={handleLogout} className="block py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left font-medium">
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
