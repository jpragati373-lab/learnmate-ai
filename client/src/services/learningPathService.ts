import type { LearningPath, LearningPathTopic, PathRecommendation } from '../types'
import { demoProgress } from '../data/demoData'
import { getLearningState, type LearningMode } from './learningState'
import { personalizePath } from '../data/learningPaths'
import { apiUrl } from './api'
export async function getLearningPath(subject: string, goal = 'Interview preparation', level = 'beginner'): Promise<LearningPath> {
  const response = await fetch(apiUrl('/api/learning-path/generate'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject, goal, level }) })
  if (!response.ok) throw new Error('Path unavailable')
  return response.json() as Promise<LearningPath>
}
export function getDemoLearningPath(subject: string, mode: LearningMode = 'demo'): LearningPath {
  const source = mode === 'demo' ? demoProgress : getLearningState('normal').progress
  const progress = Object.fromEntries(source.map((item) => [item.topicId, { accuracy: item.accuracyPercentage, status: item.status }]))
  if (mode === 'normal') return { subject, goal: 'Start your learning journey', topics: (personalizePath(subject, {}).map((item) => ({ ...item, status: 'not-started' as const, progress: 0, accuracy: 0 }))), source: 'demo' }
  if (subject === 'Computer Networks') {
    Object.assign(progress, {
      'networking-basics': { accuracy: 100, status: 'Strong' },
      'ip-addressing': { accuracy: 100, status: 'Strong' },
      subnetting: { accuracy: 48, status: 'Weak' },
      'tcp-ip': { accuracy: 91, status: 'Strong' },
    })
  }
  return { subject, goal: 'Interview preparation', topics: personalizePath(subject, progress), source: 'demo' }
}
export function calculatePathProgress(topics: LearningPathTopic[]) {
  return topics.length ? Math.round(topics.reduce((total, item) => total + item.progress, 0) / topics.length) : 0
}
export function getDemoRecommendation(path: LearningPathTopic[]): PathRecommendation {
  const weak = path.find((item) => item.accuracy > 0 && item.accuracy < 60)
  if (weak) return { type: 'weak-topic', title: `Review ${weak.name}`, reason: `Recommended because your accuracy in this topic is ${weak.accuracy}%.`, action: 'Practice', topicId: weak.id }
  const next = path.find((item) => item.status === 'recommended' || item.status === 'current')
  const fallback = next ?? path[0]
  return { type: 'next-topic', title: `Continue ${fallback?.name ?? 'your learning path'}`, reason: 'Recommended because it is the next eligible step in your path.', action: 'Continue', topicId: fallback?.id ?? '' }
}
