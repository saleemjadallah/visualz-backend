import * as THREE from 'three';
export type FurnitureType = 'chair' | 'sofa' | 'bench' | 'dining-table' | 'coffee-table' | 'side-table' | 'cabinet' | 'shelf' | 'chest' | 'ceiling-light' | 'table-lamp' | 'floor-lamp' | 'decorative-vase' | 'plant-pot' | 'wall-art' | 'lighting-system' | 'floral-arrangement' | 'stage-system' | 'climate-control' | 'security-system' | 'av-system' | 'landscape-design' | 'architectural-structure' | 'interactive-experience';
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
export interface LightingParameters {
    culture: CultureType;
    eventType: 'intimate-dinner' | 'celebration' | 'ceremony' | 'reception' | 'corporate';
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    season: 'spring' | 'summer' | 'autumn' | 'winter';
    spaceType: 'indoor' | 'outdoor' | 'covered-outdoor' | 'mixed';
    spaceDimensions: {
        width: number;
        depth: number;
        height: number;
    };
    ambiance: 'romantic' | 'energetic' | 'serene' | 'dramatic' | 'professional';
    functionality: 'task-focused' | 'ambient-only' | 'accent-heavy' | 'balanced';
    powerBudget: number;
    installationComplexity: 'simple' | 'moderate' | 'complex' | 'professional';
    weatherResistance: boolean;
    traditionalElements: string[];
    colorTemperature: 'warm' | 'neutral' | 'cool' | 'variable';
    brightness: 'dim' | 'moderate' | 'bright' | 'adaptive';
}
export interface FloralParameters {
    culture: CultureType;
    eventType: 'wedding' | 'birthday' | 'corporate' | 'memorial' | 'celebration';
    formality: FormalityLevel;
    season: 'spring' | 'summer' | 'autumn' | 'winter';
    arrangementStyle: 'centerpiece' | 'altar' | 'entrance' | 'perimeter' | 'scattered';
    scale: 'intimate' | 'medium' | 'grand' | 'monumental';
    colorScheme: 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'natural';
    budget: number;
    venue: 'indoor' | 'outdoor' | 'mixed';
    duration: number;
    maintenance: 'low' | 'medium' | 'high';
    symbolism: string[];
    traditionalFlowers: string[];
    avoidFlowers: string[];
    localSourcing: boolean;
    sustainablePractices: boolean;
    reusability: boolean;
}
export interface StageParameters {
    performanceType: 'live-music' | 'dj-set' | 'speaker' | 'ceremony' | 'presentation';
    audienceSize: number;
    interactionLevel: 'performance-only' | 'some-interaction' | 'high-interaction';
    audioRequirements: 'basic' | 'professional' | 'audiophile' | 'silent';
    visualRequirements: 'minimal' | 'standard' | 'spectacular' | 'immersive';
    lightingIntegration: boolean;
    culture: CultureType;
    ceremony: boolean;
    traditionalElements: string[];
    spaceDimensions: {
        width: number;
        depth: number;
        maxHeight: number;
    };
    budget: number;
    setupTime: number;
    weatherProtection: boolean;
    accessibilityRequired: boolean;
    multilingual: boolean;
    hearingAssistance: boolean;
    visualAssistance: boolean;
}
export interface LandscapeParameters {
    gardenStyle: 'japanese-zen' | 'english-cottage' | 'french-formal' | 'mediterranean' | 'modern-minimalist' | 'naturalistic';
    season: 'spring' | 'summer' | 'autumn' | 'winter';
    climate: 'temperate' | 'mediterranean' | 'tropical' | 'arid' | 'continental';
    eventType: 'wedding-ceremony' | 'cocktail-reception' | 'garden-party' | 'corporate-retreat' | 'cultural-celebration';
    guestCapacity: number;
    duration: number;
    timeOfDay: 'dawn' | 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';
    spaceDimensions: {
        width: number;
        depth: number;
        totalArea: number;
        existingFeatures: string[];
    };
    topography: 'flat' | 'gentle-slope' | 'terraced' | 'hillside' | 'waterfront';
    soilConditions: 'clay' | 'sandy' | 'loam' | 'rocky' | 'wetland';
    culture: 'japanese' | 'scandinavian' | 'italian' | 'french' | 'english' | 'modern';
    formalityLevel: 'natural' | 'semi-formal' | 'formal' | 'architectural';
    maintenanceLevel: 'low' | 'moderate' | 'high' | 'professional';
    waterFeatures: boolean;
    structuralElements: boolean;
    lightingDesign: boolean;
    fragranceGarden: boolean;
    seasonalInterest: boolean;
    nativePlants: boolean;
    waterConservation: boolean;
    wildlifeHabitat: boolean;
    organicPractices: boolean;
    budget: number;
    installationTimeframe: number;
    permanentVsTemporary: 'permanent' | 'semi-permanent' | 'temporary';
    accessibilityRequired: boolean;
    symbolicPlants: string[];
    traditionalFeatures: string[];
    ceremonialSpaces: string[];
    colorSignificance: string[];
}
export interface StructureParameters {
    architecturalStyle: 'pavilion' | 'pergola' | 'gazebo' | 'temporary-building' | 'canopy-system' | 'stage-platform';
    scale: 'intimate' | 'medium' | 'grand' | 'monumental';
    permanence: 'temporary' | 'semi-permanent' | 'permanent' | 'modular';
    capacity: number;
    loadRequirements: 'light' | 'moderate' | 'heavy' | 'dynamic';
    weatherResistance: 'basic' | 'enhanced' | 'extreme' | 'all-weather';
    seismicConsiderations: boolean;
    culture: 'japanese' | 'scandinavian' | 'italian' | 'modern' | 'traditional';
    culturalElements: string[];
    symbolicMeaning: string[];
    traditionalJoinery: boolean;
    primaryFunction: 'ceremony' | 'performance' | 'gathering' | 'exhibition' | 'dining' | 'multi-purpose';
    acousticRequirements: 'natural' | 'enhanced' | 'isolated' | 'amplified';
    lightingIntegration: boolean;
    serviceIntegration: boolean;
    footprint: {
        width: number;
        depth: number;
        height: number;
        clearSpan: boolean;
    };
    orientation: number;
    siteConditions: 'level' | 'sloped' | 'irregular' | 'waterfront';
    structuralMaterial: 'wood' | 'steel' | 'concrete' | 'composite' | 'tensile' | 'hybrid';
    cladding: 'none' | 'partial' | 'full' | 'adaptive';
    roofingSystem: 'open' | 'covered' | 'retractable' | 'green-roof';
    sustainableDesign: boolean;
    energyGeneration: boolean;
    rainwaterHarvesting: boolean;
    naturalVentilation: boolean;
    budget: number;
    constructionTimeframe: number;
    siteAccess: 'excellent' | 'good' | 'limited' | 'challenging';
    permitRequirements: string[];
    smartSystems: boolean;
    adaptiveElements: boolean;
    interactiveFeatures: boolean;
    futureExpansion: boolean;
}
export interface InteractiveParameters {
    experienceType: 'digital-art' | 'interactive-installation' | 'immersive-environment' | 'gamified-experience' | 'educational-journey';
    interactionModel: 'touch' | 'gesture' | 'voice' | 'movement' | 'biometric' | 'multi-modal';
    scalability: 'individual' | 'small-group' | 'crowd' | 'massive-multiplayer';
    primaryTechnology: 'projection-mapping' | 'led-displays' | 'holographic' | 'augmented-reality' | 'virtual-reality' | 'mixed-reality';
    sensorSystems: string[];
    processingPower: 'basic' | 'professional' | 'enterprise' | 'supercomputing';
    networkRequirements: 'offline' | 'local' | 'cloud-connected' | 'edge-computing';
    culture: 'japanese' | 'scandinavian' | 'italian' | 'modern' | 'universal';
    culturalNarratives: string[];
    traditionModernBalance: number;
    culturalSensitivity: 'high' | 'moderate' | 'flexible';
    participantProfile: 'children' | 'adults' | 'seniors' | 'mixed-age' | 'accessibility-focused';
    experienceDuration: number;
    learningObjectives: string[];
    emotionalJourney: string[];
    spaceRequirements: {
        width: number;
        depth: number;
        height: number;
        clearZones: number[];
    };
    environmentalConditions: 'indoor' | 'outdoor' | 'variable' | 'extreme';
    powerRequirements: number;
    storyElements: string[];
    interactiveContent: string[];
    personalizedExperience: boolean;
    dataCollection: 'none' | 'anonymous' | 'aggregate' | 'personalized';
    accessibilityFeatures: string[];
    multilingualSupport: boolean;
    adaptiveInterfaces: boolean;
    inclusiveDesign: boolean;
    sustainableTechnology: boolean;
    ethicalDataUse: boolean;
    environmentalImpact: 'minimal' | 'moderate' | 'neutral' | 'positive';
    digitalWellbeing: boolean;
    budget: number;
    developmentTimeframe: number;
    maintenanceLevel: 'self-service' | 'minimal' | 'regular' | 'intensive';
    updateFrequency: 'static' | 'periodic' | 'dynamic' | 'real-time';
}
export type TemplateParameters = ParametricParameters | LightingParameters | FloralParameters | StageParameters | LandscapeParameters | StructureParameters | InteractiveParameters;
//# sourceMappingURL=index.d.ts.map