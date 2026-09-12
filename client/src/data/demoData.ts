import type { LearningRecommendation, QuizAttempt, RevisionItem, Subject, Topic, TopicProgress, UserProfile } from '../types'

export const demoProfile: UserProfile = { id: 'profile-demo', name: 'Aarav', educationLevel: 'College student', learningGoal: 'Prepare for technical interviews', currentLevel: 'Intermediate', preferredStyle: 'Step-by-step', dailyStudyMinutes: 30 }
export const demoSubjects: Subject[] = [
  { id: 'python', name: 'Python', slug: 'python', description: 'Build confidence with Python fundamentals and problem solving.' },
  { id: 'sql', name: 'SQL', slug: 'sql', description: 'Query, model, and reason about relational data.' },
  { id: 'networks', name: 'Computer Networks', slug: 'computer-networks', description: 'Understand how data moves across the internet.' },
  { id: 'dsa', name: 'Data Structures', slug: 'data-structures', description: 'Practise the building blocks of efficient programs.' },
]
export const demoTopics: Topic[] = [
  { id: 'python-recursion', subjectId: 'python', name: 'Recursion', description: 'Solve problems by letting a function call a smaller version of itself.', difficulty: 'Intermediate', estimatedMinutes: 25 },
  { id: 'sql-joins', subjectId: 'sql', name: 'SQL JOINs', description: 'Combine related rows from multiple tables with confidence.', difficulty: 'Beginner', estimatedMinutes: 20 },
  { id: 'sql-subqueries', subjectId: 'sql', name: 'Subqueries', description: 'Use nested queries to answer multi-step data questions.', difficulty: 'Intermediate', estimatedMinutes: 30, prerequisiteTopicId: 'sql-joins' },
  { id: 'subnetting', subjectId: 'networks', name: 'Subnetting', description: 'Divide networks into smaller logical networks and calculate usable hosts.', difficulty: 'Beginner', estimatedMinutes: 25 },
  { id: 'tcp-udp', subjectId: 'networks', name: 'TCP vs UDP', description: 'Compare reliable delivery with low-latency datagrams.', difficulty: 'Intermediate', estimatedMinutes: 25 },
  { id: 'osi-model', subjectId: 'networks', name: 'OSI Model', description: 'Understand the seven layers used to reason about network communication.', difficulty: 'Beginner', estimatedMinutes: 25 },
  { id: 'dsa-arrays', subjectId: 'dsa', name: 'Arrays', description: 'Master indexed collections and their performance trade-offs.', difficulty: 'Beginner', estimatedMinutes: 20 },
]
export const demoProgress: TopicProgress[] = [
  { topicId: 'python-recursion', questionsAttempted: 12, correctAnswers: 5, accuracyPercentage: 42, status: 'Weak', lastPracticedAt: '2026-09-10' },
  { topicId: 'sql-joins', questionsAttempted: 20, correctAnswers: 18, accuracyPercentage: 90, status: 'Strong', lastPracticedAt: '2026-09-09' },
  { topicId: 'sql-subqueries', questionsAttempted: 10, correctAnswers: 7, accuracyPercentage: 70, status: 'Developing', lastPracticedAt: '2026-09-08' },
  { topicId: 'subnetting', questionsAttempted: 25, correctAnswers: 12, accuracyPercentage: 48, status: 'Weak', lastPracticedAt: '2026-09-11' },
  { topicId: 'tcp-udp', questionsAttempted: 11, correctAnswers: 10, accuracyPercentage: 91, status: 'Strong', lastPracticedAt: '2026-09-10' },
  { topicId: 'osi-model', questionsAttempted: 14, correctAnswers: 9, accuracyPercentage: 64, status: 'Developing', lastPracticedAt: '2026-09-09' },
  { topicId: 'dsa-arrays', questionsAttempted: 15, correctAnswers: 13, accuracyPercentage: 87, status: 'Strong', lastPracticedAt: '2026-09-06' },
]
export const demoAttempts: QuizAttempt[] = [
  { id: 'attempt-1', topicId: 'python-recursion', scorePercentage: 42, questionsAttempted: 12, correctAnswers: 5, completedAt: '2026-09-10' },
  { id: 'attempt-2', topicId: 'sql-joins', scorePercentage: 90, questionsAttempted: 10, correctAnswers: 9, completedAt: '2026-09-09' },
  { id: 'attempt-3', topicId: 'sql-subqueries', scorePercentage: 70, questionsAttempted: 10, correctAnswers: 7, completedAt: '2026-09-08' },
]
export const demoRevisions: RevisionItem[] = [
  { id: 'revision-1', topicId: 'subnetting', topicName: 'Subnetting', lastStudiedAt: '2026-09-09', nextReviewAt: '2026-09-11', reviewCount: 1, accuracy: 48, priority: 'high', status: 'due' },
  { id: 'revision-2', topicId: 'osi-model', topicName: 'OSI Model', lastStudiedAt: '2026-09-08', nextReviewAt: '2026-09-11', reviewCount: 1, accuracy: 58, priority: 'high', status: 'due' },
  { id: 'revision-3', topicId: 'sql-joins', topicName: 'SQL JOINs', lastStudiedAt: '2026-09-09', nextReviewAt: '2026-09-11', reviewCount: 2, accuracy: 67, priority: 'medium', status: 'due' },
  { id: 'revision-4', topicId: 'python-functions', topicName: 'Python Functions', lastStudiedAt: '2026-09-10', nextReviewAt: '2026-09-12', reviewCount: 1, accuracy: 78, priority: 'low', status: 'upcoming' },
  { id: 'revision-5', topicId: 'tcp-udp', topicName: 'TCP vs UDP', lastStudiedAt: '2026-09-08', nextReviewAt: '2026-09-14', reviewCount: 2, accuracy: 91, priority: 'low', status: 'upcoming' },
]
export const demoRecommendations: LearningRecommendation[] = [
  { id: 'recommendation-1', title: 'Practise recursion fundamentals', reason: 'Your recent accuracy is 42%. A simpler practice set will build confidence before you move on.', actionLabel: 'Start practice', topicId: 'python-recursion' },
  { id: 'recommendation-2', title: 'You are ready for subqueries', reason: 'Your SQL JOINs accuracy is 90%, so you have a strong prerequisite foundation.', actionLabel: 'Continue learning', topicId: 'sql-subqueries' },
]

export const dashboardPreview = {
  progress: 72,
  currentTopic: 'Computer Networks — Subnetting',
  topicsCompleted: 18,
  quizAccuracy: 82,
  studyStreak: 7,
  questionsPracticed: 146,
  weakTopics: [
    { name: 'Subnetting', accuracy: 48 },
    { name: 'OSI Model', accuracy: 64 },
  ],
  strongTopics: [
    { name: 'TCP/UDP', accuracy: 91 },
    { name: 'DNS', accuracy: 88 },
  ],
  recommendation: 'Review subnetting before starting CIDR.',
}

export const recentActivity = [
  { id: 'activity-1', title: 'Completed TCP vs UDP lesson', meta: 'Computer Networks · Today', score: '82%' },
  { id: 'activity-2', title: 'Practised SQL JOINs', meta: 'SQL · Yesterday', score: '90%' },
  { id: 'activity-3', title: 'Reviewed recursion basics', meta: 'Python · 2 days ago', score: '42%' },
]
