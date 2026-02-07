'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  TrendingUp,
  BarChart2,
  Activity,
  Scissors,
  Sparkles,
  Download,
} from 'lucide-react'
import {
  fitLinear,
  fitPolynomial,
  fitExponential,
  fitLogarithmic,
  fitPower,
  calculateStatistics,
  findPeaks,
  smoothData,
  calculateDerivative,
  correctBaseline,
  type FitResult,
  type StatisticsResult,
  type PeakResult,
} from '@/lib/analysis/curve-fitting'

interface DataAnalysisProps {
  data: {
    columns: string[]
    rows: any[][]
  }
  onApplyFit?: (fitResult: FitResult) => void
}

export function DataAnalysis({ data, onApplyFit }: DataAnalysisProps) {
  const [selectedXColumn, setSelectedXColumn] = useState(0)
  const [selectedYColumn, setSelectedYColumn] = useState(1)
  const [fitType, setFitType] = useState<string>('linear')
  const [polynomialOrder, setPolynomialOrder] = useState(2)
  const [fitResult, setFitResult] = useState<FitResult | null>(null)
  const [statistics, setStatistics] = useState<StatisticsResult | null>(null)
  const [peaks, setPeaks] = useState<PeakResult[]>([])

  // Extract numeric data
  const xData = data.rows.map((row) => Number(row[selectedXColumn])).filter((v) => !isNaN(v))
  const yData = data.rows.map((row) => Number(row[selectedYColumn])).filter((v) => !isNaN(v))

  const performCurveFit = () => {
    if (xData.length === 0 || yData.length === 0) return

    let result: FitResult

    switch (fitType) {
      case 'linear':
        result = fitLinear(xData, yData)
        break
      case 'polynomial':
        result = fitPolynomial(xData, yData, polynomialOrder)
        break
      case 'exponential':
        result = fitExponential(xData, yData)
        break
      case 'logarithmic':
        result = fitLogarithmic(xData, yData)
        break
      case 'power':
        result = fitPower(xData, yData)
        break
      default:
        result = fitLinear(xData, yData)
    }

    setFitResult(result)
    if (onApplyFit) onApplyFit(result)
  }

  const calculateStats = () => {
    if (yData.length === 0) return
    const stats = calculateStatistics(yData)
    setStatistics(stats)
  }

  const detectPeaks = () => {
    if (xData.length === 0 || yData.length === 0) return
    const detected = findPeaks(xData, yData, {
      minProminence: 0.1 * (Math.max(...yData) - Math.min(...yData)),
    })
    setPeaks(detected)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
          Advanced Data Analysis
        </CardTitle>
        <CardDescription>
          Curve fitting, statistics, peak detection, and more
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="fitting" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="fitting">
              <TrendingUp className="h-4 w-4 mr-2" />
              Curve Fit
            </TabsTrigger>
            <TabsTrigger value="statistics">
              <BarChart2 className="h-4 w-4 mr-2" />
              Statistics
            </TabsTrigger>
            <TabsTrigger value="peaks">
              <Activity className="h-4 w-4 mr-2" />
              Peaks
            </TabsTrigger>
            <TabsTrigger value="processing">
              <Scissors className="h-4 w-4 mr-2" />
              Processing
            </TabsTrigger>
          </TabsList>

          {/* Column Selection */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="space-y-2">
              <Label>X Column</Label>
              <Select
                value={selectedXColumn.toString()}
                onValueChange={(v) => setSelectedXColumn(parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {data.columns.map((col, idx) => (
                    <SelectItem key={idx} value={idx.toString()}>
                      {col}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Y Column</Label>
              <Select
                value={selectedYColumn.toString()}
                onValueChange={(v) => setSelectedYColumn(parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {data.columns.map((col, idx) => (
                    <SelectItem key={idx} value={idx.toString()}>
                      {col}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Curve Fitting Tab */}
          <TabsContent value="fitting" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Fit Type</Label>
                <Select value={fitType} onValueChange={setFitType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear (y = mx + b)</SelectItem>
                    <SelectItem value="polynomial">Polynomial</SelectItem>
                    <SelectItem value="exponential">Exponential (y = ae^bx)</SelectItem>
                    <SelectItem value="logarithmic">Logarithmic (y = a + b*ln(x))</SelectItem>
                    <SelectItem value="power">Power (y = ax^b)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {fitType === 'polynomial' && (
                <div className="space-y-2">
                  <Label>Polynomial Order</Label>
                  <Input
                    type="number"
                    min="1"
                    max="6"
                    value={polynomialOrder}
                    onChange={(e) => setPolynomialOrder(parseInt(e.target.value))}
                  />
                </div>
              )}

              <Button onClick={performCurveFit} className="w-full">
                Perform Curve Fit
              </Button>

              {fitResult && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg space-y-2">
                  <p className="font-semibold text-green-900 dark:text-green-100">
                    Fit Result: {fitResult.type}
                  </p>
                  <p className="text-sm font-mono text-green-800 dark:text-green-200">
                    {fitResult.equation}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    R² = {fitResult.r2.toFixed(6)}
                    {fitResult.r2 > 0.95 && ' (Excellent fit!)'}
                    {fitResult.r2 > 0.9 && fitResult.r2 <= 0.95 && ' (Good fit)'}
                    {fitResult.r2 <= 0.9 && ' (Poor fit - try different model)'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics" className="space-y-4">
            <Button onClick={calculateStats} className="w-full">
              Calculate Statistics
            </Button>

            {statistics && (
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-500">Mean</p>
                    <p className="text-2xl font-bold">{statistics.mean.toExponential(4)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-500">Median</p>
                    <p className="text-2xl font-bold">{statistics.median.toExponential(4)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-500">Std Dev</p>
                    <p className="text-2xl font-bold">{statistics.stdDev.toExponential(4)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-500">Range</p>
                    <p className="text-lg font-bold">
                      {statistics.min.toExponential(2)} to {statistics.max.toExponential(2)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-500">Q1 / Q3</p>
                    <p className="text-lg font-bold">
                      {statistics.q1.toExponential(2)} / {statistics.q3.toExponential(2)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-500">Count</p>
                    <p className="text-2xl font-bold">{statistics.count}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Peak Detection Tab */}
          <TabsContent value="peaks" className="space-y-4">
            <Button onClick={detectPeaks} className="w-full">
              Detect Peaks
            </Button>

            {peaks.length > 0 && (
              <div className="space-y-2">
                <p className="font-semibold">Found {peaks.length} peaks:</p>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {peaks.map((peak, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded"
                    >
                      <p className="text-sm font-medium">Peak {idx + 1}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Position: x={peak.x.toExponential(4)}, y={peak.y.toExponential(4)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Prominence: {peak.prominence.toExponential(4)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Data Processing Tab */}
          <TabsContent value="processing" className="space-y-4">
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Activity className="h-4 w-4 mr-2" />
                Smooth Data (Moving Average)
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Calculate Derivative
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Scissors className="h-4 w-4 mr-2" />
                Baseline Correction
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Processed Data
              </Button>
            </div>
            <p className="text-sm text-gray-500 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
              Data processing features will modify your dataset. Original data will be preserved.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
