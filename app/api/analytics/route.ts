import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth()

    // Get all projects for the user
    const projects = await prisma.project.findMany({
      where: { userId, status: 'active' },
      include: {
        datasets: true,
        visualizations: true,
        pages: true,
      },
    })

    // Calculate totals
    const totalProjects = projects.length
    const totalDatasets = projects.reduce((sum, p) => sum + p.datasets.length, 0)
    const totalVisualizations = projects.reduce((sum, p) => sum + p.visualizations.length, 0)
    const totalPages = projects.reduce((sum, p) => sum + p.pages.length, 0)

    // Recent activity (last 7 days)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const projectsThisWeek = projects.filter(
      (p) => new Date(p.createdAt) >= oneWeekAgo
    ).length

    const datasetsThisWeek = projects.reduce((sum, p) => {
      const recentDatasets = p.datasets.filter(
        (d) => new Date(d.uploadedAt) >= oneWeekAgo
      )
      return sum + recentDatasets.length
    }, 0)

    // Technique distribution
    const techniqueDistribution = {
      CV: 0,
      EIS: 0,
      BatteryCycling: 0,
      CA: 0,
      CP: 0,
      other: 0,
    }

    projects.forEach((project) => {
      project.datasets.forEach((dataset) => {
        const technique = dataset.technique
        if (technique === 'CV') techniqueDistribution.CV++
        else if (technique === 'EIS') techniqueDistribution.EIS++
        else if (technique === 'BatteryCycling') techniqueDistribution.BatteryCycling++
        else if (technique === 'CA') techniqueDistribution.CA++
        else if (technique === 'CP') techniqueDistribution.CP++
        else techniqueDistribution.other++
      })
    })

    // Calculate storage used (approximate from file sizes)
    const storageUsed = projects.reduce((sum, p) => {
      return (
        sum +
        p.datasets.reduce((datasetSum, d) => {
          return datasetSum + (d.fileSize ? Number(d.fileSize) : 0)
        }, 0)
      )
    }, 0)

    return NextResponse.json({
      totalProjects,
      totalDatasets,
      totalVisualizations,
      totalPages,
      recentActivity: {
        projectsThisWeek,
        datasetsThisWeek,
      },
      techniqueDistribution,
      storageUsed,
    })
  } catch (error: any) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
