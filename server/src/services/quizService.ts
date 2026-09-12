import { z } from 'zod'

export const quizRequestSchema = z.object({
  subject: z.string().trim().min(2).max(120).default('Computer Networks'),
  topic: z.string().trim().min(2).max(160),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  count: z.union([z.literal(5), z.literal(10)]),
  usedQuestionIds: z.array(z.string().min(1)).max(500).default([]),
  usedQuestionTexts: z.array(z.string().min(1)).max(500).default([]),
})

const quizRecordSchema = z.object({
  id: z.string().min(1),
  subject: z.string().min(1),
  topic: z.string().min(1),
  question: z.string().min(1),
  options: z.array(z.string().min(1)).length(4),
  correctAnswer: z.string().min(1),
  explanation: z.string().min(1),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  concept: z.string().min(1),
  source: z.enum(['ai', 'demo']),
})

export const quizResponseSchema = z.object({
  questions: z.array(quizRecordSchema.omit({ correctAnswer: true, explanation: true })),
  source: z.enum(['ai', 'demo']),
})

export type QuizRecord = z.infer<typeof quizRecordSchema>
export type PublicQuizQuestion = z.infer<typeof quizResponseSchema>['questions'][number]

const demoQuestions: Record<string, QuizRecord[]> = {
  subnetting: [
    { id: 'subnetting-1', subject: 'Computer Networks', topic: 'Subnetting', question: 'What is the main purpose of subnetting?', options: ['To divide a network into smaller logical networks', 'To encrypt every network packet', 'To replace a router with a switch', 'To remove IP addresses'], correctAnswer: 'To divide a network into smaller logical networks', explanation: 'Subnetting divides an IP network into smaller logical networks that can be managed and routed separately.', difficulty: 'beginner', concept: 'Subnet purpose', source: 'demo' },
    { id: 'subnetting-2', subject: 'Computer Networks', topic: 'Subnetting', question: 'What does a subnet mask identify?', options: ['The network and host portions of an IP address', 'The password for a network', 'The physical cable length', 'The application protocol'], correctAnswer: 'The network and host portions of an IP address', explanation: 'A subnet mask marks which bits identify the network and which remain available for hosts.', difficulty: 'beginner', concept: 'Subnet mask', source: 'demo' },
    { id: 'subnetting-3', subject: 'Computer Networks', topic: 'Subnetting', question: 'How many usable host addresses are in a /30 IPv4 subnet?', options: ['2', '4', '8', '30'], correctAnswer: '2', explanation: 'A /30 has four total addresses; the network and broadcast addresses leave two usable host addresses.', difficulty: 'beginner', concept: 'Usable hosts', source: 'demo' },
    { id: 'subnetting-4', subject: 'Computer Networks', topic: 'Subnetting', question: 'What does increasing the prefix length generally do?', options: ['Creates smaller subnets with fewer host addresses', 'Creates one larger broadcast domain', 'Removes the network address', 'Makes every address public'], correctAnswer: 'Creates smaller subnets with fewer host addresses', explanation: 'A longer prefix reserves more bits for the network, leaving fewer host bits in each subnet.', difficulty: 'beginner', concept: 'Prefix length', source: 'demo' },
    { id: 'subnetting-5', subject: 'Computer Networks', topic: 'Subnetting', question: 'Which address is normally reserved as the broadcast address?', options: ['The last address in the subnet', 'The first usable host address', 'The router MAC address', 'Any address ending in .1'], correctAnswer: 'The last address in the subnet', explanation: 'In a traditional IPv4 subnet, the final address is reserved for broadcasts to all hosts in that subnet.', difficulty: 'beginner', concept: 'Broadcast address', source: 'demo' },
  ],
  'tcp vs udp': [
    { id: 'tcp-udp-1', subject: 'Computer Networks', topic: 'TCP vs UDP', question: 'What is the primary purpose of TCP?', options: ['To provide reliable, ordered delivery', 'To encrypt every packet automatically', 'To assign IP addresses', 'To replace the DNS system'], correctAnswer: 'To provide reliable, ordered delivery', explanation: 'TCP tracks delivery, ordering, and retransmission so applications receive a reliable byte stream.', difficulty: 'beginner', concept: 'TCP reliability', source: 'demo' },
    { id: 'tcp-udp-2', subject: 'Computer Networks', topic: 'TCP vs UDP', question: 'Which protocol is commonly preferred for live voice when low delay matters?', options: ['UDP', 'TCP', 'DNS', 'HTTP'], correctAnswer: 'UDP', explanation: 'UDP has less delivery overhead, so real-time applications can keep moving instead of waiting for late packets.', difficulty: 'beginner', concept: 'UDP speed', source: 'demo' },
    { id: 'tcp-udp-3', subject: 'Computer Networks', topic: 'TCP vs UDP', question: 'What does UDP provide by default?', options: ['Best-effort datagrams without delivery guarantees', 'A guaranteed ordered byte stream', 'Automatic packet retransmission', 'A secure encrypted tunnel'], correctAnswer: 'Best-effort datagrams without delivery guarantees', explanation: 'UDP sends datagrams with minimal transport guarantees. Applications can add their own controls when needed.', difficulty: 'beginner', concept: 'UDP characteristics', source: 'demo' },
    { id: 'tcp-udp-4', subject: 'Computer Networks', topic: 'TCP vs UDP', question: 'Which TCP feature helps detect missing data?', options: ['Acknowledgements and retransmission', 'A larger monitor', 'DNS caching', 'MAC address translation'], correctAnswer: 'Acknowledgements and retransmission', explanation: 'TCP acknowledges received data and retransmits segments that appear to be missing.', difficulty: 'beginner', concept: 'TCP delivery', source: 'demo' },
    { id: 'tcp-udp-5', subject: 'Computer Networks', topic: 'TCP vs UDP', question: 'Why can a late packet be less useful in a video call?', options: ['The conversation has already moved on', 'TCP deletes all video', 'UDP cannot carry media', 'Late packets are always corrupted'], correctAnswer: 'The conversation has already moved on', explanation: 'Interactive media values timeliness. A late audio or video packet may be less useful than continuing with the next frame.', difficulty: 'beginner', concept: 'Real-time tradeoffs', source: 'demo' },
  ],
}

