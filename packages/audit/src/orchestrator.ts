import path from 'path';
import {
  getDb,
  Database,
  auditJobs,
  businesses,
  factors as factorsTable,
  findings as findingsTable,
  rawFetches,
  leads,
  eq,
} from '@floww/db';
import {
  AuditContext,
  AuditModule,
  BusinessData,
  Finding,
} from './types';
import { resolveModule, normalizeDomain } from './modules/resolve';
import { gbpModule } from './modules/gbp';
import { crawlModule } from './modules/crawl';
import { speedModule } from './modules/speed';
import { serpModule } from './modules/serp';
import { linksModule } from './modules/links';
import { citationsModule } from './modules/citations';
import { mentionsModule } from './modules/mentions';
import { aiModule } from './modules/ai';
import { AssembledReport, buildReportFromJobId } from './engine/report';

export interface RunFullAuditOptions {
  useFixtures?: boolean;
  fixturesDir?: string;
  db?: Database;
}

export interface TeaserEmailParams {
  toEmail: string;
  businessName: string;
  domain: string;
  reportSlug: string;
  scoreTotal?: number;
  critCount?: number;
  warnCount?: number;
}

/**
 * Sends a plain, personal-style teaser email via Resend with Reply-To: kontakt@flowwmedia.no
 * containing the direct link to the finished report.
 */
