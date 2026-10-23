-- ============================================================================
-- 0001_rls_and_views.sql: RLS Security Policies and Views for Synlighetsrapporten
-- ============================================================================

-- 1. Enable Row Level Security on all core and config tables
ALTER TABLE "businesses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_jobs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "factors" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "findings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "raw_fetches" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "keywords" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "serp_snapshots" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "competitors" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ai_checks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "reports" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "leads" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "outreach" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "campaigns" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profile_weights" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "nace_benchmarks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ctr_model" ENABLE ROW LEVEL SECURITY;

-- 2. Public Read Policies for Reference & Factor Data
CREATE POLICY "Public read active factors"
  ON "factors" FOR SELECT
  USING (active = true);

CREATE POLICY "Public read profile_weights"
  ON "profile_weights" FOR SELECT
  USING (true);

CREATE POLICY "Public read nace_benchmarks"
  ON "nace_benchmarks" FOR SELECT
  USING (true);

CREATE POLICY "Public read ctr_model"
  ON "ctr_model" FOR SELECT
  USING (true);

-- 3. Reports Access Control
-- Unlocked (paid) reports can be viewed anonymously via their 24-char slug.
-- Expired reports (>12 months) are not accessible.
CREATE POLICY "Public read unlocked reports by slug"
  ON "reports" FOR SELECT
  USING (unlocked_at IS NOT NULL AND expires_at > now());

-- 4. Teaser View: report_teasers
-- Exposes high-level audit summary, competitor columns, and top 3 teaser findings
-- without exposing the full reports.json column.
CREATE OR REPLACE VIEW "report_teasers" AS
SELECT 
  r.id,
  r.slug,
  r.score_total,
  r.scores_by_part,
  r.finding_counts,
  r.nok_estimate,
  r.teaser_findings,
  r.unlocked_at,
  r.pdf_path,
  r.expires_at,
  b.name AS business_name,
  b.orgnr,
  b.domain,
  b.address,
  b.city,
  b.nace,
  b.places_id
FROM "reports" r
JOIN "audit_jobs" j ON r.job_id = j.id
JOIN "businesses" b ON j.business_id = b.id
WHERE r.expires_at > now();

GRANT SELECT ON "report_teasers" TO anon, authenticated;

-- 5. Service Role Policies (Workers and Server-side Next.js actions)
CREATE POLICY "Service role full access businesses" ON "businesses" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access audit_jobs" ON "audit_jobs" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access findings" ON "findings" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access raw_fetches" ON "raw_fetches" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access reports" ON "reports" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access orders" ON "orders" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access leads" ON "leads" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access outreach" ON "outreach" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access campaigns" ON "campaigns" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access serp_snapshots" ON "serp_snapshots" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access ai_checks" ON "ai_checks" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access competitors" ON "competitors" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access keywords" ON "keywords" FOR ALL USING (auth.role() = 'service_role');
