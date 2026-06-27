import { Metadata } from 'next';
import { RegistryTool } from '@/types/tool-registry';

export function generateConverterMetadata(config: RegistryTool): Metadata {
  return {
    title: config.seoMeta.title,
    description: config.seoMeta.description,
    keywords: config.seoMeta.keywords,
    openGraph: {
      title: config.seoMeta.title,
      description: config.seoMeta.description,
      type: 'website',
      url: `https://utool.in/tools/${config.slug}`,
      siteName: 'Utool',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.seoMeta.title,
      description: config.seoMeta.description,
    },
    alternates: {
      canonical: `https://utool.in/tools/${config.slug}`,
    },
  };
}

export function generateSoftwareSchema(config: RegistryTool) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: config.name,
    url: `https://utool.in/tools/${config.slug}`,
    description: config.seoMeta.description,
    applicationCategory: 'Utility',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
  };
}

export function generateFAQSchema(config: RegistryTool) {
  if (!config.faqs || !config.faqs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question || (faq as any).q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer || (faq as any).a,
      },
    })),
  };
}

export function generateBreadcrumbSchema(config: RegistryTool) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://utool.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tools',
        item: 'https://utool.in/tools',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: config.name,
        item: `https://utool.in/tools/${config.slug}`,
      },
    ],
  };
}
