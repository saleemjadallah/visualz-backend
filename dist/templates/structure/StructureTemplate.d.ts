import * as THREE from 'three';
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
export interface CulturalArchitectureData {
    philosophy: string;
    structuralPrinciples: {
        proportion: string[];
        joinery: string[];
        materials: string[];
        integration: string[];
    };
    symbolicElements: {
        forms: {
            [form: string]: string;
        };
        proportions: {
            [proportion: string]: string;
        };
        orientations: {
            [orientation: string]: string;
        };
        materials: {
            [material: string]: string;
        };
    };
    traditionalMethods: {
        construction: string[];
        joinery: string[];
        finishing: string[];
        maintenance: string[];
    };
    weatherAdaptations: {
        [climate: string]: {
            techniques: string[];
            materials: string[];
            considerations: string[];
        };
    };
    ceremonialConsiderations: {
        sacred: string[];
        social: string[];
        seasonal: string[];
    };
}
export declare class StructureTemplate {
    private culturalData;
    private structuralCalculations;
    private materialProperties;
    private buildingCodes;
    constructor();
    generateStructure(parameters: StructureParameters): THREE.Group;
    private initializeCulturalData;
    private calculateStructuralRequirements;
    private generatePrimaryStructure;
    private createCulturalColumn;
    private calculateColumnLayout;
    private generateFoundation;
    private calculateLoads;
    private adaptCulturalDesign;
    private generateSecondaryStructure;
    private generateEnclosureSystem;
    private addCulturalArchitecturalElements;
    private generateRoofingSystem;
    private generateIntegratedSystems;
    private generateStructuralAccessibility;
    private applyStructuralMaterials;
    private calculateStructuralIntegrity;
    private calculateArchitecturalAuthenticity;
    private calculateStructuralSustainability;
    private calculateMemberSizes;
    private calculateFoundationRequirements;
    private calculateMaterialRequirements;
    private planConstructionSequence;
    private createStructuralBeams;
    private initializeStructuralCalculations;
    private initializeMaterialProperties;
    private initializeBuildingCodes;
}
export declare function createTestStructure(): THREE.Group;
//# sourceMappingURL=StructureTemplate.d.ts.map