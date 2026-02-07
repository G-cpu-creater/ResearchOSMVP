'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Play,
  Pause,
  Square,
  Activity,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  BarChart3,
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Experiment {
  id: string
  name: string
  technique: string
  status: 'running' | 'paused' | 'completed' | 'failed'
  progress: number
  startTime: Date
  estimatedEndTime?: Date
  currentCycle?: number
  totalCycles?: number
  liveData: { time: number; value: number }[]
  metrics: {
    voltage?: number
    current?: number
    temperature?: number
    impedance?: number
  }
}

const mockExperiments: Experiment[] = [
  {
    id: '1',
    name: 'Battery Cycling Test',
    technique: 'Galvanostatic Cycling',
    status: 'running',
    progress: 67,
    startTime: new Date(Date.now() - 1000 * 60 * 45),
    estimatedEndTime: new Date(Date.now() + 1000 * 60 * 20),
    currentCycle: 67,
    totalCycles: 100,
    liveData: Array.from({ length: 20 }, (_, i) => ({
      time: i,
      value: Math.sin(i / 3) * 10 + 50 + Math.random() * 5,
    })),
    metrics: {
      voltage: 3.847,
      current: 0.125,
      temperature: 25.3,
    },
  },
]

export function LiveExperimentTracker() {
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [selectedExp, setSelectedExp] = useState<string | null>(null)

  useEffect(() => {
    // TODO: Connect to real-time data source (WebSocket/SSE)
    // For now, show empty state
    setExperiments([])

    // Simulate real-time updates
    const interval = setInterval(() => {
      setExperiments((prev) =>
        prev.map((exp) => {
          if (exp.status !== 'running') return exp
          return {
            ...exp,
            progress: Math.min(100, exp.progress + Math.random() * 2),
            liveData: [
              ...exp.liveData.slice(-19),
              {
                time: exp.liveData.length,
                value: Math.sin(exp.liveData.length / 3) * 10 + 50 + Math.random() * 5,
              },
            ],
            metrics: {
              voltage: exp.metrics.voltage! + (Math.random() - 0.5) * 0.01,
              current: exp.metrics.current! + (Math.random() - 0.5) * 0.001,
              temperature: exp.metrics.temperature! + (Math.random() - 0.5) * 0.1,
            },
          }
        })
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const formatTimeRemaining = (endTime: Date) => {
    const remaining = endTime.getTime() - Date.now()
    const minutes = Math.floor(remaining / 60000)
    const hours = Math.floor(minutes / 60)
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    return `${minutes}m`
  }

  const statusColors = {
    running: 'bg-green-100 text-green-800 border-green-200',
    paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    completed: 'bg-blue-100 text-blue-800 border-blue-200',
    failed: 'bg-red-100 text-red-800 border-red-200',
  }

  const statusIcons = {
    running: Activity,
    paused: Pause,
    completed: CheckCircle2,
    failed: AlertTriangle,
  }

  if (experiments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live Experiment Tracker
          </CardTitle>
          <CardDescription>
            Monitor your experiments in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">No active experiments</p>
            <p className="text-gray-400 text-xs mt-1">
              Start an experiment to see real-time monitoring here
            </p>
            <Button className="mt-4" size="sm">
              <Play className="h-4 w-4 mr-2" />
              Start New Experiment
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Experiment Cards */}
      {experiments.map((exp) => {
        const StatusIcon = statusIcons[exp.status]
        return (
          <Card
            key={exp.id}
            className={`transition-all ${selectedExp === exp.id ? 'ring-2 ring-blue-500' : ''}`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg">{exp.name}</CardTitle>
                    <Badge className={statusColors[exp.status]}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {exp.status}
                    </Badge>
                  </div>
                  <CardDescription>{exp.technique}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {exp.status === 'running' && (
                    <Button variant="outline" size="sm">
                      <Pause className="h-4 w-4" />
                    </Button>
                  )}
                  {exp.status === 'paused' && (
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Square className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Cycle {exp.currentCycle} of {exp.totalCycles}
                  </span>
                  <span className="font-medium">{exp.progress.toFixed(1)}%</span>
                </div>
                <Progress value={exp.progress} className="h-2" />
              </div>

              {/* Time Info */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Running for {Math.floor((Date.now() - exp.startTime.getTime()) / 60000)}m</span>
                </div>
                {exp.estimatedEndTime && (
                  <span className="text-gray-600">
                    ~{formatTimeRemaining(exp.estimatedEndTime)} remaining
                  </span>
                )}
              </div>

              {/* Live Metrics */}
              <div className="grid grid-cols-4 gap-4">
                {exp.metrics.voltage !== undefined && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Voltage</p>
                    <p className="text-lg font-bold text-blue-600">
                      {exp.metrics.voltage.toFixed(3)} V
                    </p>
                  </div>
                )}
                {exp.metrics.current !== undefined && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Current</p>
                    <p className="text-lg font-bold text-green-600">
                      {exp.metrics.current.toFixed(3)} A
                    </p>
                  </div>
                )}
                {exp.metrics.temperature !== undefined && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Temperature</p>
                    <p className="text-lg font-bold text-orange-600">
                      {exp.metrics.temperature.toFixed(1)} °C
                    </p>
                  </div>
                )}
                {exp.metrics.impedance !== undefined && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Impedance</p>
                    <p className="text-lg font-bold text-purple-600">
                      {exp.metrics.impedance.toFixed(2)} Ω
                    </p>
                  </div>
                )}
              </div>

              {/* Live Chart */}
              <div className="h-40 bg-gray-50 rounded-lg p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={exp.liveData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="time"
                      stroke="#9ca3af"
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Time (s)', position: 'bottom', fontSize: 10 }}
                    />
                    <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                      animationDuration={300}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Full Data
                </Button>
                <Button variant="outline" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
