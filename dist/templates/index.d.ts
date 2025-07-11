export { ChairTemplate } from './seating/ChairTemplate.js';
export { EnhancedChairTemplate } from './seating/EnhancedChairTemplate.js';
export { TableTemplate } from './tables/TableTemplate.js';
export { EnhancedTableTemplate } from './tables/EnhancedTableTemplate.js';
export { EnhancedPlaygroundTemplate } from './playground/EnhancedPlaygroundTemplate.js';
export { LightingTemplate } from './lighting/LightingTemplate.js';
export { FloralTemplate } from './floral/FloralTemplate.js';
export { StageTemplate } from './stage/StageTemplate.js';
export { ClimateTemplate } from './climate/ClimateTemplate.js';
export { SecurityTemplate } from './security/SecurityTemplate.js';
export { AVTemplate } from './av/AVTemplate.js';
export { LandscapeTemplate } from './landscape/LandscapeTemplate.js';
export { StructureTemplate } from './structure/StructureTemplate.js';
export { InteractiveTemplate } from './interactive/InteractiveTemplate.js';
export { CelebratoryTemplate, QuinceañeraTemplate, BarBatMitzvahTemplate, KoreanDoljanchTemplate } from './celebratory/CelebratoryTemplate.js';
export type { ClimateParameters, CulturalClimateData } from './climate/ClimateTemplate.js';
export type { SecurityParameters, CulturalSecurityData } from './security/SecurityTemplate.js';
export type { AVParameters, CulturalAVData } from './av/AVTemplate.js';
export type { LandscapeParameters, CulturalGardenData } from './landscape/LandscapeTemplate.js';
export type { StructureParameters, CulturalArchitectureData } from './structure/StructureTemplate.js';
export type { InteractiveParameters, CulturalInteractionData } from './interactive/InteractiveTemplate.js';
export type { CelebratoryParameters, CulturalCelebrationData } from './celebratory/CelebratoryTemplate.js';
export { createTestClimateSystem } from './climate/ClimateTemplate.js';
export { createTestSecuritySystem } from './security/SecurityTemplate.js';
export { createTestAVSystem } from './av/AVTemplate.js';
export { createTestLandscape } from './landscape/LandscapeTemplate.js';
export { createTestStructure } from './structure/StructureTemplate.js';
export { createTestInteractiveExperience } from './interactive/InteractiveTemplate.js';
export { createTestQuinceañera, createTestBarMitzvah, createTestDoljanchi } from './celebratory/CelebratoryTemplate.js';
export declare const FURNITURE_TEMPLATES: readonly ["chair", "dining-table", "coffee-table", "side-table"];
export declare const SYSTEM_TEMPLATES: readonly ["lighting-system", "floral-arrangement", "stage-system", "climate-control", "security-system", "av-system", "landscape-design", "architectural-structure", "interactive-experience", "celebratory-props"];
export declare const ALL_TEMPLATES: readonly ["chair", "dining-table", "coffee-table", "side-table", "lighting-system", "floral-arrangement", "stage-system", "climate-control", "security-system", "av-system", "landscape-design", "architectural-structure", "interactive-experience", "celebratory-props"];
export declare const TEMPLATE_METADATA: {
    readonly chair: {
        readonly category: "furniture";
        readonly name: "Chair Template";
        readonly description: "Parametric chair generation with cultural adaptation";
        readonly complexity: "basic";
        readonly culturalSupport: readonly ["japanese", "scandinavian", "italian", "modern"];
    };
    readonly 'dining-table': {
        readonly category: "furniture";
        readonly name: "Dining Table Template";
        readonly description: "Family dining tables with cultural proportions";
        readonly complexity: "basic";
        readonly culturalSupport: readonly ["japanese", "scandinavian", "italian", "modern"];
    };
    readonly 'coffee-table': {
        readonly category: "furniture";
        readonly name: "Coffee Table Template";
        readonly description: "Casual tables for social gatherings";
        readonly complexity: "basic";
        readonly culturalSupport: readonly ["japanese", "scandinavian", "italian", "modern"];
    };
    readonly 'side-table': {
        readonly category: "furniture";
        readonly name: "Side Table Template";
        readonly description: "Accent tables for functional placement";
        readonly complexity: "basic";
        readonly culturalSupport: readonly ["japanese", "scandinavian", "italian", "modern"];
    };
    readonly 'lighting-system': {
        readonly category: "system";
        readonly name: "Lighting System Template";
        readonly description: "Comprehensive lighting design for events";
        readonly complexity: "advanced";
        readonly culturalSupport: readonly ["japanese", "scandinavian", "italian", "modern"];
    };
    readonly 'floral-arrangement': {
        readonly category: "system";
        readonly name: "Floral Arrangement Template";
        readonly description: "Cultural floral designs and arrangements";
        readonly complexity: "intermediate";
        readonly culturalSupport: readonly ["japanese", "scandinavian", "italian", "modern"];
    };
    readonly 'stage-system': {
        readonly category: "system";
        readonly name: "Stage System Template";
        readonly description: "Performance and presentation infrastructure";
        readonly complexity: "advanced";
        readonly culturalSupport: readonly ["japanese", "scandinavian", "italian", "modern"];
    };
    readonly 'climate-control': {
        readonly category: "system";
        readonly name: "Climate Control Template";
        readonly description: "HVAC, weather protection, and comfort systems";
        readonly complexity: "expert";
        readonly culturalSupport: readonly ["japanese", "scandinavian", "italian", "modern", "traditional"];
    };
    readonly 'security-system': {
        readonly category: "system";
        readonly name: "Security & Safety Template";
        readonly description: "Access control, surveillance, and emergency systems";
        readonly complexity: "expert";
        readonly culturalSupport: readonly ["japanese", "scandinavian", "italian", "modern", "international"];
    };
    readonly 'av-system': {
        readonly category: "system";
        readonly name: "Audio/Visual Technology Template";
        readonly description: "Sound, video, and presentation technology systems";
        readonly complexity: "expert";
        readonly culturalSupport: readonly ["japanese", "scandinavian", "italian", "modern", "international"];
    };
    readonly 'landscape-design': {
        readonly category: "system";
        readonly name: "Landscape Design Template";
        readonly description: "Garden design, plant selection, and landscape architecture";
        readonly complexity: "expert";
        readonly culturalSupport: readonly ["japanese", "scandinavian", "italian", "french", "english", "modern"];
    };
    readonly 'architectural-structure': {
        readonly category: "system";
        readonly name: "Architectural Structure Template";
        readonly description: "Pavilions, pergolas, gazebos, and architectural elements";
        readonly complexity: "expert";
        readonly culturalSupport: readonly ["japanese", "scandinavian", "italian", "modern", "traditional"];
    };
    readonly 'interactive-experience': {
        readonly category: "system";
        readonly name: "Interactive Experience Template";
        readonly description: "Digital art, immersive installations, and interactive technology";
        readonly complexity: "expert";
        readonly culturalSupport: readonly ["japanese", "scandinavian", "italian", "modern", "universal"];
    };
    readonly 'celebratory-props': {
        readonly category: "system";
        readonly name: "Celebratory Props & Themed Decorations Template";
        readonly description: "Cultural celebration systems including quinceañera, bar/bat mitzvah, doljanchi, and themed party decorations";
        readonly complexity: "expert";
        readonly culturalSupport: readonly ["mexican", "jewish", "korean", "american", "japanese", "italian", "modern", "multi-cultural"];
    };
};
export declare function getTemplatesByCategory(category: 'furniture' | 'system'): string[];
export declare function getSupportedCultures(templateKey: string): readonly ["japanese", "scandinavian", "italian", "modern"] | readonly ["japanese", "scandinavian", "italian", "modern", "traditional"] | readonly ["japanese", "scandinavian", "italian", "modern", "international"] | readonly ["japanese", "scandinavian", "italian", "french", "english", "modern"] | readonly ["japanese", "scandinavian", "italian", "modern", "universal"] | readonly ["mexican", "jewish", "korean", "american", "japanese", "italian", "modern", "multi-cultural"];
export declare const COMPLEXITY_LEVELS: {
    readonly basic: {
        readonly description: "Simple parametric generation with basic cultural adaptation";
        readonly skillLevel: "Beginner";
        readonly estimatedTime: "< 5 minutes";
    };
    readonly intermediate: {
        readonly description: "Moderate complexity with cultural research integration";
        readonly skillLevel: "Intermediate";
        readonly estimatedTime: "5-15 minutes";
    };
    readonly advanced: {
        readonly description: "Complex systems with multiple integration points";
        readonly skillLevel: "Advanced";
        readonly estimatedTime: "15-30 minutes";
    };
    readonly expert: {
        readonly description: "Professional-grade systems requiring domain expertise";
        readonly skillLevel: "Expert";
        readonly estimatedTime: "30+ minutes";
    };
    readonly orchestration: {
        readonly description: "Master-level orchestration of multiple templates and systems";
        readonly skillLevel: "Master";
        readonly estimatedTime: "45+ minutes";
    };
};
export { EventOrchestrationMaster } from '../orchestration/EventOrchestrationMaster';
export type { EventOrchestrationParameters, OrchestrationResult } from '../orchestration/EventOrchestrationMaster';
export { CulturalAnalyzer, SpatialPlanner, ExperienceDesigner, QualityValidator } from '../orchestration/OrchestrationUtils';
//# sourceMappingURL=index.d.ts.map