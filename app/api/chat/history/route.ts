import { NextRequest, NextResponse } from 'next/server'
import { chatMemoryService } from '@/lib/chat-memory'

export const runtime = 'nodejs'

/**
 * GET /api/chat/history?projectId=xxx&limit=50
 * Retrieve chat history for a project
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 }
      )
    }

    // Validate limit
    const validLimit = Math.min(Math.max(limit, 1), 200)

    // Get messages and summary
    const messages = await chatMemoryService.getAllMessages(projectId, validLimit)
    const summary = await chatMemoryService.getProjectSummary(projectId)
    const totalCount = await chatMemoryService.getMessageCount(projectId)

    return NextResponse.json({
      messages,
      summary,
      totalCount,
      limit: validLimit
    })

  } catch (error) {
    console.error('Chat history GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/chat/history
 * Clear chat history for a project
 */
export async function DELETE(req: NextRequest) {
  try {
    const { projectId } = await req.json()

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 }
      )
    }

    // Clear all messages and summary
    await chatMemoryService.clearProjectChat(projectId)

    return NextResponse.json({ 
      success: true,
      message: 'Chat history cleared successfully'
    })

  } catch (error) {
    console.error('Chat history DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to clear chat history' },
      { status: 500 }
    )
  }
}
