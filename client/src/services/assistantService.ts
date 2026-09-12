import type { AssistantContext, ChatMessage } from '../types'
import { apiUrl } from './api'
export async function askAssistant(message: string, context: AssistantContext, conversation: ChatMessage[]) {
  const response = await fetch(apiUrl('/api/ai/assistant'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, context, conversation: conversation.slice(-15) }) })
  if (!response.ok) throw new Error('Assistant unavailable')
  return response.json() as Promise<{ message: string; suggestedActions: string[]; topic: string; source: 'ai' | 'demo' }>
}
