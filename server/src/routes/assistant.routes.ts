import { Router } from 'express'
import { assistantRequestSchema, generateAssistantResponse } from '../services/assistantService.js'

const requests = new Map<string, { count: number; startedAt: number }>()
const windowMs = 60_000
const maxRequests = 20
export function checkAssistantRateLimit(key: string, now = Date.now()) {
  const current = requests.get(key)
  if (!current || now - current.startedAt >= windowMs) { requests.set(key, { count: 1, startedAt: now }); return true }
  if (current.count >= maxRequests) return false
  current.count += 1
  return true
}
export const assistantRouter = Router()
assistantRouter.post('/', async (request, response, next) => {
  const parsed = assistantRequestSchema.safeParse(request.body)
  if (!parsed.success) { response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Enter a message and valid learning context.' } }); return }
  const key = request.ip ?? 'unknown'
  if (!checkAssistantRateLimit(key)) { response.status(429).json({ error: { code: 'RATE_LIMITED', message: 'Please wait a moment before asking another question.' } }); return }
  try { response.json(await generateAssistantResponse(parsed.data)) } catch (error) { next(error) }
})
