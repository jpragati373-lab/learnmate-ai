# LearnMate AI

## Tagline

**Understand. Practice. Improve. Remember.**

## One-line Description

LearnMate AI is an AI-powered personalised learning platform that helps students understand difficult concepts, practise adaptively, identify weaknesses, revise at the right time, and measure learning progress.

## Problem Statement

Students often struggle with difficult technical concepts because explanation, practice, feedback, revision, and progress tracking are disconnected. A generic learning tool may answer a question, but it usually does not show whether the student understood the concept, what they should practise next, or when they should revisit it.

## Solution

LearnMate AI connects the complete learning loop:

**Understand → Practice → Evaluate → Detect Weakness → Recommend → Revise → Measure Progress**

Students receive a level-aware concept explanation, practise through an adaptive quiz, receive feedback, see weak and strong topics, get an explainable next-step recommendation, review revision items, and inspect learning analytics. LearnMate AI is more than a conversational chatbot: it connects AI assistance to a structured learning workflow.

## Key Features

- **AI Concept Explainer** — Provides explanations, analogies, examples, step-by-step guidance, common mistakes, summaries, and knowledge checks.
- **Personalized Learning Paths** — Provides subject roadmaps with topic status, prerequisites, difficulty, estimated time, and next steps.
- **Adaptive Quiz Engine** — Supports interactive multiple-choice practice with server-side answer evaluation and feedback.
- **Weak Topic Detection** — Classifies topic performance from quiz accuracy.
- **Personalized Recommendations** — Uses deterministic learning rules and recorded performance to recommend the next action.
- **Smart Revision** — Schedules due and upcoming reviews using learning performance and review intervals.
- **Learning Analytics** — Shows progress, accuracy, topic performance, trends, activity, insights, and retention indicators.
- **Contextual AI Study Assistant** — Answers questions using the student’s current subject, topic, level, learning style, and recent accuracy.
- **Responsible AI** — Discloses AI-generated and demo/fallback content and encourages verification of important information.
- **Accessibility** — Includes semantic headings, labelled controls, keyboard-friendly interactions, visible focus states, readable contrast, accessible errors, chart text summaries, and responsive layouts.
- **Demo/Fallback Mode** — Provides clearly labelled deterministic demo explanations, quiz questions, learning paths, and assistant responses when the external AI provider is unavailable.

## How AI Is Used

### AI handles

- Concept explanations
- Quiz generation
- Curriculum and learning-path assistance where applicable
- Contextual tutoring
- Misconception explanations
- Assistant responses

### Application logic handles

- Quiz scoring
- Accuracy calculation
- Weak/strong topic classification
- Adaptive difficulty rules
- Revision scheduling
- Analytics calculations
- Recommendation priority where deterministic rules are used
- UI state and navigation

This separation keeps uncertain model output from directly changing scores, classifications, revision dates, or analytics calculations.

## Innovation

Traditional learning tools often separate explanation, assessment, revision, and progress tracking. LearnMate AI connects them into one continuous learning loop:

**Understand → Practice → Evaluate → Detect Weakness → Recommend → Revise → Measure**

Instead of stopping after answering a student’s question, LearnMate AI uses practice performance to identify what the student may not understand, recommend what to practise next, schedule a review, and make progress visible.

## Target Users

The primary users are students and self-learners, especially technical learners and competitive-exam learners studying difficult academic or computing concepts.

## Intended Impact

LearnMate AI is intended to support:

- More personalised learning experiences
- More targeted practice
- Clearer understanding of difficult concepts
- Earlier identification of weak concepts
- More structured revision
- Better visibility into learning activity and progress

These are intended product benefits, not claims of guaranteed improvement or scientifically validated retention.

## Technology

### Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Lucide React

### Backend

- Express
- TypeScript
- Node.js

### Database and persistence

- No database is currently implemented.
- The hackathon build uses deterministic in-memory and demo state.

### AI integration

- OpenAI-compatible chat-completions provider
- Server-side provider calls
- Provider timeout handling
- Deterministic fallback content

### Charts and visualisation

- Recharts

### Validation and security

