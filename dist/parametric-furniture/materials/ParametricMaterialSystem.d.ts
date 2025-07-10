import * as THREE from 'three';
import { MaterialType, ParametricParameters, CultureType } from '../types/index';
export declare class ParametricMaterialSystem {
    private materialCache;
    private textureLoader;
    constructor();
    getMaterial(materialType: MaterialType, parameters: ParametricParameters): THREE.Material;
    generateMaterials(parameters: ParametricParameters): THREE.Material[];
    private createMaterial;
    private createWoodMaterial;
    private createFabricMaterial;
    private createMetalMaterial;
    private createLeatherMaterial;
    private createCeramicMaterial;
    private createGlassMaterial;
    private createStoneMaterial;
    private createDefaultMaterial;
    private getCulturalColors;
    private getWoodRoughness;
    private getFabricRoughness;
    private getMetalRoughness;
    private getMetalness;
    private getCulturalMetalFinish;
    private applyCulturalFinishing;
    private applyCulturalPatterns;
    private applyCulturalGlazing;
    private addWoodGrainTexture;
    private addFabricTexture;
    private addLeatherTexture;
    private addStoneTexture;
    validateMaterial(material: THREE.Material): boolean;
    optimizeMaterial(material: THREE.Material): THREE.Material;
    private initializeMaterials;
    getCachedMaterialCount(): number;
    clearMaterialCache(): void;
    getMaterialInfo(materialType: MaterialType): {
        name: string;
        description: string;
        properties: string[];
        culturalFit: CultureType[];
    };
}
//# sourceMappingURL=ParametricMaterialSystem.d.ts.map