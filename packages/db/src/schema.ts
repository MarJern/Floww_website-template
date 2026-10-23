import {
  pgTable,
  text,
  integer,
  numeric,
  doublePrecision,
  boolean,
  timestamp,
  uuid,
  jsonb,
  uniqueIndex,
  index,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// ENUMS
// ============================================================================
export const businessSourceEnum = pgEnum('business_source', ['self_serve', 'bulk']);
export const profileTypeEnum = pgEnum('profile_type', [
  'lokal',
  'flere_avdelinger',
  'nasjonal',
  'nettbutikk',
  'b2b',
]);

export const auditJobKindEnum = pgEnum('audit_job_kind', ['full', 'competitor']);
export const auditJobStatusEnum = pgEnum('audit_job_status', [
  'queued',
  'running',
  'done',
  'failed',
]);

export const findingStatusEnum = pgEnum('finding_status', ['ok', 'warn', 'crit', 'na']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'paid', 'refunded']);
export const leadStatusEnum = pgEnum('lead_status', [
  'new',
  'called',
  'meeting',
  'won',
  'lost',
]);
export const campaignStatusEnum = pgEnum('campaign_status', [
  'draft',
  'queued',
  'running',
  'completed',
  'paused',
]);
export const outreachChannelEnum = pgEnum('outreach_channel', ['email', 'phone']);

// ============================================================================
// 1. BUSINESSES
// ============================================================================
export const businesses = pgTable(
  'businesses',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgnr: text('orgnr').notNull().unique(), // 9 siffer fra Brreg
    domain: text('domain').notNull().unique(), // Normalisert domenenavn uten www/https
    name: text('name').notNull(),
    orgForm: text('org_form'), // AS, ENK, NUF, ASA etc.
    nace: text('nace'), // f.eks. "86.230"
    naceName: text('nace_name'),
    address: text('address'),
    postcode: text('postcode'),
    city: text('city'),
    lat: doublePrecision('lat'),
    lng: doublePrecision('lng'),
    placesId: text('places_id'),
    source: businessSourceEnum('source').default('self_serve').notNull(),
    profileType: profileTypeEnum('profile_type').default('lokal').notNull(),
    email: text('email'),
    phone: text('phone'),
    generalManager: text('general_manager'),
    agencySpendMonthly: integer('agency_spend_monthly'),
    agencyDurationMonths: integer('agency_duration_months'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_businesses_domain').on(table.domain),
    index('idx_businesses_orgnr').on(table.orgnr),
    index('idx_businesses_nace').on(table.nace),
  ]
);

// ============================================================================
// 2. AUDIT JOBS
// ============================================================================
export const auditJobs = pgTable(
  'audit_jobs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    businessId: uuid('business_id')
      .notNull()
      .references(() => businesses.id, { onDelete: 'cascade' }),
    kind: auditJobKindEnum('kind').default('full').notNull(),
    status: auditJobStatusEnum('status').default('queued').notNull(),
    priority: integer('priority').default(0).notNull(),
    // Fullførte moduler: f.eks. ['resolve', 'gbp', 'crawl', ...]
    modulesDone: jsonb('modules_done').$type<string[]>().default([]).notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }),
    finishedAt: timestamp('finished_at', { withTimezone: true }),
    error: text('error'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_audit_jobs_status').on(table.status),
    index('idx_audit_jobs_business').on(table.businessId),
  ]
);

