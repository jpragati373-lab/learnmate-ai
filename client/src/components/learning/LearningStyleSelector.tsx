import type { LearningStyle } from '../../types'

const styles: { value: LearningStyle; label: string }[] = [{ value: 'simple', label: 'Simple' }, { value: 'step-by-step', label: 'Step-by-step' }, { value: 'example-based', label: 'Example-based' }, { value: 'analogy', label: 'Analogy' }, { value: 'exam-focused', label: 'Exam-focused' }]
export function LearningStyleSelector({ value, onChange }: { value: LearningStyle; onChange: (value: LearningStyle) => void }) {
  return <fieldset><legend className="text-sm font-semibold text-slate-800">How should we explain it?</legend><div className="mt-2 flex flex-wrap gap-2">{styles.map((style) => <label key={style.value} className={`cursor-pointer rounded-full border px-3 py-2 text-xs font-semibold transition ${value === style.value ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200'}`}><input type="radio" name="style" value={style.value} checked={value === style.value} onChange={() => onChange(style.value)} className="sr-only" />{style.label}</label>)}</div></fieldset>
}
