import type { ShopProduct } from '../types';
import type { ShopConfig } from '../hooks/useSiteSettings';
import { cld } from './media';

/**
 * Printify integration for the merch Shop.
 *
 * Printify's REST API requires a secret Personal Access Token and does NOT send
 * CORS headers, so calling it directly from the browser both leaks the token and
 * gets blocked. The right shape for a static site is a tiny serverless proxy you
 * control (Netlify/Vercel function, Cloudflare Worker) that holds the token and
 * exposes a single read-only `/products` route. Configure its base URL under
 * Admin → Shop as `proxyUrl`; this module calls `${proxyUrl}/products`.
 *
 * Fallbacks, in order:
 *   1. proxyUrl set          → fetch live Printify products through your proxy
 *   2. manualProducts set    → owner-curated list entered in Admin (no API)
 *   3. neither               → built-in example products (flagged isMock)
 *
 * A raw apiToken field exists for local experimentation only; using it in a
 * shipped build is unsafe and will usually CORS-fail anyway.
 */

interface PrintifyImage {
  src: string;
  is_default?: boolean;
}
interface PrintifyVariant {
  price: number; // cents
  is_enabled?: boolean;
}
interface PrintifyProduct {
  id: string;
  title: string;
  description?: string;
  images?: PrintifyImage[];
  variants?: PrintifyVariant[];
  tags?: string[];
  external?: { handle?: string };
}

function stripHtml(html?: string): string | undefined {
  if (!html) return undefined;
  return html.replace(/<[^>]*>/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

function mapPrintify(p: PrintifyProduct, currency: string): ShopProduct {
  const enabled = (p.variants ?? []).filter((v) => v.is_enabled !== false);
  const cheapest = enabled.length
    ? Math.min(...enabled.map((v) => v.price))
    : p.variants?.[0]?.price ?? 0;
  const img = p.images?.find((i) => i.is_default)?.src || p.images?.[0]?.src || '';
  return {
    id: p.id,
    title: p.title,
    description: stripHtml(p.description),
    image: img,
    price: Math.round(cheapest) / 100,
    currency,
    tags: p.tags,
    buyUrl: p.external?.handle,
    isMock: false,
  };
}

export interface ShopFetchResult {
  products: ShopProduct[];
  source: 'proxy' | 'direct' | 'manual' | 'mock';
  error?: string;
}

export async function fetchShopProducts(shop: ShopConfig): Promise<ShopFetchResult> {
  const currency = shop.currency || 'USD';

  // 1. Proxy (recommended)
  if (shop.proxyUrl) {
    try {
      const res = await fetch(`${shop.proxyUrl.replace(/\/$/, '')}/products`);
      if (!res.ok) throw new Error(`Proxy returned ${res.status}`);
      const data = await res.json();
      const list: PrintifyProduct[] = Array.isArray(data) ? data : data.data ?? [];
      const products = list.map((p) => mapPrintify(p, currency));
      if (products.length) return { products, source: 'proxy' };
    } catch (err) {
      // fall through to next option, but remember why
      return {
        products: shop.manualProducts.length ? shop.manualProducts : mockProducts(),
        source: shop.manualProducts.length ? 'manual' : 'mock',
        error: err instanceof Error ? err.message : 'Proxy fetch failed',
      };
    }
  }

  // 2. Direct token (local dev only; usually CORS-blocked)
  if (!shop.proxyUrl && shop.apiToken && shop.shopId) {
    try {
      const res = await fetch(`https://api.printify.com/v1/shops/${shop.shopId}/products.json`, {
        headers: { Authorization: `Bearer ${shop.apiToken}` },
      });
      if (!res.ok) throw new Error(`Printify returned ${res.status}`);
      const data = await res.json();
      const list: PrintifyProduct[] = data.data ?? [];
      const products = list.map((p) => mapPrintify(p, currency));
      if (products.length) return { products, source: 'direct' };
    } catch (err) {
      return {
        products: shop.manualProducts.length ? shop.manualProducts : mockProducts(),
        source: shop.manualProducts.length ? 'manual' : 'mock',
        error: err instanceof Error ? err.message : 'Direct Printify fetch failed (CORS?)',
      };
    }
  }

  // 3. Manually-curated products
  if (shop.manualProducts.length) {
    return { products: shop.manualProducts, source: 'manual' };
  }

  // 4. Built-in examples
  return { products: mockProducts(), source: 'mock' };
}

/**
 * Example merch, reusing existing Cloudinary dog photos as stand-in artwork.
 * Replace by connecting Printify (proxy) or adding manual products in Admin.
 */
export function mockProducts(): ShopProduct[] {
  return [
    {
      id: 'mock-hoodie',
      title: 'Coconut Hound Hoodie',
      description: 'Heavyweight hoodie featuring AI-stylised street-dog art. Every sale funds ~2 shelters.',
      image: cld('dog-hero', 700, 700),
      price: 42,
      currency: 'USD',
      productType: 'Hoodie',
      tags: ['apparel', 'unisex'],
      isMock: true,
    },
    {
      id: 'mock-mug',
      title: 'Street Pack Enamel Mug',
      description: 'Camp-style enamel mug with a hand-drawn Caribbean pack illustration.',
      image: cld('pack', 700, 700),
      price: 18,
      currency: 'USD',
      productType: 'Mug',
      tags: ['drinkware'],
      isMock: true,
    },
    {
      id: 'mock-tee',
      title: '“Make Something Out of Little” Tee',
      description: 'Organic cotton tee with the rescue’s motto and bottle-shelter line art.',
      image: cld('dog2', 700, 700),
      price: 26,
      currency: 'USD',
      productType: 'T-Shirt',
      tags: ['apparel', 'unisex'],
      isMock: true,
    },
    {
      id: 'mock-tote',
      title: 'Rescued & Loved Tote',
      description: 'Sturdy canvas tote printed with a portrait of one of our rescues.',
      image: cld('puppy', 700, 700),
      price: 22,
      currency: 'USD',
      productType: 'Tote Bag',
      tags: ['accessories'],
      isMock: true,
    },
    {
      id: 'mock-poster',
      title: 'Coconut Cats Art Print',
      description: 'Museum-quality print of AI-assisted art made from real street-cat photos.',
      image: cld('dog3', 700, 700),
      price: 30,
      currency: 'USD',
      productType: 'Poster',
      tags: ['art', 'home'],
      isMock: true,
    },
    {
      id: 'mock-sticker',
      title: 'Paw Pack Sticker Set',
      description: 'Weatherproof vinyl stickers of the whole rescue crew. Small gift, real impact.',
      image: cld('dog4', 700, 700),
      price: 9,
      currency: 'USD',
      productType: 'Stickers',
      tags: ['accessories'],
      isMock: true,
    },
  ];
}
