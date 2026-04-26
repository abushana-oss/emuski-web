import { BlogPost } from './blogger';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || '';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || '';
const USE_STRAPI = process.env.NEXT_PUBLIC_USE_STRAPI === 'true';

function blocksToHtml(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return '';

  return blocks.map((block, index) => {
    if (block.type === 'paragraph') {
      const children = block.children || [];
      const text = children.map((c: any) => {
        let t = c.text || '';
        if (c.bold) t = `<strong>${t}</strong>`;
        if (c.italic) t = `<em>${t}</em>`;
        if (c.underline) t = `<u>${t}</u>`;
        if (c.code) t = `<code>${t}</code>`;
        return t;
      }).join('');
      if (!text.trim()) return '';
      return `<p>${text}</p>`;
    }
    if (block.type === 'heading') {
      const level = block.level || 2;
      const text = (block.children || [])
        .map((c: any) => c.text || '').join('');
      return `<h${level}>${text}</h${level}>`;
    }
    if (block.type === 'list') {
      const tag = block.format === 'ordered' ? 'ol' : 'ul';
      const items = (block.children || []).map((item: any) => {
        const text = (item.children || [])
          .map((c: any) => {
            let t = c.text || '';
            if (c.bold) t = `<strong>${t}</strong>`;
            return t;
          }).join('');
        return `<li>${text}</li>`;
      }).join('');
      return `<${tag}>${items}</${tag}>`;
    }
    if (block.type === 'image') {
      const url = block.image?.url || '';
      const alt = block.image?.alternativeText || '';
      return url ? `<img src="${url}" alt="${alt}" style="max-width:100%;height:auto;" />` : '';
    }
    if (block.type === 'quote') {
      const text = (block.children || [])
        .map((c: any) => c.text || '').join('');
      return `<blockquote><p>${text}</p></blockquote>`;
    }
    if (block.type === 'code') {
      const text = (block.children || [])
        .map((c: any) => c.text || '').join('');
      return `<pre><code>${text}</code></pre>`;
    }
    return '';
  }).filter(Boolean).join('\n');
}

function mapStrapiPost(post: any): BlogPost {
  const attrs = post.attributes || post;
  return {
    id: String(post.id),
    slug: attrs.slug || '',
    title: attrs.title || '',
    excerpt: attrs.excerpt || '',
    content: attrs.content || '',
    fullContent: Array.isArray(attrs.fullContent)
      ? blocksToHtml(attrs.fullContent)
      : (attrs.fullContent || ''),
    category: attrs.category || 'Manufacturing',
    author: attrs.author || 'EMUSKI',
    authorBio: attrs.authorBio || '',
    authorImage: '/logo.webp',
    publishDate: attrs.publishDate || new Date().toISOString(),
    readTime: attrs.readTime || '5 min read',
    image: attrs.image || '',
    tags: Array.isArray(attrs.tags) ? attrs.tags : [],
    featured: attrs.featured || false,
    seoTitle: attrs.seoTitle || attrs.title || '',
    metaDescription: attrs.metaDescription || attrs.excerpt || '',
    keywords: Array.isArray(attrs.keywords) ? attrs.keywords : [],
  };
}

export async function fetchStrapiPosts(): Promise<BlogPost[]> {
  if (!USE_STRAPI || !STRAPI_URL) return [];
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/blog-posts?populate=*&sort=publishDate:desc&pagination[pageSize]=100`,
      {
        headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return [];
    const json = await res.json();
    const posts = json.data || [];
    return posts.map(mapStrapiPost);
  } catch {
    return [];
  }
}

export async function fetchStrapiPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!USE_STRAPI || !STRAPI_URL) return null;
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/blog-posts?filters[slug][$eq]=${slug}&populate=*`,
      {
        headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const posts = json.data || [];
    if (posts.length === 0) return null;
    return mapStrapiPost(posts[0]);
  } catch {
    return null;
  }
}
