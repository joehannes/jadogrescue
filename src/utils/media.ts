/**
 * Central place for imagery + contact helpers.
 *
 * Images are hotlinked from Unsplash (free to use). Swap any of these for
 * your own photography — the components degrade gracefully to a gradient
 * if an image ever fails to load.
 */

const u = (id: string, w = 1200, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w}${h ? `&h=${h}` : ''}`;

export const IMAGES = {
  // Hero / banner backgrounds (wide, work under a dark gradient overlay)
  heroDog: u('1583337130417-3346a1be7dee', 1600),
  heroBeach: u('1507525428034-b723cf961d3e', 1600),
  heroPuppy: u('1450778869180-41d0601e046e', 1600),
  heroPack: u('1548199973-03cce0bbc87b', 1600),
  heroWorkshop: u('1441986300917-64674bd600d8', 1600),

  // Story / gallery imagery
  gallery: [
    u('1583337130417-3346a1be7dee', 800),
    u('1518717758536-85ae29035b6d', 800),
    u('1548199973-03cce0bbc87b', 800),
    u('1534361960057-19889db9621e', 800),
    u('1477884213360-7e9d7dcc1e48', 800),
    u('1450778869180-41d0601e046e', 800),
  ],

  // Video poster
  videoPoster: u('1477884213360-7e9d7dcc1e48', 1400),

  // Shelter card fallbacks by city (keyed loosely)
  shelter: [
    u('1518717758536-85ae29035b6d', 800),
    u('1583337130417-3346a1be7dee', 800),
    u('1534361960057-19889db9621e', 800),
    u('1548199973-03cce0bbc87b', 800),
    u('1450778869180-41d0601e046e', 800),
  ],
};

/**
 * Placeholder video. Replace with your own rescue footage (an .mp4 URL) or
 * switch the VideoShowcase to a YouTube embed. This CC0 clip just proves the
 * player works.
 */
export const DEMO_VIDEO =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

/** Primary contact number (single source of truth). */
export const PHONE_DISPLAY = '+1 (809) 555-0123';

/** Build a wa.me link from any phone string (strips non-digits). */
export function waLink(phone: string, text?: string): string {
  const digits = phone.replace(/\D/g, '');
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export const WHATSAPP_URL = waLink(PHONE_DISPLAY, "Hi! I'd like to help John & Abigail Dog Rescue.");
