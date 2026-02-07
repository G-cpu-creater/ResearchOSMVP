'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import {
  GitBranch,
  History,
  RotateCcw,
  GitCompare,
  Clock,
  User,
  Download,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface DataVersion {
  id: string
  version: number
  timestamp: Date
  author: {
    name: string
    avatar?: string
  }
  message: string
  changes: {
    added: number
    modified: number
    deleted: number
  }
  fileSize: number
  status: 'current' | 'previous'
}

const mockVersions: DataVersion[] = [
  {
    id: '1',
    version: 3,
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    author: { name: 'You' },
    message: 'Removed outliers and normalized data',
    changes: { added: 0, modified: 234, deleted: 12 },
    fileSize: 156234,
    status: 'current',
  },
  {
    id: '2',
    version: 2,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    author: { name: 'You' },
    message: 'Applied temperature compensation',
    changes: { added: 45, modified: 1200, deleted: 0 },
    fileSize: 158901,
    status: 'previous',
  },
  {
    id: '3',
    version: 1,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    author: { name: 'Dr. Sarah Chen' },
    message: 'Initial data upload from BioLogic instrument',
    changes: { added: 15234, modified: 0, deleted: 0 },
    fileSize: 162456,
    status: 'previous',
  },
]

export function DataVersionControl({ datasetId }: { datasetId: string }) {
  const [versions, setVersions] = useState<DataVersion[]>([])
  const [showComparison, setShowComparison] = useState(false)

  // For demo purposes - in production, fetch from API
  // setVersions(mockVersions)

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleRestoreVersion = (version: DataVersion) => {
    // Handle version restore
    console.log('Restoring version:', version.version)
  }

  const handleCompareVersions = (v1: number, v2: number) => {
    setShowComparison(true)
    console.log('Comparing versions:', v1, v2)
  }

  const handleDownloadVersion = (version: DataVersion) => {
    console.log('Downloading version:', version.version)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Data Version Control
            </CardTitle>
            <CardDescription>
              Track every change - Never lose data, revert anytime
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <History className="h-4 w-4 mr-2" />
            View Full History
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {versions.length === 0 ? (
          <div className="py-12 text-center">
            <GitBranch className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">No version history yet</p>
            <p className="text-gray-400 text-xs mt-1">
              Version history will be created as you make changes to your data
            </p>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                Why Version Control?
              </h3>
              <ul className="text-xs text-blue-800 space-y-1 text-left">
                <li>• Revert to any previous version instantly</li>
                <li>• Compare changes between versions</li>
                <li>• Track who made what changes when</li>
                <li>• Prevent accidental data loss</li>
                <li>• Meet data integrity requirements</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Version Timeline */}
            <div className="relative space-y-4">
              {versions.map((version, index) => (
                <div key={version.id} className="relative">
                  {/* Timeline Line */}
                  {index < versions.length - 1 && (
                    <div className="absolute left-[21px] top-12 bottom-0 w-0.5 bg-gray-200" />
                  )}

                  <div className="flex items-start gap-4">
                    {/* Version Icon */}
                    <div
                      className={`relative z-10 h-10 w-10 rounded-full flex items-center justify-center ${
                        version.status === 'current'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {version.status === 'current' ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-bold">v{version.version}</span>
                      )}
                    </div>

                    {/* Version Details */}
                    <div className="flex-1 min-w-0">
                      <Card className={version.status === 'current' ? 'ring-2 ring-blue-500' : ''}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-sm">Version {version.version}</h3>
                                {version.status === 'current' && (
                                  <Badge className="bg-blue-100 text-blue-800">Current</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-700">{version.message}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User className="h-4 w-4" />
                              <span>{version.author.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>
                                {formatDistanceToNow(version.timestamp, { addSuffix: true })}
                              </span>
                            </div>
                          </div>

                          {/* Changes Summary */}
                          <div className="flex items-center gap-4 text-xs mb-3">
                            <div className="flex items-center gap-1">
                              <span className="text-green-600">+{version.changes.added}</span>
                              <span className="text-gray-500">added</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-blue-600">~{version.changes.modified}</span>
                              <span className="text-gray-500">modified</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-red-600">-{version.changes.deleted}</span>
                              <span className="text-gray-500">deleted</span>
                            </div>
                            <div className="ml-auto text-gray-500">
                              {formatFileSize(version.fileSize)}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {version.status !== 'current' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRestoreVersion(version)}
                                >
                                  <RotateCcw className="h-3 w-3 mr-1" />
                                  Restore
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCompareVersions(version.version, versions[0].version)}
                                >
                                  <GitCompare className="h-3 w-3 mr-1" />
                                  Compare
                                </Button>
                              </>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadVersion(version)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Info Box */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-green-900 mb-1">Data Protected</p>
                  <p className="text-green-700 text-xs">
                    {versions.length} versions saved. You can restore any previous version at any time.
                    All changes are tracked and reversible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
