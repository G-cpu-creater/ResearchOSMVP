import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { put } from '@vercel/blob'

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const projectId = searchParams.get('projectId')
        const folderId = searchParams.get('folderId')

        if (!projectId) {
            return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
        }

        const where: any = { projectId }
        if (folderId) {
            where.folderId = folderId
        } else if (folderId === '') {
            where.folderId = null // Uncategorized papers
        }

        const papers = await prisma.paper.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { folder: true }
        })

        return NextResponse.json(papers)
    } catch (error) {
        console.error('Get papers error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()

        const projectId = formData.get('projectId') as string
        const title = formData.get('title') as string
        const doi = formData.get('doi') as string | null
        const notes = formData.get('notes') as string | null
        const folderId = formData.get('folderId') as string | null
        const file = formData.get('file') as File | null

        if (!projectId || !title) {
            return NextResponse.json({ error: 'Project ID and title required' }, { status: 400 })
        }

        let fileUrl = null
        if (file) {
            const blob = await put(file.name, file, { access: 'public' })
            fileUrl = blob.url
        }

        const paper = await prisma.paper.create({
            data: {
                projectId,
                title,
                doi: doi || undefined,
                notes: notes || undefined,
                folderId: folderId || undefined,
                fileUrl,
                authors: [],
            }
        })

        return NextResponse.json(paper)
    } catch (error) {
        console.error('Create paper error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
