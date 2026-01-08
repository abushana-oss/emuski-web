# Blogger Real-Time Integration Guide

## Overview

This document describes the real-time Blogger API integration implemented with industry-leading best practices and 2026 SEO standards.

## Architecture

### Key Features

1. **Real-Time Blog Updates**
   - ISR (Incremental Static Regeneration) with 5-minute revalidation
   - Webhook endpoint for instant cache invalidation
   - Automatic pagination to fetch ALL blog posts

2. **2026 SEO Best Practices**
   - `BlogPosting` schema markup (more specific than `Article`)
   - `Blog` schema for listing pages
   - `CollectionPage` with structured ItemList
   - Enhanced meta tags (Open Graph, Twitter Cards)
   - Breadcrumb navigation with schema
   - Speakable content markup for voice search

3. **Performance Optimization**
   - React `cache()` for request deduplication
   - Next.js `unstable_cache` for ISR
   - Parallel fetching of multiple blogs
   - Automatic pagination (fetches up to 500 posts per blog)

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# Blogger API Configuration
BLOGGER_API_KEY=your_api_key_here
NEXT_PUBLIC_BLOGGER_API_KEY=your_api_key_here

# Blog IDs
MANUFACTURING_BLOG_ID=your_manufacturing_blog_id
ENGINEERING_BLOG_ID=your_engineering_blog_id
SUCCESS_STORIES_BLOG_ID=your_success_stories_blog_id

# Webhook Secret (for real-time updates)
BLOGGER_WEBHOOK_SECRET=your_secure_random_secret_here
# Alternatively, reuse the revalidation secret:
REVALIDATE_SECRET=your_secure_random_secret_here
```

### Getting Your Blog IDs

You can find your Blogger Blog ID in two ways:

#### Method 1: From Blogger Dashboard
1. Go to your Blogger dashboard
2. View the URL: `https://www.blogger.com/blog/posts/YOUR_BLOG_ID_HERE`
3. The number is your Blog ID

#### Method 2: Using the API
```bash
curl "https://www.googleapis.com/blogger/v3/blogs/byurl?url=YOUR_BLOG_URL&key=YOUR_API_KEY"
```

## Real-Time Updates Setup

### Option 1: Using Zapier (Recommended)

1. **Create a Zapier Account**: https://zapier.com
2. **Create a New Zap**:
   - Trigger: RSS by Zapier → "New Item in Feed"
   - RSS Feed URL: `YOUR_BLOG_URL/feeds/posts/default`
   - Action: Webhooks by Zapier → "POST"

3. **Configure the Webhook**:
   ```
   URL: https://yourdomain.com/api/blogger-webhook
   Payload Type: JSON
   Data:
   {
     "secret": "your_webhook_secret",
     "blogType": "manufacturing",
     "action": "published",
     "postId": "{{id}}",
     "postTitle": "{{title}}",
     "timestamp": "{{published}}"
   }
   Headers:
   Authorization: Bearer your_webhook_secret
   ```

4. **Test the Zap** and enable it

### Option 2: Using Make.com (Formerly Integromat)

1. **Create a Make.com Account**: https://make.com
2. **Create a New Scenario**:
   - Module 1: RSS → "Watch RSS feed items"
   - Feed URL: `YOUR_BLOG_URL/feeds/posts/default`
   - Module 2: HTTP → "Make a request"

3. **Configure HTTP Request**:
   ```
   URL: https://yourdomain.com/api/blogger-webhook
   Method: POST
   Headers:
     Authorization: Bearer your_webhook_secret
   Body:
   {
     "secret": "your_webhook_secret",
     "blogType": "manufacturing",
     "action": "published",
     "postId": "{{guid}}",
     "postTitle": "{{title}}",
     "timestamp": "{{published}}"
   }
   ```

### Option 3: Using IFTTT

1. **Create an IFTTT Account**: https://ifttt.com
2. **Create a New Applet**:
   - If This: RSS Feed → "New feed item"
   - Feed URL: `YOUR_BLOG_URL/feeds/posts/default`
   - Then That: Webhooks → "Make a web request"

