import * as THREE from 'three';
export interface StageParameters {
    performanceType: 'live-music' | 'dj-set' | 'speaker' | 'ceremony' | 'presentation';
    audienceSize: number;
    interactionLevel: 'performance-only' | 'some-interaction' | 'high-interaction';
    audioRequirements: 'basic' | 'professional' | 'audiophile' | 'silent';
    visualRequirements: 'minimal' | 'standard' | 'spectacular' | 'immersive';
    lightingIntegration: boolean;
    culture: 'japanese' | 'scandinavian' | 'italian' | 'french' | 'modern' | 'traditional';
    ceremony: boolean;
    traditionalElements: string[];
    spaceDimensions: {
        width: number;
        depth: number;
        maxHeight: number;
    };
    budget: number;
    setupTime: number;
    weatherProtection: boolean;
    accessibilityRequired: boolean;
    multilingual: boolean;
    hearingAssistance: boolean;
    visualAssistance: boolean;
}
export interface PerformanceSpecs {
    idealWidth: number;
    idealDepth: number;
    idealHeight: number;
    viewingAngle: number;
    technical: string[];
    power: number;
    acoustics: string[];
}
export interface CulturalStagingData {
    philosophy: string;
    adaptations: string[];
    traditionalElements: string[];
    colorPalette: string[];
    spatialPrinciples: string[];
    ceremonyRequirements?: string[];
}
export declare class StageTemplate {
    private performanceSpecs;
    private culturalStagingTraditions;
    private technicalRequirements;
    constructor();
    generateStageSystem(parameters: StageParameters): THREE.Group;
    private calculateStageRequirements;
    private generateMainStage;
    private createAccessibleRamp;
    private createRampHandrails;
    private createStageSteps;
    private createSafetyBarriers;
    private createBarrierSegment;
    private generateAudioSystem;
    private createSpeakerSystem;
    private createMainSpeaker;
    private createSubwoofer;
    private createMonitorSpeakers;
    private createMicrophoneSystem;
    private createPodium;
    private createMicrophoneStand;
    private createMixingConsole;
    private createHearingAssistanceSystem;
    private generateVisualSystem;
    private createProjectionScreen;
    private createProjector;
    private createLEDDisplays;
    private generateStageLighting;
    private createStageWashLights;
    private createWashLight;
    private createSpotLights;
    private createSpotlight;
    private createLightingTruss;
    private addCulturalStageElements;
    private createToriiGate;
    private createTatamiStaging;
    private createClassicalColumns;
    private generateAccessibilityFeatures;
    private createInterpreterPlatform;
    private createAccessibleSeatingMarkers;
    private applyCulturalPlatformDesign;
    private applyStageMaterials;
    private calculateStageCost;
    private initializePerformanceSpecs;
    private initializeCulturalTraditions;
    private initializeTechnicalRequirements;
}
//# sourceMappingURL=StageTemplate.d.ts.map