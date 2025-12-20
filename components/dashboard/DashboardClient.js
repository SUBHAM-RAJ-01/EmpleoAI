'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import StatsCard from '@/components/dashboard/StatsCard'
import FeatureTour, { useTour } from '@/components/tour/FeatureTour'
import { Briefcase, Calendar, FileText, TrendingUp, HelpCircle } from 'lucide-react'
import Link from 'next/link'

export default function DashboardClient({ user, applications, profile }) {
  const { showTour, completeTour, resetTour } = useTour()
  
  const stats = {
    total: applications.length,
    interviews: applications.filter(app => app.status === 'interview').length,
    offers: applications.filter(app => app.status === 'offer').length,
    pending: applications.filter(app => app.status === 'applied' || app.status === 'assessment').length,
  }

  const upcomingDeadlines = applications
    .filter(app => app.deadline && new Date(app.deadline) > new Date())
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50">
      <Navbar user={user} />
      
      {/* Feature Tour */}
      {showTour && <FeatureTour onComplete={completeTour} />}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10 animate-slide-up flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, <span className="gradient-text">{profile?.full_name || user.email?.split('@')[0]}</span>
            </h1>
            <p className="text-lg text-gray-600">Track your placement journey and land your dream job</p>
          </div>
          <button
            onClick={resetTour}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Show feature tour"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Tour</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Applications"
            value={stats.total}
            icon={<Briefcase className="w-6 h-6" />}
            color="blue"
            index={0}
          />
          <StatsCard
            title="Interviews"
            value={stats.interviews}
            icon={<Calendar className="w-6 h-6" />}
            color="green"
            index={1}
          />
          <StatsCard
            title="Offers"
            value={stats.offers}
            icon={<TrendingUp className="w-6 h-6" />}
            color="purple"
            index={2}
          />
          <StatsCard
            title="Pending"
            value={stats.pending}
            icon={<FileText className="w-6 h-6" />}
            color="orange"
            index={3}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/applications/new" className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-primary-600" />
                  <span className="font-medium text-gray-900">Add New Application</span>
                </div>
              </Link>
              <Link href="/resume" className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary-600" />
                  <span className="font-medium text-gray-900">Manage Resume</span>
                </div>
              </Link>
              <Link href="/email-import" className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  <span className="font-medium text-gray-900">Import from Email</span>
                </div>
              </Link>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Deadlines</h2>
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-3">
                {upcomingDeadlines.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{app.company}</p>
                      <p className="text-sm text-gray-600">{app.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(app.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No upcoming deadlines</p>
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
            <Link href="/applications" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
              View All
            </Link>
          </div>
          {applications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Company</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 5).map((app) => (
                    <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{app.company}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{app.role}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          app.status === 'offer' ? 'bg-green-100 text-green-800' :
                          app.status === 'interview' ? 'bg-blue-100 text-blue-800' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {app.deadline ? new Date(app.deadline).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No applications yet</p>
              <Link href="/applications/new" className="btn-primary">
                Add Your First Application
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
