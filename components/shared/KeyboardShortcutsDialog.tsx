'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

interface Shortcut {
  keys: string[]
  description: string
  category: string
}

const shortcuts: Shortcut[] = [
  // Navigation
  { keys: ['G', 'D'], description: 'Go to Dashboard', category: 'Navigation' },
  { keys: ['G', 'P'], description: 'Go to Projects', category: 'Navigation' },
  { keys: ['G', 'F'], description: 'Go to Favorites', category: 'Navigation' },
  { keys: ['G', 'S'], description: 'Go to Settings', category: 'Navigation' },

  // Actions
  { keys: ['N'], description: 'New Project', category: 'Actions' },
  { keys: ['U'], description: 'Upload Data', category: 'Actions' },
  { keys: ['Ctrl', 'K'], description: 'Search', category: 'Actions' },
  { keys: ['Ctrl', 'E'], description: 'Export Data', category: 'Actions' },

  // General
  { keys: ['?'], description: 'Show Shortcuts', category: 'General' },
  { keys: ['Esc'], description: 'Close Dialog', category: 'General' },
]

interface KeyboardShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KeyboardShortcutsDialog({ open, onOpenChange }: KeyboardShortcutsDialogProps) {
  const categories = Array.from(new Set(shortcuts.map(s => s.category)))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Use these shortcuts to navigate and perform actions faster
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-semibold mb-3 text-gray-700">{category}</h3>
              <div className="space-y-2">
                {shortcuts
                  .filter(s => s.category === category)
                  .map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                      <span className="text-sm text-gray-600">{shortcut.description}</span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, i) => (
                          <span key={i}>
                            <Badge variant="outline" className="font-mono text-xs">
                              {key}
                            </Badge>
                            {i < shortcut.keys.length - 1 && (
                              <span className="text-gray-400 mx-1">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Hook to handle keyboard shortcuts
 */
export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for special keys
      const key = event.key.toLowerCase()
      const ctrl = event.ctrlKey || event.metaKey
      const shift = event.shiftKey

      // Ignore if typing in an input
      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return
      }

      // Build shortcut string
      let shortcut = ''
      if (ctrl) shortcut += 'ctrl+'
      if (shift) shortcut += 'shift+'
      shortcut += key

      // Execute shortcut if it exists
      if (shortcuts[shortcut]) {
        event.preventDefault()
        shortcuts[shortcut]()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}
