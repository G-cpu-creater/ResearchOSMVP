import type { ParsedData, ElectrochemistryTechnique, InstrumentType } from '@/types'

export abstract class BaseParser {
  /**
   * Check if this parser can handle the given file
   */
  abstract canParse(file: File): boolean

  /**
   * Parse the file and return structured data
   */
  abstract parse(file: File): Promise<ParsedData>

  /**
   * Detect the electrochemistry technique from headers or content
   */
  protected detectTechnique(headers: string[], content?: string): ElectrochemistryTechnique {
    const headersLower = headers.map(h => h.toLowerCase())
    const contentLower = content?.toLowerCase() || ''

    // Cyclic Voltammetry
    if (
      headersLower.some(h => h.includes('ewe') && h.includes('i')) ||
      contentLower.includes('cyclic voltammetry') ||
      contentLower.includes('cv')
    ) {
      return 'CV'
    }

    // EIS
    if (
      headersLower.some(h => h.includes('re(z)') || h.includes('im(z)') || h.includes('freq')) ||
      contentLower.includes('impedance') ||
      contentLower.includes('eis')
    ) {
      return 'EIS'
    }

    // Battery Cycling
    if (
      headersLower.some(h => h.includes('cycle') || h.includes('capacity') || h.includes('charge')) ||
      contentLower.includes('battery') ||
      contentLower.includes('cycling')
    ) {
      return 'BatteryCycling'
    }

    // Chronoamperometry
    if (
      headersLower.some(h => h.includes('time') && h.includes('current')) &&
      contentLower.includes('chronoamperometry')
    ) {
      return 'CA'
    }

    // Chronopotentiometry
    if (
      headersLower.some(h => h.includes('time') && h.includes('potential')) &&
      contentLower.includes('chronopotentiometry')
    ) {
      return 'CP'
    }

    return 'Unknown'
  }

  /**
   * Extract units from column headers
   * Example: "Ewe/V" → { "Ewe": "V" }
   */
  protected extractUnits(columns: string[]): Record<string, string> {
    const units: Record<string, string> = {}

    for (const col of columns) {
      // Check for "/" separator (BioLogic style)
      if (col.includes('/')) {
        const parts = col.split('/')
        if (parts.length === 2) {
          units[parts[0].trim()] = parts[1].trim()
        }
      }

      // Check for "()" parentheses (common style)
      const match = col.match(/(.+)\((.+)\)/)
      if (match) {
        units[match[1].trim()] = match[2].trim()
      }
    }

    return units
  }

  /**
   * Clean column names by removing units
   */
  protected cleanColumnName(column: string): string {
    // Remove units in parentheses
    let clean = column.replace(/\s*\([^)]*\)/, '')
    // Remove units after /
    clean = clean.split('/')[0]
    return clean.trim()
  }

  /**
   * Convert string values to numbers where appropriate
   */
  protected parseNumericRow(row: string[]): (number | string)[] {
    return row.map(value => {
      const num = parseFloat(value)
      return isNaN(num) ? value : num
    })
  }
}
