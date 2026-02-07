'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

interface ExportPanelProps {
  projectId: string
  projectTitle: string
}

export function ExportPanel({ projectId, projectTitle }: ExportPanelProps) {
  const handleSuggestionClick = () => {
    window.open('https://forms.gle/dummyformlink', '_blank')
  }

  return (
    <div className="flex items-center justify-center min-h-[600px]">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Export Features</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-lg text-gray-600">
            Features of export are yet to be published, please submit your suggestions here.
          </p>
          
          <Button
            onClick={handleSuggestionClick}
            size="lg"
            className="gap-2"
          >
            Submit Suggestions
            <ExternalLink className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
