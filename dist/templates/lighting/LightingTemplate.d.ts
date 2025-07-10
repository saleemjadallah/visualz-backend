import * as THREE from 'three';
export interface LightingParameters {
    culture: 'japanese' | 'scandinavian' | 'italian' | 'french' | 'modern' | 'traditional';
    eventType: 'intimate-dinner' | 'celebration' | 'ceremony' | 'reception' | 'corporate';
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    season: 'spring' | 'summer' | 'autumn' | 'winter';
    spaceType: 'indoor' | 'outdoor' | 'covered-outdoor' | 'mixed';
    spaceDimensions: {
        width: number;
        depth: number;
        height: number;
    };
    ambiance: 'romantic' | 'energetic' | 'serene' | 'dramatic' | 'professional';
    functionality: 'task-focused' | 'ambient-only' | 'accent-heavy' | 'balanced';
    powerBudget: number;
    installationComplexity: 'simple' | 'moderate' | 'complex' | 'professional';
    weatherResistance: boolean;
    traditionalElements: string[];
    colorTemperature: 'warm' | 'neutral' | 'cool' | 'variable';
    brightness: 'dim' | 'moderate' | 'bright' | 'adaptive';
}
export interface CulturalLightingData {
    philosophy: string;
    colorTemperatureRange: [number, number];
    intensityPreference: number;
    layeringApproach: {
        ambient: number;
        task: number;
        accent: number;
        decorative: number;
    };
    traditionalElements: {
        fixtures: string[];
        materials: string[];
        patterns: string[];
        ceremonies: string[];
    };
    seasonalAdaptations: {
        [season: string]: {
            intensity: number;
            warmth: number;
            elements: string[];
        };
    };
}
export declare class LightingTemplate {
    private culturalData;
    private fixtureLibrary;
    private calculationFormulas;
    constructor();
    generateLightingSystem(parameters: LightingParameters): THREE.Group;
    private initializeCulturalData;
    private generateAmbientLayer;
    private createAmbientFixture;
    private calculateLightingRequirements;
    private calculateBaseLumens;
    private getOptimalColorTemperature;
    private getColorTemperature;
    private generateTaskLayer;
    private generateAccentLayer;
    private generateDecorativeLayer;
    private createDecorativeElement;
    private createCandle;
    private createStringLights;
    private addCulturalLightingElements;
    private createTraditionalLantern;
    private generateControlSystems;
    private createControlPanel;
    private calculateOptimalSpacing;
    private generateLightPositions;
    private generatePerimeterPositions;
    private applyLightingEffects;
    private calculatePowerConsumption;
    private calculateLightingAuthenticity;
    private designLightingLayers;
    private initializeFixtureLibrary;
    private initializeCalculationFormulas;
}
//# sourceMappingURL=LightingTemplate.d.ts.map