import { BlogPost } from '../types';

/**
 * Minimal YAML-frontmatter parser. We intentionally avoid `gray-matter`
 * because it depends on Node's Buffer, which isn't available in the browser
 * without a polyfill. Our frontmatter only uses simple scalars and inline
 * string arrays (e.g. tags: ["a", "b"]), which this handles directly.
 */
function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, content: raw };

  const [, frontmatter, content] = match;
  const data: Record<string, unknown> = {};

  for (const line of frontmatter.split('\n')) {
    const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line.trim());
    if (!kv) continue;
    const [, key, rawValue] = kv;
    let value = rawValue.trim();

    if (value.startsWith('[') && value.endsWith(']')) {
      // inline array e.g. ["success-story", "milestone"]
      data[key] = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else if (value === 'true' || value === 'false') {
      data[key] = value === 'true';
    } else {
      data[key] = value.replace(/^["']|["']$/g, '');
    }
  }

  return { data, content: content.trim() };
}

function toPost(path: string, raw: string): BlogPost {
  const { data, content } = parseFrontmatter(raw);
  const slug = (data.slug as string) || path.split('/').pop()?.replace('.md', '') || '';

  // Rough reading time from word count.
  const words = content.split(/\s+/).filter(Boolean).length;

  return {
    slug,
    title: (data.title as string) || 'Untitled',
    date: (data.date as string) || '',
    author: (data.author as string) || 'Anonymous',
    tags: (data.tags as string[]) || [],
    verified: (data.verified as boolean) || false,
    content,
    excerpt: data.excerpt as string | undefined,
    heroImage: data.heroImage as string | undefined,
    readingTime: Math.max(1, Math.round(words / 200)),
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const posts = import.meta.glob('../content/blog/*.md', { eager: true, as: 'raw' });

  const blogPosts: BlogPost[] = Object.entries(posts).map(([path, content]) =>
    toPost(path, content as string)
  );

  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug) || null;
}
