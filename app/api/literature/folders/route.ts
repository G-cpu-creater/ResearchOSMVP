import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const projectId = searchParams.get('projectId')

        if (!projectId) {
            return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
        }

        const folders = await prisma.folder.findMany({
            where: { projectId, parentId: null },
            include: {
                children: {
                    include: {
                        children: true
                    }
                },
                papers: true
            }
        })

        return NextResponse.json(folders)
    } catch (error) {
        console.error('Get folders error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const { projectId, name, parentId } = await req.json()

        if (!projectId || !name) {
            return NextResponse.json({ error: 'Project ID and name required' }, { status: 400 })
        }

        // Build path
        let path = '/'
        if (parentId) {
            const parent = await prisma.folder.findUnique({ where: { id: parentId } })
            if (parent) {
                path = `${parent.path}${parent.name}/`
            }
        }

        const folder = await prisma.folder.create({
            data: {
                projectId,
                name,
                parentId: parentId || undefined,
                path
            }
        })

        return NextResponse.json(folder)
    } catch (error) {
        console.error('Create folder error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
