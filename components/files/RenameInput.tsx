'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'

interface RenameInputProps {
  initialValue: string
  onSave: (newName: string) => void
  onCancel: () => void
}

export function RenameInput({ initialValue, onSave, onCancel }: RenameInputProps) {
  const [value, setValue] = useState(initialValue)
  
  const handleSave = () => {
    const trimmed = value.trim()
    if (trimmed && trimmed !== initialValue) {
      onSave(trimmed)
    } else {
      onCancel()
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
  }
  
  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleSave}
      onKeyDown={handleKeyDown}
      className="h-6 px-2 py-0 text-sm"
      autoFocus
      onFocus={(e) => e.target.select()}
    />
  )
}
