'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Database,
  FileText,
  Zap,
} from 'lucide-react'

interface QualityMetric {
  name: string
  score: number
  status: 'excellent' | 'good' | 'fair' | 'poor'
  trend: 'up' | 'down' | 'stable'
  details: string
}

interface DatasetHealth {
  overall: number
  completeness: number
  accuracy: number
  consistency: number
  timeliness: number
  validity: number
  uniqueness: number
}

// Solves: Real-time data quality monitoring
// Prevents "90% of spreadsheets have errors" from propagating
export function DatasetQualityDashboard({ projectId }: { projectId?: string }) {
  const [health, setHealth] = useState<DatasetHealth>({
    overall: 87,
    completeness: 92,
    accuracy: 85,
    consistency: 89,
    timeliness: 95,
    validity: 81,
    uniqueness: 94,
  })

  const [isLive, setIsLive] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setHealth(prev => ({
        ...prev,
        overall: Math.max(70, Math.min(100, prev.overall + (Math.random() - 0.5) * 2)),
        accuracy: Math.max(70, Math.min(100, prev.accuracy + (Math.random() - 0.5) * 3)),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive])

  const metrics: QualityMetric[] = [
    {
      name: 'Completeness',
      score: health.completeness,
      status: 'excellent',
      trend: 'stable',
      details: '92% of required fields filled. Missing: 234 optional fields',
    },
    {
      name: 'Accuracy',
      score: health.accuracy,
      status: 'good',
      trend: 'up',
      details: '15% of values validated against reference data. 3 outliers detected',
    },
    {
      name: 'Consistency',
      score: health.consistency,
      status: 'good',
      trend: 'stable',
      details: 'Units consistent across 89% of measurements. 12 format discrepancies',
    },
    {
      name: 'Timeliness',
      score: health.timeliness,
      status: 'excellent',
      trend: 'up',
      details: 'Last updated 5 minutes ago. Data collection ongoing',
    },
    {
      name: 'Validity',
      score: health.validity,
      status: 'fair',
      trend: 'down',
      details: '19% of values outside expected range. Review calibration',
    },
    {
      name: 'Uniqueness',
      score: health.uniqueness,
      status: 'excellent',
      trend: 'stable',
      details: '6% duplicate rows detected and flagged',
    },
  ]

  const recentIssues = [
    {
      id: '1',
      severity: 'warning' as const,
      message: '3 voltage readings outside ±5% tolerance',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      autoFixed: false,
    },
    {
      id: '2',
      severity: 'info' as const,
      message: '12 duplicate timestamps removed automatically',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      autoFixed: true,
    },
    {
      id: '3',
      severity: 'critical' as const,
      message: 'Temperature sensor appears uncalibrated (offset: +2.3°C)',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      autoFixed: false,
    },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 75) return 'text-blue-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-50 border-green-200'
    if (score >= 75) return 'bg-blue-50 border-blue-200'
    if (score >= 60) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  const formatTimeSince = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    return `${Math.floor(minutes / 60)}h ago`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Dataset Quality Dashboard
            </CardTitle>
            <CardDescription>
              Real-time quality monitoring - Prevent the "90% spreadsheet error" problem
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={
                health.overall >= 90
                  ? 'bg-green-50 text-green-700'
                  : health.overall >= 75
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-yellow-50 text-yellow-700'
              }
            >
              {Math.round(health.overall)}% Quality Score
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLive(!isLive)}
            >
              {isLive ? (
                <>
                  <Zap className="h-3 w-3 mr-1 animate-pulse" />
                  Live
                </>
              ) : (
                'Start Live'
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall score */}
        <div className={`p-6 border-2 rounded-lg ${getScoreBg(health.overall)}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Overall Data Quality</p>
              <p className={`text-5xl font-bold ${getScoreColor(health.overall)}`}>
                {Math.round(health.overall)}
              </p>
            </div>
            {health.overall >= 90 ? (
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            ) : health.overall >= 75 ? (
              <TrendingUp className="h-16 w-16 text-blue-600" />
            ) : (
              <AlertTriangle className="h-16 w-16 text-yellow-600" />
            )}
          </div>
          <Progress value={health.overall} className="h-3" />
        </div>

        {/* Quality metrics */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Quality Dimensions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map(metric => (
              <div key={metric.name} className={`p-4 border rounded-lg ${getScoreBg(metric.score)}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">{metric.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {metric.score}%
                    </Badge>
                    {metric.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : metric.trend === 'down' ? (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    ) : null}
                  </div>
                </div>
                <Progress value={metric.score} className="h-2 mb-2" />
                <p className="text-xs text-gray-600">{metric.details}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent issues */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Recent Quality Issues</h3>
          <div className="space-y-2">
            {recentIssues.map(issue => (
              <div
                key={issue.id}
                className={`p-3 border-l-4 rounded-lg ${
                  issue.severity === 'critical'
                    ? 'bg-red-50 border-red-500'
                    : issue.severity === 'warning'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          issue.severity === 'critical'
                            ? 'bg-red-100 text-red-800'
                            : issue.severity === 'warning'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {issue.severity.toUpperCase()}
                      </Badge>
                      {issue.autoFixed && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Auto-fixed
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-900">{issue.message}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Clock className="h-3 w-3" />
                      {formatTimeSince(issue.timestamp)}
                    </div>
                  </div>
                  {!issue.autoFixed && (
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-blue-600" />
                <p className="text-2xl font-bold text-blue-600">15.2M</p>
              </div>
              <p className="text-xs text-gray-600">Data Points</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-green-600" />
                <p className="text-2xl font-bold text-green-600">234</p>
              </div>
              <p className="text-xs text-gray-600">Auto-Fixes Applied</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <p className="text-2xl font-bold text-orange-600">3</p>
              </div>
              <p className="text-xs text-gray-600">Issues Pending</p>
            </CardContent>
          </Card>
        </div>

        {/* Info */}
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-teal-900 mb-1">Why Quality Monitoring Matters</p>
              <ul className="text-teal-700 text-xs space-y-1">
                <li>• <strong>90% of spreadsheets have errors</strong> - Real-time monitoring catches them early</li>
                <li>• <strong>6 quality dimensions</strong> - Completeness, accuracy, consistency, timeliness, validity, uniqueness</li>
                <li>• <strong>Auto-fix capabilities</strong> - 234 issues corrected automatically in this dataset</li>
                <li>• <strong>Prevents error propagation</strong> - Catch issues before analysis</li>
                <li>• <strong>GLP compliance</strong> - Audit trail of all quality checks</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
