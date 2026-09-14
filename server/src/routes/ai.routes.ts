import { Router } from 'express'
import { explanationRequestSchema, generateExplanation, validateQuickCheck } from '../services/aiService.js'
import { generateQuiz, quizRequestSchema, toPublicQuestion } from '../services/quizService.js'
import { generateTeachingLesson, teachingRequestSchema, validateTeachingCheck } from '../services/teachingService.js'

export const aiRouter = Router()

aiRouter.post('/explain', async (request, response, next) => {
  const parsed = explanationRequestSchema.safeParse(request.body)
  if (!parsed.success) {
    response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Enter a topic and choose valid learning preferences.' } })
    return
  }
  try {
    response.json(await generateExplanation(parsed.data))
  } catch (error) {
    next(error)
  }
})

aiRouter.post('/quick-check', (request, response) => {
  const topic = typeof request.body?.topic === 'string' ? request.body.topic.trim() : ''
  const selectedOption = request.body?.selectedOption
  if (topic.length < 2 || !Number.isInteger(selectedOption) || selectedOption < 0 || selectedOption > 3) {
    response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Choose a valid answer.' } })
    return
  }
  response.json(validateQuickCheck(topic, selectedOption))
})

aiRouter.post('/teach', (request, response) => {
  const parsed = teachingRequestSchema.safeParse(request.body)
  if (!parsed.success) {
    response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Choose a valid topic and learning level.' } })
    return
  }
  response.json(generateTeachingLesson(parsed.data))
})

aiRouter.post('/teach/check', (request, response) => {
  const topic = typeof request.body?.topic === 'string' ? request.body.topic.trim() : ''
  const step = request.body?.step
  const selectedOption = request.body?.selectedOption
  const retry = request.body?.retry === true
  if (topic.length < 2 || !Number.isInteger(step) || step < 0 || !Number.isInteger(selectedOption) || selectedOption < 0 || selectedOption > 3) {
    response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Choose a valid teaching answer.' } })
    return
  }
  response.json(validateTeachingCheck(topic, step, selectedOption, retry))
})

aiRouter.post('/generate-quiz', async (request, response, next) => {
  const parsed = quizRequestSchema.safeParse(request.body)
  if (!parsed.success) {
    response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Choose a valid topic, level, and question count.' } })
    return
  }
  try {
    const questions = await generateQuiz(parsed.data.subject, parsed.data.topic, parsed.data.level, parsed.data.count, parsed.data.usedQuestionIds, parsed.data.usedQuestionTexts)
    response.json({ questions: questions.map(toPublicQuestion), source: questions.some((question) => question.source === 'ai') ? 'ai' : 'demo' })
  } catch (error) {
    if (error instanceof Error && error.message === 'QUESTION_POOL_EXHAUSTED') {
      response.status(409).json({ error: { code: 'QUESTION_POOL_EXHAUSTED', message: "You've completed all available questions for this level. Try another difficulty level or reset this topic's question history." } })
      return
    }
    next(error)
  }
})
