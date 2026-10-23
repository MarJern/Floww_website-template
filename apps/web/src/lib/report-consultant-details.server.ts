import 'server-only';
import {
  type UnredactedFindingItem,
  type ConsultantDetails,
  getVisibleProblemIndicator,
} from '@/components/synlighetsrapport/types';

export interface CanonicalFactorMeta {
  nameNo: string;
  benchmarkRule: string;
  thresholdOk?: string;
  thresholdWarn?: string;
  thresholdCrit?: string;
}

/**
 * Authoritative consultant metadata & benchmark rules for all active factors.
 * Eliminates internal developer notes and fixes any historical DB/module code shifts.
 */
export const CANONICAL_FACTOR_META: Record<string, CanonicalFactorMeta> = {
  L001: {
    nameNo: 'Primærkategori på Google-profilen er bransjerelevant',
    benchmarkRule:
      'Primærkategorien på Google Bedriftsprofil må samsvare presist med virksomhetens hovedtjeneste og de mest søkte bransjetermene.',
    thresholdOk: 'Presis bransjekategori',
    thresholdWarn: 'Generell kategori',
    thresholdCrit: 'Mangler eller feil kategori',
  },
  L002: {
    nameNo: 'Lokal kartdekning i nærområdet (3×3 Geo-Grid)',
    benchmarkRule:
      'Gjennomsnittlig plassering i Google Maps på tvers av 9 målepunkter i nærområdet bør ligge i Topp 3 (Local Pack) for å fange hoveddelen av lokale søkeklikk.',
    thresholdOk: 'Snittplassering ≤ 3.5',
    thresholdWarn: 'Snittplassering 3.6–7.0',
    thresholdCrit: 'Snittplassering > 7.0',
  },
  L003: {
    nameNo: 'Hovedtjeneste eller lokasjon i virksomhetsnavn',
    benchmarkRule:
      'Virksomhetsnavn som naturlig inkluderer bransje eller lokasjon oppnår dokumentert høyere klikkrate og relevans i kartpakken.',
  },
  L004: {
    nameNo: 'Gjennomsnittlig Google-stjernerating',
    benchmarkRule:
      'Gjennomsnittlig kundevurdering bør være minst 4,5 av 5,0 stjerner for å passere Googles kvalitetsfilter på «beste»-søk og skape høy tillit.',
    thresholdOk: '≥ 4.5 ★',
    thresholdWarn: '4.0–4.4 ★',
    thresholdCrit: '< 4.0 ★',
  },
  L008: {
    nameNo: 'Relevante tilleggskategorier på Google-profilen',
    benchmarkRule:
      'Profilen bør ha 2–4 presise tilleggskategorier utover primærkategorien for å synliggjøre alle spesialtjenester i lokale søk.',
    thresholdOk: '2–5 relevante kategorier',
    thresholdWarn: 'Kun 1 kategori',
    thresholdCrit: 'Ingen tilleggskategorier',
  },
  L009: {
    nameNo: 'Antall Google-anmeldelser mot lokal topp 3',
    benchmarkRule:
      'Totalt antall publiserte kundeanmeldelser må stå i forhold til gjennomsnittet hos de 3 mest synlige konkurrentene i samme bydel/kommune.',
    thresholdOk: '≥ 75 % av topp 3-snittet',
    thresholdWarn: '30–74 % av topp 3-snittet',
    thresholdCrit: '< 30 % av topp 3-snittet',
  },
  L011: {
    nameNo: 'Ferskhet på siste publiserte Google-anmeldelser',
    benchmarkRule:
      'Det bør ikke gå mer enn 30 dager siden siste publiserte kundeanmeldelse, da søkemotoren vektlegger fersk kundedialog tungt.',
    thresholdOk: 'Siste 30 dager',
    thresholdWarn: '31–90 dager siden',
    thresholdCrit: 'Over 90 dager siden',
  },
  L013: {
    nameNo: 'Verifisert fysisk besøksadresse i målområdet',
    benchmarkRule:
      'Virksomheten må ha en registrert, fysisk besøksadresse innenfor det geografiske området kundene søker i.',
    thresholdOk: 'Verifisert gateadresse i målområdet',
    thresholdWarn: 'Utenfor sentralt målområde',
    thresholdCrit: 'Mangler fysisk adresse',
  },
  L014: {
    nameNo: 'Jevn tilstrømning av nye anmeldelser per måned',
    benchmarkRule:
      'Virksomheten bør opprettholde en jevn, kontinuerlig tilstrømning av nye kundeanmeldelser hver måned (anbefalt minst 3–4 per måned).',
    thresholdOk: '≥ 3 nye anmeldelser/mnd',
    thresholdWarn: '1–2 nye anmeldelser/mnd',
    thresholdCrit: '< 1 ny anmeldelse/mnd',
  },
  L015: {
    nameNo: 'Samsvar i kontaktdata (NAP) mellom nettside og Google-profil',
    benchmarkRule:
      'Firmanavn, gateadresse, postnummer og telefonnummer på nettsiden må samsvare 100 % med opplysningene på Google Bedriftsprofil.',
    thresholdOk: 'Fullstendig NAP-samsvar',
    thresholdWarn: 'Delvis samsvar',
    thresholdCrit: 'Mangler eller avviker',
  },
  L016: {
    nameNo: 'Verifisert og aktiv Google Bedriftsprofil',
    benchmarkRule:
      'Google Bedriftsprofil må være opprettet, eierverifisert og ha aktiv kobling til virksomhetens hoveddomene og telefonnummer.',
    thresholdOk: 'Verifisert profil med nettside og telefon',
    thresholdWarn: 'Delvis verifisert profil',
    thresholdCrit: 'Uverifisert eller manglende profil',
  },
  L018: {
    nameNo: 'Geografisk søkeord i sidetittel (Title) og hovedoverskrift (H1)',
    benchmarkRule:
      'Viktige landingssider bør kombinere behandling/tjeneste og geografisk stedsnavn (by eller bydel) i både sidetittel og hovedoverskrift.',
    thresholdOk: '≥ 80 % av sidene',
    thresholdWarn: '40–79 % av sidene',
    thresholdCrit: '< 40 % av sidene',
  },
  L020: {
    nameNo: 'Registrerte åpningstider på Google-profilen',
    benchmarkRule:
      'Komplette og oppdaterte åpningstider må være registrert på Google Bedriftsprofil for å unngå rangeringsnedtrekk når kunder søker etter åpne tilbud.',
    thresholdOk: 'Komplette åpningstider registrert',
    thresholdWarn: 'Begrensede åpningstider',
    thresholdCrit: 'Åpningstider mangler',
  },
  L022: {
    nameNo: 'Utfyllingsgrad på Google Bedriftsprofil',
    benchmarkRule:
      'Alle sentrale profilfelter (kategorier, tjenestemeny, åpningstider, nettside, telefon og bildegalleri) skal være komplett utfylt.',
    thresholdOk: '≥ 85 % utfylt',
    thresholdWarn: '65–84 % utfylt',
    thresholdCrit: '< 65 % utfylt',
  },
  L024: {
    nameNo: 'Dedikert lokal landingsside for hver hovedtjeneste',
    benchmarkRule:
      'Hver hovedtjeneste skal ha sin egen dedikerte, søkeoptimaliserte landingsside fremfor å samles på én felles oversiktsside.',
    thresholdOk: '≥ 80 % tjenestedekning',
    thresholdWarn: '45–79 % tjenestedekning',
    thresholdCrit: '< 45 % tjenestedekning',
  },
  L025: {
    nameNo: 'Antall unike domener som lenker til virksomheten',
    benchmarkRule:
      'Antall unike, autoritative nettsteder som lenker til domenet bør være på nivå med eller over gjennomsnittet for lokal topp 3.',
    thresholdOk: 'På nivå med topp 3 (≥ 35 domener)',
    thresholdWarn: '15–34 henvisende domener',
    thresholdCrit: '< 15 henvisende domener',
  },
  L028: {
    nameNo: 'Oppføring og konsistens på Apple Maps og Bing Places',
    benchmarkRule:
      'Virksomheten bør være registrert med identiske kontaktdata i både Apple Maps og Bing Places, som brukes direkte av iPhone/Siri og ChatGPT.',
    thresholdOk: 'Bekreftet i begge karttjenester',
    thresholdWarn: 'Kun én karttjeneste eller mindre avvik',
    thresholdCrit: 'Mangler i begge karttjenester',
  },
  L031: {
    nameNo: 'Domenestyrke sammenlignet med lokal topp 3',
    benchmarkRule:
      'Nettstedets samlede domeneautoritet bør matche de høyest rangerte konkurrentene i lokalmarkedet.',
    thresholdOk: 'Autoritetsscore ≥ 30',
    thresholdWarn: 'Autoritetsscore 15–29',
    thresholdCrit: 'Autoritetsscore < 15',
  },
  L048: {
    nameNo: 'Svarprosent fra eier på kundeanmeldelser i Google',
    benchmarkRule:
      'Ledelsen bør besvare minst 80 % av alle publiserte Google-anmeldelser for å dokumentere aktiv kundedialog overfor både nye kunder og søkealgoritmen.',
    thresholdOk: '≥ 80 % besvart',
    thresholdWarn: '30–79 % besvart',
    thresholdCrit: '< 30 % besvart',
  },
  L049: {
    nameNo: 'Tilstedeværelse i sentrale norske bransjekataloger',
    benchmarkRule:
      'Virksomheten skal være registrert i de viktigste norske opplysnings- og bransjekatalogene (1881, Gule Sider, Proff m.fl.) for å bekrefte lokal tilstedeværelse.',
    thresholdOk: '≥ 5 av 6 kjernekataloger',
    thresholdWarn: '3–4 av 6 kjernekataloger',
    thresholdCrit: '< 3 kjernekataloger',
  },
  L052: {
    nameNo: 'Relevante lokale og bransjespesifikke innlenker',
    benchmarkRule:
      'Lenkeprofilen bør inneholde redaksjonelle og lokale innlenker fra norske nettsteder, samarbeidspartnere og fagmiljøer.',
    thresholdOk: 'Sterk lokal lenkeprofil',
    thresholdWarn: 'Moderat lokal lenkeprofil',
    thresholdCrit: 'Svak lokal lenkeprofil',
  },
  L060: {
    nameNo: 'Antall og kvalitet på bilder på Google-profilen',
    benchmarkRule:
      'Google-profilen bør inneholde minst 20 oppdaterte, autentiske bilder av lokaler, fasade, utstyr og fagpersonell.',
    thresholdOk: '≥ 20 bilder',
    thresholdWarn: '6–19 bilder',
    thresholdCrit: '≤ 5 bilder',
  },
  L063: {
    nameNo: 'Konsistens i navn, adresse og telefon (NAP) i kataloger',
    benchmarkRule:
      'Kontaktdata (firmanavn, adresse og telefonnummer) må være 100 % konsistente uten avvik på tvers av norske katalogoppføringer.',
    thresholdOk: '100 % konsistent NAP',
    thresholdWarn: '1 mindre avvik oppdaget',
    thresholdCrit: 'Flere motstridende adresse-/telefonoppføringer',
  },
  L107: {
    nameNo: 'Synlighet på uavhengige «Beste i byen»-lister og kåringer',
    benchmarkRule:
      'Tilstedeværelse i redaksjonelle guider og sammenligningssider styrker både organisk klikkrate og sannsynligheten for å bli anbefalt av AI-søkemotorer.',
    thresholdOk: 'Nevnt i ≥ 2 uavhengige lister',
    thresholdWarn: 'Nevnt i 1 uavhengig liste',
    thresholdCrit: 'Ingen oppføringer på uavhengige topplister',
  },
  L126: {
    nameNo: 'Omtaler av firmanavnet på eksterne nettsider',
    benchmarkRule:
      'Firmanavnet bør være omtalt på minst 5 uavhengige, eksterne norske nettsider utenfor egne kanaler for å bygge merkevareautoritet.',
    thresholdOk: '≥ 5 eksterne omtaler',
    thresholdWarn: '1–4 eksterne omtaler',
    thresholdCrit: '0 eksterne omtaler',
  },
  G001: {
    nameNo: 'Innlastingshastighet for hovedinnhold på mobil (LCP)',
    benchmarkRule:
      'Hovedinnholdet på skjermen (Largest Contentful Paint) skal laste inn på maksimalt 2,5 sekunder på mobil (4G) i henhold til Googles Core Web Vitals-krav.',
    thresholdOk: '≤ 2,5 sekunder',
    thresholdWarn: '2,6–4,0 sekunder',
    thresholdCrit: '> 4,0 sekunder',
  },
  G002: {
    nameNo: 'Interaksjonsrespons på mobil (INP)',
    benchmarkRule:
      'Tiden fra en bruker trykker på en knapp eller meny på mobil til siden reagerer (Interaction to Next Paint) skal være under 200 millisekunder.',
    thresholdOk: '≤ 200 ms',
    thresholdWarn: '201–500 ms',
    thresholdCrit: '> 500 ms',
  },
  G003: {
    nameNo: 'Visuell stabilitet under innlasting (CLS)',
    benchmarkRule:
      'Sideelementer skal ikke hoppe eller forskyve seg under innlasting (Cumulative Layout Shift skal være ≤ 0,10).',
    thresholdOk: '≤ 0,10',
    thresholdWarn: '0,11–0,25',
    thresholdCrit: '> 0,25',
  },
  G004: {
    nameNo: 'Samlet ytelsesscore på mobil',
    benchmarkRule:
      'Nettstedets samlede tekniske ytelsesscore på mobil bør være minst 80 av 100 for å sikre lav fluktrate og optimal rangering.',
    thresholdOk: '≥ 80 / 100',
    thresholdWarn: '50–79 / 100',
    thresholdCrit: '< 50 / 100',
  },
  G006: {
    nameNo: 'Sikker kryptert tilkobling (HTTPS)',
    benchmarkRule:
      'Hele nettstedet må leveres over gyldig, kryptert HTTPS-forbindelse med automatisk videresending fra HTTP.',
    thresholdOk: 'Aktiv HTTPS',
    thresholdCrit: 'Mangler HTTPS',
  },
  G007: {
    nameNo: 'Indekserbarhet for søkemotorer',
    benchmarkRule:
      'Alle kommersielle landingssider skal være åpne for indeksering uten utilsiktede blokkeringer i meta-tags eller robots.txt.',
    thresholdOk: 'Alle viktige sider kan indekseres',
    thresholdCrit: 'Blokkert fra indeksering',
  },
  G009: {
    nameNo: 'Tilgjengelig XML-sidekart (sitemap)',
    benchmarkRule:
      'Et oppdatert XML-sidekart skal være tilgjengelig og referert i robots.txt for rask indeksering av nye og oppdaterte sider.',
    thresholdOk: 'XML-sidekart aktivt og registrert',
    thresholdWarn: 'Ikke oppgitt i robots.txt',
    thresholdCrit: 'Mangler XML-sidekart',
  },
  G010: {
    nameNo: 'Korrekt bruk av kanoniske adresser (Canonical-tag)',
    benchmarkRule:
      'Minst 85 % av undersidene bør ha en gyldig canonical-tag for å forhindre duplisert innhold og samle rangeringskraften på rett URL.',
    thresholdOk: '≥ 85 % av sidene',
    thresholdWarn: '50–84 % av sidene',
    thresholdCrit: '< 50 % av sidene',
  },
  G011: {
    nameNo: 'Fravær av brutte interne lenker (HTTP 404)',
    benchmarkRule:
      'Nettstedet skal ha 0 ødelagte interne lenker (HTTP 404), da døde lenker svekker både brukeropplevelsen og søkemotorenes gjennomgang.',
    thresholdOk: '0 brutte lenker',
    thresholdWarn: '1–2 brutte lenker',
    thresholdCrit: '≥ 3 brutte lenker',
  },
  G013: {
    nameNo: 'Strukturerte skjemadata (Schema.org) for virksomhet og tjenester',
    benchmarkRule:
      'Sidene bør inneholde maskinlesbare strukturerte data (Organization/LocalBusiness, Service, AggregateRating og FAQPage) slik at søkemotorer og AI forstår innholdet.',
    thresholdOk: '≥ 75 % av sidene har skjemadata',
    thresholdWarn: '40–74 % av sidene har skjemadata',
    thresholdCrit: '< 40 % av sidene har skjemadata',
  },
  G016: {
    nameNo: 'Serverens responstid ved sideoppslag (TTFB)',
    benchmarkRule:
      'Webserveren bør svare innen 0,8 sekunder (Time to First Byte) for å sikre rask sidevisning på mobil.',
    thresholdOk: '≤ 0,8 sekunder',
    thresholdWarn: '0,9–1,8 sekunder',
    thresholdCrit: '> 1,8 sekunder',
  },
  G017: {
    nameNo: 'Tilgang for AI-søkemotorer i robots.txt',
    benchmarkRule:
      'Nettstedets robots.txt må tillate indeksering fra ledende AI-søkemotorer (ChatGPT, Claude, Perplexity og Google-Extended).',
    thresholdOk: 'AI-søkemotorer tillatt',
    thresholdWarn: 'Delvis blokkert i robots.txt',
    thresholdCrit: 'Blokkert i robots.txt',
  },
  G020: {
    nameNo: 'Klikkdybde fra forsiden til viktige tjenestesider',
    benchmarkRule:
      'Alle kommersielle hovedtjenester skal kunne nås med maksimalt 2 klikk fra nettstedets forside.',
    thresholdOk: '≤ 2 klikk fra forsiden',
    thresholdWarn: '3 klikk fra forsiden',
    thresholdCrit: '≥ 4 klikk fra forsiden',
  },
  G024: {
    nameNo: 'Tydelig hovednavigasjon til alle hovedtjenester',
    benchmarkRule:
      'Forsiden og hovedmenyen skal lenke direkte til minst 5 dedikerte undersider for virksomhetens viktigste tjenester.',
    thresholdOk: '≥ 5 direkte tjenestelenker',
    thresholdWarn: '2–4 direkte tjenestelenker',
    thresholdCrit: '< 2 tjenestelenker',
  },
  G028: {
    nameNo: 'Unike sidetitler med tjeneste og lokasjon',
    benchmarkRule:
      'Minst 85 % av sidene skal ha en unik sidetittel (<title>) som kombinerer tjenestenavn og geografisk område.',
    thresholdOk: '≥ 85 % av sidene',
    thresholdWarn: '50–84 % av sidene',
    thresholdCrit: '< 50 % av sidene',
  },
  G029: {
    nameNo: 'Unike og beskrivende metabeskrivelser',
    benchmarkRule:
      'Minst 90 % av sidene skal ha en unik metabeskrivelse (meta description) på 70–160 tegn som øker klikkraten i søkeresultatet.',
    thresholdOk: '≥ 90 % av sidene',
    thresholdWarn: '50–89 % av sidene',
    thresholdCrit: '< 50 % av sidene',
  },
  G030: {
    nameNo: 'Tydelig hovedoverskrift (én H1 per side)',
    benchmarkRule:
      'Hver side skal ha nøyaktig én primær hovedoverskrift (H1) som beskriver sidens kjerneemne.',
    thresholdOk: '≥ 85 % av sidene',
    thresholdWarn: '50–84 % av sidene',
    thresholdCrit: '< 50 % av sidene',
  },
  G031: {
    nameNo: 'Dedikerte landingssider per hovedtjeneste',
    benchmarkRule:
      'Nettstedet bør ha egne, faglig utdypende landingssider for minst 80 % av bransjens hovedtjenester for å rangere på spesifikke fagtermer.',
    thresholdOk: '≥ 80 % tjenestedekning',
    thresholdWarn: '50–79 % tjenestedekning',
    thresholdCrit: '< 50 % tjenestedekning',
  },
  G037: {
    nameNo: 'Strukturerte spørsmål og svar (FAQ) på tjenestesider',
    benchmarkRule:
      'Tjenestesidene bør besvare vanlige kundespørsmål om pris, varighet og forløp i en strukturert FAQ-seksjon.',
    thresholdOk: '≥ 60 % av sidene har FAQ',
    thresholdWarn: '30–59 % av sidene har FAQ',
    thresholdCrit: '< 30 % av sidene har FAQ',
  },
  G041: {
    nameNo: 'Synlig timebestilling og klikkbar telefonlenke på alle sider',
    benchmarkRule:
      'Minst 75 % av sidene skal ha en umiddelbart synlig bestillingsknapp og klikkbar telefonlenke (tel:) for mobilbrukere.',
    thresholdOk: '≥ 75 % av sidene',
    thresholdWarn: '40–74 % av sidene',
    thresholdCrit: '< 40 % av sidene',
  },
  G044: {
    nameNo: 'Bredde i lenkeprofilen (henvisende domener)',
    benchmarkRule:
      'Nettstedet bør ha innlenker fra et bredt antall uavhengige domener for å sikre organisk rangeringskraft på konkurranseutsatte søkeord.',
    thresholdOk: '≥ 35 henvisende domener',
    thresholdWarn: '15–34 henvisende domener',
    thresholdCrit: '< 15 henvisende domener',
  },
  G045: {
    nameNo: 'Off-page domeneautoritet mot bransjesnittet',
    benchmarkRule:
      'Domenets autoritetsscore må være konkurransedyktig mot de øvrige aktørene på side 1 i Google.',
    thresholdOk: 'Autoritetsscore ≥ 30',
    thresholdWarn: 'Autoritetsscore 15–29',
    thresholdCrit: 'Autoritetsscore < 15',
  },
  G047: {
    nameNo: 'Fravær av skadelige eller kunstige spam-lenker',
    benchmarkRule:
      'Lenkeprofilen skal være fri for kunstige spam-lenker som kan svekke nettstedets tillit i søkealgoritmen.',
    thresholdOk: '0 toksiske lenker',
    thresholdWarn: '1–5 tvilsomme lenker',
    thresholdCrit: '> 5 toksiske lenker',
  },
  G048: {
    nameNo: 'Naturlig og relevant ankertekstprofil på innlenker',
    benchmarkRule:
      'Ankertekstene som lenker til nettstedet bør ha en sunn balanse mellom firmanavn (≥ 40 %) og beskrivende tjenesteord (≥ 12 %).',
    thresholdOk: 'Balansert merkevare- og søkeordprofil',
    thresholdWarn: 'For lav andel beskrivende ankertekst',
    thresholdCrit: 'Unaturlig eller overoptimalisert profil',
  },
  G052: {
    nameNo: 'Off-page merkevareomtaler på eksterne nettsider',
    benchmarkRule:
      'Jevnlige omtaler av virksomheten på eksterne fag- og bransjesider styrker søkemotorenes vurdering av merkevareautoritet.',
    thresholdOk: '≥ 5 eksterne omtaler',
    thresholdWarn: '1–4 eksterne omtaler',
    thresholdCrit: '0 eksterne omtaler',
  },
  G054: {
    nameNo: 'Tilstedeværelse og samsvar på sosiale bedriftsprofiler',
    benchmarkRule:
      'Aktive og verifiserte bedriftsprofiler i sosiale kanaler (Facebook, Instagram, LinkedIn) med lenke til hoveddomenet styrker merkevaresignalene.',
    thresholdOk: 'Verifiserte og konsistente profiler',
    thresholdWarn: 'Delvis utfylte profiler',
    thresholdCrit: 'Mangler sosiale bedriftsprofiler',
  },
  A001: {
    nameNo: 'Anbefalingsgrad i AI-søk (ChatGPT, Gemini, Claude og Perplexity)',
    benchmarkRule:
      'Virksomheten bør bli nevnt og anbefalt i minst 50 % av relevante bransje- og behandlingsspørsmål i ChatGPT, Google Gemini, Claude og Perplexity.',
    thresholdOk: '≥ 50 % anbefalingsgrad',
    thresholdWarn: '25–49 % anbefalingsgrad',
    thresholdCrit: '< 25 % anbefalingsgrad',
  },
  A002: {
    nameNo: 'Siteringsgrad fra egne fagsider i AI-genererte svar',
    benchmarkRule:
      'Nettstedets tjenestesider bør inneholde så konkrete fakta-, pris- og behandlingsbeskrivelser at AI-modellene siterer domenet som kilde i minst 40 % av svarene.',
    thresholdOk: '≥ 40 % kildesitering',
    thresholdWarn: '15–39 % kildesitering',
    thresholdCrit: '< 15 % kildesitering',
  },
  A003: {
    nameNo: 'Tilstedeværelse i autoritative kilder brukt av AI-modeller',
    benchmarkRule:
      'Virksomheten må være konsistent oppført i de uavhengige katalogene og fagregistrene som språkmodellene bruker til å kryssjekke anbefalinger.',
    thresholdOk: 'Bekreftet i ≥ 5 autoritative kilder',
    thresholdWarn: 'Bekreftet i 3–4 kilder',
    thresholdCrit: 'Bekreftet i < 3 kilder',
  },
  A006: {
    nameNo: 'Tydelig geografisk forankring i nettsidens brødtekst',
    benchmarkRule:
      'Forside og tjenestesider skal eksplisitt nevne by, bydel og geografisk nedslagsfelt i selve brødteksten.',
    thresholdOk: 'Tydelig geografisk forankring',
    thresholdWarn: 'Svak geografisk forankring',
    thresholdCrit: 'Mangler geografisk forankring',
  },
  A010: {
    nameNo: 'Merkevareomtaler og synlighet i eksterne AI-kilder',
    benchmarkRule:
      'Virksomheten må ha tilstrekkelig ekstern omtale- og siteringsbredde til å konkurrere med aktørene som oftest trekkes frem av AI-søkemotorene.',
    thresholdOk: 'Sterk merkevareprominens i AI-kilder',
    thresholdWarn: 'Lavere omtalevolum enn toppkonkurrentene',
    thresholdCrit: 'Fraværende i eksterne AI-kilder',
  },
  A012: {
    nameNo: 'Åpen tilgang for AI-agenter i robots.txt',
    benchmarkRule:
      'Nettstedet må tillate innhenting fra AI-søkeroboter (GPTBot, ClaudeBot og PerplexityBot) slik at ferske priser og tjenester inkluderes i AI-svar.',
    thresholdOk: 'Åpen tilgang for AI-agenter',
    thresholdCrit: 'AI-agenter er blokkert',
  },
  A014: {
    nameNo: 'Konsistens mellom Google, Bing Places og Apple Maps for AI-søk',
    benchmarkRule:
      'Ettersom ChatGPT og Copilot henter lokale data fra Bing og Apple Maps henter fra egne registre, må alle tre kartøkosystemer ha identiske virksomhetsdata.',
    thresholdOk: 'Synkronisert på tvers av karttjenester',
    thresholdWarn: 'Mangler verifisering i Bing eller Apple Maps',
    thresholdCrit: 'Manglende eller motstridende kartdata',
  },
  A015: {
    nameNo: 'Entitetskobling (sameAs) mellom nettside, registre og profiler',
    benchmarkRule:
      'Nettstedets skjemadata (JSON-LD) skal inneholde sameAs-referanser som knytter domenet direkte til Enhetsregisteret, Google Maps og offisielle profiler.',
    thresholdOk: 'Komplett sameAs-entitetsgraf',
    thresholdWarn: 'Delvis entitetskobling',
    thresholdCrit: 'Mangler sameAs-entitetskobling',
  },
  A017: {
    nameNo: 'Tydelig virksomhets- og lokasjonsdefinisjon i åpningstekst',
    benchmarkRule:
      'Åpningsteksten på forsiden bør definere tydelig hvem virksomheten er, hvilke hovedtjenester som tilbys, og i hvilket geografisk område.',
    thresholdOk: 'Tydelig semantisk struktur i åpningstekst',
    thresholdWarn: 'Uklart definert åpningstekst',
  },
  A019: {
    nameNo: 'Maskinlesbar tjeneste- og prisoversikt (/llms.txt) for AI-agenter',
    benchmarkRule:
      'En strukturert /llms.txt-fil på rotdomenet gir AI-agenter direkte, kvalitetssikret tilgang til virksomhetens behandlinger, priser, åpningstider og kontaktinfo.',
    thresholdOk: '/llms.txt tilgjengelig på rotdomenet',
    thresholdCrit: 'Mangler /llms.txt på rotdomenet',
  },
  B001: {
    nameNo: 'Mobil landingssideopplevelse og Google Ads Quality Score',
    benchmarkRule:
      'Rask mobilinnlasting (LCP ≤ 2,5 s) er avgjørende for høy Quality Score i Google Ads og forhindrer unødvendig klikkpris-påslag (CPC-straff).',
    thresholdOk: 'Høy hastighet (LCP ≤ 2,5 s)',
    thresholdWarn: 'Moderat hastighet (LCP 2,6–4,0 s)',
    thresholdCrit: 'Lav hastighet (LCP > 4,0 s, øker klikkprisen)',
  },
  B002: {
    nameNo: 'Dedikerte landingssider for betalte søkeord i Google Ads',
    benchmarkRule:
      'Hver hovedtjeneste bør ha en skreddersydd landingsside som matcher søkeordet for å maksimere annonserelevans og konverteringsrate.',
    thresholdOk: '≥ 80 % dekning av hovedtjenester',
    thresholdWarn: '50–79 % dekning av hovedtjenester',
    thresholdCrit: '< 50 % dekning (høy annonselekkasje)',
  },
  B005: {
    nameNo: 'Beskyttelse av eget firmanavn i betalt søk (Brand-søk)',
    benchmarkRule:
      'Når kunder søker direkte på virksomhetens firmanavn, bør ikke konkurrenter få stjele klikkene via betalte annonser øverst på siden.',
    thresholdOk: 'Ingen konkurrenter byr på firmanavnet',
    thresholdWarn: 'Konkurrenter viser annonser på firmanavnet',
  },
  B006: {
    nameNo: 'Kobling mellom Google Bedriftsprofil og lokasjonsutvidelser',
    benchmarkRule:
      'Verifisert Google Bedriftsprofil med matchende domene må være klar for lokasjonsutvidelser (Location Assets) i Google Ads.',
    thresholdOk: 'Klar for lokasjonsutvidelser',
    thresholdWarn: 'Mangler verifisering eller domenekobling',
  },
  B007: {
    nameNo: 'Kvalifisering til automatiske stjerneutvidelser i Google Ads',
    benchmarkRule:
      'Kombinationen av høy stjernerating og tilstrekkelig anmeldelsesvolum kvalifiserer til synlige stjerner i betalte søkeannonser.',
    thresholdOk: '≥ 4,5 ★ og ≥ 100 anmeldelser',
    thresholdWarn: '≥ 4,0 ★, men under 100 anmeldelser',
    thresholdCrit: 'Under 4,0 ★',
  },
  B008: {
    nameNo: 'Sporbare konverteringspunkter (telefonklikk og online booking)',
    benchmarkRule:
      'Alle landingssider skal ha sporbare telefonlenker (tel:) og tydelige bestillingsknapper slik at annonse- og SEO-avkastning kan måles nøyaktig.',
    thresholdOk: '≥ 80 % av sidene har sporbare CTA-punkter',
    thresholdWarn: '< 80 % av sidene har sporbare CTA-punkter',
  },
  B009: {
    nameNo: 'Organisk dekning på bransjens dyreste kjøpssøkeord',
    benchmarkRule:
      'Virksomheten bør rangere i organisk Topp 3 på hovedtjenestene med høyest kommersiell klikkpris for å redusere avhengigheten av betalt annonsering.',
    thresholdOk: 'Snittposisjon ≤ 3,5 på kjøpssøkeord',
    thresholdWarn: 'Snittposisjon 3,6–10,0',
    thresholdCrit: 'Snittposisjon > 10,0 (utenfor side 1)',
  },
  B010: {
    nameNo: 'Estimert månedlig klikkverdi av nåværende organisk trafikk',
    benchmarkRule:
      'Viser hva virksomhetens nåværende organiske plasseringer på hovedtjenestene ville kostet å kjøpe via Google Ads hver måned.',
    thresholdOk: 'Høy månedlig organisk klikkverdi',
    thresholdWarn: 'Moderat månedlig organisk klikkverdi',
    thresholdCrit: 'Lav månedlig organisk klikkverdi',
  },
  B011: {
    nameNo: 'Konkurransetrykk i betalt søk (Google Ads) på hovedtjenester',
    benchmarkRule:
      'Kartlegger hvor mange konkurrerende virksomheter som kjøper betalte topplasseringer på de mest lønnsomme søkeordene i lokalmarkedet.',
  },
};

