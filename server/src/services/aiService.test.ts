import assert from 'node:assert/strict'
import test from 'node:test'
import { demoExplanation, explanationRequestSchema, explanationResponseSchema, validateQuickCheck } from './aiService.js'

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

test('returns the structured Quick Learn contract without exposing the answer', () => {
  const response = demoExplanation({ topic: 'VPN', level: 'beginner', learningStyle: 'simple' })
  assert.equal(explanationResponseSchema.safeParse(response).success, true)
  assert.ok(response.quickExplanation.length > 0)
  assert.equal('correctAnswer' in response.quickCheck, false)
  assert.equal('answer' in response.quickCheck, false)
  assert.equal(response.relatedTopics.length > 0, true)
})

test('adapts fallback content to all supported teaching styles and levels', () => {
  for (const level of ['beginner', 'intermediate', 'advanced'] as const) {
    for (const learningStyle of ['simple', 'step-by-step', 'example-based', 'analogy', 'exam-focused'] as const) {
      const response = demoExplanation({ topic: 'Subnetting', level, learningStyle })
      assert.equal(response.level, level)
      assert.equal(response.source, 'demo')
      assert.equal(explanationResponseSchema.safeParse(response).success, true)
    }
  }
})

test('evaluates quick checks server-side', () => {
  assert.deepEqual(validateQuickCheck('VPN', 1), { correct: true, explanation: 'A VPN primarily creates an encrypted connection through a VPN server.' })
  assert.equal(validateQuickCheck('VPN', 0).correct, false)
})
