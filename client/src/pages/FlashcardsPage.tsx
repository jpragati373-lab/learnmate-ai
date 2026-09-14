import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { findTopic } from '../data/topicCatalog'
import { getAvailableFlashcards, getExamSummary, recordFlashcard, resetFlashcardHistory } from '../services/examService'

export function FlashcardsPage() {
  const [params] = useSearchParams()
  const topic = findTopic(params.get('topicId') ?? '') ?? findTopic('subnetting')
  const summary = useMemo(() => getExamSummary(topic?.id ?? 'subnetting', topic?.name ?? 'Subnetting', 'beginner'), [topic])
  const [cards, setCards] = useState(() => getAvailableFlashcards(summary))
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  if (!topic) return null
  const card = cards[index]
  const next = () => { if (card) recordFlashcard(summary.topicId, card.id); setFlipped(false); setIndex((value) => value + 1) }
  return <main className="mx-auto max-w-2xl px-5 py-10"><header><p className="text-sm font-semibold text-indigo-600">Quick Revision · {summary.topic}</p><h1 className="mt-3 text-4xl font-bold">Flashcards</h1><p className="mt-2 text-slate-600">Viewing cards does not change mastery or quiz progress.</p></header>{card ? <Card className="mt-8 min-h-72"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">{flipped ? 'Answer' : 'Question'}</p><p className="mt-8 text-2xl font-bold text-slate-900">{flipped ? card.back : card.front}</p><div className="mt-12 flex flex-wrap gap-2"><Button onClick={() => setFlipped((value) => !value)}>{flipped ? 'Show Question' : 'Flip Card'}</Button>{flipped && <Button variant="secondary" onClick={next}>Next</Button>}</div><p className="mt-5 text-sm text-slate-500">Card {index + 1} of {cards.length}</p></Card> : <Card className="mt-8"><h2 className="text-xl font-bold">You've reviewed all available cards for this topic.</h2><p className="mt-2 text-slate-600">Restart the revision set or choose another topic.</p><div className="mt-5 flex gap-2"><Button onClick={() => { resetFlashcardHistory(summary.topicId); setCards(getAvailableFlashcards(summary)); setIndex(0); setFlipped(false) }}>Restart Set</Button><Link className="rounded-xl border px-4 py-2.5 text-sm font-semibold" to={`/learn/topic/${topic.id}`}>Review Topic</Link></div></Card>}</main>
}
