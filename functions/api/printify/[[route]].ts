/**
 * Cloudflare Pages Function — read-only Printify proxy.
 *
 * Deploys automatically with the site (Cloudflare Pages detects the `functions/`
 * dir). It runs on the SAME origin as the frontend, so the browser calls
 * `/api/printify/...` with no CORS setup, and the secret Printify token never
 * reaches the client — it lives only in the Cloudflare env var below.
 *
 * Route: this catch-all handles `GET /api/printify/*` and forwards the tail to
 * `https://api.printify.com/v1/*` with the Bearer token + required User-Agent
 * (per https://developers.printify.com/). Only GET and an allowlist of
 * read-only paths are permitted, so the full-access token can never be used
 * through here to place orders or mutate the account.
 *
 * Configure in Cloudflare Pages → Settings → Environment variables (encrypted):
 *   PRINTIFY_API_TOKEN   (required)  your Printify Personal Access Token
 *   PRINTIFY_USER_AGENT  (optional)  defaults to "JADR-Merch/1.0"
 */

interface Env {
  PRINTIFY_API_TOKEN?: string;
  PRINTIFY_USER_AGENT?: string;
}

// Read-only endpoints the frontend is allowed to reach.
const ALLOWED: RegExp[] = [
  /^shops\.json$/,
  /^shops\/\d+\/products\.json$/,
  /^shops\/\d+\/products\/[\w-]+\.json$/,
  /^catalog\/blueprints\.json$/,
  /^catalog\/blueprints\/\d+\.json$/,
  /^catalog\/blueprints\/\d+\/print_providers\.json$/,
  /^catalog\/blueprints\/\d+\/print_providers\/\d+\/variants\.json$/,
];

const PRINTIFY_BASE = 'https://api.printify.com/v1';

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
    },
  });
}

export const onRequestGet = async (context: {
  request: Request;
  env: Env;
  params: { route?: string | string[] };
}): Promise<Response> => {
  const { request, env, params } = context;

  const token = env.PRINTIFY_API_TOKEN;
  if (!token) {
    return json({ error: 'Server not configured: set PRINTIFY_API_TOKEN in Cloudflare env vars.' }, 500);
  }

  const segments = Array.isArray(params.route) ? params.route : params.route ? [params.route] : [];
  const path = segments.join('/');

  if (!ALLOWED.some((re) => re.test(path))) {
    return json({ error: `Path not allowed: '${path}'. This proxy is read-only.` }, 403);
  }

  const search = new URL(request.url).search;
  const upstream = `${PRINTIFY_BASE}/${path}${search}`;

  let res: Response;
  try {
    res = await fetch(upstream, {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': env.PRINTIFY_USER_AGENT || 'JADR-Merch/1.0',
        Accept: 'application/json;charset=utf-8',
      },
    });
  } catch (err) {
    return json({ error: `Upstream request failed: ${(err as Error).message}` }, 502);
  }

  const bodyText = await res.text();
  return new Response(bodyText, {
    status: res.status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // Short edge cache to stay well under Printify's 600 req/min limit.
      'cache-control': res.ok ? 'public, max-age=120, s-maxage=120' : 'no-store',
      'access-control-allow-origin': '*',
    },
  });
};

// Preflight support in case the frontend is ever served from another origin.
export const onRequestOptions = async (): Promise<Response> =>
  new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, OPTIONS',
      'access-control-allow-headers': 'Content-Type',
      'access-control-max-age': '86400',
    },
  });
