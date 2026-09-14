import { z } from 'zod'

export const explanationRequestSchema = z.object({
  topic: z.string().trim().min(2).max(160),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  learningStyle: z.enum(['simple', 'step-by-step', 'example-based', 'analogy', 'exam-focused', 'example']),
  instruction: z.string().trim().max(160).optional(),
})

const quickCheckSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string().min(1)).length(4),
  explanation: z.string().min(1),
})

export const explanationResponseSchema = z.object({
  topic: z.string().min(1),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  definition: z.string().min(1),
  quickExplanation: z.string().min(1),
  simpleExample: z.string().min(1),
  whyItMatters: z.string().min(1),
  keyPoints: z.array(z.string().min(1)).min(3).max(6),
  rememberThis: z.string().min(1),
  commonMistakes: z.array(z.string().min(1)).min(1).max(6),
  quickCheck: quickCheckSchema,
  optionalDeeperExplanation: z.string().min(1),
  relatedTopics: z.array(z.string().min(1)).max(8),
  source: z.enum(['ai', 'demo']).default('ai'),
  // Compatibility fields used by the existing explanation cards and assistant.
  explanation: z.string().min(1),
  analogy: z.string().min(1),
  steps: z.array(z.string().min(1)).min(1).max(8),
  example: z.string().min(1),
  summary: z.array(z.string().min(1)).min(1).max(6),
  knowledgeChecks: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })).length(3),
})

export type ExplanationRequest = z.infer<typeof explanationRequestSchema>
export type ExplanationResponse = z.infer<typeof explanationResponseSchema>

type TopicSeed = {
  definition: string
  quick: string
  example: string
  why: string
  points: string[]
  remember: string
  mistakes: string[]
  check: { question: string; options: string[]; answer: number; explanation: string }
  related: string[]
}

