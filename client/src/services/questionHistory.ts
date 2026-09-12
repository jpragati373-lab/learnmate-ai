import type { LearningLevel, QuizQuestion } from '../types'

const storageKey = 'learnmate-question-history-v1'

type HistoryEntry = { ids: string[]; texts: string[] }
type History = Record<string, HistoryEntry>

function key(subject: string, topic: string, level: LearningLevel) {
  return `${subject.toLowerCase().trim()}:${topic.toLowerCase().trim()}:${level}`
}

function read(): History {
  if (typeof window === 'undefined') return {}
  try {
    const stored = window.localStorage.getItem(storageKey)
    const parsed = stored ? JSON.parse(stored) as History : {}
    if (!parsed || typeof parsed !== 'object') return {}
    return Object.fromEntries(Object.entries(parsed).map(([historyKey, value]) => [historyKey, Array.isArray(value) ? { ids: value, texts: [] } : value]))
  } catch {
    return {}
  }
}

function write(history: History) {
  if (typeof window !== 'undefined') window.localStorage.setItem(storageKey, JSON.stringify(history))
}

export function getUsedQuestionIds(subject: string, topic: string, level: LearningLevel) {
  return read()[key(subject, topic, level)]?.ids ?? []
}

export function getUsedQuestionTexts(subject: string, topic: string, level: LearningLevel) {
  return read()[key(subject, topic, level)]?.texts ?? []
}

export function recordQuestionIds(subject: string, topic: string, level: LearningLevel, questions: QuizQuestion[]) {
  const history = read()
  const historyKey = key(subject, topic, level)
  const previous = history[historyKey] ?? { ids: [], texts: [] }
  history[historyKey] = {
    ids: [...new Set([...previous.ids, ...questions.map((question) => question.id)])],
    texts: [...new Set([...previous.texts, ...questions.map((question) => question.question)])],
  }
  write(history)
}

export function resetQuestionHistory() {
  if (typeof window !== 'undefined') window.localStorage.removeItem(storageKey)
}
