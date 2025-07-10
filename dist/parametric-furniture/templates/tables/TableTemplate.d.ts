import * as THREE from 'three';
import { ParametricParameters, ParametricTemplate, FurnitureMetadata, CulturalProportions, CultureType } from '../../types/index';
export declare class TableTemplate implements ParametricTemplate {
    private culturalDB;
    constructor();
    generateGeometry(parameters: ParametricParameters): THREE.Group;
    private generateTableTop;
    private generateTableLegs;
    private generateSupports;
    private addCulturalTableElements;
    private createJapaneseTableTop;
    private createScandinavianTableTop;
    private createItalianTableTop;
    private createFrenchTableTop;
    private createModernTableTop;
    private determineLegConfiguration;
    private createCulturalLegGeometry;
    private createTurnedLegGeometry;
    private createPedestalGeometry;
    private calculateFourLegPositions;
    private createGrainDetails;
    private createMinimalDetails;
    private createLuxuryDetails;
    private createElegantDetails;
    generateMetadata(parameters: ParametricParameters): FurnitureMetadata;
    getCulturalProportions(culture: CultureType): CulturalProportions;
    validateParameters(parameters: ParametricParameters): boolean;
    private getTableTypeName;
    private getCulturalSignificance;
    private getUsageGuidelines;
    private getMaintenanceInstructions;
    private estimateCost;
}
//# sourceMappingURL=TableTemplate.d.ts.map