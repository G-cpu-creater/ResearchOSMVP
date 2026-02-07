'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, Clock } from 'lucide-react'

interface LabNotebookProps {
  projectId: string
}

export function LabNotebook({ projectId }: LabNotebookProps) {
  return (
    <div className="flex items-center justify-center min-h-[600px]">
      <Card className="max-w-3xl w-full">
        <CardHeader>
          <div className="flex items-center justify-center gap-3 mb-2">
            <Bell className="h-8 w-8 text-blue-600" />
            <CardTitle className="text-2xl text-center">Lab Notebook & Reminders</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <Clock className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-lg text-blue-900 mb-2">Feature Under Development</h3>
                <p className="text-blue-800 leading-relaxed">
                  This powerful feature will enable you to set intelligent reminders for critical reactions, 
                  experimental milestones, and important deadlines. Never miss a crucial timing again!
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Upcoming Capabilities:</h4>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="h-2 w-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Reaction Time Alerts</p>
                  <p className="text-sm text-gray-600">
                    Schedule notifications for time-sensitive reactions and monitoring intervals
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="h-2 w-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Multi-Channel Notifications</p>
                  <p className="text-sm text-gray-600">
                    Receive alerts via WhatsApp messages or SMS directly to your registered mobile number
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="h-2 w-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Deadline Management</p>
                  <p className="text-sm text-gray-600">
                    Track submission deadlines, equipment booking times, and project milestones
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="h-2 w-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Smart Reminders</p>
                  <p className="text-sm text-gray-600">
                    Automated reminders based on your experimental protocols and workflow patterns
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-500">
              Stay tuned for updates! This feature will be available soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
