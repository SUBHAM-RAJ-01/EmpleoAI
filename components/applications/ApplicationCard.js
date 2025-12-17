'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Building2, Calendar, DollarSign, MapPin, MoreVertical, Trash2, Eye, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ApplicationCard({ application, isDragging = false, onDelete, onView }) {
  const [showMenu, setShowMenu] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const menuRef = useRef(null)
  const supabase = createClient()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: application.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isUrgent = application.deadline && new Date(application.deadline) - new Date() < 7 * 24 * 60 * 60 * 1000

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!confirm(`Delete application for ${application.company}?`)) return

    setDeleting(true)
    setShowMenu(false)
    
    try {
      // Call parent delete handler immediately for optimistic update
      if (onDelete) {
        onDelete(application.id)
      }
      
      // Then delete from database
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', application.id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Failed to delete application. Please refresh the page.')
    } finally {
      setDeleting(false)
    }
  }

  const handleView = (e) => {
    e.stopPropagation()
    if (onView) onView(application)
    setShowMenu(false)
  }

  const handleCardClick = (e) => {
    // Only trigger view if not clicking on drag handle or menu
    if (e.target.closest('[data-drag-handle]') || e.target.closest('[data-menu]')) {
      return
    }
    handleView(e)
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className={`relative bg-white rounded-xl p-4 shadow-sm border-2 ${
        isUrgent ? 'border-orange-300 bg-orange-50/50' : 'border-gray-200'
      } hover:shadow-xl hover:border-primary-300 transition-all group`}
    >
      {/* Urgent Badge */}
      {isUrgent && (
        <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
          <Clock className="w-3 h-3" />
          Urgent
        </div>
      )}

      {/* Drag Handle */}
      <div 
        {...attributes}
        {...listeners}
        data-drag-handle
        className="absolute top-3 left-3 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <div className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200">
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>
      </div>

      {/* Actions Menu */}
      <div className="absolute top-3 right-3 z-10" ref={menuRef} data-menu>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowMenu(!showMenu)
          }}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreVertical className="w-4 h-4 text-gray-600" />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 animate-slide-down">
            <button
              onClick={handleView}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      <div 
        className="flex items-start gap-3 mb-4 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="p-2.5 bg-gradient-to-br from-primary-100 to-blue-100 rounded-xl group-hover:from-primary-200 group-hover:to-blue-200 transition-all shadow-sm">
          <Building2 className="w-5 h-5 text-primary-600" />
        </div>
        <div className="flex-1 min-w-0 pr-8">
          <h4 className="font-bold text-gray-900 truncate group-hover:text-primary-700 transition-colors text-base">
            {application.company}
          </h4>
          <p className="text-sm text-gray-600 truncate mt-0.5">{application.role}</p>
        </div>
      </div>

      <div 
        className="space-y-2 cursor-pointer"
        onClick={handleCardClick}
      >
        {application.package && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="p-1 bg-green-100 rounded">
              <DollarSign className="w-3.5 h-3.5 text-green-600" />
            </div>
            <span className="font-medium">{application.package}</span>
          </div>
        )}

        {application.location && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="p-1 bg-blue-100 rounded">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="truncate">{application.location}</span>
          </div>
        )}

        {application.deadline && (
          <div className={`flex items-center gap-2 text-sm ${isUrgent ? 'text-orange-700 font-semibold' : 'text-gray-700'}`}>
            <div className={`p-1 rounded ${isUrgent ? 'bg-orange-100' : 'bg-gray-100'}`}>
              <Calendar className={`w-3.5 h-3.5 ${isUrgent ? 'text-orange-600' : 'text-gray-600'}`} />
            </div>
            <span>{new Date(application.deadline).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
