import { ParametricParameters, GenerationResult, UserFurnitureRequest, FurnitureType, CultureType } from '../types/index';
export declare class ParametricGenerationEngine {
    private templates;
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
}
//# sourceMappingURL=ParametricGenerationEngine.d.ts.map