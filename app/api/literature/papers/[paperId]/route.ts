import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    req: NextRequest,
    { params }: { params: { paperId: string } }
) {
    try {
        const paper = await prisma.paper.findUnique({
            where: { id: params.paperId },
            include: { folder: true }
        })

        if (!paper) {
            return NextResponse.json({ error: 'Paper not found' }, { status: 404 })
        }

        return NextResponse.json(paper)
    } catch (error) {
        console.error('Get paper error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { paperId: string } }
) {
    try {
        const body = await req.json()
        const { title, doi, notes, folderId } = body

        const paper = await prisma.paper.update({
            where: { id: params.paperId },
            data: {
                title,
                doi,
                notes,
                folderId: folderId === null ? null : folderId
            }
        })

        return NextResponse.json(paper)
    } catch (error) {
        console.error('Update paper error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { paperId: string } }
) {
    try {
        await prisma.paper.delete({
            where: { id: params.paperId }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete paper error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
