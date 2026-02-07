import { prisma } from '@/lib/prisma'

export async function buildProjectContext(projectId: string): Promise<string> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      pages: {
        include: {
          blocks: true,
        },
      },
      papers: true,
      datasets: {
        select: {
          id: true,
          name: true,
          technique: true,
          instrument: true,
          metadata: true,
        },
      },
    },
  })

  if (!project) {
    throw new Error('Project not found')
  }

  const context = `
PROJECT INFORMATION:
Title: ${project.title}
Research Type: ${project.researchType || 'Not specified'}
Description: ${project.description || 'No description'}

PAGES AND NOTES (${project.pages.length} pages):
${project.pages
  .map(page => `
Page: ${page.title}
${page.blocks
  .map(block => {
    if (block.type === 'text' || block.type === 'heading') {
      return (block.content as any).text || ''
    }
    return ''
  })
  .join('\n')}
`)
  .join('\n---\n')}

UPLOADED LITERATURE (${project.papers.length} papers):
${project.papers
  .map(paper => `
Title: ${paper.title}
Authors: ${paper.authors.join(', ')}
Year: ${paper.year || 'N/A'}
Abstract: ${paper.abstract || 'No abstract'}
`)
  .join('\n---\n')}

DATASETS (${project.datasets.length} datasets):
${project.datasets
  .map(ds => `
- ${ds.name} (${ds.technique}, ${ds.instrument})
`)
  .join('\n')}
`

  return context.trim()
}

export async function buildVisualizationContext(
  visualizationId: string
): Promise<string> {
  const viz = await prisma.visualization.findUnique({
    where: { id: visualizationId },
    include: {
      dataset: true,
      project: true,
    },
  })

  if (!viz || !viz.dataset) {
    throw new Error('Visualization or dataset not found')
  }

  const dataset = viz.dataset
  const parsedData = dataset.parsedData as any

  const context = `
VISUALIZATION CONTEXT:
Project: ${viz.project.title}
Dataset: ${dataset.name}
Technique: ${dataset.technique}
Instrument: ${dataset.instrument}
Plot Type: ${viz.plotType}

DATA STRUCTURE:
Columns: ${parsedData?.data?.columns?.join(', ') || 'Unknown'}
Rows: ${parsedData?.data?.rows?.length || 0}

METADATA:
${JSON.stringify(dataset.metadata, null, 2)}

SAMPLE DATA (first 10 rows):
${JSON.stringify(parsedData?.data?.rows?.slice(0, 10) || [], null, 2)}
`

  return context.trim()
}
