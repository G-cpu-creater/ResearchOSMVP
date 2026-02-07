'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
  Search,
  FolderOpen,
  PlusCircle,
  Database,
  BarChart3,
  FileText,
  Home,
  Settings,
  LogOut,
  Upload,
} from 'lucide-react'

interface CommandPaletteProps {
  projects?: any[]
}

export function CommandPalette({ projects = [] }: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const router = useRouter()

  // Handle Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = useCallback(
    (command: () => void) => {
      setOpen(false)
      command()
    },
    []
  )

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 shadow-lg max-w-2xl">
        <Command className="rounded-lg border-none" shouldFilter>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              placeholder="Type a command or search..."
              value={search}
              onValueChange={setSearch}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-gray-500">
              No results found.
            </Command.Empty>

            {/* Quick Actions */}
            <Command.Group heading="Quick Actions">
              <Command.Item
                onSelect={() => runCommand(() => router.push('/dashboard'))}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 aria-selected:bg-gray-100"
              >
                <Home className="h-4 w-4" />
                <span>Go to Dashboard</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push('/dashboard/projects/new'))}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 aria-selected:bg-gray-100"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Create New Project</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push('/dashboard/projects'))}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 aria-selected:bg-gray-100"
              >
                <FolderOpen className="h-4 w-4" />
                <span>View All Projects</span>
              </Command.Item>
            </Command.Group>

            {/* Recent Projects */}
            {projects.length > 0 && (
              <Command.Group heading="Recent Projects">
                {projects.slice(0, 5).map((project) => (
                  <Command.Item
                    key={project.id}
                    onSelect={() =>
                      runCommand(() => router.push(`/dashboard/projects/${project.id}`))
                    }
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 aria-selected:bg-gray-100"
                  >
                    <FileText className="h-4 w-4" />
                    <div className="flex-1">
                      <div className="font-medium">{project.title}</div>
                      {project.researchType && (
                        <div className="text-xs text-gray-500">{project.researchType}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Database className="h-3 w-3" />
                      {project._count?.datasets || 0}
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Actions */}
            <Command.Group heading="Actions">
              <Command.Item
                onSelect={() => runCommand(handleLogout)}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-red-50 aria-selected:bg-red-50 text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          <div className="border-t p-2 text-xs text-gray-500">
            <div className="flex items-center justify-between">
              <span>Press</span>
              <div className="flex items-center gap-2">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium">
                  <span className="text-xs">⌘</span>K
                </kbd>
                <span>to toggle</span>
              </div>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
