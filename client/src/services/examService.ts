import type { LearningLevel } from '../types'

export interface Flashcard { id: string; front: string; back: string }
export interface ExamSummary {
  topicId: string
  topic: string
  definition: string
  importantConcepts: string[]
  keyPoints: string[]
  importantRules: string[]
  commonQuestions: string[]
  commonMistakes: string[]
  examTips: string[]
  flashcards: Flashcard[]
}

const curated: Record<string, Omit<ExamSummary, 'topicId' | 'topic'>> = {
  subnetting: {
    definition: 'Subnetting divides one IP network into smaller logical networks.',
    importantConcepts: ['Network bits identify the subnet.', 'Host bits identify devices inside it.', 'CIDR notation shows the prefix length.'],
    keyPoints: ['A longer prefix creates smaller subnets.', 'Network and broadcast addresses are normally reserved.', 'Subnet masks separate network and host portions.'],
    importantRules: ['Total IPv4 addresses = 2^(32 - prefix length).', 'Usable hosts commonly equal total addresses minus 2.', 'A /26 has 64 total addresses and usually 62 usable hosts.'],
    commonQuestions: ['What does a subnet mask determine?', 'How many hosts fit in a /26?', 'Why is subnetting useful?'],
    commonMistakes: ['Counting network and broadcast addresses as ordinary hosts.', 'Confusing a subnet mask with a default gateway.'],
    examTips: ['Write the prefix length first, then calculate remaining host bits.', 'Check the address boundaries before choosing an answer.'],
    flashcards: [
      { id: 'subnetting-definition', front: 'What is subnetting?', back: 'Dividing one IP network into smaller logical networks.' },
      { id: 'subnetting-mask', front: 'What does a subnet mask determine?', back: 'Which bits represent the network and which represent hosts.' },
      { id: 'subnetting-26', front: 'How many total addresses are in a /26?', back: '64 total addresses; commonly 62 usable host addresses.' },
    ],
  },
  'tcp vs udp': {
    definition: 'TCP and UDP are transport protocols with different reliability and overhead trade-offs.',
    importantConcepts: ['TCP is connection-oriented.', 'UDP is connectionless.', 'Applications choose based on requirements.'],
    keyPoints: ['TCP provides ordered, reliable delivery.', 'UDP has lower overhead and no built-in delivery guarantee.', 'Neither protocol is automatically best for every application.'],
    importantRules: ['TCP uses acknowledgements and retransmission.', 'UDP datagrams may arrive out of order or not at all.'],
    commonQuestions: ['When is UDP useful?', 'How does TCP provide reliability?', 'What is the key difference between TCP and UDP?'],
    commonMistakes: ['Calling UDP automatically faster in every situation.', 'Confusing connectionless delivery with encryption.'],
    examTips: ['Remember reliability versus low overhead.', 'Use the application requirement to justify the protocol.'],
    flashcards: [
      { id: 'tcp-udp-difference', front: 'TCP vs UDP?', back: 'TCP prioritises reliable ordered delivery; UDP prioritises low overhead.' },
      { id: 'tcp-reliability', front: 'How does TCP provide reliability?', back: 'Acknowledgements, ordering, and retransmission of missing data.' },
      { id: 'udp-use', front: 'When can UDP be useful?', back: 'Real-time applications where low delay matters more than perfect delivery.' },
    ],
  },
}

function fallback(topic: string): Omit<ExamSummary, 'topicId' | 'topic'> {
  return {
    definition: `${topic} is best understood by remembering its definition, purpose, and main conditions.`,
    importantConcepts: [`Define ${topic} clearly.`, 'Identify its important parts.', 'Connect the rule to an example.'],
    keyPoints: ['Start with the central definition.', 'Apply the idea to a small example.', 'Check assumptions and edge cases.'],
    importantRules: ['Use the definition before applying a rule.', 'State assumptions when solving an exam problem.'],
    commonQuestions: [`What is ${topic}?`, `Why is ${topic} useful?`, `What is a common mistake with ${topic}?`],
    commonMistakes: ['Memorising words without applying the concept.', 'Ignoring conditions in the question.'],
    examTips: ['Write the key definition first.', 'Eliminate answers that contradict the main rule.'],
    flashcards: [
      { id: `${topic.toLowerCase().replace(/\W+/g, '-')}-definition`, front: `Define ${topic}.`, back: `${topic} is best explained by its central definition and purpose.` },
      { id: `${topic.toLowerCase().replace(/\W+/g, '-')}-rule`, front: `What should you check when applying ${topic}?`, back: 'Check the inputs, assumptions, and conditions of the problem.' },
    ],
  }
}

export function getExamSummary(topicId: string, topic: string, _level: LearningLevel): ExamSummary {
  return { topicId, topic, ...curated[topic.toLowerCase().replace(/\s+/g, ' ')] ?? fallback(topic) }
}

const historyKey = 'learnmate-flashcard-history-v1'
function readHistory(): Record<string, string[]> {
  try { return JSON.parse(localStorage.getItem(historyKey) ?? '{}') as Record<string, string[]> } catch { return {} }
}
export function getAvailableFlashcards(summary: ExamSummary): Flashcard[] {
  const used = new Set(readHistory()[summary.topicId] ?? [])
  return summary.flashcards.filter((card) => !used.has(card.id))
}
export function recordFlashcard(topicId: string, cardId: string) {
  const history = readHistory()
  history[topicId] = [...new Set([...(history[topicId] ?? []), cardId])]
  localStorage.setItem(historyKey, JSON.stringify(history))
}
export function resetFlashcardHistory(topicId?: string) {
  const history = readHistory()
  if (topicId) delete history[topicId]
  else Object.keys(history).forEach((key) => delete history[key])
  localStorage.setItem(historyKey, JSON.stringify(history))
}
