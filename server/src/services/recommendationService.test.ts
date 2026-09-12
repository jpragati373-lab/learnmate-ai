import assert from 'node:assert/strict'
import test from 'node:test'
import { getRecommendation } from './recommendationService.js'
import { getFallbackPath, learningPathRequestSchema, learningPathResponseSchema } from './learningPathService.js'

const path = [
  { id: 'ip-addressing', name: 'IP Addressing', prerequisites: [] },
  { id: 'subnetting', name: 'Subnetting', prerequisites: ['ip-addressing'] },
  { id: 'cidr', name: 'CIDR', prerequisites: ['subnetting'] },
]

test('recommends a weak prerequisite before the next topic', () => {
  const result = getRecommendation([{ topicId: 'ip-addressing', accuracy: 42, status: 'Weak' }], path, 'cidr')
  assert.equal(result.type, 'prerequisite')
  assert.equal(result.topicId, 'ip-addressing')
})

test('recommends an advanced direction for strong performance', () => {
  const result = getRecommendation([{ topicId: 'ip-addressing', accuracy: 91, status: 'Strong' }, { topicId: 'subnetting', accuracy: 91, status: 'Strong' }], path)
  assert.equal(result.type, 'next-topic')
  assert.equal(result.topicId, 'cidr')
})

test('validates path input and returns a fallback path', () => {
  assert.equal(learningPathRequestSchema.safeParse({ subject: '', goal: 'Interview', level: 'beginner' }).success, false)
  const result = getFallbackPath('Computer Networks', 'Interview preparation')
  assert.equal(result.source, 'demo')
  assert.equal(learningPathResponseSchema.safeParse(result).success, true)
  assert.equal(result.topics[0].status, 'current')
  assert.equal(result.topics[2].status, 'locked')
})
