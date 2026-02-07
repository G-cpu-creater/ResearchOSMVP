import { BaseParser } from './base-parser'
import type { ParsedData } from '@/types'

export class GamryDTAParser extends BaseParser {
  canParse(file: File): boolean {
    return file.name.endsWith('.dta')
  }

  async parse(file: File): Promise<ParsedData> {
    const text = await file.text()
    const lines = text.split('\n')

    // Gamry DTA files have tags like CURVE, ZCURVE for data sections
    const dataStartIndex = lines.findIndex(l =>
      l.includes('CURVE') || l.includes('ZCURVE') || l.includes('OCVCURVE')
    )

    if (dataStartIndex === -1) {
      throw new Error('Invalid Gamry DTA file: no data section found')
    }

    const metadata = this.parseGamryMetadata(lines.slice(0, dataStartIndex))
    const { columns, rows } = this.parseGamryData(lines.slice(dataStartIndex + 1))

    const technique = this.detectTechnique(columns, text)
    const units = this.extractUnits(columns)

    return {
      technique,
      instrument: 'Gamry',
      metadata,
      data: {
        columns,
        rows,
      },
      units,
    }
  }

  private parseGamryMetadata(lines: string[]): Record<string, any> {
    const metadata: Record<string, any> = {}

    for (const line of lines) {
      const trimmed = line.trim()

      // Skip empty lines and tags
      if (!trimmed || trimmed.startsWith('TAG')) continue

      // Parse key-value pairs (TAB separated)
      if (trimmed.includes('\t')) {
        const parts = trimmed.split('\t')
        if (parts.length >= 2) {
          const key = parts[0].trim()
          const value = parts.slice(1).join('\t').trim()
          metadata[key] = value
        }
      }
    }

    return metadata
  }

  private parseGamryData(lines: string[]): { columns: string[]; rows: number[][] } {
    // First line after CURVE tag might be column count
    let dataLines = lines.filter(l => l.trim() && !l.startsWith('TAG'))

    if (dataLines.length === 0) {
      return { columns: [], rows: [] }
    }

    // First data line contains column headers (tab-separated)
    const headerLine = dataLines[0]
    const columns = headerLine.split('\t').map(c => c.trim()).filter(c => c)

    // Parse data rows
    const rows: number[][] = []
    for (let i = 1; i < dataLines.length; i++) {
      const line = dataLines[i].trim()
      if (!line) continue

      const values = line.split('\t').map(v => {
        const num = parseFloat(v)
        return isNaN(num) ? 0 : num
      })

      if (values.length > 0) {
        rows.push(values)
      }
    }

    return { columns, rows }
  }
}