const seeds: Record<string, TopicSeed> = {
  'vpn': { definition: 'A Virtual Private Network (VPN) creates an encrypted connection between a device and a VPN server.', quick: 'A VPN routes network traffic through a VPN server and encrypts the connection, adding privacy and security on networks you do not control.', example: 'On public Wi-Fi, a VPN acts like a protected tunnel between your laptop and the VPN server.', why: 'It can reduce exposure on untrusted networks and hide your IP address from many websites.', points: ['Encrypts traffic between the device and VPN server', 'Routes traffic through a VPN server', 'Can hide the device IP from many websites', 'Does not guarantee anonymity'], remember: 'VPN = an encrypted connection through a VPN server.', mistakes: ['A VPN does not make you completely anonymous.', 'A VPN does not protect against every phishing attack or malware.'], check: { question: 'What is the main purpose of a VPN?', options: ['Increase CPU speed', 'Create a secure connection', 'Store files', 'Compile programs'], answer: 1, explanation: 'A VPN primarily creates an encrypted connection through a VPN server.' }, related: ['IP Address', 'DNS', 'HTTP vs HTTPS', 'Firewall'] },
  'subnetting': { definition: 'Subnetting divides an IP network into smaller logical networks called subnets.', quick: 'Subnetting uses a longer network prefix to split one IP network into smaller groups, making address allocation and routing easier to manage.', example: 'A /24 network can be divided into four /26 subnets, each with its own address range.', why: 'It helps organisations use addresses efficiently, limit broadcast domains, and structure routing.', points: ['Prefix length identifies the network portion', 'Each subnet has a network and broadcast address', 'Usable host count depends on host bits', 'Subnet masks describe the boundary'], remember: 'More network bits create smaller subnets with fewer hosts.', mistakes: ['Do not count the network and broadcast addresses as ordinary hosts.', 'A subnet mask and a default gateway serve different purposes.'], check: { question: 'What does subnetting do?', options: ['Encrypt all traffic', 'Split a network into smaller networks', 'Replace DNS', 'Increase CPU speed'], answer: 1, explanation: 'Subnetting divides a larger IP network into smaller logical networks.' }, related: ['IP Address', 'CIDR', 'Routing', 'Networking Basics'] },
  'ip address': { definition: 'An IP address is a logical identifier assigned to a device or network interface for communication.', quick: 'An IP address helps networks identify where data should come from and where it should go.', example: 'A home router may assign a laptop a private address such as 192.168.1.20.', why: 'Devices need logical addresses so routers can forward packets to the right network.', points: ['IPv4 uses 32 bits', 'IPv6 uses 128 bits', 'Private addresses are used inside local networks', 'Routers connect different IP networks'], remember: 'IP addresses identify network locations, not people.', mistakes: ['An IP address is not the same as a MAC address.', 'A private IP is not directly routable across the public internet.'], check: { question: 'What is an IP address used for?', options: ['Identifying a network location', 'Storing a password', 'Compiling code', 'Formatting a disk'], answer: 0, explanation: 'IP addresses identify logical network locations for packet delivery.' }, related: ['Subnetting', 'CIDR', 'DNS', 'Router vs Switch'] },
  'osi model': { definition: 'The OSI model is a seven-layer reference model for understanding network communication.', quick: 'The OSI model separates networking responsibilities into seven layers, from physical signals to applications.', example: 'A web request uses application protocols, transport delivery, network addressing, and lower-layer transmission.', why: 'Layering gives engineers a shared way to troubleshoot and design networks.', points: ['Seven layers describe different responsibilities', 'Layers communicate with adjacent layers', 'Transport handles end-to-end delivery', 'Network handles logical addressing and routing'], remember: 'Please Do Not Throw Sausage Pizza Away: Physical to Application.', mistakes: ['The OSI model is a reference model, not a literal stack in every implementation.', 'TCP is a transport protocol, not an application-layer protocol.'], check: { question: 'Which OSI layer handles logical addressing and routing?', options: ['Physical', 'Data Link', 'Network', 'Presentation'], answer: 2, explanation: 'The Network layer handles logical addressing and routing.' }, related: ['TCP vs UDP', 'IP Address', 'TCP Handshake', 'Networking Basics'] },
  'tcp vs udp': { definition: 'TCP and UDP are transport-layer protocols with different delivery trade-offs.', quick: 'TCP provides reliable, ordered delivery using a connection; UDP sends datagrams with lower overhead but no built-in delivery guarantee.', example: 'File downloads usually need TCP, while a live voice call may prefer UDP to avoid waiting for late packets.', why: 'The choice affects reliability, latency, and how an application handles loss.', points: ['TCP acknowledges and retransmits data', 'UDP has lower protocol overhead', 'TCP preserves order', 'UDP suits some real-time traffic'], remember: 'TCP prioritises reliable delivery; UDP prioritises low overhead and delay.', mistakes: ['UDP is not automatically insecure.', 'TCP is not always slower in every workload.'], check: { question: 'Which protocol provides reliable ordered delivery by default?', options: ['TCP', 'UDP', ['DNS', 'HTTP', 'IP'][0], 'ARP'], answer: 0, explanation: 'TCP acknowledges data and retransmits missing segments.' }, related: ['TCP Handshake', 'OSI Model', 'HTTP vs HTTPS', 'Networking Basics'] },
  'dns': { definition: 'The Domain Name System (DNS) maps human-readable domain names to network addresses.', quick: 'DNS lets people use names such as example.com while computers use IP addresses to locate services.', example: 'A browser asks a DNS resolver for the address associated with a website name.', why: 'Name resolution makes internet services easier to use and change without memorising addresses.', points: ['Resolvers answer client queries', 'Records can map names to addresses', 'Caching reduces repeated lookups', 'DNS is separate from HTTP'], remember: 'DNS is the internet naming system.', mistakes: ['DNS does not carry the webpage itself.', 'Changing a DNS record may take time to appear because of caching.'], check: { question: 'What does DNS primarily provide?', options: ['Name-to-address resolution', 'File encryption', 'CPU scheduling', 'Database joins'], answer: 0, explanation: 'DNS resolves names into network addresses.' }, related: ['IP Address', 'HTTP vs HTTPS', 'VPN', 'Networking Basics'] },
  'http vs https': { definition: 'HTTP transfers web messages; HTTPS is HTTP protected by TLS encryption and authentication.', quick: 'HTTPS helps protect web traffic from tampering and eavesdropping while verifying the server certificate.', example: 'When a browser shows a lock icon, the connection commonly uses HTTPS.', why: 'It protects logins, payments, and other data sent between a browser and server.', points: ['HTTPS uses TLS', 'Certificates help authenticate servers', 'Encryption protects data in transit', 'HTTPS does not make a website trustworthy by itself'], remember: 'HTTPS = HTTP over a protected TLS connection.', mistakes: ['HTTPS does not guarantee the site has honest content.', 'Encryption in transit does not replace secure passwords or authorization.'], check: { question: 'What does HTTPS add to HTTP?', options: ['TLS protection', 'More CPU cores', 'A database schema', 'A new programming language'], answer: 0, explanation: 'HTTPS uses TLS to protect and authenticate the connection.' }, related: ['DNS', 'VPN', 'TCP vs UDP', 'Firewall'] },
  'firewall': { definition: 'A firewall controls network traffic using rules about sources, destinations, ports, or applications.', quick: 'A firewall acts as a traffic filter that allows or blocks connections according to a security policy.', example: 'A firewall may allow web traffic but block an unexpected inbound service port.', why: 'Filtering reduces unwanted access and limits the impact of exposed services.', points: ['Rules define allowed traffic', 'Firewalls can filter inbound and outbound traffic', 'They may inspect state or application data', 'A firewall is one security layer'], remember: 'Firewall decisions follow traffic rules.', mistakes: ['A firewall cannot fix insecure application logic.', 'Allowing a port does not prove the service is safe.'], check: { question: 'What does a firewall primarily do?', options: ['Filter network traffic', 'Translate Python code', 'Store backups', 'Create user interfaces'], answer: 0, explanation: 'Firewalls apply rules to allow or block network traffic.' }, related: ['VPN', 'HTTP vs HTTPS', 'IP Address', 'Router vs Switch'] },
}

