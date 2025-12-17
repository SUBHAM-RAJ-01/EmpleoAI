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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Image src="/logo.png" alt="EmpleoAI" width={32} height={32} className="rounded-lg" />
              <span className="text-xl font-semibold text-gray-900">EmpleoAI</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
              <Link href="/applications" className="text-gray-700 hover:text-gray-900 transition-colors">
                Applications
              </Link>
              <Link href="/resume" className="text-gray-700 hover:text-gray-900 transition-colors">
                Resume
              </Link>
              <Link href="/email-import" className="text-gray-700 hover:text-gray-900 transition-colors">
                Import
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">{user.email}</span>
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4" />
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <Link href="/dashboard" className="block py-2 text-gray-700">Dashboard</Link>
            <Link href="/applications" className="block py-2 text-gray-700">Applications</Link>
            <Link href="/resume" className="block py-2 text-gray-700">Resume</Link>
            <Link href="/email-import" className="block py-2 text-gray-700">Import</Link>
            <Link href="/profile" className="block py-2 text-gray-700">Profile</Link>
            <button onClick={handleLogout} className="block py-2 text-red-600 w-full text-left">
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
