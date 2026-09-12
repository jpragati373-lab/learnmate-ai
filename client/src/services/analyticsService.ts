import { demoTopics } from '../data/demoData'
import type { AnalyticsActivity, AnalyticsInsight, AnalyticsOverview, AnalyticsSubject, AnalyticsTopic, AnalyticsTrend } from '../types'
import { getLearningState, type LearningMode } from './learningState'

export function calculateAnalyticsOverview(mode: LearningMode = 'normal'): AnalyticsOverview {
  const state = getLearningState(mode)
  const attempted = state.attempts.reduce((sum, item) => sum + item.questionsAttempted, 0)
  const correct = state.attempts.reduce((sum, item) => sum + item.correctAnswers, 0)
  const completed = state.progress.filter((item) => item.status === 'Strong').length
  const dates = getActivityDates(mode)
  return { overallProgress: demoTopics.length ? Math.round((completed / demoTopics.length) * 100) : 0, completedTopics: completed, totalTopics: demoTopics.length, questionsAttempted: attempted, correctAnswers: correct, incorrectAnswers: attempted - correct, accuracy: attempted ? Math.round(correct / attempted * 100) : 0, averageQuizScore: state.attempts.length ? Math.round(state.attempts.reduce((sum, item) => sum + item.scorePercentage, 0) / state.attempts.length) : 0, studyStreak: calculateStreak(dates), longestStreak: calculateStreak(dates), retentionScore: attempted ? Math.round(correct / attempted * 100) : 0 }
}

export function calculateSubjectPerformance(mode: LearningMode = 'normal'): AnalyticsSubject[] {
  const state = getLearningState(mode)
  return [...new Set(demoTopics.map((topic) => topic.subjectId))].map((subjectId) => {
    const rows = state.progress.filter((item) => demoTopics.find((topic) => topic.id === item.topicId)?.subjectId === subjectId)
    const questions = rows.reduce((sum, item) => sum + item.questionsAttempted, 0)
    return { subject: subjectId === 'networks' ? 'Computer Networks' : subjectId === 'dsa' ? 'Data Structures' : subjectId === 'sql' ? 'SQL' : 'Python', questions, accuracy: questions ? Math.round(rows.reduce((sum, item) => sum + item.correctAnswers, 0) / questions * 100) : 0 }
  })
}

export function calculateTopicPerformance(mode: LearningMode = 'normal'): AnalyticsTopic[] {
  return getLearningState(mode).progress.filter((item) => item.questionsAttempted > 0).map((item) => ({ topicId: item.topicId, name: demoTopics.find((topic) => topic.id === item.topicId)?.name ?? item.topicId, accuracy: item.accuracyPercentage, classification: item.accuracyPercentage >= 80 ? 'Strong' : 'Needs Practice' }))
}

export function calculateLearningTrend(mode: LearningMode = 'normal'): AnalyticsTrend[] {
  return getLearningState(mode).attempts.slice().sort((a, b) => a.completedAt.localeCompare(b.completedAt)).map((item) => ({ date: item.completedAt.slice(5), score: item.scorePercentage }))
}

export function getActivityDates(mode: LearningMode = 'normal') { return getLearningState(mode).progress.map((item) => item.lastPracticedAt).filter((date): date is string => Boolean(date)).sort() }

export function calculateStreak(dates: string[]) {
  if (!dates.length) return 0
  const unique = [...new Set(dates)].sort().reverse()
  let streak = 1
  for (let index = 1; index < unique.length; index += 1) {
    if ((new Date(unique[index - 1]).getTime() - new Date(unique[index]).getTime()) / 86_400_000 !== 1) break
    streak += 1
  }
  return streak
}

export function calculateActivity(mode: LearningMode = 'normal'): AnalyticsActivity[] {
  const state = getLearningState(mode)
  return [...new Set(getActivityDates(mode))].sort().map((date) => ({ date: date.slice(5), sessions: 1, questions: state.progress.filter((item) => item.lastPracticedAt === date).reduce((sum, item) => sum + item.questionsAttempted, 0), topics: state.progress.filter((item) => item.lastPracticedAt === date).length, revisions: state.revisions.filter((item) => item.lastStudiedAt === date).length }))
}

export function generateInsights(mode: LearningMode = 'normal'): AnalyticsInsight[] {
  const topics = calculateTopicPerformance(mode)
  const trend = calculateLearningTrend(mode)
  const state = getLearningState(mode)
  if (!topics.length && !trend.length) return [{ id: 'start', text: 'Start learning to generate personalized insights.', evidence: 'Insights appear after you complete learning activity.' }]
  const weakest = [...topics].sort((a, b) => a.accuracy - b.accuracy)[0]
  const strongest = [...topics].sort((a, b) => b.accuracy - a.accuracy)[0]
  const insights: AnalyticsInsight[] = []
  if (weakest && weakest.accuracy < 60) insights.push({ id: 'weakest', text: `${weakest.name} needs more practice at ${weakest.accuracy}%.`, evidence: 'Based on recorded topic accuracy.' })
  if (strongest && strongest.accuracy >= 80) insights.push({ id: 'strongest', text: `${strongest.name} is a strong foundation at ${strongest.accuracy}%.`, evidence: 'Based on recorded topic accuracy.' })
  if (trend.length > 1) insights.push({ id: 'trend', text: trend.at(-1)!.score >= trend[0].score ? `Your quiz accuracy improved from ${trend[0].score}% to ${trend.at(-1)!.score}%.` : 'Your recent quiz accuracy needs attention.', evidence: 'Compared with recorded attempts.' })
  if (state.revisions.some((item) => item.status === 'due')) insights.push({ id: 'revision', text: 'You have revisions due today.', evidence: 'Based on your revision queue.' })
  return insights.slice(0, 4)
}
