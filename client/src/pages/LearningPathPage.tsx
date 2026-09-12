import { ArrowRight, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ContinueLearningCard } from '../components/learning/ContinueLearningCard'
import { LearningPath } from '../components/learning/LearningPath'
import { SubjectSelector } from '../components/learning/SubjectSelector'
import { Card } from '../components/ui/Card'
import { ProgressBar } from '../components/ui/ProgressBar'
import { getDemoLearningPath, getDemoRecommendation, calculatePathProgress } from '../services/learningPathService'
import { pathSubjects } from '../data/learningPaths'

export function LearningPathPage() {
  const [params] = useSearchParams()
  const mode = params.get('mode') === 'demo' ? 'demo' : 'normal'
  const [subject, setSubject] = useState(pathSubjects[0])
  const path = useMemo(() => getDemoLearningPath(subject, mode), [subject, mode])
  const progress = calculatePathProgress(path.topics)
  const current = path.topics.find((item) => item.status === 'current') ?? path.topics[0]
  const recommendation = getDemoRecommendation(path.topics)
  return <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10"><header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700"><Sparkles className="h-4 w-4" />Personalized roadmap</p><h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950">Your Personalized Learning Path</h1><p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">Learn in the right order based on your goal, current level, and practice performance.</p></div><div className="w-full sm:w-56"><SubjectSelector value={subject} onChange={setSubject} /></div></header><section className="mt-8 grid gap-4 sm:grid-cols-3"><Card><p className="text-sm text-slate-500">Overall progress</p><p className="mt-1 text-3xl font-bold text-slate-950">{progress}%</p><ProgressBar value={progress} /></Card><Card><p className="text-sm text-slate-500">Topics</p><p className="mt-1 text-3xl font-bold text-slate-950">{path.topics.filter((item) => item.status === 'completed').length} <span className="text-base font-medium text-slate-400">completed</span></p><p className="mt-1 text-xs text-slate-500">{path.topics.filter((item) => item.status === 'current').length} in progress · {path.topics.filter((item) => item.status !== 'completed').length} remaining</p></Card><Card><p className="text-sm text-slate-500">Learning goal</p><p className="mt-2 font-semibold text-slate-900">{path.goal}</p><p className="mt-1 text-xs text-slate-500">Path adjusts as you practise.</p></Card></section><section className="mt-6 grid gap-6 lg:grid-cols-[.8fr_1.2fr]"><ContinueLearningCard topic={current} /><Card className="border-indigo-100 bg-indigo-50/50"><p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Why this is recommended</p><h2 className="mt-3 text-xl font-bold text-slate-950">{recommendation.title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{recommendation.reason}</p><Link to={`/practice?topic=${encodeURIComponent(current.name)}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700">{recommendation.action} now <ArrowRight className="h-4 w-4" /></Link></Card></section><section className="mt-10 max-w-3xl"><div className="mb-5"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600">{subject}</p><h2 className="mt-1 text-2xl font-bold text-slate-950">Your roadmap</h2><p className="mt-2 text-sm text-slate-500">Prerequisites unlock each next step so your progress stays grounded.</p></div><LearningPath topics={path.topics} /></section></div>
}
