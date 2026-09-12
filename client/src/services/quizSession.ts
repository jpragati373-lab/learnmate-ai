import type { LearningLevel, QuizQuestion } from '../types'
import type { QuizAnswerResult } from './quizService'

export interface StoredQuizSession {
  recorded?: boolean
  topic: string
  level: LearningLevel
  questions: QuizQuestion[]
  answers: { questionId: string; selectedAnswer: string; result: QuizAnswerResult }[]
  difficultyPath: string[]
}

export let lastQuizSession: StoredQuizSession | null = null

export function saveQuizSession(session: StoredQuizSession) {
  lastQuizSession = session
}
