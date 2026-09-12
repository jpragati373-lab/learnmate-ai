import { Router } from 'express'
import { checkStoredAnswer, generateQuiz, quizRequestSchema, toPublicQuestion } from '../services/quizService.js'
import { z } from 'zod'

export const quizRouter = Router()

quizRouter.post('/generate', async (request, response, next) => {
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

quizRouter.post('/check-answer', (request, response) => {
  const parsed = z.object({ questionId: z.string().min(1), selectedAnswer: z.string().min(1).max(300) }).safeParse(request.body)
  if (!parsed.success) {
    response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'A question and answer are required.' } })
    return
  }
  const result = checkStoredAnswer(parsed.data.questionId, parsed.data.selectedAnswer)
  if (!result) {
    response.status(404).json({ error: { code: 'QUESTION_NOT_FOUND', message: 'This question is no longer available.' } })
    return
  }
  response.json(result)
})
