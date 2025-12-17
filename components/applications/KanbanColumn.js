import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import ApplicationCard from './ApplicationCard'
import { Inbox } from 'lucide-react'

export default function KanbanColumn({ column, applications, onDelete, onView }) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  const colorClasses = {
    gray: 'bg-gray-100 text-gray-700 border-gray-300',
    blue: 'bg-blue-100 text-blue-700 border-blue-300',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    purple: 'bg-purple-100 text-purple-700 border-purple-300',
    green: 'bg-green-100 text-green-700 border-green-300',
    red: 'bg-red-100 text-red-700 border-red-300',
  }

  const headerColors = {
    gray: 'from-gray-500 to-gray-600',
    blue: 'from-blue-500 to-blue-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
  }

  return (
    <div className={`bg-gray-50 rounded-xl border-2 transition-all ${
      isOver ? 'border-primary-400 bg-primary-50 shadow-lg scale-105' : 'border-gray-200'
    }`}>
      <div className={`bg-gradient-to-r ${headerColors[column.color]} text-white p-4 rounded-t-xl`}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm uppercase tracking-wide">{column.title}</h3>
          <span className="px-2.5 py-1 text-xs font-bold bg-white/20 backdrop-blur-sm rounded-full">
            {applications.length}
          </span>
        </div>
      </div>

      <SortableContext
        id={column.id}
        items={applications.map(app => app.id)}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="p-3 space-y-3 min-h-[400px]">
          {applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Inbox className="w-12 h-12 mb-2 opacity-50" />
              <p className="text-sm">No applications</p>
            </div>
          ) : (
            applications.map(application => (
              <ApplicationCard 
                key={application.id} 
                application={application}
                onDelete={onDelete}
                onView={onView}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  )
}
