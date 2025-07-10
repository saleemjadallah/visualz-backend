import * as THREE from 'three';
import { ParametricParameters, ParametricTemplate, FurnitureMetadata, CulturalProportions, CultureType, MaterialType } from '../../types/index';
export interface PlaygroundParameters extends Partial<ParametricParameters> {
    targetAgeGroup: '2-5' | '5-12' | '12+' | 'mixed';
    maxCapacity: number;
    safetyStandard: 'ASTM' | 'EN1176' | 'CSA' | 'AS4685';
    equipmentTypes: PlayEquipmentType[];
    themeStyle: 'natural' | 'castle' | 'pirate' | 'space' | 'modern' | 'cultural';
    availableSpace: {
        width: number;
        depth: number;
        height?: number;
    };
    primaryMaterial: MaterialType;
    colorScheme: 'bright' | 'natural' | 'pastel' | 'themed';
    colorPalette: string[];
    accessibilityRequired: boolean;
    inclusiveDesign: boolean;
    indoorOutdoor: 'indoor' | 'outdoor' | 'covered';
    weatherResistance: boolean;
    culture?: 'japanese' | 'scandinavian' | 'italian' | 'french' | 'modern';
    culturalElements?: string[];
    culturalPlayPatterns?: {
        socialInteraction?: 'group' | 'individual' | 'mixed';
        learningStyle?: 'exploration' | 'structured' | 'creative';
        movementCulture?: 'dynamic' | 'contemplative' | 'balanced';
        seasonalPlay?: boolean;
    };
}
export type PlayEquipmentType = 'slide' | 'swing' | 'climbing-wall' | 'monkey-bars' | 'sandbox' | 'seesaw' | 'spring-rider' | 'playhouse' | 'tunnel' | 'balance-beam' | 'spinning-top' | 'trampoline';
export interface SafetyConstraints {
    maxHeight: number;
    fallZoneRadius: number;
    minimumSpacing: number;
    surfaceMaterial: string;
    requiredBarriers: boolean;
    entrapmentPrevention: {
        minOpening: number;
        maxOpening: number;
    };
    accessibilityFeatures: string[];
}
export interface PlaygroundLayout {
    zones: PlayZone[];
    pathways: PathwayDefinition[];
    safetyBarriers: BarrierDefinition[];
    fallZones: FallZoneDefinition[];
    accessPoints: AccessPointDefinition[];
}
export interface PlayZone {
    equipment: PlayEquipmentType;
    position: THREE.Vector3;
    rotation: number;
    safetyZone: THREE.Box3;
    ageGroup: string;
    capacity: number;
}
interface PathwayDefinition {
    start: THREE.Vector3;
    end: THREE.Vector3;
    width: number;
    accessible: boolean;
}
interface BarrierDefinition {
    position: THREE.Vector3;
    length: number;
    height: number;
    type: 'safety' | 'decorative';
}
interface FallZoneDefinition {
    center: THREE.Vector3;
    radius: number;
    surfaceType: string;
}
interface AccessPointDefinition {
    position: THREE.Vector3;
    type: 'ramp' | 'transfer' | 'accessible-route';
    specifications: any;
}
export declare class EnhancedPlaygroundTemplate implements ParametricTemplate {
    private safetyStandards;
    private ageGroupConstraints;
    private equipmentSpecs;
    private materialProperties;
    private culturalDB;
    constructor();
    generateGeometry(parameters: ParametricParameters): THREE.Group;
    generatePlayground(parameters: PlaygroundParameters): THREE.Group;
    private convertToPlaygroundParameters;
    private mapAgeGroup;
    private mapEquipmentTypes;
    private mapThemeStyle;
    private mapPlaygroundMaterial;
    private mapColorScheme;
    private generateCulturalPlayPatterns;
    private enhanceWithCulturalIntelligence;
    private validateCulturalPlayAuthenticity;
    private addCulturalPlayFeatures;
    private createJapanesePlayFeatures;
    private createScandinavianPlayFeatures;
    private createFrenchPlayFeatures;
    private createItalianPlayFeatures;
    private initializeSafetyStandards;
    private initializeAgeConstraints;
    private initializeEquipmentSpecs;
    private initializeMaterialProperties;
    private validateSafetyRequirements;
    private calculateMinimumSpace;
    private calculateOptimalLayout;
    private applyCulturalLayout;
    private generateMainStructure;
    private generateMainPlatform;
    private createSafePlatformGeometry;
    private generatePlayEquipment;
    private createSlide;
    private createSwing;
    private createClimbingWall;
    private createClimbingHolds;
    private createPlayhouse;
    private createSandbox;
    private createSeesaw;
    private createGenericEquipment;
    private generateSafetyFeatures;
    private createFallZoneIndicator;
    private createSafetyBarriers;
    private generatePathways;
    private generatePathwayLayout;
    private generateBarrierLayout;
    private generateAccessibilityLayout;
    private generateAccessibilityFeatures;
    private createTransferPlatform;
    private createAccessibleRamp;
    private addThemedElements;
    private createCastleTheme;
    private createPirateTheme;
    private createSpaceTheme;
    private createNaturalTheme;
    private createCulturalTheme;
    private createJapaneseThemedElements;
    private createScandinavianThemedElements;
    private createFrenchThemedElements;
    private createItalianThemedElements;
    private applyPlaygroundMaterials;
    private createSafeSurfaceMaterial;
    private createStructuralMaterial;
    private createFallZoneMaterial;
    private createSandMaterial;
    private createGeneralPlaygroundMaterial;
    generateMetadata(parameters: ParametricParameters): FurnitureMetadata;
    getCulturalProportions(culture: CultureType): CulturalProportions;
    validateParameters(parameters: ParametricParameters): boolean;
    private getCulturalSignificanceForPlayground;
    private getPlaygroundUsageGuidelines;
    private getPlaygroundMaintenanceInstructions;
    private estimatePlaygroundCost;
}
export declare function createTestPlayground(): THREE.Group;
export {};
//# sourceMappingURL=EnhancedPlaygroundTemplate.d.ts.map