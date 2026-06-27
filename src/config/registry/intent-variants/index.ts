/**
 * Barrel file — re-exports all intent-variant clusters.
 * Import from here to get the complete set of pSEO variant pages.
 */

export { PDF_CLUSTER_VARIANTS } from './pdf-cluster';
export { IMAGE_CLUSTER_VARIANTS } from './image-cluster';
export { DEVELOPER_CLUSTER_VARIANTS } from './developer-cluster';
export { TEXT_CLUSTER_VARIANTS } from './text-cluster';
export { MEDIA_CLUSTER_VARIANTS } from './media-cluster';
export { CALCULATOR_CLUSTER_VARIANTS } from './calculator-cluster';

import { PDF_CLUSTER_VARIANTS } from './pdf-cluster';
import { IMAGE_CLUSTER_VARIANTS } from './image-cluster';
import { DEVELOPER_CLUSTER_VARIANTS } from './developer-cluster';
import { TEXT_CLUSTER_VARIANTS } from './text-cluster';
import { MEDIA_CLUSTER_VARIANTS } from './media-cluster';
import { CALCULATOR_CLUSTER_VARIANTS } from './calculator-cluster';

/** Complete array of all programmatic SEO intent-variant pages */
export const ALL_INTENT_VARIANTS = [
  ...PDF_CLUSTER_VARIANTS,
  ...IMAGE_CLUSTER_VARIANTS,
  ...DEVELOPER_CLUSTER_VARIANTS,
  ...TEXT_CLUSTER_VARIANTS,
  ...MEDIA_CLUSTER_VARIANTS,
  ...CALCULATOR_CLUSTER_VARIANTS,
];
