import cors from 'cors'
import express from 'express'
import { errorHandler } from './middleware/errorHandler.js'
import { healthRouter } from './routes/health.routes.js'
import { aiRouter } from './routes/ai.routes.js'
import { quizRouter } from './routes/quiz.routes.js'
import { learningPathRouter } from './routes/learningPath.routes.js'
import { recommendationRouter } from './routes/recommendation.routes.js'
import { revisionRouter } from './routes/revision.routes.js'
import { analyticsRouter } from './routes/analytics.routes.js'
import { assistantRouter } from './routes/assistant.routes.js'

export function createApp() {
  const app = express()
  const configuredClientUrl = process.env.CLIENT_URL ?? 'http://localhost:5173'
  const allowedOrigins = new Set([configuredClientUrl, ...(process.env.NODE_ENV === 'production' ? [] : ['http://127.0.0.1:5173'])])
  app.use(cors({ origin: (origin, callback) => callback(null, !origin || allowedOrigins.has(origin)) }))
  app.use(express.json({ limit: '100kb' }))
  app.use('/api/health', healthRouter)
  app.use('/api/ai', aiRouter)
  app.use('/api/quiz', quizRouter)
  app.use('/api/learning-path', learningPathRouter)
  app.use('/api/recommendations', recommendationRouter)
  app.use('/api/revision', revisionRouter)
  app.use('/api/analytics', analyticsRouter)
  app.use('/api/ai/assistant', assistantRouter)
  app.use((_request, response) => response.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found.' } }))
  app.use(errorHandler)
  return app
}
