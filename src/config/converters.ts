import { cloudflareProvider } from "@/lib/converters/providers/image/cloudflare.provider";
import { textProvider } from "@/lib/converters/providers/data/text.provider";
import { ConverterProvider } from '@/lib/converters/provider';
import { getToolBySlug } from './tool-registry';

// Map of converter ID to provider
export const converterProviders: Record<string, ConverterProvider> = {
  'png-to-jpg': cloudflareProvider,
  'jpg-to-png': cloudflareProvider,
  'json-to-csv': textProvider,
  'csv-to-json': textProvider,
  'markdown-to-html': textProvider,
  'html-to-markdown': textProvider,
  'yaml-to-json': textProvider,
  'base64-encoder-decoder': textProvider,
};

export function getConverterConfig(id: string) {
  return getToolBySlug(id);
}
