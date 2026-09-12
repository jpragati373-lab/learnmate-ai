import { ListChecks } from 'lucide-react'
import { Card } from '../ui/Card'
export function SummaryCard({ summary }: { summary: string[] }) { return <Card className="border-indigo-100 bg-indigo-50/50"><div className="flex items-center gap-2"><ListChecks className="h-5 w-5 text-indigo-600" /><h2 className="text-xl font-bold text-slate-950">Quick Summary</h2></div><ul className="mt-4 space-y-2">{summary.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />{item}</li>)}</ul></Card> }