const quizStore = new Map<string, QuizRecord>()

function normalizeTopic(topic: string) {
  return topic.toLowerCase().replace(/\s+/g, ' ').trim()
}

function genericQuestions(topic: string, level: QuizRecord['difficulty']): QuizRecord[] {
  const concepts = ['definition', 'purpose', 'example', 'trade-off', 'common mistake', 'application', 'comparison', 'edge case', 'workflow', 'debugging', 'performance', 'design', 'testing', 'terminology', 'review']
  return concepts.map((concept, index) => ({
    id: `generic-${normalizeTopic(topic).replace(/\s+/g, '-')}-${level}-${String(index + 1).padStart(2, '0')}`,
    subject: 'Computer Networks',
    topic,
    question: `Which statement best describes the ${concept} of ${topic}?`,
    options: [`A practical ${concept} of ${topic} should be checked with an example and its assumptions`, `It never depends on context`, `It can be understood without any evidence`, `It always has the same result in every situation`],
    correctAnswer: `A practical ${concept} of ${topic} should be checked with an example and its assumptions`,
    explanation: `Understanding the ${concept} of ${topic} requires connecting the idea to context and checking its assumptions.`,
    difficulty: level,
    concept: `${topic} ${concept}`,
    source: 'demo',
  }))
}

function supplementalQuestions(topic: string, level: QuizRecord['difficulty']): QuizRecord[] {
  if (normalizeTopic(topic) === 'osi model') {
    const questions: Record<QuizRecord['difficulty'], string[][]> = {
      beginner: [
        ['osi-beginner-01', 'Which OSI layer forwards packets between different networks?', 'Network', 'Physical', 'Presentation', 'Application'],
        ['osi-beginner-02', 'Which OSI layer is responsible for end-to-end reliable delivery?', 'Transport', 'Data Link', 'Session', 'Physical'],
        ['osi-beginner-03', 'Which layer carries raw electrical or radio signals?', 'Physical', 'Network', 'Transport', 'Application'],
        ['osi-beginner-04', 'MAC addresses are primarily associated with which OSI layer?', 'Data Link', 'Session', 'Network', 'Presentation'],
        ['osi-beginner-05', 'HTTP is commonly described as an example of which OSI layer?', 'Application', 'Physical', 'Data Link', 'Transport'],
      ],
      intermediate: [
        ['osi-intermediate-01', 'A router primarily makes forwarding decisions using which OSI layer information?', 'Network-layer logical addresses', 'Physical voltages', 'Presentation formats', 'Session tokens'],
        ['osi-intermediate-02', 'Which layer can segment data and provide retransmission between endpoints?', 'Transport', 'Data Link', 'Application', 'Physical'],
        ['osi-intermediate-03', 'A switch traditionally forwards frames using information from which layer?', 'Data Link', 'Network', 'Transport', 'Presentation'],
        ['osi-intermediate-04', 'Encryption or data-format translation is commonly associated with which OSI layer?', 'Presentation', 'Physical', 'Network', 'Data Link'],
        ['osi-intermediate-05', 'Which layer manages dialogs and checkpoints between applications?', 'Session', 'Transport', 'Network', 'Physical'],
      ],
      advanced: [
        ['osi-advanced-01', 'Why is the OSI model useful when troubleshooting a failed web request?', 'It narrows investigation by separating responsibilities by layer', 'It guarantees every protocol uses exactly one layer', 'It replaces packet captures', 'It assigns IP addresses automatically'],
        ['osi-advanced-02', 'A host can reach its gateway but not a remote network. Which layer boundary is most relevant first?', 'Network-layer routing and addressing', 'Presentation encoding', 'Physical cable colour', 'Application typography'],
        ['osi-advanced-03', 'Why can real protocols map to more than one OSI layer?', 'The OSI model is conceptual while protocol stacks combine responsibilities', 'Layers are selected randomly per packet', 'Protocols cannot use headers', 'Every network has only one layer'],
        ['osi-advanced-04', 'A corrupted Ethernet frame is discarded before IP routing. Which layer detected the immediate problem?', 'Data Link', 'Session', 'Application', 'Presentation'],
        ['osi-advanced-05', 'Which observation most strongly indicates an application-layer failure rather than a link failure?', 'TCP connects but the HTTP service returns an error', 'The cable is disconnected', 'The switch has no MAC entry', 'The host has no link light'],
      ],
    }
    return questions[level].map(([id, question, correct, ...options]) => ({ id, subject: 'Computer Networks', topic, question, options: [correct, ...options], correctAnswer: correct, explanation: 'The answer follows from the responsibility assigned to that OSI layer.', difficulty: level, concept: 'OSI layers', source: 'demo' }))
  }
  if (normalizeTopic(topic) !== 'subnetting') return []
  const specs: Record<QuizRecord['difficulty'], string[][]> = {
    beginner: [
      ['subnetting-beginner-06', 'Which part of an IPv4 address identifies the subnet when using a mask?', 'The bits covered by the network mask', 'The DNS record only', 'The Ethernet frame checksum', 'The application payload'],
      ['subnetting-beginner-07', 'What happens to the number of available host bits when a prefix changes from /24 to /26?', 'It decreases by two', 'It increases by two', 'It stays exactly the same', 'It becomes zero'],
      ['subnetting-beginner-08', 'Which address should not normally be assigned to a host in a subnet?', 'The network address', 'A usable host address', 'An address from another subnet', 'A private address'],
      ['subnetting-beginner-09', 'What is the purpose of reserving a broadcast address?', 'To reach all hosts on the subnet', 'To identify one private host', 'To store a DNS password', 'To select a transport protocol'],
      ['subnetting-beginner-10', 'Which notation represents the number of network bits directly?', 'CIDR prefix length', 'MAC notation', 'Port notation', 'URL encoding'],
      ['subnetting-beginner-11', 'Why might an administrator subnet a large office network?', 'To limit broadcast scope and organize hosts', 'To remove the need for IP addresses', 'To make every packet encrypted', 'To eliminate routing'],
      ['subnetting-beginner-12', 'What does a /16 prefix leave in an IPv4 address?', '16 host bits', '16 total addresses', '8 host bits', '32 network bits'],
      ['subnetting-beginner-13', 'Which device commonly routes traffic between different IP subnets?', 'A router', 'A hub', 'A keyboard', 'A monitor'],
      ['subnetting-beginner-14', 'What is a host range?', 'The usable addresses between network and broadcast addresses', 'All possible MAC addresses', 'Only the subnet mask', 'The router configuration file'],
      ['subnetting-beginner-15', 'What does a smaller prefix number generally provide?', 'More host addresses per subnet', 'Fewer total bits in IPv4', 'No network address', 'Only multicast addresses'],
    ],
    intermediate: Array.from({ length: 15 }, (_, index) => {
      const items = [
        ['subnetting-intermediate-01', 'How many total IPv4 addresses are in a /27 subnet?', '32', '16', '64', '27'],
        ['subnetting-intermediate-02', 'How many usable hosts are available in a /29 subnet?', '6', '8', '14', '29'],
        ['subnetting-intermediate-03', 'Which prefix provides at least 14 usable IPv4 hosts?', '/28', '/29', '/30', '/27'],
        ['subnetting-intermediate-04', 'What is the block size for a /26 mask in the last octet?', '64', '26', '32', '128'],
        ['subnetting-intermediate-05', 'Which subnet contains 192.168.1.70/26?', '192.168.1.64/26', '192.168.1.0/26', '192.168.1.128/26', '192.168.1.192/26'],
        ['subnetting-intermediate-06', 'How many /28 subnets fit inside a /24 network?', '16', '4', '8', '32'],
        ['subnetting-intermediate-07', 'What is the usable host range for 10.0.0.0/30?', '10.0.0.1 through 10.0.0.2', '10.0.0.0 through 10.0.0.3', '10.0.0.2 through 10.0.0.4', '10.0.0.1 through 10.0.0.3'],
        ['subnetting-intermediate-08', 'What does VLSM allow an administrator to do?', 'Use different subnet sizes in one address space', 'Use several MAC addresses for one host', 'Avoid all routing', 'Encrypt subnet masks'],
        ['subnetting-intermediate-09', 'Which prefix is the smallest subnet that supports 30 usable hosts?', '/27', '/28', '/26', '/30'],
        ['subnetting-intermediate-10', 'What is the network address of 172.16.35.140/20?', '172.16.32.0', '172.16.35.0', '172.16.0.0', '172.16.48.0'],
        ['subnetting-intermediate-11', 'Borrowing three host bits creates how many equal-sized subnets?', '8', '3', '6', '16'],
        ['subnetting-intermediate-12', 'Which mask matches a /27 prefix?', '255.255.255.224', '255.255.255.192', '255.255.255.240', '255.255.0.0'],
        ['subnetting-intermediate-13', 'Why are subnet boundaries aligned to block sizes?', 'They determine which addresses share a network prefix', 'They encrypt host traffic', 'They identify application ports', 'They remove broadcast addresses'],
        ['subnetting-intermediate-14', 'A /25 is split into /27 networks. How many result?', '4', '2', '8', '32'],
        ['subnetting-intermediate-15', 'Which address is the broadcast for 192.168.10.128/26?', '192.168.10.191', '192.168.10.128', '192.168.10.129', '192.168.10.255'],
      ]
      const [id, question, correct, ...options] = items[index]
      return [id, question, correct, ...options]
    }),
    advanced: [
      ['subnetting-advanced-01', 'Which design best minimizes wasted addresses for differently sized departments?', 'VLSM with largest requirements allocated first', 'One /30 for every department', 'A single flat /16', 'Random equal subnet sizes'],
      ['subnetting-advanced-02', 'What is the main trade-off of route summarization?', 'Fewer routes can reduce specificity', 'It increases every host count', 'It removes subnet boundaries', 'It guarantees encryption'],
      ['subnetting-advanced-03', 'Which prefix length provides 62 usable IPv4 hosts?', '/26', '/27', '/25', '/30'],
      ['subnetting-advanced-04', 'Why can overlapping subnets cause routing problems?', 'An address may match multiple network interpretations', 'They always increase bandwidth', 'They disable DNS only', 'They convert TCP to UDP'],
      ['subnetting-advanced-05', 'What is the first usable address in 10.20.48.0/21?', '10.20.48.1', '10.20.40.1', '10.20.55.254', '10.20.48.0'],
      ['subnetting-advanced-06', 'Which allocation strategy best preserves future growth?', 'Reserve contiguous blocks for planned expansion', 'Use every address immediately', 'Mix unrelated ranges randomly', 'Avoid documenting allocations'],
      ['subnetting-advanced-07', 'What does longest-prefix matching select?', 'The most specific matching route', 'The oldest route', 'The route with the shortest mask', 'A broadcast address'],
      ['subnetting-advanced-08', 'How does IPv6 subnetting commonly differ from IPv4 host sizing?', 'IPv6 often preserves a standard /64 per LAN', 'IPv6 has no prefixes', 'IPv6 uses MAC addresses as routes', 'IPv6 cannot be subdivided'],
      ['subnetting-advanced-09', 'Which issue is caused by an incorrect subnet mask on a host?', 'It may treat remote hosts as local or vice versa', 'It changes the host MAC address', 'It encrypts packets incorrectly', 'It removes the default gateway'],
      ['subnetting-advanced-10', 'What is the network address of 192.0.2.130/26?', '192.0.2.128', '192.0.2.0', '192.0.2.64', '192.0.2.192'],
      ['subnetting-advanced-11', 'What is a benefit of summarizing contiguous routes?', 'Smaller routing tables and simpler advertisements', 'More broadcast traffic', 'Fewer usable host bits', 'Automatic authentication'],
      ['subnetting-advanced-12', 'Which constraint matters when designing point-to-point IPv4 links?', 'The link needs enough addresses for both endpoints', 'Every link must be /8', 'Broadcasts must reach the internet', 'The mask is optional'],
      ['subnetting-advanced-13', 'Why should subnet plans document gateway and reserved ranges?', 'To prevent allocation conflicts and clarify operations', 'To increase packet size', 'To avoid using CIDR', 'To replace route tables'],
      ['subnetting-advanced-14', 'What does a discontiguous network design make more difficult?', 'Route summarization and predictable advertisements', 'Changing a host name', 'Using Ethernet frames', 'Calculating TCP checksums'],
      ['subnetting-advanced-15', 'Which approach best validates a proposed subnet plan?', 'Check boundaries, capacity, overlap, and routing behavior', 'Only count the first address', 'Ignore future growth', 'Test one host without its mask'],
    ],
  }
  return specs[level].map(([id, question, correct, ...options]) => ({ id, subject: 'Computer Networks', topic, question, options: [correct, ...options], correctAnswer: correct, explanation: 'This answer follows from the address boundaries, capacity, or routing principle tested by the question.', difficulty: level, concept: 'Subnetting design and calculation', source: 'demo' }))
}

