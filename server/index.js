/**
 * Standalone Printify proxy (portable alternative to the Cloudflare Pages
 * Function in ../functions). Use this only if you want to host the backend
 * somewhere other than Cloudflare Pages (e.g. Render's free tier). If your
 * frontend is on Cloudflare Pages, prefer the Pages Function — it needs no
 * separate host, no CORS, and no deploy script.
 *
 * Exposes the same read-only, GET-only allowlist of Printify endpoints and
 * injects the Bearer token + User-Agent required by the official API
 * (https://developers.printify.com/). Node 18+ (global fetch) required.
 *
 * Env:
 *   PRINTIFY_API_TOKEN   (required)  Printify Personal Access Token
 *   PRINTIFY_USER_AGENT  (optional)  defaults to "JADR-Merch/1.0"
 *   ALLOWED_ORIGIN       (optional)  CORS origin, e.g. https://jadr.pages.dev ("*" default)
 *   PORT                 (optional)  defaults to 8787
 */
const express = require('express');
const cors = require('cors');

const PRINTIFY_BASE = 'https://api.printify.com/v1';
const TOKEN = process.env.PRINTIFY_API_TOKEN;
const USER_AGENT = process.env.PRINTIFY_USER_AGENT || 'JADR-Merch/1.0';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';
const PORT = process.env.PORT || 8787;

const ALLOWED = [
  /^shops\.json$/,
  /^shops\/\d+\/products\.json$/,
  /^shops\/\d+\/products\/[\w-]+\.json$/,
  /^catalog\/blueprints\.json$/,
  /^catalog\/blueprints\/\d+\.json$/,
  /^catalog\/blueprints\/\d+\/print_providers\.json$/,
  /^catalog\/blueprints\/\d+\/print_providers\/\d+\/variants\.json$/,
];

const app = express();
app.use(cors({ origin: ALLOWED_ORIGIN }));

app.get('/health', (_req, res) => res.json({ ok: true, hasToken: Boolean(TOKEN) }));

// Everything under /api/printify/* is forwarded (read-only) to the Printify API.
app.get(/^\/api\/printify\/(.+)$/, async (req, res) => {
  if (!TOKEN) return res.status(500).json({ error: 'PRINTIFY_API_TOKEN not set on the server.' });

  const path = req.params[0];
  if (!ALLOWED.some((re) => re.test(path))) {
    return res.status(403).json({ error: `Path not allowed: '${path}'. This proxy is read-only.` });
  }

  const qs = req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '';
  try {
    const upstream = await fetch(`${PRINTIFY_BASE}/${path}${qs}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'User-Agent': USER_AGENT,
        Accept: 'application/json;charset=utf-8',
      },
    });
    const body = await upstream.text();
    res.status(upstream.status);
    res.set('content-type', 'application/json; charset=utf-8');
    if (upstream.ok) res.set('cache-control', 'public, max-age=120');
    res.send(body);
  } catch (err) {
    res.status(502).json({ error: `Upstream request failed: ${err.message}` });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Printify proxy listening on :${PORT} (token ${TOKEN ? 'set' : 'MISSING'})`);
});