const extraTopics = ['what is computer networking', 'mac address', 'router vs switch', 'tcp handshake', 'variables', 'data types', 'lists', 'tuples', 'dictionaries', 'functions', 'loops', 'oop', 'inheritance', 'exception handling', 'database', 'select', 'where', 'group by', 'join', 'inner join', 'left join', 'subquery', 'primary key', 'foreign key', 'normalization', 'array', 'linked list', 'stack', 'queue', 'tree', 'binary search tree', 'graph', 'hash table', 'searching', 'sorting']

function keyFor(topic: string) { return topic.toLowerCase().replace(/[^\w]+/g, ' ').trim() }
function fallbackSeed(topic: string): TopicSeed {
  return { definition: `${topic} is a concept with a central rule, useful parts, and conditions that affect how it behaves.`, quick: `${topic} becomes easier to learn when you connect its definition to a small example and then test what changes when an input changes.`, example: `Use a small ${topic} example: identify the inputs, apply the main rule, and check the result.`, why: `Understanding ${topic} helps you solve related problems instead of memorising an isolated definition.`, points: ['Start with the core definition', 'Identify the important parts', 'Apply the rule to an example', 'Check assumptions and edge cases'], remember: `Define ${topic}, apply it, then verify the result.`, mistakes: ['Memorising terms without applying them.', 'Ignoring the assumptions of the example.'], check: { question: `Which approach best helps you learn ${topic}?`, options: ['Apply the idea to an example', 'Skip the definition', 'Ignore assumptions', 'Memorise unrelated facts'], answer: 0, explanation: 'A concrete example connects the definition to observable behaviour.' }, related: [] }
}

