export function QuizProgress({ current, total }: { current: number; total: number }) {
  const value = (current / total) * 100
  return <div><div className="flex justify-between text-xs font-semibold text-slate-500"><span>Question {current} of {total}</span><span>{Math.round(value)}% complete</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-indigo-600 transition-all" style={{ width: `${value}%` }} /></div></div>
}
