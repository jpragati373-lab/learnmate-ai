import { ArrowDown } from 'lucide-react'
import type { LearningPathTopic } from '../../types'
import { LearningPathNode } from './LearningPathNode'
export function LearningPath({ topics }: { topics: LearningPathTopic[] }) { return <div className="space-y-3">{topics.map((topic, index) => <div key={topic.id}>{index > 0 && <ArrowDown className="mx-auto h-5 w-5 text-slate-300" aria-hidden="true" />}<LearningPathNode topic={topic} /></div>)}</div> }
