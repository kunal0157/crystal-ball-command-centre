/**
 * OomniEye Digital Twin Approval & Maintenance Policy Document
 * Chunks for in-memory keyword / vector similarity retrieval (RAG).
 */

export interface PolicyChunk {
  id: string;
  category: string;
  title: string;
  content: string;
  keywords: string[];
}

export const POLICY_CHUNKS: PolicyChunk[] = [
  {
    id: 'chunk-1',
    category: 'urgency_classification',
    title: 'Review Urgency Classification & SLA Guidelines',
    content: `All pending items submitted to the Approvals & Review queue must be prioritized according to their operational risk:
- HIGH URGENCY (SLA 4 Hours): Site safety procedures, hazard assessments, sensor calibrations, personnel onboarding checklists, and live security telemetry. Incomplete reviews directly breach site OSHA/ISO compliance.
- MEDIUM URGENCY (SLA 24 Hours): Drone patrol flight paths, video verification demos, 360 spatial zone layouts, camera coordinate updates, and non-critical hardware maintenance logs.
- LOW URGENCY (SLA 72 Hours): Historical archive updates, UI asset rebranding, optional training manuals, and routine cosmetic tag modifications.`,
    keywords: ['urgency', 'sla', 'priority', 'safety', 'guidelines', 'risk', 'hours', 'classification'],
  },
  {
    id: 'chunk-2',
    category: 'approval_procedure',
    title: 'Standard Review & Decision Execution Protocol',
    content: `Operators must follow the three-tier validation rule before approving any submission:
1. Verify Submitter Authority: Cross-reference the submitter badge (e.g. Sam HelpAdmin, Alex HelpAdmin, Elena HelpAdmin) against authorized role credentials for that facility zone.
2. Asset Integrity Check: Ensure digital-twin assets (point clouds, sensor spec PDFs, drone video clips) have complete coordinate metadata and timestamps within the last 48 hours.
3. Decision Affordance: Click 'Snapshot & Control' to simulate spatial impact before pressing 'Approve' or 'Reject with Reason'. All rejections require a mandatory ticket reference tag.`,
    keywords: ['procedure', 'protocol', 'review', 'approve', 'reject', 'authority', 'snapshot', 'decision', 'execute'],
  },
  {
    id: 'chunk-3',
    category: 'drone_and_spatial',
    title: 'Drone Patrol & 360 Spatial Zone Inspection Standards',
    content: `Video demos and spatial camera maps require strict flight-boundary verification:
- Drone patrol routes must avoid restricted red-zone airspace and maintain a minimum 5-meter buffer from high-voltage switchgear.
- Spatial 360 layouts must have calibrated LiDAR anchor points aligned to the master building floor plan.
- If GPS coordinates deviate by more than 0.5 meters from ground control points, flag as 'Discrepancy' and return to Alex or Elena HelpAdmin for recalibration.`,
    keywords: ['drone', 'video', 'spatial', 'zone', 'camera', 'lidar', 'flight', 'boundary', 'calibration'],
  },
  {
    id: 'chunk-4',
    category: 'escalation_fallback',
    title: 'Escalation Thresholds & Offline System Degradation',
    content: `When the AI Command Centre experiences provider latency exceeding 8 seconds or network degradation:
- The system automatically triggers deterministic rule-based prioritization: items with 'Safety' or 'Checklist' in the title automatically receive Highest Urgency.
- Operators must switch to manual review mode using HMS Panel export if AI summaries are flagged with 'fallback: true'.
- If 3 or more high-priority items remain pending for over 2 hours past SLA, automatically dispatch an alert to the Operations Supervisor on duty.`,
    keywords: ['escalation', 'offline', 'fallback', 'timeout', 'supervisor', 'degradation', 'latency', 'alert'],
  },
];

export function retrieveRelevantChunks(query: string, limit = 2): PolicyChunk[] {
  const normalizedQuery = query.toLowerCase();
  const queryTokens = normalizedQuery.split(/\s+/).filter((w) => w.length > 2);

  const scored = POLICY_CHUNKS.map((chunk) => {
    let score = 0;
    const chunkText = (chunk.title + ' ' + chunk.content + ' ' + chunk.keywords.join(' ')).toLowerCase();

    for (const token of queryTokens) {
      if (chunk.keywords.some((kw) => kw.includes(token))) {
        score += 3;
      }
      if (chunk.title.toLowerCase().includes(token)) {
        score += 2;
      }
      const matches = (chunkText.match(new RegExp(token, 'g')) || []).length;
      score += matches;
    }

    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.chunk);
}

