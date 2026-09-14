import assert from 'node:assert/strict'
import test from 'node:test'
import { generateTeachingLesson, teachingResponseSchema, validateTeachingCheck } from './teachingService.js'

test('generates a validated fallback teaching lesson with hidden answers', () => {
  const lesson = generateTeachingLesson({ topic: 'Subnetting', level: 'beginner' })
  assert.equal(lesson.source, 'demo')
  assert.equal(lesson.steps.length, 5)
  assert.equal(teachingResponseSchema.safeParse(lesson).success, true)
  assert.equal('answer' in lesson.steps[0].knowledgeCheck, false)
})

test('adapts teaching explanations to advanced learners', () => {
  const lesson = generateTeachingLesson({ topic: 'Subnetting', level: 'advanced' })
  assert.match(lesson.steps[0].explanation, /boundary conditions/i)
})

test('returns a different retry question after an incorrect answer', () => {
  const result = validateTeachingCheck('Subnetting', 0, 1)
  assert.equal(result.correct, false)
  assert.ok(result.retry)
  assert.notEqual(result.retry?.question, 'What does an IP address identify?')
  assert.equal(validateTeachingCheck('Subnetting', 0, 0).correct, true)
})
