'use client'

import { ChevronRight, ChevronDown, Folder, Plus } from 'lucide-react'
import { FolderNode, useFileManagerStore } from '@/lib/stores/fileManagerStore'
import { useState, useRef } from 'react'
import { RenameInput } from './RenameInput'
import { FileItem } from './FileItem'

interface FolderItemProps {
  folder: FolderNode
  depth: number
}

export function FolderItem({ folder, depth }: FolderItemProps) {
  const {
    nodes,
    selectedNodeId,
    selectNode,
    toggleFolder,
    renameNode,
    addFile,
    projectId,
  } = useFileManagerStore()
  
  const [isRenaming, setIsRenaming] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const isSelected = selectedNodeId === folder.id
  const isExpanded = folder.isExpanded
  
  // Get children
  const children = Object.values(nodes).filter(node => node.parentId === folder.id)
  const childFolders = children.filter(n => n.type === 'folder').sort((a, b) => a.name.localeCompare(b.name))
  const childFiles = children.filter(n => n.type === 'file').sort((a, b) => a.name.localeCompare(b.name))
  
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFolder(folder.id)
  }
  
  const handleDoubleClick = () => {
    setIsRenaming(true)
  }
  
  const handleRename = async (newName: string) => {
    await renameNode(folder.id, newName)
    setIsRenaming(false)
  }
  
  const handleUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    fileInputRef.current?.click()
  }
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !projectId) return
    
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('folderId', folder.id)
      
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i])
      }
      
      const res = await fetch(`/api/projects/${projectId}/files/upload`, {
        method: 'POST',
        body: formData,
      })
      
      if (res.ok) {
        const uploadedFiles = await res.json()
        uploadedFiles.forEach((file: any) => addFile(file))
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }
  
  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer transition-colors ${
          isSelected ? 'bg-blue-100' : isHovered ? 'bg-gray-50' : ''
        }`}
        style={{ paddingLeft: `${depth * 20 + 12}px` }}
        onClick={() => selectNode(folder.id)}
        onDoubleClick={handleDoubleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button onClick={handleToggle} className="p-0.5 hover:bg-gray-200 rounded">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          )}
        </button>
        
        <Folder className="h-4 w-4 text-blue-600" />
        
        {isRenaming ? (
          <RenameInput
            initialValue={folder.name}
            onSave={handleRename}
            onCancel={() => setIsRenaming(false)}
          />
        ) : (
          <>
            <span className="flex-1 text-sm font-medium truncate">{folder.name}</span>
            
            {isHovered && (
              <>
                <button
                  onClick={handleUploadClick}
                  className="p-1 hover:bg-blue-100 rounded"
                  title="Upload files"
                  disabled={isUploading}
                >
                  <Plus className="h-3.5 w-3.5 text-blue-600" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </>
            )}
          </>
        )}
      </div>
      
      {isExpanded && (
        <div>
          {childFolders.length === 0 && childFiles.length === 0 && (
            <div
              className="text-xs text-gray-400 italic py-1"
              style={{ paddingLeft: `${(depth + 1) * 20 + 12}px` }}
            >
              Empty folder
            </div>
          )}
          
          {childFolders.map((childFolder) => (
            <FolderItem
              key={childFolder.id}
              folder={childFolder as FolderNode}
              depth={depth + 1}
            />
          ))}
          
          {childFiles.map((childFile) => (
            <FileItem
              key={childFile.id}
              file={childFile as any}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
