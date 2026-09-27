import siteMetadata from '@/data/siteMetadata';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteMetadata.siteUrl, lastModified: new Date() }];
}
