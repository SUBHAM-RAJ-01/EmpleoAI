'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import KanbanBoard from '@/components/applications/KanbanBoard'
import { LayoutGrid, List, Plus, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ApplicationsClient({ user, initialApplications }) {
  const [view, setView] = useState('kanban')

  // Calculate stats
  const stats = {
    total: initialApplications.length,
    active: initialApplications.filter(app => 
      ['discovered', 'applied', 'assessment', 'interview'].includes(app.status)
    ).length,
    offers: initialApplications.filter(app => app.status === 'offer').length,
    urgent: initialApplications.filter(app => 
      app.deadline && new Date(app.deadline) - new Date() < 7 * 24 * 60 * 60 * 1000
    ).length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar user={user} />
      
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Applications</h1>
              <p className="text-gray-600">Track and manage your placement journey</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white rounded-xl border-2 border-gray-200 p-1 shadow-sm">
                <button
                  onClick={() => setView('kanban')}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    view === 'kanban' 
                      ? 'bg-primary-600 text-white shadow-md' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Board</span>
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    view === 'list' 
                      ? 'bg-primary-600 text-white shadow-md' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>

              <Link 
                href="/"
                className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Application</span>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                  <p className="text-sm text-gray-600">Active</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.offers}</p>
                  <p className="text-sm text-gray-600">Offers</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.urgent}</p>
                  <p className="text-sm text-gray-600">Urgent</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <KanbanBoard applications={initialApplications} />
      </main>
    </div>
  )
}
