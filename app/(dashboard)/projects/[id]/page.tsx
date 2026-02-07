'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DataManagementTab,
  VisualizationTab,
} from '@/components/LazyComponents'
import { CollaborationPanel } from '@/components/collaboration/CollaborationPanel'
import { LabNotebook } from '@/components/notebook/LabNotebook'
import { ExportPanel } from '@/components/export/ExportPanel'
import { Users, BookOpen, Download } from 'lucide-react'
import { NotesContainer } from '@/components/Notes/NotesContainer'
import { ProjectSidebar } from '@/components/navigation/ProjectSidebar'
import { SidebarToggle } from '@/components/navigation/SidebarToggle'
import { ProjectAIChatProvider } from '@/lib/hooks/useProjectAIChat'
import { ProjectAIChatSidebar } from '@/components/ai/ProjectAIChatSidebar'
import { AnalysisPage } from '@/components/analysis/AnalysisPage'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = params.id as string
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const activeView = searchParams.get('view') || 'overview'
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const setActiveView = (view: string) => {
    router.push(`/projects/${projectId}?view=${view}`, { scroll: false })
  }

  useEffect(() => {
    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`)
      const data = await res.json()
      setProject(data.project)
    } catch (error) {
      console.error('Failed to fetch project:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">Project not found</h3>
            <p className="text-gray-600">
              This project may have been deleted or you don't have access to it.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Find Overview Page (first page or specific title)
  const overviewPage = project.pages?.[0]

  // Research Tools
  const researchTools = [
    {
      id: 'collaboration',
      title: 'Team Collaboration',
      description: 'Work together with your team',
      icon: Users,
      iconBg: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
    },
    {
      id: 'export',
      title: 'Export & Publish',
      description: 'Publication-ready exports',
      icon: Download,
      iconBg: 'bg-teal-50',
      iconColor: 'text-teal-600',
    },
    {
      id: 'notebook',
      title: 'Lab Notebook',
      description: 'Document experiments with timestamps',
      icon: BookOpen,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
  ]

  const navigationItems: any[] = []

  return (
    <ProjectAIChatProvider projectId={projectId}>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <ProjectSidebar
          isOpen={sidebarOpen}
          activeView={activeView}
          onViewChange={setActiveView}
          navigationItems={navigationItems}
          researchTools={researchTools}
          onOpenChange={setSidebarOpen}
          projectId={projectId}
        />

        <SidebarToggle
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="flex-1 transition-all duration-300 ml-0">
          <div className="h-full overflow-y-auto">
            <div className="p-8">
            {activeView === 'overview' && (
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
              </div>
            )}

            <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
              <TabsList className="hidden"></TabsList>

        {/* Overview Tab - Notes Container */}
        <TabsContent value="overview" className="space-y-6">
          {/* Notes Container (Jupyter-style blocks) */}
          {overviewPage ? (
            <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="p-4 border-b bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800">Research Notes</h2>
              </div>
              <div className="h-[800px]">
                <NotesContainer noteId={overviewPage.id} />
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No overview page found for this project.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Visualization Tab - NEW */}
        <TabsContent value="visualization">
          <VisualizationTab />
        </TabsContent>

        {/* Analysis Tab - NEW */}
        <TabsContent value="analysis">
          <AnalysisPage />
        </TabsContent>

        {/* Research Tool Tabs (kept from original) */}
        <TabsContent value="collaboration">
          <CollaborationPanel projectId={projectId} />
        </TabsContent>

        <TabsContent value="notebook">
          <LabNotebook projectId={projectId} />
        </TabsContent>

        <TabsContent value="export">
          <ExportPanel projectId={projectId} projectTitle={project.title} />
        </TabsContent>
      </Tabs>
          </div>
        </div>
      </div>
      
      {/* AI Chat Sidebar - accessible from all tabs */}
      <ProjectAIChatSidebar projectId={projectId} />
    </div>
    </ProjectAIChatProvider>
  )
}

