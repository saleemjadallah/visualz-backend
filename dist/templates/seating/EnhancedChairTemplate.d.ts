import * as THREE from 'three';
import { ParametricParameters, ParametricTemplate, FurnitureMetadata, CulturalProportions, CultureType, MaterialType } from '../../types/index';
export interface ChairParameters extends Partial<ParametricParameters> {
    culture: 'japanese' | 'scandinavian' | 'italian' | 'french' | 'modern';
    targetAge: 'toddler' | 'child' | 'adult' | 'elderly';
    ergonomicProfile: 'petite' | 'average' | 'tall' | 'accessible';
    formality: 'casual' | 'semi-formal' | 'formal' | 'ceremonial';
    comfort: 'firm' | 'medium' | 'plush';
    primaryMaterial: MaterialType;
    upholsteryMaterial?: 'fabric-cotton' | 'fabric-linen' | 'leather' | 'none';
    colorPalette: string[];
    decorativeIntensity: number;
    includeArmrests: boolean;
}
export interface CulturalChairData {
    baseHeight: number;
    proportions: {
        widthToHeightRatio: number;
        depthToHeightRatio: number;
        backrestHeightRatio: number;
        legThicknessRatio: number;
    };
    styleElements: {
        legStyle: 'straight' | 'tapered' | 'cylindrical' | 'turned' | 'cabriole';
        backStyle: 'straight' | 'curved' | 'ergonomic' | 'minimal' | 'bergere';
        seatStyle: 'flat' | 'contoured' | 'padded';
        edgeStyle: 'sharp' | 'rounded' | 'beveled';
    };
    materials: {
        preferred: string[];
        traditional: string[];
        finishes: string[];
    };
    details: {
        joinery: 'mortise-tenon' | 'dowel' | 'screw' | 'bracket' | 'french-traditional';
        hardware: 'hidden' | 'minimal' | 'decorative' | 'industrial' | 'bronze-traditional';
        ornamentation: 'none' | 'subtle' | 'moderate' | 'ornate' | 'savoir-vivre';
    };
    savoirVivre?: {
        conversationAngle: number;
        socialDistance: number;
        formalityAdjustment: number;
    };
}
export declare class EnhancedChairTemplate implements ParametricTemplate {
    private culturalData;
    private ageAdjustments;
    private safetyRules;
    private culturalDB;
    constructor();
    generateGeometry(parameters: ParametricParameters): THREE.Group;
    generateChair(parameters: ChairParameters): THREE.Group;
    private initializeCulturalData;
    private initializeAgeAdjustments;
    private initializeSafetyRules;
    private convertToChairParameters;
    private validateAndAdjustParameters;
    private calculateDimensions;
    private generateSeat;
    private generateBackrest;
    private generateLegs;
    private generateArmrests;
    private addCulturalDetails;
    private createFrenchPaddedSeat;
    private createBergereBackrest;
    private createCabrioleLeg;
    private createFrenchArmrestGeometry;
    private createFrenchSavoirVivreDetails;
    private createContouredSeat;
    private createTurnedLeg;
    private calculateLegPositions;
    private getCulturalBackAngle;
    private addSafetyRounding;
    private createBambooAccents;
    private createJoineryDetails;
    private createCarvedDetails;
    private createCushionElements;
    private createCurvedBackrest;
    private createErgonomicBackrest;
    private createPaddedSeat;
    private applyMaterials;
    private createWoodMaterial;
    private createUpholsteryMaterial;
    private createAccentMaterial;
    private calculateAuthenticityScore;
    generateMetadata(parameters: ParametricParameters): FurnitureMetadata;
    getCulturalProportions(culture: CultureType): CulturalProportions;
    validateParameters(parameters: ParametricParameters): boolean;
    private getCulturalSignificance;
    private getUsageGuidelines;
    private getMaintenanceInstructions;
    private estimateCost;
}
export declare function createEnhancedTestChair(): THREE.Group;
//# sourceMappingURL=EnhancedChairTemplate.d.ts.map