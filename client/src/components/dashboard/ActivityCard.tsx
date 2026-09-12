import { CheckCircle2 } from 'lucide-react'
import { Card } from '../ui/Card'

export function ActivityCard({ title, meta, score }: { title: string; meta: string; score: string }) {
  return <div className="flex items-center gap-3 rounded-xl px-2 py-3"><span className="rounded-full bg-emerald-50 p-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{title}</p><p className="mt-1 text-xs text-slate-500">{meta}</p></div><span className="text-sm font-semibold text-slate-700">{score}</span></div>
}

export function ActivityList({ items }: { items: { id?: string; title: string; meta: string; score: string }[] }) {
  return <Card><h2 className="font-semibold text-slate-900">Recent activity</h2><div className="mt-3 divide-y divide-slate-100">{items.map((item, index) => <ActivityCard key={`${item.id ?? item.title}-${index}`} {...item} />)}</div></Card>
}
