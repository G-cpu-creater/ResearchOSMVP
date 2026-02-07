'use client'

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useAnalysisStore } from '@/lib/stores/analysisStore'
import { AnalysisCanvas } from './AnalysisCanvas'
import { VariableRibbon } from './VariableRibbon'

export function AnalysisPage() {
  const { createPlot, updatePlotAxis } = useAnalysisStore()
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) return

    const dragData = active.data.current
    const dropData = over.data.current

    // Variable dragged to canvas - create new plot
    if (dragData?.type === 'variable' && dropData?.type === 'canvas') {
      const variableName = dragData.name
      
      // Calculate center position of canvas (accounting for variable ribbon width)
      const canvasWidth = window.innerWidth - 256 // Subtract ribbon width
      const canvasHeight = window.innerHeight
      const plotWidth = 500
      const plotHeight = 400
      
      const centerPosition = {
        x: (canvasWidth - plotWidth) / 2,
        y: (canvasHeight - plotHeight) / 2
      }
      
      createPlot(variableName, centerPosition)
    }
    
    // Variable dragged to axis - update axis
    if (dragData?.type === 'variable' && dropData?.type === 'axis') {
      const variableName = dragData.name
      const { plotId, axis } = dropData
      
      updatePlotAxis(plotId, axis, variableName)
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="relative w-full h-screen overflow-hidden">
        <AnalysisCanvas />
        <VariableRibbon />
      </div>
    </DndContext>
  )
}
