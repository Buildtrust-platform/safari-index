/**
 * Visual Components - Barrel Export
 *
 * Environmental context imagery for Safari Index staging pages.
 * All components are gated by isBuildMode() - production unchanged.
 */

export { ImageBand, ImageBandContent } from './ImageBand';
export type {
  ImageBandProps,
  ImageBandImage,
  ImageBandHeight,
  ImageBandOverlay,
  ImageBandAlign,
} from './ImageBand';

export {
  ecosystemImages,
  heroImages,
  pageImages,
  getImagesByTag,
  getImageById,
  getRandomImage,
} from './ecosystem-images';
export type { EcosystemImage, HeroImage } from './ecosystem-images';

export { DecisionProcess, ProcessStepHighlight } from './DecisionProcess';
export type { DecisionProcessProps } from './DecisionProcess';

export { VerdictMoment } from './VerdictMoment';
export type { VerdictMomentProps, OutcomeType as VerdictOutcomeType } from './VerdictMoment';
