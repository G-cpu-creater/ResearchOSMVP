// @ts-ignore
import pdf from 'pdf-parse/lib/pdf-parse'

export async function extractTextFromPDF(fileUrl: string): Promise<{
    text: string
    pages: number
    metadata: any
}> {
    try {
        // Fetch PDF
        const response = await fetch(fileUrl)
        if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.statusText}`)
        }
        const buffer = await response.arrayBuffer()

        // Parse PDF
        const data = await pdf(Buffer.from(buffer))

        return {
            text: data.text,
            pages: data.numpages,
            metadata: data.info
        }
    } catch (error) {
        console.error('Error extracting text from PDF:', error)
        throw new Error('Failed to extract text from PDF')
    }
}
