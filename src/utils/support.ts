import type { SupportPlatform } from '../types';

/**
 * Recurring-giving / membership platforms the rescue can plug in. These are
 * link-outs: the owner creates a page on the platform and pastes its URL under
 * Admin → Recurring. Nothing here needs an API key — memberships are handled on
 * the platform itself, which keeps donor payment data off this site.
 *
 * Selection is tuned for a small nonprofit: Patreon and Ko-fi for memberships,
 * Buy Me a Coffee for low-pressure one-offs, Open Collective and Liberapay for
 * transparency-first recurring support, PayPal for a plain recurring button.
 */

export interface SupportPlatformMeta {
  id: string;
  name: string;
  tagline: string;
  /** Brand-ish accent color (hex). */
  color: string;
  /** What to write in the URL field, shown as a placeholder in Admin. */
  urlPlaceholder: string;
  /** One-line note on fees / best use, shown in Admin. */
  note: string;
}

export const SUPPORT_PLATFORMS: SupportPlatformMeta[] = [
  {
    id: 'patreon',
    name: 'Patreon',
    tagline: 'Monthly membership tiers with perks',
    color: '#FF424D',
    urlPlaceholder: 'https://www.patreon.com/yourrescue',
    note: 'Best for tiered monthly members. Platform + processing fees ~8–12%.',
  },
  {
    id: 'kofi',
    name: 'Ko-fi',
    tagline: 'Memberships, tips & a shop — 0% on donations',
    color: '#13C3FF',
    urlPlaceholder: 'https://ko-fi.com/yourrescue',
    note: 'Free for donations; 5% on memberships/shop. Great all-rounder.',
  },
  {
    id: 'bmac',
    name: 'Buy Me a Coffee',
    tagline: 'Low-pressure one-off & monthly support',
    color: '#FFDD00',
    urlPlaceholder: 'https://buymeacoffee.com/yourrescue',
    note: 'Friendly "buy a coffee" framing lifts small-gift conversion. 5% fee.',
  },
  {
    id: 'opencollective',
    name: 'Open Collective',
    tagline: 'Recurring support with public, transparent books',
    color: '#1A936F',
    urlPlaceholder: 'https://opencollective.com/yourrescue',
    note: 'Every expense is public — matches your radical-transparency promise.',
  },
  {
    id: 'liberapay',
    name: 'Liberapay',
    tagline: 'Recurring donations, zero platform fee',
    color: '#F6C915',
    urlPlaceholder: 'https://liberapay.com/yourrescue',
    note: 'Open-source, non-profit. You pay only processor fees.',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    tagline: 'A simple recurring giving button',
    color: '#0070BA',
    urlPlaceholder: 'https://www.paypal.com/donate/?hosted_button_id=XXXX',
    note: 'Widely trusted; use a recurring "Donate" button link.',
  },
];

export const DEFAULT_SUPPORT_PLATFORMS: SupportPlatform[] = SUPPORT_PLATFORMS.map((m) => ({
  id: m.id,
  enabled: false,
  url: '',
  handle: '',
}));

export function platformMeta(id: string): SupportPlatformMeta | undefined {
  return SUPPORT_PLATFORMS.find((p) => p.id === id);
}
