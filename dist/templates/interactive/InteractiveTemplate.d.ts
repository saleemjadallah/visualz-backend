import * as THREE from 'three';
export interface InteractiveParameters {
    experienceType: 'digital-art' | 'interactive-installation' | 'immersive-environment' | 'gamified-experience' | 'educational-journey';
    interactionModel: 'touch' | 'gesture' | 'voice' | 'movement' | 'biometric' | 'multi-modal';
    scalability: 'individual' | 'small-group' | 'crowd' | 'massive-multiplayer';
    primaryTechnology: 'projection-mapping' | 'led-displays' | 'holographic' | 'augmented-reality' | 'virtual-reality' | 'mixed-reality';
    sensorSystems: string[];
    processingPower: 'basic' | 'professional' | 'enterprise' | 'supercomputing';
    networkRequirements: 'offline' | 'local' | 'cloud-connected' | 'edge-computing';
    culture: 'japanese' | 'scandinavian' | 'italian' | 'modern' | 'universal';
    culturalNarratives: string[];
    traditionModernBalance: number;
    culturalSensitivity: 'high' | 'moderate' | 'flexible';
    participantProfile: 'children' | 'adults' | 'seniors' | 'mixed-age' | 'accessibility-focused';
    experienceDuration: number;
    learningObjectives: string[];
    emotionalJourney: string[];
    spaceRequirements: {
        width: number;
        depth: number;
        height: number;
        clearZones: number[];
    };
    environmentalConditions: 'indoor' | 'outdoor' | 'variable' | 'extreme';
    powerRequirements: number;
    storyElements: string[];
    interactiveContent: string[];
    personalizedExperience: boolean;
    dataCollection: 'none' | 'anonymous' | 'aggregate' | 'personalized';
    accessibilityFeatures: string[];
    multilingualSupport: boolean;
    adaptiveInterfaces: boolean;
    inclusiveDesign: boolean;
    sustainableTechnology: boolean;
    ethicalDataUse: boolean;
    environmentalImpact: 'minimal' | 'moderate' | 'neutral' | 'positive';
    digitalWellbeing: boolean;
    budget: number;
    developmentTimeframe: number;
    maintenanceLevel: 'self-service' | 'minimal' | 'regular' | 'intensive';
    updateFrequency: 'static' | 'periodic' | 'dynamic' | 'real-time';
}
export interface CulturalInteractionData {
    philosophy: string;
    interactionPrinciples: {
        social: string[];
        technology: string[];
        learning: string[];
        participation: string[];
    };
    traditionalElements: {
        narratives: {
            [narrative: string]: string;
        };
        symbols: {
            [symbol: string]: string;
        };
        rituals: {
            [ritual: string]: string;
        };
        values: {
            [value: string]: string;
        };
    };
    modernAdaptations: {
        digitalIntegration: string[];
        technologyApproach: string[];
        innovationBalance: string[];
    };
    culturalConsiderations: {
        privacy: string;
        hierarchy: string;
        participation: string;
        feedback: string;
    };
    designAesthetics: {
        visualStyle: string[];
        colorPalettes: string[];
        typography: string[];
        soundscape: string[];
    };
}
export declare class InteractiveTemplate {
    private culturalData;
    private technologySpecs;
    private interactionPatterns;
    private accessibilityStandards;
    constructor();
    generateInteractiveExperience(parameters: InteractiveParameters): THREE.Group;
    private initializeCulturalData;
    private generateDisplaySystems;
    private createProjectionMappingSystem;
    private generateSensorSystems;
    private generateProcessingCore;
    private calculateParticipantCapacity;
    private designExperienceArchitecture;
    private integrateCulturalNarrative;
    private generateUserInterfaces;
    private addCulturalInteractiveElements;
    private generateContentSystems;
    private generateAccessibilityFeatures;
    private generateLearningFeedbackSystems;
    private applyInteractiveAesthetics;
    private calculateInteractiveAuthenticity;
    private calculateAccessibilityScore;
    private calculateEngagementPotential;
    private initializeTechnologySpecs;
    private initializeInteractionPatterns;
    private initializeAccessibilityStandards;
}
export declare function createTestInteractiveExperience(): THREE.Group;
//# sourceMappingURL=InteractiveTemplate.d.ts.map