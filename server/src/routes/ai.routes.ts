import { Router } from 'express'
import { explanationRequestSchema, generateExplanation } from '../services/aiService.js'
import { generateQuiz, quizRequestSchema, toPublicQuestion } from '../services/quizService.js'

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
