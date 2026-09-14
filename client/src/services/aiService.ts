import type { LearningLevel, LearningStyle } from '../types'
import { apiUrl } from './api'

export interface LearningExplanation {
  topic: string
  level: LearningLevel
  definition: string
  quickExplanation: string
  simpleExample: string
  explanation: string
  whyItMatters: string
  keyPoints: string[]
  rememberThis: string
  analogy: string
  steps: string[]
  example: string
  commonMistakes: string[]
  summary: string[]
  knowledgeChecks: { question: string; answer: string }[]
  quickCheck: { question: string; options: string[]; explanation: string }
  optionalDeeperExplanation: string
  relatedTopics: string[]
  source: 'ai' | 'demo'
}

export async function explainTopic(input: { topic: string; level: LearningLevel; learningStyle: LearningStyle; instruction?: string }): Promise<LearningExplanation> {
  const response = await fetch(apiUrl('/api/ai/explain'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) })
  if (!response.ok) throw new Error('Learning content could not be generated')
  return response.json() as Promise<LearningExplanation>
}

export async function validateQuickCheck(topic: string, selectedOption: number): Promise<{ correct: boolean; explanation: string }> {
  const response = await fetch(apiUrl('/api/ai/quick-check'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, selectedOption }) })
  if (!response.ok) throw new Error('Quick check could not be evaluated')
  return response.json() as Promise<{ correct: boolean; explanation: string }>
}
