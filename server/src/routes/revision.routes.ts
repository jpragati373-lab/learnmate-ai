import { Router } from 'express'
import { completeRevision, completeRevisionSchema, getDueRevisions, getRevisionHistory, getUpcomingRevisions, scheduleRevision, scheduleRevisionSchema } from '../services/revisionService.js'
export const revisionRouter = Router()
revisionRouter.get('/today', (_request, response) => response.json({ items: getDueRevisions() }))
revisionRouter.get('/upcoming', (_request, response) => response.json({ items: getUpcomingRevisions() }))
revisionRouter.get('/history', (_request, response) => response.json({ items: getRevisionHistory() }))
revisionRouter.post('/complete', (request, response) => {
  const parsed = completeRevisionSchema.safeParse(request.body)
  if (!parsed.success) { response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'A valid revision id and accuracy are required.' } }); return }
  const item = completeRevision(parsed.data.id, parsed.data.accuracy)
  if (!item) { response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Revision item not found.' } }); return }
  response.json(item)
})
revisionRouter.post('/schedule', (request, response) => {
  const parsed = scheduleRevisionSchema.safeParse(request.body)
  if (!parsed.success) { response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid revision schedule.' } }); return }
  response.status(201).json(scheduleRevision(parsed.data))
})
