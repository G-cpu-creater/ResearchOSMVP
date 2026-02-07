'use client'

import React from 'react'
import { Home, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BreadcrumbsProps {
    paper: {
        title: string
        folder?: {
            id: string
            name: string
            path: string
        } | null
    }
    onFolderClick?: (folderId: string) => void
}

export function Breadcrumbs({ paper, onFolderClick }: BreadcrumbsProps) {
    if (!paper.folder) {
        return (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Home className="h-4 w-4" />
                <ChevronRight className="h-3 w-3" />
                <span className="text-gray-400">Uncategorized</span>
                <ChevronRight className="h-3 w-3" />
                <span className="font-medium text-gray-900">{paper.title}</span>
            </div>
        )
    }

    // Parse path to get folder hierarchy
    // Path format: "/folderId1/folderId2/currentFolderId/"
    const folderIds = paper.folder.path.split('/').filter(Boolean)

    // For now, we'll just show the immediate parent folder
    // In a full implementation, you'd fetch all folder names from the path

    return (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Home className="h-4 w-4" />
            <ChevronRight className="h-3 w-3" />

            {onFolderClick ? (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:text-blue-600"
                    onClick={() => onFolderClick(paper.folder!.id)}
                >
                    {paper.folder.name}
                </Button>
            ) : (
                <span className="text-gray-600">{paper.folder.name}</span>
            )}

            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-gray-900 truncate max-w-md">{paper.title}</span>
        </div>
    )
}
