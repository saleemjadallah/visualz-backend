import * as THREE from 'three';
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
export interface CulturalGardenData {
    philosophy: string;
    designPrinciples: {
        spatial: string[];
        plant: string[];
        water: string[];
        structural: string[];
    };
    symbolicElements: {
        plants: {
            [plant: string]: string;
        };
        colors: {
            [color: string]: string;
        };
        materials: {
            [material: string]: string;
        };
        arrangements: {
            [arrangement: string]: string;
        };
    };
    seasonalTraditions: {
        [season: string]: {
            plantings: string[];
            ceremonies: string[];
            maintenance: string[];
            celebrations: string[];
        };
    };
    waterPhilosophy: {
        meaning: string;
        applications: string[];
        culturalForms: string[];
    };
    maintenanceTraditions: {
        timing: string[];
        methods: string[];
        rituals: string[];
    };
}
export declare class LandscapeTemplate {
    private culturalData;
    private plantDatabase;
    private climateZones;
    private maintenanceSchedules;
    constructor();
    generateLandscape(parameters: LandscapeParameters): THREE.Group;
    private initializeCulturalData;
    private generatePlantings;
    private createSpecimenTree;
    private calculateLandscapeRequirements;
    private designGardenLayout;
    private generateHardscape;
    private generateWaterFeatures;
    private generateStructuralElements;
    private generatePathways;
    private addCulturalGardenElements;
    private generateGardenLighting;
    private generateSeasonalFeatures;
    private generateAccessibilityFeatures;
    private applyLandscapeMaterials;
    private calculateSustainabilityScore;
    private calculateGardenAuthenticity;
    private initializePlantDatabase;
    private initializeClimateZones;
    private initializeMaintenanceSchedules;
}
export declare function createTestLandscape(): THREE.Group;
//# sourceMappingURL=LandscapeTemplate.d.ts.map