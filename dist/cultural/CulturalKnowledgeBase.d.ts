import { CultureType, CulturalProfile, CulturalProportions, ParametricParameters, GenerationResult, AuthenticityScore, FurnitureType, MaterialType } from '../types/index';
export declare class CulturalKnowledgeBase {
    private cultures;
    constructor();
    private initializeCulturalData;
    getCulturalProfile(culture: CultureType): CulturalProfile | undefined;
    getCulturalProportions(culture: CultureType, furnitureType: FurnitureType): CulturalProportions;
    validateCulturalAuthenticity(parameters: ParametricParameters, result: GenerationResult): AuthenticityScore;
    private adaptProportionsForFurnitureType;
    private scoreCulturalProportions;
    private scoreCulturalMaterials;
    private scoreCulturalAesthetics;
    private scoreCulturalElements;
    private scoreCulturalConstruction;
    private getExpectedDecorativeIntensity;
    isMaterialCulturallyAppropriate(material: MaterialType, culture: CultureType): boolean;
    getCulturalRecommendations(culture: CultureType): string[];
}
//# sourceMappingURL=CulturalKnowledgeBase.d.ts.map