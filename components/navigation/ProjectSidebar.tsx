'use client'

import { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { FileManagerSection } from '@/components/files/FileManagerSection'

interface NavigationItem {
  id: string
  label: string
  icon: LucideIcon
}

interface ResearchTool {
  id: string
  title: string
  description: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
}

interface ProjectSidebarProps {
  isOpen: boolean
  activeView: string
  onViewChange: (view: string) => void
  navigationItems: NavigationItem[]
  researchTools: ResearchTool[]
  onOpenChange?: (open: boolean) => void
  projectId: string
}

export function ProjectSidebar({
  isOpen,
  activeView,
  onViewChange,
  navigationItems,
  researchTools,
  onOpenChange,
  projectId,
}: ProjectSidebarProps) {
  const [isHovering, setIsHovering] = useState(false)

  const shouldShow = isOpen || isHovering

  // Pre-compute all class names to avoid template literal issues
  const baseClasses = 'fixed left-0 top-0 h-full bg-white border-r shadow-lg transition-all duration-300 ease-in-out z-50'
  const widthClass = shouldShow ? 'w-64' : 'w-0'
  const sidebarClasses = baseClasses + ' ' + widthClass

  const handleMouseEnter = () => {
    setIsHovering(true)
    if (onOpenChange) onOpenChange(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    if (onOpenChange && !isOpen) onOpenChange(false)
  }

  return (
    <div
      className={sidebarClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col h-full overflow-hidden">
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* File Manager Section - First */}
          <FileManagerSection projectId={projectId} />
          
          {/* Research Tools - Moved to bottom */}
          <div className="pt-6 mt-6 border-t">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Research Tools
            </div>
            {researchTools.map((tool) => {
              const Icon = tool.icon
              const isActive = activeView === tool.id
              const btnBaseClasses = 'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all'
              const btnActiveClasses = isActive
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
              const buttonClasses = btnBaseClasses + ' ' + btnActiveClasses

              return (
                <button
                  key={tool.id}
                  onClick={() => onViewChange(tool.id)}
                  className={buttonClasses}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium text-sm">{tool.title}</span>
                </button>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}
