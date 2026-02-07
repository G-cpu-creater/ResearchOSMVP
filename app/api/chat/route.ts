// Groq API Integration for Llama 3.1 8B with Project-Specific Memory
// Node.js Runtime for better environment variable support

import { NextRequest, NextResponse } from 'next/server'
import { chatMemoryService } from '@/lib/chat-memory'
import { summarizeConversation } from '@/lib/chat-maintenance'
import { truncateToTokenLimit } from '@/lib/token-utils'

export const runtime = 'nodejs'

const GROQ_API_KEY = process.env.GROQ_API_KEY || ''
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

// Configuration
const MAX_HISTORY_MESSAGES = 20 // Last N messages to include in context
const SUMMARIZE_THRESHOLD = 50 // Trigger summary after N messages
const MAX_CONTEXT_TOKENS = 6000 // Approximate token limit for context

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface GroqChatRequest {
  projectId?: string // NEW: Project ID for memory
  message?: string // NEW: Single user message
  messages?: ChatMessage[] // Legacy support
  context?: {
    datasetInfo?: string
    plotInfo?: string
    projectInfo?: string
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('🔑 GROQ_API_KEY status:', GROQ_API_KEY ? 'LOADED ✓' : 'MISSING ✗')
    
    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured. Please contact administrator.' },
        { status: 500 }
      )
    }

    const body = await req.json() as GroqChatRequest
    const { projectId, message, messages, context } = body

    // NEW FLOW: Project-specific memory
    if (projectId && message) {
      return await handleProjectChat(projectId, message, context)
    }

    // LEGACY FLOW: Stateless chat (for backward compatibility)
    if (messages && Array.isArray(messages) && messages.length > 0) {
      return await handleLegacyChat(messages, context)
    }

    return NextResponse.json(
      { error: 'Either (projectId + message) or messages array is required' },
      { status: 400 }
    )

  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    )
  }
}

/**
 * Handle project-specific chat with memory
 */
async function handleProjectChat(
  projectId: string,
  userMessage: string,
  context?: GroqChatRequest['context']
) {
  try {
    // 1. Save user message
    await chatMemoryService.saveMessage({
      projectId,
      role: 'user',
      content: userMessage
    })

    // 2. Get conversation history
    const history = await chatMemoryService.getRecentMessages(
      projectId,
      MAX_HISTORY_MESSAGES
    )
    
    // Reverse to chronological order
    history.reverse()

    // 3. Build system prompt
    let systemPrompt = `You are an expert research assistant specializing in electrochemistry and scientific data analysis. You help researchers with:
- Analyzing experimental data and plots
- Suggesting next experimental steps
- Refining research ideas and hypotheses
- Interpreting trends and anomalies
- Writing and improving experiment documentation

Always be concise, actionable, and scientifically accurate.`

    // Add project summary if available
    const summary = await chatMemoryService.getProjectSummary(projectId)
    if (summary) {
      systemPrompt += `\n\nConversation Summary:\n${summary.summary}`
    }

    // Add dynamic context
    if (context?.datasetInfo) {
      systemPrompt += `\n\nCurrent Dataset:\n${context.datasetInfo}`
    }
    if (context?.plotInfo) {
      systemPrompt += `\n\nCurrent Plot:\n${context.plotInfo}`
    }
    if (context?.projectInfo) {
      systemPrompt += `\n\nProject Info:\n${context.projectInfo}`
    }

    // 4. Construct messages for Groq (with token management)
    const groqMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...history.map(h => ({ role: h.role as 'user' | 'assistant', content: h.content }))
    ]

    // Truncate if needed to fit token limit
    const truncatedMessages = truncateToTokenLimit(groqMessages, MAX_CONTEXT_TOKENS)

    // 5. Call Groq API
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: truncatedMessages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Groq API error:', response.status, error)
      return NextResponse.json(
        { error: `AI service error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const assistantReply = data.choices[0]?.message?.content

    if (!assistantReply) {
      throw new Error('No response from AI')
    }

    // 6. Save assistant response
    await chatMemoryService.saveMessage({
      projectId,
      role: 'assistant',
      content: assistantReply,
      tokens: data.usage?.total_tokens
    })

    // 7. Check if summarization is needed (async, don't block)
    const totalMessages = await chatMemoryService.getMessageCount(projectId)
    if (totalMessages > SUMMARIZE_THRESHOLD && !summary) {
      summarizeConversation(projectId).catch(console.error)
    }

    return NextResponse.json({
      message: assistantReply,
      metadata: {
        tokensUsed: data.usage?.total_tokens,
        totalMessages,
        historyLength: history.length
      }
    })

  } catch (error: any) {
    console.error('Project chat error:', error)
    throw error
  }
}

/**
 * Legacy stateless chat handler (backward compatibility)
 */
async function handleLegacyChat(
  messages: ChatMessage[],
  context?: GroqChatRequest['context']
) {
  try {
    let systemMessage = `You are an expert research assistant specializing in electrochemistry and scientific data analysis. You help researchers with:
- Analyzing experimental data and plots
- Suggesting next experimental steps
- Refining research ideas and hypotheses
- Interpreting trends and anomalies
- Writing and improving experiment documentation

Always be concise, actionable, and scientifically accurate.`

    if (context?.datasetInfo) {
      systemMessage += `\n\nCurrent Dataset Context:\n${context.datasetInfo}`
    }
    if (context?.plotInfo) {
      systemMessage += `\n\nCurrent Plot Context:\n${context.plotInfo}`
    }
    if (context?.projectInfo) {
      systemMessage += `\n\nProject Context:\n${context.projectInfo}`
    }

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemMessage },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Groq API error:', response.status, error)
      return NextResponse.json(
        { error: `AI service error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const assistantMessage = data.choices[0]?.message?.content || 'No response'

    return NextResponse.json({
      message: assistantMessage,
      usage: data.usage,
    })
  } catch (error: any) {
    console.error('Legacy chat error:', error)
    throw error
  }
}
