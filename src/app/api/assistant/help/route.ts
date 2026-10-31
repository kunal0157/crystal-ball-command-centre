import { NextRequest, NextResponse } from 'next/server';
import { HelpRequestSchema } from '../../../../lib/schemas.ts';
import { retrieveRelevantChunks } from '../../../../lib/rag.ts';
import { buildHelpSystemPrompt, buildHelpUserPrompt } from '../../../../prompts/help.ts';
import { streamLLMTokens } from '../../../../lib/ai-client.ts';
import { checkRateLimit } from '../../../../lib/rate-limiter.ts';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = HelpRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid help query', details: parsed.error.issues }, { status: 400 });
    }

    const { sessionId, query } = parsed.data;

    const rate = checkRateLimit(sessionId);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(rate.resetInSec) } }
      );
    }

    // RAG step: In-memory keyword/similarity retrieval
    const relevantChunks = retrieveRelevantChunks(query, 2);
    const systemPrompt = buildHelpSystemPrompt(relevantChunks);
    const userPrompt = buildHelpUserPrompt(query);

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
          // Fallback RAG response directly built from the matched chunks
          const fallbackHelp = generateFallbackHelpReply(query, relevantChunks);
          const chunks = fallbackHelp.match(/.{1,12}/g) || [fallbackHelp];
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

function generateFallbackHelpReply(query: string, chunks: ReturnType<typeof retrieveRelevantChunks>): string {
  if (chunks.length === 0) {
    return 'According to standard OomniEye protocol: All pending items must be reviewed against facility safety compliance within their assigned SLA. High-priority items have a 4-hour SLA.';
  }

  const primaryChunk = chunks[0];
  return `According to **${primaryChunk.title}**:\n\n${primaryChunk.content}\n\n*(Grounded directly in OomniEye Operational Guidelines)*`;
}
