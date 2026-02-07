/**
 * Utilities for token counting and context management
 */

/**
 * Estimate token count for a text string
 * Rough approximation: 1 token ≈ 4 characters for English
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

/**
 * Truncate messages array to fit within token limit
 * Keeps the most recent messages that fit
 */
export function truncateToTokenLimit(
  messages: Array<{ role: string; content: string }>,
  maxTokens: number
): Array<{ role: string; content: string }> {
  let totalTokens = 0
  const result: Array<{ role: string; content: string }> = []

  // Process from newest to oldest
  for (let i = messages.length - 1; i >= 0; i--) {
    const tokens = estimateTokens(messages[i].content)
    
    if (totalTokens + tokens > maxTokens) {
      break
    }

    result.unshift(messages[i])
    totalTokens += tokens
  }

  return result
}

/**
 * Calculate total tokens for an array of messages
 */
export function calculateTotalTokens(messages: Array<{ content: string }>): number {
  return messages.reduce((total, msg) => total + estimateTokens(msg.content), 0)
}
