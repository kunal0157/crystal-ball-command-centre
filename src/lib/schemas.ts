import { z } from 'zod';

export const ApprovalItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['Folder', 'Video', 'PDF', 'Image']),
  submittedBy: z.string(),
  date: z.string(),
  status: z.string(),
  path: z.string(),
  urgency: z.enum(['high', 'medium', 'low']).optional(),
  priorityScore: z.number().optional(),
});

export type ApprovalItem = z.infer<typeof ApprovalItemSchema>;

export const SummaryResponseSchema = z.object({
  totalPending: z.number(),
  urgentCount: z.number(),
  summaryText: z.string(),
  prioritizedItems: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      urgency: z.enum(['high', 'medium', 'low']),
      urgencyReason: z.string(),
      recommendedAction: z.string(),
    })
  ),
  generatedAt: z.string(),
  isFallback: z.boolean().default(false),
});

export type SummaryResponse = z.infer<typeof SummaryResponseSchema>;

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  timestamp: z.string().optional(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatRequestSchema = z.object({
  sessionId: z.string().min(1),
  messages: z.array(ChatMessageSchema).min(1),
  language: z.string().default('en'),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

export const HelpRequestSchema = z.object({
  sessionId: z.string().min(1),
  query: z.string().min(1),
  language: z.string().default('en'),
});

export type HelpRequest = z.infer<typeof HelpRequestSchema>;

export const TeachRequestSchema = z.object({
  sessionId: z.string().min(1),
  step: z.number().int().min(1).max(5).default(1),
  userQuery: z.string().optional(),
  approvalId: z.string().optional(),
  language: z.string().default('en'),
});

export type TeachRequest = z.infer<typeof TeachRequestSchema>;

export const GreetingResponseSchema = z.object({
  greeting: z.string(),
  pendingCount: z.number(),
  highPriorityItem: z.string().optional(),
  timestamp: z.string(),
  isFallback: z.boolean().default(false),
});

export type GreetingResponse = z.infer<typeof GreetingResponseSchema>;

