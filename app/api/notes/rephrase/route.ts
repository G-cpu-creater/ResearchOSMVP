import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const GROQ_API_KEY = process.env.GROQ_API_KEY || ''
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json()

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 })
        }

        console.log('🔑 GROQ_API_KEY status:', GROQ_API_KEY ? 'LOADED ✓' : 'MISSING ✗')

        if (!GROQ_API_KEY) {
            return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 })
        }

        const prompt = `You are a helpful writing assistant. Rephrase the following text to be more clear, concise, and professional. 
    
    IMPORTANT: The input contains HTML. You MUST preserve all HTML tags (especially <img> tags) exactly as they are. Only rephrase the text content between tags. Do not remove or modify any image tags.

    Input:
    ${text}`

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    { role: 'user', content: prompt }
                ],
                temperature: 0.3,
                max_tokens: 1024,
            }),
        })

        if (!response.ok) {
            throw new Error('Failed to get AI response')
        }

        const data = await response.json()
        const rephrasedText = data.choices[0]?.message?.content || text

        return NextResponse.json({ rephrasedText })
    } catch (error) {
        console.error('Rephrase API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
