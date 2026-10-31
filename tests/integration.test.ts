import { test, describe } from 'node:test';
import assert from 'node:assert';
import { POST as handleSummary } from '../src/app/api/assistant/summary/route.ts';
import { POST as handleGreeting } from '../src/app/api/assistant/greeting/route.ts';
import { POST as handleChat } from '../src/app/api/assistant/chat/route.ts';

describe('AI API Endpoints Integration & Fallback Tests', () => {
  test('POST /api/assistant/summary returns valid structured JSON with graceful offline fallback', async () => {
    // When no API key is provided or provider times out, it must degrade gracefully
    const dummyReq = {
      json: async () => ({ sessionId: 'test-summary-session', language: 'en' }),
    } as any;

    const response = await handleSummary(dummyReq);
    assert.strictEqual(response.status, 200);

    const body = await response.json();
    assert.strictEqual(body.totalPending, 4);
    assert.strictEqual(body.urgentCount, 2);
    assert.strictEqual(body.isFallback, true);
    assert.strictEqual(Array.isArray(body.prioritizedItems), true);
    assert.strictEqual(body.prioritizedItems.length, 4);

    // Verify critical items are prioritized
    const firstItem = body.prioritizedItems[0];
    assert.ok(firstItem.urgency === 'high');
  });

  test('POST /api/assistant/greeting generates context-aware greeting without raw crash', async () => {
    const dummyReq = {
      json: async () => ({ sessionId: 'test-greeting-session', operatorName: 'TestOperator' }),
    } as any;

    const response = await handleGreeting(dummyReq);
    assert.strictEqual(response.status, 200);

    const body = await response.json();
    assert.strictEqual(body.pendingCount, 4);
    assert.ok(body.greeting.includes('TestOperator'));
    assert.strictEqual(body.isFallback, true);
  });

  test('POST /api/assistant/chat handles SSE stream properly without crashing', async () => {
    const dummyReq = {
      json: async () => ({
        sessionId: 'test-chat-session',
        messages: [{ role: 'user', content: 'Which approval needs attention first?' }],
      }),
    } as any;

    const response = await handleChat(dummyReq);
    assert.strictEqual(response.status, 200);
    assert.ok(response.body);

    // Consume the stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let streamText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      streamText += decoder.decode(value);
    }

    assert.ok(streamText.includes('data:'));
    assert.ok(streamText.includes('[DONE]'));
    assert.ok(streamText.includes('Site Patrol Onboarding & Checklists') || streamText.includes('Safety'));
  });

  test('POST /api/assistant/chat enforces Zod validation error for empty payload', async () => {
    const invalidReq = {
      json: async () => ({ sessionId: '', messages: [] }),
    } as any;

    const response = await handleChat(invalidReq);
    assert.strictEqual(response.status, 400);

    const body = await response.json();
    assert.strictEqual(body.error, 'Invalid chat request');
  });
});