// ============================================================================
// 3. FACTORS (Faktorlisten - data, ikke kode)
// ============================================================================
export const factors = pgTable(
  'factors',
  {
    code: text('code').primaryKey(), // L001, G001, A001, B001, N001
    part: integer('part').notNull(), // 1: Lokalt, 2: Generelt, 3: AI, 4: Ads/Øko, 5: Negativ
    groupName: text('group_name').notNull(), // Google-profil, Anmeldelser, On-page, Teknisk etc.
    subgroupName: text('subgroup_name'), // Arkitektur, Innhold/on-page etc.
    nameEn: text('name_en'), // Whitespark originalnavn
    nameNo: text('name_no').notNull(), // Norsk tittel
    source: text('source'), // Places API, Egen crawler, DataForSEO etc.
    rule: text('rule'), // Logikk / hva som måles
    thresholdOk: text('threshold_ok'),
    thresholdWarn: text('threshold_warn'),
    thresholdCrit: text('threshold_crit'),
    weightMap: doublePrecision('weight_map'), // Prosentvekt for kart
    weightOrganic: doublePrecision('weight_organic'), // Prosentvekt for organisk
    weightAi: doublePrecision('weight_ai'), // Prosentvekt for AI
    weightSubgroup: doublePrecision('weight_subgroup'), // Vekt i undergruppe (1-10)
    measurable: text('measurable'), // Ja, Delvis, Kontekst, Nei
    active: boolean('active').default(true).notNull(),
    whitesparkRankMap: integer('whitespark_rank_map'),
    whitesparkScoreMap: integer('whitespark_score_map'),
    whitesparkRankOrganic: integer('whitespark_rank_organic'),
    whitesparkScoreOrganic: integer('whitespark_score_organic'),
    whitesparkRankAi: integer('whitespark_rank_ai'),
    whitesparkScoreAi: integer('whitespark_score_ai'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_factors_part').on(table.part),
    index('idx_factors_group').on(table.groupName),
    index('idx_factors_active').on(table.active),
  ]
);

// ============================================================================
// 4. FINDINGS (Ett funn per faktor per jobb)
// ============================================================================
export interface FindingEvidence {
  url?: string;
  measuredNumber?: number;
  screenshotPath?: string;
  snippet?: string;
  sourceLabel?: string;
  timestamp?: string;
}

export const findings = pgTable(
  'findings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    jobId: uuid('job_id')
      .notNull()
      .references(() => auditJobs.id, { onDelete: 'cascade' }),
    factorCode: text('factor_code')
      .notNull()
      .references(() => factors.code, { onDelete: 'restrict' }),
    status: findingStatusEnum('status').notNull(),
    value: jsonb('value').notNull(), // Observerte verdier
    evidence: jsonb('evidence').$type<FindingEvidence>().notNull(), // Ingen anmeldelsestekst
    competitorValues: jsonb('competitor_values').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('uq_findings_job_factor').on(table.jobId, table.factorCode),
    index('idx_findings_job').on(table.jobId),
    index('idx_findings_factor').on(table.factorCode),
    index('idx_findings_status').on(table.status),
  ]
);

// ============================================================================
// 5. RAW FETCHES (30-dagers cache for rådata)
// ============================================================================
export const rawFetches = pgTable(
  'raw_fetches',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    jobId: uuid('job_id')
      .notNull()
      .references(() => auditJobs.id, { onDelete: 'cascade' }),
    module: text('module').notNull(), // resolve, gbp, crawl, serp, speed, links, etc.
    payload: jsonb('payload').notNull(),
    fetchedAt: timestamp('fetched_at', { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(), // Renset av pg_cron
  },
  (table) => [
    uniqueIndex('uq_raw_fetches_job_module').on(table.jobId, table.module),
    index('idx_raw_fetches_expires').on(table.expiresAt),
  ]
);

// ============================================================================
// 6. KEYWORDS (Ordbok per NACE med volum og CPC)
// ============================================================================
export const keywords = pgTable(
  'keywords',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    nace: text('nace').notNull(),
    keyword: text('keyword').notNull(),
    geo: text('geo'), // f.eks. "Oslo", "Skøyen" eller null for nasjonalt
    volume: integer('volume').default(0).notNull(),
    cpc: numeric('cpc', { precision: 10, scale: 2 }).default('0.00').notNull(),
    source: text('source').default('dataforseo').notNull(),
    expectedCategory: text('expected_category'),
    industryCatalogs: jsonb('industry_catalogs').$type<string[]>(),
    attributes: jsonb('attributes').$type<string[]>(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }), // 90 dager cache
  },
  (table) => [
    uniqueIndex('uq_keywords_nace_keyword_geo').on(table.nace, table.keyword, table.geo),
    index('idx_keywords_nace').on(table.nace),
  ]
);

