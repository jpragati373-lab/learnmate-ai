import { z } from 'zod'
import { topicStrength } from './quizRules.js'

const attempts = [
  { topicId: 'python-recursion', score: 42, questions: 12, correct: 5, date: '2026-09-10' },
  { topicId: 'sql-joins', score: 90, questions: 20, correct: 18, date: '2026-09-09' },
  { topicId: 'sql-subqueries', score: 70, questions: 10, correct: 7, date: '2026-09-08' },
]
const progress = [
  { topicId: 'python-recursion', name: 'Recursion', subject: 'Python', accuracy: 42, questions: 12, date: '2026-09-10', status: 'Weak' },
  { topicId: 'sql-joins', name: 'SQL JOINs', subject: 'SQL', accuracy: 90, questions: 20, date: '2026-09-09', status: 'Strong' },
  { topicId: 'sql-subqueries', name: 'Subqueries', subject: 'SQL', accuracy: 70, questions: 10, date: '2026-09-08', status: 'Developing' },
  { topicId: 'networks-tcp', name: 'TCP', subject: 'Computer Networks', accuracy: 75, questions: 8, date: '2026-09-07', status: 'Developing' },
  { topicId: 'dsa-arrays', name: 'Arrays', subject: 'Data Structures', accuracy: 87, questions: 15, date: '2026-09-06', status: 'Strong' },
]
const revisions = [
  { topic: 'Subnetting', accuracy: 48, status: 'due' }, { topic: 'OSI Model', accuracy: 58, status: 'due' },
  { topic: 'SQL JOINs', accuracy: 67, status: 'due' }, { topic: 'Python Functions', accuracy: 78, status: 'upcoming' },
]
const number = (value: number) => Math.round(value)
export const analyticsQuerySchema = z.object({}).passthrough()
export function calculateOverallProgress() { const completed = progress.filter((item) => item.status === 'Strong').length; return { completedTopics: completed, totalTopics: progress.length, percentage: progress.length ? number(completed / progress.length * 100) : 0 } }
export function calculateQuizAccuracy() { const total = attempts.reduce((sum, item) => sum + item.questions, 0); const correct = attempts.reduce((sum, item) => sum + item.correct, 0); return { questionsAttempted: total, correctAnswers: correct, incorrectAnswers: total - correct, accuracy: total ? number(correct / total * 100) : 0, averageQuizScore: attempts.length ? number(attempts.reduce((sum, item) => sum + item.score, 0) / attempts.length) : 0 } }
export function calculateSubjectPerformance() { return [...new Set(progress.map((item) => item.subject))].map((subject) => { const rows = progress.filter((item) => item.subject === subject); const total = rows.reduce((sum, item) => sum + item.questions, 0); return { subject, accuracy: total ? number(rows.reduce((sum, item) => sum + item.accuracy * item.questions, 0) / total) : 0, questions: total } }) }
export function calculateTopicPerformance() { return progress.map((item) => ({ topicId: item.topicId, name: item.name, accuracy: item.accuracy, classification: topicStrength(item.accuracy) === 'strong' ? 'Strong' : 'Needs Practice' })) }
export function calculateLearningTrend() { return attempts.slice().sort((a, b) => a.date.localeCompare(b.date)).map((item) => ({ date: item.date.slice(5), score: item.score })) }
export function calculateStudyStreak() { const dates = progress.map((item) => item.date).sort().reverse(); if (!dates.length) return { current: 0, longest: 0 }; let current = 1; for (let index = 1; index < dates.length; index += 1) { if ((new Date(dates[index - 1]).getTime() - new Date(dates[index]).getTime()) / 86_400_000 !== 1) break; current += 1 } return { current, longest: current } }
export function calculateRetentionScore() { const accuracy = calculateQuizAccuracy().accuracy; const revisionCompletion = 0; const recency = progress.length ? 100 : 0; return number(accuracy * 0.6 + revisionCompletion * 0.2 + recency * 0.2) }
export function calculateActivity() { return progress.map((item) => ({ date: item.date.slice(5), sessions: 1, questions: item.questions, topics: 1, revisions: revisions.filter((revision) => revision.topic === item.name && revision.status === 'due').length })) }
export function generateLearningInsights() { const topics = calculateTopicPerformance(); const weakest = [...topics].sort((a, b) => a.accuracy - b.accuracy)[0]; const strongest = [...topics].sort((a, b) => b.accuracy - a.accuracy)[0]; const trend = calculateLearningTrend(); const result = []; if (weakest) result.push({ id: 'weakest', text: `${weakest.name} is currently your weakest topic at ${weakest.accuracy}%.`, evidence: 'Recorded topic accuracy' }); if (strongest) result.push({ id: 'strongest', text: `${strongest.name} is a strong foundation at ${strongest.accuracy}%.`, evidence: 'Recorded topic accuracy' }); if (trend.length > 1) result.push({ id: 'trend', text: trend[trend.length - 1].score >= trend[0].score ? `Your quiz accuracy improved from ${trend[0].score}% to ${trend[trend.length - 1].score}%.` : 'Your recent quiz accuracy needs attention.', evidence: 'Recent quiz attempts' }); const due = revisions.filter((item) => item.status === 'due').length; if (due) result.push({ id: 'revision', text: `You have ${due} revisions due today.`, evidence: 'Current revision queue' }); return result }
export function getOverview() { return { ...calculateOverallProgress(), ...calculateQuizAccuracy(), ...calculateStudyStreak(), retentionScore: calculateRetentionScore() } }
