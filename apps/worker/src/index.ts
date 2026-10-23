import path from 'path';
import * as dotenv from 'dotenv';
import { getDb, createBoss, QUEUES, AuditJobPayload, PdfGenerationPayload } from '@floww/db';
import { runFullAudit, generateReportPdf } from '@floww/audit';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') });
dotenv.config();

async function main() {
  console.log('⚡ [Floww Worker] Initializing Synlighetsrapporten background worker...');

  const db = getDb();
  const boss = await createBoss();

  await boss.start();
  console.log('🚀 [Floww Worker] pg-boss connected and started in schema "pgboss"');

  // Register worker for AUDIT_JOB queue
  await boss.work<AuditJobPayload>(QUEUES.AUDIT_JOB, async ([job]) => {
    const { jobId, businessId, useFixtures } = job.data;
    console.log(
      `📥 [Floww Worker] Received job ${job.id} -> audit_job=${jobId} (business=${businessId}, fixtures=${Boolean(useFixtures)})`
    );

    const report = await runFullAudit(jobId, {
      useFixtures,
      db,
    });

    console.log(
      `✅ [Floww Worker] Completed audit job ${jobId} -> report slug=${report.slug} (score=${report.scoreTotal}/100)`
    );
  });

  // Register worker for PDF_GENERATION queue
  await boss.work<PdfGenerationPayload>(QUEUES.PDF_GENERATION, async ([job]) => {
    const { slug } = job.data;
    console.log(`📄 [Floww Worker] Generating PDF for report slug=${slug}...`);
    const pdfRes = await generateReportPdf(slug, { db });
    console.log(`✅ [Floww Worker] Saved PDF for ${slug} at ${pdfRes.pdfPath} (${pdfRes.engine})`);
  });

  console.log(`👂 [Floww Worker] Listening for jobs on queues "${QUEUES.AUDIT_JOB}" and "${QUEUES.PDF_GENERATION}"...`);

  // Graceful shutdown
  const shutdown = async () => {
    console.log('\n🛑 [Floww Worker] Shutting down gracefully...');
    try {
      await boss.stop();
      console.log('💤 [Floww Worker] pg-boss stopped.');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('❌ Fatal error in worker bootstrap:', err);
  process.exit(1);
});