// ============================================================================
// 7. SERP SNAPSHOTS (Grid-måling)
// ============================================================================
export const serpSnapshots = pgTable(
  'serp_snapshots',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    jobId: uuid('job_id')
      .notNull()
      .references(() => auditJobs.id, { onDelete: 'cascade' }),
    keyword: text('keyword').notNull(),
    gridPoint: text('grid_point').notNull(), // f.eks. "1_of_9", "lat,lng"
    mapTop3: jsonb('map_top3').notNull(), // Konkurrenter i kartet med places_id
    organicTop10: jsonb('organic_top10').notNull(),
    ads: jsonb('ads'),
    aiOverview: boolean('ai_overview').default(false).notNull(),
    capturedAt: timestamp('captured_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('uq_serp_snapshots_job_kw_grid').on(table.jobId, table.keyword, table.gridPoint),
    index('idx_serp_snapshots_job').on(table.jobId),
  ]
);

// ============================================================================
// 8. COMPETITORS (Delt mellom jobber i 30 dager)
// ============================================================================
export const competitors = pgTable(
  'competitors',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    placesId: text('places_id').notNull().unique(),
    domain: text('domain'),
    name: text('name').notNull(),
    rating: numeric('rating', { precision: 3, scale: 2 }),
    reviewCount: integer('review_count'),
    lightScore: numeric('light_score', { precision: 5, scale: 2 }),
    scoresByPart: jsonb('scores_by_part').$type<Record<string, number>>(),
    refreshedAt: timestamp('refreshed_at', { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_competitors_places_id').on(table.placesId),
    index('idx_competitors_domain').on(table.domain),
  ]
);

// ============================================================================
// 9. AI CHECKS (Spørsmål mot ChatGPT, Gemini, Claude, Perplexity)
// ============================================================================
export const aiChecks = pgTable(
  'ai_checks',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    jobId: uuid('job_id')
      .notNull()
      .references(() => auditJobs.id, { onDelete: 'cascade' }),
    model: text('model').notNull(), // chatgpt, gemini, claude, perplexity, ai_overview
    questionCode: text('question_code'), // Q1 - Q10
    question: text('question').notNull(),
    mentioned: boolean('mentioned').default(false).notNull(),
    position: integer('position'),
    napCorrect: boolean('nap_correct'),
    citedDomain: text('cited_domain'),
    othersMentioned: jsonb('others_mentioned').$type<string[]>().default([]).notNull(),
    citedSources: jsonb('cited_sources').$type<string[]>().default([]).notNull(),
    snippet: text('snippet'), // Maks 300 tegn
    negativeClaims: text('negative_claims'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('uq_ai_checks_job_model_question').on(table.jobId, table.model, table.question),
    index('idx_ai_checks_job').on(table.jobId),
  ]
);

// ============================================================================
// 10. REPORTS (Teaser vs Full rapport)
// ============================================================================
export interface TeaserFinding {
  factorCode: string;
  nameNo: string;
  groupName: string;
  status: 'ok' | 'warn' | 'crit' | 'na';
  part?: number;
  title?: string;
  category?: string;
  headline?: string;
  severity?: 'ok' | 'warn' | 'crit';
  impactNok?: number;
}

export const reports = pgTable(
  'reports',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    jobId: uuid('job_id')
      .notNull()
      .unique()
      .references(() => auditJobs.id, { onDelete: 'cascade' }),
    slug: text('slug').notNull().unique(), // 24 tilfeldige tegn
    scoreTotal: numeric('score_total', { precision: 5, scale: 2 }).notNull(),
    scoresByPart: jsonb('scores_by_part')
      .$type<{ part1: number; part2: number; part3: number; part4: number }>()
      .notNull(),
    findingCounts: jsonb('finding_counts')
      .$type<{ total: number; ok: number; warn: number; crit: number; na: number }>()
      .notNull(),
    nokEstimate: numeric('nok_estimate', { precision: 12, scale: 2 }).notNull(),
    teaserFindings: jsonb('teaser_findings').$type<TeaserFinding[]>().notNull(), // De 3 utvalgte funnene
    json: jsonb('json').notNull(), // Hele rapport-JSONet (LÅST inntil betaling)
    unlockedAt: timestamp('unlocked_at', { withTimezone: true }),
    pdfPath: text('pdf_path'),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(), // 12 mnd
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('uq_reports_slug').on(table.slug),
    index('idx_reports_job').on(table.jobId),
  ]
);

