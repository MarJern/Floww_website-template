import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://flowwmedia.no';
  
  const routes = [
    '',
    '/lokal-seo',
    '/nettsider',
    '/ai-seo',
    '/om-oss',
    '/artikler',
    '/kontakt',
    '/personvern',
    '/vilkar'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
