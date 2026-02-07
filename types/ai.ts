export interface Message {
    role: 'user' | 'assistant'
    content: string
    timestamp?: Date
}

export interface ResearchAIChatProps {
    context?: {
        datasetInfo?: string
        plotInfo?: string
        projectInfo?: string
    }
    fullScreen?: boolean
}
