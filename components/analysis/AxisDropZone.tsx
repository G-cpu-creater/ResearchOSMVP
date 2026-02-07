'use client'

import { useDroppable } from '@dnd-kit/core'
import { useAnalysisStore } from '@/lib/stores/analysisStore'

interface AxisDropZoneProps {
  plotId: string
  axis: 'x' | 'y'
}

export function AxisDropZone({ plotId, axis }: AxisDropZoneProps) {
  const { updatePlotAxis } = useAnalysisStore()
  const { isOver, setNodeRef } = useDroppable({
    id: `${plotId}-${axis}-axis`,
    data: { type: 'axis', plotId, axis }
  })

  const isXAxis = axis === 'x'

  return (
    <div
      ref={setNodeRef}
      className={`absolute pointer-events-auto transition-all ${
        isXAxis 
          ? 'bottom-0 left-0 right-0 h-12' 
          : 'top-0 bottom-0 left-0 w-12'
      } ${
        isOver ? 'bg-green-400/30 border-2 border-green-500' : 'bg-transparent'
      }`}
      style={{ zIndex: isOver ? 10 : 1 }}
    >
      {isOver && (
        <div className={`absolute flex items-center justify-center w-full h-full`}>
          <span className="text-xs font-semibold text-green-700 bg-white px-2 py-1 rounded shadow">
            Update {axis.toUpperCase()} Axis
          </span>
        </div>
      )}
    </div>
  )
}
