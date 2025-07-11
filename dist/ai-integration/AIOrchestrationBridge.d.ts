import { EventOrchestrationParameters, OrchestrationResult } from '../orchestration/EventOrchestrationMaster.js';
/**
 * Python AI Prompt Request Interface (mirrors Python ParametricPromptRequest)
 */
export interface AIPromptRequest {
    event_type: string;
    cultural_background: string[];
    space_dimensions: Record<string, number>;
    guest_count: number;
    budget_range: string;
    accessibility_requirements: string[];
    style_preferences: string[];
    cultural_sensitivity: 'low' | 'medium' | 'high' | 'sacred';
    complexity_level: 'simple' | 'moderate' | 'complex' | 'enterprise';
    desired_outputs: ('parametric_3d' | 'detailed_specifications' | 'cultural_guidance' | 'budget_optimization' | 'orchestration_parameters')[];
    three_js_integration: boolean;
    parametric_generation: boolean;
    venue_type: string;
    timing: Record<string, string>;
    special_requirements: string[];
}
/**
 * AI to Orchestration Bridge Class
 */
export declare class AIOrchestrationBridge {
    private orchestrator;
    constructor();
    /**
     * Convert AI prompt request to EventOrchestrationParameters
     */
    convertAIRequestToOrchestrationParams(aiRequest: AIPromptRequest): EventOrchestrationParameters;
    /**
     * Execute full orchestration from AI request
     */
    orchestrateFromAIRequest(aiRequest: AIPromptRequest): Promise<OrchestrationResult>;
    /**
     * Generate cultural validation report for AI
     */
    validateCulturalAuthenticity(aiRequest: AIPromptRequest, orchestrationResult: OrchestrationResult): Promise<{
        score: number;
        issues: string[];
        recommendations: string[];
        elderConsultationNeeded: boolean;
    }>;
    /**
     * Generate budget optimization suggestions for AI
     */
    generateBudgetOptimizations(aiRequest: AIPromptRequest, orchestrationResult: OrchestrationResult): {
        currentBreakdown: Record<string, number>;
        optimizations: Array<{
            category: string;
            currentCost: number;
            optimizedCost: number;
            savings: number;
            impact: string;
        }>;
        alternatives: Array<{
            description: string;
            costDifference: number;
            qualityImpact: string;
        }>;
    };
    private mapEventType;
    private calculateEventScale;
    private estimateEventDuration;
    private mapStyleToAtmosphere;
    private determineInteractionStyle;
    private extractCeremonyElements;
    private extractMemorabilityGoals;
    private designEmotionalJourney;
    private mapComplexityToLighting;
    private determineClimate;
    private determineLanguageSupport;
    private estimateSetupTime;
    private determineSustainabilityLevel;
    private determineCulturalAuthenticity;
    private determineAccessibilityLevel;
    private determineRiskLevel;
    private determineAccessControl;
    private determinePriorities;
    private parseBudgetRange;
}
/**
 * Utility functions for React Three Fiber integration
 */
export declare class AIOrchestrationReactUtils {
    /**
     * Generate React Three Fiber component props from orchestration result
     */
    static generateR3FProps(orchestrationResult: OrchestrationResult): {
        scene: any;
        camera: any;
        lighting: any;
        interactions: any;
    };
    /**
     * Generate TypeScript interfaces for React components
     */
    static generateComponentInterfaces(orchestrationResult: OrchestrationResult): string;
}
export type { OrchestrationResult, EventOrchestrationParameters };
//# sourceMappingURL=AIOrchestrationBridge.d.ts.map