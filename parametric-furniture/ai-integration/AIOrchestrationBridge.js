// AI to Orchestration System Integration Bridge
import { EventOrchestrationMaster } from '../orchestration/EventOrchestrationMaster.js';
/**
 * Budget Range Mapping
 */
const BUDGET_RANGES = {
    'low': {
        total: 1500,
        breakdown: {
            furniture: 600,
            staging: 300,
            lighting: 300,
            floral: 150,
            technology: 100,
            services: 50
        }
    },
    'medium': {
        total: 5000,
        breakdown: {
            furniture: 2000,
            staging: 1000,
            lighting: 800,
            floral: 500,
            technology: 500,
            services: 200
        }
    },
    'high': {
        total: 15000,
        breakdown: {
            furniture: 6000,
            staging: 3000,
            lighting: 2500,
            floral: 1500,
            technology: 1500,
            services: 500
        }
    },
    'luxury': {
        total: 50000,
        breakdown: {
            furniture: 20000,
            staging: 10000,
            lighting: 8000,
            floral: 5000,
            technology: 5000,
            services: 2000
        }
    }
};
/**
 * AI to Orchestration Bridge Class
 */
export class AIOrchestrationBridge {
    constructor() {
        this.orchestrator = new EventOrchestrationMaster();
    }
    /**
     * Convert AI prompt request to EventOrchestrationParameters
     */
    convertAIRequestToOrchestrationParams(aiRequest) {
        console.log('🤖 Converting AI prompt request to orchestration parameters...');
        const budget = this.parseBudgetRange(aiRequest.budget_range);
        const eventType = this.mapEventType(aiRequest.event_type);
        const scale = this.calculateEventScale(aiRequest.guest_count);
        const atmosphere = this.mapStyleToAtmosphere(aiRequest.style_preferences);
        const orchestrationParams = {
            // Event Foundation
            eventType,
            scale,
            duration: this.estimateEventDuration(aiRequest.event_type),
            // Cultural Foundation
            primaryCulture: aiRequest.cultural_background[0] || 'modern',
            secondaryCultures: aiRequest.cultural_background.slice(1),
            culturalFusion: aiRequest.cultural_background.length > 1,
            ceremonyElements: this.extractCeremonyElements(aiRequest),
            culturalSensitivity: aiRequest.cultural_sensitivity === 'sacred' ? 'high' : aiRequest.cultural_sensitivity,
            // Space Definition
            venue: {
                type: aiRequest.venue_type,
                dimensions: {
                    width: aiRequest.space_dimensions.width || 10,
                    depth: aiRequest.space_dimensions.depth || 8,
                    height: aiRequest.space_dimensions.height || 3
                },
                existingFeatures: [],
                restrictions: aiRequest.special_requirements,
                climate: this.determineClimate(aiRequest.venue_type),
                acoustics: 'good',
                naturalLight: 'moderate'
            },
            // Guest Demographics & Experience
            guests: {
                total: aiRequest.guest_count,
                adults: Math.floor(aiRequest.guest_count * 0.8),
                children: Math.floor(aiRequest.guest_count * 0.15),
                elderly: Math.floor(aiRequest.guest_count * 0.05),
                vip: Math.floor(aiRequest.guest_count * 0.1),
                accessibility: aiRequest.accessibility_requirements,
                culturalBackgrounds: aiRequest.cultural_background,
                languageSupport: this.determineLanguageSupport(aiRequest.cultural_background)
            },
            // Experience Goals & Atmosphere
            atmosphere,
            interactionStyle: this.determineInteractionStyle(aiRequest.event_type),
            memorabilityGoals: this.extractMemorabilityGoals(aiRequest),
            emotionalJourney: this.designEmotionalJourney(aiRequest),
            // Technical Requirements
            technology: {
                audioVisual: aiRequest.complexity_level !== 'simple',
                streaming: aiRequest.complexity_level === 'enterprise',
                recording: aiRequest.complexity_level === 'enterprise',
                interactive: ['complex', 'enterprise'].includes(aiRequest.complexity_level),
                projection: aiRequest.style_preferences.includes('modern') || aiRequest.style_preferences.includes('interactive'),
                lighting: this.mapComplexityToLighting(aiRequest.complexity_level)
            },
            // Environmental & Seasonal
            timing: {
                season: aiRequest.timing.season || 'spring',
                timeOfDay: aiRequest.timing.timeOfDay || 'evening',
                weather: aiRequest.timing.weather || 'variable'
            },
            // Practical Constraints
            budget,
            // Timeline
            timeline: {
                setup: this.estimateSetupTime(aiRequest.complexity_level),
                breakdown: 2, // 2 hours breakdown
                advance: 7, // 1 week advance planning
                rehearsal: aiRequest.complexity_level === 'enterprise'
            },
            // Sustainability & Values
            sustainability: this.determineSustainabilityLevel(aiRequest.style_preferences),
            localSourcing: aiRequest.style_preferences.includes('sustainable') || aiRequest.style_preferences.includes('local'),
            culturalAuthenticity: this.determineCulturalAuthenticity(aiRequest),
            accessibility: this.determineAccessibilityLevel(aiRequest.accessibility_requirements),
            // Safety & Security
            security: {
                riskLevel: this.determineRiskLevel(aiRequest.guest_count, aiRequest.venue_type),
                accessControl: this.determineAccessControl(aiRequest.event_type),
                emergencyServices: aiRequest.guest_count > 100 || aiRequest.complexity_level === 'enterprise',
                weatherContingency: aiRequest.venue_type === 'outdoor' || aiRequest.venue_type === 'mixed'
            }
        };
        console.log('✅ AI request converted to orchestration parameters');
        return orchestrationParams;
    }
    /**
     * Execute full orchestration from AI request
     */
    async orchestrateFromAIRequest(aiRequest) {
        console.log('🎭 Starting AI-driven orchestration...');
        try {
            // Convert AI request to orchestration parameters
            const orchestrationParams = this.convertAIRequestToOrchestrationParams(aiRequest);
            // Execute orchestration
            const result = await this.orchestrator.orchestrateEvent(orchestrationParams);
            console.log('🎉 AI-driven orchestration completed successfully!');
            return result;
        }
        catch (error) {
            console.error('❌ AI orchestration failed:', error);
            throw new Error(`AI orchestration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Generate cultural validation report for AI
     */
    async validateCulturalAuthenticity(aiRequest, orchestrationResult) {
        console.log('🏛️ Validating cultural authenticity...');
        return {
            score: orchestrationResult.metadata.culturalAuthenticity,
            issues: [], // Could be derived from cultural notes
            recommendations: orchestrationResult.recommendations,
            elderConsultationNeeded: aiRequest.cultural_sensitivity === 'sacred' ||
                orchestrationResult.metadata.culturalAuthenticity < 0.8
        };
    }
    /**
     * Generate budget optimization suggestions for AI
     */
    generateBudgetOptimizations(aiRequest, orchestrationResult) {
        console.log('💰 Generating budget optimizations...');
        // Use budget utilization from metadata to estimate costs
        const budgetUtilization = orchestrationResult.metadata.budgetUtilization;
        const estimatedBudget = this.parseBudgetRange(aiRequest.budget_range);
        return {
            currentBreakdown: estimatedBudget.breakdown,
            optimizations: [
                {
                    category: 'furniture',
                    currentCost: estimatedBudget.breakdown.furniture,
                    optimizedCost: estimatedBudget.breakdown.furniture * 0.85,
                    savings: estimatedBudget.breakdown.furniture * 0.15,
                    impact: 'Use parametric generation for cost-effective custom pieces'
                },
                {
                    category: 'lighting',
                    currentCost: estimatedBudget.breakdown.lighting,
                    optimizedCost: estimatedBudget.breakdown.lighting * 0.9,
                    savings: estimatedBudget.breakdown.lighting * 0.1,
                    impact: 'LED efficiency and smart controls reduce long-term costs'
                }
            ],
            alternatives: [
                {
                    description: 'Rental furniture for non-essential pieces',
                    costDifference: -estimatedBudget.total * 0.2,
                    qualityImpact: 'Minimal impact on guest experience'
                },
                {
                    description: 'Local artisan collaboration for cultural elements',
                    costDifference: -estimatedBudget.total * 0.1,
                    qualityImpact: 'Enhanced authenticity and community connection'
                }
            ]
        };
    }
    // Helper methods for mapping AI request to orchestration parameters
    mapEventType(eventType) {
        const eventMapping = {
            'wedding': 'wedding',
            'corporate': 'corporate',
            'birthday': 'birthday',
            'tea ceremony': 'tea-ceremony',
            'cultural ceremony': 'cultural-ceremony',
            'conference': 'conference',
            'exhibition': 'exhibition',
            'gala': 'gala'
        };
        for (const [key, value] of Object.entries(eventMapping)) {
            if (eventType.toLowerCase().includes(key)) {
                return value;
            }
        }
        return 'wedding'; // default
    }
    calculateEventScale(guestCount) {
        if (guestCount <= 25)
            return 'intimate';
        if (guestCount <= 75)
            return 'medium';
        if (guestCount <= 150)
            return 'large';
        if (guestCount <= 300)
            return 'grand';
        return 'monumental';
    }
    estimateEventDuration(eventType) {
        const durationMapping = {
            'wedding': 8,
            'corporate': 4,
            'birthday': 4,
            'tea ceremony': 2,
            'cultural ceremony': 6,
            'conference': 8,
            'exhibition': 6,
            'gala': 5
        };
        for (const [key, value] of Object.entries(durationMapping)) {
            if (eventType.toLowerCase().includes(key)) {
                return value;
            }
        }
        return 4; // default 4 hours
    }
    mapStyleToAtmosphere(stylePreferences) {
        const atmosphereMapping = {
            'formal': 'formal',
            'elegant': 'formal',
            'casual': 'casual',
            'relaxed': 'casual',
            'traditional': 'ceremonial',
            'ceremonial': 'ceremonial',
            'festive': 'celebratory',
            'celebratory': 'celebratory',
            'peaceful': 'contemplative',
            'contemplative': 'contemplative',
            'energetic': 'energetic',
            'vibrant': 'energetic',
            'intimate': 'intimate',
            'cozy': 'intimate'
        };
        for (const style of stylePreferences) {
            const mapped = atmosphereMapping[style.toLowerCase()];
            if (mapped)
                return mapped;
        }
        return 'formal'; // default
    }
    determineInteractionStyle(eventType) {
        if (eventType.toLowerCase().includes('ceremony'))
            return 'ceremony-focused';
        if (eventType.toLowerCase().includes('conference'))
            return 'presentation';
        if (eventType.toLowerCase().includes('corporate'))
            return 'presentation';
        if (eventType.toLowerCase().includes('birthday'))
            return 'activity-based';
        if (eventType.toLowerCase().includes('wedding'))
            return 'hybrid';
        return 'mingling'; // default
    }
    extractCeremonyElements(aiRequest) {
        const elements = [];
        // Extract from event type
        if (aiRequest.event_type.toLowerCase().includes('tea')) {
            elements.push('tea-ceremony');
        }
        if (aiRequest.event_type.toLowerCase().includes('wedding')) {
            elements.push('wedding-ceremony');
        }
        // Extract from cultural backgrounds
        aiRequest.cultural_background.forEach(culture => {
            elements.push(`${culture}-traditions`);
        });
        // Extract from special requirements
        aiRequest.special_requirements.forEach(req => {
            if (req.toLowerCase().includes('ceremony')) {
                elements.push(req);
            }
        });
        return elements;
    }
    extractMemorabilityGoals(aiRequest) {
        const goals = [];
        // Based on style preferences
        if (aiRequest.style_preferences.includes('traditional')) {
            goals.push('cultural-authenticity');
        }
        if (aiRequest.style_preferences.includes('elegant')) {
            goals.push('sophisticated-ambiance');
        }
        if (aiRequest.style_preferences.includes('intimate')) {
            goals.push('personal-connections');
        }
        // Based on event type
        if (aiRequest.event_type.toLowerCase().includes('wedding')) {
            goals.push('lifetime-memories', 'family-bonding');
        }
        if (aiRequest.event_type.toLowerCase().includes('corporate')) {
            goals.push('professional-networking', 'brand-impression');
        }
        return goals.length > 0 ? goals : ['memorable-experience'];
    }
    designEmotionalJourney(aiRequest) {
        const journey = ['arrival-anticipation'];
        // Add journey phases based on event type
        if (aiRequest.event_type.toLowerCase().includes('wedding')) {
            journey.push('ceremony-emotion', 'celebration-joy', 'intimate-moments');
        }
        else if (aiRequest.event_type.toLowerCase().includes('corporate')) {
            journey.push('professional-engagement', 'networking-comfort', 'inspiration');
        }
        else if (aiRequest.event_type.toLowerCase().includes('ceremony')) {
            journey.push('reverence', 'cultural-connection', 'reflection');
        }
        else {
            journey.push('social-warmth', 'celebration', 'satisfaction');
        }
        journey.push('departure-fulfillment');
        return journey;
    }
    mapComplexityToLighting(complexity) {
        const lightingMapping = {
            'simple': 'basic',
            'moderate': 'professional',
            'complex': 'theatrical',
            'enterprise': 'adaptive'
        };
        return lightingMapping[complexity] || 'professional';
    }
    determineClimate(venueType) {
        if (venueType === 'outdoor')
            return 'variable';
        if (venueType === 'covered-outdoor')
            return 'seasonal';
        return 'controlled';
    }
    determineLanguageSupport(culturalBackgrounds) {
        const languageMapping = {
            'japanese': 'japanese',
            'italian': 'italian',
            'french': 'french',
            'spanish': 'spanish',
            'german': 'german',
            'chinese': 'mandarin',
            'korean': 'korean'
        };
        const languages = ['english']; // Always include English
        culturalBackgrounds.forEach(culture => {
            const language = languageMapping[culture.toLowerCase()];
            if (language && !languages.includes(language)) {
                languages.push(language);
            }
        });
        return languages;
    }
    estimateSetupTime(complexity) {
        const setupTimes = {
            'simple': 4,
            'moderate': 6,
            'complex': 8,
            'enterprise': 12
        };
        return setupTimes[complexity] || 6;
    }
    determineSustainabilityLevel(stylePreferences) {
        if (stylePreferences.includes('eco-friendly') || stylePreferences.includes('carbon-neutral')) {
            return 'carbon-neutral';
        }
        if (stylePreferences.includes('sustainable')) {
            return 'high';
        }
        return 'moderate';
    }
    determineCulturalAuthenticity(aiRequest) {
        if (aiRequest.cultural_sensitivity === 'sacred') {
            return 'traditional';
        }
        if (aiRequest.cultural_background.length > 1) {
            return 'fusion';
        }
        if (aiRequest.style_preferences.includes('educational')) {
            return 'educational';
        }
        return 'modern-interpretation';
    }
    determineAccessibilityLevel(accessibilityRequirements) {
        if (accessibilityRequirements.length >= 3) {
            return 'universal';
        }
        if (accessibilityRequirements.length > 0) {
            return 'enhanced';
        }
        return 'basic';
    }
    determineRiskLevel(guestCount, venueType) {
        if (guestCount > 200)
            return 'public-event';
        if (guestCount > 100)
            return 'high';
        if (venueType === 'outdoor')
            return 'medium';
        return 'low';
    }
    determineAccessControl(eventType) {
        if (eventType.toLowerCase().includes('corporate'))
            return 'invitation-only';
        if (eventType.toLowerCase().includes('wedding'))
            return 'invitation-only';
        if (eventType.toLowerCase().includes('conference'))
            return 'ticketed';
        return 'open';
    }
    determinePriorities(aiRequest) {
        const priorities = [];
        // Cultural sensitivity drives priorities
        if (aiRequest.cultural_sensitivity === 'sacred' || aiRequest.cultural_sensitivity === 'high') {
            priorities.push('cultural-authenticity');
        }
        // Accessibility is always important
        if (aiRequest.accessibility_requirements.length > 0) {
            priorities.push('accessibility-compliance');
        }
        // Guest comfort based on demographics
        priorities.push('guest-comfort');
        // Budget consciousness
        if (aiRequest.budget_range === 'low') {
            priorities.push('budget-optimization');
        }
        // Sustainability for modern events
        if (aiRequest.style_preferences.includes('sustainable') ||
            aiRequest.style_preferences.includes('eco-friendly')) {
            priorities.push('sustainability');
        }
        // Default priorities if none specified
        if (priorities.length === 0) {
            priorities.push('guest-comfort', 'memorable-experience');
        }
        return priorities;
    }
    parseBudgetRange(budgetRange) {
        const budgetData = BUDGET_RANGES[budgetRange.toLowerCase()] || BUDGET_RANGES['medium'];
        return {
            total: budgetData.total,
            breakdown: {
                furniture: budgetData.breakdown.furniture,
                staging: budgetData.breakdown.staging,
                lighting: budgetData.breakdown.lighting,
                floral: budgetData.breakdown.floral,
                climate: budgetData.breakdown.technology * 0.3,
                security: budgetData.breakdown.services * 0.5,
                technology: budgetData.breakdown.technology * 0.7
            }
        };
    }
}
/**
 * Utility functions for React Three Fiber integration
 */
export class AIOrchestrationReactUtils {
    /**
     * Generate React Three Fiber component props from orchestration result
     */
    static generateR3FProps(orchestrationResult) {
        return {
            scene: {
                background: orchestrationResult.scene.userData.backgroundColor,
                fog: orchestrationResult.scene.userData.fogSettings
            },
            camera: {
                position: [0, 10, 10],
                fov: 75,
                near: 0.1,
                far: 1000
            },
            lighting: {
                ambient: {
                    color: '#ffffff',
                    intensity: 0.4
                },
                directional: {
                    color: '#ffffff',
                    intensity: 0.8,
                    position: [5, 10, 5]
                }
            },
            interactions: {
                enableDragDrop: true,
                enableResize: true,
                enableRotation: true,
                showCulturalInfo: true,
                accessibilityMode: false
            }
        };
    }
    /**
     * Generate TypeScript interfaces for React components
     */
    static generateComponentInterfaces(orchestrationResult) {
        return `
    // Generated TypeScript interfaces for React Three Fiber components
    export interface OrchestrationSceneProps {
      result: OrchestrationResult;
      onObjectSelect?: (object: any) => void;
      onCulturalValidation?: (validation: any) => void;
      accessibilityMode?: boolean;
    }

    export interface FurnitureComponentProps {
      item: any;
      draggable?: boolean;
      showCulturalInfo?: boolean;
      onMove?: (position: Vector3) => void;
    }

    export interface CulturalValidationOverlayProps {
      validation: any;
      visible: boolean;
      onClose: () => void;
    }

    export interface BudgetOptimizationPanelProps {
      breakdown: any;
      optimizations: any;
      onApplyOptimization: (optimization: any) => void;
    }
    `;
    }
}
