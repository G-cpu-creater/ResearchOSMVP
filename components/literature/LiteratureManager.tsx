'use client'

import React, { useState } from 'react'
import useSWR from 'swr'
import { Sidebar } from './Sidebar'
import { PaperRow } from './PaperRow'
import { PaperRightPanel } from './PaperRightPanel'
import { Button } from '@/components/ui/button'
import { Upload, Plus } from 'lucide-react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'

const fetcher = (url: string) => fetch(url).then(r => r.json())

// Mock project ID for now, should come from props or context
// const DEMO_PROJECT_ID = 'demo-project-id'

interface LiteratureManagerProps {
  projectId: string
}

export function LiteratureManager({ projectId }: LiteratureManagerProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [selectedPaper, setSelectedPaper] = useState<any | null>(null)
  const { toast } = useToast()

  const { data: folders, mutate: mutateFolders } = useSWR(`/api/literature/folders?projectId=${projectId}`, fetcher)
  const { data: papers, mutate: mutatePapers } = useSWR(
    `/api/literature/papers?projectId=${projectId}&folderId=${selectedFolderId || ''}`,
    fetcher
  )

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: any) => {
    const { active, over } = event

    if (!over) return

    const activeId = active.id
    const overId = over.id

    // Check if we dropped a paper onto a folder
    if (active.data.current?.type === 'paper' && over.data.current?.type === 'folder') {
      const paperId = activeId
      const targetFolderId = overId

      // Call API
      try {
        await fetch(`/api/literature/papers/${paperId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ folderId: targetFolderId }),
        })

        // Refresh data
        mutatePapers()
        mutateFolders()

        toast({
          title: "Moved paper",
          description: "Paper moved successfully",
          action: (
            <ToastAction altText="Undo" onClick={async () => {
              await fetch(`/api/literature/papers/${paperId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folderId: active.data.current.paper.folderId }), // Revert to old folder
              })
              mutatePapers()
            }}>
              Undo
            </ToastAction>
          ),
        })
      } catch (error) {
        console.error('Failed to move paper:', error)
        toast({
          title: "Error",
          description: "Failed to move paper",
          variant: "destructive"
        })
      }
    }

    // Check if we dropped a folder onto a folder
    if (active.data.current?.type === 'folder' && over.data.current?.type === 'folder') {
      const movingFolderId = activeId
      const targetFolderId = overId

      if (movingFolderId === targetFolderId) return

      const movingFolder = active.data.current.folder

      // Prevent moving into self or descendant
      // We need the path of the target folder to check this properly, but for now we can check if the target folder path contains the moving folder ID
      // Ideally we'd have the target folder object here.
      // Let's assume over.data.current.folder exists
      const targetFolder = over.data.current.folder

      if (targetFolder.path && targetFolder.path.includes(`/${movingFolderId}/`)) {
        alert('Cannot move folder into its own subfolder')
        return
      }

      try {
        await fetch(`/api/literature/folders/${movingFolderId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parentId: targetFolderId }),
        })

        mutateFolders()
      } catch (error) {
        console.error('Failed to move folder:', error)
      }
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex h-full bg-white">
        <Sidebar
          folders={folders || []}
          selectedFolderId={selectedFolderId}
          onSelectFolder={setSelectedFolderId}
          onCreateFolder={() => console.log('Create folder')}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <div className="p-4 border-b flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              {selectedFolderId ? folders?.find((f: any) => f.id === selectedFolderId)?.name : 'All Papers'}
            </h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Import PDF
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Paper
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <SortableContext items={papers?.map((p: any) => p.id) || []} strategy={verticalListSortingStrategy}>
              {papers?.map((paper: any) => (
                <PaperRow
                  key={paper.id}
                  paper={paper}
                  onSelect={setSelectedPaper}
                  selected={selectedPaper?.id === paper.id}
                />
              ))}
            </SortableContext>

            {(!papers || papers.length === 0) && (
              <div className="p-8 text-center text-gray-500">
                No papers found in this folder.
              </div>
            )}
          </div>
        </div>

        {selectedPaper && (
          <PaperRightPanel
            paper={selectedPaper}
            onClose={() => setSelectedPaper(null)}
          />
        )}
      </div>
    </DndContext>
  )
}
