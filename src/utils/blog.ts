import matter from 'gray-matter';
import { BlogPost } from '../types';

export async function getBlogPosts(): Promise<BlogPost[]> {
  const posts = import.meta.glob<true>('../content/blog/*.md', { eager: true });
  
  const blogPosts: BlogPost[] = Object.entries(posts).map(([path, module]) => {
    const file = module.default as string;
    const { data, content } = matter(file);
    
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    
    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date || '',
      author: data.author || 'Anonymous',
      tags: data.tags || [],
      verified: data.verified || false,
      content,
      excerpt: data.excerpt,
      heroImage: data.heroImage,
    };
  });
  
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find(post => post.slug === slug) || null;
}
