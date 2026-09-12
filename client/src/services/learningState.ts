import { demoAttempts, demoProgress, demoRevisions, demoTopics, recentActivity } from '../data/demoData'
import type { QuizAttempt, RevisionItem, TopicProgress } from '../types'

const storageKey = 'learnmate-learning-state-v2'

export interface LearningActivity {
  id: string
  title: string
  meta: string
  score: string
}

export interface LearningState {
  progress: TopicProgress[]
  attempts: QuizAttempt[]
  revisions: RevisionItem[]
  activity: LearningActivity[]
  studyMinutes: number
  studySessions: number
}

export type LearningMode = 'normal' | 'demo'

function createEmptyState(): LearningState {
  return {
    progress: demoTopics.map((topic) => ({ topicId: topic.id, questionsAttempted: 0, correctAnswers: 0, accuracyPercentage: 0, status: 'Not started' })),
    attempts: [],
    revisions: [],
    activity: [],
    studyMinutes: 0,
    studySessions: 0,
  }
}

function readStoredState(): LearningState {
  if (typeof window === 'undefined') return createEmptyState()
  try {
    const stored = window.localStorage.getItem(storageKey)
    if (!stored) return createEmptyState()
    const parsed = JSON.parse(stored) as Partial<LearningState>
    if (!Array.isArray(parsed.progress) || !Array.isArray(parsed.attempts) || !Array.isArray(parsed.revisions) || !Array.isArray(parsed.activity)) return createEmptyState()
    return { ...createEmptyState(), ...parsed }
  } catch {
    return createEmptyState()
  }
}

let normalState = readStoredState()

function persist() {
  if (typeof window !== 'undefined') window.localStorage.setItem(storageKey, JSON.stringify(normalState))
}

export function getLearningState(mode: LearningMode = 'normal'): LearningState {
  if (mode === 'demo') return { progress: demoProgress.map((item) => ({ ...item })), attempts: demoAttempts.map((item) => ({ ...item })), revisions: demoRevisions.map((item) => ({ ...item })), activity: recentActivity.map((item) => ({ ...item })), studyMinutes: 210, studySessions: 8 }
  return { ...normalState, progress: normalState.progress.map((item) => ({ ...item })), attempts: [...normalState.attempts], revisions: [...normalState.revisions], activity: [...normalState.activity] }
}

export function recordQuizResult(topic: string, questionsAttempted: number, correctAnswers: number) {
  const topicRecord = normalState.progress.find((item) => item.topicId === topic.toLowerCase().replace(/\s+/g, '-')) ?? normalState.progress.find((item) => item.topicId === 'subnetting' && topic.toLowerCase() === 'subnetting')
  if (!topicRecord) return
  const totalQuestions = topicRecord.questionsAttempted + questionsAttempted
  const totalCorrect = topicRecord.correctAnswers + correctAnswers
  const accuracy = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0
  topicRecord.questionsAttempted = totalQuestions
  topicRecord.correctAnswers = totalCorrect
  topicRecord.accuracyPercentage = accuracy
  topicRecord.status = accuracy >= 80 ? 'Strong' : accuracy >= 60 ? 'Developing' : 'Weak'
  topicRecord.lastPracticedAt = new Date().toISOString().slice(0, 10)
  const attemptId = `attempt-${Date.now()}`
  normalState.attempts.push({ id: attemptId, topicId: topicRecord.topicId, scorePercentage: questionsAttempted ? Math.round((correctAnswers / questionsAttempted) * 100) : 0, questionsAttempted, correctAnswers, completedAt: topicRecord.lastPracticedAt })
  normalState.studySessions += 1
  normalState.activity = normalState.activity.filter((item) => item.title !== `Practised ${topic}` || item.score !== `${accuracy}%`)
  normalState.activity.unshift({ id: `activity-${attemptId}`, title: `Practised ${topic}`, meta: 'Computer Networks · Today', score: `${accuracy}%` })
  normalState.revisions = normalState.revisions.filter((item) => item.topicId !== topicRecord.topicId)
  normalState.revisions.push({ id: `revision-${Date.now()}`, topicId: topicRecord.topicId, topicName: topic, lastStudiedAt: topicRecord.lastPracticedAt, nextReviewAt: new Date(Date.now() + (accuracy >= 80 ? 7 : accuracy >= 50 ? 3 : 1) * 86_400_000).toISOString(), reviewCount: 0, accuracy, priority: accuracy < 50 ? 'high' : accuracy < 70 ? 'medium' : 'low', status: 'upcoming' })
  persist()
}

export function clearNormalLearningState() {
  normalState = createEmptyState()
  persist()
}
