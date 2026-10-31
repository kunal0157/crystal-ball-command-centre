import { test, describe } from 'node:test';
import assert from 'node:assert';
import { APPROVALS_FIXTURE } from '../src/lib/fixtures.ts';
import { SummaryResponseSchema, GreetingResponseSchema, ChatRequestSchema } from '../src/lib/schemas.ts';
import { retrieveRelevantChunks } from '../src/lib/rag.ts';
import { buildSummarySystemPrompt, buildSummaryUserPrompt } from '../src/prompts/summary.ts';
import { buildChatSystemPrompt } from '../src/prompts/chat.ts';
import { buildGreetingSystemPrompt, buildGreetingUserPrompt } from '../src/prompts/greeting.ts';
import { checkRateLimit } from '../src/lib/rate-limiter.ts';

describe('1. Fixture & Schema Integrity Unit Tests', () => {
  test('Fixture has exactly 4 items with correct titles and submitters', () => {
    assert.strictEqual(APPROVALS_FIXTURE.length, 4);

    const titles = APPROVALS_FIXTURE.map((i) => i.title);
    assert.ok(titles.includes('Site Patrol Onboarding & Checklists'));
    assert.ok(titles.includes('Level 2 Drone Patrol Video Demo'));
    assert.ok(titles.includes('Safety Equipment & Sensor Specs'));
    assert.ok(titles.includes('360° Spatial Zone Layout & Camera Map'));

    const submitters = APPROVALS_FIXTURE.map((i) => i.submittedBy);
    assert.ok(submitters.includes('Sam HelpAdmin'));
    assert.ok(submitters.includes('Alex HelpAdmin'));
    assert.ok(submitters.includes('Elena HelpAdmin'));
  });

  test('SummaryResponseSchema correctly validates structured LLM response', () => {
    const validSummary = {
      totalPending: 4,
      urgentCount: 2,
      summaryText: 'Queue review required for critical safety documents.',
      prioritizedItems: [
        {
          id: 'app-001',
          title: 'Site Patrol Onboarding & Checklists',
          urgency: 'high' as const,
          urgencyReason: 'OSHA compliance',
          recommendedAction: 'Verify checklist',
        },
      ],
      generatedAt: new Date().toISOString(),
      isFallback: false,
    };

    const parsed = SummaryResponseSchema.parse(validSummary);
    assert.strictEqual(parsed.totalPending, 4);
    assert.strictEqual(parsed.urgentCount, 2);
  });

  test('GreetingResponseSchema validates dynamic context-aware greeting', () => {
    const validGreeting = {
      greeting: 'Welcome Operator. 4 approvals need your attention today.',
      pendingCount: 4,
      highPriorityItem: 'Site Patrol Onboarding & Checklists',
      timestamp: new Date().toISOString(),
      isFallback: false,
    };

    const parsed = GreetingResponseSchema.parse(validGreeting);
    assert.strictEqual(parsed.pendingCount, 4);
  });

  test('ChatRequestSchema rejects empty messages payload', () => {
    const invalidChat = {
      sessionId: 'sess-123',
      messages: [],
    };
    const result = ChatRequestSchema.safeParse(invalidChat);
    assert.strictEqual(result.success, false);
  });
});

describe('2. Prompt Versioning & Formatting Unit Tests', () => {
  test('Summary prompts include safety directives and JSON schema requirements', () => {
    const systemPrompt = buildSummarySystemPrompt();
    assert.ok(systemPrompt.includes('OomniEye'));
    assert.ok(systemPrompt.includes('totalPending'));
    assert.ok(systemPrompt.includes('Safety checklists'));

    const userPrompt = buildSummaryUserPrompt(APPROVALS_FIXTURE);
    assert.ok(userPrompt.includes('Site Patrol Onboarding & Checklists'));
  });

  test('Chat prompt embeds real-time approval fixture queue', () => {
    const chatPrompt = buildChatSystemPrompt(APPROVALS_FIXTURE);
    assert.ok(chatPrompt.includes('Sam HelpAdmin'));
    assert.ok(chatPrompt.includes('Drawing-Videos'));
  });

  test('Greeting prompt generates context-aware payload', () => {
    const greetingPrompt = buildGreetingUserPrompt(APPROVALS_FIXTURE, 'Sarah');
    assert.ok(greetingPrompt.includes('Sarah'));
    assert.ok(greetingPrompt.includes('Active Pending Queue'));
  });
});

describe('3. RAG Retrieval & SLA Knowledge Base Unit Tests', () => {
  test('RAG retrieves relevant safety policy chunks for urgency query', () => {
    const chunks = retrieveRelevantChunks('What is the SLA deadline for high urgency safety items?');
    assert.ok(chunks.length > 0);
    assert.ok(chunks[0].content.includes('4 Hours') || chunks[0].content.includes('HIGH URGENCY'));
  });

  test('RAG retrieves drone flight boundary guidelines for drone query', () => {
    const chunks = retrieveRelevantChunks('drone patrol video and flight boundaries');
    assert.ok(chunks.length > 0);
    assert.ok(chunks.some((c) => c.title.toLowerCase().includes('drone')));
  });
});

describe('4. Rate Limiter Unit Tests', () => {
  test('Allows requests under threshold and enforces limit', () => {
    const sessionId = 'test-session-' + Date.now();
    for (let i = 0; i < 30; i++) {
      const res = checkRateLimit(sessionId);
      assert.strictEqual(res.allowed, true);
    }

    const blocked = checkRateLimit(sessionId);
    assert.strictEqual(blocked.allowed, false);
    assert.strictEqual(blocked.remaining, 0);
  });
});
