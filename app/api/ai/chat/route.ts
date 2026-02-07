import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { ollamaClient } from '@/lib/ai/ollama-client'
import { buildProjectContext } from '@/lib/ai/context-builder'
import { SYSTEM_PROMPTS } from '@/lib/ai/prompts'
import { z } from 'zod'

const chatSchema = z.object({
  projectId: z.string(),
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string(),
      timestamp: z.string().optional(),
    })
  ),
  contextType: z.enum(['project', 'visualization', 'general']).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth()
    const body = await request.json()

    const { projectId, messages, contextType = 'project' } = chatSchema.parse(body)

    // Build context
    const projectContext = await buildProjectContext(projectId)
    const systemPrompt = SYSTEM_PROMPTS.researchAssistant(projectContext)

    // Convert messages to AI format
    const aiMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
    }))

    // Check Ollama connection
    const isConnected = await ollamaClient.checkConnection()
    if (!isConnected) {
      return new Response(
        JSON.stringify({
          error: 'AI service not available. Please ensure Ollama is running.',
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Stream response
    const stream = await ollamaClient.chat(aiMessages, systemPrompt)

    // Create a readable stream
    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`))
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          controller.error(error)
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error: any) {
    console.error('AI chat error:', error)

    if (error.message === 'Unauthorized') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    if (error.name === 'ZodError') {
      return new Response(
        JSON.stringify({ error: error.errors[0].message }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
