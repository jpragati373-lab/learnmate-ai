import type { QuizQuestion } from '../../types'
import { AnswerOption } from './AnswerOption'
import { QuizHeader } from './QuizHeader'
export function QuestionCard({ question, selected, disabled, onSelect }: { question: QuizQuestion; selected: string; disabled: boolean; onSelect: (answer: string) => void }) { return <div><QuizHeader question={question} /><h2 className="mt-6 text-2xl font-bold leading-tight text-slate-950">{question.question}</h2><div className="mt-6 space-y-3" role="radiogroup" aria-label="Answer options">{question.options.map((option, index) => <AnswerOption key={option} option={option} index={index} selected={selected === option} disabled={disabled} onSelect={() => onSelect(option)} />)}</div></div> }
