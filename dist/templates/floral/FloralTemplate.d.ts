import * as THREE from 'three';
export interface FloralParameters {
    culture: 'japanese' | 'scandinavian' | 'italian' | 'french' | 'modern' | 'traditional';
    eventType: 'wedding' | 'birthday' | 'corporate' | 'memorial' | 'celebration';
    formality: 'casual' | 'semi-formal' | 'formal' | 'ceremonial';
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
export interface CulturalFloralData {
    philosophy: string;
    preferredFlowers: string[];
    arrangements: string[];
    principles: string[];
    materials: string[];
    colorPhilosophy: string;
    seasonalEmphasis: boolean;
    symbolism: Record<string, string>;
}
export declare class FloralTemplate {
    private culturalFlowerData;
    private seasonalAvailability;
    private symbolismDatabase;
    constructor();
    generateFloralArrangements(parameters: FloralParameters): THREE.Group;
    private initializeCulturalData;
    private selectCulturalFlowers;
    private selectByBudgetAndScale;
    private generateCenterpieces;
    private createMainCenterpiece;
    private createIkebanaArrangement;
    private createNaturalArrangement;
    private createRenaissanceArrangement;
    private createModernArrangement;
    private createFrenchArrangement;
    private createTraditionalArrangement;
    private createBranch;
    private createMinimalFlowers;
    private createSingleFlower;
    private createWildflowerCluster;
    private createNaturalBranches;
    private createAbundantArrangement;
    private createGeometricArrangement;
    private createBalancedArrangement;
    private createSophisticatedArrangement;
    private createSilkRibbon;
    private createOliveGarland;
    private createAltarArrangement;
    private createEntranceArrangement;
    private createScatteredArrangement;
    private generateAccentArrangements;
    private createSmallAccent;
    private addCulturalFloralElements;
    private createSakuraPetals;
    private addSustainableElements;
    private createPlantedArrangement;
    private applyFloralMaterials;
    private designComposition;
    private initializeSeasonalData;
    private initializeSymbolism;
    private getSeasonalFlowers;
    private getArrangementSymbolism;
    private calculateFloralCost;
}
//# sourceMappingURL=FloralTemplate.d.ts.map