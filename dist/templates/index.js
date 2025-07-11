// Parametric Template Exports - All Available Templates
// Furniture Templates
export { ChairTemplate } from './seating/ChairTemplate.js';
export { EnhancedChairTemplate } from './seating/EnhancedChairTemplate.js';
export { TableTemplate } from './tables/TableTemplate.js';
export { EnhancedTableTemplate } from './tables/EnhancedTableTemplate.js';
export { EnhancedPlaygroundTemplate } from './playground/EnhancedPlaygroundTemplate.js';
// System Templates (Specialized Infrastructure)
export { LightingTemplate } from './lighting/LightingTemplate.js';
export { FloralTemplate } from './floral/FloralTemplate.js';
export { StageTemplate } from './stage/StageTemplate.js';
// Tier 1 System Templates (Newly Added)
export { ClimateTemplate } from './climate/ClimateTemplate.js';
export { SecurityTemplate } from './security/SecurityTemplate.js';
export { AVTemplate } from './av/AVTemplate.js';
// Tier 2 System Templates (Final Addition)
export { LandscapeTemplate } from './landscape/LandscapeTemplate.js';
export { StructureTemplate } from './structure/StructureTemplate.js';
export { InteractiveTemplate } from './interactive/InteractiveTemplate.js';
// Celebration Templates
export { CelebratoryTemplate, QuinceañeraTemplate, BarBatMitzvahTemplate, KoreanDoljanchTemplate } from './celebratory/CelebratoryTemplate.js';
// Export testing functions
export { createTestClimateSystem } from './climate/ClimateTemplate.js';
export { createTestSecuritySystem } from './security/SecurityTemplate.js';
export { createTestAVSystem } from './av/AVTemplate.js';
export { createTestLandscape } from './landscape/LandscapeTemplate.js';
export { createTestStructure } from './structure/StructureTemplate.js';
export { createTestInteractiveExperience } from './interactive/InteractiveTemplate.js';
export { createTestQuinceañera, createTestBarMitzvah, createTestDoljanchi } from './celebratory/CelebratoryTemplate.js';
// Template Categories for Organization
export const FURNITURE_TEMPLATES = [
    'chair', 'dining-table', 'coffee-table', 'side-table'
];
export const SYSTEM_TEMPLATES = [
    'lighting-system', 'floral-arrangement', 'stage-system',
    'climate-control', 'security-system', 'av-system',
    'landscape-design', 'architectural-structure', 'interactive-experience', 'celebratory-props'
];
export const ALL_TEMPLATES = [
    ...FURNITURE_TEMPLATES,
    ...SYSTEM_TEMPLATES
];
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
    },
    // Celebration Template
    'celebratory-props': {
        category: 'system',
        name: 'Celebratory Props & Themed Decorations Template',
        description: 'Cultural celebration systems including quinceañera, bar/bat mitzvah, doljanchi, and themed party decorations',
        complexity: 'expert',
        culturalSupport: ['mexican', 'jewish', 'korean', 'american', 'japanese', 'italian', 'modern', 'multi-cultural']
    }
};
// Helper function to get template by category
export function getTemplatesByCategory(category) {
    return Object.entries(TEMPLATE_METADATA)
        .filter(([_, meta]) => meta.category === category)
        .map(([key, _]) => key);
}
// Helper function to get supported cultures for a template
export function getSupportedCultures(templateKey) {
    const meta = TEMPLATE_METADATA[templateKey];
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
    },
    'orchestration': {
        description: 'Master-level orchestration of multiple templates and systems',
        skillLevel: 'Master',
        estimatedTime: '45+ minutes'
    }
};
// Orchestration System Export
export { EventOrchestrationMaster } from '../orchestration/EventOrchestrationMaster';
export { CulturalAnalyzer, SpatialPlanner, ExperienceDesigner, QualityValidator } from '../orchestration/OrchestrationUtils';
//# sourceMappingURL=index.js.map