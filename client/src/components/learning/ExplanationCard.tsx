import { Lightbulb } from 'lucide-react'
import type { LearningExplanation } from '../../services/aiService'
import { Card } from '../ui/Card'

export function ExplanationCard({ content }: { content: LearningExplanation }) {
  return <Card><div className="flex items-start gap-3"><span className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600"><Lightbulb className="h-5 w-5" /></span><div><h2 className="text-xl font-bold text-slate-950">Simple Explanation</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{content.explanation}</p></div></div></Card>
}