// ============================================================================
// 11. ORDERS (Stripe-transaksjoner)
// ============================================================================
export const orders = pgTable(
  'orders',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    stripeSessionId: text('stripe_session_id').notNull().unique(),
    reportId: uuid('report_id')
      .notNull()
      .references(() => reports.id, { onDelete: 'restrict' }),
    amount: integer('amount').notNull(), // i øre (150000 = 1500 kr)
    currency: text('currency').default('nok').notNull(),
    status: orderStatusEnum('status').default('pending').notNull(),
    email: text('email').notNull(),
    paidAt: timestamp('paid_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('uq_orders_stripe_session').on(table.stripeSessionId),
    index('idx_orders_report').on(table.reportId),
    index('idx_orders_status').on(table.status),
  ]
);

// ============================================================================
// 12. LEADS (Varme leads for oppfølging)
// ============================================================================
export const leads = pgTable(
  'leads',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    reportId: uuid('report_id')
      .notNull()
      .references(() => reports.id, { onDelete: 'cascade' }),
    businessId: uuid('business_id')
      .notNull()
      .references(() => businesses.id, { onDelete: 'cascade' }),
    contactName: text('contact_name'),
    email: text('email'),
    phone: text('phone'),
    status: leadStatusEnum('status').default('new').notNull(),
    owner: text('owner').default('Simen'),
    notes: text('notes'),
    calledAt: timestamp('called_at', { withTimezone: true }),
    slaBreached: boolean('sla_breached').default(false).notNull(), // Settes ved >48t uten oppringing
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_leads_status').on(table.status),
    index('idx_leads_report').on(table.reportId),
    index('idx_leads_business').on(table.businessId),
    index('idx_leads_sla').on(table.slaBreached),
  ]
);

// ============================================================================
// 13. CAMPAIGNS (Bulk-kampanjer per bransje og postnummer)
// ============================================================================
export const campaigns = pgTable(
  'campaigns',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    nace: text('nace'),
    postcodes: jsonb('postcodes').$type<string[]>().default([]).notNull(), // Postnummerintervaller
    status: campaignStatusEnum('status').default('draft').notNull(),
    createdBy: text('created_by'),
    counts: jsonb('counts')
      .$type<{
        total: number;
        sent: number;
        opened: number;
        clicked: number;
        converted: number;
      }>()
      .default({ total: 0, sent: 0, opened: 0, clicked: 0, converted: 0 })
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('idx_campaigns_status').on(table.status)]
);

// ============================================================================
// 14. OUTREACH (Sekvensiell utsending)
// ============================================================================
export const outreach = pgTable(
  'outreach',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    campaignId: uuid('campaign_id')
      .notNull()
      .references(() => campaigns.id, { onDelete: 'cascade' }),
    businessId: uuid('business_id')
      .notNull()
      .references(() => businesses.id, { onDelete: 'cascade' }),
    step: integer('step').default(1).notNull(), // 1: Dag 0, 2: Dag 4, 3: Ringeliste
    channel: outreachChannelEnum('channel').default('email').notNull(),
    sentAt: timestamp('sent_at', { withTimezone: true }),
    openedAt: timestamp('opened_at', { withTimezone: true }),
    clickedAt: timestamp('clicked_at', { withTimezone: true }),
    unsubscribedAt: timestamp('unsubscribed_at', { withTimezone: true }),
    bounced: boolean('bounced').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('uq_outreach_campaign_business_step').on(
      table.campaignId,
      table.businessId,
      table.step
    ),
    index('idx_outreach_business').on(table.businessId),
    index('idx_outreach_campaign').on(table.campaignId),
  ]
);

