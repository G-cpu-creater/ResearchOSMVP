import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'

const GROQ_API_KEY = process.env.GROQ_API_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    console.log('🔑 GROQ_API_KEY status:', GROQ_API_KEY ? 'LOADED ✓' : 'MISSING ✗')

    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY not configured' },
        { status: 500 }
      )
    }

    // Call Groq API with Llama 3.1
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are a professional scientific writing assistant. Rephrase the given text into simple, clear, and effective English while preserving the exact meaning and technical accuracy. Keep all scientific terms, numbers, and citations unchanged. Return only the rephrased text without any JSON formatting or extra structure.'
          },
          {
            role: 'user',
            content: `Rephrase this text:\n\n${text}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!groqResponse.ok) {
      const error = await groqResponse.text()
      console.error('Groq API error:', error)
      return NextResponse.json(
        { error: 'Failed to generate rephrased text' },
        { status: 500 }
      )
    }

    const data = await groqResponse.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      )
    }

    // Return single rephrased text
    return NextResponse.json({
      original: text,
      rephrased: content.trim()
    })

  } catch (error) {
    console.error('Rephrase API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
