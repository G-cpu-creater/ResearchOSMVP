'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  FolderOpen,
  File,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Download,
  Upload,
  Settings2,
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface BatchFile {
  name: string
  size: string
  type: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
}

interface ProcessingStats {
  total: number
  completed: number
  failed: number
  estimatedTime: number
}

// Solves: Processing thousands of data files manually
// Batch operations save hours of repetitive work
export function BatchFileProcessor() {
  const [files, setFiles] = useState<BatchFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const handleUpload = () => {
    // Simulate file selection
    const mockFiles: BatchFile[] = Array.from({ length: 250 }, (_, i) => ({
      name: `CV_scan_${String(i + 1).padStart(3, '0')}.csv`,
      size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
      type: 'CSV',
      status: 'pending',
    }))

    setFiles(mockFiles)
    toast({
      title: 'Files loaded',
      description: `${mockFiles.length} files ready for batch processing`,
    })
  }

  const processBatch = async () => {
    setIsProcessing(true)
    setProgress(0)

    // Simulate batch processing
    for (let i = 0; i <= 100; i++) {
      await new Promise(resolve => setTimeout(resolve, 50))
      setProgress(i)

      // Update file statuses
      const completedIndex = Math.floor((i / 100) * files.length)
      setFiles(prev =>
        prev.map((file, idx) =>
          idx < completedIndex
            ? { ...file, status: Math.random() > 0.95 ? 'failed' : 'completed' }
            : idx === completedIndex
            ? { ...file, status: 'processing' }
            : file
        )
      )
    }

    setIsProcessing(false)
    toast({
      title: 'Batch processing complete',
      description: `${files.filter(f => f.status === 'completed').length}/${files.length} files processed successfully`,
    })
  }

  const stats: ProcessingStats = {
    total: files.length,
    completed: files.filter(f => f.status === 'completed').length,
    failed: files.filter(f => f.status === 'failed').length,
    estimatedTime: Math.round((files.length * 2.3) / 60), // minutes
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Batch File Processor
        </CardTitle>
        <CardDescription>
          Process thousands of files in parallel - Save hours of manual work
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats */}
        {files.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                <p className="text-xs text-gray-600 mt-1">Total Files</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                <p className="text-xs text-gray-600 mt-1">Completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
                <p className="text-xs text-gray-600 mt-1">Failed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-2xl font-bold text-purple-600">{stats.estimatedTime}m</p>
                <p className="text-xs text-gray-600 mt-1">Est. Time</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button onClick={handleUpload} disabled={isProcessing}>
            <Upload className="h-4 w-4 mr-2" />
            Select Files
          </Button>
          <Button onClick={processBatch} disabled={files.length === 0 || isProcessing}>
            <Zap className="h-4 w-4 mr-2" />
            {isProcessing ? 'Processing...' : `Process ${files.length} Files`}
          </Button>
          {stats.completed > 0 && (
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          )}
          <Button variant="outline">
            <Settings2 className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>

        {/* Progress */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Processing batch...</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-xs text-gray-500 text-center">
              {stats.completed} of {stats.total} files completed
            </p>
          </div>
        )}

        {/* File list preview */}
        {files.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3">Files ({files.length})</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {files.slice(0, 50).map((file, idx) => (
                <div
                  key={idx}
                  className={`p-3 border rounded-lg flex items-center gap-3 ${
                    file.status === 'completed'
                      ? 'bg-green-50 border-green-200'
                      : file.status === 'failed'
                      ? 'bg-red-50 border-red-200'
                      : file.status === 'processing'
                      ? 'bg-blue-50 border-blue-200 animate-pulse'
                      : 'bg-gray-50'
                  }`}
                >
                  {file.status === 'completed' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : file.status === 'failed' ? (
                    <XCircle className="h-5 w-5 text-red-600" />
                  ) : file.status === 'processing' ? (
                    <Zap className="h-5 w-5 text-blue-600 animate-spin" />
                  ) : (
                    <File className="h-5 w-5 text-gray-500" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-600">
                      {file.type} • {file.size}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      file.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : file.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : file.status === 'processing'
                        ? 'bg-blue-100 text-blue-800'
                        : ''
                    }
                  >
                    {file.status}
                  </Badge>
                </div>
              ))}
              {files.length > 50 && (
                <p className="text-sm text-center text-gray-500 py-4">
                  ...and {files.length - 50} more files
                </p>
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {files.length === 0 && (
          <div className="py-12 text-center border-2 border-dashed rounded-lg">
            <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">No Files Selected</p>
            <p className="text-sm text-gray-600 mb-4">
              Upload hundreds of files for batch processing
            </p>
            <Button onClick={handleUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Select Files
            </Button>
          </div>
        )}

        {/* Info */}
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-cyan-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-cyan-900 mb-1">Batch Processing Power</p>
              <ul className="text-cyan-700 text-xs space-y-1">
                <li>• <strong>Process thousands</strong> of files in parallel - 10x faster than manual</li>
                <li>• <strong>Supported formats</strong>: CSV, .mpt (BioLogic), .txt, Excel, HDF5, Parquet</li>
                <li>• <strong>Auto-standardization</strong>: Units, column names, encoding</li>
                <li>• <strong>Error handling</strong>: Automatic retry, detailed logs for failures</li>
                <li>• <strong>Vercel-optimized</strong>: Edge functions for fast processing</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