// ============================================================================
// 15. PROFILE_WEIGHTS (Konfigurasjon per profiltype)
// ============================================================================
export const profileWeights = pgTable('profile_weights', {
  profileType: profileTypeEnum('profile_type').primaryKey(),
  weightPart1: numeric('weight_part_1', { precision: 5, scale: 2 }).notNull(), // Lokalt søk
  weightPart2: numeric('weight_part_2', { precision: 5, scale: 2 }).notNull(), // Generell SEO
  weightPart3: numeric('weight_part_3', { precision: 5, scale: 2 }).notNull(), // AI-synlighet
  weightPart4: numeric('weight_part_4', { precision: 5, scale: 2 }).notNull(), // Ads & økonomi
  description: text('description'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ============================================================================
// 16. NACE_BENCHMARKS (Bransjeverdier og ordbok)
// ============================================================================
export const naceBenchmarks = pgTable('nace_benchmarks', {
  nace: text('nace').primaryKey(), // f.eks. "86.230" eller "default"
  industryName: text('industry_name').notNull(),
  expectedPrimaryCategory: text('expected_primary_category'),
  relevantAdditionalCategories: jsonb('relevant_additional_categories').$type<string[]>(),
  serviceKeywords: jsonb('service_keywords').$type<string[]>().notNull(),
  conversionRate: numeric('conversion_rate', { precision: 5, scale: 4 }).notNull(), // f.eks. 0.0400 (4%)
  customerLifetimeValue: numeric('customer_lifetime_value', {
    precision: 12,
    scale: 2,
  }).notNull(),
  industryCatalogs: jsonb('industry_catalogs').$type<string[]>(),
  aiAttributes: jsonb('ai_attributes').$type<string[]>(),
  source: text('source'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ============================================================================
// 17. CTR_MODEL (Klikkandel per posisjon for økonomisk simulering)
// ============================================================================
export const ctrModel = pgTable('ctr_model', {
  key: text('key').primaryKey(), // ctr_kart_1, ctr_org_1, ai_overview_tap etc.
  channel: text('channel').notNull(), // 'map' | 'organic' | 'ai'
  position: integer('position'),
  ctr: numeric('ctr', { precision: 5, scale: 4 }).notNull(), // f.eks. 0.1800 (18%)
  source: text('source'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ============================================================================
// RELATIONS
// ============================================================================
export const businessesRelations = relations(businesses, ({ many }) => ({
  auditJobs: many(auditJobs),
  leads: many(leads),
  outreachLogs: many(outreach),
}));

export const auditJobsRelations = relations(auditJobs, ({ one, many }) => ({
  business: one(businesses, {
    fields: [auditJobs.businessId],
    references: [businesses.id],
  }),
  findings: many(findings),
  rawFetches: many(rawFetches),
  serpSnapshots: many(serpSnapshots),
  aiChecks: many(aiChecks),
  report: one(reports),
}));

export const factorsRelations = relations(factors, ({ many }) => ({
  findings: many(findings),
}));

export const findingsRelations = relations(findings, ({ one }) => ({
  job: one(auditJobs, {
    fields: [findings.jobId],
    references: [auditJobs.id],
  }),
  factor: one(factors, {
    fields: [findings.factorCode],
    references: [factors.code],
  }),
}));

export const rawFetchesRelations = relations(rawFetches, ({ one }) => ({
  job: one(auditJobs, {
    fields: [rawFetches.jobId],
    references: [auditJobs.id],
  }),
}));

export const serpSnapshotsRelations = relations(serpSnapshots, ({ one }) => ({
  job: one(auditJobs, {
    fields: [serpSnapshots.jobId],
    references: [auditJobs.id],
  }),
}));

export const aiChecksRelations = relations(aiChecks, ({ one }) => ({
  job: one(auditJobs, {
    fields: [aiChecks.jobId],
    references: [auditJobs.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one, many }) => ({
  job: one(auditJobs, {
    fields: [reports.jobId],
    references: [auditJobs.id],
  }),
  orders: many(orders),
  lead: one(leads),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  report: one(reports, {
    fields: [orders.reportId],
    references: [reports.id],
  }),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  report: one(reports, {
    fields: [leads.reportId],
    references: [reports.id],
  }),
  business: one(businesses, {
    fields: [leads.businessId],
    references: [businesses.id],
  }),
}));

export const campaignsRelations = relations(campaigns, ({ many }) => ({
  outreachRecords: many(outreach),
}));

export const outreachRelations = relations(outreach, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [outreach.campaignId],
    references: [campaigns.id],
  }),
  business: one(businesses, {
    fields: [outreach.businessId],
    references: [businesses.id],
  }),
}));
