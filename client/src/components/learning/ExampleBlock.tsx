import { Code2 } from 'lucide-react'
import { Card } from '../ui/Card'
export function ExampleBlock({ example }: { example: string }) { return <Card><div className="flex items-center gap-2"><Code2 className="h-5 w-5 text-indigo-600" /><h2 className="text-xl font-bold text-slate-950">Example</h2></div><pre className="mt-4 max-h-96 overflow-x-auto whitespace-pre-wrap rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-200"><code>{example}</code></pre></Card> }
