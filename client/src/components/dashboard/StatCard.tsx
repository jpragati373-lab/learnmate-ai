import type { LucideIcon } from 'lucide-react'
import { Card } from '../ui/Card'

export function StatCard({ label, value, detail, icon: Icon, accent = 'indigo' }: { label: string; value: string; detail: string; icon: LucideIcon; accent?: 'indigo' | 'emerald' | 'amber' | 'rose' }) {
  const accents = { indigo: 'bg-indigo-50 text-indigo-600', emerald: 'bg-emerald-50 text-emerald-600', amber: 'bg-amber-50 text-amber-600', rose: 'bg-rose-50 text-rose-600' }
  return <Card className="relative overflow-hidden"><div className={`inline-flex rounded-xl p-2.5 ${accents[accent]}`}><Icon className="h-5 w-5" /></div><p className="mt-5 text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></Card>
}
