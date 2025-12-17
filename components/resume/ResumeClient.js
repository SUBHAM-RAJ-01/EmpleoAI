'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import { Upload, FileText, Sparkles, Download, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ResumeClient({ user, resumes: initialResumes, tailoredResumes }) {
  const [resumes, setResumes] = useState(initialResumes)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      // Read file content
      const text = await file.text()

      // Save to database
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          name: file.name,
          content: text,
          is_master: resumes.length === 0,
        })
        .select()
        .single()

      if (error) throw error

      setResumes([data, ...resumes])
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this resume?')) return

    await supabase.from('resumes').delete().eq('id', id)
    setResumes(resumes.filter(r => r.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Resume Management</h1>
          <p className="text-gray-600 mt-2">Upload your master resume and manage tailored versions</p>
        </div>

        {/* Upload Section */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Master Resume</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Upload your master resume (PDF or TXT)</p>
            <label className="btn-primary cursor-pointer inline-block">
              {uploading ? 'Uploading...' : 'Choose File'}
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>

        {/* Master Resumes */}
        {resumes.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Resumes</h2>
            <div className="space-y-3">
              {resumes.map(resume => (
                <div key={resume.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="font-medium text-gray-900">{resume.name}</p>
                      <p className="text-sm text-gray-600">
                        Uploaded {new Date(resume.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tailored Resumes History */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Recent Tailored Resumes</h2>
          </div>
          {tailoredResumes.length > 0 ? (
            <div className="space-y-3">
              {tailoredResumes.map(resume => (
                <div key={resume.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {resume.applications?.company} - {resume.applications?.role}
                    </p>
                    <p className="text-sm text-gray-600">
                      Score: {resume.score}% • {new Date(resume.created_at).toLocaleDateString()}
                    </p>
                    {resume.keywords && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {resume.keywords.slice(0, 5).map((keyword, i) => (
                          <span key={i} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No tailored resumes yet</p>
          )}
        </div>
      </main>
    </div>
  )
}
