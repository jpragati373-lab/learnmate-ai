import { CalendarClock, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '../ui/Card'

export function RevisionCard({ topicName, nextReviewAt, priority, accuracy }: { topicName: string; nextReviewAt: string; priority: string; accuracy: number }) {
  return <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"><span className="rounded-xl bg-slate-100 p-2 text-slate-500"><CalendarClock className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{topicName}</p><p className="mt-1 text-xs text-slate-500">{accuracy}% accuracy · {nextReviewAt}</p></div><span className={`rounded-full px-2 py-1 text-xs font-semibold ${priority === 'high' ? 'bg-red-50 text-red-700' : priority === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{priority}</span></div>
}

export function RevisionList({ items }: { items: { topicName: string; nextReviewAt: string; priority: string; accuracy: number }[] }) {
  return <Card><div className="flex items-center justify-between"><h2 className="font-semibold text-slate-900">Revision due</h2><Link to="/revision" className="inline-flex items-center text-sm font-semibold text-indigo-600">View all <ChevronRight className="h-4 w-4" /></Link></div><div className="mt-4 space-y-3">{items.map((item) => <RevisionCard key={item.topicName} {...item} />)}</div></Card>
}
