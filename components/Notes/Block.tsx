'use client'

import React from 'react'
import { BlockHeader } from './BlockHeader'
import { BlockEditor } from './BlockEditor'
import { NoteBlock } from './NotesContainer'
import { Button } from '@/components/ui/button'
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react'

interface BlockProps {
  block: NoteBlock
  onDelete: () => void
  onUpdate: (updates: Partial<NoteBlock>) => void
  onMoveUp: () => void
  onMoveDown: () => void
  onAddBlockAfter: () => void
  canMoveUp: boolean
  canMoveDown: boolean
  canDelete: boolean
}

export function Block({
  block,
  onDelete,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onAddBlockAfter,
  canMoveUp,
  canMoveDown,
  canDelete
}: BlockProps) {
  return (
    <div 
      className="
        group relative bg-white rounded-lg border border-gray-200 
        shadow-sm hover:shadow-md transition-all duration-200 p-6
      "
      data-block-id={block.id}
    >
      {/* Control buttons (visible on hover, always visible on mobile) */}
      <div className="
        absolute top-3 right-3 
        opacity-100 sm:opacity-0 sm:group-hover:opacity-100 
        transition-opacity duration-200
        flex items-center gap-1
      ">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-gray-100"
          onClick={onMoveUp}
          disabled={!canMoveUp}
          title="Move up"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-gray-100"
          onClick={onMoveDown}
          disabled={!canMoveDown}
          title="Move down"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-red-50 text-red-500 hover:text-red-600"
          onClick={onDelete}
          disabled={!canDelete}
          title={canDelete ? "Delete block" : "Cannot delete last block"}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Block content */}
      <div className="space-y-4 pr-16 sm:pr-24">
        <BlockHeader
          value={block.header}
          onChange={(header: string) => onUpdate({ header })}
        />

        <BlockEditor
          blockId={block.id}
          content={block.content}
          onChange={(content: string) => onUpdate({ content })}
          onAddBlockAfter={onAddBlockAfter}
          onDeleteBlock={canDelete ? onDelete : undefined}
        />
      </div>
    </div>
  )
}
