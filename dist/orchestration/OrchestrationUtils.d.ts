import * as THREE from 'three';
import { OrchestrationContext, SpatialContext, QualityMetrics, Recommendation } from './OrchestrationTypes';
/**
 * Advanced Cultural Analysis and Validation
 */
export declare class CulturalAnalyzer {
    private culturalDatabase;
    private fusionRules;
    private sensitivityGuidelines;
    constructor();
    /**
     * Analyze cultural authenticity and appropriateness
     */
    analyzeCulturalAuthenticity(primaryCulture: string, secondaryCultures: string[], elements: any[]): {
        score: number;
        issues: string[];
        recommendations: string[];
    };
    /**
     * Validate cultural fusion appropriateness
     */
    validateCulturalFusion(primary: string, secondary: string[], elements: any[]): {
        score: number;
        issues: string[];
    };
    /**
     * Check for cultural appropriation risks
     */
    checkAppropriation(culture: string, elements: any[]): string[];
    private validatePrimaryCulture;
    private identifyBridgingElements;
    private generateCulturalRecommendations;
    private initializeCulturalDatabase;
    private initializeFusionRules;
    private initializeSensitivityGuidelines;
}
/**
 * Spatial Planning and Optimization
 */
export declare class SpatialPlanner {
    private gridSize;
    private culturalSpatialRules;
    constructor();
    /**
     * Generate optimal spatial layout based on cultural principles
     */
    generateSpatialLayout(dimensions: {
        width: number;
        depth: number;
        height: number;
    }, guestCount: number, eventType: string, culture: string, zones: string[]): SpatialContext;
    /**
     * Optimize spatial relationships between zones
     */
    optimizeSpatialRelationships(layout: SpatialContext, culture: string): SpatialContext;
    private generateCulturalZones;
    private calculateZoneAllocations;
    private getBaseZoneAllocations;
    private getCulturalZoneModifiers;
    private generateCirculationPaths;
    private calculatePathWidth;
    private shouldConnectZones;
    private calculateWaypoints;
    private calculateDirectPath;
    private generateSightlines;
    private calculateAcousticProperties;
    private calculateReverberation;
    private calculateAcousticSweetSpots;
    private generateAccessibilityFeatures;
    private calculateZoneCapacity;
    private getZoneCulturalSignificance;
    private calculateZoneBoundaries;
    private getZonePrivacy;
    private getZoneActivities;
    private getZoneTimeOfUse;
    private getZoneEnvironmentalNeeds;
    private getSightlineCulturalMeaning;
    private applyHierarchicalArrangement;
    private applyDemocraticArrangement;
    private optimizeCirculationForCulture;
    private initializeCulturalSpatialRules;
}
/**
 * Experience Designer - Creates memorable and culturally appropriate experiences
 */
export declare class ExperienceDesigner {
    private emotionalPatterns;
    private culturalJourneys;
    constructor();
    /**
     * Design comprehensive user experience journey
     */
    designUserJourney(eventType: string, culture: string, duration: number, zones: any[]): any;
    private createJourneyPhases;
    private getBaseJourneyPhases;
    private identifyTouchpoints;
    private mapZoneToPhase;
    private getTouchpointCulturalMeaning;
    private isTouchpointMultiSensory;
    private designTransitions;
    private createEmotionalArc;
    private identifyCulturalMoments;
    private designSensoryExperience;
    private designVisualExperience;
    private getCulturalColorPalette;
    private designLightingExperience;
    private designAuditoryExperience;
    private getAmbientSounds;
    private getFeaturedSounds;
    private getSilenceMoments;
    private getCulturalAudio;
    private designTactileExperience;
    private getCulturalMaterials;
    private getTemperaturePreferences;
    private getCulturalTextures;
    private designOlfactoryExperience;
    private getNaturalScents;
    private getIntroducedScents;
    private getCulturalScents;
    private designSensoryIntegration;
    private getSensoryCulturalTraditions;
    private optimizeJourneyCoherence;
    private calculatePhaseCoherence;
    private calculateTransitionSmoothing;
    private initializeEmotionalPatterns;
    private initializeCulturalJourneys;
}
/**
 * Quality Assurance and Validation System
 */
export declare class QualityValidator {
    private culturalStandards;
    private accessibilityStandards;
    private sustainabilityStandards;
    constructor();
    /**
     * Comprehensive quality validation of orchestrated event
     */
    validateEventQuality(scene: THREE.Group, context: OrchestrationContext, parameters: any): QualityMetrics;
    /**
     * Generate comprehensive recommendations for improvement
     */
    generateRecommendations(quality: QualityMetrics, context: OrchestrationContext, parameters: any): Recommendation[];
    private validateCulturalQuality;
    private calculateAuthenticity;
    private calculateRespect;
    private calculateEducationalValue;
    private calculateAppropriateness;
    private calculateCulturalDepth;
    private calculateCulturalInnovation;
    private validateSpatialQuality;
    private validateTechnicalQuality;
    private validateExperienceQuality;
    private validateAccessibilityQuality;
    private validateSustainabilityQuality;
    private calculateOverallQuality;
    private extractCulturalElements;
    private usesTraditionalMethods;
    private checkCulturalViolations;
    private hasProperAttribution;
    private extractEducationalElements;
    private hasExplanationOpportunities;
    private hasInteractiveLearning;
    private extractSacredElements;
    private hasSacredElementGuidance;
    private calculateFusionAppropriateness;
    private countCulturalLayers;
    private hasHistoricalContext;
    private hasContemporaryRelevance;
    private hasCreativeFusion;
    private hasModernInterpretation;
    private hasCulturalTechIntegration;
    private calculateSpatialEfficiency;
    private calculateSpatialFlow;
    private calculateSpatialComfort;
    private calculateSpatialBeauty;
    private calculateSpatialFunctionality;
    private calculateSpatialCultural;
    private calculateTechnicalReliability;
    private calculateTechnicalPerformance;
    private calculateTechnicalIntegration;
    private calculateTechnicalEfficiency;
    private calculateTechnicalMaintainability;
    private calculateTechnicalScalability;
    private calculateEmotionalQuality;
    private calculateMemorableQuality;
    private calculateEngagingQuality;
    private calculateExperienceCultural;
    private calculateSensoryQuality;
    private calculatePersonalQuality;
    private calculatePhysicalAccessibility;
    private calculateSensoryAccessibility;
    private calculateCognitiveAccessibility;
    private calculateCulturalAccessibility;
    private calculateUniversalDesign;
    private calculateInclusionQuality;
    private calculateEnvironmentalSustainability;
    private calculateCulturalSustainability;
    private calculateSocialSustainability;
    private calculateEconomicSustainability;
    private calculateLongTermSustainability;
    private calculateRegenerativePotential;
    private initializeStandards;
}
//# sourceMappingURL=OrchestrationUtils.d.ts.map