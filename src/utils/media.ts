/**
 * Central place for imagery + contact helpers.
 *
 * Images are served from our own Cloudinary account (f_auto/q_auto for
 * automatic format + compression). Components degrade gracefully to a
 * gradient if an image ever fails to load.
 */

export const CLOUDINARY_CLOUD = 'dkxlhxpe4';

/** Build an optimized Cloudinary delivery URL for a public id under jadr/. */
export function cld(id: string, w = 1200, h?: number): string {
  const t = ['f_auto', 'q_auto', 'c_fill', 'g_auto', `w_${w}`, ...(h ? [`h_${h}`] : [])].join(',');
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/${t}/jadr/${id}`;
}

export const IMAGES = {
  // Hero / banner backgrounds (wide, work under a dark gradient overlay)
  heroDog: cld('dog-hero', 1600, 900),
  heroBeach: cld('beach', 1600, 900),
  heroPuppy: cld('puppy', 1600, 900),
  heroPack: cld('pack', 1600, 900),
  heroWorkshop: cld('workshop', 1600, 900),

  // Story / gallery imagery
  gallery: [
    cld('dog-hero', 800),
    cld('dog2', 800),
    cld('pack', 800),
    cld('dog3', 800),
    cld('dog4', 800),
    cld('puppy', 800),
  ],

  // Video poster
  videoPoster: cld('dog4', 1400, 800),

  // Shelter card fallbacks
  shelter: [
    cld('dog2', 800, 600),
    cld('dog-hero', 800, 600),
    cld('dog3', 800, 600),
    cld('pack', 800, 600),
    cld('puppy', 800, 600),
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
