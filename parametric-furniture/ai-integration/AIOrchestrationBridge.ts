// AI to Orchestration System Integration Bridge
import { EventOrchestrationMaster, EventOrchestrationParameters, OrchestrationResult } from '../orchestration/EventOrchestrationMaster.js';

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
 * Budget Range Mapping
 */
const BUDGET_RANGES: Record<string, { total: number; breakdown: Record<string, number> }> = {
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
  private orchestrator: EventOrchestrationMaster;
  
  constructor() {
    this.orchestrator = new EventOrchestrationMaster();
  }

  /**
   * Convert chat-extracted parameters to EventOrchestrationParameters
   * NEW METHOD for chat-first interface
   */
  public convertChatParamsToOrchestrationParams(chatParams: {
    eventType?: string;
    guestCount?: number;
    budget?: string;
    culture?: string;
    style?: string;
    spaceType?: string;
    timeOfDay?: string;
    accessibility_needed?: boolean;
  }): EventOrchestrationParameters {
    console.log('💬 Converting chat parameters to orchestration parameters...');
    
    // Map chat budget format (e.g., "5k-15k") to our budget system
    const budgetMapping: Record<string, string> = {
      'under-2k': 'low',
      '2k-5k': 'low',
      '5k-15k': 'medium',
      '15k-30k': 'high',
      '30k-50k': 'high',
      'over-50k': 'luxury'
    };
    
    const budgetRange = budgetMapping[chatParams.budget || '5k-15k'] || 'medium';
    const budget = this.parseBudgetRange(budgetRange);
    
    // Convert chat event type to orchestration event type
    const eventTypeMapping: Record<string, EventOrchestrationParameters['eventType']> = {
      'wedding': 'wedding',
      'birthday': 'birthday',
      'birthday-child': 'birthday',
      'birthday-adult': 'birthday',
      'corporate': 'corporate',
      'cultural-celebration': 'cultural-ceremony',
      'tea-ceremony': 'tea-ceremony',
      'conference': 'conference',
      'product-launch': 'exhibition',
      'graduation': 'gala',
      'anniversary': 'gala',
      'baby-shower': 'cultural-ceremony',
      'quinceañera': 'cultural-ceremony',
      'bar-bat-mitzvah': 'cultural-ceremony'
    };
    
    const eventType = eventTypeMapping[chatParams.eventType || 'cultural-ceremony'] || 'cultural-ceremony';
    const scale = this.calculateEventScale(chatParams.guestCount || 50);
    
    // Map chat style to atmosphere
    const styleToAtmosphere: Record<string, EventOrchestrationParameters['atmosphere']> = {
      'elegant': 'formal',
      'rustic': 'casual',
      'modern': 'energetic',
      'traditional': 'ceremonial',
      'minimalist': 'contemplative',
      'vintage': 'intimate',
      'bohemian': 'casual',
      'industrial': 'energetic',
      'wabi-sabi': 'contemplative',
      'hygge': 'intimate',
      'bella-figura': 'formal',
      'savoir-vivre': 'celebratory'
    };
    
    const atmosphere = styleToAtmosphere[chatParams.style || 'elegant'] || 'formal';
    
    return {
      // Event Foundation
      eventType,
      scale,
      duration: this.estimateEventDuration(eventType),
      
      // Cultural Foundation from chat
      primaryCulture: (chatParams.culture as any) || 'modern',
      secondaryCultures: [],
      culturalFusion: false,
      ceremonyElements: this.extractCeremonyElementsFromEventType(eventType),
      culturalSensitivity: chatParams.culture && chatParams.culture !== 'modern' ? 'high' : 'moderate',
      
      // Space Definition from chat
      venue: {
        type: (chatParams.spaceType as any) || 'indoor',
        dimensions: {
          width: chatParams.spaceType === 'outdoor' ? 20 : 10,
          depth: chatParams.spaceType === 'outdoor' ? 15 : 8,
          height: chatParams.spaceType === 'outdoor' ? 10 : 3
        },
        existingFeatures: [],
        restrictions: chatParams.accessibility_needed ? ['wheelchair-accessible'] : [],
        climate: this.determineClimate(chatParams.spaceType || 'indoor'),
        acoustics: 'good',
        naturalLight: chatParams.timeOfDay === 'evening' ? 'limited' : 'moderate'
      },
      
      // Guest Demographics from chat
      guests: {
        total: chatParams.guestCount || 50,
        adults: Math.floor((chatParams.guestCount || 50) * 0.8),
        children: eventType === 'birthday' && chatParams.eventType?.includes('child') 
          ? Math.floor((chatParams.guestCount || 50) * 0.5)
          : Math.floor((chatParams.guestCount || 50) * 0.15),
        elderly: Math.floor((chatParams.guestCount || 50) * 0.05),
        vip: Math.floor((chatParams.guestCount || 50) * 0.1),
        accessibility: chatParams.accessibility_needed ? ['wheelchair', 'visual-aids'] : [],
        culturalBackgrounds: chatParams.culture ? [chatParams.culture] : ['mixed'],
        languageSupport: []
      },
      
      // Experience Goals & Atmosphere
      atmosphere,
      interactionStyle: eventType === 'corporate' ? 'presentation' : 'mingling',
      memorabilityGoals: ['culturally-authentic', 'visually-stunning', 'comfortable'],
      emotionalJourney: ['welcome', 'engagement', 'celebration', 'farewell'],
      
      // Technical Requirements (simplified for chat)
      technology: {
        audioVisual: true,
        streaming: false,
        recording: false,
        interactive: chatParams.style === 'modern',
        projection: chatParams.style === 'modern',
        lighting: budget.total > 15000 ? 'professional' : 'basic'
      },
      
      // Environmental from chat
      timing: {
        season: 'spring', // Default, could be enhanced
        timeOfDay: this.mapChatTimeOfDay(chatParams.timeOfDay || 'evening'),
        weather: 'variable'
      },
      
      // Budget from chat
      budget,
      
      // Accessibility from chat
      accessibility: {
        required: chatParams.accessibility_needed || false,
        wheelchairCount: chatParams.accessibility_needed ? Math.ceil((chatParams.guestCount || 50) * 0.1) : 0,
        visualAids: chatParams.accessibility_needed,
        hearingAssist: chatParams.accessibility_needed,
        serviceAnimals: chatParams.accessibility_needed
      },
      
      // Catering (simplified for chat)
      catering: {
        style: eventType === 'corporate' ? 'cocktail' : 'buffet',
        mealPeriods: ['main'],
        dietaryRequirements: ['vegetarian', 'gluten-free'],
        bar: budget.total > 5000,
        specialItems: []
      },
      
      // Priorities (auto-generated for chat)
      priorities: {
        primary: 'guest-experience',
        secondary: 'cultural-authenticity',
        tertiary: 'visual-impact'
      }
    };
  }

  /**
   * Convert AI prompt request to EventOrchestrationParameters
   */
  public convertAIRequestToOrchestrationParams(aiRequest: AIPromptRequest): EventOrchestrationParameters {
    console.log('🤖 Converting AI prompt request to orchestration parameters...');
    
    const budget = this.parseBudgetRange(aiRequest.budget_range);
    const eventType = this.mapEventType(aiRequest.event_type);
    const scale = this.calculateEventScale(aiRequest.guest_count);
    const atmosphere = this.mapStyleToAtmosphere(aiRequest.style_preferences);
    
    const orchestrationParams: EventOrchestrationParameters = {
      // Event Foundation
      eventType,
      scale,
      duration: this.estimateEventDuration(aiRequest.event_type),
      
      // Cultural Foundation
      primaryCulture: aiRequest.cultural_background[0] as any || 'modern',
      secondaryCultures: aiRequest.cultural_background.slice(1),
      culturalFusion: aiRequest.cultural_background.length > 1,
      ceremonyElements: this.extractCeremonyElements(aiRequest),
      culturalSensitivity: aiRequest.cultural_sensitivity === 'sacred' ? 'high' : aiRequest.cultural_sensitivity as any,
      
      // Space Definition
      venue: {
        type: aiRequest.venue_type as any,
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
        season: (aiRequest.timing.season as any) || 'spring',
        timeOfDay: (aiRequest.timing.timeOfDay as any) || 'evening',
        weather: (aiRequest.timing.weather as any) || 'variable'
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
   * Orchestrate from chat parameters - NEW METHOD for chat-first interface
   */
  public async orchestrateFromChat(chatParams: {
    eventType?: string;
    guestCount?: number;
    budget?: string;
    culture?: string;
    style?: string;
    spaceType?: string;
    timeOfDay?: string;
    accessibility_needed?: boolean;
  }): Promise<OrchestrationResult> {
    try {
      console.log('💬 Starting chat-based orchestration...');
      
      // Convert chat params to orchestration parameters
      const orchestrationParams = this.convertChatParamsToOrchestrationParams(chatParams);
      
      // Execute orchestration
      const result = await this.orchestrator.orchestrateEvent(orchestrationParams);
      
      console.log('🎉 Chat-driven orchestration completed successfully!');
      console.log('📊 Cultural Authenticity Score:', result.metadata.culturalAuthenticity);
      console.log('💰 Budget Utilization:', result.metadata.budgetUtilization);
      
      return result;
      
    } catch (error) {
      console.error('❌ Chat orchestration failed:', error);
      throw new Error(`Chat orchestration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Execute full orchestration from AI request
   */
  public async orchestrateFromAIRequest(aiRequest: AIPromptRequest): Promise<OrchestrationResult> {
    console.log('🎭 Starting AI-driven orchestration...');
    
    try {
      // Convert AI request to orchestration parameters
      const orchestrationParams = this.convertAIRequestToOrchestrationParams(aiRequest);
      
      // Execute orchestration
      const result = await this.orchestrator.orchestrateEvent(orchestrationParams);
      
      console.log('🎉 AI-driven orchestration completed successfully!');
      return result;
      
    } catch (error) {
      console.error('❌ AI orchestration failed:', error);
      throw new Error(`AI orchestration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate cultural validation report for AI
   */
  public async validateCulturalAuthenticity(
    aiRequest: AIPromptRequest,
    orchestrationResult: OrchestrationResult
  ): Promise<{
    score: number;
    issues: string[];
    recommendations: string[];
    elderConsultationNeeded: boolean;
  }> {
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
  public generateBudgetOptimizations(
    aiRequest: AIPromptRequest,
    orchestrationResult: OrchestrationResult
  ): {
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
  } {
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

  private mapEventType(eventType: string): EventOrchestrationParameters['eventType'] {
    const eventMapping: Record<string, EventOrchestrationParameters['eventType']> = {
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

  private calculateEventScale(guestCount: number): EventOrchestrationParameters['scale'] {
    if (guestCount <= 25) return 'intimate';
    if (guestCount <= 75) return 'medium';
    if (guestCount <= 150) return 'large';
    if (guestCount <= 300) return 'grand';
    return 'monumental';
  }

  private estimateEventDuration(eventType: string): number {
    const durationMapping: Record<string, number> = {
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

  private mapStyleToAtmosphere(stylePreferences: string[]): EventOrchestrationParameters['atmosphere'] {
    const atmosphereMapping: Record<string, EventOrchestrationParameters['atmosphere']> = {
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
      if (mapped) return mapped;
    }
    
    return 'formal'; // default
  }

  private determineInteractionStyle(eventType: string): EventOrchestrationParameters['interactionStyle'] {
    if (eventType.toLowerCase().includes('ceremony')) return 'ceremony-focused';
    if (eventType.toLowerCase().includes('conference')) return 'presentation';
    if (eventType.toLowerCase().includes('corporate')) return 'presentation';
    if (eventType.toLowerCase().includes('birthday')) return 'activity-based';
    if (eventType.toLowerCase().includes('wedding')) return 'hybrid';
    
    return 'mingling'; // default
  }

  private extractCeremonyElements(aiRequest: AIPromptRequest): string[] {
    const elements: string[] = [];
    
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

  private extractMemorabilityGoals(aiRequest: AIPromptRequest): string[] {
    const goals: string[] = [];
    
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

  private designEmotionalJourney(aiRequest: AIPromptRequest): string[] {
    const journey: string[] = ['arrival-anticipation'];
    
    // Add journey phases based on event type
    if (aiRequest.event_type.toLowerCase().includes('wedding')) {
      journey.push('ceremony-emotion', 'celebration-joy', 'intimate-moments');
    } else if (aiRequest.event_type.toLowerCase().includes('corporate')) {
      journey.push('professional-engagement', 'networking-comfort', 'inspiration');
    } else if (aiRequest.event_type.toLowerCase().includes('ceremony')) {
      journey.push('reverence', 'cultural-connection', 'reflection');
    } else {
      journey.push('social-warmth', 'celebration', 'satisfaction');
    }
    
    journey.push('departure-fulfillment');
    return journey;
  }

  private mapComplexityToLighting(complexity: string): EventOrchestrationParameters['technology']['lighting'] {
    const lightingMapping: Record<string, EventOrchestrationParameters['technology']['lighting']> = {
      'simple': 'basic',
      'moderate': 'professional',
      'complex': 'theatrical',
      'enterprise': 'adaptive'
    };
    
    return lightingMapping[complexity] || 'professional';
  }

  private determineClimate(venueType: string): EventOrchestrationParameters['venue']['climate'] {
    if (venueType === 'outdoor') return 'variable';
    if (venueType === 'covered-outdoor') return 'seasonal';
    return 'controlled';
  }

  private determineLanguageSupport(culturalBackgrounds: string[]): string[] {
    const languageMapping: Record<string, string> = {
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

  private estimateSetupTime(complexity: string): number {
    const setupTimes: Record<string, number> = {
      'simple': 4,
      'moderate': 6,
      'complex': 8,
      'enterprise': 12
    };
    return setupTimes[complexity] || 6;
  }

  private determineSustainabilityLevel(stylePreferences: string[]): EventOrchestrationParameters['sustainability'] {
    if (stylePreferences.includes('eco-friendly') || stylePreferences.includes('carbon-neutral')) {
      return 'carbon-neutral';
    }
    if (stylePreferences.includes('sustainable')) {
      return 'high';
    }
    return 'moderate';
  }

  private determineCulturalAuthenticity(aiRequest: AIPromptRequest): EventOrchestrationParameters['culturalAuthenticity'] {
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

  private determineAccessibilityLevel(accessibilityRequirements: string[]): EventOrchestrationParameters['accessibility'] {
    if (accessibilityRequirements.length >= 3) {
      return 'universal';
    }
    if (accessibilityRequirements.length > 0) {
      return 'enhanced';
    }
    return 'basic';
  }

  private determineRiskLevel(guestCount: number, venueType: string): EventOrchestrationParameters['security']['riskLevel'] {
    if (guestCount > 200) return 'public-event';
    if (guestCount > 100) return 'high';
    if (venueType === 'outdoor') return 'medium';
    return 'low';
  }

  private determineAccessControl(eventType: string): EventOrchestrationParameters['security']['accessControl'] {
    if (eventType.toLowerCase().includes('corporate')) return 'invitation-only';
    if (eventType.toLowerCase().includes('wedding')) return 'invitation-only';
    if (eventType.toLowerCase().includes('conference')) return 'ticketed';
    return 'open';
  }

  private determinePriorities(aiRequest: AIPromptRequest): string[] {
    const priorities: string[] = [];
    
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

  private extractCeremonyElementsFromEventType(eventType: string): string[] {
    const elements: string[] = [];
    
    switch (eventType) {
      case 'wedding':
        elements.push('processional', 'vows', 'first-dance', 'cake-cutting');
        break;
      case 'tea-ceremony':
        elements.push('tea-preparation', 'guest-serving', 'contemplation');
        break;
      case 'cultural-ceremony':
        elements.push('blessing', 'cultural-ritual', 'feast');
        break;
      case 'birthday':
        elements.push('cake-presentation', 'gift-opening', 'games');
        break;
      case 'corporate':
        elements.push('keynote', 'networking', 'awards');
        break;
      default:
        elements.push('gathering', 'main-event', 'farewell');
    }
    
    return elements;
  }

  private mapChatTimeOfDay(timeOfDay: string): EventOrchestrationParameters['timing']['timeOfDay'] {
    const mapping: Record<string, EventOrchestrationParameters['timing']['timeOfDay']> = {
      'morning': 'morning',
      'afternoon': 'afternoon',
      'evening': 'evening',
      'all-day': 'midday'
    };
    
    return mapping[timeOfDay] || 'evening';
  }

  private parseBudgetRange(budgetRange: string): EventOrchestrationParameters['budget'] {
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
  public static generateR3FProps(orchestrationResult: OrchestrationResult): {
    scene: any;
    camera: any;
    lighting: any;
    interactions: any;
  } {
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
  public static generateComponentInterfaces(orchestrationResult: OrchestrationResult): string {
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

// Export for use in React applications
export type { OrchestrationResult, EventOrchestrationParameters };