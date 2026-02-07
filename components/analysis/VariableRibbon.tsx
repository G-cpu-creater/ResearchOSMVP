'use client'

import { useDatasetStore } from '@/lib/stores/datasetStore'
import { VariableItem } from './VariableItem'
import { FileText, Database } from 'lucide-react'

export function VariableRibbon() {
  const { dataset } = useDatasetStore()

  if (!dataset) {
    return (
      <div className="fixed right-0 top-0 w-64 h-full bg-white border-l border-gray-200 p-4 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Database className="h-12 w-12 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No dataset loaded</p>
          <p className="text-xs mt-1">Upload data in Visualization tab</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed right-0 top-0 w-64 h-full bg-gray-50 border-l border-gray-200 flex flex-col z-30">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-4 w-4 text-blue-600" />
          <h3 className="font-semibold text-sm text-gray-800">Variables</h3>
        </div>
        <p className="text-xs text-gray-600 truncate">{dataset.filename}</p>
        <p className="text-xs text-gray-500 mt-1">
          {dataset.headers.length} columns • {dataset.indexArray.length} rows
        </p>
      </div>

      {/* Variables List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {dataset.headers.map((header) => (
          <VariableItem
            key={header}
            name={header}
            dataPreview={dataset.data[header] || []}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 p-3">
        <p className="text-xs text-gray-500 text-center">
          Drag variables to canvas
        </p>
      </div>
    </div>
  )
}
