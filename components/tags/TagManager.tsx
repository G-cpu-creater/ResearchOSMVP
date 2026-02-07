'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Plus, Tag, Hash } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface TagManagerProps {
  existingTags?: string[]
  onTagsChange?: (tags: string[]) => void
  maxTags?: number
}

const predefinedTags = [
  'Battery',
  'CV',
  'EIS',
  'Corrosion',
  'Catalyst',
  'Fuel Cell',
  'Supercapacitor',
  'Important',
  'In Progress',
  'Completed',
  'Review Needed',
]

const tagColors = [
  'bg-red-100 text-red-800 border-red-200',
  'bg-blue-100 text-blue-800 border-blue-200',
  'bg-green-100 text-green-800 border-green-200',
  'bg-yellow-100 text-yellow-800 border-yellow-200',
  'bg-purple-100 text-purple-800 border-purple-200',
  'bg-pink-100 text-pink-800 border-pink-200',
  'bg-indigo-100 text-indigo-800 border-indigo-200',
  'bg-orange-100 text-orange-800 border-orange-200',
]

export function TagManager({ existingTags = [], onTagsChange, maxTags = 10 }: TagManagerProps) {
  const [tags, setTags] = useState<string[]>(existingTags)
  const [newTag, setNewTag] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase()
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < maxTags) {
      const updatedTags = [...tags, trimmedTag]
      setTags(updatedTags)
      onTagsChange?.(updatedTags)
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove)
    setTags(updatedTags)
    onTagsChange?.(updatedTags)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(newTag)
    }
  }

  const getTagColor = (tag: string) => {
    const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return tagColors[index % tagColors.length]
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Badge
            key={tag}
            className={`${getTagColor(tag)} flex items-center gap-1 border px-2 py-1`}
          >
            <Hash className="h-3 w-3" />
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="ml-1 hover:text-red-600 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        {tags.length < maxTags && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-7">
                <Plus className="h-3 w-3 mr-1" />
                Add Tag
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Tags</DialogTitle>
                <DialogDescription>
                  Add tags to organize and categorize your work ({tags.length}/{maxTags})
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Create custom tag */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Create Custom Tag</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter tag name..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <Button onClick={() => addTag(newTag)} disabled={!newTag.trim()}>
                      Add
                    </Button>
                  </div>
                </div>

                {/* Predefined tags */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Quick Add</label>
                  <div className="flex flex-wrap gap-2">
                    {predefinedTags
                      .filter(tag => !tags.includes(tag.toLowerCase()))
                      .map(tag => (
                        <button
                          key={tag}
                          onClick={() => addTag(tag)}
                          className="px-3 py-1.5 text-sm border rounded-full hover:bg-gray-100 transition-colors"
                          disabled={tags.length >= maxTags}
                        >
                          <Hash className="h-3 w-3 inline mr-1" />
                          {tag}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Current tags */}
                {tags.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Current Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <Badge
                          key={tag}
                          className={`${getTagColor(tag)} border`}
                        >
                          <Hash className="h-3 w-3 mr-1" />
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-2 hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setIsOpen(false)}>Done</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {tags.length === 0 && (
        <p className="text-sm text-gray-500">No tags added yet</p>
      )}
    </div>
  )
}

/**
 * Tag filter component
 */
export function TagFilter({ tags, selectedTags, onTagSelect }: {
  tags: string[]
  selectedTags: string[]
  onTagSelect: (tag: string) => void
}) {
  const getTagColor = (tag: string) => {
    const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return tagColors[index % tagColors.length]
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => {
        const isSelected = selectedTags.includes(tag)
        return (
          <button
            key={tag}
            onClick={() => onTagSelect(tag)}
            className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-all ${
              isSelected
                ? getTagColor(tag)
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Hash className="h-3 w-3" />
            {tag}
            {isSelected && <X className="h-3 w-3 ml-1" />}
          </button>
        )
      })}
    </div>
  )
}
