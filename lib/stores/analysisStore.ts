import { create } from 'zustand'
import { Plot, Position, Size } from '@/types/analysis'

interface AnalysisStore {
  plots: Record<string, Plot>
  createPlot: (variableName: string, position: Position) => string
  updatePlotAxis: (plotId: string, axis: 'x' | 'y', variableName: string) => void
  updatePlotPosition: (plotId: string, position: Position) => void
  updatePlotSize: (plotId: string, size: Size) => void
  deletePlot: (plotId: string) => void
  clearAllPlots: () => void
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  plots: {},
  
  createPlot: (variableName, position) => {
    const plotId = `plot-${Date.now()}`
    const newPlot: Plot = {
      id: plotId,
      xVariable: 'index',
      yVariable: variableName,
      position,
      size: { width: 500, height: 400 },
      plotType: 'scatter',
      markerColor: '#3b82f6',
      markerSize: 6,
      showLegend: false,
      showGrid: true,
      createdAt: Date.now(),
    }
    
    set((state) => ({
      plots: { ...state.plots, [plotId]: newPlot }
    }))
    
    return plotId
  },
  
  updatePlotAxis: (plotId, axis, variableName) => {
    set((state) => ({
      plots: {
        ...state.plots,
        [plotId]: {
          ...state.plots[plotId],
          [`${axis}Variable`]: variableName,
        }
      }
    }))
  },
  
  updatePlotPosition: (plotId, position) => {
    set((state) => ({
      plots: {
        ...state.plots,
        [plotId]: {
          ...state.plots[plotId],
          position,
        }
      }
    }))
  },
  
  updatePlotSize: (plotId, size) => {
    set((state) => ({
      plots: {
        ...state.plots,
        [plotId]: {
          ...state.plots[plotId],
          size,
        }
      }
    }))
  },
  
  deletePlot: (plotId) => {
    set((state) => {
      const { [plotId]: removed, ...remainingPlots } = state.plots
      return { plots: remainingPlots }
    })
  },
  
  clearAllPlots: () => set({ plots: {} }),
}))
