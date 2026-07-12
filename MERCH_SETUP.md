# Merch store setup (Printify)

This is the end-to-end guide to selling AI-art merch (mugs, t-shirts, tennis
shoes, and anything you add later) on the site, powered by the Printify API.

## How the pieces fit together

```
Printify (design + checkout)          Your site (Cloudflare Pages)
┌───────────────────────────┐         ┌──────────────────────────────────────┐
│ 1. Upload art, build       │         │  Frontend (React)                     │
│    products (mug/shirt/…)  │         │    Shop page → GET /api/printify/...   │
│ 2. Publish to a            │  API    │        │                               │
│    Pop-Up Store  ──────────┼────────▶│  Pages Function (proxy, holds token)  │
│ 3. Pop-Up Store hosts      │         │        │  → api.printify.com/v1/...     │
│    the actual checkout      │◀───Buy──┼── "Buy" button links to Pop-Up Store  │
└───────────────────────────┘         └──────────────────────────────────────┘
```

Two things worth being clear about up front:

1. **The Printify API lists your products; it does not process payments.** To
   actually take money you enable a **Printify Pop-Up Store** (free, Printify-
   hosted checkout). The site shows your catalogue and the "Buy" button hands
   off to the Pop-Up Store product page. (Alternatively you can connect Etsy/
   Shopify as the sales channel — same idea, different checkout host.)
2. **You do not need a separate backend host or a deploy script** if you're on
   Cloudflare Pages. The proxy in [`functions/`](functions) deploys *with* the
   site. The standalone [`server/`](server) + [`scripts/deploy-backend.py`](scripts/deploy-backend.py)
   exist only if you deliberately want the backend somewhere else.

## The workflow you'll actually use day-to-day

1. In Printify, design a product with your AI art + photos, set your retail
   price, and **publish** it to your Pop-Up Store.
2. That's it. The site fetches it through the proxy and it shows up on the Shop
   page under the matching category. No redeploy needed — it's a live API read.

---

## One-time setup

### A. Printify side

1. Create products in Printify and apply your art. Start with a **mug**, a
   **t-shirt**, and **tennis shoes** (all-over-print footwear).
2. Add a sales channel: **Pop-Up Store** (Printify → Stores → Add → Pop-Up).
   Publish your products to it. Each published product gets a public URL — the
   API returns it as `external.handle`, which the site uses for "Buy".
3. Create an API token: **Printify → Account → Connections → API / Personal
   Access Tokens** → generate a token with catalog/shops/products **read**
   scope. Copy it.

### B. Backend — recommended: Cloudflare Pages Function (no separate host)

The proxy already exists at
[`functions/api/printify/[[route]].ts`](functions/api/printify/%5B%5Broute%5D%5D.ts).
Cloudflare Pages auto-detects the `functions/` directory on deploy.

1. Deploy the site to Cloudflare Pages as usual (connect the repo, or
   `npx wrangler pages deploy dist`).
2. In **Cloudflare Pages → your project → Settings → Environment variables**,
   add an **encrypted** variable:
   - `PRINTIFY_API_TOKEN` = your token
   - (optional) `PRINTIFY_USER_AGENT` = e.g. `JADR-Merch/1.0`
3. Redeploy. Your proxy is now live at `https://<your-site>/api/printify/...`
   and the browser calls it same-origin (no CORS, token never exposed).

That's the whole backend. Because it ships with the frontend, **there is no
separate deploy step** — every `git push` / Pages build updates both.

### C. Backend — alternative: standalone host (Render free tier)

Only if you want the backend off Cloudflare. See [`server/README.md`](server/README.md).
In short:

1. Create a Render **Web Service** from this repo, root dir `server`, build
   `npm install`, start `npm start`.
2. Set env var `PRINTIFY_API_TOKEN` (and `ALLOWED_ORIGIN` = your site origin).
3. To redeploy after changes, either push to the connected repo (Render
   auto-builds) or run the helper:
   ```bash
   export RENDER_API_KEY=rnd_xxx RENDER_SERVICE_ID=srv_xxx
   python3 scripts/deploy-backend.py
   ```
4. In the site Admin → Shop, set **Proxy URL** to
   `https://<your-service>.onrender.com/api/printify`.

> Note: Cloudflare Pages builds the frontend; it isn't a place to *host* a
> separate Node server. That's why the "run a script on Cloudflare deploy to
> push the backend elsewhere" idea doesn't quite apply — with Pages Functions
> the backend is already part of the Cloudflare deploy, and with Render the
> deploy is triggered against Render, not Cloudflare. The script above targets
> Render for exactly that case.

### D. Connect it in the site Admin

1. Go to `/admin` → **Shop** tab.
2. Leave **Proxy URL** blank to use the same-origin `/api/printify` (or paste a
   standalone proxy URL).
3. Click **Test connection** — it lists your Printify shops; pick one (or leave
   blank to auto-use the first).
4. Paste your **Pop-Up Store URL** into *Public store URL*.
5. Set the **categories** (Mugs / T-Shirts / Shoes are seeded). Each category
   matches products by keyword against their Printify tags/type/title, so newly
   published products slot in automatically.

## Categories & adding new product types later

Categories are just keyword filters, configured in Admin → Shop → *Product
Categories*:

| Category  | Example keywords                    |
|-----------|-------------------------------------|
| Mugs      | `mug`, `ceramic`                    |
| T-Shirts  | `shirt`, `tee`, `t-shirt`           |
| Shoes     | `shoe`, `sneaker`, `tennis`         |

To sell a new type (hoodies, tote bags, art prints…), just:
1. Publish those products on Printify, then
2. Add a category in Admin with matching keywords.

No code changes required.

## Security notes

- The proxy is **read-only** and **GET-only**, restricted to an allowlist
  (`shops`, `products`, `catalog`). Even though the token has full account
  access, it can't be used through the proxy to place orders or change your
  account.
- Never put the raw token in the frontend/Admin *API token* field for a live
  site — that ships it to browsers. It exists only for local experimentation.
- Restrict the token's scopes in Printify to read where possible.

## Reference

- Printify API: <https://developers.printify.com/> — base `https://api.printify.com/v1/`,
  `Authorization: Bearer <token>`, required `User-Agent` header, 600 req/min
  (catalog 100/min), products paginated at max 50/page.