- Zod request and structured-response validation
- CORS with a configured client URL
- Server-side API-key handling
- Assistant request rate limiting
- JSON body-size limit
- Safe error messages without stack traces

### Testing

- Node’s built-in test runner with TypeScript execution through `tsx`
- Backend unit tests covering AI validation/fallbacks, quiz logic, recommendations, revision, analytics, and assistant validation
- Oxlint for frontend linting
- TypeScript checks through frontend and backend production builds

## Responsible AI

LearnMate AI uses AI as a learning assistant rather than an unquestionable authority. AI-generated explanations, questions, and assistant responses can contain mistakes, so users should verify important information with trusted sources. Uncertainty and fallback status are communicated through content labels and user-facing notices.

Users should not enter sensitive personal information. Provider API keys remain server-side, user inputs are validated, and the application does not expose system prompts or secrets to the frontend. The product’s deterministic application logic owns scoring, classifications, recommendations, revision scheduling, and analytics.

The retention indicator is a product metric for the demo and is not presented as scientifically validated memory or retention research.

AI-assisted development is disclosed below.

## AI Development Disclosure

AI development tools, including GitHub Copilot and other AI tools where applicable, assisted with code generation, debugging, UI development, documentation, architecture brainstorming, testing, and prompt development.

The developer reviewed, tested, modified, and integrated the resulting implementation and remains responsible for the final product.

## Security

Implemented security measures include:

- Environment-based configuration
- Server-side AI API keys
- Zod input validation
- Safe structured error responses
- Restricted CORS origins using `CLIENT_URL`
- In-memory rate limiting for assistant requests
- Server-side quiz answer evaluation
- Correct answers excluded from public quiz-question responses
- JSON request-size limits
- No unsafe HTML rendering in the learning-content UI

## Accessibility

Implemented accessibility measures include:

- Semantic headings and page structure
- Labels for form controls
- Keyboard-friendly buttons, links, radio controls, and text areas
- Visible focus states
- Accessible button names
- Error messages exposed with accessible alert semantics
- Readable contrast and font sizing
- Status information that does not rely only on colour
- Text summaries and labels alongside charts
- Responsive layouts for desktop, tablet, and mobile widths

## Limitations

- AI responses can be inaccurate and require verification.
- Demo/fallback content is used when the external AI provider is unavailable.
- No authentication is implemented.
- No persistent database or multi-user profile isolation is implemented.
- Demo state is static or in-memory and is not a persistent student account.
- The retention score is not scientifically validated.
- A production deployment and live provider configuration have not been verified in this workspace.
- The frontend production bundle includes a non-blocking Recharts bundle-size warning.

## Future Roadmap

Future work may include:

- Student authentication
- Persistent learner profiles and progress
- More subjects and curriculum coverage
- Richer personalisation based on longitudinal performance
- Multilingual learning support
- Teacher or mentor dashboards
- Secure document and study-material ingestion
- Validated spaced-repetition models

## Demo Flow

1. Open the Dashboard.
2. Open the Computer Networks learning path.
3. Select Subnetting.
4. Generate and read the AI concept explanation.
5. Click Quiz Me.
6. Submit an incorrect answer.
7. Show weak-topic detection.
8. Show the Practice Subnetting recommendation.
9. Open Revision and show Subnetting due for review.
10. Open Analytics and show topic performance and insights.
11. Open the AI Assistant and ask for a simpler explanation of Subnetting.

The intended demo state includes Subnetting at 48% accuracy, TCP vs UDP at 91%, and OSI Model at 64%. These values are demonstration records and are not claims about a real student.

## Submission Links

**Live Demo:** [PASTE VERIFIED LIVE DEMO URL]  
**GitHub:** [PASTE VERIFIED GITHUB URL]  
**Demo Video:** [PASTE VERIFIED VIDEO URL]

## Team

**Team Members:** [ADD ACTUAL TEAM MEMBERS]

## Final Judge Message

LearnMate AI turns learning from a one-time answer into a continuous improvement cycle. It helps students understand difficult concepts, discover what they need to practise, and return to what they need to remember.
