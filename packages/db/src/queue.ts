import PgBoss from 'pg-boss';

export const QUEUES = {
  AUDIT_JOB: 'audit-jobs',
  AFTER_PAYMENT: 'after-payment',
  OUTREACH: 'outreach',
  PDF_GENERATION: 'generate-pdf',
} as const;

export type QueueName = typeof QUEUES[keyof typeof QUEUES];

export interface AuditJobPayload {
  jobId: string;
  businessId: string;
  kind?: 'full' | 'competitor';
  priority?: number;
  useFixtures?: boolean;
}

export interface AfterPaymentPayload {
  orderId: string;
  reportId: string;
  businessId: string;
  customerEmail: string;
  stripeSessionId: string;
}

export interface PdfGenerationPayload {
  reportId: string;
  slug: string;
}

/**
 * Creates and starts a pg-boss instance connected to Postgres / Supabase.
 * Automatically runs internal migrations in the 'pgboss' schema.
 */
export async function createBoss(connectionString?: string): Promise<PgBoss> {
  const dbUrl = connectionString || process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not defined for pg-boss connection');
  }

  // Handle Supabase pooler / SSL requirements if needed
  const boss = new PgBoss({
    connectionString: dbUrl,
    schema: 'pgboss',
    // Retry and retention defaults tailored for audit jobs
    retryLimit: 3,
    retryDelay: 30, // seconds
    retentionDays: 14,
    archiveCompletedAfterSeconds: 60 * 60 * 24, // 24 hours
  });

  boss.on('error', (error) => {
    console.error('pg-boss error:', error);
  });

  return boss;
}

/**
 * Enqueues a new audit job into the pg-boss queue.
 */
export async function enqueueAuditJob(
  boss: PgBoss,
  payload: AuditJobPayload
): Promise<string | null> {
  return await boss.send(QUEUES.AUDIT_JOB, payload, {
    priority: payload.priority ?? 0,
    retryLimit: 2,
    expireInSeconds: 60 * 15, // 15 minutes timeout per crawl/audit run
  });
}