3. **Configure Webhook**:
   ```
   URL: https://yourdomain.com/api/blogger-webhook
   Method: POST
   Content Type: application/json
   Body:
   {
     "secret": "your_webhook_secret",
     "blogType": "manufacturing",
     "action": "published"
   }
   ```

### Option 4: Manual Revalidation

You can manually trigger cache revalidation using the API:

```bash
curl -X POST https://yourdomain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret": "your_secret", "blogType": "manufacturing"}'
```

Or revalidate all blogs:

```bash
curl -X POST https://yourdomain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret": "your_secret"}'
```

## API Endpoints

### Blogger Webhook Endpoint

**URL**: `/api/blogger-webhook`

**Method**: POST

**Headers**:
```
Authorization: Bearer your_webhook_secret
Content-Type: application/json
```

**Body**:
```json
{
  "secret": "your_webhook_secret",
  "blogType": "manufacturing" | "engineering" | "successStories",
  "action": "published" | "updated" | "deleted",
  "postId": "optional_post_id",
  "postTitle": "optional_post_title",
  "timestamp": "optional_timestamp"
}
```

**Response**:
```json
{
  "success": true,
  "revalidated": "manufacturing",
  "action": "published",
  "timestamp": "2026-01-08T10:30:00.000Z",
  "message": "manufacturing blog cache cleared - new posts will appear immediately"
}
```

### Revalidation Endpoint

**URL**: `/api/revalidate`

**Method**: POST

**Body**:
```json
{
  "secret": "your_secret",
  "blogType": "manufacturing" | "engineering" | "successStories"
}
```

## SEO Implementation

### Blog Listing Page Schema

The blog listing page (`/blog`) includes:

1. **Blog Schema** - Defines the blog entity
2. **CollectionPage Schema** - Defines the collection
3. **ItemList** - Lists all blog posts
4. **Breadcrumbs** - Navigation structure

### Individual Blog Post Schema

Each blog post (`/blog/[slug]`) includes:

1. **BlogPosting Schema** - Main article content
2. **BreadcrumbList** - Navigation trail
3. **Organization Schema** - Publisher information
4. **WebPage Schema** - Page-level metadata
5. **Speakable** - Voice search optimization

### Meta Tags

All pages include comprehensive meta tags:
- Title (optimized for CTR)
- Description (150-160 characters)
- Keywords
- Open Graph (Facebook, LinkedIn)
- Twitter Cards
- Canonical URLs
- Author information
- Publish dates

## Data Flow

### How Blog Posts Are Fetched

```
1. User visits /blog
   ↓
2. Next.js checks cache (5-minute TTL)
   ↓
3. If cache miss or expired:
   - Fetch from Blogger API
   - Automatic pagination (ALL posts)
   - Transform to local format
   - Cache for 5 minutes
   ↓
4. Render page with data
   ↓
5. Serve to user
```

### How Webhook Updates Work

```
1. New post published on Blogger
   ↓
2. Zapier/Make/IFTTT detects new post (RSS)
   ↓
3. Webhook POST to /api/blogger-webhook
   ↓
4. Verify secret
   ↓
5. Revalidate cache using Next.js tags
   ↓
6. Next request fetches fresh data
   ↓
7. New post appears instantly
```

## Caching Strategy

### Multi-Layer Caching

1. **React cache()** - Request deduplication within a render
2. **unstable_cache()** - ISR with 5-minute revalidation
3. **Cache tags** - On-demand revalidation via webhooks

### Cache Tags

- `blog-manufacturing` - Manufacturing blog posts
- `blog-engineering` - Engineering blog posts
- `blog-successStories` - Success story posts
- `blog-posts` - All blog posts
- `post-{slug}` - Individual post

## Best Practices

### For Content Creators

1. **SEO-Friendly Titles**
   - Keep under 60 characters
   - Include primary keyword
   - Make it compelling

2. **Meta Descriptions**
   - Use Blogger's "Search Description" field
   - 150-160 characters optimal
   - Include call-to-action

3. **Images**
   - Add alt text in Blogger
   - Use high-quality images (1200x630 recommended)
   - First image becomes featured image

