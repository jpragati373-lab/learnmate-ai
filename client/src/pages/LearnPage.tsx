import { AlertCircle, ArrowRight, BookOpen, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LearningLevelSelector } from '../components/learning/LearningLevelSelector'
import { LearningStyleSelector } from '../components/learning/LearningStyleSelector'
import { LoadingSkeleton } from '../components/learning/LoadingSkeleton'
import { TopicInput } from '../components/learning/TopicInput'
import { explainTopic, validateQuickCheck, type LearningExplanation } from '../services/aiService'
import type { LearningLevel, LearningStyle } from '../types'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

const levelLabels: Record<LearningLevel, string> = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }

export function LearnPage() {
  const [topic, setTopic] = useState('')
  const [level, setLevel] = useState<LearningLevel>('beginner')
  const [learningStyle, setLearningStyle] = useState<LearningStyle>('simple')
  const [content, setContent] = useState<LearningExplanation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function generate(instruction?: string, requestedTopic?: string) {
    const trimmedTopic = (requestedTopic ?? topic).trim()
    if (trimmedTopic.length < 2) {
      setError('Enter a topic with at least two characters.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const result = await explainTopic({ topic: trimmedTopic, level, learningStyle, instruction })
      setTopic(trimmedTopic)
      setContent(result)
    } catch {
      setError("AI service is temporarily unavailable. Demo mode may be available; please try again.")
    } finally {
      setLoading(false)
    }
  }

  return <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
    <section className="grid gap-8 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
      <div className="lg:sticky lg:top-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700"><Sparkles className="h-4 w-4" />Learn with clarity</p>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">What do you want to learn today?</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">Enter any concept and LearnMate AI will explain it at the level that&apos;s right for you.</p>
        <Card className="mt-8"><form onSubmit={(event) => { event.preventDefault(); void generate() }} className="space-y-6"><TopicInput value={topic} onChange={setTopic} /><LearningLevelSelector value={level} onChange={setLevel} /><LearningStyleSelector value={learningStyle} onChange={setLearningStyle} />{error && <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700" role="alert"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}<Button type="submit" disabled={loading} className="w-full justify-center py-3">{loading ? 'Preparing explanation...' : 'Explain with AI'} <ArrowRight className="ml-2 inline h-4 w-4" /></Button></form></Card>
        <p className="mt-4 text-xs leading-5 text-slate-500">AI-generated learning content may contain mistakes. Verify important academic information with trusted sources.</p>
      </div>
      <div aria-live="polite">{loading ? <Card><LoadingSkeleton /></Card> : content ? <ExplanationResult content={content} onAction={generate} onTopicChange={(next) => void generate(undefined, next)} /> : <EmptyLearningState />}</div>
    </section>
  </div>
}

function EmptyLearningState() {
  return <Card className="flex min-h-[32rem] flex-col items-center justify-center border-dashed bg-white/70 p-8 text-center"><span className="rounded-2xl bg-indigo-50 p-4 text-indigo-600"><BookOpen className="h-8 w-8" /></span><h2 className="mt-6 text-xl font-bold text-slate-900">Your explanation will appear here</h2><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">Choose a topic, set your learning preferences, and we&apos;ll turn it into a focused learning session.</p></Card>
}

function ExplanationResult({ content, onAction, onTopicChange }: { content: LearningExplanation; onAction: (instruction?: string) => void; onTopicChange: (topic: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [checkResult, setCheckResult] = useState<{ correct: boolean; explanation: string } | null>(null)
  const assistantUrl = `/assistant?subject=${encodeURIComponent('Computer Networks')}&topic=${encodeURIComponent(content.topic)}&level=${content.level}&learningStyle=simple&accuracy=48`
  const navigate = (next: string) => { setSelected(null); setCheckResult(null); onTopicChange(next) }
  return <article className="space-y-5"><header><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">{content.source === 'demo' ? 'Demo fallback content' : 'AI-generated'}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{levelLabels[content.level]}</span></div><h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">{content.topic}</h2><p className="mt-2 text-sm text-slate-500">{content.definition}</p></header><Card><h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700">Quick Learn</h3><p className="mt-3 text-base leading-7 text-slate-700">{content.quickExplanation}</p><div className="mt-5 flex flex-wrap gap-2"><Button variant="secondary" onClick={() => setExpanded(!expanded)}>{expanded ? 'Hide deeper explanation' : 'Explain More'}</Button><Button variant="secondary" onClick={() => onAction('Give another practical example.')}>Another Example</Button><Button variant="secondary" onClick={() => onAction('Use a real-world analogy.')}>Use Analogy</Button><Link to="/practice" className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white">Quiz Me <ArrowRight className="ml-1 h-4 w-4" /></Link><Button variant="secondary" onClick={() => onAction('Summarize this briefly.')}>Summarize</Button></div>{expanded && <p className="mt-5 border-t border-slate-100 pt-5 text-sm leading-7 text-slate-600">{content.optionalDeeperExplanation}</p>}</Card><div className="grid gap-5 sm:grid-cols-2"><Card><h3 className="font-bold text-slate-900">Real-world example</h3><p className="mt-3 text-sm leading-7 text-slate-600">{content.simpleExample}</p></Card><Card><h3 className="font-bold text-slate-900">Why it matters</h3><p className="mt-3 text-sm leading-7 text-slate-600">{content.whyItMatters}</p></Card></div><Card><h3 className="font-bold text-slate-900">Key points</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">{content.keyPoints.map((point) => <li key={point}>{point}</li>)}</ul><p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-900">Remember: {content.rememberThis}</p><p className="mt-4 text-sm font-semibold text-slate-900">Common mistakes</p><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">{content.commonMistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}</ul></Card><Card><h3 className="font-bold text-slate-900">Quick check</h3><p className="mt-3 text-sm font-semibold text-slate-700">{content.quickCheck.question}</p><div className="mt-3 grid gap-2">{content.quickCheck.options.map((option, index) => <button type="button" key={option} disabled={checkResult !== null} onClick={() => { setSelected(index); void validateQuickCheck(content.topic, index).then(setCheckResult) }} className={`rounded-xl border p-3 text-left text-sm ${selected === index ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}`}>{String.fromCharCode(65 + index)}. {option}</button>)}</div>{checkResult && <p className={`mt-4 rounded-xl p-3 text-sm ${checkResult.correct ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'}`}>{checkResult.correct ? 'Correct. ' : 'Not quite. '}{checkResult.explanation}</p>}</Card><Card><h3 className="font-bold text-slate-900">Topic navigation</h3><div className="mt-3 grid gap-2 sm:grid-cols-3"><button type="button" disabled={!content.relatedTopics[0]} onClick={() => navigate(content.relatedTopics[0])} className="rounded-xl border border-slate-200 p-3 text-left text-sm"><span className="block text-xs text-slate-500">Previous topic</span>{content.relatedTopics[0] ?? '—'}</button><div className="rounded-xl bg-indigo-50 p-3 text-sm"><span className="block text-xs text-indigo-600">Current topic</span>{content.topic}</div><button type="button" disabled={!content.relatedTopics[1]} onClick={() => navigate(content.relatedTopics[1])} className="rounded-xl border border-slate-200 p-3 text-left text-sm"><span className="block text-xs text-slate-500">Next topic</span>{content.relatedTopics[1] ?? '—'}</button></div><p className="mt-4 text-sm font-semibold text-slate-900">Related topics</p><div className="mt-2 flex flex-wrap gap-2">{content.relatedTopics.map((related) => <button type="button" key={related} onClick={() => navigate(related)} className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:border-indigo-300 hover:text-indigo-700">{related}</button>)}</div></Card><div className="flex flex-wrap gap-2"><Link to={assistantUrl} className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white">Ask LearnMate AI <ArrowRight className="ml-1 h-4 w-4" /> </Link><Link to="/practice" className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">Start practice</Link></div><p className="rounded-xl bg-slate-100 px-4 py-3 text-xs leading-5 text-slate-600">AI-generated learning content may contain mistakes. Verify important academic information with trusted sources.</p></article>
}
