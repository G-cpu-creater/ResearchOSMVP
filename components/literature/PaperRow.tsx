'use client'

import React from 'react'
import { FileText, MoreVertical, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

interface PaperRowProps {
    paper: any
    onSelect: (paper: any) => void
    selected: boolean
}

export function PaperRow({ paper, onSelect, selected }: PaperRowProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: paper.id,
        data: { type: 'paper', paper }
    })

    const style = {
        transform: CSS.Translate.toString(transform),
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`flex items-center gap-4 p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${selected ? 'bg-blue-50' : ''}`}
            onClick={() => onSelect(paper)}
        >
            <div className="h-10 w-10 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-red-500" />
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{paper.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <span className="truncate max-w-[200px]">{paper.authors?.join(', ') || 'Unknown Authors'}</span>
                    <span>•</span>
                    <span>{paper.year || 'N/A'}</span>
                    <span>•</span>
                    <span className="truncate max-w-[150px]">{paper.journal || 'Unknown Journal'}</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {paper.doi && (
                    <Badge variant="outline" className="text-xs">
                        DOI: {paper.doi}
                    </Badge>
                )}
                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                </Button>
            </div>
        </div>
    )
}
