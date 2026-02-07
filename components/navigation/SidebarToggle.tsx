'use client'

import { ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarToggleProps {
  isOpen: boolean
  onToggle: () => void
}

export function SidebarToggle({ isOpen, onToggle }: SidebarToggleProps) {
  // Pre-compute classes
  const baseClasses = 'fixed top-1/2 -translate-y-1/2 z-50 transition-all duration-300 rounded-r-lg rounded-l-none shadow-lg'
  const positionClass = isOpen ? 'left-64' : 'left-0'
  const buttonClasses = baseClasses + ' ' + positionClass

  return (
    <Button
      onClick={onToggle}
      className={buttonClasses}
      size="sm"
      variant="default"
    >
      {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
    </Button>
  )
}
