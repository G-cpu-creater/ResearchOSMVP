'use client'

import { useMemo } from 'react'
import { Rnd } from 'react-rnd'
import dynamic from 'next/dynamic'
import { useDatasetStore } from '@/lib/stores/datasetStore'
import { useAnalysisStore } from '@/lib/stores/analysisStore'
import { Plot } from '@/types/analysis'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { AxisDropZone } from './AxisDropZone'

const PlotComponent = dynamic(() => import('react-plotly.js'), { ssr: false })

interface PlotCardProps {
  plot: Plot
}

export function PlotCard({ plot }: PlotCardProps) {
  const { dataset } = useDatasetStore()
  const { updatePlotPosition, updatePlotSize, deletePlot } = useAnalysisStore()

  const plotData = useMemo(() => {
    if (!dataset) return null

    const xData = plot.xVariable === 'index' 
      ? dataset.indexArray 
      : dataset.data[plot.xVariable] || []
    
    const yData = dataset.data[plot.yVariable] || []

    let mode: 'markers' | 'lines' | 'lines+markers' = 'markers'
    if (plot.plotType === 'line') mode = 'lines'
    if (plot.plotType === 'scatter+line') mode = 'lines+markers'

    const trace: any = {
      x: xData,
      y: yData,
      type: plot.plotType === 'bar' ? 'bar' : 'scatter',
      mode: plot.plotType !== 'bar' ? mode : undefined,
      marker: {
        size: plot.markerSize,
        color: plot.markerColor,
      },
      line: plot.plotType.includes('line') ? {
        color: plot.markerColor,
        width: 2,
      } : undefined,
    }

    const layout: any = {
      title: {
        text: `${plot.yVariable} vs ${plot.xVariable}`,
        font: { size: 16, family: 'Arial, sans-serif' }
      },
      plot_bgcolor: 'white',
      paper_bgcolor: 'white',
      width: plot.size.width,
      height: plot.size.height,
      xaxis: {
        title: {
          text: plot.xVariable,
          font: { size: 12, family: 'Arial, sans-serif' },
        },
        showline: true,
        linecolor: '#000000',
        linewidth: 2,
        ticks: 'outside',
        showgrid: plot.showGrid,
        gridcolor: '#e5e5e5',
        mirror: false,
        zeroline: false,
        nticks: 10,
      },
      yaxis: {
        title: {
          text: plot.yVariable,
          font: { size: 12, family: 'Arial, sans-serif' },
        },
        showline: true,
        linecolor: '#000000',
        linewidth: 2,
        ticks: 'outside',
        showgrid: plot.showGrid,
        gridcolor: '#e5e5e5',
        mirror: false,
        zeroline: false,
        nticks: 10,
      },
      showlegend: plot.showLegend,
      legend: {
        font: { size: 10 },
        orientation: 'v',
        x: 1,
        y: 1,
        xanchor: 'right',
        yanchor: 'top',
        bgcolor: 'rgba(255,255,255,0.8)',
        bordercolor: '#cccccc',
        borderwidth: 1,
      },
      autosize: false,
      margin: { l: 60, r: 20, t: 40, b: 80 },
    }

    return {
      data: [trace],
      layout,
      config: {
        responsive: false,
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
      }
    }
  }, [plot, dataset])

  if (!dataset || !plotData) return null

  return (
    <Rnd
      position={{ x: plot.position.x, y: plot.position.y }}
      size={{ width: plot.size.width, height: plot.size.height }}
      onDragStop={(e, d) => updatePlotPosition(plot.id, { x: d.x, y: d.y })}
      onResizeStop={(e, dir, ref, delta, position) => {
        updatePlotSize(plot.id, {
          width: ref.offsetWidth,
          height: ref.offsetHeight
        })
        updatePlotPosition(plot.id, position)
      }}
      minWidth={300}
      minHeight={250}
      bounds="parent"
      className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
    >
      <div className="relative w-full h-full">
        {/* Delete Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deletePlot(plot.id)}
          className="absolute top-2 right-2 z-20 h-6 w-6 p-0 hover:bg-red-100 bg-white/80"
        >
          <X className="h-3 w-3" />
        </Button>

        {/* Plot Area with Axis Drop Zones */}
        <div className="relative w-full h-full">
          <PlotComponent
            data={plotData.data}
            layout={plotData.layout}
            config={plotData.config}
            style={{ width: '100%', height: '100%' }}
          />
          
          {/* X-Axis Drop Zone */}
          <AxisDropZone plotId={plot.id} axis="x" />
          
          {/* Y-Axis Drop Zone */}
          <AxisDropZone plotId={plot.id} axis="y" />
        </div>
      </div>
    </Rnd>
  )
}
