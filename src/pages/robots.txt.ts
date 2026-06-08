import type { APIRoute } from 'astro';
import robots from '../app/robots';

export const GET: APIRoute = async ({ url }) => {
  const baseUrl = url.origin;
  const config = robots(baseUrl);

  let text = '';
  const userAgent = config.rules.userAgent || '*';
  text += `User-agent: ${userAgent}\n`;

  if (config.rules.allow) {
    for (const allowPath of config.rules.allow) {
      text += `Allow: ${allowPath}\n`;
    }
  }

  if (config.rules.disallow) {
    for (const disallowPath of config.rules.disallow) {
      text += `Disallow: ${disallowPath}\n`;
    }
  }

  if (config.sitemap) {
    text += `Sitemap: ${config.sitemap}\n`;
  }

  return new Response(text.trim() + '\n', {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
