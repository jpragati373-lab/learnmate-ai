import { AlertCircle, ArrowRight, BookOpen, Lightbulb, MessageCircleQuestion, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ExplanationCard } from '../components/learning/ExplanationCard'
import { ExampleBlock } from '../components/learning/ExampleBlock'
import { KnowledgeCheckCard } from '../components/learning/KnowledgeCheckCard'
import { LearningLevelSelector } from '../components/learning/LearningLevelSelector'
import { LearningStyleSelector } from '../components/learning/LearningStyleSelector'
import { LoadingSkeleton } from '../components/learning/LoadingSkeleton'
import { MistakesCard } from '../components/learning/MistakesCard'
import { StepList } from '../components/learning/StepList'
import { SummaryCard } from '../components/learning/SummaryCard'
import { TopicInput } from '../components/learning/TopicInput'
import { explainTopic, type LearningExplanation } from '../services/aiService'
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

  async function generate(instruction?: string) {
    const trimmedTopic = topic.trim()
    if (trimmedTopic.length < 2) {
      setError('Enter a topic with at least two characters.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const result = await explainTopic({ topic: trimmedTopic, level, learningStyle, instruction })
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
      <div aria-live="polite">{loading ? <Card><LoadingSkeleton /></Card> : content ? <ExplanationResult content={content} onAction={generate} /> : <EmptyLearningState />}</div>
    </section>
  </div>
}

function EmptyLearningState() {
  return <Card className="flex min-h-[32rem] flex-col items-center justify-center border-dashed bg-white/70 p-8 text-center"><span className="rounded-2xl bg-indigo-50 p-4 text-indigo-600"><BookOpen className="h-8 w-8" /></span><h2 className="mt-6 text-xl font-bold text-slate-900">Your explanation will appear here</h2><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">Choose a topic, set your learning preferences, and we&apos;ll turn it into a focused learning session.</p></Card>
}

function ExplanationResult({ content, onAction }: { content: LearningExplanation; onAction: (instruction?: string) => void }) {
  const assistantUrl = `/assistant?subject=${encodeURIComponent('Computer Networks')}&topic=${encodeURIComponent(content.topic)}&level=${content.level}&learningStyle=simple&accuracy=48`
  return <article className="space-y-5"><header><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">{content.source === 'demo' ? 'Demo content' : 'AI-generated'}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{levelLabels[content.level]}</span></div><h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">{content.topic}</h2><p className="mt-2 text-sm text-slate-500">A focused explanation designed for your current learning level.</p></header><div className="grid gap-5 sm:grid-cols-2"><ExplanationCard content={content} /><Card><div className="flex items-start gap-3"><span className="rounded-xl bg-amber-50 p-2.5 text-amber-600"><Lightbulb className="h-5 w-5" /></span><div><h2 className="text-xl font-bold text-slate-950">Why Does It Matter?</h2><p className="mt-3 text-sm leading-7 text-slate-600">{content.whyItMatters}</p></div></div></Card></div><Card><div className="flex items-start gap-3"><span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600"><MessageCircleQuestion className="h-5 w-5" /></span><div><h2 className="text-xl font-bold text-slate-950">Real-World Analogy</h2><p className="mt-3 text-sm leading-7 text-slate-600">{content.analogy}</p></div></div></Card><StepList steps={content.steps} /><ExampleBlock example={content.example} /><MistakesCard mistakes={content.commonMistakes} /><SummaryCard summary={content.summary} /><section><div className="mb-4"><h2 className="text-2xl font-bold text-slate-950">Knowledge Check</h2><p className="mt-1 text-sm text-slate-500">Test yourself before moving on. Reveal each answer when you&apos;re ready.</p></div><div className="grid gap-4">{content.knowledgeChecks.map((check, index) => <KnowledgeCheckCard key={check.question} {...check} index={index + 1} />)}</div></section><div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-4"><span className="mr-2 flex w-full items-center text-sm font-semibold text-slate-700 sm:w-auto">Try another angle:</span><Link to={assistantUrl} className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white">Ask LearnMate AI <ArrowRight className="ml-1 h-4 w-4" /></Link><Button variant="secondary" onClick={() => onAction('Explain this more simply for me.')}>Explain Simpler</Button><Button variant="secondary" onClick={() => onAction('Give me another useful example.')}>Give Another Example</Button><Button variant="secondary" onClick={() => onAction('Give me an intuitive real-world analogy.')}>Give an Analogy</Button><Button variant="secondary" onClick={() => onAction('Summarize this in the shortest useful form.')}>Summarize</Button><Link to="/practice" className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-indigo-200 hover:text-indigo-700">Quiz Me <ArrowRight className="ml-1 h-4 w-4" /></Link></div><p className="rounded-xl bg-slate-100 px-4 py-3 text-xs leading-5 text-slate-600">AI-generated learning content may contain mistakes. Verify important academic information with trusted sources.</p></article>
}
