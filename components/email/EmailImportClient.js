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
  const supabase = createClient()

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

      if (!response.ok) throw new Error('Failed to extract job details')

      const jobData = await response.json()

      // Save to database
      const { data, error } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          company: jobData.company,
          role: jobData.role,
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
    } catch (err) {
      setError(err.message)
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

          <textarea
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            placeholder="Paste your placement email here..."
            className="input min-h-[300px] resize-y font-mono text-sm"
          />

          <button
            onClick={handleExtract}
            disabled={extracting}
            className="btn-primary mt-4 w-full flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {extracting ? 'Extracting...' : 'Extract Job Details'}
          </button>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">Job extracted successfully!</p>
                  <p className="text-sm text-green-700 mt-1">
                    {result.company} - {result.role}
                  </p>
                </div>
              </div>
              <a href="/applications" className="text-sm text-green-700 hover:text-green-800 font-medium">
                View in Applications →
              </a>
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
