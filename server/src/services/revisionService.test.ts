import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateNextReview, getDueRevisions, getRevisionPriority, getUpcomingRevisions, isOverdue } from './revisionService.js'
test('schedules day 1, day 3, and day 7 reviews', () => {
  const base = new Date('2026-09-11T12:00:00Z')
  assert.equal(calculateNextReview(45, 0, base), '2026-09-12T12:00:00.000Z')
  assert.equal(calculateNextReview(65, 1, base), '2026-09-14T12:00:00.000Z')
  assert.equal(calculateNextReview(85, 2, base), '2026-09-18T12:00:00.000Z')
})
test('calculates deterministic priorities and overdue state', () => {
  assert.equal(getRevisionPriority(45, false), 'high')
  assert.equal(getRevisionPriority(60, false), 'medium')
  assert.equal(getRevisionPriority(85, false), 'low')
  assert.equal(isOverdue('2026-09-10T12:00:00Z'), true)
})
test('filters due and upcoming revisions', () => {
  assert.equal(getDueRevisions().length, 3)
  assert.equal(getUpcomingRevisions().length, 2)
})
