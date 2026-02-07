/**
 * Data Export Utilities
 * Support for CSV, JSON, and Excel export
 */

export interface ExportOptions {
  filename?: string
  includeTimestamp?: boolean
}

/**
 * Export data to CSV format
 */
export function exportToCSV(data: any[], options: ExportOptions = {}) {
  if (!data || data.length === 0) {
    throw new Error('No data to export')
  }

  const { filename = 'data', includeTimestamp = true } = options

  // Get headers from first object
  const headers = Object.keys(data[0])

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header]
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')

  // Create timestamp suffix
  const timestamp = includeTimestamp
    ? `_${new Date().toISOString().split('T')[0]}`
    : ''

  // Download file
  downloadFile(csvContent, `${filename}${timestamp}.csv`, 'text/csv')
}

/**
 * Export data to JSON format
 */
export function exportToJSON(data: any, options: ExportOptions = {}) {
  const { filename = 'data', includeTimestamp = true } = options

  const jsonContent = JSON.stringify(data, null, 2)

  const timestamp = includeTimestamp
    ? `_${new Date().toISOString().split('T')[0]}`
    : ''

  downloadFile(jsonContent, `${filename}${timestamp}.json`, 'application/json')
}

/**
 * Export data to Excel-compatible format (CSV with UTF-8 BOM)
 */
export function exportToExcel(data: any[], options: ExportOptions = {}) {
  if (!data || data.length === 0) {
    throw new Error('No data to export')
  }

  const { filename = 'data', includeTimestamp = true } = options

  // Get headers
  const headers = Object.keys(data[0])

  // Create CSV content with UTF-8 BOM for Excel
  const BOM = '\uFEFF'
  const csvContent = BOM + [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header]
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')

  const timestamp = includeTimestamp
    ? `_${new Date().toISOString().split('T')[0]}`
    : ''

  downloadFile(csvContent, `${filename}${timestamp}.csv`, 'text/csv;charset=utf-8')
}

/**
 * Helper function to trigger file download
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export project data with all associated information
 */
export function exportProjectData(project: any, datasets: any[]) {
  const exportData = {
    project: {
      id: project.id,
      title: project.title,
      description: project.description,
      createdAt: project.createdAt,
      researchType: project.researchType,
    },
    datasets: datasets.map(ds => ({
      id: ds.id,
      name: ds.name,
      technique: ds.technique,
      instrument: ds.instrument,
      uploadedAt: ds.uploadedAt,
      rowCount: ds.rowCount,
      columnCount: ds.columnCount,
    })),
    exportedAt: new Date().toISOString(),
  }

  exportToJSON(exportData, { filename: `project_${project.id}` })
}
