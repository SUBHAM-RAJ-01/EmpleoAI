'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import { User, Mail, Phone, MapPin, Briefcase, Save, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ProfileClient({ user, profile: initialProfile }) {
  const [profile, setProfile] = useState(initialProfile || {})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your personal information</p>
        </div>

        <form onSubmit={handleSave} className="card">
          <div className="space-y-6">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={profile.full_name || ''}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  className="input pl-10"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="input pl-10 bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="label">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={profile.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="input pl-10"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            <div>
              <label className="label">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={profile.location || ''}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="input pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            <div>
              <label className="label">University</label>
              <input
                type="text"
                value={profile.university || ''}
                onChange={(e) => handleChange('university', e.target.value)}
                className="input"
                placeholder="Your University"
              />
            </div>

            <div>
              <label className="label">Degree & Major</label>
              <input
                type="text"
                value={profile.degree || ''}
                onChange={(e) => handleChange('degree', e.target.value)}
                className="input"
                placeholder="B.Tech in Computer Science"
              />
            </div>

            <div>
              <label className="label">Graduation Year</label>
              <input
                type="number"
                value={profile.graduation_year || ''}
                onChange={(e) => handleChange('graduation_year', e.target.value)}
                className="input"
                placeholder="2025"
              />
            </div>

            <div>
              <label className="label">Skills (comma-separated)</label>
              <textarea
                value={profile.skills || ''}
                onChange={(e) => handleChange('skills', e.target.value)}
                className="input min-h-[100px]"
                placeholder="JavaScript, React, Node.js, Python, SQL"
              />
            </div>

            <div>
              <label className="label">Bio</label>
              <textarea
                value={profile.bio || ''}
                onChange={(e) => handleChange('bio', e.target.value)}
                className="input min-h-[120px]"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? (
                'Saving...'
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>

            {saved && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Saved successfully</span>
              </div>
            )}
          </div>
        </form>
      </main>
    </div>
  )
}
