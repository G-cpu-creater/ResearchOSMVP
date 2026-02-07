import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const SYSTEM_PROMPT = `You are a scientific data analyst assistant. The user uploads experimental or simulation CSV/Excel data. Produce concise, accurate, technical but readable summaries and actionable next steps. Always preserve numeric correctness and suggest plot types and calculations relevant to electrochemistry and physical measurements where applicable. If uncertain, state the assumption.

Return your response as a JSON object with this structure:
{
  "summary": "One paragraph describing what this dataset represents",
  "columns": [
    {
      "name": "Voltage",
      "type": "numeric",
      "range": "-0.8 to 0.8",
      "mean": 0.0,
      "median": 0.0,
      "nanCount": 0
    }
  ],
  "observations": ["Bullet point observation 1", "Bullet point 2"],
  "suggestedPlots": [
    {
      "title": "CV Curve",
      "xColumn": "Voltage",
      "yColumn": "Current",
      "plotType": "line",
      "reason": "Shows rectangular shape for capacitive behavior"
    }
  ],
  "suggestedAnalyses": [
    {
      "title": "Calculate areal capacitance",
      "description": "Using formula C = I / (dV/dt)",
      "formula": "C = I / (dV/dt)"
    }
  ]
}`

export async function POST(req: NextRequest) {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    const payload = await req.json()

    const userPrompt = `Here is a dataset (name: ${payload.datasetName}, ${payload.rowRange ? `rows ${payload.rowRange.start + 1}–${payload.rowRange.end + 1}` : 'full dataset'}):

Columns: ${payload.columns.map((c: any) => `${c.name} (${c.type})`).join(', ')}

Sample data:
${JSON.stringify(payload.fullTablePreview.slice(0, 5), null, 2)}

Total rows: ${payload.rowsCount}

Provide a comprehensive analysis following the JSON structure specified in the system prompt.`

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })

    const report = JSON.parse(completion.choices[0].message.content || '{}')

    return NextResponse.json({ report })
  } catch (error) {
    console.error('Error generating AI insights:', error)
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 })
  }
}
