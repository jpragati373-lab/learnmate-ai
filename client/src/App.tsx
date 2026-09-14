import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { LandingPage } from './pages/LandingPage'
import { LearnPage } from './pages/LearnPage'
import { TopicLearningPage } from './pages/TopicLearningPage'
import { PracticePage } from './pages/PracticePage'
import { PracticeResultsPage } from './pages/PracticeResultsPage'
import { LearningPathPage } from './pages/LearningPathPage'
import { RevisionPage } from './pages/RevisionPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { AssistantPage } from './pages/AssistantPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { ResponsibleAiPage } from './pages/ResponsibleAiPage'
import { FlashcardsPage } from './pages/FlashcardsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AppLayout />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/learn/topic/:topicId" element={<TopicLearningPage />} />
          <Route path="/learn/path" element={<LearningPathPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/practice/results" element={<PracticeResultsPage />} />
          <Route path="/revision" element={<RevisionPage />} />
          <Route path="/revision/flashcards" element={<FlashcardsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/profile" element={<OnboardingPage />} />
          <Route path="/responsible-ai" element={<ResponsibleAiPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
