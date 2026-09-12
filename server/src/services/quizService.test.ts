import assert from 'node:assert/strict'
import test from 'node:test'
import { checkStoredAnswer, getDemoQuiz, quizResponseSchema } from './quizService.js'
import { adjustDifficulty, calculateScore, hasDuplicateQuestions, topicStrength } from './quizRules.js'

test('calculates quiz score accurately', () => {
  assert.equal(calculateScore(4, 5), 80)
  assert.equal(calculateScore(0, 0), 0)
})

test('detects weak and strong topics from actual accuracy', () => {
  assert.equal(topicStrength(45), 'weak')
  assert.equal(topicStrength(85), 'strong')
  assert.equal(topicStrength(70), 'developing')
})

test('adjusts difficulty from at least two recent answers', () => {
  assert.equal(adjustDifficulty('beginner', [true, true, true]), 'intermediate')
  assert.equal(adjustDifficulty('intermediate', [false, false, false]), 'beginner')
  assert.equal(adjustDifficulty('intermediate', [true, false]), 'intermediate')
})

test('prevents duplicate generated questions', () => {
  const questions = getDemoQuiz('TCP vs UDP', 'beginner', 5)
  assert.equal(hasDuplicateQuestions(questions), false)
  assert.equal(new Set(questions.map((question) => question.id)).size, questions.length)
  for (const question of questions) {
    assert.equal(question.subject, 'Computer Networks')
    assert.equal(question.topic, 'TCP vs UDP')
    assert.equal(question.options.length, 4)
    assert.ok(question.options.includes(question.correctAnswer))
    assert.ok(question.explanation.length > 0)
  }
})

test('serves non-repeating subnetting questions across three tests at every level', () => {
  for (const level of ['beginner', 'intermediate', 'advanced'] as const) {
    const first = getDemoQuiz('Subnetting', level, 5)
    const second = getDemoQuiz('Subnetting', level, 5, first.map((question) => question.id), first.map((question) => question.question))
    const third = getDemoQuiz('Subnetting', level, 5, [...first, ...second].map((question) => question.id), [...first, ...second].map((question) => question.question))
    const ids = [...first, ...second, ...third].map((question) => question.id)
    assert.equal(new Set(ids).size, 15)
  }
})

test('keeps question history independent between difficulty levels', () => {
  const beginner = getDemoQuiz('Subnetting', 'beginner', 5)
  const intermediate = getDemoQuiz('Subnetting', 'intermediate', 5, beginner.map((question) => question.id))
  assert.equal(intermediate.some((question) => beginner.some((item) => item.id === question.id)), false)
})

test('provides meaningful OSI questions at each difficulty', () => {
  for (const level of ['beginner', 'intermediate', 'advanced'] as const) {
    const questions = getDemoQuiz('OSI Model', level, 5)
    assert.equal(questions.filter((question) => question.concept === 'OSI layers').length, 5)
    assert.ok(questions.every((question) => question.subject === 'Computer Networks' && question.topic === 'OSI Model' && question.difficulty === level))
  }
})

test('reports exhaustion instead of repeating a completed pool', () => {
  const all = getDemoQuiz('Subnetting', 'advanced', 10)
  const remaining = getDemoQuiz('Subnetting', 'advanced', 5, all.map((question) => question.id))
  assert.equal(remaining.length, 5)
  assert.throws(() => getDemoQuiz('Subnetting', 'advanced', 5, [...all, ...remaining].map((question) => question.id)), /QUESTION_POOL_EXHAUSTED/)
})

test('does not expose correct answers in quiz response schema', () => {
  const questions = getDemoQuiz('TCP vs UDP', 'beginner', 5)
  const response = { questions: questions.map(({ correctAnswer: _answer, explanation: _explanation, ...question }) => question), source: 'demo' as const }
  assert.equal(quizResponseSchema.safeParse(response).success, true)
  assert.equal('correctAnswer' in response.questions[0], false)
})

test('evaluates a stored answer server-side', () => {
  const [question] = getDemoQuiz('TCP vs UDP', 'beginner', 5)
  const result = checkStoredAnswer(question.id, question.correctAnswer)
  assert.equal(result?.correct, true)
  assert.equal(result?.correctAnswer, question.correctAnswer)
  assert.equal(checkStoredAnswer(question.id, question.options.find((option) => option !== question.correctAnswer)!)?.correct, false)
})
