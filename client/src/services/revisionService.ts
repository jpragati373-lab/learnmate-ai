import type { RevisionPriority } from '../types'
import { getLearningState, type LearningMode } from './learningState'

const DAY = 86_400_000
const demoToday = new Date('2026-09-11T12:00:00Z')

export function today() { return new Date(demoToday) }
export function addDays(date: Date, days: number) { return new Date(date.getTime() + days * DAY) }
export function formatDate(date: string | Date) { return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(date)) }
export function daysUntil(date: string, now = today()) { return Math.ceil((new Date(date).getTime() - now.getTime()) / DAY) }
export function isDue(date: string, now = today()) { return date.slice(0, 10) <= now.toISOString().slice(0, 10) }
export function getRevisionPriority(accuracy: number, overdue: boolean): RevisionPriority {
  if (accuracy < 50 || overdue) return 'high'
  if (accuracy < 70) return 'medium'
  return 'low'
}
export function calculateNextReview(accuracy: number, _reviewCount: number, completedAt = today()) {
  return addDays(completedAt, accuracy >= 80 ? 7 : accuracy >= 50 ? 3 : 1).toISOString()
}
export function getRevisionItems(mode: LearningMode = 'normal') {
  const currentDate = today().toISOString().slice(0, 10)
  return getLearningState(mode).revisions.map((item) => ({ ...item, status: isDue(item.nextReviewAt) ? 'due' as const : item.status === 'completed' ? 'completed' as const : 'upcoming' as const, priority: getRevisionPriority(item.accuracy, item.nextReviewAt.slice(0, 10) < currentDate) }))
}
export function getDueRevisions(mode: LearningMode = 'normal') {
  const rank: Record<RevisionPriority, number> = { high: 0, medium: 1, low: 2 }
  return getRevisionItems(mode).filter((item) => item.status === 'due').sort((a, b) => rank[a.priority] - rank[b.priority] || new Date(a.nextReviewAt).getTime() - new Date(b.nextReviewAt).getTime())
}
export function getUpcomingRevisions(mode: LearningMode = 'normal') { return getRevisionItems(mode).filter((item) => item.status === 'upcoming').sort((a, b) => new Date(a.nextReviewAt).getTime() - new Date(b.nextReviewAt).getTime()) }
export function getRevisionHistory(mode: LearningMode = 'normal') {
  return mode === 'demo' ? [{ topicName: 'Subnetting', reviewDate: 'Sep 11', accuracy: 82, outcome: 'Improved' }, { topicName: 'SQL JOINs', reviewDate: 'Sep 10', accuracy: 74, outcome: 'Maintained' }, { topicName: 'Python Functions', reviewDate: 'Sep 8', accuracy: 91, outcome: 'Strong' }] : []
}
export function completeRevision(_id: string, _accuracy: number, _mode: LearningMode = 'normal') {
  // Revision completion is intentionally in-memory for the demo application.
}
export function recordQuizRevision(_topicName: string, _accuracy: number) {
  // Quiz completion is recorded by learningState.recordQuizResult.
}
