import { Router } from 'express'
import { getRecommendation } from '../services/recommendationService.js'

export const recommendationRouter = Router()
const demoProgress = [{ topicId: 'subnetting', accuracy: 48, status: 'Weak' }, { topicId: 'tcp-ip', accuracy: 91, status: 'Strong' }]
const demoPath = [{ id: 'subnetting', name: 'Subnetting', prerequisites: ['ip-addressing'] }, { id: 'tcp-ip', name: 'TCP/IP', prerequisites: [] }, { id: 'cidr', name: 'CIDR', prerequisites: ['subnetting'] }]
recommendationRouter.get('/', (_request, response) => response.json(getRecommendation(demoProgress, demoPath, 'subnetting')))
recommendationRouter.get('/next', (_request, response) => response.json(getRecommendation(demoProgress, demoPath, 'subnetting')))
