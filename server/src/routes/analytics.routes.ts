import { Router } from 'express'
import { calculateActivity, calculateLearningTrend, calculateSubjectPerformance, calculateTopicPerformance, generateLearningInsights, getOverview } from '../services/analyticsService.js'
export const analyticsRouter = Router()
analyticsRouter.get('/overview', (_request, response) => response.json(getOverview()))
analyticsRouter.get('/subjects', (_request, response) => response.json({ items: calculateSubjectPerformance() }))
analyticsRouter.get('/topics', (_request, response) => response.json({ items: calculateTopicPerformance() }))
analyticsRouter.get('/trends', (_request, response) => response.json({ items: calculateLearningTrend() }))
analyticsRouter.get('/activity', (_request, response) => response.json({ items: calculateActivity() }))
analyticsRouter.get('/insights', (_request, response) => response.json({ items: generateLearningInsights() }))
