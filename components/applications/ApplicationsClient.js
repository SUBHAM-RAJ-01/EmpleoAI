'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import KanbanBoard from '@/components/applications/KanbanBoard'
import { LayoutGrid, List } from 'lucide-react'

export default function ApplicationsClient({ user, initialApplications }) {
  const [view, setView] = useState('kanban')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
            <p className="text-gray-600 mt-2">Track your placement journey</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setView('kanban')}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === 'kanban' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === 'list' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <KanbanBoard applications={initialApplications} />
      </main>
    </div>
  )
}
