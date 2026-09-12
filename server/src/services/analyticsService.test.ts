import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateOverallProgress, calculateQuizAccuracy, calculateSubjectPerformance, calculateTopicPerformance, calculateLearningTrend, calculateStudyStreak, calculateRetentionScore, generateLearningInsights } from './analyticsService.js'
test('calculates overall progress from topic records', () => assert.equal(calculateOverallProgress().percentage, 40))
test('calculates weighted quiz accuracy', () => assert.equal(calculateQuizAccuracy().accuracy, 71))
test('calculates subject accuracy', () => assert.equal(calculateSubjectPerformance().find((item) => item.subject === 'SQL')?.accuracy, 83))
test('reuses topic strength thresholds', () => assert.equal(calculateTopicPerformance().find((item) => item.name === 'Recursion')?.classification, 'Needs Practice'))
test('returns chronological learning trend', () => assert.deepEqual(calculateLearningTrend().map((item) => item.score), [70, 90, 42]))
test('calculates a consecutive study streak', () => assert.equal(calculateStudyStreak().current, 5))
test('calculates an explainable retention score', () => assert.equal(calculateRetentionScore(), 63))
test('generates data-backed insights', () => assert.equal(generateLearningInsights().length, 4))
