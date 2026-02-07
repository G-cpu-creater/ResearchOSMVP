'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  FileText,
  Download,
  Eye,
  Code,
  BarChart3,
  Table,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react'

interface FilePreviewProps {
  file: {
    id: string
    name: string
    type: string
    size: number
    content?: any
  }
  isOpen: boolean
  onClose: () => void
}

export function FilePreview({ file, isOpen, onClose }: FilePreviewProps) {
  const [zoom, setZoom] = useState(100)
  const [view, setView] = useState<'raw' | 'table' | 'chart'>('table')

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = () => {
    const extension = file.name.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'csv':
      case 'txt':
        return Table
      case 'json':
        return Code
      case 'mpt':
      case 'dta':
        return BarChart3
      default:
        return FileText
    }
  }

  const Icon = getFileIcon()

  // Sample preview data for demonstration
  const mockTableData = [
    ['Column 1', 'Column 2', 'Column 3', 'Column 4'],
    ['...', '...', '...', '...'],
    ['...', '...', '...', '...'],
    ['...', '...', '...', '...'],
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Icon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle>{file.name}</DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{file.type}</Badge>
                  <span className="text-sm text-gray-500">{formatFileSize(file.size)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Toolbar */}
        <div className="px-6 py-3 border-y flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('table')}
            >
              <Table className="h-4 w-4 mr-2" />
              Table
            </Button>
            <Button
              variant={view === 'chart' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('chart')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Chart
            </Button>
            <Button
              variant={view === 'raw' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('raw')}
            >
              <Code className="h-4 w-4 mr-2" />
              Raw
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom(Math.max(50, zoom - 10))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600 w-16 text-center">{zoom}%</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom(Math.min(200, zoom + 10))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-auto p-6" style={{ fontSize: `${zoom}%` }}>
          {view === 'table' && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    {mockTableData[0].map((header, i) => (
                      <th
                        key={i}
                        className="border px-4 py-2 text-left font-medium text-sm"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockTableData.slice(1).map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      {row.map((cell, j) => (
                        <td key={j} className="border px-4 py-2 text-sm">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 text-center text-sm text-gray-500">
                Showing first 5 rows of {file.name}
              </div>
            </div>
          )}

          {view === 'chart' && (
            <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Chart preview would appear here</p>
                <p className="text-sm mt-1">Based on the data in {file.name}</p>
              </div>
            </div>
          )}

          {view === 'raw' && (
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`Time (s),Voltage (V),Current (A),Power (W)
0.0,0.00,0.000,0.000
1.0,0.15,0.025,0.004
2.0,0.30,0.048,0.014
3.0,0.45,0.068,0.031
4.0,0.60,0.085,0.051
...`}
            </pre>
          )}
        </div>

        {/* Footer stats */}
        <div className="px-6 py-3 border-t bg-gray-50 flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <span className="text-gray-600">
              <strong>{mockTableData.length - 1}</strong> rows
            </span>
            <span className="text-gray-600">
              <strong>{mockTableData[0].length}</strong> columns
            </span>
          </div>
          <span className="text-gray-500">
            Last modified: {new Date().toLocaleDateString()}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Quick preview card
 */
export function QuickPreviewCard({ file }: { file: any }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-4 border rounded-lg hover:shadow-lg transition-all text-left w-full group"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{file.name}</p>
            <p className="text-sm text-gray-500">{file.type}</p>
          </div>
          <Eye className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </div>
      </button>

      <FilePreview file={file} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
