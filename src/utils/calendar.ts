import type { CalendarSource, CalendarEvent } from '../types';

/**
 * Google Calendar integration — read-only, from the browser, no backend.
 *
 * How the owner "connects Google": in Google Calendar they make a calendar
 * public (Settings → Access permissions → "Make available to public"), copy its
 * Calendar ID (Settings → Integrate calendar), and paste that plus a Google API
 * key (with the Calendar API enabled) under Admin → Calendars. Anything the
 * owner then adds to that Gmail calendar shows up here automatically — that IS
 * the sync. Several calendars can be added (e.g. a public one and an internal
 * build-days one), each with its own colour, mirroring Google's multi-calendar
 * model.
 *
 * A public calendar + API key is genuinely readable client-side (Google serves
 * CORS for it). Private, per-account OAuth sync would need Google Identity
 * Services and a token exchange — out of scope for a static site, and public
 * calendars cover the "official/public calendar visitors can subscribe to" ask.
 */

interface GCalTime {
  date?: string; // all-day (YYYY-MM-DD)
  dateTime?: string; // timed (RFC3339)
}

interface GCalEvent {
  id: string;
  summary?: string;
  description?: string;
  location?: string;
  htmlLink?: string;
  start?: GCalTime;
  end?: GCalTime;
  status?: string;
}

/**
 * Normalise whatever the owner pasted into a bare Calendar ID.
 *
 * Owners naturally copy a *link* rather than the bare ID, so accept any of:
 *   - a plain Calendar ID:            abc123@group.calendar.google.com
 *   - an embed link:                  ...calendar/embed?src=abc123%40group...
 *   - a public/"add" link:            ...calendar/u/0?cid=<base64>
 *   - an iCal feed URL:               ...calendar/ical/abc123%40.../public/basic.ics
 * ...and return the underlying ID used by subscribe/embed/API calls.
 */
export function extractCalendarId(input: string): string {
  const raw = (input || '').trim();
  if (!raw) return '';
  // No URL punctuation → already an ID (IDs contain @ / # / . but never / ? &).
  if (!/[/?&]/.test(raw) && !/^https?:/i.test(raw)) return raw;
  const src = raw.match(/[?&]src=([^&]+)/);
  if (src) return decodeURIComponent(src[1]);
  const ical = raw.match(/\/ical\/([^/]+)\//);
  if (ical) return decodeURIComponent(ical[1]);
  const cid = raw.match(/[?&]cid=([^&]+)/);
  if (cid) {
    const val = decodeURIComponent(cid[1]);
    try {
      const decoded = atob(val.replace(/-/g, '+').replace(/_/g, '/'));
      if (decoded.includes('@') || decoded.includes('calendar.google.com')) return decoded;
    } catch {
      /* not base64 — fall through */
    }
    return val;
  }
  return raw;
}

/** "Add to Google Calendar" — opens Google's subscribe flow for a public calendar. */
export function subscribeGoogleUrl(calendarId: string): string {
  return `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(extractCalendarId(calendarId))}`;
}

/** iCal/webcal feed for Apple Calendar, Outlook, etc. (public calendars only). */
export function subscribeIcalUrl(calendarId: string): string {
  return `webcal://calendar.google.com/calendar/ical/${encodeURIComponent(extractCalendarId(calendarId))}/public/basic.ics`;
}

/** The browser's IANA timezone (e.g. "America/Santo_Domingo"), for embed accuracy. */
export function browserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Santo_Domingo';
  } catch {
    return 'America/Santo_Domingo';
  }
}

/**
 * Google-hosted embed iframe URL. Shows the real events for one or more PUBLIC
 * calendars with NO API key — the owner just needs the calendar public and its
 * ID/link. Multiple calendars are layered via repeated `src=` params.
 */
export function embedUrl(
  sources: Array<{ calendarId: string; color?: string }>,
  opts: { timeZone?: string; mode?: 'MONTH' | 'AGENDA' | 'WEEK' } = {}
): string {
  const tz = opts.timeZone || browserTimeZone();
  const params = new URLSearchParams();
  params.set('ctz', tz);
  params.set('mode', opts.mode || 'MONTH');
  params.set('showTitle', '0');
  params.set('showPrint', '0');
  params.set('showTabs', '1');
  params.set('showCalendars', '0');
  params.set('wkst', '1');
  // URLSearchParams can't repeat a key, so append src/color pairs by hand.
  const extra = sources
    .map((s) => extractCalendarId(s.calendarId))
    .filter(Boolean)
    .map((id, i) => {
      const color = sources[i].color ? `&color=${encodeURIComponent(sources[i].color as string)}` : '';
      return `&src=${encodeURIComponent(id)}${color}`;
    })
    .join('');
  return `https://calendar.google.com/calendar/embed?${params.toString()}${extra}`;
}

