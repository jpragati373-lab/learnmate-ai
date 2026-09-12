export interface ProgressInput { topicId: string; accuracy: number; status: string }
export interface Recommendation { type: string; title: string; reason: string; action: string; topicId: string }

export function getRecommendation(progress: ProgressInput[], path: { id: string; name: string; prerequisites: string[] }[], currentTopicId?: string): Recommendation {
  const fallbackTopic = path[0]
  const byId = new Map(progress.map((item) => [item.topicId, item]))
  const completed = new Set(progress.filter((item) => item.accuracy >= 80 || item.status === 'completed').map((item) => item.topicId))
  const prerequisiteWeak = path.find((item) => item.prerequisites.some((id) => byId.has(id) && (byId.get(id)?.accuracy ?? 0) < 50))
  if (prerequisiteWeak) {
    const weakId = prerequisiteWeak.prerequisites.find((id) => byId.has(id) && (byId.get(id)?.accuracy ?? 0) < 50)
    if (!weakId) return { type: 'next-topic', title: `Start ${prerequisiteWeak.name}`, reason: 'Recommended because it is the next eligible step in your path.', action: 'Learn', topicId: prerequisiteWeak.id }
    return { type: 'prerequisite', title: `Review ${path.find((item) => item.id === weakId)?.name ?? 'the prerequisite'}`, reason: `Recommended because your prerequisite accuracy is ${byId.get(weakId)?.accuracy ?? 0}%.`, action: 'Practice', topicId: weakId }
  }
  const weak = progress.find((item) => item.accuracy < 50)
  if (weak) return { type: 'weak-topic', title: `Review ${path.find((item) => item.id === weak.topicId)?.name ?? 'this topic'}`, reason: `Recommended because your accuracy in this topic is ${weak.accuracy}%.`, action: 'Practice', topicId: weak.topicId }
  const current = currentTopicId ? byId.get(currentTopicId) : undefined
  if (current && current.accuracy < 85) return { type: 'current-topic', title: `Continue ${path.find((item) => item.id === current.topicId)?.name ?? 'your current topic'}`, reason: `Recommended because your recent accuracy is ${current.accuracy}%.`, action: 'Continue', topicId: current.topicId }
  const next = path.find((item) => !completed.has(item.id) && item.prerequisites.every((id) => completed.has(id)))
  if (next) return { type: 'next-topic', title: `Start ${next.name}`, reason: 'Recommended because you have completed its prerequisite topics.', action: 'Learn', topicId: next.id }
  const strong = progress.find((item) => item.accuracy >= 85)
  return { type: 'advanced', title: `Try advanced ${path.find((item) => item.id === strong?.topicId)?.name ?? 'questions'}`, reason: `Recommended because your recent accuracy is ${strong?.accuracy ?? 85}%.`, action: 'Practice', topicId: strong?.topicId ?? fallbackTopic?.id ?? '' }
}
