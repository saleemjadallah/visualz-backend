import * as THREE from 'three';
import { ParametricParameters, GenerationResult, UserFurnitureRequest, FurnitureType, CultureType, LightingParameters, FloralParameters, StageParameters } from '../types/index';
export declare class ParametricGenerationEngine {
    private templates;
    private lightingTemplate;
    private floralTemplate;
    private stageTemplate;
    private culturalDB;
    private aiAnalyzer;
    private materialSystem;
    private cache;
    private performanceMetrics;
    constructor();
    generateFurnitureFromUserInput(userInput: UserFurnitureRequest): Promise<GenerationResult[]>;
    generateSinglePiece(parameters: ParametricParameters): Promise<GenerationResult>;
    optimizeParametersInRealTime(currentParameters: ParametricParameters, userAdjustments: Partial<ParametricParameters>): Promise<ParametricParameters>;
    adjustParametersRealTime(baseParameters: ParametricParameters, adjustments: {
        [key: string]: any;
    }): ParametricParameters;
    private initializeTemplates;
    private generateCacheKey;
    private validateCulturalParameters;
    private adjustForCulturalAuthenticity;
    private applyMaterialsToGeometry;
    private generateFurnitureMetadata;
    private calculatePerformanceMetrics;
    private estimateGeometryMemoryUsage;
    private recordPerformanceMetrics;
    private calculateSpaceLimitations;
    private calculateBudgetConstraints;
    private calculateAccessibilityNeeds;
    private calculateCulturalRequirements;
    private constrainHeight;
    private constrainWidth;
    private constrainDepth;
    private calculateDecorativeIntensity;
    private generateFallbackFurniture;
    private adjustInvalidParameters;
    private ruleBasedOptimization;
    getCacheSize(): number;
    clearCache(): void;
    getPerformanceReport(): any;
    getSupportedFurnitureTypes(): FurnitureType[];
    getSupportedCultures(): CultureType[];
    generateLightingSystem(parameters: LightingParameters): Promise<THREE.Group>;
    generateFloralArrangements(parameters: FloralParameters): Promise<THREE.Group>;
    generateStageSystem(parameters: StageParameters): Promise<THREE.Group>;
    generateCompleteEventSetup(eventSpec: {
        furniture: UserFurnitureRequest;
        lighting?: LightingParameters;
        floral?: FloralParameters;
        stage?: StageParameters;
    }): Promise<{
        furniture: GenerationResult[];
        lighting?: THREE.Group;
        floral?: THREE.Group;
        stage?: THREE.Group;
        summary: {
            totalPieces: number;
            totalCost: number;
            generationTime: number;
            culturalTheme: string;
        };
    }>;
    generateFromUserInput(userInput: UserFurnitureRequest & {
        includeLighting?: boolean;
        includeFloral?: boolean;
        includeStage?: boolean;
        lightingPreferences?: Partial<LightingParameters>;
        floralPreferences?: Partial<FloralParameters>;
        stagePreferences?: Partial<StageParameters>;
    }): Promise<{
        furniture: GenerationResult[];
        lighting?: THREE.Group;
        floral?: THREE.Group;
        stage?: THREE.Group;
        summary: any;
    }>;
    private mapEventToLightingType;
    private mapEventToFloralType;
    private mapFormalityToAmbiance;
    private mapGuestCountToScale;
    private calculateFloralBudget;
    private calculateStageBudget;
}
//# sourceMappingURL=ParametricGenerationEngine.d.ts.map