import type { LearningPathTopic } from '../types'
import { learningPaths } from './learningPaths'

const requestedTopics: Record<string, string[]> = {
  'Computer Networks': ['Computer Networking', 'Network Types', 'LAN', 'WAN', 'OSI Model', 'TCP/IP Model', 'IP Address', 'IPv4', 'IPv6', 'MAC Address', 'Subnetting', 'DNS', 'DHCP', 'HTTP', 'HTTPS', 'TCP', 'UDP', 'TCP Handshake', 'Router', 'Switch', 'Hub', 'Firewall', 'VPN', 'Proxy', 'Network Security'],
  Python: ['Variables', 'Data Types', 'Operators', 'Conditions', 'Loops', 'Functions', 'Lists', 'Tuples', 'Sets', 'Dictionaries', 'Strings', 'Exception Handling', 'Modules', 'Classes', 'Objects', 'Inheritance', 'Polymorphism', 'Encapsulation', 'File Handling'],
  SQL: ['Database', 'Table', 'SELECT', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'Aggregate Functions', 'Primary Key', 'Foreign Key', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'Subquery', 'Normalization', 'Index'],
  'Data Structures': ['Array', 'Linked List', 'Stack', 'Queue', 'Hash Table', 'Tree', 'Binary Tree', 'Binary Search Tree', 'Heap', 'Graph', 'Searching', 'Binary Search', 'Sorting', 'Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort'],
}

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const pathTopics = Object.values(learningPaths).flat()

export const topicCatalog: LearningPathTopic[] = Object.entries(requestedTopics).flatMap(([subject, names]) => names.map((name, index) => {
  const existing = pathTopics.find((item) => item.subject === subject && item.name.toLowerCase() === name.toLowerCase())
  return existing ?? { id: `${slug(subject)}-${slug(name)}`, name, subject, description: `Build a practical understanding of ${name}.`, difficulty: index < 5 ? 'Beginner' : index < 12 ? 'Intermediate' : 'Advanced', estimatedMinutes: 20, prerequisites: [], status: 'not-started', progress: 0, accuracy: 0 }
}))

export function findTopic(topicId: string) {
  return topicCatalog.find((topic) => topic.id === topicId) ?? topicCatalog.find((topic) => slug(topic.name) === topicId)
}
