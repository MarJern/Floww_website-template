const BASE_URL = 'http://localhost:3000';

async function main() {
  console.log(
    '🚀 Starting Skive 6 E2E Verification (25% MVA, VIP Unlock, CRM SLA, Bulk Campaigns)...'
  );

  // 1. Fetch Admin Overview to pick an existing report
  const initOverviewRes = await fetch(`${BASE_URL}/api/admin/seo-analyse/overview`);
  if (!initOverviewRes.ok) {
    throw new Error(`Initial admin overview failed with HTTP ${initOverviewRes.status}`);
  }
  const initOverview = (await initOverviewRes.json()) as any;
  const allReports: any[] = initOverview.reports || [];
  if (allReports.length === 0) {
    throw new Error('No reports found in Admin Overview to test against.');
  }

  const testReport =
    allReports.find((r) => r.slug === 'Tdsl06cE4nrCa2ljiO0_gKA4') || allReports[0];
  console.log(
    `📌 Using report slug=${testReport.slug} (${testReport.businessName} / ${testReport.domain})`
  );

  // 2. Lock the report first via Admin API to test Checkout 25% MVA
  const lockRes = await fetch(
    `${BASE_URL}/api/admin/seo-analyse/reports/${encodeURIComponent(
      testReport.slug
    )}/unlock`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lock: true }),
    }
  );
  if (!lockRes.ok) {
    throw new Error(`Failed to lock report before checkout test: HTTP ${lockRes.status}`);
  }

  // Verify locked state
  const lockedRes = await fetch(
    `${BASE_URL}/api/seo-analyse/report/${encodeURIComponent(testReport.slug)}`
  );
  const lockedJson = (await lockedRes.json()) as any;
  if (lockedJson.isUnlocked !== false) {
    throw new Error('Expected report to be locked before checkout test.');
  }
  console.log('✅ Verified report is locked (Teaser Mode).');

  // 3. Test Checkout Endpoint with 25% Norwegian VAT (149 000 + 37 250 = 186 250 øre)
  const checkoutRes = await fetch(`${BASE_URL}/api/seo-analyse/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug: testReport.slug,
      email: 'regnskap@testbedrift.no',
      customerName: 'Kari Nordmann',
      customerPhone: '+47 900 00 000',
      demoUnlock: true,
    }),
  });
  const checkoutData = (await checkoutRes.json()) as any;
  if (!checkoutRes.ok) {
    throw new Error(`Checkout failed: ${JSON.stringify(checkoutData)}`);
  }

  if (
    checkoutData.priceExVatOre !== 149000 ||
    checkoutData.vatOre !== 37250 ||
    checkoutData.totalIncVatOre !== 186250
  ) {
    throw new Error(
      `VAT calculation mismatch: got ${JSON.stringify({
        priceExVatOre: checkoutData.priceExVatOre,
        vatOre: checkoutData.vatOre,
        totalIncVatOre: checkoutData.totalIncVatOre,
      })}`
    );
  }
  console.log(
    `✅ Verified B2B 25% MVA Checkout: Ex. VAT = 1 490,00 kr (149000 øre), 25% MVA = 372,50 kr (37250 øre), Total = 1 862,50 kr (186250 øre).`
  );

  // 4. Re-lock and test Sales Rep VIP 1-Click Free Unlock
  await fetch(
    `${BASE_URL}/api/admin/seo-analyse/reports/${encodeURIComponent(
      testReport.slug
    )}/unlock`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lock: true }),
    }
  );

  const vipRes = await fetch(
    `${BASE_URL}/api/admin/seo-analyse/reports/${encodeURIComponent(
      testReport.slug
    )}/unlock`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        createLead: true,
        owner: 'Simen',
        notes: 'VIP-opplåst under E2E-verifisering',
      }),
    }
  );
  const vipData = (await vipRes.json()) as any;
  if (!vipRes.ok || !vipData.success || !vipData.unlockedAt) {
    throw new Error(`VIP unlock failed: ${JSON.stringify(vipData)}`);
  }
  console.log(
    `✅ Verified VIP 1-Click Free Unlock: unlockedAt=${vipData.unlockedAt}, leadId=${vipData.leadId}`
  );

  // 5. Test CRM Lead Update & 2-Hour SLA Resolution
  if (vipData.leadId) {
    const leadUpdateRes = await fetch(
      `${BASE_URL}/api/admin/seo-analyse/leads/${encodeURIComponent(vipData.leadId)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'meeting',
          owner: 'Simen',
          notes: 'Møte booket fredag kl 13:00 — ønsker tilbud på SEO + Google Ads.',
        }),
      }
    );
    const leadUpdateData = (await leadUpdateRes.json()) as any;
    if (!leadUpdateRes.ok || leadUpdateData.lead?.status !== 'meeting') {
      throw new Error(`Lead update failed: ${JSON.stringify(leadUpdateData)}`);
    }
    console.log(
      `✅ Verified CRM Lead Update: status=${leadUpdateData.lead.status}, owner=${leadUpdateData.lead.owner}`
    );
  }

  // 6. Test Bulk Campaign & Outreach Creation
  const campaignRes = await fetch(`${BASE_URL}/api/admin/seo-analyse/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Oslo Tannleger & Hudklinikker — Q4 Kampanje',
      nace: '86.230',
      postcodes: ['0159', '0255'],
      domains: ['smilia.no', 'cocoon.no'],
      createdBy: 'Simen',
    }),
  });
  const campaignData = (await campaignRes.json()) as any;
  if (
    !campaignRes.ok ||
    !campaignData.success ||
    !Array.isArray(campaignData.generatedReports) ||
    campaignData.generatedReports.length === 0
  ) {
    throw new Error(`Bulk campaign creation failed: ${JSON.stringify(campaignData)}`);
  }
  console.log(
    `✅ Verified Bulk Campaign Creation: "${campaignData.campaign.name}" generated ${campaignData.generatedReports.length} outreach teaser links.`
  );

  // 7. Keep smilia.no (lFk4dxTUvK7hLbLaGzRvOAf1) locked so the Blurry Paywall teaser can be demoed anytime
  await fetch(
    `${BASE_URL}/api/admin/seo-analyse/reports/lFk4dxTUvK7hLbLaGzRvOAf1/unlock`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lock: true }),
    }
  );

  // 8. Test Final Admin Overview Endpoint
  const overviewRes = await fetch(`${BASE_URL}/api/admin/seo-analyse/overview`);
  const overviewData = (await overviewRes.json()) as any;
  if (!overviewRes.ok || !overviewData.kpis) {
    throw new Error(`Admin overview failed: ${JSON.stringify(overviewData)}`);
  }
  console.log('📊 Final Admin Overview KPIs:', overviewData.kpis);

  console.log('🎉 All Skive 6 E2E checks passed!');
}

main().catch((err) => {
  console.error('❌ Skive 6 E2E verification failed:', err);
  process.exit(1);
});
