import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://emuski.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/auth/',
          '/_next/',
          '/database/',
          '/src/',
          '*.json',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/tools/3d-cad-analysis/',
          '/tools/2d-balloon-diagram/',
          '/services/',
          '/solutions/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/auth/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}