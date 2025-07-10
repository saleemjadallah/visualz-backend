import * as THREE from 'three';
import { ParametricParameters, ParametricTemplate, FurnitureMetadata, CulturalProportions, CultureType } from '../../types/index';
export interface TableParameters extends Partial<ParametricParameters> {
    tableType: 'dining' | 'coffee' | 'side' | 'serving' | 'ceremonial';
    culture: 'japanese' | 'scandinavian' | 'italian' | 'french' | 'modern';
    capacity: number;
    primaryUse: 'dining' | 'serving' | 'display' | 'ceremony' | 'work' | 'salon-conversation';
    width?: number;
    depth?: number;
    height?: number;
    formality: 'casual' | 'semi-formal' | 'formal' | 'ceremonial';
    legStyle: 'four-leg' | 'pedestal' | 'trestle' | 'floating' | 'cabriole' | 'bergere-support' | 'salon-style';
    topMaterial: 'wood-oak' | 'wood-cherry' | 'wood-bamboo' | 'wood-walnut' | 'glass' | 'stone' | 'marble';
    baseMaterial: 'wood-oak' | 'wood-cherry' | 'wood-walnut' | 'metal-brass' | 'metal-steel' | 'bronze-patina';
    colorPalette: string[];
    decorativeIntensity: number;
    includeStorage: boolean;
    weatherResistant: boolean;
}
export interface CulturalTableData {
    baseHeight: number;
    proportions: {
        lengthToWidthRatio: number;
        legThicknessRatio: number;
        topThicknessRatio: number;
        overhangRatio: number;
    };
    styleElements: {
        topShape: 'rectangular' | 'oval' | 'round' | 'irregular' | 'elegant-oval';
        legConfiguration: 'corner' | 'inset' | 'central' | 'trestle' | 'salon-style';
        edgeProfile: 'square' | 'rounded' | 'beveled' | 'live-edge' | 'french-molded';
        supportStyle: 'minimal' | 'substantial' | 'decorative' | 'architectural' | 'salon-elegant';
    };
    culturalFeatures: {
        ceremonies: string[];
        seasonalElements: string[];
        traditionalUses: string[];
        socialArrangements: string[];
    };
    savoirVivre?: {
        conversationHeight: number;
        socialProximity: number;
        ceremonialSpacing: number;
        eleganceFactors: string[];
    };
}
export declare class EnhancedTableTemplate implements ParametricTemplate {
    private culturalData;
    private capacityCalculations;
    private materialProperties;
    private culturalDB;
    constructor();
    generateGeometry(parameters: ParametricParameters): THREE.Group;
    generateTable(parameters: TableParameters): THREE.Group;
    private mapLegConfiguration;
    private initializeCulturalData;
    private initializeCapacityCalculations;
    private initializeMaterialProperties;
    private convertToTableParameters;
    private calculateOptimalDimensions;
    private validateCulturalParameters;
    private generateTabletop;
    private createRectangularTop;
    private createFrenchElegantOval;
    private createFrenchMoldedTop;
    private createRoundedRectangularTop;
    private createBeveledRectangularTop;
    private createLiveEdgeTop;
    private createOvalTop;
    private createRoundTop;
    private generateTableBase;
    private createFourLegBase;
    private createFrenchSalonBase;
    private createCabrioleTableBase;
    private createFrenchSalonLeg;
    private createCabrioleTableLeg;
    private createPedestalBase;
    private createTrestleBase;
    private createTrestleSupport;
    private createDecorativeLeg;
    private calculateLegPositions;
    private generateSupports;
    private createTableAprons;
    private generateStorage;
    private addCulturalTableElements;
    private createFrenchSavoirVivreTableElements;
    private createTeaCeremonyElements;
    private createJapaneseAccents;
    private createScandinavianAccents;
    private createItalianAccents;
    private applyTableMaterials;
    private createTopMaterial;
    private createBaseMaterial;
    private createStorageMaterial;
    private createAccentMaterial;
    private calculateTableAuthenticity;
    generateMetadata(parameters: ParametricParameters): FurnitureMetadata;
    getCulturalProportions(culture: CultureType): CulturalProportions;
    validateParameters(parameters: ParametricParameters): boolean;
    private getCulturalSignificance;
    private getUsageGuidelines;
    private getMaintenanceInstructions;
    private estimateCost;
}
export declare function createEnhancedTestTable(): THREE.Group;
//# sourceMappingURL=EnhancedTableTemplate.d.ts.map