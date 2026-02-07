import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { put } from '@vercel/blob'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await req.formData()
    const folderId = formData.get('folderId') as string | null
    const files = formData.getAll('files') as File[]
    
    const uploadedFiles = []
    
    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      // Upload to Vercel Blob
      const blob = await put(`projects/${params.id}/${file.name}`, buffer, {
        access: 'public',
      })
      
      const ext = file.name.split('.').pop() || ''
      
      const fileRecord = await prisma.file.create({
        data: {
          name: file.name,
          type: 'file',
          extension: ext,
          size: file.size,
          url: blob.url,
          projectId: params.id,
          parentId: folderId || null,
        },
      })
      
      uploadedFiles.push(fileRecord)
    }
    
    return NextResponse.json(uploadedFiles, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 })
  }
}
