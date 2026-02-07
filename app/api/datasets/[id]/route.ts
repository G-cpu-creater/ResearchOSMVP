import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth()

    const dataset = await prisma.dataset.findFirst({
      where: {
        id: params.id,
        project: {
          userId,
        },
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        visualizations: true,
      },
    })

    if (!dataset) {
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 })
    }

    return NextResponse.json({
      dataset: {
        ...dataset,
        fileSize: dataset.fileSize?.toString(),
      }
    })
  } catch (error: any) {
    console.error('Get dataset error:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(
      { error: 'Failed to get dataset' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth()

    const dataset = await prisma.dataset.findFirst({
      where: {
        id: params.id,
        project: {
          userId,
        },
      },
    })

    if (!dataset) {
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 })
    }

    await prisma.dataset.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete dataset error:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(
      { error: 'Failed to delete dataset' },
      { status: 500 }
    )
  }
}
