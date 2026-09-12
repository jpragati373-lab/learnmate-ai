import { AlertTriangle } from 'lucide-react'
import { Card } from '../ui/Card'
export function MistakesCard({ mistakes }: { mistakes: string[] }) { return <Card><div className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" /><h2 className="text-xl font-bold text-slate-950">Common Mistakes</h2></div><ul className="mt-4 space-y-3">{mistakes.map((mistake) => <li key={mistake} className="flex gap-3 text-sm leading-6 text-slate-600"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />{mistake}</li>)}</ul></Card> }
