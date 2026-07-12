import type { ShopProduct, ShopCategory } from '../types';
import type { ShopConfig } from '../hooks/useSiteSettings';
import { cld } from './media';

/**
 * Printify integration for the merch Shop.
 *
 * The browser NEVER holds the Printify token. It calls a read-only proxy that
 * injects the token server-side. By default that proxy is the same-origin
 * Cloudflare Pages Function at `/api/printify` (see /functions); you can point
 * `proxyUrl` at a standalone host instead. Endpoints & pagination follow the
 * official API (https://developers.printify.com/): base `/v1`, list shops at
 * `shops.json`, products at `shops/{id}/products.json` (max 50 per page).
 *
 * Fallback order:
 *   1. proxy            → live Printify products (recommended)
 *   2. direct apiToken  → local dev only; usually CORS-blocked by Printify
 *   3. manualProducts   → owner-curated list from Admin (no API)
 *   4. built-in mocks   → labeled examples so the page is never empty
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
  visible?: boolean;
  external?: { handle?: string };
}
interface PrintifyPage {
  data?: PrintifyProduct[];
  current_page?: number;
  last_page?: number;
  next_page_url?: string | null;
}
export interface PrintifyShop {
  id: number;
  title: string;
  sales_channel?: string;
}

/** Resolve the proxy base URL (default: same-origin Pages Function). */
export function proxyBase(shop: ShopConfig): string {
  return (shop.proxyUrl.trim() || '/api/printify').replace(/\/$/, '');
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

/** List the Printify shops on the account (used by Admin to pick a shop). */
export async function fetchShops(shop: ShopConfig): Promise<PrintifyShop[]> {
  const res = await fetch(`${proxyBase(shop)}/shops.json`);
  if (!res.ok) throw new Error(`Could not list shops (${res.status})`);
  const data = await res.json();
  return Array.isArray(data) ? data : data.data ?? [];
}

async function fetchAllProxyProducts(base: string, shopId: string, currency: string): Promise<ShopProduct[]> {
  const out: ShopProduct[] = [];
  let page = 1;
  // Cap pages so a huge catalogue can't hammer the API; 10 * 50 = 500 products.
  for (; page <= 10; page++) {
    const res = await fetch(`${base}/shops/${shopId}/products.json?limit=50&page=${page}`);
    if (!res.ok) throw new Error(`Products request failed (${res.status})`);
    const body: PrintifyPage = await res.json();
    const list = body.data ?? [];
    out.push(...list.filter((p) => p.visible !== false).map((p) => mapPrintify(p, currency)));
    const last = body.last_page ?? page;
    if (!body.next_page_url || page >= last || list.length === 0) break;
  }
  return out;
}

export interface ShopFetchResult {
  products: ShopProduct[];
  source: 'proxy' | 'direct' | 'manual' | 'mock';
  shopId?: string;
  error?: string;
}

export async function fetchShopProducts(shop: ShopConfig): Promise<ShopFetchResult> {
  const currency = shop.currency || 'USD';
  const base = proxyBase(shop);

  // 1. Proxy (recommended). Auto-detect the shop id if the owner left it blank.
  try {
    let shopId = shop.shopId.trim();
    if (!shopId) {
      const shops = await fetchShops(shop);
      if (shops.length) shopId = String(shops[0].id);
    }
    if (shopId) {
      const products = await fetchAllProxyProducts(base, shopId, currency);
      if (products.length) return { products, source: 'proxy', shopId };
      // Reachable proxy but no products yet → still "live", just empty.
      return { products: [], source: 'proxy', shopId };
    }
  } catch (err) {
    // Proxy not deployed / unreachable → try remaining fallbacks below.
    if (shop.apiToken && shop.shopId) {
      /* fall through to direct */
    } else {
      return {
        products: shop.manualProducts.length ? shop.manualProducts : mockProducts(),
        source: shop.manualProducts.length ? 'manual' : 'mock',
        error: err instanceof Error ? err.message : 'Proxy unreachable',
      };
    }
  }

  // 2. Direct token (local dev only; usually CORS-blocked).
  if (shop.apiToken && shop.shopId) {
    try {
      const res = await fetch(`https://api.printify.com/v1/shops/${shop.shopId}/products.json?limit=50`, {
        headers: { Authorization: `Bearer ${shop.apiToken}` },
      });
      if (!res.ok) throw new Error(`Printify returned ${res.status}`);
      const body: PrintifyPage = await res.json();
      const products = (body.data ?? []).map((p) => mapPrintify(p, currency));
      if (products.length) return { products, source: 'direct', shopId: shop.shopId };
    } catch (err) {
      return {
        products: shop.manualProducts.length ? shop.manualProducts : mockProducts(),
        source: shop.manualProducts.length ? 'manual' : 'mock',
        error: err instanceof Error ? err.message : 'Direct Printify fetch failed (CORS?)',
      };
    }
  }

  // 3. Manually-curated products.
  if (shop.manualProducts.length) return { products: shop.manualProducts, source: 'manual' };

  // 4. Built-in examples.
  return { products: mockProducts(), source: 'mock' };
}

/** True if a product belongs to a category (keyword substring match on tags/type/title). */
export function productMatchesCategory(product: ShopProduct, category: ShopCategory): boolean {
  const haystack = [product.title, product.productType, ...(product.tags ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return category.keywords.some((k) => k.trim() && haystack.includes(k.trim().toLowerCase()));
}

/**
 * Example merch, reusing existing Cloudinary dog photos as stand-in artwork.
 * Tags are set so the default Mugs / T-Shirts / Shoes categories populate.
 * Replace by connecting Printify (proxy) or adding manual products in Admin.
 */
export function mockProducts(): ShopProduct[] {
  return [
    {
      id: 'mock-mug',
      title: 'Street Pack Enamel Mug',
      description: 'Camp-style enamel mug with a hand-drawn Caribbean pack illustration.',
      image: cld('pack', 700, 700),
      price: 18,
      currency: 'USD',
      productType: 'Mug',
      tags: ['Mug', 'Drinkware'],
      isMock: true,
    },
    {
      id: 'mock-mug-2',
      title: 'Coconut Cats Ceramic Mug',
      description: 'Glossy 11oz mug featuring AI-stylised street-cat art.',
      image: cld('dog3', 700, 700),
      price: 16,
      currency: 'USD',
      productType: 'Mug',
      tags: ['Mug', 'Ceramic'],
      isMock: true,
    },
    {
      id: 'mock-tee',
      title: '“Make Something Out of Little” Tee',
      description: 'Organic cotton t-shirt with the rescue’s motto and bottle-shelter line art.',
      image: cld('dog2', 700, 700),
      price: 26,
      currency: 'USD',
      productType: 'T-Shirt',
      tags: ['T-Shirt', 'Shirt', 'Apparel', 'Unisex'],
      isMock: true,
    },
    {
      id: 'mock-tee-2',
      title: 'Rescued & Loved Tee',
      description: 'Soft tri-blend t-shirt printed with a portrait of one of our rescues.',
      image: cld('puppy', 700, 700),
      price: 24,
      currency: 'USD',
      productType: 'T-Shirt',
      tags: ['T-Shirt', 'Shirt', 'Apparel'],
      isMock: true,
    },
    {
      id: 'mock-shoes',
      title: 'Coconut Hound Tennis Shoes',
      description: 'All-over-print sneakers carrying AI art made from real street-dog photos.',
      image: cld('dog-hero', 700, 700),
      price: 68,
      currency: 'USD',
      productType: 'Shoes',
      tags: ['Shoes', 'Sneaker', 'Tennis', 'Footwear'],
      isMock: true,
    },
    {
      id: 'mock-shoes-2',
      title: 'Beach Pack Slip-On Sneakers',
      description: 'Lightweight tennis shoes with a Caribbean-pack pattern.',
      image: cld('dog4', 700, 700),
      price: 64,
      currency: 'USD',
      productType: 'Shoes',
      tags: ['Shoes', 'Sneaker', 'Tennis'],
      isMock: true,
    },
  ];
}
