'use client'

import { useDroppable } from '@dnd-kit/core'
import { useAnalysisStore } from '@/lib/stores/analysisStore'
import { PlotCard } from './PlotCard'
import { LayoutGrid } from 'lucide-react'

export function AnalysisCanvas() {
  const { plots } = useAnalysisStore()
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone',
    data: { type: 'canvas' }
  })

  const plotArray = Object.values(plots)

  return (
    <div
      ref={setNodeRef}
      className={`relative w-full h-screen overflow-auto bg-gray-100 transition-colors ${
        isOver ? 'bg-blue-50' : ''
      }`}
      style={{ marginRight: '256px' }} // Account for fixed ribbon
    >
      {/* Empty State */}
      {plotArray.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-gray-400">
            <LayoutGrid className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-semibold mb-2">Empty Canvas</h3>
            <p className="text-sm">Drag a variable from the right panel to create a plot</p>
          </div>
        </div>
      )}

      {/* Render Plots */}
      {plotArray.map((plot) => (
        <PlotCard key={plot.id} plot={plot} />
      ))}

      {/* Drop Indicator */}
      {isOver && (
        <div className="absolute inset-0 border-4 border-blue-400 border-dashed pointer-events-none" />
      )}
    </div>
  )
}
