// Template Orchestration System - Main Export
export { EventOrchestrationMaster } from './EventOrchestrationMaster';
export type { 
  EventOrchestrationParameters,
  OrchestrationResult,
  TemplateRelationship 
} from './EventOrchestrationMaster';

export type {
  OrchestrationContext,
  CulturalContext,
  SpatialContext,
  TechnicalContext,
  ExperienceContext,
  QualityMetrics,
  ValidationResult,
  Recommendation
} from './OrchestrationTypes';

export {
  CulturalAnalyzer,
  SpatialPlanner,
  ExperienceDesigner,
  QualityValidator
} from './OrchestrationUtils';

// Re-export for convenience
export type { 
  ParametricParameters,
  LightingParameters,
  FloralParameters,
  StageParameters,
  LandscapeParameters,
  StructureParameters,
  InteractiveParameters
} from '../types/index';