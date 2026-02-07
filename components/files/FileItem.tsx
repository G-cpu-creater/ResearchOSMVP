'use client'

import { FileNode, useFileManagerStore } from '@/lib/stores/fileManagerStore'
import { useState } from 'react'
import { RenameInput } from './RenameInput'
import { FileText, FileImage, FileSpreadsheet, Download, Trash2 } from 'lucide-react'

interface FileItemProps {
  file: FileNode
  depth: number
}

const FILE_ICONS: Record<string, React.ReactNode> = {
  pdf: <FileText className="h-4 w-4 text-red-600" />,
  doc: <FileText className="h-4 w-4 text-blue-600" />,
  docx: <FileText className="h-4 w-4 text-blue-600" />,
  txt: <FileText className="h-4 w-4 text-gray-600" />,
  png: <FileImage className="h-4 w-4 text-purple-600" />,
  jpg: <FileImage className="h-4 w-4 text-purple-600" />,
  jpeg: <FileImage className="h-4 w-4 text-purple-600" />,
  gif: <FileImage className="h-4 w-4 text-purple-600" />,
  xlsx: <FileSpreadsheet className="h-4 w-4 text-green-600" />,
  xls: <FileSpreadsheet className="h-4 w-4 text-green-600" />,
  csv: <FileSpreadsheet className="h-4 w-4 text-green-600" />,
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileItem({ file, depth }: FileItemProps) {
  const { selectedNodeId, selectNode, renameNode, deleteNode } = useFileManagerStore()
  const [isRenaming, setIsRenaming] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  const isSelected = selectedNodeId === file.id
  const icon = FILE_ICONS[file.extension] || <FileText className="h-4 w-4 text-gray-600" />
  
  const handleDoubleClick = () => {
    setIsRenaming(true)
  }
  
  const handleRename = async (newName: string) => {
    await renameNode(file.id, newName)
    setIsRenaming(false)
  }
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(`Delete "${file.name}"?`)) {
      await deleteNode(file.id)
    }
  }
  
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(file.url, '_blank')
  }
  
  return (
    <div
      className={`flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-100' : isHovered ? 'bg-gray-50' : ''
      }`}
      style={{ paddingLeft: `${depth * 20 + 12}px` }}
      onClick={() => selectNode(file.id)}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {icon}
      
      {isRenaming ? (
        <RenameInput
          initialValue={file.name}
          onSave={handleRename}
          onCancel={() => setIsRenaming(false)}
        />
      ) : (
        <>
          <span className="flex-1 text-sm truncate">{file.name}</span>
          <span className="text-xs text-gray-500">{formatSize(file.size)}</span>
          
          {isHovered && (
            <div className="flex gap-1">
              <button
                onClick={handleDownload}
                className="p-1 hover:bg-gray-200 rounded"
                title="Download"
              >
                <Download className="h-3 w-3 text-gray-600" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 hover:bg-red-100 rounded"
                title="Delete"
              >
                <Trash2 className="h-3 w-3 text-red-600" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
