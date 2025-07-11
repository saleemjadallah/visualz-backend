import * as THREE from 'three';
export interface EventOrchestrationParameters {
    eventType: 'wedding' | 'corporate' | 'birthday' | 'cultural-ceremony' | 'tea-ceremony' | 'conference' | 'exhibition' | 'gala';
    scale: 'intimate' | 'medium' | 'large' | 'grand' | 'monumental';
    duration: number;
    primaryCulture: 'japanese' | 'scandinavian' | 'italian' | 'modern' | 'french' | 'traditional';
    secondaryCultures?: string[];
    culturalFusion: boolean;
    ceremonyElements: string[];
    culturalSensitivity: 'high' | 'moderate' | 'adaptive';
    venue: {
        type: 'indoor' | 'outdoor' | 'mixed' | 'covered-outdoor';
        dimensions: {
            width: number;
            depth: number;
            height: number;
        };
        existingFeatures: string[];
        restrictions: string[];
        climate: 'controlled' | 'seasonal' | 'variable' | 'extreme';
        acoustics: 'excellent' | 'good' | 'poor' | 'challenging';
        naturalLight: 'abundant' | 'moderate' | 'limited' | 'none';
    };
    guests: {
        total: number;
        adults: number;
        children: number;
        elderly: number;
        vip: number;
        accessibility: string[];
        culturalBackgrounds: string[];
        languageSupport: string[];
    };
    atmosphere: 'formal' | 'casual' | 'ceremonial' | 'celebratory' | 'contemplative' | 'energetic' | 'intimate';
    interactionStyle: 'mingling' | 'seated' | 'activity-based' | 'ceremony-focused' | 'presentation' | 'hybrid';
    memorabilityGoals: string[];
    emotionalJourney: string[];
    technology: {
        audioVisual: boolean;
        streaming: boolean;
        recording: boolean;
        interactive: boolean;
        projection: boolean;
        lighting: 'basic' | 'professional' | 'theatrical' | 'adaptive';
    };
    timing: {
        season: 'spring' | 'summer' | 'autumn' | 'winter';
        timeOfDay: 'dawn' | 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';
        weather: 'guaranteed-good' | 'variable' | 'challenging';
    };
    budget: {
        total: number;
        breakdown: {
            furniture: number;
            staging: number;
            lighting: number;
            floral: number;
            climate: number;
            security: number;
            technology: number;
            landscape?: number;
            structure?: number;
            interactive?: number;
        };
    };
    timeline: {
        setup: number;
        breakdown: number;
        advance: number;
        rehearsal?: boolean;
    };
    sustainability: 'minimal' | 'moderate' | 'high' | 'carbon-neutral' | 'regenerative';
    localSourcing: boolean;
    culturalAuthenticity: 'modern-interpretation' | 'traditional' | 'fusion' | 'educational';
    accessibility: 'basic' | 'enhanced' | 'universal';
    security: {
        riskLevel: 'low' | 'medium' | 'high' | 'vip' | 'public-event';
        accessControl: 'open' | 'ticketed' | 'invitation-only' | 'multi-tier';
        emergencyServices: boolean;
        weatherContingency: boolean;
    };
}
export interface OrchestrationResult {
    scene: THREE.Group;
    components: {
        furniture?: THREE.Group;
        lighting?: THREE.Group;
        floral?: THREE.Group;
        stage?: THREE.Group;
        climate?: THREE.Group;
        security?: THREE.Group;
        audioVisual?: THREE.Group;
        landscape?: THREE.Group;
        structure?: THREE.Group;
        interactive?: THREE.Group;
        celebratory?: THREE.Group;
    };
    metadata: {
        templateCount: number;
        culturalAuthenticity: number;
        sustainabilityScore: number;
        accessibilityScore: number;
        experienceScore: number;
        budgetUtilization: number;
        generationTime: number;
    };
    recommendations: string[];
    culturalNotes: string[];
}
export interface TemplateRelationship {
    primary: string;
    secondary: string;
    relationship: 'complements' | 'depends-on' | 'conflicts-with' | 'enhances' | 'integrates-with';
    strength: number;
    constraints: {
        spatial?: THREE.Vector3[];
        material?: string[];
        color?: string[];
        cultural?: string[];
        timing?: string[];
    };
    adjustments: {
        scale?: number;
        position?: THREE.Vector3;
        rotation?: THREE.Euler;
        properties?: Record<string, any>;
    };
}
export interface CulturalFramework {
    primaryCulture: string;
    secondaryCultures: string[];
    fusionRules: {
        allowedCombinations: string[][];
        forbiddenCombinations: string[][];
        bridgingElements: string[];
        transitionMethods: string[];
    };
    colorHarmony: {
        primary: string[];
        secondary: string[];
        accent: string[];
        neutral: string[];
        seasonal: Record<string, string[]>;
    };
    materialCoherence: {
        traditional: string[];
        modern: string[];
        sustainable: string[];
        luxury: string[];
        structural: string[];
    };
    spatialPrinciples: {
        arrangement: 'hierarchical' | 'democratic' | 'organic' | 'geometric';
        flow: 'linear' | 'circular' | 'meandering' | 'hub-spoke';
        zones: 'separate' | 'integrated' | 'flexible' | 'ceremonial';
        intimacy: 'public' | 'semi-private' | 'private' | 'sacred';
    };
    ceremonyProtocols: {
        sequence: string[];
        roles: Record<string, string>;
        spaces: Record<string, string>;
        timing: Record<string, number>;
    };
    authenticityGuidelines: {
        mustHave: string[];
        shouldHave: string[];
        canHave: string[];
        avoid: string[];
    };
}
export declare class EventOrchestrationMaster {
    private templates;
    private relationships;
    private culturalValidator;
    private spatialOptimizer;
    private budgetOptimizer;
    private experienceEnhancer;
    constructor();
    /**
     * Master orchestration function - creates complete event environment
     */
    orchestrateEvent(parameters: EventOrchestrationParameters): Promise<OrchestrationResult>;
    /**
     * Initialize all available templates
     */
    private initializeTemplates;
    /**
     * Define sophisticated template relationships
     */
    private defineTemplateRelationships;
    /**
     * Establish comprehensive cultural framework
     */
    private establishCulturalFramework;
    /**
     * Create comprehensive master plan
     */
    private createMasterPlan;
    /**
     * Determine optimal template strategy
     */
    private determineTemplateStrategy;
    /**
     * Generate parameters for all selected templates
     */
    private generateAllTemplateParameters;
    /**
     * Orchestrate template instantiation with intelligent sequencing
     */
    private orchestrateTemplateInstantiation;
    /**
     * Integrate all templates into cohesive ecosystem
     */
    private integrateTemplateEcosystem;
    /**
     * Validate and enhance overall experience
     */
    private validateAndEnhanceExperience;
    /**
     * Assemble complete event environment
     */
    private assembleCompleteEventEnvironment;
    /**
     * Perform final quality assurance and generate recommendations
     */
    private performQualityAssurance;
    private generateChairParameters;
    private generateTableParameters;
    private generateLightingParameters;
    private determineErgonomicProfile;
    private calculateDecorativeIntensity;
    private determineCraftsmanshipLevel;
    private calculateTableWidth;
    private calculateTableDepth;
    private mapEventTypeToLighting;
    private mapAtmosphereToAmbiance;
    private determineInstallationComplexity;
    private getCulturalColorTemperature;
    private determineBrightness;
    private getRequiredTemplatesForEvent;
    private getOptionalTemplatesForEvent;
    private calculateRequiredChairs;
    private getCulturalChairHeight;
    private getCulturalTableHeight;
    private mapAtmosphereToStyle;
    private mapAtmosphereToFormality;
    private getAllowedCulturalCombinations;
    private getForbiddenCombinations;
    private getBridgingElements;
    private getTransitionMethods;
    private generateCulturalColorHarmony;
    private establishMaterialCoherence;
    private defineSpatialPrinciples;
    private loadCeremonyProtocols;
    private createAuthenticityGuidelines;
    private defineEventZones;
    private planCirculationPaths;
    private optimizeSightlines;
    private ensureAccessibility;
    private validateSafetyRequirements;
    private integrateCulturalSpatialNeeds;
    private mapUserJourney;
    private designEmotionalArc;
    private identifyCulturalMoments;
    private planPhotoOpportunities;
    private planAccessibilityTouchpoints;
    private calculatePowerRequirements;
    private planNetworkInfrastructure;
    private designAcousticEnvironment;
    private planClimateManagement;
    private designSecurityApproach;
    private createSustainabilityPlan;
    private optimizeBudgetAllocation;
    private calculateTemplatePriorities;
    private mapTemplateDependencies;
    private generateFloralParameters;
    private generateStageParameters;
    private generateClimateParameters;
    private generateSecurityParameters;
    private generateAVParameters;
    private generateLandscapeParameters;
    private generateStructureParameters;
    private generateInteractiveParameters;
    private generateCelebratoryParameters;
    private optimizeParameterCoherence;
    private calculateOptimalInstantiationOrder;
    private instantiateTemplateWithRelationships;
    private isCriticalTemplate;
    private optimizeSpatialRelationships;
    private integrateCulturalCoherence;
    private integrateTechnicalSystems;
    private optimizeExperienceFlow;
    private integrateSafetyAndAccessibility;
    private applyCulturalCorrections;
    private enhanceAccessibility;
    private optimizeSustainability;
    private addEnvironmentalEnhancements;
    private addCulturalEducationElements;
    private calculateFinalAuthenticity;
    private calculateSustainabilityScore;
    private calculateAccessibilityScore;
    private extractComponents;
    private generateRecommendations;
    private generateCulturalNotes;
    private mapEventToCelebrationType;
    private inferAgeGroupFromGuests;
    private inferThemeFromCulture;
    private mapCultureToCelebration;
    private calculateExperienceScore;
    private calculateBudgetUtilization;
}
//# sourceMappingURL=EventOrchestrationMaster.d.ts.map