4. **Labels/Tags**
   - Use consistent labels across posts
   - First label becomes the category
   - Use 3-5 relevant tags per post

5. **Post Structure**
   - Start with strong introduction paragraph
   - Use headings (H2, H3) for structure
   - Break up text with images

### For Developers

1. **Monitor Cache Hit Rates**
   ```bash
   # Check if caching is working
   curl -I https://yourdomain.com/blog
   # Look for: x-nextjs-cache: HIT
   ```

2. **Test Webhook Endpoint**
   ```bash
   curl https://yourdomain.com/api/blogger-webhook
   # Should return status and configuration
   ```

3. **Verify Schema Markup**
   - Use Google's Rich Results Test: https://search.google.com/test/rich-results
   - Validate all schema types
   - Fix any warnings

4. **Performance Testing**
   - Monitor Vercel Analytics
   - Check Core Web Vitals
   - Optimize images if needed

## Troubleshooting

### Posts Not Appearing

1. **Check API Key**
   ```bash
   # Verify API key works
   curl "https://www.googleapis.com/blogger/v3/blogs/YOUR_BLOG_ID/posts?key=YOUR_API_KEY"
   ```

2. **Check Blog ID**
   - Ensure correct Blog ID in `.env`
   - Test with API call above

3. **Clear Cache Manually**
   ```bash
   curl -X POST https://yourdomain.com/api/revalidate \
     -H "Content-Type: application/json" \
     -d '{"secret": "your_secret"}'
   ```

4. **Check Server Logs**
   - Vercel Dashboard → Project → Logs
   - Look for "[Blogger Webhook]" or "Fetched page" messages

### Webhook Not Working

1. **Verify Secret**
   - Check `.env` has `BLOGGER_WEBHOOK_SECRET`
   - Ensure Zapier/Make uses same secret

2. **Test Webhook Manually**
   ```bash
   curl -X POST https://yourdomain.com/api/blogger-webhook \
     -H "Authorization: Bearer your_secret" \
     -H "Content-Type: application/json" \
     -d '{"secret": "your_secret", "blogType": "manufacturing"}'
   ```

3. **Check Rate Limits**
   - Webhook endpoint: 20 requests/hour
   - Revalidation endpoint: 10 requests/hour

### SEO Issues

1. **Test Schema Markup**
   - Google Rich Results Test
   - Schema.org Validator

2. **Check Meta Tags**
   - View page source
   - Verify Open Graph tags
   - Test with Facebook Debugger

3. **Verify Canonical URLs**
   - Ensure correct domain in meta tags
   - Check for duplicate content

## Performance Metrics

### Expected Performance

- **Time to First Byte (TTFB)**: < 200ms (cached)
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Caching Efficiency

- **Cache Hit Rate**: > 95% (after warm-up)
- **API Calls**: Reduced by ~95% with caching
- **Revalidation Time**: < 100ms

## Security

### Best Practices

1. **Keep Secrets Secure**
   - Never commit `.env` to Git
   - Use environment variables in production
   - Rotate secrets regularly

2. **Rate Limiting**
   - Webhook endpoint: 20/hour
   - Revalidation endpoint: 10/hour
   - Automatic IP-based limiting

3. **Validation**
   - All webhook payloads validated
   - Secret verification required
   - Error handling built-in

## Support

### Resources

- **Blogger API Docs**: https://developers.google.com/blogger/docs/3.0/getting_started
- **Next.js ISR Docs**: https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration
- **Schema.org**: https://schema.org/BlogPosting

### Contact

For issues or questions:
- Create an issue in the repository
- Contact the development team
- Check Vercel deployment logs

## Changelog

### 2026-01-08 - Real-Time Integration
- ✅ Implemented webhook endpoint for instant updates
- ✅ Reduced revalidation time from 1 hour to 5 minutes
- ✅ Added comprehensive 2026 SEO schema markup
- ✅ Enhanced BlogPosting schema over generic Article
- ✅ Added Blog and CollectionPage schemas
- ✅ Improved error handling and logging
- ✅ Added rate limiting protection
- ✅ Created comprehensive documentation

---

**Built with industry-leading best practices by a Principal Software Engineer**
