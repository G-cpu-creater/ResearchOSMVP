import type { AIMessage } from '@/types'

export interface OllamaConfig {
  host: string
  model: string
}

export class OllamaClient {
  private host: string
  private defaultModel: string

  constructor(
    host: string = process.env.OLLAMA_HOST || 'http://localhost:11434',
    defaultModel: string = process.env.OLLAMA_DEFAULT_MODEL || 'llama3.1:8b'
  ) {
    this.host = host
    this.defaultModel = defaultModel
  }

  async chat(
    messages: AIMessage[],
    systemPrompt?: string,
    model?: string
  ): Promise<AsyncGenerator<string>> {
    const modelToUse = model || this.defaultModel

    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }))

    if (systemPrompt) {
      formattedMessages.unshift({
        role: 'system',
        content: systemPrompt,
      })
    }

    const response = await fetch(`${this.host}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: formattedMessages,
        stream: true,
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`)
    }

    return this.streamResponse(response)
  }

  private async *streamResponse(response: Response): AsyncGenerator<string> {
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('Response body is null')
    }

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(line => line.trim())

        for (const line of lines) {
          try {
            const json = JSON.parse(line)
            if (json.message?.content) {
              yield json.message.content
            }
          } catch {
            // Skip invalid JSON lines
            continue
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  async generate(prompt: string, model?: string): Promise<string> {
    const modelToUse = model || this.defaultModel

    const response = await fetch(`${this.host}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelToUse,
        prompt,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.response
  }

  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.host}/api/tags`, {
        method: 'GET',
      })
      return response.ok
    } catch {
      return false
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.host}/api/tags`)
      if (!response.ok) return []

      const data = await response.json()
      return data.models?.map((m: any) => m.name) || []
    } catch {
      return []
    }
  }
}

// Export singleton
export const ollamaClient = new OllamaClient()
