import { NextRequest, NextResponse } from '../../../../lib/next-server-shim.ts';
import { APPROVALS_FIXTURE } from '../../../../lib/fixtures.ts';
import { SummaryResponseSchema } from '../../../../lib/schemas.ts';
import { buildSummarySystemPrompt, buildSummaryUserPrompt } from '../../../../prompts/summary.ts';
import { callLLM } from '../../../../lib/ai-client.ts';
import { checkRateLimit } from '../../../../lib/rate-limiter.ts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const sessionId = (body && body.sessionId) || 'default-session';

    const rate = checkRateLimit(sessionId);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429, headers: { 'Retry-After': String(rate.resetInSec) } }
      );
    }

    const { text, isFallback } = await callLLM({
      systemPrompt: buildSummarySystemPrompt(),
      userPrompt: buildSummaryUserPrompt(APPROVALS_FIXTURE, body.language || 'en'),
      timeoutMs: 8000,
    });

    if (!isFallback && text) {
      try {
        // Strip any potential codeblock wrapper if model returned it
        const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '').trim();
        const parsed = JSON.parse(cleaned);
        const validated = SummaryResponseSchema.parse({
          ...parsed,
          generatedAt: new Date().toISOString(),
          isFallback: false,
        });
        return NextResponse.json(validated);
      } catch (_parseErr) {
        // Fall through to deterministic fallback if parsing or validation failed
      }
    }

    // Deterministic Rule-Based Fallback
    const highUrgency = APPROVALS_FIXTURE.filter(
      (item) => item.urgency === 'high' || item.title.includes('Safety') || item.title.includes('Checklist')
    );

    const fallbackResponse = SummaryResponseSchema.parse({
      totalPending: APPROVALS_FIXTURE.length,
      urgentCount: highUrgency.length,
      summaryText: `There are ${APPROVALS_FIXTURE.length} pending items requiring review. Immediate action is needed on ${highUrgency.length} critical safety items: "${highUrgency.map((h) => h.title).join('" and "')}".`,
      prioritizedItems: APPROVALS_FIXTURE.map((item) => ({
        id: item.id,
        title: item.title,
        urgency: item.urgency || (item.title.includes('Safety') ? 'high' : 'medium'),
        urgencyReason:
          item.urgency === 'high'
            ? 'Mandatory safety protocol compliance; potential operational blocker.'
            : 'Standard operational inspection required before digital-twin deployment.',
        recommendedAction:
          item.urgency === 'high'
            ? 'Review immediately and perform spatial snapshot verification.'
            : 'Validate camera coordinates and cross-reference with floor plan.',
      })),
      generatedAt: new Date().toISOString(),
      isFallback: true,
    });

    return NextResponse.json(fallbackResponse);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
