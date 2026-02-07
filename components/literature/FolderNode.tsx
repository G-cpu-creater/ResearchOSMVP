'use client'

import React from 'react'
import { Folder, ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FolderNodeProps {
    folder: any
    level: number
    selectedFolderId: string | null
    onSelect: (id: string) => void
    onToggle: (id: string) => void
    expanded: boolean
}

import { FolderContextMenu } from './ContextMenu'
import { useDroppable, useDraggable } from '@dnd-kit/core'

export function FolderNode({ folder, level, selectedFolderId, onSelect, onToggle, expanded, onRename, onDelete }: FolderNodeProps & { onRename?: (id: string) => void, onDelete?: (folder: any) => void }) {
    const { attributes, listeners, setNodeRef: setDragRef, transform, isDragging } = useDraggable({
        id: folder.id,
        data: { type: 'folder', folder }
    })

    const { setNodeRef: setDropRef, isOver } = useDroppable({
        id: folder.id,
        data: { type: 'folder', folder }
    })

    // Combine refs
    const setNodeRef = (node: HTMLElement | null) => {
        setDragRef(node)
        setDropRef(node)
    }

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
    } : undefined

    return (
        <FolderContextMenu
            folder={folder}
            onRename={() => onRename?.(folder.id)}
            onDelete={() => onDelete?.(folder)}
        >
            <div>
                <div
                    ref={setNodeRef}
                    {...listeners}
                    {...attributes}
                    className={cn(
                        "flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-gray-100 rounded text-sm",
                        selectedFolderId === folder.id && "bg-blue-50 text-blue-600",
                        isOver && "bg-blue-100 ring-2 ring-blue-300"
                    )}
                    style={{
                        paddingLeft: `${level * 12 + 8}px`,
                        ...style
                    }}
                    onClick={() => onSelect(folder.id)}
                >
                    <div
                        className="p-1 hover:bg-gray-200 rounded"
                        onClick={(e) => {
                            e.stopPropagation()
                            onToggle(folder.id)
                        }}
                    >
                        {expanded ? (
                            <ChevronDown className="h-3 w-3 text-gray-500" />
                        ) : (
                            <ChevronRight className="h-3 w-3 text-gray-500" />
                        )}
                    </div>
                    <Folder className={cn("h-4 w-4", selectedFolderId === folder.id ? "text-blue-500" : "text-yellow-500")} />
                    <span className="truncate">{folder.name}</span>
                </div>

                {expanded && folder.children && (
                    <div>
                        {folder.children.map((child: any) => (
                            <FolderNode
                                key={child.id}
                                folder={child}
                                level={level + 1}
                                selectedFolderId={selectedFolderId}
                                onSelect={onSelect}
                                onToggle={onToggle}
                                expanded={true} // Need state management for children expansion
                                onRename={onRename}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </FolderContextMenu>
    )
}
