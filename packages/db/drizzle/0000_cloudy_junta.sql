CREATE TYPE "public"."audit_job_kind" AS ENUM('full', 'competitor');--> statement-breakpoint
CREATE TYPE "public"."audit_job_status" AS ENUM('queued', 'running', 'done', 'failed');--> statement-breakpoint
CREATE TYPE "public"."business_source" AS ENUM('self_serve', 'bulk');--> statement-breakpoint
CREATE TYPE "public"."campaign_status" AS ENUM('draft', 'queued', 'running', 'completed', 'paused');--> statement-breakpoint
CREATE TYPE "public"."finding_status" AS ENUM('ok', 'warn', 'crit', 'na');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('new', 'called', 'meeting', 'won', 'lost');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'paid', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."outreach_channel" AS ENUM('email', 'phone');--> statement-breakpoint
CREATE TYPE "public"."profile_type" AS ENUM('lokal', 'flere_avdelinger', 'nasjonal', 'nettbutikk', 'b2b');--> statement-breakpoint
CREATE TABLE "ai_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"model" text NOT NULL,
	"question_code" text,
	"question" text NOT NULL,
	"mentioned" boolean DEFAULT false NOT NULL,
	"position" integer,
	"nap_correct" boolean,
	"cited_domain" text,
	"others_mentioned" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"cited_sources" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"snippet" text,
	"negative_claims" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"kind" "audit_job_kind" DEFAULT 'full' NOT NULL,
	"status" "audit_job_status" DEFAULT 'queued' NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"modules_done" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "businesses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"orgnr" text NOT NULL,
	"domain" text NOT NULL,
	"name" text NOT NULL,
	"org_form" text,
	"nace" text,
	"nace_name" text,
	"address" text,
	"postcode" text,
	"city" text,
	"lat" double precision,
	"lng" double precision,
	"places_id" text,
	"source" "business_source" DEFAULT 'self_serve' NOT NULL,
	"profile_type" "profile_type" DEFAULT 'lokal' NOT NULL,
	"email" text,
	"phone" text,
	"general_manager" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "businesses_orgnr_unique" UNIQUE("orgnr"),
	CONSTRAINT "businesses_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"nace" text,
	"postcodes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" "campaign_status" DEFAULT 'draft' NOT NULL,
	"created_by" text,
	"counts" jsonb DEFAULT '{"total":0,"sent":0,"opened":0,"clicked":0,"converted":0}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "competitors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"places_id" text NOT NULL,
	"domain" text,
	"name" text NOT NULL,
	"rating" numeric(3, 2),
	"review_count" integer,
	"light_score" numeric(5, 2),
	"scores_by_part" jsonb,
	"refreshed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "competitors_places_id_unique" UNIQUE("places_id")
);
--> statement-breakpoint
CREATE TABLE "ctr_model" (
	"key" text PRIMARY KEY NOT NULL,
	"channel" text NOT NULL,
	"position" integer,
	"ctr" numeric(5, 4) NOT NULL,
	"source" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "factors" (
	"code" text PRIMARY KEY NOT NULL,
	"part" integer NOT NULL,
	"group_name" text NOT NULL,
	"subgroup_name" text,
	"name_en" text,
	"name_no" text NOT NULL,
	"source" text,
	"rule" text,
	"threshold_ok" text,
	"threshold_warn" text,
	"threshold_crit" text,
	"weight_map" double precision,
	"weight_organic" double precision,
	"weight_ai" double precision,
	"weight_subgroup" double precision,
	"measurable" text,
	"active" boolean DEFAULT true NOT NULL,
	"whitespark_rank_map" integer,
	"whitespark_score_map" integer,
	"whitespark_rank_organic" integer,
	"whitespark_score_organic" integer,
	"whitespark_rank_ai" integer,
	"whitespark_score_ai" integer,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "findings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"factor_code" text NOT NULL,
	"status" "finding_status" NOT NULL,
	"value" jsonb NOT NULL,
	"evidence" jsonb NOT NULL,
	"competitor_values" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "keywords" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nace" text NOT NULL,
	"keyword" text NOT NULL,
	"geo" text,
	"volume" integer DEFAULT 0 NOT NULL,
	"cpc" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"source" text DEFAULT 'dataforseo' NOT NULL,
	"expected_category" text,
	"industry_catalogs" jsonb,
	"attributes" jsonb,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"business_id" uuid NOT NULL,
	"contact_name" text,
	"email" text,
	"phone" text,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"owner" text DEFAULT 'Simen',
	"notes" text,
	"called_at" timestamp with time zone,
	"sla_breached" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nace_benchmarks" (
	"nace" text PRIMARY KEY NOT NULL,
	"industry_name" text NOT NULL,
	"expected_primary_category" text,
	"relevant_additional_categories" jsonb,
	"service_keywords" jsonb NOT NULL,
	"conversion_rate" numeric(5, 4) NOT NULL,
	"customer_lifetime_value" numeric(12, 2) NOT NULL,
	"industry_catalogs" jsonb,
	"ai_attributes" jsonb,
	"source" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stripe_session_id" text NOT NULL,
	"report_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'nok' NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"email" text NOT NULL,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_stripe_session_id_unique" UNIQUE("stripe_session_id")
);
--> statement-breakpoint
CREATE TABLE "outreach" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"business_id" uuid NOT NULL,
	"step" integer DEFAULT 1 NOT NULL,
	"channel" "outreach_channel" DEFAULT 'email' NOT NULL,
	"sent_at" timestamp with time zone,
	"opened_at" timestamp with time zone,
	"clicked_at" timestamp with time zone,
	"unsubscribed_at" timestamp with time zone,
	"bounced" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_weights" (
	"profile_type" "profile_type" PRIMARY KEY NOT NULL,
	"weight_part_1" numeric(5, 2) NOT NULL,
	"weight_part_2" numeric(5, 2) NOT NULL,
	"weight_part_3" numeric(5, 2) NOT NULL,
	"weight_part_4" numeric(5, 2) NOT NULL,
	"description" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "raw_fetches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"module" text NOT NULL,
	"payload" jsonb NOT NULL,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"score_total" numeric(5, 2) NOT NULL,
	"scores_by_part" jsonb NOT NULL,
	"finding_counts" jsonb NOT NULL,
	"nok_estimate" numeric(12, 2) NOT NULL,
	"teaser_findings" jsonb NOT NULL,
	"json" jsonb NOT NULL,
	"unlocked_at" timestamp with time zone,
	"pdf_path" text,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reports_job_id_unique" UNIQUE("job_id"),
	CONSTRAINT "reports_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "serp_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"keyword" text NOT NULL,
	"grid_point" text NOT NULL,
	"map_top3" jsonb NOT NULL,
	"organic_top10" jsonb NOT NULL,
	"ads" jsonb,
	"ai_overview" boolean DEFAULT false NOT NULL,
	"captured_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_checks" ADD CONSTRAINT "ai_checks_job_id_audit_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."audit_jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_jobs" ADD CONSTRAINT "audit_jobs_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "findings" ADD CONSTRAINT "findings_job_id_audit_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."audit_jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "findings" ADD CONSTRAINT "findings_factor_code_factors_code_fk" FOREIGN KEY ("factor_code") REFERENCES "public"."factors"("code") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outreach" ADD CONSTRAINT "outreach_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outreach" ADD CONSTRAINT "outreach_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raw_fetches" ADD CONSTRAINT "raw_fetches_job_id_audit_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."audit_jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_job_id_audit_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."audit_jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "serp_snapshots" ADD CONSTRAINT "serp_snapshots_job_id_audit_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."audit_jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_ai_checks_job_model_question" ON "ai_checks" USING btree ("job_id","model","question");--> statement-breakpoint
CREATE INDEX "idx_ai_checks_job" ON "ai_checks" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "idx_audit_jobs_status" ON "audit_jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_audit_jobs_business" ON "audit_jobs" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "idx_businesses_domain" ON "businesses" USING btree ("domain");--> statement-breakpoint
CREATE INDEX "idx_businesses_orgnr" ON "businesses" USING btree ("orgnr");--> statement-breakpoint
CREATE INDEX "idx_businesses_nace" ON "businesses" USING btree ("nace");--> statement-breakpoint
CREATE INDEX "idx_campaigns_status" ON "campaigns" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_competitors_places_id" ON "competitors" USING btree ("places_id");--> statement-breakpoint
CREATE INDEX "idx_competitors_domain" ON "competitors" USING btree ("domain");--> statement-breakpoint
CREATE INDEX "idx_factors_part" ON "factors" USING btree ("part");--> statement-breakpoint
CREATE INDEX "idx_factors_group" ON "factors" USING btree ("group_name");--> statement-breakpoint
CREATE INDEX "idx_factors_active" ON "factors" USING btree ("active");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_findings_job_factor" ON "findings" USING btree ("job_id","factor_code");--> statement-breakpoint
CREATE INDEX "idx_findings_job" ON "findings" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "idx_findings_factor" ON "findings" USING btree ("factor_code");--> statement-breakpoint
CREATE INDEX "idx_findings_status" ON "findings" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_keywords_nace_keyword_geo" ON "keywords" USING btree ("nace","keyword","geo");--> statement-breakpoint
CREATE INDEX "idx_keywords_nace" ON "keywords" USING btree ("nace");--> statement-breakpoint
CREATE INDEX "idx_leads_status" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_leads_report" ON "leads" USING btree ("report_id");--> statement-breakpoint
CREATE INDEX "idx_leads_business" ON "leads" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "idx_leads_sla" ON "leads" USING btree ("sla_breached");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_orders_stripe_session" ON "orders" USING btree ("stripe_session_id");--> statement-breakpoint
CREATE INDEX "idx_orders_report" ON "orders" USING btree ("report_id");--> statement-breakpoint
CREATE INDEX "idx_orders_status" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_outreach_campaign_business_step" ON "outreach" USING btree ("campaign_id","business_id","step");--> statement-breakpoint
CREATE INDEX "idx_outreach_business" ON "outreach" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "idx_outreach_campaign" ON "outreach" USING btree ("campaign_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_raw_fetches_job_module" ON "raw_fetches" USING btree ("job_id","module");--> statement-breakpoint
CREATE INDEX "idx_raw_fetches_expires" ON "raw_fetches" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_reports_slug" ON "reports" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_reports_job" ON "reports" USING btree ("job_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_serp_snapshots_job_kw_grid" ON "serp_snapshots" USING btree ("job_id","keyword","grid_point");--> statement-breakpoint
CREATE INDEX "idx_serp_snapshots_job" ON "serp_snapshots" USING btree ("job_id");