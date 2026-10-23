import React from 'react';
import PageHeader, { type BreadcrumbItem } from '@/components/sections/PageHeader';
import AuditScannerClient from '@/components/synlighetsrapport/AuditScannerClient';

export interface AuditScannerHeroProps {
  breadcrumbs?: BreadcrumbItem[];
  label?: string;
  title?: React.ReactNode;
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4';
  titleSize?: 'h1' | 'h2' | 'h3';
  bg?: 'dark' | 'light' | 'sand';
  scannerVariant?: 'light' | 'sand' | 'dark';
  description?: React.ReactNode;
}

const DEFAULT_TITLE = (
  <>
    Hvor mange kunder taper bedriften din i{' '}
    <span className="text-brand-accent">Google og AI-søk</span> hver måned?
  </>
);

const DEFAULT_DESCRIPTION = (
  <>
    Skriv inn domenet til bedriften din. På under 45 sekunder
    kjører vi en teknisk dybdeanalyse av din bedrift mot{' '}
    <strong>245 vektede rangeringsfaktorer</strong> i
    Google Maps, søkemotorer og AI-assistenter (bla.a. ChatGPT, Gemini, Claude og Perplexity), koblet direkte mot din bransje i
    Brønnøysundregistrene.
  </>
);

export default function AuditScannerHero({
  breadcrumbs,
  label,
  title = DEFAULT_TITLE,
  titleAs = 'h1',
  titleSize,
  bg = 'dark',
  scannerVariant,
  description = DEFAULT_DESCRIPTION,
}: AuditScannerHeroProps) {
  const resolvedScannerVariant: 'light' | 'sand' | 'dark' =
    scannerVariant ?? (bg === 'light' ? 'sand' : 'light');

  return (
    <PageHeader
      breadcrumbs={breadcrumbs ?? []}
      label={label}
      title={title}
      titleAs={titleAs}
      titleSize={titleSize}
      bg={bg}
      description={description}
      className="pb-10 md:pb-12"
    >
      <AuditScannerClient variant={resolvedScannerVariant} />
    </PageHeader>
  );
}
