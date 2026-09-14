import { z } from 'zod'

export const teachingRequestSchema = z.object({
  topic: z.string().trim().min(2).max(160),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
})

const checkSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string().min(1)).length(4),
})

export const teachingResponseSchema = z.object({
  topic: z.string().min(1),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  steps: z.array(z.object({
    title: z.string().min(1),
    explanation: z.string().min(1),
    example: z.string().min(1),
    takeaway: z.string().min(1),
    knowledgeCheck: checkSchema,
  })).min(3).max(8),
  source: z.enum(['ai', 'demo']),
})

export type TeachingRequest = z.infer<typeof teachingRequestSchema>
export type TeachingResponse = z.infer<typeof teachingResponseSchema>

const lessonSeeds: Record<string, { titles: string[]; concepts: string[]; examples: string[]; takeaways: string[]; checks: Array<{ question: string; options: string[]; answer: number; explanation: string; retry: { question: string; options: string[]; answer: number } }> }> = {
  subnetting: {
    titles: ['Start with IP addresses', 'Why use smaller networks?', 'Read the subnet mask', 'Try a calculation', 'Check your understanding'],
    concepts: ['An IP address identifies a logical location on a network. The network portion tells us which network a device belongs to, while the host portion identifies the device within it.', 'Subnetting divides one larger network into smaller logical networks. This makes address allocation, routing, and broadcast traffic easier to manage.', 'A subnet mask marks which bits belong to the network and which remain for hosts. CIDR notation such as /26 says that 26 bits are network bits.', 'With IPv4, host bits determine the address capacity. A /26 leaves 6 host bits, so the range contains 64 addresses; commonly 62 are usable because network and broadcast addresses are reserved.', 'You can now connect the prefix length to the size of each subnet and explain why the network and broadcast addresses are special.'],
    examples: ['A laptop might use 192.168.1.20 inside a home network.', 'A company can place finance, teaching, and guest devices in separate subnets.', 'In 192.168.1.0/26, the /26 prefix separates the first 26 bits from the host bits.', 'A /24 split into four /26 networks creates four blocks of 64 addresses.', 'When solving a subnetting question, identify the prefix, calculate host bits, then check the boundaries.'],
    takeaways: ['IP addresses identify logical network locations.', 'Subnetting creates smaller, manageable networks.', 'The mask separates network bits from host bits.', 'Host bits determine address capacity.', 'Prefix length and address boundaries are the key clues.'],
    checks: [
      { question: 'What does an IP address identify?', options: ['A logical network location', 'A keyboard shortcut', 'A database password', 'A CPU instruction'], answer: 0, explanation: 'An IP address identifies a logical location for network communication.', retry: { question: 'Which item helps a router deliver a packet?', options: ['The destination IP address', 'The screen brightness', 'The file name only', 'The keyboard layout'], answer: 0 } },
      { question: 'Why divide a network into subnets?', options: ['To organise address space and traffic', 'To increase CPU speed', 'To replace all passwords', 'To remove every router'], answer: 0, explanation: 'Subnets organise addresses and can limit broadcast traffic.', retry: { question: 'What is one benefit of smaller subnets?', options: ['More organised network boundaries', 'Automatic malware removal', 'Unlimited addresses', 'No need for routing'], answer: 0 } },
      { question: 'What does a subnet mask help determine?', options: ['Network and host portions', 'Website password', 'CPU speed', 'File size'], answer: 0, explanation: 'The subnet mask marks the network bits and host bits.', retry: { question: 'In /26, what does 26 describe?', options: ['Network prefix bits', 'Number of routers', 'File size', 'Password length'], answer: 0 } },
      { question: 'How many total IPv4 addresses are in a /26 block?', options: ['64', '16', '128', '256'], answer: 0, explanation: 'A /26 leaves 6 host bits, giving 2^6 = 64 total addresses.', retry: { question: 'A /26 leaves how many host bits?', options: ['6', '26', '32', '2'], answer: 0 } },
      { question: 'What is the best next step in a subnetting problem?', options: ['Identify the prefix and host bits', 'Guess the answer', 'Ignore the mask', 'Change the protocol'], answer: 0, explanation: 'The prefix and remaining host bits determine the subnet size.', retry: { question: 'What should you calculate after reading /26?', options: ['The remaining host bits', 'The monitor size', 'The website title', 'The keyboard type'], answer: 0 } },
    ],
  },
}

function seedFor(topic: string) {
  const key = topic.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  return lessonSeeds[key] ?? {
    titles: ['Find the core idea', 'Break it into parts', 'Use a practical example', 'Test the rule'],
    concepts: [`${topic} is easiest to learn when you first define its central idea in plain language.`, `Next, separate ${topic} into the parts that interact and notice what changes when one part changes.`, `A small example makes ${topic} observable instead of something to memorise.`, `Check your understanding by stating the rule and applying it to a new situation.`],
    examples: [`Define ${topic} in one sentence.` as string, `List the important parts of ${topic} and how they connect.`, `Apply ${topic} to a small everyday or technical example.`, `Explain why the answer changes when an important input changes.`],
    takeaways: [`Start with the definition of ${topic}.`, 'Connect parts to their relationships.', 'Examples turn definitions into usable knowledge.', 'Apply the rule before memorising it.'],
    checks: [0, 1, 2, 3].map((index) => ({ question: `Which approach best helps you learn ${topic}?`, options: ['Apply the idea to an example', 'Skip the definition', 'Ignore assumptions', 'Memorise unrelated facts'], answer: 0, explanation: 'A concrete example connects the definition to observable behaviour.', retry: { question: `What should you do next with ${topic}?`, options: ['Apply the main rule', 'Avoid examples', 'Ignore inputs', 'Skip practice'], answer: 0 } })),
  }
}

export function generateTeachingLesson(request: TeachingRequest): TeachingResponse {
  const seed = seedFor(request.topic)
  const steps = seed.titles.map((title, index) => ({ title, explanation: request.level === 'advanced' ? `${seed.concepts[index] ?? seed.concepts[seed.concepts.length - 1]} Consider boundary conditions and implementation trade-offs when applying it.` : request.level === 'intermediate' ? `${seed.concepts[index] ?? seed.concepts[seed.concepts.length - 1]} Notice how the parts relate in practice.` : seed.concepts[index] ?? seed.concepts[seed.concepts.length - 1], example: seed.examples[index] ?? seed.examples[seed.examples.length - 1], takeaway: seed.takeaways[index] ?? seed.takeaways[seed.takeaways.length - 1], knowledgeCheck: seed.checks[index] ?? seed.checks[seed.checks.length - 1] }))
  return teachingResponseSchema.parse({ topic: request.topic.trim(), level: request.level, steps, source: 'demo' })
}

export function validateTeachingCheck(topic: string, step: number, selectedOption: number, retry = false) {
  const seed = seedFor(topic)
  const check = seed.checks[step] ?? seed.checks[0]
  return selectedOption === (retry ? check.retry.answer : check.answer) ? { correct: true, explanation: check.explanation } : { correct: false, explanation: 'Not quite. Let us simplify the idea and try a different question.', retry: { question: check.retry.question, options: check.retry.options } }
}
