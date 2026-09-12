import { ArrowUpRight, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Topic } from '../../types'
import { Card } from '../ui/Card'

export function TopicCard({ topic, progress }: { topic: Topic; progress: number }) {
  return <Card className="group transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"><div className="flex items-start justify-between gap-3"><div><span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">{topic.difficulty}</span><h3 className="mt-4 font-semibold text-slate-900">{topic.name}</h3></div><ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-indigo-600" /></div><p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-500">{topic.description}</p><div className="mt-5"><div className="mb-2 flex justify-between text-xs text-slate-500"><span>Progress</span><span>{progress}%</span></div><div className="h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full bg-indigo-600" style={{ width: `${progress}%` }} /></div></div><Link to="/learn" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">Continue <Clock3 className="h-3.5 w-3.5" /></Link></Card>
}
