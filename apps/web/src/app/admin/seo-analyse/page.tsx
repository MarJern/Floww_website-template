import type { Metadata } from 'next';
import { AdminCommandCenterClient } from '../../../components/synlighetsrapport/AdminCommandCenterClient';

export const metadata: Metadata = {
  title: 'Floww Command Center — Synlighetsrapporten CRM & Admin',
  description:
    'Intern administrasjon for Floww Media: Salgspipeline med 2-timers SLA, 1-klikks VIP-opplåsing av Synlighetsrapporter og bulk outreach-kampanjer.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminSynlighetsrapportPage() {
  return <AdminCommandCenterClient />;
}
