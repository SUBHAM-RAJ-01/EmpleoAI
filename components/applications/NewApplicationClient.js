'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { Building2, Briefcase, DollarSign, Calendar, MapPin, FileText, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function NewApplicationClient({ user }) {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    package: '',
    deadline: '',
    location: '',
    description: '',
    requirements: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const { error } = await supabase.from('applications').insert({
        user_id: user.id,
        ...formData,
        status: 'discovered',
      })

      if (error) throw error

      router.push('/applications')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Application</h1>
          <p className="text-gray-600 mt-2">Manually add a placement opportunity</p>
        </div>

        <form onSubmit={handleSubmit} className="card">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">Company Name *</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    className="input pl-10"
                    placeholder="Google"
                  />
                </div>
              </div>

              <div>
                <label className="label">Role *</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className="input pl-10"
                    placeholder="Software Engineer"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">Package/Stipend</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.package}
                    onChange={(e) => handleChange('package', e.target.value)}
                    className="input pl-10"
                    placeholder="$120,000/year"
                  />
                </div>
              </div>

              <div>
                <label className="label">Deadline</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleChange('deadline', e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="label">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="input pl-10"
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>

            <div>
              <label className="label">Job Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="input min-h-[120px]"
                placeholder="Brief description of the role..."
              />
            </div>

            <div>
              <label className="label">Requirements</label>
              <textarea
                value={formData.requirements}
                onChange={(e) => handleChange('requirements', e.target.value)}
                className="input min-h-[100px]"
                placeholder="Key skills and qualifications required..."
              />
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Saving...' : 'Add Application'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
