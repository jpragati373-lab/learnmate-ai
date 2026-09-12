export type QuizDifficulty = 'beginner' | 'intermediate' | 'advanced'

export function calculateScore(correct: number, total: number) {
  if (total <= 0) return 0
  return Math.round((correct / total) * 100)
}

export function topicStrength(accuracy: number) {
  if (accuracy < 60) return 'weak'
  if (accuracy >= 80) return 'strong'
  return 'developing'
}

export function adjustDifficulty(current: QuizDifficulty, recentCorrect: boolean[]) {
  if (recentCorrect.length < 2) return current
  const accuracy = recentCorrect.filter(Boolean).length / recentCorrect.length * 100
  const levels: QuizDifficulty[] = ['beginner', 'intermediate', 'advanced']
  const index = levels.indexOf(current)
  if (accuracy >= 80) return levels[Math.min(index + 1, levels.length - 1)]
  if (accuracy < 50) return levels[Math.max(index - 1, 0)]
  return current
}

export function hasDuplicateQuestions(questions: { question: string }[]) {
  return new Set(questions.map((item) => item.question.trim().toLowerCase())).size !== questions.length
}
