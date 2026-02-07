'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlusCircle, Search, FileText, Database, MoreVertical, Pencil, Trash2, Edit2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<any[]>([])
  const [filteredProjects, setFilteredProjects] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Rename state
  const [renamingProject, setRenamingProject] = useState<any>(null)
  const [newTitle, setNewTitle] = useState('')
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = projects.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredProjects(filtered)
    } else {
      setFilteredProjects(projects)
    }
  }, [searchQuery, projects])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      setProjects(data.projects || [])
      setFilteredProjects(data.projects || [])
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      await fetch(`/api/projects/${projectId}`, { method: 'DELETE' })
      fetchProjects()
      toast({
        title: 'Project deleted',
        description: 'The project has been successfully removed.',
      })
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to delete project',
        description: error.message,
      })
    }
  }

  const openRenameDialog = (project: any) => {
    setRenamingProject(project)
    setNewTitle(project.title)
    setIsRenameDialogOpen(true)
  }

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!renamingProject) return

    setIsRenaming(true)
    try {
      const res = await fetch(`/api/projects/${renamingProject.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      })

      if (!res.ok) throw new Error('Failed to rename project')

      toast({
        title: 'Project renamed',
        description: 'The project title has been updated.',
      })

      fetchProjects()
      setIsRenameDialogOpen(false)
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to rename project',
        description: error.message,
      })
    } finally {
      setIsRenaming(false)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-gray-600">
            Manage your research projects
          </p>
        </div>
        <Link href="/projects/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? 'Try a different search term'
                : 'Get started by creating your first research project'}
            </p>
            {!searchQuery && (
              <Link href="/projects/new">
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow group relative">
              <Link href={`/projects/${project.id}`} className="block h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="line-clamp-1 pr-8">{project.title}</CardTitle>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {project.description || 'No description'}
                  </CardDescription>
                  {project.researchType && (
                    <div className="inline-block">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {project.researchType}
                      </span>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {project._count?.pages || 0}
                    </div>
                    <div className="flex items-center">
                      <Database className="h-4 w-4 mr-1" />
                      {project._count?.datasets || 0}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {formatDate(project.updatedAt)}
                  </p>
                </CardContent>
              </Link>

              {/* Actions Menu */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/projects/${project.id}`)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Open
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openRenameDialog(project)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => deleteProject(project.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
            <DialogDescription>
              Enter a new name for your project.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRename}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter project name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isRenaming}>
                {isRenaming ? 'Renaming...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
