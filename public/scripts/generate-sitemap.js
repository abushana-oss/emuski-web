require('dotenv').config();
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// ========================================
// CONFIGURATION
// ========================================
const CONFIG = {
  baseUrl: 'https://www.emuski.com',
  outputPath: path.join(__dirname, '../public/sitemap.xml'),
  today: new Date().toISOString().split('T')[0],
  
  // Ghost CMS (set to null if not using Ghost)
  ghost: {
    apiUrl: process.env.NEXT_PUBLIC_GHOST_API_URL,
    apiKey: process.env.NEXT_PUBLIC_GHOST_API_KEY,
    enabled: !!(process.env.NEXT_PUBLIC_GHOST_API_URL && process.env.NEXT_PUBLIC_GHOST_API_KEY)
  }
};

// ========================================
// STATIC PAGES
// ========================================
const STATIC_PAGES = [
  { path: '', priority: 1.0, changefreq: 'daily' },
  { path: '/contact', priority: 0.7, changefreq: 'monthly' },
  { path: '/blog', priority: 0.8, changefreq: 'weekly' },
  
  // Add your static pages here
  // { path: '/your-page', priority: 0.8, changefreq: 'weekly' },
];

// ========================================
// DYNAMIC URL GENERATORS
// ========================================

/**
 * Example: Generate product URLs dynamically
 * Replace with your own dynamic content logic
 */
function generateProductUrls() {
  // Example: If you have products in a JSON file or database
  // const products = require('./data/products.json');
  // return products.map(product => ({
  //   path: `/products/${product.slug}`,
  //   lastmod: product.updated_at || CONFIG.today,
  //   priority: 0.8,
  //   changefreq: 'weekly'
  // }));
  
  return []; // Return empty array if not needed
}

/**
 * Example: Generate category URLs
 */
function generateCategoryUrls() {
  const categories = [
    'technology',
    'design', 
    'business',
    'marketing'
  ];
  
  return categories.map(category => ({
    path: `/category/${category}`,
    lastmod: CONFIG.today,
    priority: 0.7,
    changefreq: 'weekly'
  }));
}

// ========================================
// GHOST CMS INTEGRATION
// ========================================

/**
 * Fetch all posts from Ghost CMS with pagination
 */
async function fetchGhostPosts(tagFilter = null) {
  if (!CONFIG.ghost.enabled) {
    console.log('Ghost CMS not configured, skipping...');
    return [];
  }

  let page = 1;
  let allPosts = [];
  let totalPages = 1;

  try {
    do {
      const url = new URL(`${CONFIG.ghost.apiUrl}/ghost/api/content/posts/`);
      const params = {
        key: CONFIG.ghost.apiKey,
        include: 'tags,authors',
        limit: 100,
        page
      };
      
      if (tagFilter) {
        params.filter = `tag:${tagFilter}`;
      }
      
      url.search = new URLSearchParams(params).toString();

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`Ghost API error: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();
      allPosts.push(...json.posts);
      totalPages = json.meta.pagination.pages;
      page++;
    } while (page <= totalPages);

    return allPosts;
  } catch (error) {
    console.error(`Error fetching Ghost posts (tag: ${tagFilter}):`, error.message);
    return [];
  }
}

/**
 * Convert Ghost posts to sitemap URLs
 */
function ghostPostsToUrls(posts, urlPattern = '/blog/:category/:slug') {
  return posts.map(post => {
    const categorySlug = post.primary_tag?.slug || 
                        post.tags?.[0]?.slug || 
                        'uncategorized';
    
    const path = urlPattern
      .replace(':category', categorySlug)
      .replace(':slug', post.slug);
    
    return {
      path,
      lastmod: post.updated_at?.split('T')[0] || CONFIG.today,
      priority: 0.8,
      changefreq: 'monthly'
    };
  });
}

// ========================================
// SITEMAP GENERATION
// ========================================

/**
 * Generate XML sitemap from URL objects
 */
function generateSitemapXML(urls) {
  const urlEntries = urls.map(({ path, lastmod, priority, changefreq }) => `
  <url>
    <loc>${CONFIG.baseUrl}${path}</loc>
    <lastmod>${lastmod || CONFIG.today}</lastmod>
    <priority>${priority || 0.5}</priority>
    <changefreq>${changefreq || 'monthly'}</changefreq>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}
</urlset>`;
}

/**
 * Write sitemap to file
 */
function writeSitemap(xml) {
  const dir = path.dirname(CONFIG.outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(CONFIG.outputPath, xml, 'utf8');
}

// ========================================
// MAIN EXECUTION
// ========================================

async function generateSitemap() {
  console.log('🚀 Starting sitemap generation...\n');
  
  try {
    // 1. Normalize static pages
    const staticUrls = STATIC_PAGES.map(page => ({
      ...page,
      lastmod: page.lastmod || CONFIG.today
    }));
    console.log(`✓ ${staticUrls.length} static pages`);

    // 2. Generate dynamic URLs (customize these)
    const productUrls = generateProductUrls();
    console.log(`✓ ${productUrls.length} product pages`);
    
    const categoryUrls = generateCategoryUrls();
    console.log(`✓ ${categoryUrls.length} category pages`);

    // 3. Fetch Ghost CMS content (if enabled)
    let blogUrls = [];
    let newsroomUrls = [];
    
    if (CONFIG.ghost.enabled) {
      console.log('\n📰 Fetching Ghost CMS content...');
      
      const blogPosts = await fetchGhostPosts('blog');
      blogUrls = ghostPostsToUrls(blogPosts, '/blog/:category/:slug');
      console.log(`✓ ${blogUrls.length} blog posts`);
      
      const newsroomPosts = await fetchGhostPosts('newsroom');
      newsroomUrls = ghostPostsToUrls(newsroomPosts, '/newsroom/:slug');
      console.log(`✓ ${newsroomUrls.length} newsroom posts`);
    }

    // 4. Combine all URLs
    const allUrls = [
      ...staticUrls,
      ...productUrls,
      ...categoryUrls,
      ...blogUrls,
      ...newsroomUrls
    ];

    // 5. Generate and write sitemap
    const xml = generateSitemapXML(allUrls);
    writeSitemap(xml);

    console.log(`\n✅ Sitemap generated successfully!`);
    console.log(`   Total URLs: ${allUrls.length}`);
    console.log(`   Output: ${CONFIG.outputPath}`);
    
  } catch (error) {
    console.error('\n❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Execute
generateSitemap();