export function normalizeFactorMetadata<
  T extends {
    factorCode: string;
    nameNo?: string;
    thresholdOk?: string | null;
    thresholdWarn?: string | null;
    thresholdCrit?: string | null;
  },
>(item: T): T {
  const canonical = CANONICAL_FACTOR_META[item.factorCode];
  if (!canonical) return item;
  return {
    ...item,
    nameNo: canonical.nameNo,
    ...(canonical.thresholdOk !== undefined ? { thresholdOk: canonical.thresholdOk } : {}),
    ...(canonical.thresholdWarn !== undefined ? { thresholdWarn: canonical.thresholdWarn } : {}),
    ...(canonical.thresholdCrit !== undefined ? { thresholdCrit: canonical.thresholdCrit } : {}),
  };
}

/**
 * Server-only step-by-step consultant recipes and technical elaboration builder.
 * Never imported by client components so locked reports cannot leak recipes in JS bundles,
 * and never exposes third-party vendor/API names or internal developer notes.
 */
export function buildServerConsultantDetails(
  item: UnredactedFindingItem,
  businessName: string,
  cityRaw?: string | null
): ConsultantDetails {
  const city = cityRaw || 'Oslo';
  const canonical = CANONICAL_FACTOR_META[item.factorCode];

  const rawSnippet =
    item.evidence?.snippet || 'Måleverdi registrert under vår tekniske gjennomgang.';
  const cleanSnippet = rawSnippet
    .replace(/\s*\(Kilde:[^)]+\)/gi, '')
    .replace(/Lighthouse ytelsesscore/gi, 'Ytelsesscore')
    .replace(/Felt-data \(CrUX\)/gi, 'Feltmåling')
    .replace(/Lighthouse lab/gi, 'Simulert 4G mobil')
    .replace(/Schema\.org JSON-LD/gi, 'strukturerte skjemadata')
    .trim()
    .replace(/\.$/, '');

  const benchmarkRule =
    canonical?.benchmarkRule ||
    'Vurderes etter dokumenterte bransjekrav for lokal synlighet, teknisk helse og konvertering.';

  const thresholdOk = canonical?.thresholdOk ?? item.thresholdOk ?? null;
  const thresholdWarn = canonical?.thresholdWarn ?? item.thresholdWarn ?? null;
  const thresholdCrit = canonical?.thresholdCrit ?? item.thresholdCrit ?? null;

  const thresholdInfo = thresholdOk
    ? `Krav for Godkjent: ${thresholdOk}${
        thresholdWarn ? ` · Advarsel: ${thresholdWarn}` : ''
      }${thresholdCrit ? ` · Kritisk: ${thresholdCrit}` : ''}`
    : null;

  const customStepByStep: Record<string, string> = {
    L001: `1. Kontroller at primærkategorien på Google Bedriftsprofil er satt til den mest presise bransjekategorien for ${businessName}.\n2. Unngå brede sekkekategorier dersom det finnes en spesifikk fagkategori som matcher hovedsøkeordet i ${city}.`,
    L002: `1. Optimaliser Google Bedriftsprofil med alle relevante tilleggskategorier og komplett tjenestemeny for ${city}.\n2. Bygg lokale siteringer og eliminer NAP-avvik i 1881, Gule Sider, Apple Maps og Bing Places.\n3. Etabler dedikerte lokale landingssider for hver hovedtjeneste med lokal skjemamarkering og internlenking fra forsiden.`,
    L004: `1. Innfør systematisk utsendelse av anmeldelsesforespørsel på SMS etter endt kundebesøk for å løfte snittratingen over 4,5 stjerner.\n2. Følg opp eventuelle kritiske tilbakemeldinger profesjonelt og raskt.`,
    L008: `1. Logg inn i Google Bedriftsprofil-administrasjonen for ${businessName}.\n2. Gå til «Rediger profil» → «Virksomhetskategori» og behold nåværende primærkategori.\n3. Legg til 3–4 presise tilleggskategorier som dekker spesialtjenestene deres (slik topp 3-konkurrentene i ${city} har gjort).`,
    L009: `1. Integrer automatisk SMS- eller e-postutsendelse fra journalsystemet 2 timer etter fullført kundebesøk med direkte lenke til Google-anmeldelse.\n2. Plasser QR-kode i resepsjonen/venteområdet.\n3. Sett et månedlig mål om minst 8–10 nye ekte kundeanmeldelser for å hente inn forspranget til topp 3.`,
    L011: `1. Aktiver fast rutine for anmeldelsesforespørsler hver uke slik at profilen aldri går mer enn 14 dager uten en ny anmeldelse.\n2. Søkealgoritmen vektlegger ferskhet («recency») tungt i kartpakken.`,
    L014: `1. Sikre en jevn, naturlig strøm av minst 4–8 nye anmeldelser per måned fremfor sporadiske kampanjer.\n2. Følg opp fornøyde kunder direkte etter utført oppdrag eller besøk.`,
    L015: `1. Oppdater bunntekst (footer) og kontaktside på nettsiden slik at firmanavn, gateadresse, postnummer og telefonnummer er 100 % identisk med Google-profilen.\n2. Marker kontaktinformasjonen med LocalBusiness-skjemadata.`,
    L016: `1. Fullfør eierverifisering av Google Bedriftsprofil og kontroller at offisiell nettside og hovedtelefonnummer er registrert.\n2. Sikre at profilen har status som åpen og aktiv uten duplikatoppføringer i Google Maps.`,
    L018: `1. Oppdater sidetitler (<title>) og hovedoverskrifter (H1) på de viktigste tjenestesidene slik at både tjeneste og by/bydel (${city}) inngår naturlig.`,
    L020: `1. Legg inn fullstendige åpningstider for alle ukedager på Google Bedriftsprofil, inkludert spesielle åpningstider ved høytider.`,
    L022: `1. Fyll ut alle manglende seksjoner i Google-profilen: legg inn komplett tjenesteliste med beskrivelser og fra-priser.\n2. Legg til sporingslenke på bestilling/kontakt og fyll ut virksomhetsbeskrivelse og attributter.`,
    L024: `1. Opprett én dedikert, lokal landingsside for hver hovedtjeneste dere tilbyr i ${city}.\n2. Knytt hver tjenesteside direkte til hovedmenyen og fra tjenestelisten på forsiden.`,
    L025: `1. Bygg relevante innlenker fra lokale samarbeidspartnere, leverandører, fagportaler og næringsforeninger.\n2. Sørg for at viktige bransjekataloger lenker direkte til hoveddomenet med korrekt HTTPS-adresse.`,
    L028: `1. Krev eierskap til profilen i Apple Business Connect (Apple Maps) og Bing Places for Business.\n2. Synkroniser åpningstider, telefonnummer og adresse slik at Siri og ChatGPT finner nøyaktige data.`,
    L031: `1. Styrk domenets autoritet gjennom redaksjonelle omtaler, fagartikler og lenker fra autoritative norske nettsteder.\n2. Konsolider interne lenker mot de viktigste kommersielle undersidene.`,
    L048: `1. Besvar samtlige eksisterende ubesvarte anmeldelser på Google Bedriftsprofil i løpet av de neste 48 timene.\n2. Inkluder naturlig omtale av fagområde og lokasjon i takkesvarene (uten sensitiv kundeinformasjon), og sett opp varsling for nye anmeldelser.`,
    L049: `1. Kontroller og oppdater oppføringene på 1881.no, Gule Sider, Proff.no og øvrige relevante bransjekataloger.\n2. Sørg for at nettsidelenke og telefonnummer er lagt inn i hver katalog.`,
    L052: `1. Kartlegg lokale samarbeidspartnere, bransjeforeninger, leverandører og lokale nettaviser i ${city} som kan lenke til ${businessName}.\n2. Konverter ulenkede omtaler til klikkbare lenker mot hovedsiden.`,
    L060: `1. Last opp minst 15–20 nye høyoppløselige bilder av lokaler, fasade/inngangsparti, utstyr og teamet på Google-profilen.\n2. Publiser 1–2 nye bilder hver måned for å signalisere en aktiv profil til Google Maps.`,
    L063: `1. Krev eierskap til oppføringene på 1881.no, Gule Sider, Proff.no og Facebook.\n2. Oppdater telefonnummer, gatenavn og postnummer slik at det er 100 % identisk tegn-for-tegn med Google Bedriftsprofil og Enhetsregisteret.`,
    L107: `1. Ta kontakt med utgivere av eksisterende «Beste i ${city}»-guider og kåringer med dokumentasjon på deres kundetilfredshet.\n2. Publiser sammenlignende fagartikler og transparente prisoversikter som redaksjoner og AI-modeller siterer.`,
    L126: `1. Øk antall eksterne omtaler gjennom fagbidrag, lokale samarbeid, pressemeldinger og profilering i relevante bransjekanaler.`,
    G001: `1. Konverter hero-bilder og store grafiske elementer på forsiden til moderne bildeformater (WebP/AVIF) og prioriter innlasting av hovedbildet.\n2. Utsett innlasting (defer/lazy-load) av tunge tredjeparts-scripts som bestillingswidget og chat-bobler til etter første skjermvisning.`,
    G002: `1. Reduser mengden blokkerende JavaScript som kjører på hovedtråden ved mobilklikk.\n2. Fjern ubrukte sporingspiksler og tunge tredjeparts-plugins som forsinker meny- og skjemainteraksjon.`,
    G003: `1. Sett faste bredde- og høydeattributter (width/height eller aspect-ratio) på alle bilder, ikoner og innbyggede bestillingsmoduler slik at siden ikke hopper under innlasting.`,
    G004: `1. Gjennomfør en samlet teknisk hastighetsoptimalisering på mobil: komprimer bilder, aktiver hurtigbufring (caching) og minimer ubrukt CSS/JavaScript.`,
    G010: `1. Legg inn selv-refererende <link rel="canonical"> på samtlige indekserbare undersider slik at søkemotorene aldri er i tvil om hvilken URL som skal rangere.`,
    G011: `1. Opprett permanente 301-videresendinger (redirects) for de brutte URL-ene til relevante aktive tjenestesider.\n2. Oppdater alle interne lenker i menyer og brødtekst slik at ingen interne klikk treffer 404-sider.`,
    G013: `1. Implementer komplette strukturerte skjemadata (JSON-LD) på alle sider: virksomhetsskjema på forsiden, tjeneste- og prisskjema på hver tjenesteside, samt FAQ-skjema på spørsmål-og-svar-seksjoner.\n2. Valider implementeringen slik at søkemotorer og AI-modeller kan lese strukturen feilfritt.`,
    G016: `1. Aktiver CDN-hurtigbufring (Edge Caching) av HTML og statiske ressurser slik at serveren svarer på under 0,5 sekunder.`,
    G020: `1. Flate ut menystrukturen slik at alle viktige tjenestesider ligger maksimalt 1–2 klikk unna forsiden.`,
    G024: `1. Legg til direkte, synlige lenker til alle hovedtjenester både i toppmenyen og i en egen tjenesteseksjon på forsiden.`,
    G028: `1. Skriv unike sidetitler (<title>) for hver underside etter malen «[Tjeneste] i ${city} | ${businessName}».`,
    G029: `1. Legg inn unike metabeskrivelser (120–155 tegn) på alle tjenestesider med tydelig verdiforslag, lokasjon og oppfordring til kontakt eller bestilling.`,
    G030: `1. Sikre at hver side har nøyaktig én H1-hovedoverskrift som matcher sidens hovedsøkeord, og bruk H2/H3 for underoverskrifter.`,
    G031: `1. Opprett egne dedikerte, dyptgående landingssider (minst 600–900 ord) for hver manglende høy-margin tjeneste.\n2. Optimaliser hver side med unik sidetittel, H1, prisestimat, prosessbeskrivelse, FAQ og direkte kontakt- eller bestillingsknapp.`,
    G037: `1. Legg inn en synlig FAQ-seksjon (4–6 vanlige spørsmål om pris, varighet, gjennomføring og garanti) nederst på hver tjenesteside.\n2. Marker spørsmålene med strukturerte FAQ-data slik at både Google og AI-søkemotorer kan trekke ut svarene direkte.`,
    G041: `1. Plasser en fast, synlig handlingsknapp (CTA) og klikkbar telefonlenke (tel:) i mobilheaderen og nederst på samtlige tjenestesider.`,
    G044: `1. Etabler en fast strategi for innhenting av relevante innlenker fra bransjeportaler, leverandører og lokale aktører for å tette lenkegapet til topp 3.`,
    G045: `1. Bygg autoritet til rotdomenet og de viktigste tjenestesidene gjennom faglige siteringer og omtaler på autoritative norske nettsteder.`,
    G047: `1. Gjennomgå og avvis (disavow) eventuelle kunstige eller mistenkelige spam-lenker i Google Search Console.`,
    G048: `1. Sørg for at nye innlenker fra samarbeidspartnere og kataloger bruker en naturlig kombinasjon av firmanavnet (${businessName}) og relevante fagtermer.`,
    A001: `1. Bygg ut autoritative tjenestesider med tydelige fakta-avsnitt («${businessName} tilbyr ... i ${city}»).\n2. Sikre verifisert tilstedeværelse i Bing Places, Apple Maps, fagkataloger og uavhengige bransjekåringer som ChatGPT, Gemini, Claude og Perplexity henter kilder fra.`,
    A002: `1. Utvid tjenestesidene med konkrete pristabeller, steg-for-steg prosessbeskrivelser og faktabokser som AI-søkemotorer enkelt kan sitere som primærkilde.`,
    A010: `1. Øk virksomhetens omtalevolum på uavhengige sammenligningssider, bransjeportaler og redaksjonelle omtaler i ${city} slik at språkmodellene registrerer ${businessName} som en ledende aktør.`,
    A015: `1. Utvid virksomhetens skjemadata (JSON-LD) på forsiden med et "sameAs"-felt som peker til deres eksakte URL-er på Google Maps, Facebook, Instagram, Proff.no, 1881.no og Enhetsregisteret.`,
    A019: `1. Opprett en strukturert /llms.txt-fil på rotdomenet som oppsummerer virksomhetens navn, org.nr., adresse, åpningstider, alle hovedtjenester, priser og direkte lenker til hver tjenesteside.`,
    B001: `1. Reduser innlastingstiden (LCP) på mobil til under 2,5 sekunder og fjern blokkerende scripts på landingssidene som brukes i Google Ads.\n2. Høyere Quality Score (8–10/10) reduserer klikkprisen (CPC) direkte i annonseauksjonen.`,
    B002: `1. Bygg dedikerte landingssider for hver annonsegruppe i Google Ads i stedet for å sende betalt trafikk til forsiden.\n2. Match annonsetekstens hovedsøkeord eksakt i landingssidens sidetittel og H1.`,
    B005: `1. Vurder en rimelig beskyttelseskampanje på eget firmanavn i Google Ads dersom konkurrenter byr på navnet deres, og styrk samtidig organisk sitelinks-dominans.`,
    B007: `1. Øk antall verifiserte anmeldelser til over 100 med snitt over 4,5 stjerner for å aktivere automatiske stjerneutvidelser i Google Ads.`,
    B008: `1. Sikre at alle telefonnumre bruker klikkbar tel:-lenke og at online booking-knapper utløser konverteringsmåling i analyse- og annonseverktøy.`,
    B009: `1. Prioriter organisk SEO-oppbygging (innhold + relevante innlenker) på søkeordene der dere i dag ligger på plass #4–#10.\n2. Å løfte disse til Topp 3 frigjør titusenvis av kroner i månedlig annonseverdi.`,
  };

  const actionSteps =
    customStepByStep[item.factorCode] ||
    `1. Kontroller målt verdi opp mot bransjekravet: ${benchmarkRule}\n2. Korriger avviket slik at faktoren oppfyller anbefalt nivå (${thresholdOk || 'Beste praksis'}).\n3. Verifiser at endringen er indeksert og gir full uttelling ved neste måling.`;

  const utredningText = `${cleanSnippet}. Vår tekniske kontroll målte denne faktoren opp mot bransjekravet: «${benchmarkRule}» ${
    item.status === 'crit'
      ? 'Fordi status er kritisk (0 % uttelling), mister virksomheten direkte rangeringskraft i algoritmen på dette punktet.'
      : item.status === 'warn'
        ? 'Faktoren gir kun 50 % uttelling i dag og holder igjen totalscoren i denne kategorien.'
        : 'Faktoren er korrekt oppsatt og gir 100 % uttelling i vektingen.'
  }`;

  const konsekvensText = getVisibleProblemIndicator(item);
  const expectedImpact =
    item.status === 'crit'
      ? 'Høy effekt: Løfter kategoriscoren direkte fra 0 % til 100 % på denne faktoren.'
      : item.status === 'warn'
        ? 'Middels effekt: Dobler uttellingen på faktoren fra 50 % til 100 %.'
        : 'Opprettholder 100 % uttelling.';

  return {
    utredningText,
    konsekvensText,
    thresholdInfo,
    actionSteps,
    expectedImpact,
  };
}
