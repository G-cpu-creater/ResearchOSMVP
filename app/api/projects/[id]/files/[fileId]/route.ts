import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; fileId: string } }
) {
  try {
    await prisma.file.delete({
      where: { id: params.fileId },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; fileId: string } }
) {
  try {
    const { name } = await req.json()
    
    const updated = await prisma.file.update({
      where: { id: params.fileId },
      data: { name },
    })
    
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update file' }, { status: 500 })
  }
}
