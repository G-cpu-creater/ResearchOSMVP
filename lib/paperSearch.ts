interface PaperSearchResult {
    title: string
    authors: string[]
    year: number
    abstract: string
    doi?: string
    url?: string
}

export async function searchSimilarPapers(
    query: string,
    limit: number = 5
): Promise<PaperSearchResult[]> {
    try {
        // Using Semantic Scholar API
        const response = await fetch(
            `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=${limit}&fields=title,authors,year,abstract,externalIds,url`
        )

        if (!response.ok) {
            throw new Error('Failed to fetch papers')
        }

        const data = await response.json()

        return data.data.map((paper: any) => ({
            title: paper.title,
            authors: paper.authors?.map((a: any) => a.name) || [],
            year: paper.year,
            abstract: paper.abstract,
            doi: paper.externalIds?.DOI,
            url: paper.url
        }))
    } catch (error) {
        console.error('Paper search error:', error)
        return []
    }
}
