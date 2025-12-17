'use client'

import { useState } from 'react'
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import KanbanColumn from './KanbanColumn'
import ApplicationCard from './ApplicationCard'
import { createClient } from '@/lib/supabase/client'

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
  const supabase = createClient()

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    
    if (!over) return

    const applicationId = active.id
    const newStatus = over.id

    // Update local state
    setApplications(apps =>
      apps.map(app =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      )
    )

    // Update in database
    await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', applicationId)

    setActiveId(null)
  }

  const activeApplication = applications.find(app => app.id === activeId)

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {columns.map(column => (
          <KanbanColumn
            key={column.id}
            column={column}
            applications={applications.filter(app => app.status === column.id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeApplication ? (
          <ApplicationCard application={activeApplication} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
