import { z } from 'zod'

export const learningPathRequestSchema = z.object({
  subject: z.string().trim().min(2).max(80),
  goal: z.string().trim().min(2).max(160),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
})
export const learningPathTopicSchema = z.object({
  id: z.string(),
  name: z.string(),
  subject: z.string(),
  description: z.string(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  estimatedMinutes: z.number().int().positive(),
  prerequisites: z.array(z.string()),
  status: z.enum(['completed', 'current', 'recommended', 'locked']),
  progress: z.number().min(0).max(100),
  accuracy: z.number().min(0).max(100),
})
export const learningPathResponseSchema = z.object({
  subject: z.string(),
  goal: z.string(),
  topics: z.array(learningPathTopicSchema),
  source: z.enum(['ai', 'demo']),
})

type PathSeed = Omit<z.infer<typeof learningPathTopicSchema>, 'status' | 'progress' | 'accuracy'>
const makePath = (subject: string, names: string[]): PathSeed[] => names.map((name, index) => ({
  id: name.toLowerCase().replace(/[^a-z]+/g, '-'),
  name,
  subject,
  description: `Build practical understanding of ${name}.`,
  difficulty: index > names.length - 4 ? 'Advanced' : index > names.length / 2 ? 'Intermediate' : 'Beginner',
  estimatedMinutes: 25,
  prerequisites: index ? [names[index - 1].toLowerCase().replace(/[^a-z]+/g, '-')] : [],
}))

const paths: Record<string, PathSeed[]> = {
  'Computer Networks': makePath('Computer Networks', ['Networking Basics', 'OSI Model', 'TCP/IP', 'IP Addressing', 'Subnetting', 'DNS', 'HTTP/HTTPS', 'Routing', 'Network Security']),
  SQL: makePath('SQL', ['SQL Basics', 'SELECT', 'Filtering', 'Aggregations', 'JOINs', 'Subqueries', 'Window Functions', 'Query Optimization']),
  Python: makePath('Python', ['Python Basics', 'Data Types', 'Conditions', 'Loops', 'Functions', 'Collections', 'OOP', 'Exceptions']),
  'Data Structures': makePath('Data Structures', ['Arrays', 'Linked Lists', 'Stacks & Queues', 'Hashing', 'Trees', 'Graphs', 'Searching & Sorting']),
  Java: makePath('Java', ['Java Basics', 'Object-Oriented Java', 'Collections', 'Exceptions', 'Streams & Lambdas', 'Concurrency']),
  'Machine Learning': makePath('Machine Learning', ['ML Foundations', 'Python for ML', 'Data Preprocessing', 'Regression', 'Classification', 'Model Evaluation', 'ML Deployment']),
}

export function getFallbackPath(subject: string, goal: string) {
  const source = paths[subject] ?? paths['Computer Networks']
  const topics = source.map((item, index) => ({
    ...item,
    status: index === 0 ? 'current' as const : index === 1 ? 'recommended' as const : 'locked' as const,
    progress: 0,
    accuracy: 0,
  }))
  return learningPathResponseSchema.parse({ subject, goal, topics, source: 'demo' })
}
