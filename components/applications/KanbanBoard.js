'use client'

import { useState } from 'react'
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core'
import KanbanColumn from './KanbanColumn'
import ApplicationCard from './ApplicationCard'
import ApplicationDetail from './ApplicationDetail'
import { createClient } from '@/lib/supabase/client'
import { Inbox } from 'lucide-react'
import { useRouter } from 'next/navigation'

const columns = [
  { id: 'discovered', title: 'Discovered', color: 'gray' },
  { id: 'applied', title: 'Applied', color: 'blue' },
  { id: 'assessment', title: 'Assessment', color: 'yellow' },
  { id: 'interview', title: 'Interview', color: 'purple' },
  { id: 'offer', title: 'Offer', color: 'green' },
  { id: 'rejected', title: 'Rejected', color: 'red' },
]

export default function KanbanBoard({ applications: initialApplications }) {
  const [applications, setApplications] = useState(initialApplications)
  const [activeId, setActiveId] = useState(null)
  const [selectedApp, setSelectedApp] = useState(null)
  const supabase = createClient()
  const router = useRouter()

  const handleDelete = async (id) => {
    // Optimistically update UI
    setApplications(apps => apps.filter(app => app.id !== id))
    
    // Delete from database
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting application:', error)
      // Revert on error
      router.refresh()
    }
  }

  const handleView = (app) => {
    setSelectedApp(app)
  }

  const handleCloseDetail = () => {
    setSelectedApp(null)
    // Refresh to get latest data
    router.refresh()
  }

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    
    if (!over) return

    const applicationId = active.id
    const newStatus = over.id

    // Update local state immediately
    setApplications(apps =>
      apps.map(app =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      )
    )

    // Update in database
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', applicationId)

    if (error) {
      console.error('Error updating status:', error)
      // Revert on error
      router.refresh()
    }

    setActiveId(null)
  }

  const activeApplication = applications.find(app => app.id === activeId)

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-gray-600 mb-6">
              Start tracking your placement applications by adding your first one or importing from email.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="inline-flex gap-4 min-w-full lg:grid lg:grid-cols-6">
            {columns.map(column => (
              <div key={column.id} className="w-72 lg:w-auto flex-shrink-0">
                <KanbanColumn
                  column={column}
                  applications={applications.filter(app => app.status === column.id)}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedApp && (
        <ApplicationDetail
          application={selectedApp}
          onClose={handleCloseDetail}
        />
      )}

      <DragOverlay>
        {activeApplication ? (
          <ApplicationCard application={activeApplication} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
