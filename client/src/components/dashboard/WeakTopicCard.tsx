import { AlertTriangle } from 'lucide-react'
import { Card } from '../ui/Card'

export function WeakTopicCard({ name, accuracy }: { name: string; accuracy: number }) {
  return <Card className="flex items-center justify-between gap-4 border-red-100 bg-red-50/60"><div className="flex items-center gap-3"><span className="rounded-xl bg-white p-2 text-red-500 shadow-sm"><AlertTriangle className="h-4 w-4" /></span><div><p className="font-semibold text-slate-900">{name}</p><p className="mt-1 text-xs text-slate-500">Needs targeted practice</p></div></div><span className="text-lg font-bold text-red-600">{accuracy}%</span></Card>
}
