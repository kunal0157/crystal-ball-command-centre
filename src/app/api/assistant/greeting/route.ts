import { NextRequest, NextResponse } from '../../../../lib/next-server-shim.ts';
import { APPROVALS_FIXTURE } from '../../../../lib/fixtures.ts';
import { GreetingResponseSchema } from '../../../../lib/schemas.ts';
import { buildGreetingSystemPrompt, buildGreetingUserPrompt } from '../../../../prompts/greeting.ts';
import { callLLM } from '../../../../lib/ai-client.ts';
import { checkRateLimit } from '../../../../lib/rate-limiter.ts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const sessionId = (body && body.sessionId) || 'default-session';
    const operatorName = (body && body.operatorName) || 'Operator';

    const rate = checkRateLimit(sessionId);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded.' },
        { status: 429, headers: { 'Retry-After': String(rate.resetInSec) } }
      );
    }

    const { text, isFallback } = await callLLM({
      systemPrompt: buildGreetingSystemPrompt(),
      userPrompt: buildGreetingUserPrompt(APPROVALS_FIXTURE, operatorName),
      timeoutMs: 8000,
    });

    if (!isFallback && text) {
      try {
        const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '').trim();
        const parsed = JSON.parse(cleaned);
        const validated = GreetingResponseSchema.parse({
          ...parsed,
          timestamp: new Date().toISOString(),
          isFallback: false,
        });
        return NextResponse.json(validated);
      } catch (_parseErr) {
        // Fall back to rule-based
      }
    }

    // Dynamic Context-Aware Greeting Fallback
    const highPriority = APPROVALS_FIXTURE.find((i) => i.urgency === 'high');
    const fallbackGreeting = GreetingResponseSchema.parse({
      greeting: `Welcome back, ${operatorName}. You currently have ${APPROVALS_FIXTURE.length} approvals pending in your queue, with high-priority safety items awaiting your review.`,
      pendingCount: APPROVALS_FIXTURE.length,
      highPriorityItem: highPriority?.title || 'Site Patrol Onboarding & Checklists',
      timestamp: new Date().toISOString(),
      isFallback: true,
    });

    return NextResponse.json(fallbackGreeting);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