function buildResponse(request: ExplanationRequest, seed: TopicSeed, source: 'ai' | 'demo'): ExplanationResponse {
  const style = request.learningStyle === 'example' ? 'example-based' : request.learningStyle
  const quick = style === 'step-by-step' ? seed.points.map((point, index) => `${index + 1}. ${point}`).join(' ') : style === 'exam-focused' ? `${seed.definition} Exam focus: ${seed.points.slice(0, 3).join('; ')}.` : style === 'analogy' ? `${seed.example} Technically, ${seed.quick.toLowerCase()}` : style === 'example-based' ? `${seed.example} This demonstrates the core idea: ${seed.quick}` : seed.quick
  const deeper = request.level === 'beginner' ? seed.quick : request.level === 'intermediate' ? `${seed.quick} The important relationship is between the components and the conditions under which the rule applies.` : `${seed.quick} In practice, also consider implementation trade-offs, boundary conditions, and what happens when the expected assumptions do not hold.`
  return explanationResponseSchema.parse({ topic: request.topic.trim(), level: request.level, definition: seed.definition, quickExplanation: quick, simpleExample: seed.example, whyItMatters: seed.why, keyPoints: seed.points, rememberThis: seed.remember, commonMistakes: seed.mistakes, quickCheck: { question: seed.check.question, options: seed.check.options, explanation: seed.check.explanation }, optionalDeeperExplanation: deeper, relatedTopics: seed.related.length ? seed.related : extraTopics.filter((item) => item !== keyFor(request.topic)).slice(0, 4).map((item) => item.replace(/\b\w/g, (letter) => letter.toUpperCase())), source, explanation: seed.quick, analogy: seed.example, steps: seed.points, example: seed.example, summary: seed.points.slice(0, 4), knowledgeChecks: [{ question: seed.check.question, answer: seed.check.options[seed.check.answer] }, { question: `What is one practical use of ${request.topic}?`, answer: seed.why }, { question: `What should you check when applying ${request.topic}?`, answer: seed.mistakes[0] }] })
}

export function demoExplanation(request: ExplanationRequest): ExplanationResponse {
  return buildResponse(request, seeds[keyFor(request.topic)] ?? fallbackSeed(request.topic), 'demo')
}

const tutorSystemPrompt = `You are LearnMate Learning Tutor. Return only JSON with definition, quickExplanation, simpleExample, whyItMatters, keyPoints, rememberThis, commonMistakes, quickCheck (question, options, explanation; never include the correct answer), optionalDeeperExplanation, relatedTopics, topic and level. Keep the initial explanation concise and adapt it to the requested level and style.`

async function requestProvider(request: ExplanationRequest): Promise<ExplanationResponse> {
  const apiKey = process.env.AI_API_KEY
  if (!apiKey) throw new Error('AI provider is not configured')
  const response = await fetch(process.env.AI_API_URL ?? 'https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` }, body: JSON.stringify({ model: process.env.AI_MODEL ?? 'gpt-4o-mini', temperature: 0.2, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: tutorSystemPrompt }, { role: 'user', content: JSON.stringify(request) }] }), signal: AbortSignal.timeout(15000) })
  if (!response.ok) throw new Error(`AI provider returned ${response.status}`)
  const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> }
  const content = payload.choices?.[0]?.message?.content
  if (!content) throw new Error('AI provider returned an invalid response')
  const parsed = JSON.parse(content) as Omit<ExplanationResponse, 'source' | 'explanation' | 'analogy' | 'steps' | 'example' | 'summary' | 'knowledgeChecks'>
  const seed = fallbackSeed(request.topic)
  return buildResponse(request, { ...seed, definition: parsed.definition, quick: parsed.quickExplanation, example: parsed.simpleExample, why: parsed.whyItMatters, points: parsed.keyPoints, remember: parsed.rememberThis, mistakes: parsed.commonMistakes, related: parsed.relatedTopics }, 'ai')
}

export async function generateExplanation(input: ExplanationRequest): Promise<ExplanationResponse> {
  try { return await requestProvider(input) } catch { return demoExplanation(input) }
}

export function validateQuickCheck(topic: string, selectedOption: number) {
  const seed = seeds[keyFor(topic)] ?? fallbackSeed(topic)
  return { correct: selectedOption === seed.check.answer, explanation: seed.check.explanation }
}

export { extraTopics }
