import { Router } from 'express'
import { getFallbackPath, learningPathRequestSchema } from '../services/learningPathService.js'

export const learningPathRouter = Router()
learningPathRouter.post('/generate', (request, response) => {
  const parsed = learningPathRequestSchema.safeParse(request.body)
  if (!parsed.success) { response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Choose a valid subject, goal, and level.' } }); return }
  response.json(getFallbackPath(parsed.data.subject, parsed.data.goal))
})
learningPathRouter.get('/:subject', (request, response) => response.json(getFallbackPath(request.params.subject, 'Interview preparation')))