export async function sendReportReadyTeaserEmail(
  params: TeaserEmailParams
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !params.toEmail || !params.toEmail.includes('@')) {
    return false;
  }

  const baseUrl = (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://flowwmedia.no'
  ).replace(/\/$/, '');
  const reportUrl = `${baseUrl}/seo-analyse/${encodeURIComponent(params.reportSlug)}`;

  const scoreLine =
    typeof params.scoreTotal === 'number'
      ? `Totalscore: ${params.scoreTotal} av 100 poeng${
          typeof params.critCount === 'number'
            ? ` (${params.critCount} kritiske avvik avdekket)`
            : ''
        }.\n\n`
      : '';

  const textBody = [
    `Hei,`,
    ``,
    `Synlighetsrapporten for ${params.businessName} (${params.domain}) er nå ferdigstilt.`,
    ``,
    `${scoreLine}Du kan åpne og lese rapporten din direkte her:`,
    `${reportUrl}`,
    ``,
    `Rapporten kartlegger synligheten deres på tvers av Google-kartet (3x3 Geo-Grid), teknisk SEO og AI-søkemotorer (ChatGPT, Gemini, Claude og Perplexity).`,
    ``,
    `Har du spørsmål til funnene, kan du bare svare direkte på denne e-posten.`,
    ``,
    `Vennlig hilsen,`,
    `Simen & Marja`,
    `Floww Media AS`,
    `kontakt@flowwmedia.no | +47 458 43 554`,
  ].join('\n');

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #11272B; line-height: 1.6; max-width: 580px;">
      <p>Hei,</p>
      <p>Synlighetsrapporten for <strong>${params.businessName}</strong> (${params.domain}) er nå ferdigstilt.</p>
      ${
        typeof params.scoreTotal === 'number'
          ? `<p style="background: #F4F1EA; padding: 12px 16px; border-left: 4px solid #1C4641; margin: 16px 0;">
              <strong>Totalscore: ${params.scoreTotal} / 100</strong>${
                typeof params.critCount === 'number'
                  ? ` &middot; ${params.critCount} kritiske avvik avdekket`
                  : ''
              }
            </p>`
          : ''
      }
      <p>
        <a href="${reportUrl}" style="display: inline-block; background: #1C4641; color: #FCFCFA; text-decoration: none; padding: 12px 20px; border-radius: 3px; font-weight: 600;">
          Åpne synlighetsrapporten &rarr;
        </a>
      </p>
      <p style="font-size: 13px; color: #3E5359;"> Direkte lenke: <a href="${reportUrl}" style="color: #1C4641;">${reportUrl}</a></p>
      <p>Har du spørsmål til funnene, kan du bare svare direkte på denne e-posten.</p>
      <p style="margin-top: 24px;">
        Vennlig hilsen,<br />
        <strong>Simen &amp; Marja</strong><br />
        Floww Media AS<br />
        <span style="font-size: 12px; color: #3E5359;">kontakt@flowwmedia.no &middot; +47 458 43 554</span>
      </p>
    </div>
  `;

  try {
    const fromAddress =
      process.env.RESEND_FROM_EMAIL || 'Floww Media <kontakt@flowwmedia.no>';
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      signal: AbortSignal.timeout(8000),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [params.toEmail],
        reply_to: 'kontakt@flowwmedia.no',
        subject: `Synlighetsrapporten for ${params.businessName} er klar`,
        text: textBody,
        html: htmlBody,
      }),
    });
    return res.ok;
  } catch (err) {
    console.warn('⚠️ [Orchestrator] Could not send Resend teaser email:', err);
    return false;
  }
}

function withModuleTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  moduleName: string
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Module "${moduleName}" timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

const WAVE_2_MODULES: AuditModule[] = [
  gbpModule,
  crawlModule,
  speedModule,
  serpModule,
  linksModule,
  citationsModule,
  mentionsModule,
  aiModule,
];

export const INSUFFICIENT_DATA_USER_MESSAGE =
  'Beklager, en teknisk feil oppstod under innhenting av data. Våre systemer har varslet oss, og vi sender deg rapporten manuelt på e-post så snart den er klar.';

/**
 * End-to-End Audit Pipeline Orchestrator (Waves 1 -> 2 -> 3).
 *
 * - Wave 1: Executes `resolve` module, updates `businesses`, saves `raw_fetches`, updates `modules_done`.
 * - Wave 2: Executes all 8 Wave 2 modules concurrently via `Promise.allSettled`, streaming
 *           incremental progress to `audit_jobs.modules_done` and persisting `raw_fetches`.
 * - Quality Gate: Verifies that <= 20% of applicable active factors failed before generating a report.
 * - Wave 3: Calls `buildReportFromJobId(jobId)`, creates warm lead in `leads`, and sends Resend teaser email.
 */
export async function runFullAudit(
  jobId: string,
  options?: RunFullAuditOptions
): Promise<AssembledReport & { reportId: string }> {
  const db = options?.db ?? getDb();
  const useFixtures =
    options?.useFixtures ?? process.env.AUDIT_USE_FIXTURES === 'true';

  const candidateFixtureDirs = [
    options?.fixturesDir,
    path.resolve(process.cwd(), 'packages/audit/fixtures'),
    path.resolve(process.cwd(), '../../packages/audit/fixtures'),
    path.resolve(__dirname, '../fixtures'),
    path.resolve(__dirname, '../../fixtures'),
  ].filter((d): d is string => Boolean(d));

  const fixturesDir =
    candidateFixtureDirs.find((d) => {
      try {
        return require('fs').existsSync(d);
      } catch {
        return false;
      }
    }) ?? path.resolve(process.cwd(), 'packages/audit/fixtures');

  // 1. Load audit job & business
  const [job] = await db
    .select()
    .from(auditJobs)
    .where(eq(auditJobs.id, jobId))
    .limit(1);

  if (!job) {
    throw new Error(`[Orchestrator] Audit job ${jobId} not found in database.`);
  }

  const [initialBusiness] = await db
    .select()
    .from(businesses)
    .where(eq(businesses.id, job.businessId))
    .limit(1);

  if (!initialBusiness) {
    throw new Error(
      `[Orchestrator] Business ${job.businessId} not found for job ${jobId}.`
    );
  }

  const startedAt = new Date();
  const completedModules = new Set<string>(
    Array.isArray(job.modulesDone) ? job.modulesDone : []
  );

  // Set job status to running
  await db
    .update(auditJobs)
    .set({
      status: 'running',
      startedAt,
      error: null,
      updatedAt: startedAt,
    })
    .where(eq(auditJobs.id, jobId));

  // Serialized progress updater so concurrent Wave 2 modules never race on modules_done
  let progressChain = Promise.resolve();
  const markModuleCompleted = (moduleName: string): Promise<void> => {
    completedModules.add(moduleName);
    const snapshot = Array.from(completedModules);
    progressChain = progressChain
      .then(async () => {
        await db
          .update(auditJobs)
          .set({
            modulesDone: snapshot,
            updatedAt: new Date(),
          })
          .where(eq(auditJobs.id, jobId));
      })
      .catch((err) => {
        console.error(
          `⚠️ [Orchestrator] Failed updating modules_done for ${moduleName}:`,
          err
        );
      });
    return progressChain;
  };

  // In-memory raw store + 30-day raw_fetches DB persistence
  const rawStore = new Map<string, unknown>();
  const savedRawModules = new Set<string>();

  // Preload any existing raw_fetches for this job (e.g. from Phase 1 Pre-Resolve & Lead Gate)
  try {
    const existingRaws = await db
      .select()
      .from(rawFetches)
      .where(eq(rawFetches.jobId, jobId));
    for (const row of existingRaws) {
      rawStore.set(row.module, row.payload);
    }
  } catch {
    // Non-fatal if preload fails
  }

  const saveRawPayload = async (
    moduleName: string,
    payload: unknown
  ): Promise<void> => {
    rawStore.set(moduleName, payload);
    savedRawModules.add(moduleName);

    const fetchedAt = new Date();
    const expiresAt = new Date(fetchedAt.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await db
      .insert(rawFetches)
      .values({
        jobId,
        module: moduleName,
        payload: (payload ?? {}) as Record<string, unknown>,
        fetchedAt,
        expiresAt,
      })
      .onConflictDoUpdate({
        target: [rawFetches.jobId, rawFetches.module],
        set: {
          payload: (payload ?? {}) as Record<string, unknown>,
          fetchedAt,
          expiresAt,
        },
      });
  };

  const currentBusiness: Partial<BusinessData> = {
    id: initialBusiness.id,
    orgnr: initialBusiness.orgnr,
    domain: normalizeDomain(initialBusiness.domain),
    name: initialBusiness.name,
    orgForm: initialBusiness.orgForm ?? undefined,
    nace: initialBusiness.nace ?? undefined,
    naceName: initialBusiness.naceName ?? undefined,
    address: initialBusiness.address ?? undefined,
    postcode: initialBusiness.postcode ?? undefined,
    city: initialBusiness.city ?? undefined,
    lat: initialBusiness.lat ?? undefined,
    lng: initialBusiness.lng ?? undefined,
    placesId: initialBusiness.placesId ?? undefined,
    source: initialBusiness.source,
    profileType: initialBusiness.profileType,
    email: initialBusiness.email ?? undefined,
    phone: initialBusiness.phone ?? undefined,
    generalManager: initialBusiness.generalManager ?? undefined,
  };

  const ctx: AuditContext = {
    jobId,
    domain: currentBusiness.domain || initialBusiness.domain,
    business: currentBusiness,
    raw: <T = unknown>(moduleName: string): T | undefined =>
      rawStore.get(moduleName) as T | undefined,
    saveRaw: saveRawPayload,
    log: (message: string, meta?: unknown) => {
      if (meta !== undefined) {
        console.log(`   [${jobId.slice(0, 8)}] ${message}`, meta);
      } else {
        console.log(`   [${jobId.slice(0, 8)}] ${message}`);
      }
    },
    useFixtures,
    fixturesDir,
  };

  const findingsByCode = new Map<string, Finding>();

  try {
    // ========================================================================
    // WAVE 1: RESOLVE (Entity, Brreg, Places, ProfileType)
    // ========================================================================
    ctx.log(`🌊 [Wave 1] Starting resolve module for ${ctx.domain}...`);
    try {
      const resolveResult = await withModuleTimeout(
        resolveModule.run(ctx),
        25_000,
        'resolve'
      );

      if (resolveResult.raw !== undefined && !savedRawModules.has('resolve')) {
        await saveRawPayload('resolve', resolveResult.raw);
      }

      if (resolveResult.businessUpdates) {
        const u = resolveResult.businessUpdates;
        Object.assign(currentBusiness, u);

        const updateFields: Record<string, unknown> = {
          updatedAt: new Date(),
        };
        if (u.name) updateFields.name = u.name;
        if (u.orgForm !== undefined) updateFields.orgForm = u.orgForm;
        if (u.nace !== undefined) updateFields.nace = u.nace;
        if (u.naceName !== undefined) updateFields.naceName = u.naceName;
        if (u.address !== undefined) updateFields.address = u.address;
        if (u.postcode !== undefined) updateFields.postcode = u.postcode;
        if (u.city !== undefined) updateFields.city = u.city;
        if (u.lat !== undefined) updateFields.lat = u.lat;
        if (u.lng !== undefined) updateFields.lng = u.lng;
        if (u.placesId !== undefined) updateFields.placesId = u.placesId;
        if (u.profileType !== undefined) updateFields.profileType = u.profileType;

        // Only update orgnr if it does not collide with another business row
        if (u.orgnr && u.orgnr !== initialBusiness.orgnr) {
          const [existingOrgnr] = await db
            .select({ id: businesses.id })
            .from(businesses)
            .where(eq(businesses.orgnr, u.orgnr))
            .limit(1);
          if (!existingOrgnr || existingOrgnr.id === initialBusiness.id) {
            updateFields.orgnr = u.orgnr;
          }
        }

        await db
          .update(businesses)
          .set(updateFields)
          .where(eq(businesses.id, initialBusiness.id));
      }

      for (const f of resolveResult.findings) {
        findingsByCode.set(f.factorCode, f);
      }
    } catch (resolveErr: any) {
      // If NACE blacklist triggered in secondary lookup, abort immediately!
      if (String(resolveErr?.message || '').startsWith('NACE_BLACKLISTED:')) {
        throw resolveErr;
      }

      ctx.log(`⚠️ [Wave 1] Resolve module error: ${resolveErr?.message}`);
      for (const code of resolveModule.factors) {
        findingsByCode.set(code, {
          factorCode: code,
          status: 'na',
          value: { error: 'Resolve module failed' },
          evidence: {
            sourceLabel: 'Resolve (feilet)',
            snippet: 'Kunne ikke hente selskapsdata for denne faktoren.',
            timestamp: new Date().toISOString(),
          },
        });
      }
    }

    await markModuleCompleted('resolve');

    // ========================================================================
    // WAVE 2: CONCURRENT DATA GATHERING (8 Modules via Promise.allSettled)
    // ========================================================================
    ctx.log(
      `🌊 [Wave 2] Launching ${WAVE_2_MODULES.length} modules concurrently...`
    );

    const failedModules: string[] = [];

    const wave2Tasks = WAVE_2_MODULES.map(async (mod) => {
      try {
        const result = await withModuleTimeout(mod.run(ctx), 35_000, mod.name);
        if (result.raw !== undefined && !savedRawModules.has(mod.name)) {
          await saveRawPayload(mod.name, result.raw);
        }
        await markModuleCompleted(mod.name);
        return { moduleName: mod.name, findings: result.findings, failed: false };
      } catch (err: any) {
        failedModules.push(mod.name);
        ctx.log(`⚠️ [Wave 2] Module "${mod.name}" failed: ${err?.message}`);
        const fallbackFindings: Finding[] = mod.factors.map((code) => ({
          factorCode: code,
          status: 'na',
          value: { error: `${mod.name} module failed` },
          evidence: {
            sourceLabel: `${mod.name} (utilgjengelig)`,
            snippet: 'Modulen kunne ikke fullføres innen tidsfristen.',
            timestamp: new Date().toISOString(),
          },
        }));
        await markModuleCompleted(mod.name);
        return { moduleName: mod.name, findings: fallbackFindings, failed: true };
      }
    });

    const settledResults = await Promise.allSettled(wave2Tasks);

    for (const settled of settledResults) {
      if (settled.status === 'fulfilled') {
        for (const f of settled.value.findings) {
          findingsByCode.set(f.factorCode, f);
        }
      }
    }

    // ========================================================================
    // PERSIST COLLECTED FINDINGS TO SUPABASE (WITH FK SAFEGUARD)
    // ========================================================================
    const dbFactorRows = await db
      .select({
        code: factorsTable.code,
        active: factorsTable.active,
        measurable: factorsTable.measurable,
        groupName: factorsTable.groupName,
      })
      .from(factorsTable);
    const validFactorCodes = new Set(dbFactorRows.map((r) => r.code));

    const LEGACY_FACTOR_CODE_MAP: Record<string, string> = {
      G063: 'A003',
    };

    const rawFindings = Array.from(findingsByCode.values());
    const safeFindingsByCode = new Map<string, Finding>();

    for (const finding of rawFindings) {
      let targetCode = finding.factorCode;
      if (!validFactorCodes.has(targetCode)) {
        const mapped = LEGACY_FACTOR_CODE_MAP[targetCode];
        if (mapped && validFactorCodes.has(mapped)) {
          ctx.log(
            `🛡️ [Orchestrator] Remapped legacy factorCode "${targetCode}" -> "${mapped}"`
          );
          targetCode = mapped;
        } else {
          ctx.log(
            `⚠️ [Orchestrator] Skipping unknown factorCode "${targetCode}" (not present in factors table)`
          );
          continue;
        }
      }

      if (!safeFindingsByCode.has(targetCode)) {
        safeFindingsByCode.set(targetCode, {
          ...finding,
          factorCode: targetCode,
        });
      }
    }

    const allFindings = Array.from(safeFindingsByCode.values());
    ctx.log(
      `💾 [Orchestrator] Persisting ${allFindings.length} validated findings to database...`
    );

    for (const finding of allFindings) {
      await db
        .insert(findingsTable)
        .values({
          jobId,
          factorCode: finding.factorCode,
          status: finding.status,
          value: (finding.value ?? {}) as Record<string, unknown>,
          evidence: finding.evidence,
          competitorValues: finding.competitorValues ?? null,
        })
        .onConflictDoUpdate({
          target: [findingsTable.jobId, findingsTable.factorCode],
          set: {
            status: finding.status,
            value: (finding.value ?? {}) as Record<string, unknown>,
            evidence: finding.evidence,
            competitorValues: finding.competitorValues ?? null,
          },
        });
    }

    // ========================================================================
    // QUALITY THRESHOLD GATE (> 20% UNEXPECTED NA FACTORS -> ABORT)
    // ========================================================================
    if (!useFixtures) {
      const hasGoogleProfile = Boolean(currentBusiness.placesId);
      const evaluatedFactorRows = dbFactorRows.filter((f) => {
        if (!f.active || f.measurable === 'Nei') return false;
        // Only evaluate factors that were actually emitted by our modules
        if (!safeFindingsByCode.has(f.code)) return false;
        // CRITICAL: Do NOT penalize high-value prospects who genuinely have no Google Business Profile yet!
        if (
          !hasGoogleProfile &&
          (f.groupName === 'Google-profil' || f.groupName === 'Anmeldelser') &&
          f.code !== 'L001'
        ) {
          return false;
        }
        return true;
      });

      const unexpectedNaFindings = evaluatedFactorRows.filter((f) => {
        const finding = safeFindingsByCode.get(f.code);
        return !finding || finding.status === 'na';
      });

      const unexpectedNaRatio =
        evaluatedFactorRows.length > 0
          ? unexpectedNaFindings.length / evaluatedFactorRows.length
          : 1;

      const isQualityFailure =
        unexpectedNaRatio > 0.2 ||
        failedModules.length >= 3 ||
        (failedModules.includes('crawl') && failedModules.length >= 2);

      if (isQualityFailure) {
        const gateData = rawStore.get('gate') as { email?: string } | undefined;
        const capturedEmail = gateData?.email || currentBusiness.email || null;

        await saveRawPayload('quality_gate', {
          reason: 'INSUFFICIENT_DATA',
          unexpectedNaRatio: Number(unexpectedNaRatio.toFixed(3)),
          unexpectedNaCount: unexpectedNaFindings.length,
          applicableFactorCount: evaluatedFactorRows.length,
          failedModules,
          capturedEmail,
          businessName: currentBusiness.name || ctx.domain,
          domain: ctx.domain,
          failedAt: new Date().toISOString(),
        });

        throw new Error('INSUFFICIENT_DATA');
      }
    }

    // ========================================================================
    // WAVE 3: REPORT BUILDER (Scoring, Financial Bleed, Redaction & Finalize)
    // ========================================================================
    ctx.log(`🧮 [Wave 3] Building final report and redacting teaser payload...`);
    const reportResult = await buildReportFromJobId(jobId, db);
    await markModuleCompleted('score');

    // ========================================================================
    // POST-GENERATION: CREATE LEAD & SEND RESEND TEASER EMAIL
    // ========================================================================
    const gatePayload = rawStore.get('gate') as
      | {
          email?: string;
          agencySpendMonthly?: number | null;
          agencyDurationMonths?: number | null;
        }
      | undefined;
    const capturedEmail = (
      gatePayload?.email ||
      currentBusiness.email ||
      initialBusiness.email ||
      ''
    )
      .trim()
      .toLowerCase();

    if (capturedEmail && capturedEmail.includes('@')) {
      const agencyMonthly =
        gatePayload?.agencySpendMonthly ??
        initialBusiness.agencySpendMonthly ??
        null;
      const agencyMonths =
        gatePayload?.agencyDurationMonths ??
        initialBusiness.agencyDurationMonths ??
        null;

      const agencyNoteSuffix =
        typeof agencyMonthly === 'number' && agencyMonthly > 0
          ? agencyMonths && agencyMonths > 0
            ? ` · Byrå i dag: ${agencyMonthly.toLocaleString('nb-NO')} kr/mnd i ${agencyMonths} mnd (${(
                agencyMonthly * agencyMonths
              ).toLocaleString('nb-NO')} kr betalt totalt)`
            : ` · Byrå i dag: ${agencyMonthly.toLocaleString('nb-NO')} kr/mnd`
          : '';

      try {
        const [existingLead] = await db
          .select({ id: leads.id })
          .from(leads)
          .where(eq(leads.reportId, reportResult.reportId))
          .limit(1);

        if (!existingLead) {
          await db.insert(leads).values({
            reportId: reportResult.reportId,
            businessId: initialBusiness.id,
            contactName:
              currentBusiness.generalManager ||
              currentBusiness.name ||
              initialBusiness.name,
            email: capturedEmail,
            phone: currentBusiness.phone || initialBusiness.phone || null,
            status: 'new',
            owner: 'Simen',
            notes: `Fanget via 2-stegs e-postport ved generering av Synlighetsrapporten${agencyNoteSuffix}`,
            slaBreached: false,
          });
        }
      } catch (leadErr) {
        console.warn('⚠️ [Orchestrator] Could not upsert lead after Wave 3:', leadErr);
      }

      const critCount = allFindings.filter((f) => f.status === 'crit').length;
      const warnCount = allFindings.filter((f) => f.status === 'warn').length;

      void sendReportReadyTeaserEmail({
        toEmail: capturedEmail,
        businessName: currentBusiness.name || initialBusiness.name || ctx.domain,
        domain: ctx.domain,
        reportSlug: reportResult.slug,
        scoreTotal: reportResult.scoreTotal,
        critCount,
        warnCount,
      });
    }

    ctx.log(
      `🎉 [Orchestrator] Audit job ${jobId} complete! Report slug: ${reportResult.slug} (Score: ${reportResult.scoreTotal}/100, Monthly Bleed: ${reportResult.nokEstimate} kr)`
    );

    return reportResult;
  } catch (fatalErr: any) {
    console.error(
      `❌ [Orchestrator] Fatal error in audit job ${jobId}:`,
      fatalErr
    );
    await db
      .update(auditJobs)
      .set({
        status: 'failed',
        error: fatalErr?.message || 'Unknown orchestrator error',
        finishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(auditJobs.id, jobId));
    throw fatalErr;
  }
}
