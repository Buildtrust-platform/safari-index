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
  // Destination images
  destinationImages,
  getDestinationImage,
  // Activity images
  activityImageRefs,
  getActivityImageRef,
  getActivityFallbackImage,
} from './ecosystem-images';
export type {
  EcosystemImage,
  HeroImage,
  DestinationImage,
  ActivityImageRef,
} from './ecosystem-images';

export { DecisionProcess, ProcessStepHighlight } from './DecisionProcess';
export type { DecisionProcessProps } from './DecisionProcess';

export { VerdictMoment } from './VerdictMoment';
export type { VerdictMomentProps, OutcomeType as VerdictOutcomeType } from './VerdictMoment';

export { TravelMap } from './TravelMap';
export { RouteMap } from './RouteMap';