/** Fetch events for one public calendar via the Google Calendar API + an API key. */
export async function fetchGoogleEvents(
  source: CalendarSource,
  apiKey: string,
  timeMin: Date,
  timeMax: Date
): Promise<CalendarEvent[]> {
  const calendarId = extractCalendarId(source.calendarId);
  if (!calendarId || !apiKey) return [];
  const params = new URLSearchParams({
    key: apiKey,
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '250',
  });
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
    calendarId
  )}/events?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      detail = body?.error?.message ? `: ${body.error.message}` : '';
    } catch {
      /* ignore */
    }
    throw new Error(`Google Calendar request failed (${res.status})${detail}`);
  }
  const data = (await res.json()) as { items?: GCalEvent[] };
  return (data.items ?? [])
    .filter((e) => e.status !== 'cancelled' && (e.start?.dateTime || e.start?.date))
    .map((e) => {
      const allDay = Boolean(e.start?.date && !e.start?.dateTime);
      return {
        id: `${source.id}:${e.id}`,
        title: e.summary || '(no title)',
        description: e.description,
        location: e.location,
        start: (e.start?.dateTime || e.start?.date) as string,
        end: e.end?.dateTime || e.end?.date,
        allDay,
        url: e.htmlLink,
        sourceId: source.id,
        color: source.color,
        isMock: false,
      } as CalendarEvent;
    });
}

/**
 * Built-in example events, dated relative to *now* so the calendar always looks
 * alive in a demo. Every one is flagged isMock so the UI can label them clearly.
 * Spread across the current month and pinned to the two default sources.
 */
export function mockEvents(reference = new Date()): CalendarEvent[] {
  const y = reference.getFullYear();
  const m = reference.getMonth();
  // Build a date in the current month at a given day + hour.
  const at = (day: number, hour = 9, minutes = 0) =>
    new Date(y, m, day, hour, minutes).toISOString();
  const plusHours = (iso: string, h: number) =>
    new Date(new Date(iso).getTime() + h * 3600_000).toISOString();

  const defs: Array<Omit<CalendarEvent, 'id' | 'isMock'> & { day: number }> = [
    {
      day: 6,
      title: '🔨 Shelter Build Day — Bávaro',
      description:
        'Community build session: assemble insulated bottle shelters for the local pack. Tools, water and lunch provided. No experience needed!',
      location: 'Bávaro Beach access road, Punta Cana',
      start: at(6, 8),
      end: plusHours(at(6, 8), 4),
      allDay: false,
      color: '#1A936F',
      sourceId: 'volunteer',
    },
    {
      day: 9,
      title: '🩺 Free Spay/Neuter Clinic',
      description:
        'Mobile vet clinic offering free sterilisations and flea/tick treatment for street and community animals. First come, first served.',
      location: 'Comedor La Esperanza, Santo Domingo',
      start: at(9, 9),
      end: plusHours(at(9, 9), 6),
      allDay: false,
      color: '#FF6B35',
      sourceId: 'public',
    },
    {
      day: 13,
      title: '🐾 Adoption & Meet-the-Pack Day',
      description:
        'Come meet our rescued Coconut Hounds looking for homes. Adoption counsellors on site to talk through the process and travel rules.',
      location: 'Plaza Central, Punta Cana',
      start: at(13, 10),
      end: plusHours(at(13, 10), 5),
      allDay: false,
      color: '#FF6B35',
      sourceId: 'public',
    },
    {
      day: 17,
      title: '🌊 Beach Clean-up + Bottle Collection',
      description:
        'Collect plastic bottles for our shelters while cleaning up the coastline. Gloves and bags provided. Great for families and tourists.',
      location: 'Playa El Cortecito',
      start: at(17, 7, 30),
      end: plusHours(at(17, 7, 30), 3),
      allDay: false,
      color: '#1A936F',
      sourceId: 'volunteer',
    },
    {
      day: 20,
      title: '🎉 Sunset Fundraiser Gala',
      description:
        'An evening of food, music and stories from the field to fund next quarter’s shelters. Tickets support 50+ builds.',
      location: 'Hotel Riu Bávaro (garden terrace)',
      start: at(20, 18),
      end: plusHours(at(20, 18), 4),
      allDay: false,
      color: '#FF6B35',
      sourceId: 'public',
    },
    {
      day: 24,
      title: '📸 Volunteer Orientation & Photo Walk',
      description:
        'New-volunteer welcome session followed by a photo walk to document shelters for sponsors. Bring a phone or camera.',
      location: 'Rescue HQ, Bávaro',
      start: at(24, 16),
      end: plusHours(at(24, 16), 2),
      allDay: false,
      color: '#1A936F',
      sourceId: 'volunteer',
    },
    {
      day: 28,
      title: '🚚 Supply Drive — Wish List Drop-off',
      description:
        'Drop off donated materials: wood offcuts, screws, tarps, rope, and flea/tick meds. See the wish list for what we need most.',
      location: 'Rescue HQ, Bávaro',
      start: at(28, 0),
      allDay: true,
      color: '#FF6B35',
      sourceId: 'public',
    },
  ];

  return defs.map((d) => ({
    id: `mock:${d.sourceId}:${d.day}`,
    title: d.title,
    description: d.description,
    location: d.location,
    start: d.start,
    end: d.end,
    allDay: d.allDay,
    color: d.color,
    sourceId: d.sourceId,
    isMock: true,
  }));
}
