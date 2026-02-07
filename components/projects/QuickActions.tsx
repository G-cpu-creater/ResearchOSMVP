'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Battery, Zap, FlaskConical, FileText, Upload, PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  action: () => void
  color: string
}

export function QuickActions() {
  const router = useRouter()

  const actions: QuickAction[] = [
    {
      id: 'new-project',
      title: 'New Project',
      description: 'Start a new research project',
      icon: <PlusCircle className="h-6 w-6" />,
      action: () => router.push('/dashboard/projects/new'),
      color: 'bg-blue-50 text-blue-600',
    },
    {
      id: 'upload-data',
      title: 'Upload Data',
      description: 'Import experimental data',
      icon: <Upload className="h-6 w-6" />,
      action: () => router.push('/dashboard/projects'),
      color: 'bg-green-50 text-green-600',
    },
    {
      id: 'cv-template',
      title: 'CV Analysis',
      description: 'Cyclic voltammetry template',
      icon: <Zap className="h-6 w-6" />,
      action: () => createTemplateProject('cv'),
      color: 'bg-purple-50 text-purple-600',
    },
    {
      id: 'eis-template',
      title: 'EIS Analysis',
      description: 'Impedance spectroscopy template',
      icon: <FlaskConical className="h-6 w-6" />,
      action: () => createTemplateProject('eis'),
      color: 'bg-orange-50 text-orange-600',
    },
    {
      id: 'battery-template',
      title: 'Battery Testing',
      description: 'Battery cycling template',
      icon: <Battery className="h-6 w-6" />,
      action: () => createTemplateProject('battery'),
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      id: 'report',
      title: 'Generate Report',
      description: 'Create research report',
      icon: <FileText className="h-6 w-6" />,
      action: () => router.push('/dashboard/projects'),
      color: 'bg-pink-50 text-pink-600',
    },
  ]

  const createTemplateProject = async (type: string) => {
    try {
      const templates = {
        cv: {
          title: 'Cyclic Voltammetry Study',
          description: 'Template for CV analysis with standard parameters',
          researchType: 'cyclic_voltammetry',
        },
        eis: {
          title: 'EIS Analysis Project',
          description: 'Electrochemical impedance spectroscopy workflow',
          researchType: 'eis',
        },
        battery: {
          title: 'Battery Cycling Test',
          description: 'Battery performance and cycling analysis',
          researchType: 'battery',
        },
      }

      const template = templates[type as keyof typeof templates]

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/dashboard/projects/${data.project.id}`)
      }
    } catch (error) {
      console.error('Failed to create template project:', error)
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={action.action}
          className="p-6 bg-white border rounded-lg hover:shadow-lg transition-all hover:scale-105 text-left group"
        >
          <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
            {action.icon}
          </div>
          <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
          <p className="text-xs text-gray-500">{action.description}</p>
        </button>
      ))}
    </div>
  )
}
