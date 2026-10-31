import { NextRequest, NextResponse } from 'next/server';
import { APPROVALS_FIXTURE } from '../../../../lib/fixtures.ts';
import { TeachRequestSchema } from '../../../../lib/schemas.ts';
import { buildTeachSystemPrompt } from '../../../../prompts/teach.ts';
import { streamLLMTokens } from '../../../../lib/ai-client.ts';
import { checkRateLimit } from '../../../../lib/rate-limiter.ts';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = TeachRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid teach request', details: parsed.error.issues }, { status: 400 });
    }

    const { sessionId, step, userQuery } = parsed.data;

    const rate = checkRateLimit(sessionId);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(rate.resetInSec) } }
      );
    }

    const systemPrompt = buildTeachSystemPrompt(step, APPROVALS_FIXTURE);
    const userPrompt = userQuery
      ? `Step ${step} context. Operator asks: "${userQuery}"`
      : `Please introduce Step ${step} of the operator training workflow.`;

    const encoder = new TextEncoder();
    const customReadable = new ReadableStream({
      async start(controller) {
        let sentAnyToken = false;

        try {
          for await (const token of streamLLMTokens({
            systemPrompt,
            userPrompt,
            timeoutMs: 8000,
          })) {
            sentAnyToken = true;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token, isFallback: false })}\n\n`));
          }
        } catch (_err) {
          // ignore
        }

        if (!sentAnyToken) {
          const fallbackText = generateFallbackTeachStep(step, userQuery);
          const chunks = fallbackText.match(/.{1,12}/g) || [fallbackText];
          for (const chunk of chunks) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token: chunk, isFallback: true })}\n\n`));
            await new Promise((r) => setTimeout(r, 20));
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(customReadable, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function generateFallbackTeachStep(step: number, userQuery?: string): string {
  if (userQuery) {
    return `Regarding your question on Step ${step} ("${userQuery}"): In OomniEye, all digital-twin submissions must balance operator convenience with OSHA safety requirements. Review the file type and submitter before moving forward.`;
  }

  switch (step) {
    case 1:
      return `**Step 1: Queue Discovery & Urgency Triage**\nStart by scanning the 'Pending Approval Requests' list. Notice the badges: items like *Site Patrol Onboarding & Checklists* have high urgency due to safety impact. Prioritize these before reviewing media demo assets.`;
    case 2:
      return `**Step 2: Asset Inspection & Digital Twin Verification**\nClick 'Snapshot & Control' to open the 3D spatial viewer. Verify that camera coordinates match the floor layout and inspect point clouds for any missing markers.`;
    case 3:
      return `**Step 3: Compliance & Safety Standards**\nCheck sensor specs and checklist items against our OSHA/ISO guidelines. Confirm submitter credentials (e.g. Sam HelpAdmin) to ensure authorized sign-off.`;
    case 4:
      return `**Step 4: Executing Approval or Rejection**\nWhen ready, click 'Approve' to deploy assets into the digital twin, or 'Reject' with mandatory feedback if requirements are not met.`;
    case 5:
      return `**Step 5: Follow-up & Audit Trail**\nYour decision is recorded in the HMS Panel audit log. Review the synchronized dashboard to ensure the pending count updates properly.`;
    default:
      return `Step ${step}: Continue reviewing the queue and follow standardized digital-twin procedures.`;
  }
}
