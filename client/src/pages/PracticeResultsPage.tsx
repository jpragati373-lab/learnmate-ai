import { Navigate, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { QuizResult } from '../components/quiz/QuizResult'
import { lastQuizSession } from '../services/quizSession'
import { recordQuizResult } from '../services/learningState'

export function PracticeResultsPage() {
  const navigate = useNavigate()
  useEffect(() => {
    if (!lastQuizSession || lastQuizSession.recorded) return
    const correct = lastQuizSession.answers.filter((answer) => answer.result.correct).length
    recordQuizResult(lastQuizSession.topic, lastQuizSession.questions.length, correct)
    lastQuizSession.recorded = true
  }, [])
  if (!lastQuizSession) return <Navigate to="/practice" replace />
  const { answers, questions, topic, difficultyPath } = lastQuizSession
  const correct = answers.filter((answer) => answer.result.correct).length
  const score = questions.length ? Math.round((correct / questions.length) * 100) : 0
  const assistantUrl = `/assistant?subject=Computer%20Networks&topic=${encodeURIComponent(topic)}&level=${score < 60 ? 'beginner' : score >= 80 ? 'advanced' : 'intermediate'}&accuracy=${score}&misconception=${encodeURIComponent(score < 60 ? 'Needs prerequisite practice' : 'Review missed questions')}`
  return <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 lg:py-12"><QuizResult score={score} correct={correct} total={questions.length} difficultyPath={difficultyPath} topic={topic} onPracticeAgain={() => navigate(`/practice?topic=${encodeURIComponent(topic)}&difficulty=${score < 60 ? 'beginner' : score >= 80 ? 'advanced' : 'intermediate'}`)} /><div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => navigate(`/learn?topic=${encodeURIComponent(topic)}`)} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-indigo-200 hover:text-indigo-700">Review topic</button>{score < 80 && <a href={assistantUrl} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Ask LearnMate AI</a>}<a href="/revision" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-indigo-200 hover:text-indigo-700">View revision</a></div></div>
}
