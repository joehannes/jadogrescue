import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CalendarSource, ShopProduct, SupportPlatform } from '../types';
import { DEFAULT_SUPPORT_PLATFORMS } from '../utils/support';

/**
 * Owner-configurable site settings for the Events calendar, the merch Shop and
 * recurring-support platforms. Persisted to localStorage so the values the
 * owner enters under Admin survive reloads.
 *
 * Everything here is client-side. Sensitive values (a Printify API token in
 * particular) should NOT be shipped in the browser for a real launch — the Shop
 * config therefore prefers a `proxyUrl` (a serverless function you control that
 * holds the token) over pasting the token directly. See utils/printify.ts.
 */

export interface ShopConfig {
  /** Base URL of a serverless proxy that talks to Printify with your secret token. */
  proxyUrl: string;
  /** Printify Personal Access Token. Client-side only for local previews — do not ship. */
  apiToken: string;
  /** Printify shop id (numeric). */
  shopId: string;
  /** Public storefront URL (e.g. a Printify Pop-Up store) used for the "Visit store" button. */
  storeUrl: string;
  /** Manually-curated products, as an alternative to any API. */
  manualProducts: ShopProduct[];
  currency: string;
}

interface SiteSettingsState {
  // --- Google Calendar / Events ---
  googleApiKey: string;
  calendars: CalendarSource[];
  setGoogleApiKey: (key: string) => void;
  addCalendar: (cal: CalendarSource) => void;
  updateCalendar: (id: string, patch: Partial<CalendarSource>) => void;
  removeCalendar: (id: string) => void;

  // --- Shop / Printify ---
  shop: ShopConfig;
  setShop: (patch: Partial<ShopConfig>) => void;
  addManualProduct: (p: ShopProduct) => void;
  removeManualProduct: (id: string) => void;

  // --- Recurring support ---
  support: SupportPlatform[];
  setSupport: (id: string, patch: Partial<SupportPlatform>) => void;
}

/**
 * One example public calendar is seeded with an EMPTY calendarId. While it is
 * empty the Events page falls back to built-in example events; the owner just
 * pastes their public Google calendar id here to go live.
 */
const DEFAULT_CALENDARS: CalendarSource[] = [
  { id: 'public', name: 'Public Events', calendarId: '', color: '#FF6B35', isPublic: true, enabled: true },
  { id: 'volunteer', name: 'Volunteer & Build Days', calendarId: '', color: '#1A936F', isPublic: false, enabled: true },
];

const DEFAULT_SHOP: ShopConfig = {
  proxyUrl: '',
  apiToken: '',
  shopId: '',
  storeUrl: '',
  manualProducts: [],
  currency: 'USD',
};

export const useSiteSettings = create<SiteSettingsState>()(
  persist(
    (set) => ({
      googleApiKey: '',
      calendars: DEFAULT_CALENDARS,
      setGoogleApiKey: (key) => set({ googleApiKey: key.trim() }),
      addCalendar: (cal) => set((s) => ({ calendars: [...s.calendars, cal] })),
      updateCalendar: (id, patch) =>
        set((s) => ({ calendars: s.calendars.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
      removeCalendar: (id) => set((s) => ({ calendars: s.calendars.filter((c) => c.id !== id) })),

      shop: DEFAULT_SHOP,
      setShop: (patch) => set((s) => ({ shop: { ...s.shop, ...patch } })),
      addManualProduct: (p) =>
        set((s) => ({ shop: { ...s.shop, manualProducts: [p, ...s.shop.manualProducts] } })),
      removeManualProduct: (id) =>
        set((s) => ({
          shop: { ...s.shop, manualProducts: s.shop.manualProducts.filter((p) => p.id !== id) },
        })),

      support: DEFAULT_SUPPORT_PLATFORMS,
      setSupport: (id, patch) =>
        set((s) => ({ support: s.support.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
    }),
    {
      name: 'jadr_site_settings',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // Merge persisted values over defaults so newly-added platforms/fields appear.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<SiteSettingsState>;
        const supportById = new Map((p.support ?? []).map((s) => [s.id, s]));
        return {
          ...current,
          ...p,
          shop: { ...current.shop, ...(p.shop ?? {}) },
          support: current.support.map((def) => ({ ...def, ...(supportById.get(def.id) ?? {}) })),
        };
      },
    }
  )
);
