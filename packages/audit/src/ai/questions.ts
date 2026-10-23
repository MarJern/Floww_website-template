// ============================================================================
// AI VISIBILITY QUESTION TEMPLATES (Q1 - Q10)
// From: faktorliste.csv (Del 3 AI-synlighet) & teknisk_rigg.txt
// ============================================================================

export interface AiQuestionTemplate {
  code: string; // Q1 - Q10
  template: string;
  example: string;
  intent: string;
  weight: number;
  comment?: string;
}

export const AI_QUESTION_TEMPLATES: AiQuestionTemplate[] = [
  {
    code: 'Q1',
    template: 'Hvilken {tjeneste} anbefaler du i {bydel}?',
    example: 'Hvilken tannlege anbefaler du på Skøyen?',
    intent: 'Anbefaling, nær',
    weight: 3,
  },
  {
    code: 'Q2',
    template: 'Beste {tjeneste} i {by}',
    example: 'Beste tannlege i Oslo',
    intent: 'Anbefaling, by',
    weight: 3,
  },
  {
    code: 'Q3',
    template: '{tjeneste} nær {sted}',
    example: 'Tannlege nær Skøyen stasjon',
    intent: 'Nærhet',
    weight: 2,
  },
  {
    code: 'Q4',
    template: 'Hva koster {hovedtjeneste} hos {tjeneste} i {by}?',
    example: 'Hva koster tannlegesjekk i Oslo?',
    intent: 'Pris',
    weight: 2,
    comment: 'Trigger ofte lister med navn og priser',
  },
  {
    code: 'Q5',
    template: '{spesialtjeneste} {by}',
    example: 'Akutt tannlege Oslo vest',
    intent: 'Spesifikk tjeneste',
    weight: 2,
    comment: 'Én per hovedtjeneste i ordboken',
  },
  {
    code: 'Q6',
    template: '{tjeneste} {by} med gode anmeldelser',
    example: 'Tannlege Oslo med gode anmeldelser',
    intent: 'Omdømme',
    weight: 2,
  },
  {
    code: 'Q7',
    template: 'Er {firmanavn} en god {tjeneste}?',
    example: 'Er Smilia en god tannlege?',
    intent: 'Merkevare',
    weight: 1,
    comment: 'Sjekker om modellen kjenner virksomheten og hva den sier',
  },
  {
    code: 'Q8',
    template: '{tjeneste} {by} {attributt}',
    example: 'Tannlege Oslo som tar imot nye pasienter',
    intent: 'Attributt',
    weight: 1,
    comment: 'Attributtliste per NACE',
  },
  {
    code: 'Q9',
    template: 'Hvor ligger {firmanavn} og hva er telefonnummeret?',
    example: 'Hvor ligger Smilia og hva er telefonnummeret?',
    intent: 'Faktakontroll',
    weight: 1,
    comment: 'Måler om NAP i svaret er riktig',
  },
  {
    code: 'Q10',
    template: 'Anbefal tre {tjeneste} i {bydel} og hvorfor',
    example: 'Anbefal tre tannleger på Skøyen og hvorfor',
    intent: 'Liste',
    weight: 3,
    comment: 'Gir konkurrentnavn',
  },
];

export interface AiQuestionParams {
  tjeneste: string; // f.eks. "tannlege", "digitalbyrå"
  tjenesteFlertall?: string; // f.eks. "tannleger", "digitalbyråer"
  erIntetkjonn?: boolean; // true for "-byrå", "-senter", "-firma" osv.
  by: string; // f.eks. "Oslo"
  bydel?: string; // f.eks. "Majorstuen", "Oslo og omegn"
  sted?: string; // f.eks. "Majorstuenkrysset", "Oslo sentrum"
  hovedtjeneste?: string; // f.eks. "tannlegesjekk", "lokal SEO"
  spesialtjeneste?: string; // f.eks. "akutt tannlege", "skreddersydde nettsider"
  firmanavn: string; // f.eks. "Smilia", "Floww Media AS"
  attributt?: string; // f.eks. "som tar imot nye pasienter", "med dokumenterte resultater"
}

export interface GeneratedAiQuestion {
  code: string;
  question: string;
  intent: string;
  weight: number;
}

function capitalizeFirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Fills the 10 standard question templates with business specific parameters
 * and correct Norwegian grammar (common vs. neuter gender, plural in Q10, and capitalization).
 */
export function generateAiQuestions(params: AiQuestionParams): GeneratedAiQuestion[] {
  const by = params.by || 'Oslo';
  const bydel = params.bydel || `${by} og omegn`;
  const sted = params.sted || `${by} sentrum`;
  const tjeneste = params.tjeneste || 'bedrift';
  const tjenesteFlertall = params.tjenesteFlertall || `${tjeneste}er`;
  const erIntetkjonn = Boolean(params.erIntetkjonn);
  const firmanavn = params.firmanavn;
  const hovedtjeneste = params.hovedtjeneste || tjeneste;
  const spesialtjeneste = params.spesialtjeneste || `beste ${tjeneste}`;
  const attributt = params.attributt || 'med gode referanser';

  return AI_QUESTION_TEMPLATES.map((tmpl) => {
    let q = tmpl.template;

    // Handle neuter vs common gender in Q1 ("Hvilket digitalbyrå" vs "Hvilken tannlege")
    if (tmpl.code === 'Q1' && erIntetkjonn) {
      q = q.replace(/^Hvilken\b/, 'Hvilket');
    }

    // Handle neuter vs common gender in Q7 ("et godt digitalbyrå" vs "en god tannlege")
    if (tmpl.code === 'Q7' && erIntetkjonn) {
      q = q.replace(/\ben god\b/, 'et godt');
    }

    // Use plural noun in Q10 ("Anbefal tre digitalbyråer..." / "Anbefal tre tannleger...")
    if (tmpl.code === 'Q10') {
      q = q.replace(/{tjeneste}/g, tjenesteFlertall);
    } else {
      q = q.replace(/{tjeneste}/g, tjeneste);
    }

    q = q
      .replace(/{by}/g, by)
      .replace(/{bydel}/g, bydel)
      .replace(/{sted}/g, sted)
      .replace(/{hovedtjeneste}/g, hovedtjeneste)
      .replace(/{spesialtjeneste}/g, spesialtjeneste)
      .replace(/{firmanavn}/g, firmanavn)
      .replace(/{attributt}/g, attributt);

    q = capitalizeFirst(q.trim());

    return {
      code: tmpl.code,
      question: q,
      intent: tmpl.intent,
      weight: tmpl.weight,
    };
  });
}
