import type { LearningLevel, QuizQuestion } from '../types'
import { apiUrl } from './api'

export interface QuizAnswerResult {
  correct: boolean
  correctAnswer: string
  explanation: string
  concept: string
  misconception?: string
  nextAction: string
}

export async function generateQuiz(input: { subject: string; topic: string; level: LearningLevel; count: 5 | 10; usedQuestionIds?: string[]; usedQuestionTexts?: string[] }) {
  const usedQuestionTexts = input.usedQuestionTexts ?? []
  const response = await fetch(apiUrl('/api/ai/generate-quiz'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...input, usedQuestionTexts }) })
  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { error?: { message?: string } } | null
    throw new Error(payload?.error?.message ?? 'Quiz generation failed')
  }
  return response.json() as Promise<{ questions: QuizQuestion[]; source: 'ai' | 'demo' }>
}

export async function checkAnswer(questionId: string, selectedAnswer: string) {
  const response = await fetch(apiUrl('/api/quiz/check-answer'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ questionId, selectedAnswer }) })
  if (!response.ok) throw new Error('Answer evaluation failed')
  return response.json() as Promise<QuizAnswerResult>
}
