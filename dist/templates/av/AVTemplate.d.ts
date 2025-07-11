import * as THREE from 'three';
export interface AVParameters {
    presentationType: 'conference' | 'ceremony' | 'entertainment' | 'hybrid' | 'educational';
    audienceSize: number;
    venueAcoustics: 'excellent' | 'good' | 'poor' | 'challenging';
    audioQuality: 'basic' | 'professional' | 'audiophile' | 'broadcast';
    visualQuality: 'standard' | 'hd' | '4k' | 'cinema';
    interactivityLevel: 'passive' | 'interactive' | 'immersive' | 'participatory';
    culture: 'japanese' | 'scandinavian' | 'italian' | 'modern' | 'international';
    ceremonyTraditions: string[];
    languageSupport: string[];
    culturalSensitivities: string[];
    streamingRequired: boolean;
    recordingRequired: boolean;
    multilingualSupport: boolean;
    accessibilityNeeds: string[];
    spaceDimensions: {
        width: number;
        depth: number;
        height: number;
        acousticTreatment: boolean;
    };
    lightingIntegration: boolean;
    climatControlIntegration: boolean;
    securityIntegration: boolean;
    latency: 'low' | 'standard' | 'high-precision';
    redundancy: 'single' | 'backup' | 'triple-redundant';
    powerRequirements: number;
    duration: number;
    simultaneousSessions: number;
    peakConcurrency: number;
}
export interface CulturalAVData {
    philosophy: string;
    traditionalElements: {
        audio: string[];
        visual: string[];
        interaction: string[];
        ceremony: string[];
    };
    aestheticIntegration: {
        equipmentVisibility: 'hidden' | 'integrated' | 'featured';
        materialPreferences: string[];
        colorSchemes: string[];
    };
    communicationStyles: {
        formality: 'formal' | 'respectful' | 'casual';
        hierarchy: 'traditional' | 'egalitarian' | 'flexible';
        participation: string[];
    };
    technicalPreferences: {
        audioApproach: 'natural' | 'enhanced' | 'immersive';
        visualApproach: 'minimal' | 'supporting' | 'dominant';
        interactionStyle: string[];
    };
}
export declare class AVTemplate {
    private culturalData;
    private acousticCalculations;
    private equipmentSpecs;
    private accessibilityStandards;
    constructor();
    generateAVSystem(parameters: AVParameters): THREE.Group;
    private initializeCulturalData;
    private calculateAVRequirements;
    private calculateAudioRequirements;
    private generateAudioSystems;
    private createMainSpeakerArray;
    private createAudioMixingConsole;
    private getTargetSPL;
    private calculateSpeakerCoverage;
    private calculateMicrophoneCount;
    private estimateRT60;
    private getCulturalAVColor;
    private calculateVisualRequirements;
    private calculateControlRequirements;
    private calculateTotalPowerRequirements;
    private calculateNetworkRequirements;
    private designAVCoverage;
    private generateVisualSystems;
    private generateControlSystems;
    private generateAccessibilitySystems;
    private addCulturalAVElements;
    private generateStreamingInfrastructure;
    private generateIntegrationSystems;
    private applyAVAesthetics;
    private calculateCulturalAVIntegration;
    private calculateAccessibilityCompliance;
    private initializeAcousticCalculations;
    private initializeEquipmentSpecs;
    private initializeAccessibilityStandards;
}
export declare function createTestAVSystem(): THREE.Group;
//# sourceMappingURL=AVTemplate.d.ts.map