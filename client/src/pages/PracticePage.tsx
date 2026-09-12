import { AlertCircle, BrainCircuit, ChevronRight, Sparkles } from 'lucide-react'
import { useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AnswerFeedback } from '../components/quiz/AnswerFeedback'
import { QuestionCard } from '../components/quiz/QuestionCard'
import { QuizProgress } from '../components/quiz/QuizProgress'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { LoadingSkeleton } from '../components/learning/LoadingSkeleton'
import { checkAnswer, generateQuiz, type QuizAnswerResult } from '../services/quizService'
import { saveQuizSession } from '../services/quizSession'
import { getUsedQuestionIds, getUsedQuestionTexts, recordQuestionIds } from '../services/questionHistory'
import type { LearningLevel, QuizQuestion } from '../types'

const topics = ['Subnetting', 'TCP vs UDP', 'SQL JOINs', 'Python Lists', 'Recursion', 'OSI Model']
const subjects = ['Computer Networks', 'SQL', 'Python', 'Data Structures']
const levelLabels: Record<LearningLevel, string> = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }

export function PracticePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [topic, setTopic] = useState(searchParams.get('topic') ?? 'Subnetting')
  const [subject, setSubject] = useState('Computer Networks')
  const [level, setLevel] = useState<LearningLevel>((searchParams.get('difficulty') as LearningLevel) || 'beginner')
  const [count, setCount] = useState<5 | 10>(5)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState('')
  const [answerResult, setAnswerResult] = useState<QuizAnswerResult | null>(null)
  const answersRef = useRef<{ questionId: string; selectedAnswer: string; result: QuizAnswerResult }[]>([])
  const [difficultyPath, setDifficultyPath] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function startPractice() {
    setError('')
    setLoading(true)
    try {
      const usedQuestionIds = getUsedQuestionIds(subject, topic, level)
      const usedQuestionTexts = getUsedQuestionTexts(subject, topic, level)
      const result = await generateQuiz({ subject, topic, level, count, usedQuestionIds, usedQuestionTexts })
      recordQuestionIds(subject, topic, level, result.questions)
      setQuestions(result.questions)
      setDifficultyPath([level])
      answersRef.current = []
      setCurrent(0)
      setSelected('')
      setAnswerResult(null)
    } catch (caughtError) {
      setError(caughtError instanceof Error && caughtError.message !== 'Quiz generation failed' ? caughtError.message : 'Practice service is temporarily unavailable. Please try again or choose another topic.')
    } finally {
      setLoading(false)
    }
  }

  async function submitAnswer() {
    const question = questions[current]
    if (!question || !selected || answerResult) return
    try {
      const result = await checkAnswer(question.id, selected)
      setAnswerResult(result)
      const nextAnswers = [...answersRef.current, { questionId: question.id, selectedAnswer: selected, result }]
      answersRef.current = nextAnswers
      const recent = nextAnswers.map((item) => item.result.correct).slice(-3)
      const recentAccuracy = recent.filter(Boolean).length / recent.length * 100
      const currentIndex = ['beginner', 'intermediate', 'advanced'].indexOf(level)
      const nextIndex = recent.length >= 2 && recentAccuracy >= 80 ? Math.min(2, currentIndex + 1) : recent.length >= 2 && recentAccuracy < 50 ? Math.max(0, currentIndex - 1) : currentIndex
      const nextLevel = ['beginner', 'intermediate', 'advanced'][nextIndex]
      if (nextLevel !== level) {
        setLevel(nextLevel as LearningLevel)
        setDifficultyPath((path) => [...path, nextLevel])
      }
    } catch {
      setError("We couldn't check this answer. Please try again.")
    }
  }

  function nextQuestion() {
    if (current >= questions.length - 1) {
      saveQuizSession({ topic, level, questions, answers: answersRef.current, difficultyPath })
      navigate('/practice/results')
      return
    }
    setCurrent((value) => value + 1)
    setSelected('')
    setAnswerResult(null)
  }

  if (loading) return <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8"><Card><LoadingSkeleton /></Card></div>

  if (questions.length > 0) {
    const question = questions[current]
    return <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 lg:py-12"><div className="mb-8"><QuizProgress current={current + 1} total={questions.length} /></div><Card><QuestionCard question={{ ...question, difficulty: level }} selected={selected} disabled={Boolean(answerResult)} onSelect={setSelected} />{error && <div className="mt-5 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert"><AlertCircle className="h-4 w-4" />{error}</div>}{answerResult && <div className="mt-6"><AnswerFeedback result={answerResult} topic={topic} />{difficultyPath.length > 1 && <p className="mt-4 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700">Your next question has been adjusted based on your recent performance.</p>}</div>}<div className="mt-6 flex justify-end">{answerResult ? <Button onClick={nextQuestion}>{current === questions.length - 1 ? 'See Results' : 'Next Question'} <ChevronRight className="ml-1 inline h-4 w-4" /></Button> : <Button disabled={!selected} onClick={() => void submitAnswer()}>Submit Answer</Button>}</div></Card></div>
  }

  return <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-12"><div className="max-w-2xl"><p className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700"><Sparkles className="h-4 w-4" />Practice with purpose</p><h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950">Practice what you learned</h1><p className="mt-3 text-lg leading-8 text-slate-600">Test your understanding with questions adapted to your current level.</p></div><Card className="mt-10 max-w-2xl"><div className="mb-6 flex items-center gap-3"><span className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600"><BrainCircuit className="h-5 w-5" /></span><div><h2 className="font-semibold text-slate-900">Set up your practice session</h2><p className="text-sm text-slate-500">You can change this before every session.</p></div></div><div className="space-y-6"><label className="block text-sm font-semibold text-slate-800">Subject<select value={subject} onChange={(event) => setSubject(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">{subjects.map((item) => <option key={item}>{item}</option>)}</select></label><label className="block text-sm font-semibold text-slate-800">Topic<select value={topic} onChange={(event) => setTopic(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">{topics.map((item) => <option key={item}>{item}</option>)}</select></label><fieldset><legend className="text-sm font-semibold text-slate-800">Difficulty</legend><div className="mt-2 grid grid-cols-3 gap-2">{(['beginner', 'intermediate', 'advanced'] as LearningLevel[]).map((item) => <label key={item} className={`cursor-pointer rounded-xl border p-3 text-center transition ${level === item ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}><input type="radio" name="difficulty" className="sr-only" checked={level === item} onChange={() => setLevel(item)} /><span className="text-sm font-semibold">{levelLabels[item]}</span></label>)}</div></fieldset><fieldset><legend className="text-sm font-semibold text-slate-800">Number of questions</legend><div className="mt-2 flex gap-2">{([5, 10] as const).map((item) => <label key={item} className={`cursor-pointer rounded-xl border px-5 py-3 text-sm font-semibold transition ${count === item ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}><input type="radio" name="count" className="sr-only" checked={count === item} onChange={() => setCount(item)} />{item} questions</label>)}</div></fieldset>{error && <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert"><AlertCircle className="h-4 w-4" />{error}<button type="button" className="ml-auto font-semibold underline" onClick={() => void startPractice()}>Try Again</button></div>}<Button className="w-full justify-center py-3" onClick={() => void startPractice()}>Start Practice <ChevronRight className="ml-1 inline h-4 w-4" /></Button></div></Card></div>
}
