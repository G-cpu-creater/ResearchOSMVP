import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import {
  createCVPlot,
  createNyquistPlot,
  createBodePlot,
  createBatteryCyclingPlot,
  createGenericPlot,
} from '@/lib/plotting/plot-configs'

const createVisualizationSchema = z.object({
  projectId: z.string(),
  datasetId: z.string(),
  name: z.string(),
  plotType: z.string(),
  xColumn: z.string().optional(),
  yColumn: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth()
    const body = await request.json()

    const { projectId, datasetId, name, plotType, xColumn, yColumn } =
      createVisualizationSchema.parse(body)

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get dataset
    const dataset = await prisma.dataset.findUnique({
      where: { id: datasetId },
    })

    if (!dataset) {
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 })
    }

    // Generate plot config based on type
    let plotConfig: any

    const parsedData = dataset.parsedData as any

    try {
      switch (plotType) {
        case 'cv_plot':
          plotConfig = createCVPlot(parsedData)
          break
        case 'nyquist':
          plotConfig = createNyquistPlot(parsedData)
          break
        case 'bode':
          plotConfig = createBodePlot(parsedData)
          break
        case 'battery_cycling':
          plotConfig = createBatteryCyclingPlot(parsedData)
          break
        case 'generic':
          if (!xColumn || !yColumn) {
            throw new Error('xColumn and yColumn required for generic plot')
          }
          plotConfig = createGenericPlot(parsedData, xColumn, yColumn)
          break
        default:
          throw new Error('Unknown plot type')
      }
    } catch (error: any) {
      return NextResponse.json(
        { error: `Failed to create plot: ${error.message}` },
        { status: 400 }
      )
    }

    // Save visualization
    const visualization = await prisma.visualization.create({
      data: {
        projectId,
        datasetId,
        name,
        plotType,
        config: plotConfig as any,
      },
    })

    return NextResponse.json({ visualization }, { status: 201 })
  } catch (error: any) {
    console.error('Create visualization error:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create visualization' },
      { status: 500 }
    )
  }
}
