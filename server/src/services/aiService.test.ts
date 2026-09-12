import assert from 'node:assert/strict'
import test from 'node:test'
import { demoExplanation, explanationRequestSchema, explanationResponseSchema } from './aiService.js'

test('accepts a valid explanation request', () => {
  const result = explanationRequestSchema.safeParse({ topic: 'TCP vs UDP', level: 'beginner', learningStyle: 'analogy' })
  assert.equal(result.success, true)
})

test('rejects invalid level, style, and empty topics', () => {
  assert.equal(explanationRequestSchema.safeParse({ topic: '', level: 'beginner', learningStyle: 'simple' }).success, false)
  assert.equal(explanationRequestSchema.safeParse({ topic: 'TCP', level: 'expert', learningStyle: 'simple' }).success, false)
  assert.equal(explanationRequestSchema.safeParse({ topic: 'TCP', level: 'beginner', learningStyle: 'visual' }).success, false)
})

test('returns a validated demo explanation for a common topic', () => {
  const response = demoExplanation({ topic: 'TCP vs UDP', level: 'beginner', learningStyle: 'analogy' })
  assert.equal(response.source, 'demo')
  assert.equal(response.knowledgeChecks.length, 3)
  assert.equal(explanationResponseSchema.safeParse(response).success, true)
})

test('returns a safe generic fallback for an unknown topic', () => {
  const response = demoExplanation({ topic: 'Binary search', level: 'intermediate', learningStyle: 'step-by-step' })
  assert.equal(response.topic, 'Binary search')
  assert.equal(response.steps.length > 0, true)
  assert.equal(response.source, 'demo')
})
