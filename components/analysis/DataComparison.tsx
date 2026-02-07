'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GitCompare, Plus, X, LineChart, Download } from 'lucide-react'

interface Dataset {
  id: string
  name: string
  technique: string
  uploadedAt: string
  rowCount: number
}

export function DataComparison() {
  const [selectedDatasets, setSelectedDatasets] = useState<Dataset[]>([])
  const [comparisonMode, setComparisonMode] = useState<'overlay' | 'sidebyside'>('overlay')

  // TODO: Fetch available datasets from API
  const availableDatasets: Dataset[] = []

  const addDataset = (dataset: Dataset) => {
    if (selectedDatasets.length < 4 && !selectedDatasets.find(d => d.id === dataset.id)) {
      setSelectedDatasets([...selectedDatasets, dataset])
    }
  }

  const removeDataset = (id: string) => {
    setSelectedDatasets(selectedDatasets.filter(d => d.id !== id))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GitCompare className="h-5 w-5" />
                Dataset Comparison
              </CardTitle>
              <CardDescription>
                Compare up to 4 datasets simultaneously
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={comparisonMode === 'overlay' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setComparisonMode('overlay')}
              >
                Overlay
              </Button>
              <Button
                variant={comparisonMode === 'sidebyside' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setComparisonMode('sidebyside')}
              >
                Side by Side
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Selected Datasets */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Selected Datasets ({selectedDatasets.length}/4)</h3>
            {selectedDatasets.length === 0 ? (
              <div className="p-8 border-2 border-dashed rounded-lg text-center text-gray-500">
                <LineChart className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Select datasets below to start comparison</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {selectedDatasets.map((dataset, index) => (
                  <div
                    key={dataset.id}
                    className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-white relative"
                    style={{
                      borderLeftWidth: '4px',
                      borderLeftColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index]
                    }}
                  >
                    <button
                      onClick={() => removeDataset(dataset.id)}
                      className="absolute top-2 right-2 p-1 hover:bg-white rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <p className="font-medium text-sm mb-1">{dataset.name}</p>
                    <div className="flex gap-2 text-xs text-gray-600">
                      <Badge variant="outline">{dataset.technique}</Badge>
                      <span>{dataset.rowCount} points</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Datasets */}
          <div>
            <h3 className="text-sm font-medium mb-3">Available Datasets</h3>
            <div className="space-y-2">
              {availableDatasets.map(dataset => (
                <div
                  key={dataset.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-sm">{dataset.name}</p>
                    <p className="text-xs text-gray-500">
                      {dataset.technique} • {dataset.rowCount} data points • {dataset.uploadedAt}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addDataset(dataset)}
                    disabled={selectedDatasets.length >= 4 || selectedDatasets.some(d => d.id === dataset.id)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Actions */}
          {selectedDatasets.length >= 2 && (
            <div className="mt-6 flex gap-2 justify-end pt-4 border-t">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Comparison
              </Button>
              <Button>
                <LineChart className="h-4 w-4 mr-2" />
                Generate Comparison Plot
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparison Results (shown when datasets are selected) */}
      {selectedDatasets.length >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Comparison Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Comparison visualization would appear here</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
