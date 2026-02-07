// Analysis Page Type Definitions

export interface Dataset {
  filename: string
  headers: string[]
  data: Record<string, number[]>
  indexArray: number[]
  uploadedAt: number
}

export interface Plot {
  id: string
  xVariable: string
  yVariable: string
  position: Position
  size: Size
  plotType: 'scatter' | 'line' | 'bar' | 'scatter+line'
  markerColor: string
  markerSize: number
  showLegend: boolean
  showGrid: boolean
  createdAt: number
}

export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface DragData {
  type: 'variable'
  name: string
}

export interface DropData {
  type: 'canvas' | 'axis'
  plotId?: string
  axis?: 'x' | 'y'
}
