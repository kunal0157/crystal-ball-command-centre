import { NextResponse } from 'next/server';
import { APPROVALS_FIXTURE } from '@/lib/fixtures.ts';

export async function GET() {
  return NextResponse.json({
    items: APPROVALS_FIXTURE,
    total: APPROVALS_FIXTURE.length,
    timestamp: new Date().toISOString(),
  });
}
