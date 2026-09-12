export function LoadingSkeleton() {
  return <div className="space-y-5" role="status" aria-live="polite"><div className="h-8 w-2/3 animate-pulse rounded-lg bg-slate-200" /><div className="h-4 w-full animate-pulse rounded bg-slate-100" /><div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" /><div className="grid gap-4 sm:grid-cols-2"><div className="h-28 animate-pulse rounded-2xl bg-slate-100" /><div className="h-28 animate-pulse rounded-2xl bg-slate-100" /></div><p className="text-sm font-medium text-indigo-600">LearnMate is preparing your explanation...</p></div>
}
