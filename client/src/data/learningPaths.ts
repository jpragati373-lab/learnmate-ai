import type { LearningPathTopic } from '../types'

const topic = (id: string, name: string, subject: string, difficulty: 'Beginner' | 'Intermediate' | 'Advanced', minutes: number, prerequisites: string[] = [], description = ''): LearningPathTopic => ({ id, name, subject, description: description || `Build a practical understanding of ${name}.`, difficulty, estimatedMinutes: minutes, prerequisites, status: 'locked', progress: 0, accuracy: 0 })

export const learningPaths: Record<string, LearningPathTopic[]> = {
  'Computer Networks': [
    topic('networking-basics', 'Networking Basics', 'Computer Networks', 'Beginner', 20),
    topic('ip-addressing', 'IP Addresses', 'Computer Networks', 'Beginner', 25, ['networking-basics']),
    topic('subnetting', 'Subnetting', 'Computer Networks', 'Intermediate', 30, ['ip-addressing']),
    topic('cidr', 'CIDR', 'Computer Networks', 'Intermediate', 25, ['subnetting']),
    topic('routing', 'Routing', 'Computer Networks', 'Intermediate', 30, ['cidr']),
    topic('tcp-ip', 'TCP/IP', 'Computer Networks', 'Advanced', 35, ['routing']),
    topic('network-security', 'Network Security', 'Computer Networks', 'Advanced', 40, ['tcp-ip']),
  ],
  SQL: [
    topic('sql-basics', 'SQL Basics', 'SQL', 'Beginner', 20),
    topic('select', 'SELECT', 'SQL', 'Beginner', 20, ['sql-basics']),
    topic('filtering', 'Filtering', 'SQL', 'Beginner', 20, ['select']),
    topic('aggregations', 'Aggregations', 'SQL', 'Intermediate', 25, ['filtering']),
    topic('joins', 'JOINs', 'SQL', 'Intermediate', 30, ['aggregations']),
    topic('subqueries', 'Subqueries', 'SQL', 'Intermediate', 30, ['joins']),
    topic('window-functions', 'Window Functions', 'SQL', 'Advanced', 40, ['subqueries']),
  ],
  Python: [
    topic('python-basics', 'Python Basics', 'Python', 'Beginner', 20),
    topic('data-types', 'Data Types', 'Python', 'Beginner', 20, ['python-basics']),
    topic('conditions', 'Conditions', 'Python', 'Beginner', 20, ['data-types']),
    topic('loops', 'Loops', 'Python', 'Beginner', 25, ['conditions']),
    topic('functions', 'Functions', 'Python', 'Intermediate', 30, ['loops']),
    topic('collections', 'Collections', 'Python', 'Intermediate', 30, ['functions']),
    topic('oop', 'Object-Oriented Programming', 'Python', 'Advanced', 40, ['collections']),
    topic('exceptions', 'Exceptions', 'Python', 'Intermediate', 25, ['functions']),
  ],
  'Data Structures': [topic('arrays', 'Arrays', 'Data Structures', 'Beginner', 20), topic('linked-lists', 'Linked Lists', 'Data Structures', 'Beginner', 30, ['arrays']), topic('stacks-queues', 'Stacks & Queues', 'Data Structures', 'Beginner', 25, ['linked-lists']), topic('hashing', 'Hashing', 'Data Structures', 'Intermediate', 30, ['arrays']), topic('trees', 'Trees', 'Data Structures', 'Intermediate', 40, ['stacks-queues']), topic('graphs', 'Graphs', 'Data Structures', 'Advanced', 45, ['trees']), topic('algorithms', 'Searching & Sorting', 'Data Structures', 'Intermediate', 40, ['arrays'])],
  Java: [topic('java-basics', 'Java Basics', 'Java', 'Beginner', 20), topic('oop-java', 'Object-Oriented Java', 'Java', 'Beginner', 35, ['java-basics']), topic('collections-java', 'Collections', 'Java', 'Intermediate', 30, ['oop-java']), topic('exceptions-java', 'Exceptions', 'Java', 'Intermediate', 25, ['oop-java']), topic('streams', 'Streams & Lambdas', 'Java', 'Advanced', 40, ['collections-java']), topic('concurrency', 'Concurrency', 'Java', 'Advanced', 45, ['streams'])],
  'Machine Learning': [topic('ml-foundations', 'ML Foundations', 'Machine Learning', 'Beginner', 25), topic('python-ml', 'Python for ML', 'Machine Learning', 'Beginner', 30, ['ml-foundations']), topic('preprocessing', 'Data Preprocessing', 'Machine Learning', 'Intermediate', 35, ['python-ml']), topic('regression', 'Regression', 'Machine Learning', 'Intermediate', 40, ['preprocessing']), topic('classification', 'Classification', 'Machine Learning', 'Intermediate', 40, ['regression']), topic('evaluation', 'Model Evaluation', 'Machine Learning', 'Advanced', 35, ['classification']), topic('deployment', 'ML Deployment', 'Machine Learning', 'Advanced', 45, ['evaluation'])],
}

export const pathSubjects = Object.keys(learningPaths)

export function personalizePath(subject: string, progress: Record<string, { accuracy: number; status: string }>) {
  const source = learningPaths[subject] ?? learningPaths['Computer Networks']
  const completed = new Set(Object.entries(progress).filter(([, value]) => value.status === 'Strong' && value.accuracy >= 80).map(([id]) => id))
  return source.map((item, index) => {
    const saved = progress[item.id]
    const prerequisitesMet = item.prerequisites.every((id) => completed.has(id))
    const status = completed.has(item.id) ? 'completed' : !prerequisitesMet ? 'locked' : saved && saved.accuracy < 60 ? 'current' : index === 0 || saved ? 'current' : 'recommended'
    return { ...item, status: status as LearningPathTopic['status'], progress: saved?.accuracy ?? (status === 'completed' ? 100 : 0), accuracy: saved?.accuracy ?? 0 }
  })
}
