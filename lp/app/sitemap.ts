import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const SITE_URL = 'https://gamevisiontuner.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
