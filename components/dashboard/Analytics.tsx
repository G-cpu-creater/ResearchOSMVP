'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FolderOpen,
  Database,
  BarChart3,
  FileText,
  TrendingUp,
  Activity,
  Zap,
  Clock,
} from 'lucide-react'

interface AnalyticsData {
  totalProjects: number
  totalDatasets: number
  totalVisualizations: number
  totalPages: number
  recentActivity: {
    projectsThisWeek: number
    datasetsThisWeek: number
  }
  techniqueDistribution: {
    CV: number
    EIS: number
    BatteryCycling: number
    CA: number
    CP: number
    other: number
  }
  storageUsed: number
}

export function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics')
      if (res.ok) {
        const data = await res.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!analytics) {
    return null
  }

  const stats = [
    {
      title: 'Total Projects',
      value: analytics.totalProjects,
      icon: FolderOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: `${analytics.recentActivity.projectsThisWeek} this week`,
    },
    {
      title: 'Datasets',
      value: analytics.totalDatasets,
      icon: Database,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: `${analytics.recentActivity.datasetsThisWeek} this week`,
    },
    {
      title: 'Visualizations',
      value: analytics.totalVisualizations,
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Total plots created',
    },
    {
      title: 'Research Notes',
      value: analytics.totalPages,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Total pages written',
    },
  ]

  const techniques = [
    { name: 'CV', count: analytics.techniqueDistribution.CV, color: 'bg-blue-500' },
    { name: 'EIS', count: analytics.techniqueDistribution.EIS, color: 'bg-green-500' },
    {
      name: 'Battery',
      count: analytics.techniqueDistribution.BatteryCycling,
      color: 'bg-purple-500',
    },
    { name: 'CA', count: analytics.techniqueDistribution.CA, color: 'bg-yellow-500' },
    { name: 'CP', count: analytics.techniqueDistribution.CP, color: 'bg-red-500' },
    { name: 'Other', count: analytics.techniqueDistribution.other, color: 'bg-gray-500' },
  ]

  const totalTechniques = techniques.reduce((sum, t) => sum + t.count, 0)

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Technique Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-600" />
            Technique Distribution
          </CardTitle>
          <CardDescription>
            Breakdown of experimental techniques across all datasets
          </CardDescription>
        </CardHeader>
        <CardContent>
          {totalTechniques > 0 ? (
            <div className="space-y-4">
              {/* Bar chart */}
              <div className="space-y-3">
                {techniques
                  .filter((t) => t.count > 0)
                  .sort((a, b) => b.count - a.count)
                  .map((technique) => {
                    const percentage = (technique.count / totalTechniques) * 100
                    return (
                      <div key={technique.name}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{technique.name}</span>
                          <span className="text-sm text-gray-600">
                            {technique.count} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`${technique.color} h-2.5 rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
              </div>

              {/* Summary */}
              <div className="pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Total Datasets</span>
                  <span className="text-gray-600">{totalTechniques}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No datasets yet</p>
              <p className="text-sm mt-1">Upload data to see technique distribution</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
              <div className="flex items-center">
                <FolderOpen className="h-4 w-4 mr-2 text-blue-600" />
                <span className="text-sm font-medium">Projects This Week</span>
              </div>
              <span className="text-lg font-bold text-blue-600">
                {analytics.recentActivity.projectsThisWeek}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded">
              <div className="flex items-center">
                <Database className="h-4 w-4 mr-2 text-green-600" />
                <span className="text-sm font-medium">Datasets This Week</span>
              </div>
              <span className="text-lg font-bold text-green-600">
                {analytics.recentActivity.datasetsThisWeek}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <Zap className="h-5 w-5 mr-2 text-yellow-600" />
              System Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
              <div className="flex items-center">
                <Database className="h-4 w-4 mr-2 text-purple-600" />
                <span className="text-sm font-medium">Storage Used</span>
              </div>
              <span className="text-sm font-semibold text-purple-600">
                {(analytics.storageUsed / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-orange-600" />
                <span className="text-sm font-medium">Account Active</span>
              </div>
              <span className="text-sm font-semibold text-orange-600">
                {analytics.totalProjects > 0 ? 'Active' : 'New'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
