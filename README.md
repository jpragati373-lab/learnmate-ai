# LearnMate AI

**Understand. Practice. Improve. Remember.**

**LearnMate AI is a personalized learning and practice platform that helps students understand difficult concepts, practise them adaptively, identify weak topics, revise at the right time, and decide what to learn next.**

## Problem

Students often receive explanations without knowing whether they understood them. Their practice is frequently random, weaknesses stay hidden, and revision is easy to forget.

## Target Users

College students and competitive-exam learners studying technical and academic subjects.

## Solution and key features

- Level-aware AI concept explanations with analogies, examples, mistakes, summaries, and knowledge checks
- Personalized learning paths with prerequisites and next-step recommendations
- Adaptive MCQ/true-false practice with server-side answer evaluation
- Weak/strong topic detection and explainable recommendations
- Smart revision scheduling and retention indicators
- Learning analytics, trends, activity, and contextual AI study assistant
- Transparent demo fallback content when an AI provider is unavailable

## How it works

Landing → onboarding → dashboard → learning path → explanation → assistant → practice → results → revision → analytics. Deterministic application logic owns scores, progress, recommendations, revision timing, and analytics; AI supplies explanations, question content, and conversational help.

## AI architecture

The server calls an OpenAI-compatible chat-completions provider only when `AI_API_KEY` is configured. Zod validates requests and structured responses. Provider timeouts and invalid responses use clearly labelled deterministic demo content. See [docs/architecture.md](./docs/architecture.md) and [docs/responsible-ai.md](./docs/responsible-ai.md).

## System architecture and tech stack

- Frontend: React 19, TypeScript, Vite, React Router, Tailwind CSS, Recharts
- Backend: Express 5, TypeScript, Zod, CORS, dotenv
- Storage: deterministic in-memory/demo state (no authentication or database in this hackathon build)

## Project structure

```text
client/src/pages       Product screens
client/src/components  Reusable UI
client/src/services    API clients and client demo helpers
server/src/routes      HTTP endpoints
server/src/services    AI and deterministic learning logic
server/src/services/*.test.ts  Backend unit tests
docs                    Architecture, testing, pitch and readiness notes
```

## Screenshots

Capture the recommended judge-facing screens listed in [docs/screenshots.md](./docs/screenshots.md) after starting the local demo. No screenshots are committed until they are captured from the verified application.

## Local setup

```bash
npm install --prefix client
npm install --prefix server
copy .env.example server\.env
```

The copy command is for Windows PowerShell/cmd. Never commit `.env`.

## Environment variables

See [.env.example](./.env.example). The backend uses `PORT`, `AI_API_KEY`, `AI_API_URL`, `AI_MODEL`, `DATABASE_URL`, and `CLIENT_URL`. The Vite build uses `VITE_API_BASE_URL` to reach the deployed backend. AI keys remain server-side.

## Running the application

```bash
npm run dev:server
npm run dev:client
```

Open `http://localhost:5173`. The API runs on `http://localhost:4000` locally. For production, set `VITE_API_BASE_URL` to the verified backend URL at frontend build time and set `CLIENT_URL` to the exact frontend origin on the backend.

## Deployment

Deploy `client/` as a Vite static site and `server/` as a Node service. Build the frontend with `npm run build` from `client/`, and run the backend with `npm start` from `server/`. Configure `VITE_API_BASE_URL` on the frontend and `PORT`, `CLIENT_URL`, and optional AI provider variables on the backend. Configure SPA fallback to serve `client/dist/index.html` for client-side routes. No live deployment URL is claimed until it is verified.

## Testing and validation

```bash
npm run build:client
npm run build:server
npm --prefix server test
npm --prefix client run lint
```

The latest verified results are recorded in [docs/test-report.md](./docs/test-report.md). The frontend build may report a non-blocking bundle-size warning from Recharts.

## Demo flow

Use **Start Learning**, complete onboarding, select Computer Networks/Subnetting, generate an explanation, ask the assistant about subnet masks, start practice, intentionally miss a question, inspect results, then open revision and analytics. Demo content is labelled and uses deterministic sample learning activity; it is not a claim about a real student.

## Responsible AI and security

AI content is disclosed and should be verified. Provider keys are server-only, requests are validated, assistant traffic is rate-limited, correct quiz answers are not sent to the browser, and errors do not expose stack traces. Review [docs/responsible-ai.md](./docs/responsible-ai.md).

## Accessibility

The interface uses semantic headings, labelled controls, visible focus styles, keyboard-friendly controls, text summaries for charts, and status text that does not rely only on colour.

## Known limitations

There is no authentication, database persistence, multi-user isolation, production deployment, or unrestricted file upload in this build. Demo state is in memory/static data, so a refresh does not represent a persistent account. Provider output can still be wrong and requires verification.

## Future roadmap

Add authenticated persistence, secure document ingestion, richer question types, spaced-repetition personalisation from longitudinal data, and production observability.

## AI Use Declaration

AI development tools including GitHub Copilot were used to assist with code generation, debugging, documentation, UI implementation, and AI prompt development. **The developer reviewed, tested and modified generated code and remains responsible for the submitted implementation.**
