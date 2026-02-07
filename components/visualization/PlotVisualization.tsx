'use client'

import { useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Loader2, Copy, Download, Check } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import Plotly from 'plotly.js-dist-min'

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    </div>
  ),
})

type PlotType = 'line' | 'scatter' | 'bar' | 'histogram' | 'box'

interface PlotVisualizationProps {
  data: string[][]
  headers: string[]
  selectedColumns: number[]
  plotType: PlotType
}

export function PlotVisualization({
  data,
  headers,
  selectedColumns,
  plotType,
}: PlotVisualizationProps) {
  const plotRef = useRef<any>(null)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const plotData = useMemo(() => {
    if (selectedColumns.length === 0) return null

    // For single column - use index as x-axis
    if (selectedColumns.length === 1) {
      const colIndex = selectedColumns[0]
      const yValues = data.map(row => parseFloat(row[colIndex])).filter(v => !isNaN(v))
      const xValues = yValues.map((_, i) => i + 1)

      return {
        data: [
          {
            x: xValues,
            y: yValues,
            type: plotType === 'histogram' ? 'histogram' : plotType,
            mode: plotType === 'scatter' ? 'markers' : plotType === 'line' ? 'lines+markers' : undefined,
            name: headers[colIndex] || `Column ${colIndex + 1}`,
            marker: {
              size: plotType === 'scatter' ? 8 : undefined,
              color: '#3b82f6',
            },
          },
        ],
        layout: {
          title: `${plotType.charAt(0).toUpperCase() + plotType.slice(1)} Plot`,
          xaxis: {
            title: plotType === 'histogram' ? headers[colIndex] : 'Index',
          },
          yaxis: {
            title: plotType === 'histogram' ? 'Frequency' : headers[colIndex] || `Column ${colIndex + 1}`,
          },
          autosize: true,
        },
      }
    }

    // For two columns - x vs y plot
    if (selectedColumns.length === 2) {
      const xIndex = selectedColumns[0]
      const yIndex = selectedColumns[1]

      const xValues = data.map(row => parseFloat(row[xIndex])).filter(v => !isNaN(v))
      const yValues = data.map(row => parseFloat(row[yIndex])).filter(v => !isNaN(v))

      const minLength = Math.min(xValues.length, yValues.length)

      return {
        data: [
          {
            x: xValues.slice(0, minLength),
            y: yValues.slice(0, minLength),
            type: plotType === 'histogram' || plotType === 'box' ? 'scatter' : plotType,
            mode: plotType === 'scatter' ? 'markers' : plotType === 'line' ? 'lines+markers' : undefined,
            name: `${headers[yIndex]} vs ${headers[xIndex]}`,
            marker: {
              size: plotType === 'scatter' ? 8 : undefined,
              color: '#3b82f6',
            },
          },
        ],
        layout: {
          title: `${headers[yIndex]} vs ${headers[xIndex]}`,
          xaxis: {
            title: headers[xIndex] || `Column ${xIndex + 1}`,
          },
          yaxis: {
            title: headers[yIndex] || `Column ${yIndex + 1}`,
          },
          autosize: true,
        },
      }
    }

    // For multiple columns - overlay on same plot
    const traces = selectedColumns.map((colIndex, idx) => {
      const yValues = data.map(row => parseFloat(row[colIndex])).filter(v => !isNaN(v))
      const xValues = yValues.map((_, i) => i + 1)

      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

      return {
        x: xValues,
        y: yValues,
        type: plotType === 'histogram' ? 'histogram' : plotType,
        mode: plotType === 'scatter' ? 'markers' : plotType === 'line' ? 'lines+markers' : undefined,
        name: headers[colIndex] || `Column ${colIndex + 1}`,
        marker: {
          size: plotType === 'scatter' ? 8 : undefined,
          color: colors[idx % colors.length],
        },
      }
    })

    return {
      data: traces,
      layout: {
        title: 'Multi-Column Comparison',
        xaxis: {
          title: 'Index',
        },
        yaxis: {
          title: 'Value',
        },
        autosize: true,
        showlegend: true,
      },
    }
  }, [data, headers, selectedColumns, plotType])

  const handleCopyToClipboard = async () => {
    if (!plotRef.current) return

    try {
      const gd = plotRef.current.el
      const imgData = await Plotly.toImage(gd, { format: 'png', width: 1200, height: 800 })

      // Convert data URL to blob
      const response = await fetch(imgData)
      const blob = await response.blob()

      // Upload to server
      const formData = new FormData()
      formData.append('file', blob, 'plot.png')

      const uploadResponse = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      })

      if (uploadResponse.ok) {
        const { url } = await uploadResponse.json()

        // Copy to clipboard
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ])

        setCopied(true)
        setTimeout(() => setCopied(false), 2000)

        toast({
          title: 'Copied!',
          description: 'Plot copied to clipboard and saved',
        })
      }
    } catch (error) {
      console.error('Copy failed:', error)
      toast({
        title: 'Error',
        description: 'Failed to copy plot',
        variant: 'destructive',
      })
    }
  }

  const handleDownload = async (format: 'png' | 'svg') => {
    if (!plotRef.current) return

    try {
      const gd = plotRef.current.el
      await Plotly.downloadImage(gd, {
        format,
        width: 1200,
        height: 800,
        filename: `plot_${Date.now()}`,
      })

      toast({
        title: 'Downloaded!',
        description: `Plot saved as ${format.toUpperCase()}`,
      })
    } catch (error) {
      console.error('Download failed:', error)
      toast({
        title: 'Error',
        description: 'Failed to download plot',
        variant: 'destructive',
      })
    }
  }

  if (selectedColumns.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center p-8">
        <div className="text-center text-gray-500">
          <p className="text-lg font-semibold mb-2">No Columns Selected</p>
          <p className="text-sm">Click on column headers in the spreadsheet to select data for plotting</p>
        </div>
      </Card>
    )
  }

  if (!plotData) {
    return (
      <Card className="h-full flex items-center justify-center p-8">
        <div className="text-center text-gray-500">
          <p className="text-lg font-semibold mb-2">Invalid Data</p>
          <p className="text-sm">Unable to generate plot from selected columns</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="h-full p-4 flex flex-col">
      <div className="flex items-center justify-end gap-2 mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyToClipboard}
          className="gap-2"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleDownload('png')}>
              Download PNG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload('svg')}>
              Download SVG
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1">
        <Plot
          data={plotData.data as any}
          layout={{
            ...plotData.layout,
            height: undefined,
            margin: { l: 50, r: 50, t: 50, b: 50 },
          } as any}
          config={{
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
          } as any}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
          onInitialized={(figure, graphDiv) => {
            plotRef.current = { el: graphDiv }
          }}
        />
      </div>
    </Card>
  )
}
