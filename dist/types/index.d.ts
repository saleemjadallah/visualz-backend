import * as THREE from 'three';
export type FurnitureType = 'chair' | 'sofa' | 'bench' | 'dining-table' | 'coffee-table' | 'side-table' | 'cabinet' | 'shelf' | 'chest' | 'ceiling-light' | 'table-lamp' | 'floor-lamp' | 'decorative-vase' | 'plant-pot' | 'wall-art';
export type CultureType = 'japanese' | 'scandinavian' | 'italian' | 'french' | 'modern';
export type MaterialType = 'wood-oak' | 'wood-pine' | 'wood-cherry' | 'wood-bamboo' | 'wood-walnut' | 'wood-mahogany' | 'fabric-cotton' | 'fabric-linen' | 'fabric-silk' | 'fabric-wool' | 'fabric-velvet' | 'fabric-brocade' | 'metal-brass' | 'metal-steel' | 'metal-copper' | 'bronze-patina' | 'leather' | 'leather-fine' | 'leather-cognac' | 'leather-burgundy' | 'ceramic' | 'glass' | 'stone' | 'marble' | 'plastic' | 'composite' | 'synthetic-materials' | 'pastel-upholstery' | 'light-cane' | 'rich-tapestry' | 'heavy-brocade';
export type StyleVariant = 'traditional' | 'contemporary' | 'rustic' | 'elegant' | 'minimalist' | 'ornate';
export type FormalityLevel = 'casual' | 'semi-formal' | 'formal' | 'ceremonial';
export interface ParametricParameters {
    type: FurnitureType;
    culture: CultureType;
    width: number;
    height: number;
    depth: number;
    style: StyleVariant;
    formality: FormalityLevel;
    primaryMaterial: MaterialType;
    secondaryMaterial?: MaterialType;
    culturalElements: string[];
    seasonalAdaptation?: 'spring' | 'summer' | 'autumn' | 'winter';
    capacity?: number;
    ergonomicProfile: 'petite' | 'average' | 'tall' | 'accessible';
    colorPalette: string[];
    decorativeIntensity: number;
    craftsmanshipLevel: 'simple' | 'refined' | 'masterwork';
}
export interface GenerationResult {
    geometry: THREE.Group;
    materials: THREE.Material[];
    metadata: FurnitureMetadata;
    culturalAuthenticity: AuthenticityScore;
    performanceMetrics: PerformanceMetrics;
}
export interface FurnitureMetadata {
    id: string;
    name: string;
    description: string;
    culturalSignificance: string;
    usageGuidelines: string[];
    maintenanceInstructions: string[];
    estimatedCost: number;
}
export interface AuthenticityScore {
    overall: number;
    proportions: number;
    materials: number;
    construction: number;
    aesthetics: number;
    culturalElements: number;
}
export interface PerformanceMetrics {
    generationTime: number;
    polygonCount: number;
    memoryUsage: number;
}
export interface CulturalProportions {
    seatHeight: number;
    tableHeight: number;
    armrestHeight: number;
    backrestAngle: number;
    legThickness: number;
    surfaceThickness: number;
}
export interface CulturalMaterials {
    preferred: MaterialType[];
    traditional: MaterialType[];
    avoided: MaterialType[];
    seasonalPreferences: Record<string, MaterialType[]>;
}
export interface CulturalAesthetics {
    colorPalette: string[];
    decorativeElements: string[];
    surfaceFinishes: string[];
    joiningMethods: string[];
    symbolism: Record<string, string>;
}
export interface CulturalErgonomics {
    floorSeating: boolean;
    formalPosture: boolean;
    groupOrientation: 'circular' | 'linear' | 'clustered' | 'conversational';
    personalSpace: number;
    savoirVivre?: {
        conversationDistance?: number;
        diningEtiquette?: boolean;
        entertainingStyle?: string;
        seasonalAdaptation?: boolean;
        artDeVivre?: boolean;
        hospitalityPrinciples?: boolean;
        intellectualExchange?: boolean;
        aestheticAppreciation?: boolean;
        socialHierarchy?: 'subtle' | 'pronounced' | 'minimal';
        intimacyLevels?: string[];
        ceremonialUse?: string[];
    };
}
export interface CulturalProfile {
    name: string;
    proportions: CulturalProportions;
    materials: CulturalMaterials;
    aesthetics: CulturalAesthetics;
    ergonomics: CulturalErgonomics;
}
export interface UserFurnitureRequest {
    eventType: string;
    culture: CultureType;
    guestCount: number;
    spaceDimensions: {
        width: number;
        height: number;
        depth: number;
    };
    budgetRange: 'low' | 'medium' | 'high' | 'luxury';
    formalityLevel: FormalityLevel;
    specialRequirements: string;
}
export interface OptimizationConstraints {
    spaceLimitations: string;
    budgetConstraints: string;
    accessibilityNeeds: string;
    culturalRequirements: string;
}
export interface LegConfiguration {
    style: 'straight' | 'tapered' | 'cylindrical' | 'turned' | 'pedestal';
    count: number;
    positions: Array<{
        x: number;
        z: number;
    }>;
}
export interface PerformanceMetric {
    timestamp: number;
    generationTime: number;
    polygonCount: number;
    memoryUsage: number;
}
export interface PerformanceReport {
    totalGenerations: number;
    averageGenerationTime: number;
    averagePolygonCount: number;
    averageMemoryUsage: number;
    byCategory: Map<string, {
        count: number;
        averageGenerationTime: number;
        averagePolygonCount: number;
        averageMemoryUsage: number;
    }>;
}
export interface ParametricTemplate {
    generateGeometry(parameters: ParametricParameters): THREE.Group;
    generateMetadata(parameters: ParametricParameters): FurnitureMetadata;
    getCulturalProportions(culture: CultureType): CulturalProportions;
    validateParameters(parameters: ParametricParameters): boolean;
}
export interface AIFurnitureAnalysis {
    furniture_pieces: Array<{
        type: FurnitureType;
        quantity: number;
        priority: 'essential' | 'important' | 'optional';
        parameters: ParametricParameters;
        cultural_reasoning: string;
        functional_reasoning: string;
    }>;
    overall_theme: string;
    cultural_authenticity_notes: string;
    ergonomic_considerations: string;
    spatial_optimization: string;
}
//# sourceMappingURL=index.d.ts.map