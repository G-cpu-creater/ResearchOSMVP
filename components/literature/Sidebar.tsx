'use client'

import React, { useState } from 'react'
import { FolderNode } from './FolderNode'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface SidebarProps {
    folders: any[]
    selectedFolderId: string | null
    onSelectFolder: (id: string) => void
    onCreateFolder: () => void
}

export function Sidebar({ folders, selectedFolderId, onSelectFolder, onCreateFolder }: SidebarProps) {
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

    const toggleFolder = (id: string) => {
        const newExpanded = new Set(expandedFolders)
        if (newExpanded.has(id)) {
            newExpanded.delete(id)
        } else {
            newExpanded.add(id)
        }
        setExpandedFolders(newExpanded)
    }

    return (
        <div className="w-64 border-r bg-gray-50 flex flex-col h-full">
            <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-semibold text-sm text-gray-700">Library</h2>
                <Button variant="ghost" size="icon" onClick={onCreateFolder} className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                <div
                    className={cn(
                        "flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-gray-100 rounded text-sm mb-2",
                        selectedFolderId === null && "bg-blue-50 text-blue-600"
                    )}
                    onClick={() => onSelectFolder('')}
                >
                    <span className="font-medium">All Papers</span>
                </div>

                {folders.map(folder => (
                    <FolderNode
                        key={folder.id}
                        folder={folder}
                        level={0}
                        selectedFolderId={selectedFolderId}
                        onSelect={onSelectFolder}
                        onToggle={toggleFolder}
                        expanded={expandedFolders.has(folder.id)}
                    />
                ))}
            </div>
        </div>
    )
}

import { cn } from '@/lib/utils'