function questionPool(topic: string, level: QuizRecord['difficulty']) {
  const base = (demoQuestions[normalizeTopic(topic)] ?? []).filter((question) => question.difficulty === level)
  const supplemental = supplementalQuestions(topic, level)
  return [...base, ...supplemental, ...(base.length || supplemental.length ? [] : genericQuestions(topic, level))]
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5)
}

export function getDemoQuiz(topic: string, level: QuizRecord['difficulty'], count: number, usedQuestionIds: string[] = [], usedQuestionTexts: string[] = []): QuizRecord[] {
  const questions = questionPool(topic, level)
  const usedIds = new Set(usedQuestionIds)
  const usedTexts = new Set(usedQuestionTexts.map((text) => text.trim().toLowerCase()))
  const available = questions.filter((question) => !usedIds.has(question.id) && !usedTexts.has(question.question.trim().toLowerCase()))
  if (available.length < count) throw new Error('QUESTION_POOL_EXHAUSTED')
  const selected = shuffle(available).slice(0, count)
  const result = selected.map((question) => ({ ...question, subject: question.subject ?? 'Computer Networks', options: shuffle(question.options) }))
  result.forEach((question) => quizStore.set(question.id, question))
  return result
}

async function generateWithProvider(subject: string, topic: string, level: QuizRecord['difficulty'], count: number, usedQuestionIds: string[], usedQuestionTexts: string[]): Promise<QuizRecord[]> {
  const apiKey = process.env.AI_API_KEY
  if (!apiKey) throw new Error('AI provider is not configured')
  const response = await fetch(process.env.AI_API_URL ?? 'https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: process.env.AI_MODEL ?? 'gpt-4o-mini',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'You are LearnMate Quiz Tutor. Generate clear, non-trick multiple-choice questions directly about the requested topic. Return only JSON: {"questions":[{"id":"unique","topic":"string","question":"string","options":["A","B","C","D"],"correctAnswer":"exact option","explanation":"string","difficulty":"beginner|intermediate|advanced","concept":"string","source":"ai"}]}. Exactly one option must be correct. Do not duplicate questions.' },
        { role: 'user', content: `Subject: ${subject}\nTopic: ${topic}\nDifficulty: ${level}\nQuestion count: ${count}\nDo not reuse these question IDs: ${usedQuestionIds.join(', ')}\nDo not reuse these question texts: ${usedQuestionTexts.join(' | ')}` },
      ],
    }),
    signal: AbortSignal.timeout(15000),
  })
  if (!response.ok) throw new Error(`AI provider returned ${response.status}`)
  const payload: unknown = await response.json()
  const content = typeof payload === 'object' && payload !== null && 'choices' in payload && Array.isArray(payload.choices) && payload.choices[0] && typeof payload.choices[0] === 'object' && 'message' in payload.choices[0] && payload.choices[0].message && typeof payload.choices[0].message === 'object' && 'content' in payload.choices[0].message ? payload.choices[0].message.content : undefined
  if (typeof content !== 'string') throw new Error('AI provider returned invalid quiz content')
  const parsed = z.object({ questions: z.array(quizRecordSchema.omit({ source: true, subject: true }).extend({ source: z.literal('ai') })) }).parse(JSON.parse(content))
  const usedIds = new Set(usedQuestionIds)
  const usedTexts = new Set(usedQuestionTexts.map((text) => text.trim().toLowerCase()))
  const unique = parsed.questions.filter((question, index, list) => !usedIds.has(question.id) && !usedTexts.has(question.question.trim().toLowerCase()) && list.findIndex((item) => item.question.trim().toLowerCase() === question.question.trim().toLowerCase()) === index).slice(0, count)
  if (unique.length !== count) throw new Error('AI provider returned duplicate or incomplete questions')
  const result = unique.map((question) => ({ ...question, subject, options: shuffle(question.options) }))
  result.forEach((question) => quizStore.set(question.id, question))
  return result
}

