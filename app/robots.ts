import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://emuski.com'

  const sharedDisallow = [
    '/api/',
    '/_next/',
    '/database/',
    '/src/',
    '*.json',
  ]

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: sharedDisallow,
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/manufacturing-services/', '/cost-engineering/', '/solutions/ai/', '/services/'],
        disallow: sharedDisallow,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: sharedDisallow,
        crawlDelay: 1,
      },
      // OpenAI: ChatGPT training + browsing + SearchGPT
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: sharedDisallow,
        crawlDelay: 1,
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: sharedDisallow,
        crawlDelay: 1,
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: sharedDisallow,
        crawlDelay: 1,
      },
      // Google: Gemini / AI Overviews training
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: sharedDisallow,
        crawlDelay: 1,
      },
      // Anthropic: Claude training + web browsing
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: sharedDisallow,
        crawlDelay: 1,
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
        disallow: sharedDisallow,
        crawlDelay: 1,
      },
      // Perplexity AI
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: sharedDisallow,
        crawlDelay: 1,
      },
      // You.com AI search
      {
        userAgent: 'YouBot',
        allow: '/',
        disallow: sharedDisallow,
        crawlDelay: 1,
      },
      // Meta AI
      {
        userAgent: 'Meta-ExternalAgent',
        allow: '/',
        disallow: sharedDisallow,
        crawlDelay: 1,
      },
      // DuckDuckGo AI
      {
        userAgent: 'DuckAssistBot',
        allow: '/',
        disallow: sharedDisallow,
        crawlDelay: 1,
      },
      // Yahoo Slurp
      {
        userAgent: 'Slurp',
        allow: '/',
        disallow: sharedDisallow,
        crawlDelay: 1,
      },
      // Block aggressive scrapers
      { userAgent: 'AhrefsBot', disallow: ['/'] },
      { userAgent: 'MJ12bot', disallow: ['/'] },
      {
        userAgent: 'SemrushBot',
        allow: '/',
        disallow: sharedDisallow,
        crawlDelay: 2,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
