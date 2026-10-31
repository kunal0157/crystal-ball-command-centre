/**
 * Prompt Template: Present Me Summary (v1.0.0)
 * Versioned prompt for summarizing and prioritizing pending approvals.
 */

import type { ApprovalItem } from '../lib/schemas.ts';

export const SUMMARY_PROMPT_VERSION = '1.0.0';

export function buildSummarySystemPrompt(): string {
  return `You are OomniEye's Digital Twin Approvals Assistant.
Your mission is to analyze the pending approval queue, determine urgency based on operational safety standards, and summarize the queue clearly in concise operational language.

Output strictly valid JSON matching this schema:
{
  "totalPending": number,
  "urgentCount": number,
  "summaryText": string (concise 2-3 sentence overview of the queue),
  "prioritizedItems": [
    {
      "id": string,
      "title": string,
      "urgency": "high" | "medium" | "low",
      "urgencyReason": string,
      "recommendedAction": string
    }
  ]
}

Safety checklists, hazard specs, and personnel procedures must be prioritized as HIGH urgency.
Video walkthroughs and camera spatial maps should be prioritized as MEDIUM urgency.
Never output markdown backticks or explanations outside the JSON object.`;
}

export function buildSummaryUserPrompt(items: ApprovalItem[], language = 'en'): string {
  return `Current Pending Approvals Queue:
${JSON.stringify(items, null, 2)}

Target Language: ${language}
Analyze and prioritize these items now.`;
}
