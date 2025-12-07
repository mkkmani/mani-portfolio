import { Metadata } from 'next';
import { SOCIAL_LINKS } from './config';

/**
 * Site configuration interface
 */
export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  ogImage: string;
  author: {
    name: string;
    email: string;
    url: string;
    jobTitle: string;
  };
  social: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

/**
 * Page metadata interface for generating static page metadata
 */
export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  noindex?: boolean;
  path?: string;
}

/**
 * Centralized site configuration
 */
const siteConfig: SiteConfig = {
  name: 'Mani Kanta',
  title: 'Mani Kanta - Full Stack Developer',
  description: 'Full-stack MERN developer specializing in building exceptional digital experiences with modern web technologies.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://manikantaketha.in',
  ogImage: '/og/og-image.svg',
  author: {
    name: 'Mani Kanta',
    email: SOCIAL_LINKS.email,
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://manikantaketha.in',
    jobTitle: 'Software Engineer | Full Stack Developer',
  },
  social: {
    twitter: SOCIAL_LINKS.twitter,
    github: SOCIAL_LINKS.github,
    linkedin: SOCIAL_LINKS.linkedin,
  },
};

/**
 * Get the centralized site configuration
 * @returns {SiteConfig} The site configuration object
 */
export function getSiteConfig(): SiteConfig {
  return siteConfig;
}

/**
 * Generate Next.js Metadata object for static pages
 * @param {PageMetadata} page - Page metadata configuration
 * @returns {Metadata} Next.js Metadata object
 */
export function generatePageMetadata(page: PageMetadata): Metadata {
  const config = getSiteConfig();
  const pageUrl = page.path ? `${config.url}${page.path}` : config.url;
  const ogImageUrl = page.ogImage || config.ogImage;

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: pageUrl,
      siteName: config.name,
      title: page.title,
      description: page.description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: [ogImageUrl],
      creator: config.social.twitter,
    },
    robots: page.noindex
      ? {
        index: false,
        follow: false,
      }
      : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    alternates: {
      canonical: pageUrl,
    },
  };
}
