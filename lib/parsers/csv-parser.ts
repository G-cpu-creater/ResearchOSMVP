import Papa from 'papaparse'
import { BaseParser } from './base-parser'
import type { ParsedData } from '@/types'

export class CSVParser extends BaseParser {
  canParse(file: File): boolean {
    return file.name.endsWith('.csv') || file.name.endsWith('.txt')
  }

  async parse(file: File): Promise<ParsedData> {
    const text = await file.text()

    // Use PapaParse to parse CSV
    const result = Papa.parse(text, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      comments: '#', // Skip comment lines
    })

    if (result.errors.length > 0) {
      console.warn('CSV parsing warnings:', result.errors)
    }

    const columns = result.meta.fields || []
    const rows = result.data.map((row: any) =>
      columns.map(col => row[col])
    )

    const technique = this.detectTechnique(columns, text.slice(0, 1000))
    const units = this.extractUnits(columns)

    return {
      technique,
      instrument: 'Generic',
      metadata: {
        comments: 'Parsed from generic CSV file',
      },
      data: {
        columns,
        rows: rows as number[][],
      },
      units,
    }
  }
}
