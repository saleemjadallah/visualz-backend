/**
 * AI-Three.js Integration Service
 * Connects OpenAI responses with parametric Three.js template generation
 */
import * as THREE from 'three';
interface AIDesignResponse {
    spatial_layout: SpatialLayout;
    furniture_specifications: FurnitureSpec[];
    lighting_design: LightingDesign;
    cultural_elements: CulturalElement[];
    material_palette: MaterialPalette;
    budget_breakdown: BudgetBreakdown;
    accessibility_features: AccessibilityFeature[];
    three_js_scene_code: string;
    parametric_generation_params: ParametricParams;
}
interface SpatialLayout {
    dimensions: {
        width: number;
        height: number;
        depth: number;
    };
    zones: Zone[];
    traffic_pathways: PathwaySpec[];
    cultural_orientations: CulturalOrientation[];
}
interface FurnitureSpec {
    type: 'chair' | 'table' | 'lighting' | 'decorative' | 'structure' | 'celebratory-props' | 'balloon-system' | 'photo-backdrop' | 'ceremonial-element' | 'interactive-prop' | 'gift-display';
    template: string;
    parameters: Record<string, any>;
    position: {
        x: number;
        y: number;
        z: number;
    };
    rotation: {
        x: number;
        y: number;
        z: number;
    };
    cultural_significance: string;
    accessibility_features: string[];
    budget_tier: 'essential' | 'enhanced' | 'premium' | 'luxury';
}
interface ParametricParams {
    templates_to_use: string[];
    cultural_adaptations: Record<string, any>;
    accessibility_modifications: Record<string, any>;
    budget_constraints: Record<string, any>;
}
export declare class AIThreeJSIntegrationService {
    private chairTemplate;
    private tableTemplate;
    private lightingTemplate;
    private playgroundTemplate;
    private landscapeTemplate;
    private structureTemplate;
    private interactiveTemplate;
    private celebratoryTemplate;
    private quinceañeraTemplate;
    private barBatMitzvahTemplate;
    private koreanDoljanchTemplate;
    constructor();
    private initializeTemplates;
    /**
     * Main integration method: converts AI response to Three.js scene
     */
    generateThreeJSScene(aiResponse: AIDesignResponse): Promise<THREE.Group>;
    /**
     * Generate parametric furniture using AI specifications
     */
    private generateParametricFurniture;
    /**
     * Generate chair using AI parameters and parametric template
     */
    private generateChairFromAI;
    /**
     * Generate table using AI parameters and parametric template
     */
    private generateTableFromAI;
    /**
     * Generate lighting using AI parameters
     */
    private generateLightingFromAI;
    /**
     * Generate structural elements using AI parameters
     */
    private generateStructureFromAI;
    /**
     * Generate celebratory props system using AI parameters
     */
    private generateCelebratoryPropsFromAI;
    /**
     * Generate balloon system using AI parameters
     */
    private generateBalloonSystemFromAI;
    /**
     * Generate photo backdrop using AI parameters
     */
    private generatePhotoBackdropFromAI;
    /**
     * Generate ceremonial element using AI parameters
     */
    private generateCeremonialElementFromAI;
    /**
     * Generate interactive prop using AI parameters
     */
    private generateInteractivePropFromAI;
    /**
     * Generate gift display using AI parameters
     */
    private generateGiftDisplayFromAI;
    private createBalloonArch;
    private createBalloonColumns;
    private createBalloonCloud;
    private getThemeBackgroundColor;
    private getCulturalColor;
    private createBackdropDecorations;
    private createSuperheroDecorations;
    private createPrincessDecorations;
    private createCulturalDecorations;
    private createMexicanDecorations;
    private createKoreanDecorations;
    private createJewishDecorations;
    private createCulturalBalloonDisplay;
    private createStandardBalloonArrangement;
    private createCulturalAltar;
    private createCeremonialThrone;
    private createBlessingTable;
    private createMemoryDisplay;
    private createCakeDisplay;
    private createGenericCeremonialElement;
    private createCulturalPinata;
    private createActivityStation;
    private createGameArea;
    private createCraftTable;
    private createMusicStation;
    private createGenericInteractiveProp;
    private createGiftTable;
    private createGiftTree;
    private createGiftWallDisplay;
    private createGiftBasket;
    private createStandardGiftDisplay;
    /**
     * Create spatial structure and boundaries
     */
    private createSpatialStructure;
    /**
     * Generate comprehensive lighting system
     */
    private generateLightingSystem;
    /**
     * Generate cultural elements and decorations
     */
    private generateCulturalElements;
    /**
     * Generate accessibility features
     */
    private generateAccessibilityFeatures;
    /**
     * Apply material palette throughout the scene
     */
    private applyMaterialPalette;
    /**
     * Setup interaction handlers for drag-and-drop functionality
     */
    private setupInteractionHandlers;
    /**
     * Add comprehensive metadata for editor integration
     */
    private addSceneMetadata;
    /**
     * Helper methods
     */
    private mapBudgetTierToNumber;
    private createZoneMarker;
    private createPathwayMarker;
    private createCulturalElement;
    private createWheelchairPath;
    private createVisualAid;
    private createAudioSystemIndicator;
    private getEditableElements;
}
interface Zone {
    type: string;
    purpose: string;
    center: {
        x: number;
        z: number;
    };
    color?: number;
}
interface PathwaySpec {
    type: string;
    width: number;
    length: number;
    center: {
        x: number;
        z: number;
    };
    accessibility: boolean;
}
interface CulturalOrientation {
    direction: string;
    significance: string;
    requirements: string[];
}
interface LightingDesign {
    ambient: {
        color: number;
        intensity: number;
    };
    directional: {
        color: number;
        intensity: number;
        position: {
            x: number;
            y: number;
            z: number;
        };
    };
    spots?: Array<{
        color: number;
        intensity: number;
        distance: number;
        angle: number;
        penumbra: number;
        position: {
            x: number;
            y: number;
            z: number;
        };
        target: {
            x: number;
            y: number;
            z: number;
        };
    }>;
}
interface CulturalElement {
    type: string;
    culture: string;
    cultural_meaning: string;
    usage_guidelines: string[];
    position: {
        x: number;
        y: number;
        z: number;
    };
}
interface MaterialPalette {
    primary: number;
    secondary: number;
    accent: number;
    neutral: number;
    textures: string[];
}
interface BudgetBreakdown {
    total: number;
    categories: Record<string, number>;
    priorities: string[];
}
interface AccessibilityFeature {
    type: string;
    purpose: string;
    dimensions: {
        width: number;
        length: number;
        height?: number;
    };
    guidelines: string[];
    coverage?: number;
}
export default AIThreeJSIntegrationService;
//# sourceMappingURL=AIThreeJSIntegrationService.d.ts.map