import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RegistryService } from '@/lib/registry';
import MediaWorkspacePage from '../page'; // Reuse the main workspace UI

interface Props {
  params: Promise<{ tool: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const toolSlug = params.tool;
  
  // Try to find a matching converter or downloader
  const converter = RegistryService.getConverterBySlug(toolSlug);
  const downloader = RegistryService.getDownloaderBySlug(toolSlug);
  
  const config = converter || downloader;

  if (!config) {
    return {
      title: 'Tool Not Found - UTool',
    };
  }

  return {
    title: config.seoMeta.title,
    description: config.seoMeta.description,
    keywords: config.seoMeta.keywords,
    openGraph: {
      title: config.seoMeta.title,
      description: config.seoMeta.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.seoMeta.title,
      description: config.seoMeta.description,
    }
  };
}

export default async function ToolWorkspacePage(props: Props) {
  const params = await props.params;
  const toolSlug = params.tool;
  
  const converter = RegistryService.getConverterBySlug(toolSlug);
  const downloader = RegistryService.getDownloaderBySlug(toolSlug);
  
  const config = converter || downloader;

  if (!config) {
    notFound();
  }

  // Generate JSON-LD Schema for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: config.name,
    description: config.seoMeta.description,
    applicationCategory: 'BrowserApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* 
        We pass the pre-selected tool to the workspace so it can 
        automatically focus this tool when a user uploads a file.
        For now, we just render the MediaWorkspacePage.
      */}
      <MediaWorkspacePage />
    </>
  );
}
