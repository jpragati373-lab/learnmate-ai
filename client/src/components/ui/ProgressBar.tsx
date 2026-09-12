export function ProgressBar({ value, tone = 'indigo', label }: { value: number; tone?: 'indigo' | 'red' | 'emerald' | 'amber'; label?: string }) {
  const tones = { indigo: 'bg-indigo-600', red: 'bg-red-400', emerald: 'bg-emerald-500', amber: 'bg-amber-400' }
  return (
    <div>
      {label && <div className="mb-2 flex justify-between text-xs text-slate-500"><span>{label}</span><span>{value}%</span></div>}
      <div className="h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label ?? 'Progress'}>
        <div className={`h-full rounded-full ${tones[tone]}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  )
}
