'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import { Mail, Sparkles, AlertCircle, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function EmailImportClient({ user }) {
  const [emailContent, setEmailContent] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [charCount, setCharCount] = useState(0)
  const supabase = createClient()

  const handleContentChange = (e) => {
    const content = e.target.value
    setEmailContent(content)
    setCharCount(content.length)
  }

  const handleExtract = async () => {
    if (!emailContent.trim()) {
      setError('Please paste email content')
      return
    }

    setExtracting(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/extract-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailContent }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to extract job details')
      }

      const jobData = await response.json()

      // Save to database
      const { data, error } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          company: jobData.company || 'Unknown Company',
          role: jobData.role || 'Unknown Role',
          package: jobData.package,
          deadline: jobData.deadline,
          assessment_date: jobData.assessmentDate,
          interview_date: jobData.interviewDate,
          description: jobData.description,
          requirements: jobData.requirements,
          location: jobData.location,
          status: 'discovered',
        })
        .select()
        .single()

      if (error) throw error

      setResult(data)
      setEmailContent('')
      
      // Auto-redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/applications'
      }, 2000)
    } catch (err) {
      setError(err.message || 'An error occurred while extracting job details')
    } finally {
      setExtracting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Import from Email</h1>
          <p className="text-gray-600 mt-2">Paste placement emails and let AI extract job details</p>
        </div>

        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Email Content</h2>
          </div>

          <div className="relative">
            <textarea
              value={emailContent}
              onChange={handleContentChange}
              placeholder="Paste your placement email here...

Example:
Subject: Placement Opportunity - Software Engineer at Google

Dear Students,
We are pleased to announce...

Company: Google
Position: Software Engineer
Package: $120,000/year
Deadline: December 31, 2024"
              className="input min-h-[300px] resize-y font-mono text-sm focus:ring-2 focus:ring-primary-500 transition-all"
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-2 py-1 rounded">
              {charCount} characters
            </div>
          </div>

          <button
            onClick={handleExtract}
            disabled={extracting || !emailContent.trim()}
            className="btn-primary mt-4 w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            {extracting ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Extracting with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Extract Job Details</span>
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 animate-slide-up">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5 animate-bounce" />
                <div className="flex-1">
                  <p className="font-medium text-green-900">Job extracted successfully!</p>
                  <p className="text-sm text-green-700 mt-1">
                    {result.company} - {result.role}
                  </p>
                  {result.package && (
                    <p className="text-sm text-green-700 mt-1">
                      💰 {result.package}
                    </p>
                  )}
                  {result.deadline && (
                    <p className="text-sm text-green-700 mt-1">
                      📅 Deadline: {new Date(result.deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-700">
                <span>Redirecting to applications...</span>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
          )}
        </div>

        <div className="card bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Include the full email content for best results</li>
            <li>• AI will extract company, role, deadlines, and requirements</li>
            <li>• Gmail integration coming soon for automatic imports</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