export async function generateQuiz(subject: string, topic: string, level: QuizRecord['difficulty'], count: number, usedQuestionIds: string[] = [], usedQuestionTexts: string[] = []) {
  try {
    return await generateWithProvider(subject, topic, level, count, usedQuestionIds, usedQuestionTexts)
  } catch (error) {
    if (error instanceof Error && error.message === 'QUESTION_POOL_EXHAUSTED') throw error
    return getDemoQuiz(topic, level, count, usedQuestionIds, usedQuestionTexts)
  }
}

export function toPublicQuestion(question: QuizRecord): PublicQuizQuestion {
  return { id: question.id, subject: question.subject ?? 'Computer Networks', topic: question.topic, question: question.question, options: question.options, difficulty: question.difficulty, concept: question.concept, source: question.source }
}

export function checkStoredAnswer(questionId: string, selectedAnswer: string) {
  const question = quizStore.get(questionId)
  if (!question) return null
  const correct = question.correctAnswer === selectedAnswer
  return { correct, correctAnswer: question.correctAnswer, explanation: question.explanation, concept: question.concept, misconception: correct ? undefined : `You may be mixing up ${question.concept} with a related networking detail.`, nextAction: correct ? 'Keep practising at this level.' : 'Try an easier question on this concept.' }
}

export const quizStoreForTests = quizStore
