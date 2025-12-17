import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Building2, Calendar, DollarSign } from 'lucide-react'

export default function ApplicationCard({ application, isDragging = false }) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Building2 className="w-4 h-4 text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{application.company}</h4>
          <p className="text-sm text-gray-600 truncate">{application.role}</p>
        </div>
      </div>

      {application.package && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <DollarSign className="w-4 h-4" />
          <span>{application.package}</span>
        </div>
      )}

      {application.deadline && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{new Date(application.deadline).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  )
}
