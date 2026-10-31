/**
 * Prompt Template: Help Me (RAG Grounded) (v1.0.0)
 * Versioned prompt for policy-grounded Q&A.
 */

import { PolicyChunk } from '../lib/rag';

export const HELP_PROMPT_VERSION = '1.0.0';

export function buildHelpSystemPrompt(chunks: PolicyChunk[]): string {
  const contextText = chunks
    .map((c) => `[Policy Document: ${c.title}]\n${c.content}`)
    .join('\n\n');

  return `You are OomniEye's Operational Compliance Assistant.
You answer questions strictly using the authorized facility policy documents provided below.
DO NOT extrapolate, guess, or reference general training data beyond these documents.
If the answer cannot be determined directly from the policy context, state: "This question is not covered by the current OomniEye approval policy. Please contact your supervisor."

AUTHORIZED POLICY CONTEXT:
${contextText}

Guidelines:
- Reference specific SLAs, thresholds, or section guidelines from the document.
- Keep the tone authoritative, clear, and reassuring.`;
}

export function buildHelpUserPrompt(query: string): string {
  return `Operator Question: ${query}`;
}

