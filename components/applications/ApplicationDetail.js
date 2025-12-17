'use client'

import { useState } from 'react'
import { X, Briefcase, DollarSign, Calendar, MapPin, FileText, Sparkles, TrendingUp, Edit2, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ApplicationDetail({ application, onClose }) {
  const [tailoring, setTailoring] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState('')
  const [editingDescription, setEditingDescription] = useState(false)
  const [editingRequirements, setEditingRequirements] = useState(false)
  const [description, setDescription] = useState(application.description || '')
  const [requirements, setRequirements] = useState(application.requirements || '')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const handleSave = async (field, value) => {
    setSaving(true)
    setError('')
    try {
      const { error: saveError } = await supabase
        .from('applications')
        .update({ [field]: value })
        .eq('id', application.id)

      if (saveError) throw saveError

      if (field === 'description') setEditingDescription(false)
      if (field === 'requirements') setEditingRequirements(false)
    } catch (err) {
      console.error('Error saving:', err)
      setError('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const handleTailor = async () => {
    setTailoring(true)
    setError('')
    
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        setError('Please sign in to use this feature')
        setTailoring(false)
        return
      }

      const userId = session.user.id

      // Get user's resumes - try master first
      let { data: resumes } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .eq('is_master', true)
        .limit(1)

      // If no master resume, get most recent
      if (!resumes || resumes.length === 0) {
        const { data: allResumes } = await supabase
          .from('resumes')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
        
        resumes = allResumes
      }

      if (!resumes || resumes.length === 0) {
        setError('Please upload a resume first in the Resume section')
        setTailoring(false)
        return
      }

      // Call API to tailor resume
      const response = await fetch('/api/tailor-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: resumes[0].id,
          applicationId: application.id,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to tailor resume')
      }

      setAnalysis(data)
    } catch (err) {
      console.error('Error tailoring resume:', err)
      setError(err.message || 'Failed to analyze resume')
    } finally {
      setTailoring(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 text-white p-8 flex items-center justify-between rounded-t-3xl shadow-lg">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-1">{application.company}</h2>
            <p className="text-primary-100 text-lg">{application.role}</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/20 rounded-xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <InfoCard icon={Briefcase} label="Role" value={application.role} color="primary" />
            {application.package && <InfoCard icon={DollarSign} label="Package" value={application.package} color="green" />}
            {application.location && <InfoCard icon={MapPin} label="Location" value={application.location} color="blue" />}
            {application.deadline && <InfoCard icon={Calendar} label="Deadline" value={new Date(application.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} color="orange" />}
          </div>

          {/* Description */}
          <EditableSection
            title="Description"
            icon={FileText}
            value={description}
            onChange={setDescription}
            editing={editingDescription}
            onEdit={() => setEditingDescription(true)}
            onSave={() => handleSave('description', description)}
            saving={saving}
            placeholder="Add job description..."
          />

          {/* Requirements */}
          <EditableSection
            title="Requirements"
            icon={TrendingUp}
            value={requirements}
            onChange={setRequirements}
            editing={editingRequirements}
            onEdit={() => setEditingRequirements(true)}
            onSave={() => handleSave('requirements', requirements)}
            saving={saving}
            placeholder="Add job requirements..."
          />

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Tailor Button */}
          <button
            onClick={handleTailor}
            disabled={tailoring}
            className="btn-primary w-full flex items-center justify-center gap-3 text-lg py-5 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {tailoring ? (
              <>
                <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Tailor Resume for This Job
              </>
            )}
          </button>

          {/* Analysis Results */}
          {analysis && <AnalysisResults analysis={analysis} />}
        </div>
      </div>
    </div>
  )
}

function InfoCard({ icon: Icon, label, value, color }) {
  const colors = {
    primary: 'from-primary-50 to-blue-50 border-primary-100 bg-primary-600',
    green: 'from-green-50 to-emerald-50 border-green-100 bg-green-600',
    blue: 'from-blue-50 to-cyan-50 border-blue-100 bg-blue-600',
    orange: 'from-orange-50 to-amber-50 border-orange-100 bg-orange-600',
  }
  
  return (
    <div className={`flex items-center gap-4 p-4 bg-gradient-to-br ${colors[color].split(' ').slice(0, 2).join(' ')} rounded-2xl border-2 ${colors[color].split(' ')[2]}`}>
      <div className={`p-3 ${colors[color].split(' ')[3]} rounded-xl shadow-md`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{label}</p>
        <p className="font-bold text-gray-900 text-lg">{value}</p>
      </div>
    </div>
  )
}

function EditableSection({ title, icon: Icon, value, onChange, editing, onEdit, onSave, saving, placeholder }) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Icon className="w-5 h-5 text-primary-600" />
          </div>
          {title}
        </h3>
        {!editing ? (
          <button onClick={onEdit} className="p-2 hover:bg-white rounded-lg transition-colors text-primary-600">
            <Edit2 className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={onSave} disabled={saving} className="p-2 hover:bg-white rounded-lg transition-colors text-green-600 disabled:opacity-50">
            <Save className="w-4 h-4" />
          </button>
        )}
      </div>
      {editing ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 border-2 border-primary-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all min-h-[150px]"
          placeholder={placeholder}
        />
      ) : (
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {value || <span className="text-gray-400 italic">No {title.toLowerCase()} added. Click edit to add.</span>}
        </p>
      )}
    </div>
  )
}

function AnalysisResults({ analysis }) {
  return (
    <div className="bg-gradient-to-br from-primary-50 to-blue-50 border-2 border-primary-200 rounded-2xl p-6 space-y-6 animate-slide-up">
      {/* Score */}
      <div>
        <h3 className="font-bold text-primary-900 mb-3 text-lg">Match Score</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-600 to-blue-600 h-4 rounded-full transition-all duration-1000"
              style={{ width: `${analysis.score}%` }}
            />
          </div>
          <span className="text-3xl font-bold gradient-text">{analysis.score}%</span>
        </div>
      </div>

      {/* Keywords */}
      {analysis.keywords?.length > 0 && (
        <div>
          <h3 className="font-bold text-primary-900 mb-3">Key Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.keywords.map((keyword, i) => (
              <span key={i} className="px-3 py-1.5 bg-white border-2 border-primary-200 text-primary-700 rounded-full text-sm font-medium">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {analysis.suggestions?.length > 0 && (
        <div>
          <h3 className="font-bold text-primary-900 mb-3">Suggestions</h3>
          <ul className="space-y-2">
            {analysis.suggestions.map((suggestion, i) => (
              <li key={i} className="flex items-start gap-3 text-primary-800 bg-white rounded-lg p-3">
                <span className="text-primary-600 font-bold">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Strengths */}
      {analysis.strengths?.length > 0 && (
        <div>
          <h3 className="font-bold text-green-900 mb-3">Strengths</h3>
          <ul className="space-y-2">
            {analysis.strengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-3 text-green-800 bg-green-50 rounded-lg p-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gaps */}
      {analysis.gaps?.length > 0 && (
        <div>
          <h3 className="font-bold text-orange-900 mb-3">Areas to Improve</h3>
          <ul className="space-y-2">
            {analysis.gaps.map((gap, i) => (
              <li key={i} className="flex items-start gap-3 text-orange-800 bg-orange-50 rounded-lg p-3">
                <span className="text-orange-600 font-bold">!</span>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
