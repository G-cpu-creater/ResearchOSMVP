'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Brain,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Target,
  Zap,
  Eye,
  CheckCircle2,
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface Insight {
  id: string
  type: 'anomaly' | 'pattern' | 'suggestion' | 'prediction' | 'optimization'
  severity: 'info' | 'warning' | 'critical'
  title: string
  description: string
  confidence: number
  actionable: boolean
  suggestedAction?: string
}

interface DataPattern {
  name: string
  description: string
  occurrences: number
  significance: number
}

// Solves: "Human-in-the-loop processing" + "Interactive & human-centered ML"
// Top emerging research topics for 2025 from BigVis workshop
export function AIResearchCopilot({ experimentId }: { experimentId?: string }) {
  const [insights, setInsights] = useState<Insight[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeMonitoring, setActiveMonitoring] = useState(false)
  const { toast } = useToast()

  // Simulate real-time AI monitoring
  useEffect(() => {
    if (!activeMonitoring) return

    const interval = setInterval(() => {
      // Randomly generate new insights
      if (Math.random() > 0.7) {
        const newInsight: Insight = {
          id: Date.now().toString(),
          type: ['anomaly', 'pattern', 'suggestion'][Math.floor(Math.random() * 3)] as any,
          severity: ['info', 'warning'][Math.floor(Math.random() * 2)] as any,
          title: ['Unusual voltage fluctuation detected', 'Cyclability pattern identified', 'Optimization opportunity'][Math.floor(Math.random() * 3)],
          description: 'AI detected an interesting pattern in your data',
          confidence: 75 + Math.random() * 20,
          actionable: true,
          suggestedAction: 'Review data quality settings',
        }
        setInsights(prev => [newInsight, ...prev].slice(0, 10))
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [activeMonitoring])

  const runAnalysis = async () => {
    setIsAnalyzing(true)

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2500))

    const detectedInsights: Insight[] = [
      {
        id: '1',
        type: 'anomaly',
        severity: 'warning',
        title: 'Voltage Spike Detected at Cycle 47',
        description: 'Voltage increased by 15% beyond expected range. This may indicate electrode degradation or SEI layer formation.',
        confidence: 92,
        actionable: true,
        suggestedAction: 'Inspect electrode surface using SEM, check electrolyte purity',
      },
      {
        id: '2',
        type: 'pattern',
        severity: 'info',
        title: 'Consistent Capacity Fade Pattern',
        description: 'Linear capacity fade of 0.08%/cycle detected. Pattern matches lithium plating behavior in literature.',
        confidence: 88,
        actionable: true,
        suggestedAction: 'Compare with reference dataset DOI:10.1016/j.jpowsour.2023.xxxxx',
      },
      {
        id: '3',
        type: 'prediction',
        severity: 'info',
        title: 'Estimated End-of-Life: Cycle 850±45',
        description: 'Based on current degradation rate, battery will reach 80% capacity at cycle 850. Confidence interval: 805-895 cycles.',
        confidence: 85,
        actionable: false,
      },
      {
        id: '4',
        type: 'optimization',
        severity: 'info',
        title: 'Charging Protocol Optimization Available',
        description: 'AI suggests reducing C-rate from 1C to 0.8C in cycles 1-10 to improve SEI formation. Expected 12% capacity retention improvement.',
        confidence: 79,
        actionable: true,
        suggestedAction: 'Update protocol: formation cycles at 0.8C for 10 cycles',
      },
      {
        id: '5',
        type: 'suggestion',
        severity: 'info',
        title: 'Similar Experiment Found in Database',
        description: 'Found 3 experiments with 95% similarity in your lab archive. Review for comparison or reuse protocols.',
        confidence: 91,
        actionable: true,
        suggestedAction: 'View similar experiments: EXP_2024_087, EXP_2024_103, EXP_2024_156',
      },
      {
        id: '6',
        type: 'anomaly',
        severity: 'critical',
        title: 'Temperature Sensor Drift Detected',
        description: 'Temperature readings showing 0.3°C systematic drift over past 2 hours. Calibration may be needed.',
        confidence: 94,
        actionable: true,
        suggestedAction: 'Pause experiment, verify temperature sensor calibration',
      },
    ]

    setInsights(detectedInsights)
    setIsAnalyzing(false)

    toast({
      title: 'AI analysis complete',
      description: `${detectedInsights.length} insights generated with avg confidence ${Math.round(detectedInsights.reduce((sum, i) => sum + i.confidence, 0) / detectedInsights.length)}%`,
    })
  }

  const patterns: DataPattern[] = [
    { name: 'SEI Formation', description: 'First-cycle irreversible capacity loss', occurrences: 234, significance: 92 },
    { name: 'Lithium Plating', description: 'Low-temperature capacity fade', occurrences: 87, significance: 88 },
    { name: 'Dendrite Growth', description: 'Irregular impedance increase', occurrences: 56, significance: 95 },
    { name: 'Electrolyte Decomposition', description: 'Voltage plateau shift', occurrences: 123, significance: 79 },
  ]

  const insightIcons = {
    anomaly: AlertTriangle,
    pattern: TrendingUp,
    suggestion: Lightbulb,
    prediction: Target,
    optimization: Zap,
  }

  const insightColors = {
    anomaly: 'border-l-red-500 bg-red-50',
    pattern: 'border-l-blue-500 bg-blue-50',
    suggestion: 'border-l-yellow-500 bg-yellow-50',
    prediction: 'border-l-purple-500 bg-purple-50',
    optimization: 'border-l-green-500 bg-green-50',
  }

  const stats = {
    totalInsights: insights.length,
    actionable: insights.filter(i => i.actionable).length,
    critical: insights.filter(i => i.severity === 'critical').length,
    avgConfidence: insights.length > 0 ? Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length) : 0,
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Research Copilot
            </CardTitle>
            <CardDescription>
              Human-in-the-loop ML - Smart pattern detection, anomaly alerts, optimization suggestions
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={activeMonitoring ? 'bg-green-50 text-green-700 animate-pulse' : 'bg-gray-50'}
            >
              {activeMonitoring ? (
                <>
                  <Sparkles className="h-3 w-3 mr-1" />
                  Live AI
                </>
              ) : (
                'Inactive'
              )}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-blue-600">{stats.totalInsights}</p>
              <p className="text-xs text-gray-600 mt-1">Total Insights</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-green-600">{stats.actionable}</p>
              <p className="text-xs text-gray-600 mt-1">Actionable</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              <p className="text-xs text-gray-600 mt-1">Critical</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-purple-600">{stats.avgConfidence}%</p>
              <p className="text-xs text-gray-600 mt-1">Avg Confidence</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button onClick={runAnalysis} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Brain className="h-4 w-4 mr-2 animate-pulse" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Run AI Analysis
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => setActiveMonitoring(!activeMonitoring)}>
            <Eye className="h-4 w-4 mr-2" />
            {activeMonitoring ? 'Stop' : 'Start'} Real-Time Monitoring
          </Button>
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3">AI Insights & Recommendations</h3>
            <div className="space-y-3">
              {insights.map(insight => {
                const Icon = insightIcons[insight.type]
                return (
                  <div key={insight.id} className={`p-4 border-l-4 rounded-lg ${insightColors[insight.type]}`}>
                    <div className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 mt-0.5 ${
                        insight.type === 'anomaly' ? 'text-red-600' :
                        insight.type === 'pattern' ? 'text-blue-600' :
                        insight.type === 'suggestion' ? 'text-yellow-600' :
                        insight.type === 'prediction' ? 'text-purple-600' :
                        'text-green-600'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs capitalize">
                            {insight.type}
                          </Badge>
                          {insight.severity === 'critical' && (
                            <Badge className="bg-red-100 text-red-800 text-xs">Critical</Badge>
                          )}
                          <Badge variant="outline" className="text-xs">{Math.round(insight.confidence)}% confident</Badge>
                        </div>
                        <p className="font-medium text-sm mb-1">{insight.title}</p>
                        <p className="text-sm text-gray-700">{insight.description}</p>
                        {insight.suggestedAction && (
                          <div className="mt-2 p-2 bg-white rounded border">
                            <p className="text-xs font-medium text-gray-700 mb-1">
                              <Lightbulb className="h-3 w-3 inline mr-1" />
                              Suggested Action:
                            </p>
                            <p className="text-xs text-gray-600">{insight.suggestedAction}</p>
                          </div>
                        )}
                      </div>
                      {insight.actionable && (
                        <Button variant="outline" size="sm">
                          Apply
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Learned patterns */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Learned Patterns from Your Lab</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {patterns.map(pattern => (
              <div key={pattern.name} className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">{pattern.name}</p>
                  <Badge variant="outline" className="text-xs">
                    {pattern.significance}% sig.
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">{pattern.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <TrendingUp className="h-3 w-3" />
                  <span>{pattern.occurrences} occurrences in dataset</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-indigo-900 mb-1">AI-Powered Research Assistance</p>
              <ul className="text-indigo-700 text-xs space-y-1">
                <li>• <strong>Top 2025 trend</strong>: "Human-in-the-loop processing" voted #1 by BigVis experts</li>
                <li>• <strong>Pattern recognition</strong>: Detect SEI formation, lithium plating, dendrite growth automatically</li>
                <li>• <strong>Anomaly detection</strong>: Flag sensor drift, electrode degradation, unusual behavior</li>
                <li>• <strong>Predictive analytics</strong>: Estimate battery EOL, capacity fade, optimal protocols</li>
                <li>• <strong>Smart suggestions</strong>: Find similar experiments, optimize parameters, cite relevant papers</li>
                <li>• <strong>Real-time monitoring</strong>: 24/7 AI surveillance with instant alerts</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
