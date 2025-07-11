export { ChairTemplate } from './seating/ChairTemplate';
export { EnhancedChairTemplate } from './seating/EnhancedChairTemplate';
export { TableTemplate } from './tables/TableTemplate';
export { EnhancedTableTemplate } from './tables/EnhancedTableTemplate';
export { EnhancedPlaygroundTemplate } from './playground/EnhancedPlaygroundTemplate';
export { LightingTemplate } from './lighting/LightingTemplate';
export { FloralTemplate } from './floral/FloralTemplate';
export { StageTemplate } from './stage/StageTemplate';
export { ClimateTemplate } from './climate/ClimateTemplate';
export { SecurityTemplate } from './security/SecurityTemplate';
export { AVTemplate } from './av/AVTemplate';
export { LandscapeTemplate } from './landscape/LandscapeTemplate';
export { StructureTemplate } from './structure/StructureTemplate';
export { InteractiveTemplate } from './interactive/InteractiveTemplate';
export type { ClimateParameters, CulturalClimateData } from './climate/ClimateTemplate';
export type { SecurityParameters, CulturalSecurityData } from './security/SecurityTemplate';
export type { AVParameters, CulturalAVData } from './av/AVTemplate';
export type { LandscapeParameters, CulturalGardenData } from './landscape/LandscapeTemplate';
export type { StructureParameters, CulturalArchitectureData } from './structure/StructureTemplate';
export type { InteractiveParameters, CulturalInteractionData } from './interactive/InteractiveTemplate';
export { createTestClimateSystem } from './climate/ClimateTemplate';
export { createTestSecuritySystem } from './security/SecurityTemplate';
export { createTestAVSystem } from './av/AVTemplate';
export { createTestLandscape } from './landscape/LandscapeTemplate';
export { createTestStructure } from './structure/StructureTemplate';
export { createTestInteractiveExperience } from './interactive/InteractiveTemplate';
export declare const FURNITURE_TEMPLATES: readonly ["chair", "dining-table", "coffee-table", "side-table"];
export declare const SYSTEM_TEMPLATES: readonly ["lighting-system", "floral-arrangement", "stage-system", "climate-control", "security-system", "av-system", "landscape-design", "architectural-structure", "interactive-experience"];
export declare const ALL_TEMPLATES: readonly ["chair", "dining-table", "coffee-table", "side-table", "lighting-system", "floral-arrangement", "stage-system", "climate-control", "security-system", "av-system", "landscape-design", "architectural-structure", "interactive-experience"];
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
};
export declare function getTemplatesByCategory(category: 'furniture' | 'system'): string[];
export declare function getSupportedCultures(templateKey: string): readonly ["japanese", "scandinavian", "italian", "modern"] | readonly ["japanese", "scandinavian", "italian", "modern", "traditional"] | readonly ["japanese", "scandinavian", "italian", "modern", "international"] | readonly ["japanese", "scandinavian", "italian", "french", "english", "modern"] | readonly ["japanese", "scandinavian", "italian", "modern", "universal"];
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
};
//# sourceMappingURL=index.d.ts.map