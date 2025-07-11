// Parametric Template Exports - All Available Templates

// Furniture Templates
export { ChairTemplate } from './seating/ChairTemplate';
export { EnhancedChairTemplate } from './seating/EnhancedChairTemplate';
export { TableTemplate } from './tables/TableTemplate';
export { EnhancedTableTemplate } from './tables/EnhancedTableTemplate';
export { EnhancedPlaygroundTemplate } from './playground/EnhancedPlaygroundTemplate';

// System Templates (Specialized Infrastructure)
export { LightingTemplate } from './lighting/LightingTemplate';
export { FloralTemplate } from './floral/FloralTemplate';
export { StageTemplate } from './stage/StageTemplate';

// Tier 1 System Templates (Newly Added)
export { ClimateTemplate } from './climate/ClimateTemplate';
export { SecurityTemplate } from './security/SecurityTemplate';
export { AVTemplate } from './av/AVTemplate';

// Tier 2 System Templates (Final Addition)
export { LandscapeTemplate } from './landscape/LandscapeTemplate';
export { StructureTemplate } from './structure/StructureTemplate';
export { InteractiveTemplate } from './interactive/InteractiveTemplate';

// Export template interfaces and parameters
export type { ClimateParameters, CulturalClimateData } from './climate/ClimateTemplate';
export type { SecurityParameters, CulturalSecurityData } from './security/SecurityTemplate';
export type { AVParameters, CulturalAVData } from './av/AVTemplate';
export type { LandscapeParameters, CulturalGardenData } from './landscape/LandscapeTemplate';
export type { StructureParameters, CulturalArchitectureData } from './structure/StructureTemplate';
export type { InteractiveParameters, CulturalInteractionData } from './interactive/InteractiveTemplate';

// Export testing functions
export { createTestClimateSystem } from './climate/ClimateTemplate';
export { createTestSecuritySystem } from './security/SecurityTemplate';
export { createTestAVSystem } from './av/AVTemplate';
export { createTestLandscape } from './landscape/LandscapeTemplate';
export { createTestStructure } from './structure/StructureTemplate';
export { createTestInteractiveExperience } from './interactive/InteractiveTemplate';

// Template Categories for Organization
export const FURNITURE_TEMPLATES = [
  'chair', 'dining-table', 'coffee-table', 'side-table'
] as const;

export const SYSTEM_TEMPLATES = [
  'lighting-system', 'floral-arrangement', 'stage-system', 
  'climate-control', 'security-system', 'av-system',
  'landscape-design', 'architectural-structure', 'interactive-experience'
] as const;

export const ALL_TEMPLATES = [
  ...FURNITURE_TEMPLATES,
  ...SYSTEM_TEMPLATES
] as const;

// Template metadata for documentation and UI
export const TEMPLATE_METADATA = {
  // Furniture Templates
  'chair': {
    category: 'furniture',
    name: 'Chair Template',
    description: 'Parametric chair generation with cultural adaptation',
    complexity: 'basic',
    culturalSupport: ['japanese', 'scandinavian', 'italian', 'modern']
  },
  'dining-table': {
    category: 'furniture', 
    name: 'Dining Table Template',
    description: 'Family dining tables with cultural proportions',
    complexity: 'basic',
    culturalSupport: ['japanese', 'scandinavian', 'italian', 'modern']
  },
  'coffee-table': {
    category: 'furniture',
    name: 'Coffee Table Template', 
    description: 'Casual tables for social gatherings',
    complexity: 'basic',
    culturalSupport: ['japanese', 'scandinavian', 'italian', 'modern']
  },
  'side-table': {
    category: 'furniture',
    name: 'Side Table Template',
    description: 'Accent tables for functional placement',
    complexity: 'basic', 
    culturalSupport: ['japanese', 'scandinavian', 'italian', 'modern']
  },

  // System Templates
  'lighting-system': {
    category: 'system',
    name: 'Lighting System Template',
    description: 'Comprehensive lighting design for events',
    complexity: 'advanced',
    culturalSupport: ['japanese', 'scandinavian', 'italian', 'modern']
  },
  'floral-arrangement': {
    category: 'system',
    name: 'Floral Arrangement Template', 
    description: 'Cultural floral designs and arrangements',
    complexity: 'intermediate',
    culturalSupport: ['japanese', 'scandinavian', 'italian', 'modern']
  },
  'stage-system': {
    category: 'system',
    name: 'Stage System Template',
    description: 'Performance and presentation infrastructure',
    complexity: 'advanced',
    culturalSupport: ['japanese', 'scandinavian', 'italian', 'modern']
  },

  // Tier 1 System Templates
  'climate-control': {
    category: 'system',
    name: 'Climate Control Template',
    description: 'HVAC, weather protection, and comfort systems',
    complexity: 'expert',
    culturalSupport: ['japanese', 'scandinavian', 'italian', 'modern', 'traditional']
  },
  'security-system': {
    category: 'system', 
    name: 'Security & Safety Template',
    description: 'Access control, surveillance, and emergency systems',
    complexity: 'expert',
    culturalSupport: ['japanese', 'scandinavian', 'italian', 'modern', 'international']
  },
  'av-system': {
    category: 'system',
    name: 'Audio/Visual Technology Template',
    description: 'Sound, video, and presentation technology systems', 
    complexity: 'expert',
    culturalSupport: ['japanese', 'scandinavian', 'italian', 'modern', 'international']
  },

  // Tier 2 System Templates (Final Addition)
  'landscape-design': {
    category: 'system',
    name: 'Landscape Design Template',
    description: 'Garden design, plant selection, and landscape architecture',
    complexity: 'expert',
    culturalSupport: ['japanese', 'scandinavian', 'italian', 'french', 'english', 'modern']
  },
  'architectural-structure': {
    category: 'system',
    name: 'Architectural Structure Template',
    description: 'Pavilions, pergolas, gazebos, and architectural elements',
    complexity: 'expert',
    culturalSupport: ['japanese', 'scandinavian', 'italian', 'modern', 'traditional']
  },
  'interactive-experience': {
    category: 'system',
    name: 'Interactive Experience Template',
    description: 'Digital art, immersive installations, and interactive technology',
    complexity: 'expert',
    culturalSupport: ['japanese', 'scandinavian', 'italian', 'modern', 'universal']
  }
} as const;

// Helper function to get template by category
export function getTemplatesByCategory(category: 'furniture' | 'system') {
  return Object.entries(TEMPLATE_METADATA)
    .filter(([_, meta]) => meta.category === category)
    .map(([key, _]) => key);
}

// Helper function to get supported cultures for a template
export function getSupportedCultures(templateKey: string) {
  const meta = TEMPLATE_METADATA[templateKey as keyof typeof TEMPLATE_METADATA];
  return meta?.culturalSupport || [];
}

// Template complexity levels for UI guidance
export const COMPLEXITY_LEVELS = {
  'basic': {
    description: 'Simple parametric generation with basic cultural adaptation',
    skillLevel: 'Beginner',
    estimatedTime: '< 5 minutes'
  },
  'intermediate': {
    description: 'Moderate complexity with cultural research integration',
    skillLevel: 'Intermediate', 
    estimatedTime: '5-15 minutes'
  },
  'advanced': {
    description: 'Complex systems with multiple integration points',
    skillLevel: 'Advanced',
    estimatedTime: '15-30 minutes'
  },
  'expert': {
    description: 'Professional-grade systems requiring domain expertise',
    skillLevel: 'Expert',
    estimatedTime: '30+ minutes'
  }
} as const;