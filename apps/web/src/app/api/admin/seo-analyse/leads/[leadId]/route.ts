import { NextRequest, NextResponse } from 'next/server';
import { getDb, leads, eq } from '@floww/db';
import { requireAdminAuth } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ValidLeadStatus = 'new' | 'called' | 'meeting' | 'won' | 'lost';
const VALID_STATUSES: ValidLeadStatus[] = ['new', 'called', 'meeting', 'won', 'lost'];

interface UpdateLeadBody {
  status?: ValidLeadStatus;
  owner?: string;
  notes?: string;
  contactName?: string;
  email?: string;
  phone?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { leadId } = await params;
    if (!leadId) {
      return NextResponse.json({ error: 'Mangler leadId.' }, { status: 400 });
    }

    const body = (await request.json().catch(() => ({}))) as UpdateLeadBody;
    const db = getDb();

    const [existing] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: 'Fant ikke lead.' }, { status: 404 });
    }

    const now = new Date();
    const nextStatus: ValidLeadStatus =
      body.status && VALID_STATUSES.includes(body.status)
        ? body.status
        : existing.status;

    // When moving away from 'new', stamp calledAt and clear SLA breach
    const shouldStampCalledAt =
      existing.status === 'new' && nextStatus !== 'new' && !existing.calledAt;

    const [updated] = await db
      .update(leads)
      .set({
        status: nextStatus,
        owner: body.owner !== undefined ? body.owner.trim() || 'Simen' : existing.owner,
        notes: body.notes !== undefined ? body.notes : existing.notes,
        contactName:
          body.contactName !== undefined ? body.contactName : existing.contactName,
        email: body.email !== undefined ? body.email : existing.email,
        phone: body.phone !== undefined ? body.phone : existing.phone,
        calledAt: shouldStampCalledAt ? now : existing.calledAt,
        slaBreached: nextStatus !== 'new' ? false : existing.slaBreached,
        updatedAt: now,
      })
      .where(eq(leads.id, leadId))
      .returning();

    return NextResponse.json({
      success: true,
      lead: updated,
    });
  } catch (error: any) {
    console.error('❌ [POST /api/admin/seo-analyse/leads/[leadId]] Error:', error);
    return NextResponse.json(
      { error: 'Kunne ikke oppdatere lead.' },
      { status: 500 }
    );
  }
}

export const PATCH = POST;
