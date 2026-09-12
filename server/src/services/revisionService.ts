import { z } from 'zod'

export const revisionPrioritySchema = z.enum(['high', 'medium', 'low'])
export const revisionItemSchema = z.object({
  id: z.string(), topicId: z.string(), topicName: z.string(), lastStudiedAt: z.string(),
  nextReviewAt: z.string(), reviewCount: z.number().int().nonnegative(), accuracy: z.number().min(0).max(100),
  priority: revisionPrioritySchema, status: z.enum(['due', 'upcoming', 'completed']),
})
export const completeRevisionSchema = z.object({ id: z.string().min(1), accuracy: z.number().min(0).max(100) })
export const scheduleRevisionSchema = z.object({ topicId: z.string().min(1), topicName: z.string().min(1), accuracy: z.number().min(0).max(100), reviewCount: z.number().int().nonnegative().default(0) })
const day = 86_400_000
const now = () => new Date('2026-09-11T12:00:00.000Z')
export function addDays(date: Date, days: number) { return new Date(date.getTime() + days * day) }
export function isOverdue(nextReviewAt: string, current = now()) { return nextReviewAt.slice(0, 10) < current.toISOString().slice(0, 10) }
export function getRevisionPriority(accuracy: number, overdue: boolean) { return accuracy < 50 || overdue ? 'high' as const : accuracy < 70 ? 'medium' as const : 'low' as const }
export function calculateNextReview(accuracy: number, reviewCount: number, completedAt = now()) {
  const interval = accuracy >= 80 ? 7 : accuracy >= 50 ? 3 : 1
  return addDays(completedAt, interval).toISOString()
}
const seed = [
  { id: 'revision-1', topicId: 'subnetting', topicName: 'Subnetting', lastStudiedAt: '2026-09-09', nextReviewAt: '2026-09-11', reviewCount: 1, accuracy: 48 },
  { id: 'revision-2', topicId: 'osi-model', topicName: 'OSI Model', lastStudiedAt: '2026-09-08', nextReviewAt: '2026-09-11', reviewCount: 1, accuracy: 58 },
  { id: 'revision-3', topicId: 'sql-joins', topicName: 'SQL JOINs', lastStudiedAt: '2026-09-09', nextReviewAt: '2026-09-11', reviewCount: 2, accuracy: 67 },
  { id: 'revision-4', topicId: 'python-functions', topicName: 'Python Functions', lastStudiedAt: '2026-09-10', nextReviewAt: '2026-09-12', reviewCount: 1, accuracy: 78 },
  { id: 'revision-5', topicId: 'tcp-udp', topicName: 'TCP vs UDP', lastStudiedAt: '2026-09-08', nextReviewAt: '2026-09-14', reviewCount: 2, accuracy: 91 },
]
let items = seed.map((item) => ({ ...item, priority: getRevisionPriority(item.accuracy, isOverdue(item.nextReviewAt)), status: isOverdue(item.nextReviewAt) || item.nextReviewAt.startsWith('2026-09-11') ? 'due' as const : 'upcoming' as const }))
export function getDueRevisions() { return items.filter((item) => item.status === 'due').sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.priority] - { high: 0, medium: 1, low: 2 }[b.priority])) }
export function getUpcomingRevisions() { return items.filter((item) => item.status === 'upcoming').sort((a, b) => new Date(a.nextReviewAt).getTime() - new Date(b.nextReviewAt).getTime()) }
export function getRevisionHistory() { return [{ topicName: 'Subnetting', reviewDate: 'Sep 11', accuracy: 82, outcome: 'Improved' }, { topicName: 'SQL JOINs', reviewDate: 'Sep 10', accuracy: 74, outcome: 'Maintained' }, { topicName: 'Python Functions', reviewDate: 'Sep 8', accuracy: 91, outcome: 'Strong' }] }
export function completeRevision(id: string, accuracy: number) {
  const item = items.find((candidate) => candidate.id === id)
  if (!item) return undefined
  item.accuracy = accuracy
  item.reviewCount += 1
  item.lastStudiedAt = now().toISOString()
  item.nextReviewAt = calculateNextReview(accuracy, item.reviewCount)
  item.priority = getRevisionPriority(accuracy, false)
  item.status = 'upcoming'
  return item
}
export function scheduleRevision(input: z.infer<typeof scheduleRevisionSchema>) {
  const item = { id: `revision-${input.topicId}`, topicId: input.topicId, topicName: input.topicName, lastStudiedAt: now().toISOString(), nextReviewAt: calculateNextReview(input.accuracy, input.reviewCount), reviewCount: input.reviewCount, accuracy: input.accuracy, priority: getRevisionPriority(input.accuracy, false), status: 'upcoming' as const }
  items = [...items.filter((candidate) => candidate.topicId !== input.topicId), item]
  return item
}
