# John & Abigail Dog Rescue

Marketing + community site for a Dominican Republic dog-rescue that builds
insulated shelters from recycled bottles. A fully client-side **Vite + React +
Chakra UI** single-page app (no database), with an owner **Admin dashboard**, a
live **Events calendar** (Google Calendar), a **merch Shop** (Printify), and
**recurring-giving** links (Patreon, Ko-fi, …).

## Quick start

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check + production build to dist/
npm run preview    # preview the production build
npm run lint
```

## Deployment (Cloudflare Pages)

- **Build command:** `npm run build`
- **Output directory:** `dist`
- Cloudflare auto-detects the [`functions/`](functions) directory and deploys the
  Printify proxy alongside the site (same origin, no CORS).
- Set environment variables under **Pages → Settings → Environment variables**
  (see the table below).

### Environment variables

| Variable               | Where        | Required | Purpose |
|------------------------|--------------|----------|---------|
| `PRINTIFY_API_TOKEN`   | Cloudflare   | for Shop | Printify token used by the server-side proxy. Never exposed to the browser. |
| `PRINTIFY_USER_AGENT`  | Cloudflare   | no       | Sent to Printify (defaults to `JADR-Merch/1.0`). |

> There is **no `.env` file for the frontend.** Everything the *owner* configures
> (calendar IDs, shop/category settings, recurring-giving links, admin password)
> is entered in the Admin dashboard and stored in the browser's `localStorage`,
> not in env vars or the repo.

---

## Admin dashboard

Visit **`/admin`**. Default password **`dogrescue`** — change it under
**Settings** once signed in.

> ⚠️ This is a **client-side gate for convenience only**, not real
> authentication. It keeps casual visitors out of the config UI; it does not
> secure anything sensitive. The Printify token is the only real secret and it
> lives server-side (Cloudflare env var), never in the browser.

Owner settings are persisted in `localStorage`:
- `jadr_admin_pw` — the admin password
- `jadr_site_settings` — calendars, shop, categories, recurring-giving links

Because settings are per-browser, configure them in the browser/profile you'll
use to administer the live site.

---

## Feature configuration

### 1. Events calendar  (Admin → Calendars)

The calendar reads **public Google Calendars** — connect the owner's Google once
and every event they add in Gmail/Google Calendar shows up on `/events`.

**To make events subscribable + visible:**
1. In Google Calendar, open a calendar's **Settings → Access permissions** and
   tick **"Make available to public."**
2. Copy its **Calendar ID** (Settings → Integrate calendar) — or just copy any
   public share/embed/iCal link; the Admin field accepts either.
3. Paste it into a calendar row in **Admin → Calendars**. Add several rows for
   different event types (each has its own colour + public/enabled toggles).

Visitors can then **subscribe** on the Events page ("Add to Google" / iCal) using
their own Google login — **no API key needed** for subscribing (it only needs the
public calendar link).

**To show your real events inside the site's styled calendar grid**, also add a
**Google API key** (Calendar API enabled) in Admin → Calendars. Current behaviour:
- No calendar linked → the grid shows **labeled example events**.
- Calendar linked, **no API key** → subscribe buttons point at your real calendar,
  but the in-site grid still shows example events.
- Calendar linked **+ API key** → the grid shows your real Google events.

> A no-API-key Google **embed** helper (`embedUrl` in
> [`src/utils/calendar.ts`](src/utils/calendar.ts)) exists but is not yet wired
> into the page — enabling it would let the grid show real events without a key.

### 2. Merch Shop  (Admin → Shop)

Sells Printify print-on-demand products (mugs, shirts, shoes, …) with your art.
The browser never holds the Printify token — it calls a read-only proxy.

Short version:
1. Deploy to Cloudflare Pages and set `PRINTIFY_API_TOKEN` (above). The proxy at
   `/api/printify` then works with the **Proxy URL left blank** in Admin.
2. In **Admin → Shop**, click **Test connection**, pick your shop, and paste your
   **Pop-Up Store URL** (Printify hosts checkout; the API only lists products).
3. Manage **categories** (Mugs / T-Shirts / Shoes seeded) — products auto-group
   by keyword match on their Printify tags/type/title, so new products appear
   automatically.

**Full walkthrough, hosting alternatives, and security notes:
[`MERCH_SETUP.md`](MERCH_SETUP.md).** Until configured, the Shop shows labeled
example products.

### 3. Recurring giving  (Admin → Recurring)

Enable any of Patreon, Ko-fi, Buy Me a Coffee, Open Collective, Liberapay, or
PayPal and paste your page URL. Enabled platforms appear in a "Become a Monthly
Supporter" section on the Donate page. These are secure link-outs — donor payment
details stay on the platform, never on this site.

---

## Backend (Printify proxy)

| Path | What it is |
|------|-----------|
| [`functions/api/printify/[[route]].ts`](functions/api/printify) | Cloudflare Pages Function proxy — **recommended**, deploys with the site. |
| [`server/`](server) | Standalone Express version for hosting the proxy elsewhere. |
| [`scripts/deploy-backend.py`](scripts/deploy-backend.py) | Deploy the standalone server to Render's free tier. |

Both proxies are **read-only and GET-only**, restricted to an allowlist
(`shops`, `products`, `catalog`), so the full-access token can never be used
through them to place orders or mutate the account.

## Project layout

```text
src/
  pages/        Home, Donate, Shop, Events, Blog, Map, Admin, …
  components/   Layout, PageHero, EventCalendar, SupportPlatforms, …
  hooks/        useSiteSettings (owner config), useDonationStore
  utils/        calendar.ts, printify.ts, support.ts, media.ts, patterns.ts
  content/blog/ Markdown blog posts
functions/      Cloudflare Pages Functions (Printify proxy)
server/         Standalone proxy (optional)
scripts/        deploy-backend.py
MERCH_SETUP.md  Full merch/Printify guide
```
