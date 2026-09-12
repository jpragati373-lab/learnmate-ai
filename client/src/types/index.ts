export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'
export type ProgressStatus = 'Not started' | 'Weak' | 'Developing' | 'Strong'
export type LearningLevel = 'beginner' | 'intermediate' | 'advanced'
export type LearningStyle = 'simple' | 'step-by-step' | 'analogy' | 'example'

export interface UserProfile {
  id: string
  name: string
  educationLevel: string
  learningGoal: string
  currentLevel: Difficulty
  preferredStyle: 'Examples' | 'Visual' | 'Step-by-step' | 'Practice-first'
  dailyStudyMinutes: number
}

export interface Subject { id: string; name: string; slug: string; description: string }
export interface Topic { id: string; subjectId: string; name: string; description: string; difficulty: Difficulty; estimatedMinutes: number; prerequisiteTopicId?: string }
export interface QuizQuestion { id: string; subject: string; topic: string; question: string; options: string[]; difficulty: LearningLevel; concept: string; source: 'ai' | 'demo' }
export interface QuizAttempt { id: string; topicId: string; scorePercentage: number; questionsAttempted: number; correctAnswers: number; completedAt: string }
export interface TopicProgress { topicId: string; questionsAttempted: number; correctAnswers: number; accuracyPercentage: number; status: ProgressStatus; lastPracticedAt?: string }
export type RevisionStatus = 'due' | 'upcoming' | 'completed'
export type RevisionPriority = 'high' | 'medium' | 'low'
export interface RevisionItem {
  id: string
  topicId: string
  topicName: string
  lastStudiedAt: string
  nextReviewAt: string
  reviewCount: number
  accuracy: number
  priority: RevisionPriority
  status: RevisionStatus
}
export interface LearningRecommendation { id: string; title: string; reason: string; actionLabel: string; topicId?: string }
export type TopicStatus = 'completed' | 'current' | 'recommended' | 'locked' | 'not-started'
export interface LearningPathTopic { id: string; name: string; subject: string; description: string; difficulty: Difficulty; estimatedMinutes: number; prerequisites: string[]; status: TopicStatus; progress: number; accuracy: number }
export interface LearningPath { subject: string; goal: string; topics: LearningPathTopic[]; source: 'ai' | 'demo' }
export interface PathRecommendation { type: string; title: string; reason: string; action: string; topicId: string }
export interface AnalyticsOverview {
  overallProgress: number
  completedTopics: number
  totalTopics: number
  questionsAttempted: number
  correctAnswers: number
  incorrectAnswers: number
  accuracy: number
  averageQuizScore: number
  studyStreak: number
  longestStreak: number
  retentionScore: number
}
export interface AnalyticsSubject { subject: string; accuracy: number; questions: number }
export interface AnalyticsTopic { topicId: string; name: string; accuracy: number; classification: 'Strong' | 'Needs Practice' }
export interface AnalyticsTrend { date: string; score: number }
export interface AnalyticsActivity { date: string; sessions: number; questions: number; topics: number; revisions: number }
export interface AnalyticsInsight { id: string; text: string; evidence: string }
export type ChatRole = 'user' | 'assistant'
export interface ChatMessage { id: string; role: ChatRole; content: string; timestamp: string }
export interface AssistantContext { subject: string; topic: string; level: LearningLevel; learningStyle: LearningStyle; recentAccuracy: number }
