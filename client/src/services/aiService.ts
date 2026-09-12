import type { LearningLevel, LearningStyle } from '../types'
import { apiUrl } from './api'

export interface LearningExplanation {
  topic: string
  level: LearningLevel
  explanation: string
  whyItMatters: string
  analogy: string
  steps: string[]
  example: string
  commonMistakes: string[]
  summary: string[]
  knowledgeChecks: { question: string; answer: string }[]
  source: 'ai' | 'demo'
}

export async function explainTopic(input: { topic: string; level: LearningLevel; learningStyle: LearningStyle; instruction?: string }): Promise<LearningExplanation> {
  const response = await fetch(apiUrl('/api/ai/explain'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) })
  if (!response.ok) throw new Error('Learning content could not be generated')
  return response.json() as Promise<LearningExplanation>
}
