import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('Fetching files for project:', params.id)
    
    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    })
    
    if (!project) {
      console.log('Project not found:', params.id)
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    const files = await prisma.file.findMany({
      where: { projectId: params.id },
      orderBy: [{ type: 'desc' }, { name: 'asc' }],
    })
    console.log('Found files:', files.length, files)
    
    return NextResponse.json(files)
  } catch (error) {
    console.error('Error fetching files:', error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({ 
      error: 'Failed to fetch files',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
