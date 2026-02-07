import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { name, parentId } = body
    
    console.log('Creating folder:', { name, parentId, projectId: params.id })
    
    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 })
    }
    
    // Verify project exists
    const projectExists = await prisma.project.findUnique({
      where: { id: params.id },
    })
    
    if (!projectExists) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    // If parentId is provided, verify it exists and is a folder
    if (parentId) {
      const parent = await prisma.file.findUnique({
        where: { id: parentId },
      })
      
      if (!parent) {
        return NextResponse.json({ error: 'Parent folder not found' }, { status: 404 })
      }
      
      if (parent.type !== 'folder') {
        return NextResponse.json({ error: 'Parent must be a folder' }, { status: 400 })
      }
    }
    
    const folderData: any = {
      name: name.trim(),
      type: 'folder',
      projectId: params.id,
      extension: null,
      size: null,
      url: null,
    }
    
    if (parentId) {
      folderData.parentId = parentId
    }
    
    const folder = await prisma.file.create({
      data: folderData,
    })
    
    console.log('Folder created:', folder)
    
    return NextResponse.json(folder, { status: 201 })
  } catch (error) {
    console.error('Failed to create folder - Full error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({ 
      error: 'Failed to create folder', 
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
