export interface RobotsConfig {
  rules: {
    userAgent?: string;
    allow?: string[];
    disallow?: string[];
  };
  sitemap?: string;
}

export default function robots(baseUrl: string = 'http://localhost:4321'): RobotsConfig {
  return {
    rules: {
      userAgent: '*',
      allow: ['/problems/*'],
      disallow: ['/admin/*', '/api/*'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
