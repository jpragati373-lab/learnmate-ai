import { apiUrl } from './api'
import type { LearningLevel } from '../types'

export interface TeachingStep {
  title: string
  explanation: string
  example: string
  takeaway: string
  knowledgeCheck: { question: string; options: string[] }
}
export interface TeachingLesson { topic: string; level: LearningLevel; steps: TeachingStep[]; source: 'ai' | 'demo' }
export interface TeachingCheckResult { correct: boolean; explanation: string; retry?: { question: string; options: string[] } }

export async function startTeaching(topic: string, level: LearningLevel): Promise<TeachingLesson> {
  const response = await fetch(apiUrl('/api/ai/teach'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, level }) })
  if (!response.ok) throw new Error('Teaching lesson could not be generated')
  return response.json() as Promise<TeachingLesson>
}

export async function submitTeachingCheck(topic: string, step: number, selectedOption: number, retry = false): Promise<TeachingCheckResult> {
  const response = await fetch(apiUrl('/api/ai/teach/check'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, step, selectedOption, retry }) })
  if (!response.ok) throw new Error('Teaching answer could not be evaluated')
  return response.json() as Promise<TeachingCheckResult>
}

export interface TeachingSessionState {
  topicId: string
  currentStep: number
  completedSteps: number[]
  knowledgeChecks: number
  correctChecks: number
  incorrectChecks: number
  startedAt: string
  completedAt?: string
}

const storageKey = 'learnmate-teaching-sessions-v1'
export function loadTeachingSession(topicId: string): TeachingSessionState | null {
  try {
    const all = JSON.parse(localStorage.getItem(storageKey) ?? '{}') as Record<string, TeachingSessionState>
    return all[topicId] ?? null
  } catch { return null }
}
export function saveTeachingSession(session: TeachingSessionState) {
  const all = JSON.parse(localStorage.getItem(storageKey) ?? '{}') as Record<string, TeachingSessionState>
  all[session.topicId] = session
  localStorage.setItem(storageKey, JSON.stringify(all))
}
