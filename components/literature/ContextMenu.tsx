'use client'

import React from 'react'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { FolderInput, Edit, Trash } from 'lucide-react'

interface PaperContextMenuProps {
    paper: any
    onMove: () => void
    onRename: () => void
    onDelete: () => void
    children: React.ReactNode
}

export function PaperContextMenu({
    paper,
    onMove,
    onRename,
    onDelete,
    children
}: PaperContextMenuProps) {
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent className="w-48">
                <ContextMenuItem onClick={onMove} className="cursor-pointer">
                    <FolderInput className="mr-2 h-4 w-4" />
                    Move to Folder
                </ContextMenuItem>
                <ContextMenuItem onClick={onRename} className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" />
                    Rename
                </ContextMenuItem>
                <ContextMenuItem onClick={onDelete} className="cursor-pointer text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}

interface FolderContextMenuProps {
    folder: any
    onRename: () => void
    onDelete: () => void
    children: React.ReactNode
}

export function FolderContextMenu({
    folder,
    onRename,
    onDelete,
    children
}: FolderContextMenuProps) {
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent className="w-48">
                <ContextMenuItem onClick={onRename} className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" />
                    Rename Folder
                </ContextMenuItem>
                <ContextMenuItem onClick={onDelete} className="cursor-pointer text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Folder
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}
