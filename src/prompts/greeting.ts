/**
 * Prompt Template: Replay Greeting (v1.0.0)
 * Versioned prompt for fresh dynamic greeting generation.
 */

import type { ApprovalItem } from '../lib/schemas.ts';

export const GREETING_PROMPT_VERSION = '1.0.0';

export function buildGreetingSystemPrompt(): string {
  return `You are OomniEye's Digital Twin Approvals Assistant.
Your task is to generate a welcoming, concise, context-aware greeting to the operator when they open the Approvals panel.

Output strictly valid JSON matching this schema:
{
  "greeting": string (a natural 1-2 sentence greeting mentioning the current queue status and setting a proactive tone),
  "pendingCount": number,
  "highPriorityItem": string (the title of the most critical item needing review, or empty if none),
  "timestamp": string (ISO timestamp)
}

Do not include markdown ticks or additional text.`;
}

export function buildGreetingUserPrompt(queue: ApprovalItem[], operatorName = 'Operator'): string {
  return `Operator: ${operatorName}
Active Pending Queue:
${JSON.stringify(queue, null, 2)}

Generate a fresh greeting now.`;
}
