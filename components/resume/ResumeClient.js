'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import { Upload, FileText, Sparkles, Trash2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ResumeClient({ user, resumes: initialResumes, tailoredResumes }) {
  const [resumes, setResumes] = useState(initialResumes)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const supabase = createClient()

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      await processFile(file)
    }
  }

  const processFile = async (file) => {
    if (!file.name.match(/\.(pdf|txt)$/i)) {
      setError('Please upload a PDF or TXT file')
      return
    }

    setUploading(true)
    setError('')

    try {
      let text = ''
      
      if (file.name.toLowerCase().endsWith('.txt')) {
        // Read text file directly
        text = await file.text()
      } else if (file.name.toLowerCase().endsWith('.pdf')) {
        // Parse PDF using server-side API
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/parse-pdf', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to parse PDF')
        }

        text = result.text
        console.log('✅ PDF parsed:', result.pages, 'pages,', text.length, 'characters')
      }
      
      if (!text || text.trim().length < 50) {
        setError('Resume content is too short. Please upload a file with your full resume.')
        setUploading(false)
        return
      }

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
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload resume')
    } finally {
      setUploading(false)
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      await processFile(file)
    }
  }

  const handleSetMaster = async (id) => {
    setError('')
    try {
      if (!user || !user.id) {
        setError('Session expired. Please refresh the page.')
        return
      }

      // First, unset all master resumes for this user
      const { error: unsetError } = await supabase
        .from('resumes')
        .update({ is_master: false })
        .eq('user_id', user.id)

      if (unsetError) {
        console.error('Error unsetting master:', unsetError)
        throw unsetError
      }

      // Then set the selected one as master
      const { error: setError } = await supabase
        .from('resumes')
        .update({ is_master: true })
        .eq('id', id)
        .eq('user_id', user.id)

      if (setError) {
        console.error('Error setting master:', setError)
        throw setError
      }

      // Update local state
      setResumes(resumes.map(r => ({
        ...r,
        is_master: r.id === id
      })))
      
      console.log('✅ Master resume updated successfully')
    } catch (err) {
      console.error('❌ Error setting master resume:', err)
      setError(err.message || 'Failed to set master resume')
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
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
              isDragging
                ? 'border-primary-500 bg-primary-50 scale-105'
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }`}
          >
            <Upload className={`w-12 h-12 mx-auto mb-4 transition-all ${isDragging ? 'text-primary-600 scale-110' : 'text-gray-400'}`} />
            <p className="text-gray-600 mb-2 font-medium">
              {isDragging ? 'Drop your resume here' : 'Drag & drop your resume here'}
            </p>
            <p className="text-sm text-gray-500 mb-4">or</p>
            <label className="btn-primary cursor-pointer inline-block transform hover:scale-105 transition-transform">
              {uploading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                'Choose File'
              )}
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-3">📄 Supports PDF and TXT files</p>
          </div>
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 animate-slide-up">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Master Resumes */}
        {resumes.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Resumes</h2>
            <div className="space-y-3">
              {resumes.map(resume => (
                <div key={resume.id} className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                  resume.is_master 
                    ? 'bg-gradient-to-r from-primary-50 to-blue-50 border-2 border-primary-200' 
                    : 'bg-gray-50 border-2 border-transparent'
                }`}>
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className={`w-5 h-5 ${resume.is_master ? 'text-primary-600' : 'text-gray-600'}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{resume.name}</p>
                        {resume.is_master && (
                          <span className="px-2 py-0.5 bg-primary-600 text-white text-xs font-bold rounded-full">
                            MASTER
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Uploaded {new Date(resume.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!resume.is_master && (
                      <button
                        onClick={() => handleSetMaster(resume.id)}
                        className="px-3 py-1.5 text-sm bg-primary-100 text-primary-700 hover:bg-primary-200 rounded-lg transition-colors font-medium"
                      >
                        Set as Master
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(resume.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
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
