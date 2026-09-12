import assert from 'node:assert/strict'
import test from 'node:test'
import { assistantRequestSchema, demoAssistantResponse } from './assistantService.js'
import { checkAssistantRateLimit } from '../routes/assistant.routes.js'

const valid = { message: 'I do not understand subnet masks', context: { subject: 'Computer Networks', topic: 'Subnetting', level: 'beginner' as const, learningStyle: 'analogy' as const, recentAccuracy: 48 }, conversation: [] }
test('validates assistant message and context', () => assert.equal(assistantRequestSchema.safeParse(valid).success, true))
test('rejects empty and oversized messages', () => {
  assert.equal(assistantRequestSchema.safeParse({ ...valid, message: '' }).success, false)
  assert.equal(assistantRequestSchema.safeParse({ ...valid, message: 'x'.repeat(2001) }).success, false)
})
test('limits conversation history and roles', () => {
  const history = Array.from({ length: 16 }, (_, index) => ({ id: String(index), role: 'user', content: 'hello', timestamp: '2026-09-11' }))
  assert.equal(assistantRequestSchema.safeParse({ ...valid, conversation: history }).success, false)
  assert.equal(assistantRequestSchema.safeParse({ ...valid, conversation: [{ id: '1', role: 'system', content: 'hello', timestamp: '2026-09-11' }] }).success, false)
})
test('returns safe demo fallback responses', () => {
  const result = demoAssistantResponse(valid)
  assert.equal(result.source, 'demo')
  assert.match(result.message, /subnet mask/i)
})
test('enforces a short assistant request limit', () => {
  const key = `test-${Date.now()}`
  for (let index = 0; index < 20; index += 1) assert.equal(checkAssistantRateLimit(key), true)
  assert.equal(checkAssistantRateLimit(key), false)
})
