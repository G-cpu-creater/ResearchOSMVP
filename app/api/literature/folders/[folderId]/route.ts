import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
    req: NextRequest,
    { params }: { params: { folderId: string } }
) {
    try {
        const { name, parentId } = await req.json()

        // Check for circular reference
        if (parentId) {
            let current = await prisma.folder.findUnique({ where: { id: parentId } })
            while (current) {
                if (current.id === params.folderId) {
                    return NextResponse.json({ error: 'Circular reference detected' }, { status: 400 })
                }
                if (!current.parentId) break
                current = await prisma.folder.findUnique({ where: { id: current.parentId } })
            }
        }

        // Update path if parent changed
        let path = '/'
        if (parentId) {
            const parent = await prisma.folder.findUnique({ where: { id: parentId } })
            if (parent) {
                path = `${parent.path}${parent.name}/`
            }
        }

        const folder = await prisma.folder.update({
            where: { id: params.folderId },
            data: {
                name,
                parentId: parentId || null,
                path
            }
        })

        return NextResponse.json(folder)
    } catch (error) {
        console.error('Update folder error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { folderId: string } }
) {
    try {
        const { searchParams } = new URL(req.url)
        const cascade = searchParams.get('cascade') === 'true'

        if (cascade) {
            // Delete folder and all children/papers
            await prisma.folder.delete({
                where: { id: params.folderId }
            })
        } else {
            // Move papers to uncategorized and delete folder
            await prisma.paper.updateMany({
                where: { folderId: params.folderId },
                data: { folderId: null }
            })
            await prisma.folder.delete({
                where: { id: params.folderId }
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete folder error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
