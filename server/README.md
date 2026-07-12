# Printify proxy (standalone)

A tiny read-only proxy that injects your Printify token server-side so the
browser never sees it. **You only need this if you are NOT using the Cloudflare
Pages Function** in [`../functions`](../functions). If your site is on Cloudflare
Pages, use that instead — it deploys with the site, runs same-origin, and needs
no host and no deploy script.

## What it exposes

`GET /api/printify/<path>` → forwards to `https://api.printify.com/v1/<path>`
for an allowlist of **read-only** endpoints only:

- `shops.json`
- `shops/{id}/products.json`
- `shops/{id}/products/{productId}.json`
- `catalog/blueprints.json` (and blueprint detail / print providers / variants)

Anything else, and any non-GET method, is rejected — so the full-access token
can never be used through this proxy to place orders or change your account.

## Run locally

```bash
cd server
npm install
PRINTIFY_API_TOKEN=your_token npm start
# → http://localhost:8787/api/printify/shops.json
```

Then in the site Admin → Shop, set **Proxy URL** to `http://localhost:8787/api/printify`.

## Environment variables

| Var                   | Required | Default          | Notes |
|-----------------------|----------|------------------|-------|
| `PRINTIFY_API_TOKEN`  | yes      | —                | Printify Personal Access Token |
| `PRINTIFY_USER_AGENT` | no       | `JADR-Merch/1.0` | Printify requires a User-Agent |
| `ALLOWED_ORIGIN`      | no       | `*`              | Lock to your site origin, e.g. `https://jadr.pages.dev` |
| `PORT`                | no       | `8787`           | |

## Deploy to a free host (Render)

Render's free web-service tier works well. See
[`../scripts/deploy-backend.py`](../scripts/deploy-backend.py) and
[`../MERCH_SETUP.md`](../MERCH_SETUP.md) for the full walkthrough.
