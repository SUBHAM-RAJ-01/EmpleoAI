import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import ApplicationCard from './ApplicationCard'

export default function KanbanColumn({ column, applications }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  })

  const colorClasses = {
    gray: 'bg-gray-100 text-gray-700',
    blue: 'bg-blue-100 text-blue-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    purple: 'bg-purple-100 text-purple-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
  }

  return (
    <div className="bg-gray-100 rounded-lg p-4 min-h-[500px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{column.title}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[column.color]}`}>
          {applications.length}
        </span>
      </div>

      <SortableContext
        id={column.id}
        items={applications.map(app => app.id)}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="space-y-3">
          {applications.map(application => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}
