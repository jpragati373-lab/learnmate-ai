import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '../ui/Card'

export function RecommendationCard({ title, reason, actionLabel, to = '/learn', assistantTo }: { title: string; reason: string; actionLabel: string; to?: string; assistantTo?: string }) {
  return <Card className="border-indigo-100 bg-indigo-50/55"><div className="flex items-start gap-3"><span className="rounded-xl bg-indigo-600 p-2 text-white"><Sparkles className="h-4 w-4" /></span><div><p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Recommended next</p><h3 className="mt-2 font-semibold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{reason}</p><div className="flex flex-wrap gap-3"><Link to={to} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-800">{actionLabel}<ArrowRight className="h-4 w-4" /></Link>{assistantTo && <Link to={assistantTo} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-800">Learn with AI</Link>}</div></div></div></Card>
}
