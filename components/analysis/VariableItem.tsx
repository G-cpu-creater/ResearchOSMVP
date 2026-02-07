'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

interface VariableItemProps {
  name: string
  dataPreview: number[]
}

export function VariableItem({ name, dataPreview }: VariableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `variable-${name}`,
    data: { type: 'variable', name }
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white border border-gray-300 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-blue-500 hover:shadow-md transition-all"
    >
      <div className="font-semibold text-sm text-gray-800">{name}</div>
    </div>
  )
}
