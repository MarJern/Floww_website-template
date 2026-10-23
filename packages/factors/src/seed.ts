import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
import { getDb, factors, naceBenchmarks, ctrModel, profileWeights } from '@floww/db';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') });
dotenv.config();

// ============================================================================
// RFC 4180 COMPLIANT CSV PARSER (Zero-dependency & handles multiline quotes)
// ============================================================================
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i += 2;
          continue;
        } else {
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        currentField += char;
        i++;
        continue;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
        i++;
        continue;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
        i++;
        continue;
      } else if (char === '\r') {
        if (nextChar === '\n') i += 2;
        else i++;
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
        continue;
      } else if (char === '\n') {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
        i++;
        continue;
      } else {
        currentField += char;
        i++;
        continue;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
}

// Helpers
const clean = (val?: string) => (val ? val.trim() : '');
const parseNum = (val?: string): number | null => {
  if (!val) return null;
  const cleaned = val.replace(/[\s\u00A0%]/g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
};
const parseIntNum = (val?: string): number | null => {
  const n = parseNum(val);
  return n !== null ? Math.round(n) : null;
};
const parseRate = (val?: string): string => {
  const n = parseNum(val);
  return n !== null ? (n / 100).toFixed(4) : '0.0000';
};
const splitComma = (val?: string): string[] => {
  if (!val) return [];
  return val
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
};

async function seed() {
  const isDryRun = process.argv.includes('--dry-run') || !process.env.DATABASE_URL;
  console.log(`🚀 Starting Synlighetsrapporten database seed${isDryRun ? ' (DRY RUN MODE)' : ''}...`);

  // Locate faktorliste.csv
  const possiblePaths = [
    path.resolve(__dirname, '../factors.csv'),
    path.resolve(__dirname, '../../factors.csv'),
    path.resolve(__dirname, '../../../faktorliste.csv'),
    path.resolve(process.cwd(), 'faktorliste.csv'),
    path.resolve(process.cwd(), 'packages/factors/factors.csv'),
  ];

  let csvPath = '';
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      csvPath = p;
      break;
    }
  }

  if (!csvPath) {
    throw new Error(
      `Could not locate factors.csv or faktorliste.csv in: ${possiblePaths.join(', ')}`
    );
  }

  console.log(`📄 Reading CSV from: ${csvPath}`);
  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCsv(content);
  console.log(`📊 Parsed ${rows.length} total raw lines`);

  const db = isDryRun ? null : getDb();

  // ==========================================================================
  // 1. SEED PROFILE WEIGHTS
  // ==========================================================================
  console.log('⚙️ Seeding profile_weights...');
  const weightsData = [
    {
      profileType: 'lokal' as const,
      weightPart1: '40.00',
      weightPart2: '30.00',
      weightPart3: '15.00',
      weightPart4: '15.00',
      description: 'Én adresse, Google-profil, lokale kunder i nærområdet',
    },
    {
      profileType: 'flere_avdelinger' as const,
      weightPart1: '40.00',
      weightPart2: '30.00',
      weightPart3: '15.00',
      weightPart4: '15.00',
      description: 'Flere underenheter i Brreg, flere Google-profiler',
    },
    {
      profileType: 'nasjonal' as const,
      weightPart1: '15.00',
      weightPart2: '45.00',
      weightPart3: '25.00',
      weightPart4: '15.00',
      description: 'Google-profil, men betjener kunder over hele landet (B2C)',
    },
    {
      profileType: 'nettbutikk' as const,
      weightPart1: '5.00',
      weightPart2: '50.00',
      weightPart3: '25.00',
      weightPart4: '20.00',
      description: 'Handlekurv, produktsider, Merchant Center',
    },
    {
      profileType: 'b2b' as const,
      weightPart1: '10.00',
      weightPart2: '45.00',
      weightPart3: '35.00',
      weightPart4: '10.00',
      description: 'Ingen/passiv Google-profil, kontaktskjema, referanser',
    },
  ];

  if (db) {
    for (const pw of weightsData) {
      await db
        .insert(profileWeights)
        .values(pw)
        .onConflictDoUpdate({
          target: profileWeights.profileType,
          set: {
            weightPart1: pw.weightPart1,
            weightPart2: pw.weightPart2,
            weightPart3: pw.weightPart3,
            weightPart4: pw.weightPart4,
            description: pw.description,
            updatedAt: new Date(),
          },
        });
    }
  }
  console.log(`✅ ${isDryRun ? 'Validated' : 'Upserted'} ${weightsData.length} profile weights`);

  // ==========================================================================
  // 2. SEED CTR MODEL
  // ==========================================================================
  console.log('📈 Seeding ctr_model...');
  const ctrRows = rows.filter((r) => {
    const k = clean(r[0]);
    return k.startsWith('ctr_') || k === 'ai_overview_tap';
  });

  for (const r of ctrRows) {
    const key = clean(r[0]);
    const ctrRate = parseRate(r[1]);
    const source = clean(r[2]);

    let channel = 'organic';
    let position: number | null = null;

    if (key.includes('kart')) {
      channel = 'map';
      const match = key.match(/\d+/);
      if (match) position = parseInt(match[0], 10);
    } else if (key.includes('org')) {
      channel = 'organic';
      const match = key.match(/\d+/);
      if (match) position = parseInt(match[0], 10);
    } else if (key.includes('ai')) {
      channel = 'ai';
      position = 0;
    }

    if (db) {
      await db
        .insert(ctrModel)
        .values({
          key,
          channel,
          position,
          ctr: ctrRate,
          source,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: ctrModel.key,
          set: {
            channel,
            position,
            ctr: ctrRate,
            source,
            updatedAt: new Date(),
          },
        });
    }
  }
  console.log(`✅ ${isDryRun ? 'Validated' : 'Upserted'} ${ctrRows.length} CTR model entries`);

  // ==========================================================================
  // 3. SEED NACE BENCHMARKS
  // ==========================================================================
  console.log('🏢 Seeding nace_benchmarks...');
  const naceRows = rows.filter((r) => /^\d+\.\d+/.test(clean(r[0])));

  for (const r of naceRows) {
    const nace = clean(r[0]);
    const industryName = clean(r[1]);
    const expectedPrimaryCategory = clean(r[2]);
    const relevantAdditionalCategories = splitComma(r[3]);
    const serviceKeywords = splitComma(r[4]);
    const conversionRate = parseRate(r[5]);
    const clvNum = parseNum(r[6]);
    const customerLifetimeValue = clvNum !== null ? clvNum.toFixed(2) : '5000.00';
    const industryCatalogs = splitComma(r[7]);
    const aiAttributes = splitComma(r[8]);
    const source = clean(r[10]);

    if (db) {
      await db
        .insert(naceBenchmarks)
        .values({
          nace,
          industryName,
          expectedPrimaryCategory,
          relevantAdditionalCategories,
          serviceKeywords,
          conversionRate,
          customerLifetimeValue,
          industryCatalogs,
          aiAttributes,
          source,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: naceBenchmarks.nace,
          set: {
            industryName,
            expectedPrimaryCategory,
            relevantAdditionalCategories,
            serviceKeywords,
            conversionRate,
            customerLifetimeValue,
            industryCatalogs,
            aiAttributes,
            source,
            updatedAt: new Date(),
          },
        });
    }
  }

  // Insert fallback benchmark
  if (db) {
    await db
      .insert(naceBenchmarks)
      .values({
        nace: 'default',
        industryName: 'Generell virksomhet (fallback)',
        expectedPrimaryCategory: 'Generell',
        relevantAdditionalCategories: [],
        serviceKeywords: ['bedrift', 'tjenester'],
        conversionRate: '0.0300',
        customerLifetimeValue: '5000.00',
        industryCatalogs: ['1881', 'Gule Sider', 'Proff'],
        aiAttributes: ['kontakt', 'åpningstider'],
        source: 'Floww standard benchmark fallback',
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: naceBenchmarks.nace,
        set: {
          industryName: 'Generell virksomhet (fallback)',
          conversionRate: '0.0300',
          customerLifetimeValue: '5000.00',
          updatedAt: new Date(),
        },
      });
  }

  console.log(`✅ ${isDryRun ? 'Validated' : 'Upserted'} ${naceRows.length + 1} NACE benchmarks`);

  // ==========================================================================
  // 4. SEED FACTORS (Parts 1-5)
  // ==========================================================================
  console.log('🔍 Seeding factors...');
  let factorCount = 0;
  let part1Count = 0;
  let part2Count = 0;
  let part3Count = 0;
  let part4Count = 0;
  let part5Count = 0;

  for (const r of rows) {
    const code = clean(r[0]);

    // Del 1: Lokalt søk (L001 - L187)
    if (/^L\d+/.test(code)) {
      part1Count++;
      if (db) {
        await db
          .insert(factors)
          .values({
            code,
            part: 1,
            nameEn: clean(r[1]),
            nameNo: clean(r[2]),
            groupName: clean(r[3]) || 'Google-profil',
            whitesparkRankMap: parseIntNum(r[4]),
            whitesparkScoreMap: parseIntNum(r[5]),
            whitesparkRankOrganic: parseIntNum(r[6]),
            whitesparkScoreOrganic: parseIntNum(r[7]),
            whitesparkRankAi: parseIntNum(r[8]),
            whitesparkScoreAi: parseIntNum(r[9]),
            measurable: clean(r[10]) || 'Ja',
            active: clean(r[11]) === '1',
            source: clean(r[12]),
            rule: clean(r[13]),
            thresholdOk: clean(r[14]),
            thresholdWarn: clean(r[15]),
            thresholdCrit: clean(r[16]),
            weightMap: parseNum(r[17]),
            weightOrganic: parseNum(r[18]),
            weightAi: parseNum(r[19]),
            notes: clean(r[20]),
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: factors.code,
            set: {
              part: 1,
              nameEn: clean(r[1]),
              nameNo: clean(r[2]),
              groupName: clean(r[3]) || 'Google-profil',
              whitesparkRankMap: parseIntNum(r[4]),
              whitesparkScoreMap: parseIntNum(r[5]),
              whitesparkRankOrganic: parseIntNum(r[6]),
              whitesparkScoreOrganic: parseIntNum(r[7]),
              whitesparkRankAi: parseIntNum(r[8]),
              whitesparkScoreAi: parseIntNum(r[9]),
              measurable: clean(r[10]) || 'Ja',
              active: clean(r[11]) === '1',
              source: clean(r[12]),
              rule: clean(r[13]),
              thresholdOk: clean(r[14]),
              thresholdWarn: clean(r[15]),
              thresholdCrit: clean(r[16]),
              weightMap: parseNum(r[17]),
              weightOrganic: parseNum(r[18]),
              weightAi: parseNum(r[19]),
              notes: clean(r[20]),
              updatedAt: new Date(),
            },
          });
      }
      factorCount++;
    }

    // Del 2: Generell SEO (G001 - G054)
    else if (/^G\d+/.test(code)) {
      part2Count++;
      if (db) {
        await db
          .insert(factors)
          .values({
            code,
            part: 2,
            groupName: 'Generell SEO',
            subgroupName: clean(r[1]), // Teknisk, Arkitektur, Innhold/on-page, Off-page
            nameNo: clean(r[2]),
            nameEn: clean(r[2]),
            source: clean(r[3]),
            rule: clean(r[4]),
            thresholdOk: clean(r[5]),
            thresholdWarn: clean(r[6]),
            thresholdCrit: clean(r[7]),
            weightSubgroup: parseNum(r[8]),
            weightOrganic: parseNum(r[10]),
            measurable: 'Ja',
            active: true,
            notes: clean(r[11]),
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: factors.code,
            set: {
              part: 2,
              groupName: 'Generell SEO',
              subgroupName: clean(r[1]),
              nameNo: clean(r[2]),
              source: clean(r[3]),
              rule: clean(r[4]),
              thresholdOk: clean(r[5]),
              thresholdWarn: clean(r[6]),
              thresholdCrit: clean(r[7]),
              weightSubgroup: parseNum(r[8]),
              weightOrganic: parseNum(r[10]),
              measurable: 'Ja',
              active: true,
              notes: clean(r[11]),
              updatedAt: new Date(),
            },
          });
      }
      factorCount++;
    }

    // Del 3: AI-synlighet (A001 - A020)
    else if (/^A\d+/.test(code)) {
      part3Count++;
      if (db) {
        await db
          .insert(factors)
          .values({
            code,
            part: 3,
            groupName: 'AI-synlighet',
            nameNo: clean(r[1]),
            nameEn: clean(r[1]),
            source: clean(r[2]),
            rule: clean(r[3]),
            thresholdOk: clean(r[4]),
            thresholdWarn: clean(r[5]),
            thresholdCrit: clean(r[6]),
            weightSubgroup: parseNum(r[7]),
            whitesparkRankAi: parseIntNum(r[8]),
            measurable: 'Ja',
            active: true,
            notes: clean(r[9]),
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: factors.code,
            set: {
              part: 3,
              groupName: 'AI-synlighet',
              nameNo: clean(r[1]),
              source: clean(r[2]),
              rule: clean(r[3]),
              thresholdOk: clean(r[4]),
              thresholdWarn: clean(r[5]),
              thresholdCrit: clean(r[6]),
              weightSubgroup: parseNum(r[7]),
              whitesparkRankAi: parseIntNum(r[8]),
              measurable: 'Ja',
              active: true,
              notes: clean(r[9]),
              updatedAt: new Date(),
            },
          });
      }
      factorCount++;
    }

    // Del 4: Ads og økonomi (B001 - B011)
    else if (/^B\d+/.test(code)) {
      part4Count++;
      if (db) {
        await db
          .insert(factors)
          .values({
            code,
            part: 4,
            groupName: 'Betalt og økonomi',
            nameNo: clean(r[1]),
            nameEn: clean(r[1]),
            source: clean(r[3]),
            rule: clean(r[4]),
            thresholdOk: clean(r[5]),
            thresholdWarn: clean(r[6]),
            thresholdCrit: clean(r[7]),
            weightSubgroup: parseNum(r[8]),
            measurable: 'Ja',
            active: true,
            notes: clean(r[9]),
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: factors.code,
            set: {
              part: 4,
              groupName: 'Betalt og økonomi',
              nameNo: clean(r[1]),
              source: clean(r[3]),
              rule: clean(r[4]),
              thresholdOk: clean(r[5]),
              thresholdWarn: clean(r[6]),
              thresholdCrit: clean(r[7]),
              weightSubgroup: parseNum(r[8]),
              measurable: 'Ja',
              active: true,
              notes: clean(r[9]),
              updatedAt: new Date(),
            },
          });
      }
      factorCount++;
    }

    // Negative faktorer (N001 - N042)
    else if (/^N\d+/.test(code)) {
      part5Count++;
      if (db) {
        await db
          .insert(factors)
          .values({
            code,
            part: 5,
            groupName: 'Negative faktorer',
            nameEn: clean(r[1]),
            nameNo: clean(r[1]),
            whitesparkRankMap: parseIntNum(r[2]),
            whitesparkScoreMap: parseIntNum(r[3]),
            measurable: clean(r[4]) || 'Ja',
            source: clean(r[5]),
            rule: clean(r[6]),
            notes: clean(r[7]),
            active: true,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: factors.code,
            set: {
              part: 5,
              groupName: 'Negative faktorer',
              nameEn: clean(r[1]),
              nameNo: clean(r[1]),
              whitesparkRankMap: parseIntNum(r[2]),
              whitesparkScoreMap: parseIntNum(r[3]),
              measurable: clean(r[4]) || 'Ja',
              source: clean(r[5]),
              rule: clean(r[6]),
              notes: clean(r[7]),
              active: true,
              updatedAt: new Date(),
            },
          });
      }
      factorCount++;
    }
  }

  console.log(`✅ ${isDryRun ? 'Validated' : 'Upserted'} ${factorCount} factors into factors table:`);
  console.log(`   - Del 1 (Lokalt søk / Whitespark LSRF 2026): ${part1Count} faktorer (L001 - L187)`);
  console.log(`   - Del 2 (Generell SEO): ${part2Count} faktorer (G001 - G054)`);
  console.log(`   - Del 3 (AI-synlighet): ${part3Count} faktorer (A001 - A020)`);
  console.log(`   - Del 4 (Ads & økonomi): ${part4Count} faktorer (B001 - B011)`);
  console.log(`   - Negative faktorer: ${part5Count} faktorer (N001 - N042)`);
  console.log('🎉 Database seed completed successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed with error:', err);
  process.exit(1);
});
