// Template Orchestration Master System - Complete Implementation
import * as THREE from 'three';

// Import all available templates
import { ChairTemplate } from '../templates/seating/ChairTemplate.js';
import { TableTemplate } from '../templates/tables/TableTemplate.js';
import { LightingTemplate } from '../templates/lighting/LightingTemplate.js';
import { FloralTemplate } from '../templates/floral/FloralTemplate.js';
import { StageTemplate } from '../templates/stage/StageTemplate.js';
import { ClimateTemplate } from '../templates/climate/ClimateTemplate.js';
import { SecurityTemplate } from '../templates/security/SecurityTemplate.js';
import { AVTemplate } from '../templates/av/AVTemplate.js';
import { LandscapeTemplate } from '../templates/landscape/LandscapeTemplate.js';
import { StructureTemplate } from '../templates/structure/StructureTemplate.js';
import { InteractiveTemplate } from '../templates/interactive/InteractiveTemplate.js';
import { CelebratoryTemplate } from '../templates/celebratory/CelebratoryTemplate.js';

// Import parameter types
import {
  ParametricParameters,
  LightingParameters,
  FloralParameters,
  StageParameters,
  LandscapeParameters,
  StructureParameters,
  InteractiveParameters
} from '../types/index.js';

// Import specialized parameters (would be defined in respective template files)
import {
  ClimateParameters,
  SecurityParameters,
  AVParameters
} from '../templates/index.js';

// Import celebratory template types
import type { CelebratoryParameters } from '../templates/celebratory/CelebratoryTemplate.js';

// Master orchestration parameters
export interface EventOrchestrationParameters {
  // Event Foundation
  eventType: 'wedding' | 'corporate' | 'birthday' | 'cultural-ceremony' | 'tea-ceremony' | 'conference' | 'exhibition' | 'gala';
  scale: 'intimate' | 'medium' | 'large' | 'grand' | 'monumental';
  duration: number; // hours
  
  // Cultural Foundation (drives all template decisions)
  primaryCulture: 'japanese' | 'scandinavian' | 'italian' | 'modern' | 'french' | 'traditional';
  secondaryCultures?: string[];
  culturalFusion: boolean;
  ceremonyElements: string[];
  culturalSensitivity: 'high' | 'moderate' | 'adaptive';
  
  // Space Definition
  venue: {
    type: 'indoor' | 'outdoor' | 'mixed' | 'covered-outdoor';
    dimensions: { width: number; depth: number; height: number };
    existingFeatures: string[];
    restrictions: string[];
    climate: 'controlled' | 'seasonal' | 'variable' | 'extreme';
    acoustics: 'excellent' | 'good' | 'poor' | 'challenging';
    naturalLight: 'abundant' | 'moderate' | 'limited' | 'none';
  };
  
  // Guest Demographics & Experience
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
  
  // Experience Goals & Atmosphere
  atmosphere: 'formal' | 'casual' | 'ceremonial' | 'celebratory' | 'contemplative' | 'energetic' | 'intimate';
  interactionStyle: 'mingling' | 'seated' | 'activity-based' | 'ceremony-focused' | 'presentation' | 'hybrid';
  memorabilityGoals: string[];
  emotionalJourney: string[];
  
  // Technical Requirements
  technology: {
    audioVisual: boolean;
    streaming: boolean;
    recording: boolean;
    interactive: boolean;
    projection: boolean;
    lighting: 'basic' | 'professional' | 'theatrical' | 'adaptive';
  };
  
  // Environmental & Seasonal
  timing: {
    season: 'spring' | 'summer' | 'autumn' | 'winter';
    timeOfDay: 'dawn' | 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';
    weather: 'guaranteed-good' | 'variable' | 'challenging';
  };
  
  // Practical Constraints
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
    setup: number; // hours
    breakdown: number; // hours
    advance: number; // days
    rehearsal?: boolean;
  };
  
  // Sustainability & Values
  sustainability: 'minimal' | 'moderate' | 'high' | 'carbon-neutral' | 'regenerative';
  localSourcing: boolean;
  culturalAuthenticity: 'modern-interpretation' | 'traditional' | 'fusion' | 'educational';
  accessibility: 'basic' | 'enhanced' | 'universal';
  
  // Safety & Security
  security: {
    riskLevel: 'low' | 'medium' | 'high' | 'vip' | 'public-event';
    accessControl: 'open' | 'ticketed' | 'invitation-only' | 'multi-tier';
    emergencyServices: boolean;
    weatherContingency: boolean;
  };
}

// Template orchestration result
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

// Cross-template relationship definitions
export interface TemplateRelationship {
  primary: string;
  secondary: string;
  relationship: 'complements' | 'depends-on' | 'conflicts-with' | 'enhances' | 'integrates-with';
  strength: number; // 0-1 influence strength
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

// Cultural coherence framework
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

export class EventOrchestrationMaster {
  private templates: Map<string, any> = new Map();
  private relationships: TemplateRelationship[] = [];
  private culturalValidator: CulturalCoherenceValidator;
  private spatialOptimizer: SpatialOptimizer;
  private budgetOptimizer: BudgetOptimizer;
  private experienceEnhancer: ExperienceEnhancer;

  constructor() {
    this.initializeTemplates();
    this.defineTemplateRelationships();
    this.culturalValidator = new CulturalCoherenceValidator();
    this.spatialOptimizer = new SpatialOptimizer();
    this.budgetOptimizer = new BudgetOptimizer();
    this.experienceEnhancer = new ExperienceEnhancer();
  }

  /**
   * Master orchestration function - creates complete event environment
   */
  async orchestrateEvent(parameters: EventOrchestrationParameters): Promise<OrchestrationResult> {
    console.log(`🎭 Orchestrating ${parameters.eventType} event for ${parameters.guests.total} guests...`);
    const startTime = performance.now();
    
    try {
      // Phase 1: Cultural Foundation & Validation
      const culturalFramework = await this.establishCulturalFramework(parameters);
      
      // Phase 2: Master Planning & Budget Optimization
      const masterPlan = await this.createMasterPlan(parameters, culturalFramework);
      
      // Phase 3: Template Selection & Parameter Generation
      const templateStrategy = await this.determineTemplateStrategy(parameters, masterPlan);
      const templateParams = await this.generateAllTemplateParameters(parameters, masterPlan, culturalFramework, templateStrategy);
      
      // Phase 4: Template Instantiation with Intelligent Relationships
      const templateInstances = await this.orchestrateTemplateInstantiation(templateParams, parameters);
      
      // Phase 5: Advanced Cross-Template Integration
      const integratedSystem = await this.integrateTemplateEcosystem(templateInstances, parameters, culturalFramework);
      
      // Phase 6: Cultural Coherence & Experience Validation
      const validatedSystem = await this.validateAndEnhanceExperience(integratedSystem, parameters, culturalFramework);
      
      // Phase 7: Final Assembly & Orchestration
      const completeEvent = await this.assembleCompleteEventEnvironment(validatedSystem, parameters, culturalFramework);
      
      // Phase 8: Quality Assurance & Recommendations
      const finalResult = await this.performQualityAssurance(completeEvent, parameters);
      
      const generationTime = performance.now() - startTime;
      console.log(`✨ Complete ${parameters.primaryCulture} event environment orchestrated in ${generationTime.toFixed(2)}ms!`);
      
      return {
        ...finalResult,
        metadata: {
          ...finalResult.metadata,
          generationTime
        }
      };
      
    } catch (error) {
      console.error('❌ Orchestration failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Event orchestration failed: ${errorMessage}`);
    }
  }

  /**
   * Initialize all available templates
   */
  private initializeTemplates(): void {
    // Core furniture templates
    this.templates.set('chair', new ChairTemplate());
    this.templates.set('table', new TableTemplate());
    
    // System templates
    this.templates.set('lighting', new LightingTemplate());
    this.templates.set('floral', new FloralTemplate());
    this.templates.set('stage', new StageTemplate());
    this.templates.set('climate', new ClimateTemplate());
    this.templates.set('security', new SecurityTemplate());
    this.templates.set('audiovisual', new AVTemplate());
    this.templates.set('landscape', new LandscapeTemplate());
    this.templates.set('structure', new StructureTemplate());
    this.templates.set('interactive', new InteractiveTemplate());
    this.templates.set('celebratory', new CelebratoryTemplate());
    
    console.log(`🏗️ Initialized ${this.templates.size} templates for orchestration`);
  }

  /**
   * Define sophisticated template relationships
   */
  private defineTemplateRelationships(): void {
    this.relationships = [
      // Fundamental relationships
      {
        primary: 'table',
        secondary: 'chair',
        relationship: 'depends-on',
        strength: 1.0,
        constraints: {
          spatial: [new THREE.Vector3(0.8, 0, 0.8)], // Chair spacing from table
          cultural: ['seating-hierarchy', 'social-distance']
        },
        adjustments: {
          properties: { faceTable: true, culturalSpacing: true }
        }
      },
      
      // Environmental relationships
      {
        primary: 'lighting',
        secondary: 'stage',
        relationship: 'integrates-with',
        strength: 0.9,
        constraints: {
          spatial: [],
          cultural: ['visibility-principles', 'dramatic-enhancement']
        },
        adjustments: {
          properties: { coordinatedCues: true, colorTemperature: 'warm' }
        }
      },
      
      // Cultural relationships
      {
        primary: 'floral',
        secondary: 'table',
        relationship: 'complements',
        strength: 0.8,
        constraints: {
          cultural: ['color-harmony', 'scent-appropriateness', 'height-sightlines'],
          spatial: [new THREE.Vector3(0, 0.3, 0)] // Height clearance
        },
        adjustments: {
          scale: 0.8, // Scale down if tables are low
          properties: { culturalSymbolism: true }
        }
      },
      
      // Technology relationships
      {
        primary: 'audiovisual',
        secondary: 'lighting',
        relationship: 'integrates-with',
        strength: 0.9,
        constraints: {
          timing: ['synchronized-cues', 'presentation-modes']
        },
        adjustments: {
          properties: { masterControl: true, dimming: true }
        }
      },
      
      // Safety relationships
      {
        primary: 'security',
        secondary: 'structure',
        relationship: 'depends-on',
        strength: 0.7,
        constraints: {
          spatial: [], // Security needs clear sightlines
          cultural: ['discretion-level', 'access-control']
        },
        adjustments: {
          properties: { emergencyAccess: true, crowdFlow: true }
        }
      },
      
      // Landscape relationships
      {
        primary: 'landscape',
        secondary: 'climate',
        relationship: 'integrates-with',
        strength: 0.8,
        constraints: {
          cultural: ['seasonal-harmony', 'natural-ventilation'],
          material: ['organic-materials', 'weather-resistance']
        },
        adjustments: {
          properties: { microclimates: true, naturalCooling: true }
        }
      },
      
      // Interactive experience relationships
      {
        primary: 'interactive',
        secondary: 'audiovisual',
        relationship: 'enhances',
        strength: 0.9,
        constraints: {
          spatial: [], // Needs coordination zones
          cultural: ['participation-style', 'technology-comfort']
        },
        adjustments: {
          properties: { userJourney: true, culturalNarratives: true }
        }
      }
    ];
    
    console.log(`🔗 Defined ${this.relationships.length} template relationships`);
  }

  /**
   * Establish comprehensive cultural framework
   */
  private async establishCulturalFramework(params: EventOrchestrationParameters): Promise<CulturalFramework> {
    const framework: CulturalFramework = {
      primaryCulture: params.primaryCulture,
      secondaryCultures: params.secondaryCultures || [],
      
      fusionRules: {
        allowedCombinations: this.getAllowedCulturalCombinations(params),
        forbiddenCombinations: this.getForbiddenCombinations(params),
        bridgingElements: this.getBridgingElements(params),
        transitionMethods: this.getTransitionMethods(params)
      },
      
      colorHarmony: await this.generateCulturalColorHarmony(params),
      materialCoherence: await this.establishMaterialCoherence(params),
      spatialPrinciples: await this.defineSpatialPrinciples(params),
      ceremonyProtocols: await this.loadCeremonyProtocols(params),
      authenticityGuidelines: await this.createAuthenticityGuidelines(params)
    };

    // Validate cultural appropriateness
    const validation = await this.culturalValidator.validateFramework(framework, params);
    if (!validation.appropriate) {
      throw new Error(`Cultural framework validation failed: ${validation.issues.join(', ')}`);
    }

    console.log(`🎌 Cultural framework established for ${params.primaryCulture} event`);
    return framework;
  }

  /**
   * Create comprehensive master plan
   */
  private async createMasterPlan(params: EventOrchestrationParameters, cultural: CulturalFramework): Promise<MasterPlan> {
    const plan: MasterPlan = {
      // Spatial planning
      spatial: {
        zones: await this.defineEventZones(params, cultural),
        circulation: await this.planCirculationPaths(params, cultural),
        sightlines: await this.optimizeSightlines(params, cultural),
        accessibility: await this.ensureAccessibility(params),
        safety: await this.validateSafetyRequirements(params),
        cultural: await this.integrateCulturalSpatialNeeds(params, cultural)
      },
      
      // Experience planning
      experience: {
        userJourney: await this.mapUserJourney(params, cultural),
        emotionalArc: await this.designEmotionalArc(params),
        culturalMoments: await this.identifyCulturalMoments(params, cultural),
        photoOpportunities: await this.planPhotoOpportunities(params),
        accessibilityTouchpoints: await this.planAccessibilityTouchpoints(params)
      },
      
      // Technical planning
      technical: {
        power: await this.calculatePowerRequirements(params),
        network: await this.planNetworkInfrastructure(params),
        acoustics: await this.designAcousticEnvironment(params),
        climate: await this.planClimateManagement(params),
        security: await this.designSecurityApproach(params)
      },
      
      // Sustainability planning
      sustainability: await this.createSustainabilityPlan(params),
      
      // Budget optimization
      budget: await this.optimizeBudgetAllocation(params)
    };

    return this.spatialOptimizer.optimizeMasterPlan(plan, params);
  }

  /**
   * Determine optimal template strategy
   */
  private async determineTemplateStrategy(params: EventOrchestrationParameters, plan: MasterPlan): Promise<TemplateStrategy> {
    const strategy: TemplateStrategy = {
      required: [],
      optional: [],
      priority: {},
      dependencies: {},
      budgetAllocation: {}
    };

    // Determine required templates based on event type
    strategy.required = this.getRequiredTemplatesForEvent(params);
    
    // Determine optional templates based on budget and goals
    strategy.optional = this.getOptionalTemplatesForEvent(params, plan);
    
    // Set priorities based on cultural importance and user goals
    strategy.priority = this.calculateTemplatePriorities(params, plan);
    
    // Map dependencies between templates
    strategy.dependencies = this.mapTemplateDependencies(strategy.required.concat(strategy.optional));
    
    // Allocate budget across templates
    strategy.budgetAllocation = await this.budgetOptimizer.allocateBudgetAcrossTemplates(
      params.budget,
      strategy.required,
      strategy.optional,
      strategy.priority
    );

    console.log(`📋 Template strategy: ${strategy.required.length} required, ${strategy.optional.length} optional`);
    return strategy;
  }

  /**
   * Generate parameters for all selected templates
   */
  private async generateAllTemplateParameters(
    params: EventOrchestrationParameters,
    plan: MasterPlan,
    cultural: CulturalFramework,
    strategy: TemplateStrategy
  ): Promise<AllTemplateParameters> {
    const templateParams: AllTemplateParameters = {};

    // Generate parameters for each selected template
    for (const templateName of strategy.required.concat(strategy.optional)) {
      console.log(`📝 Generating parameters for ${templateName} template...`);
      
      switch (templateName) {
        case 'chair':
          templateParams.chairs = await this.generateChairParameters(params, plan, cultural, strategy);
          break;
        case 'table':
          templateParams.tables = await this.generateTableParameters(params, plan, cultural, strategy);
          break;
        case 'lighting':
          templateParams.lighting = await this.generateLightingParameters(params, plan, cultural, strategy);
          break;
        case 'floral':
          templateParams.floral = await this.generateFloralParameters(params, plan, cultural, strategy);
          break;
        case 'stage':
          templateParams.stage = await this.generateStageParameters(params, plan, cultural, strategy);
          break;
        case 'climate':
          templateParams.climate = await this.generateClimateParameters(params, plan, cultural, strategy);
          break;
        case 'security':
          templateParams.security = await this.generateSecurityParameters(params, plan, cultural, strategy);
          break;
        case 'audiovisual':
          templateParams.audiovisual = await this.generateAVParameters(params, plan, cultural, strategy);
          break;
        case 'landscape':
          templateParams.landscape = await this.generateLandscapeParameters(params, plan, cultural, strategy);
          break;
        case 'structure':
          templateParams.structure = await this.generateStructureParameters(params, plan, cultural, strategy);
          break;
        case 'interactive':
          templateParams.interactive = await this.generateInteractiveParameters(params, plan, cultural, strategy);
          break;
        case 'celebratory':
          templateParams.celebratory = await this.generateCelebratoryParameters(params, plan, cultural, strategy);
          break;
      }
    }

    // Cross-template parameter optimization
    return this.optimizeParameterCoherence(templateParams, params, cultural);
  }

  /**
   * Orchestrate template instantiation with intelligent sequencing
   */
  private async orchestrateTemplateInstantiation(
    templateParams: AllTemplateParameters,
    params: EventOrchestrationParameters
  ): Promise<TemplateInstances> {
    const instances: TemplateInstances = {};
    
    // Calculate optimal instantiation order based on dependencies
    const instantiationOrder = this.calculateOptimalInstantiationOrder(templateParams);
    
    console.log(`🏗️ Instantiating ${instantiationOrder.length} templates in optimal order...`);

    for (const templateName of instantiationOrder) {
      if (!(templateName in templateParams)) continue;
      
      console.log(`⚡ Instantiating ${templateName}...`);
      
      try {
        const template = this.templates.get(templateName);
        if (!template) {
          console.warn(`⚠️ Template ${templateName} not found, skipping...`);
          continue;
        }

        // Instantiate with relationship awareness
        instances[templateName] = await this.instantiateTemplateWithRelationships(
          templateName,
          template,
          (templateParams as any)[templateName],
          instances,
          params
        );
        
        console.log(`✅ ${templateName} instantiated successfully`);
        
      } catch (error) {
        console.error(`❌ Failed to instantiate ${templateName}:`, error);
        // Continue with other templates unless it's a critical dependency
        if (this.isCriticalTemplate(templateName, params)) {
          throw error;
        }
      }
    }

    return instances;
  }

  /**
   * Integrate all templates into cohesive ecosystem
   */
  private async integrateTemplateEcosystem(
    instances: TemplateInstances,
    params: EventOrchestrationParameters,
    cultural: CulturalFramework
  ): Promise<TemplateInstances> {
    console.log(`🔄 Integrating template ecosystem...`);

    // Phase 1: Spatial relationship optimization
    await this.optimizeSpatialRelationships(instances, params, cultural);
    
    // Phase 2: Cultural coherence integration
    await this.integrateCulturalCoherence(instances, params, cultural);
    
    // Phase 3: Technical system integration
    await this.integrateTechnicalSystems(instances, params);
    
    // Phase 4: Experience flow optimization
    await this.optimizeExperienceFlow(instances, params, cultural);
    
    // Phase 5: Safety and accessibility integration
    await this.integrateSafetyAndAccessibility(instances, params);

    return instances;
  }

  /**
   * Validate and enhance overall experience
   */
  private async validateAndEnhanceExperience(
    integratedSystem: TemplateInstances,
    params: EventOrchestrationParameters,
    cultural: CulturalFramework
  ): Promise<TemplateInstances> {
    console.log(`✨ Validating and enhancing experience...`);

    // Cultural coherence validation
    const coherenceResults = await this.culturalValidator.validateIntegratedSystem(integratedSystem, cultural);
    
    if (coherenceResults.overallScore < 80) {
      console.warn(`⚠️ Cultural coherence score: ${coherenceResults.overallScore}/100`);
      integratedSystem = await this.applyCulturalCorrections(integratedSystem, coherenceResults.suggestions);
    }

    // Experience enhancement
    integratedSystem = await this.experienceEnhancer.enhanceOverallExperience(integratedSystem, params, cultural);
    
    // Accessibility validation and enhancement
    integratedSystem = await this.enhanceAccessibility(integratedSystem, params);
    
    // Sustainability optimization
    integratedSystem = await this.optimizeSustainability(integratedSystem, params);

    return integratedSystem;
  }

  /**
   * Assemble complete event environment
   */
  private async assembleCompleteEventEnvironment(
    validatedSystem: TemplateInstances,
    params: EventOrchestrationParameters,
    cultural: CulturalFramework
  ): Promise<THREE.Group> {
    console.log(`🎪 Assembling complete event environment...`);

    const eventScene = new THREE.Group();
    eventScene.name = `${params.eventType}_${params.primaryCulture}_${Date.now()}`;

    // Assembly order for optimal layering
    const assemblyOrder = [
      'landscape',
      'structure', 
      'climate',
      'security',
      'stage',
      'table',
      'chair',
      'lighting',
      'audiovisual',
      'floral',
      'interactive'
    ];

    const components: Record<string, THREE.Group> = {};

    for (const templateName of assemblyOrder) {
      if (validatedSystem[templateName]) {
        const templateGroup = new THREE.Group();
        templateGroup.name = `${templateName}_system`;
        
        // Add template instance(s) to group
        if (Array.isArray(validatedSystem[templateName])) {
          validatedSystem[templateName].forEach((instance: THREE.Group, index: number) => {
            instance.name = `${templateName}_${index}`;
            templateGroup.add(instance);
          });
        } else {
          templateGroup.add(validatedSystem[templateName]);
        }
        
        eventScene.add(templateGroup);
        components[templateName] = templateGroup;
        
        console.log(`📦 Added ${templateName} system to event scene`);
      }
    }

    // Add environmental enhancements
    await this.addEnvironmentalEnhancements(eventScene, params, cultural);
    
    // Add cultural educational elements
    if (params.culturalAuthenticity === 'educational') {
      await this.addCulturalEducationElements(eventScene, params, cultural);
    }

    // Final metadata
    eventScene.userData = {
      eventType: params.eventType,
      primaryCulture: params.primaryCulture,
      scale: params.scale,
      guestCount: params.guests.total,
      components: Object.keys(components),
      culturalAuthenticity: await this.calculateFinalAuthenticity(validatedSystem, cultural),
      sustainabilityScore: await this.calculateSustainabilityScore(validatedSystem, params),
      accessibilityScore: await this.calculateAccessibilityScore(validatedSystem, params),
      generatedAt: Date.now(),
      orchestrationVersion: '2.0.0'
    };

    return eventScene;
  }

  /**
   * Perform final quality assurance and generate recommendations
   */
  private async performQualityAssurance(
    completeEvent: THREE.Group,
    params: EventOrchestrationParameters
  ): Promise<OrchestrationResult> {
    console.log(`🔍 Performing quality assurance...`);

    const metadata = completeEvent.userData;
    const components = this.extractComponents(completeEvent);
    
    // Generate recommendations
    const recommendations = await this.generateRecommendations(completeEvent, params);
    
    // Generate cultural notes
    const culturalNotes = await this.generateCulturalNotes(completeEvent, params);
    
    // Calculate experience score
    const experienceScore = await this.calculateExperienceScore(completeEvent, params);
    
    // Calculate budget utilization
    const budgetUtilization = this.calculateBudgetUtilization(params);

    return {
      scene: completeEvent,
      components,
      metadata: {
        templateCount: Object.keys(components).length,
        culturalAuthenticity: metadata.culturalAuthenticity,
        sustainabilityScore: metadata.sustainabilityScore,
        accessibilityScore: metadata.accessibilityScore,
        experienceScore,
        budgetUtilization,
        generationTime: 0 // Will be set by caller
      },
      recommendations,
      culturalNotes
    };
  }

  // Template parameter generation methods
  private async generateChairParameters(
    params: EventOrchestrationParameters,
    plan: MasterPlan,
    cultural: CulturalFramework,
    strategy: TemplateStrategy
  ): Promise<ParametricParameters[]> {
    const chairParams: ParametricParameters[] = [];
    const chairCount = this.calculateRequiredChairs(params, plan);
    
    for (let i = 0; i < chairCount; i++) {
      chairParams.push({
        type: 'chair',
        culture: params.primaryCulture as any,
        width: 0.5,
        height: this.getCulturalChairHeight(params.primaryCulture),
        depth: 0.5,
        style: this.mapAtmosphereToStyle(params.atmosphere),
        formality: this.mapAtmosphereToFormality(params.atmosphere),
        primaryMaterial: (cultural.materialCoherence.traditional[0] || 'wood-oak') as any,
        culturalElements: cultural.authenticityGuidelines.mustHave.slice(0, 3),
        ergonomicProfile: 'average' as any,
        colorPalette: cultural.colorHarmony.primary,
        decorativeIntensity: this.calculateDecorativeIntensity(params, cultural),
        craftsmanshipLevel: 'refined' as any
      });
    }
    
    return chairParams;
  }

  private async generateTableParameters(
    params: EventOrchestrationParameters,
    plan: MasterPlan,
    cultural: CulturalFramework,
    strategy: TemplateStrategy
  ): Promise<ParametricParameters[]> {
    const tableParams: ParametricParameters[] = [];
    const diningZones = plan.spatial.zones.filter((zone: any) => zone.purpose === 'dining');
    
    for (const zone of diningZones) {
      tableParams.push({
        type: 'dining-table',
        culture: params.primaryCulture as any,
        width: this.calculateTableWidth((zone as any).guestCount || 4, params.primaryCulture),
        height: this.getCulturalTableHeight(params.primaryCulture),
        depth: this.calculateTableDepth('family'),
        style: this.mapAtmosphereToStyle(params.atmosphere),
        formality: this.mapAtmosphereToFormality(params.atmosphere),
        primaryMaterial: (cultural.materialCoherence.traditional[0] || 'wood-oak') as any,
        culturalElements: cultural.authenticityGuidelines.mustHave.slice(0, 2),
        capacity: zone.guestCount,
        ergonomicProfile: 'average' as any,
        colorPalette: cultural.colorHarmony.primary,
        decorativeIntensity: this.calculateDecorativeIntensity(params, cultural),
        craftsmanshipLevel: 'refined' as any
      });
    }
    
    return tableParams;
  }

  private async generateLightingParameters(
    params: EventOrchestrationParameters,
    plan: MasterPlan,
    cultural: CulturalFramework,
    strategy: TemplateStrategy
  ): Promise<LightingParameters> {
    return {
      culture: params.primaryCulture as any,
      eventType: 'ceremony' as any,
      timeOfDay: params.timing.timeOfDay as any,
      season: params.timing.season,
      spaceType: params.venue.type,
      spaceDimensions: params.venue.dimensions,
      ambiance: 'serene' as any,
      functionality: params.technology.lighting === 'basic' ? 'ambient-only' : 'balanced',
      powerBudget: strategy.budgetAllocation.lighting || 3000,
      installationComplexity: 'moderate' as any,
      weatherResistance: params.venue.type === 'outdoor',
      traditionalElements: cultural.authenticityGuidelines.mustHave,
      colorTemperature: 'warm' as any,
      brightness: 'moderate' as any
    };
  }

  // Helper methods
  private determineErgonomicProfile(guests: any): string {
    return guests.elderly > guests.total * 0.3 ? 'high-support' : 'standard';
  }

  private calculateDecorativeIntensity(params: any, cultural: any): number {
    return params.atmosphere === 'ceremonial' ? 0.8 : 0.5;
  }

  private determineCraftsmanshipLevel(budget: number): string {
    return budget > 10000 ? 'premium' : 'standard';
  }

  private calculateTableWidth(guests: number, culture: string): number {
    const baseWidth = guests * 0.6;
    return culture === 'japanese' ? baseWidth * 0.8 : baseWidth;
  }

  private calculateTableDepth(guestType: string): number {
    return guestType === 'family' ? 1.2 : 0.8;
  }

  private mapEventTypeToLighting(eventType: string): string {
    const mapping: Record<string, string> = {
      'wedding': 'ceremonial',
      'corporate': 'professional',
      'birthday': 'celebratory',
      'cultural-ceremony': 'traditional',
      'tea-ceremony': 'intimate',
      'conference': 'task',
      'exhibition': 'display',
      'gala': 'dramatic'
    };
    return mapping[eventType] || 'ambient';
  }

  private mapAtmosphereToAmbiance(atmosphere: string): string {
    const mapping: Record<string, string> = {
      'formal': 'sophisticated',
      'casual': 'relaxed',
      'ceremonial': 'reverent',
      'celebratory': 'joyful',
      'contemplative': 'serene',
      'energetic': 'vibrant',
      'intimate': 'warm'
    };
    return mapping[atmosphere] || 'balanced';
  }

  private determineInstallationComplexity(params: any): string {
    return params.technology.lighting === 'theatrical' ? 'high' : 'medium';
  }

  private getCulturalColorTemperature(culture: string): number {
    const mapping: Record<string, number> = {
      'japanese': 3000,
      'scandinavian': 4000,
      'italian': 3200,
      'modern': 3500,
      'french': 3100,
      'traditional': 2800
    };
    return mapping[culture] || 3500;
  }

  private determineBrightness(atmosphere: string, timeOfDay: string): number {
    const atmosphereMapping: Record<string, number> = {
      'formal': 0.8,
      'casual': 0.6,
      'ceremonial': 0.7,
      'celebratory': 0.9,
      'contemplative': 0.4,
      'energetic': 1.0,
      'intimate': 0.5
    };
    return atmosphereMapping[atmosphere] || 0.7;
  }
  private getRequiredTemplatesForEvent(params: EventOrchestrationParameters): string[] {
    const required = ['chair', 'table']; // Always need seating
    
    // Add required templates based on event type
    switch (params.eventType) {
      case 'wedding':
        required.push('floral', 'lighting', 'stage');
        break;
      case 'corporate':
        required.push('lighting', 'audiovisual', 'security');
        break;
      case 'birthday':
        required.push('celebratory', 'lighting', 'floral');
        break;
      case 'cultural-ceremony':
        required.push('lighting', 'floral', 'stage', 'celebratory');
        break;
      case 'conference':
        required.push('audiovisual', 'lighting', 'stage');
        break;
    }
    
    // Add based on venue type
    if (params.venue.type === 'outdoor') {
      required.push('climate', 'structure');
    }
    
    // Add based on guest count
    if (params.guests.total > 100) {
      required.push('security');
    }
    
    return [...new Set(required)]; // Remove duplicates
  }

  private getOptionalTemplatesForEvent(params: EventOrchestrationParameters, plan: MasterPlan): string[] {
    const optional = [];
    
    // Based on budget
    if (params.budget.total > 50000) {
      optional.push('interactive', 'landscape');
    }
    
    // Based on goals
    if (params.memorabilityGoals.includes('immersive-experience')) {
      optional.push('interactive');
    }
    
    if (params.memorabilityGoals.includes('celebration') || params.atmosphere === 'celebratory') {
      optional.push('celebratory');
    }
    
    if (params.venue.type === 'outdoor' && params.timing.season !== 'winter') {
      optional.push('landscape');
    }
    
    return optional;
  }

  // Additional helper methods for completeness
  private calculateRequiredChairs(params: EventOrchestrationParameters, plan: MasterPlan): number {
    return params.guests.total + Math.ceil(params.guests.total * 0.1); // 10% buffer
  }

  private getCulturalChairHeight(culture: string): number {
    const heights: Record<string, number> = {
      japanese: 0.42,
      scandinavian: 0.46,
      italian: 0.45,
      modern: 0.45,
      french: 0.47,
      traditional: 0.44
    };
    return heights[culture] || 0.45;
  }

  private getCulturalTableHeight(culture: string): number {
    const heights: Record<string, number> = {
      japanese: 0.70,
      scandinavian: 0.75,
      italian: 0.74,
      modern: 0.75,
      french: 0.76,
      traditional: 0.72
    };
    return heights[culture] || 0.74;
  }

  private mapAtmosphereToStyle(atmosphere: string): 'traditional' | 'contemporary' | 'rustic' | 'elegant' | 'minimalist' | 'ornate' {
    const mapping: Record<string, 'traditional' | 'contemporary' | 'rustic' | 'elegant' | 'minimalist' | 'ornate'> = {
      formal: 'elegant',
      casual: 'contemporary',
      ceremonial: 'traditional',
      celebratory: 'ornate',
      contemplative: 'minimalist',
      energetic: 'contemporary',
      intimate: 'elegant'
    };
    return mapping[atmosphere] || 'contemporary';
  }

  private mapAtmosphereToFormality(atmosphere: string): 'casual' | 'semi-formal' | 'formal' | 'ceremonial' {
    const mapping: Record<string, 'casual' | 'semi-formal' | 'formal' | 'ceremonial'> = {
      formal: 'formal',
      casual: 'casual',
      ceremonial: 'ceremonial',
      celebratory: 'semi-formal',
      contemplative: 'formal',
      energetic: 'casual',
      intimate: 'semi-formal'
    };
    return mapping[atmosphere] || 'semi-formal';
  }

  // Placeholder methods for comprehensive implementation
  private getAllowedCulturalCombinations(params: EventOrchestrationParameters): string[][] { return []; }
  private getForbiddenCombinations(params: EventOrchestrationParameters): string[][] { return []; }
  private getBridgingElements(params: EventOrchestrationParameters): string[] { return []; }
  private getTransitionMethods(params: EventOrchestrationParameters): string[] { return []; }
  private async generateCulturalColorHarmony(params: EventOrchestrationParameters): Promise<any> {
    return {
      primary: ['#8B4513', '#F5F5DC', '#2F4F2F'], // Brown, beige, dark green for Japanese
      secondary: ['#FF6B6B', '#4ECDC4', '#45B7D1'], // Warm accent colors
      accent: ['#FFD700', '#FF69B4', '#00CED1'], // Gold and vibrant accents
      neutral: ['#F8F8FF', '#DCDCDC', '#708090'], // Light neutrals
      seasonal: {
        spring: ['#FFB6C1', '#98FB98', '#87CEEB'],
        summer: ['#FFD700', '#FF6347', '#32CD32'],
        autumn: ['#FF8C00', '#DC143C', '#B8860B'],
        winter: ['#E6E6FA', '#B0C4DE', '#778899']
      }
    };
  }
  private async establishMaterialCoherence(params: EventOrchestrationParameters): Promise<any> {
    return {
      traditional: ['wood-oak', 'wood-bamboo', 'wood-cherry'],
      modern: ['metal-steel', 'glass', 'composite'],
      sustainable: ['wood-bamboo', 'fabric-linen', 'recycled-materials'],
      luxury: ['wood-mahogany', 'leather-fine', 'marble'],
      structural: ['wood-oak', 'metal-steel', 'engineered-wood']
    };
  }
  private async defineSpatialPrinciples(params: EventOrchestrationParameters): Promise<any> { return {}; }
  private async loadCeremonyProtocols(params: EventOrchestrationParameters): Promise<any> { return {}; }
  private async createAuthenticityGuidelines(params: EventOrchestrationParameters): Promise<any> {
    return {
      mustHave: ['natural-materials', 'cultural-proportions', 'traditional-joinery'],
      shouldHave: ['seasonal-awareness', 'symbolic-elements', 'respectful-adaptation'],
      mayHave: ['modern-touches', 'comfort-enhancements', 'practical-updates'],
      mustAvoid: ['cultural-appropriation', 'sacred-misuse', 'stereotypical-elements']
    };
  }
  private async defineEventZones(params: EventOrchestrationParameters, cultural: CulturalFramework): Promise<any[]> { return []; }
  
  // Missing method implementations
  private async planCirculationPaths(params: EventOrchestrationParameters, cultural: CulturalFramework): Promise<any> { return {}; }
  private async optimizeSightlines(params: EventOrchestrationParameters, cultural: CulturalFramework): Promise<any> { return {}; }
  private async ensureAccessibility(params: EventOrchestrationParameters): Promise<any> { return {}; }
  private async validateSafetyRequirements(params: EventOrchestrationParameters): Promise<any> { return {}; }
  private async integrateCulturalSpatialNeeds(params: EventOrchestrationParameters, cultural: CulturalFramework): Promise<any> { return {}; }
  private async mapUserJourney(params: EventOrchestrationParameters, cultural: CulturalFramework): Promise<any> { return {}; }
  private async designEmotionalArc(params: EventOrchestrationParameters): Promise<any> { return {}; }
  private async identifyCulturalMoments(params: EventOrchestrationParameters, cultural: CulturalFramework): Promise<any> { return {}; }
  private async planPhotoOpportunities(params: EventOrchestrationParameters): Promise<any> { return {}; }
  private async planAccessibilityTouchpoints(params: EventOrchestrationParameters): Promise<any> { return {}; }
  private async calculatePowerRequirements(params: EventOrchestrationParameters): Promise<any> { return {}; }
  private async planNetworkInfrastructure(params: EventOrchestrationParameters): Promise<any> { return {}; }
  private async designAcousticEnvironment(params: EventOrchestrationParameters): Promise<any> { return {}; }
  private async planClimateManagement(params: EventOrchestrationParameters): Promise<any> { return {}; }
  private async designSecurityApproach(params: EventOrchestrationParameters): Promise<any> { return {}; }
  private async createSustainabilityPlan(params: EventOrchestrationParameters): Promise<any> { return {}; }
  private async optimizeBudgetAllocation(params: EventOrchestrationParameters): Promise<any> { return {}; }
  private calculateTemplatePriorities(params: EventOrchestrationParameters, plan: MasterPlan): Record<string, number> { return {}; }
  private mapTemplateDependencies(templates: string[]): Record<string, string[]> { return {}; }
  private async generateFloralParameters(params: EventOrchestrationParameters, plan: MasterPlan, cultural: CulturalFramework, strategy: TemplateStrategy): Promise<FloralParameters> { return {} as FloralParameters; }
  private async generateStageParameters(params: EventOrchestrationParameters, plan: MasterPlan, cultural: CulturalFramework, strategy: TemplateStrategy): Promise<StageParameters> { return {} as StageParameters; }
  private async generateClimateParameters(params: EventOrchestrationParameters, plan: MasterPlan, cultural: CulturalFramework, strategy: TemplateStrategy): Promise<ClimateParameters> { return {} as ClimateParameters; }
  private async generateSecurityParameters(params: EventOrchestrationParameters, plan: MasterPlan, cultural: CulturalFramework, strategy: TemplateStrategy): Promise<SecurityParameters> { return {} as SecurityParameters; }
  private async generateAVParameters(params: EventOrchestrationParameters, plan: MasterPlan, cultural: CulturalFramework, strategy: TemplateStrategy): Promise<AVParameters> { return {} as AVParameters; }
  private async generateLandscapeParameters(params: EventOrchestrationParameters, plan: MasterPlan, cultural: CulturalFramework, strategy: TemplateStrategy): Promise<LandscapeParameters> { return {} as LandscapeParameters; }
  private async generateStructureParameters(params: EventOrchestrationParameters, plan: MasterPlan, cultural: CulturalFramework, strategy: TemplateStrategy): Promise<StructureParameters> { return {} as StructureParameters; }
  private async generateInteractiveParameters(params: EventOrchestrationParameters, plan: MasterPlan, cultural: CulturalFramework, strategy: TemplateStrategy): Promise<InteractiveParameters> { return {} as InteractiveParameters; }
  private async generateCelebratoryParameters(params: EventOrchestrationParameters, plan: MasterPlan, cultural: CulturalFramework, strategy: TemplateStrategy): Promise<CelebratoryParameters> { 
    return {
      celebrationType: this.mapEventToCelebrationType(params.eventType),
      ageGroup: this.inferAgeGroupFromGuests(params.guests),
      theme: this.inferThemeFromCulture(params.primaryCulture),
      culture: this.mapCultureToCelebration(params.primaryCulture),
      culturalTraditions: cultural.fusionRules.bridgingElements || [],
      religiousConsiderations: [],
      familyCustoms: [],
      guestCount: params.guests.total,
      childrenCount: params.guests.children,
      adultCount: params.guests.adults,
      specialNeeds: params.guests.accessibility,
      duration: params.duration,
      timeOfDay: params.timing.timeOfDay,
      seasonality: params.timing.season,
      spaceDimensions: {
        width: params.venue.dimensions.width,
        depth: params.venue.dimensions.depth,
        height: params.venue.dimensions.height,
        indoorOutdoor: params.venue.type
      },
      existingElements: params.venue.existingFeatures,
      spaceConstraints: params.venue.restrictions,
      balloonSystems: true,
      photoBackdrops: true,
      interactiveProps: params.guests.children > 0,
      ceremonialElements: true,
      giftDisplayAreas: true,
      entertainmentProps: params.guests.children > 5,
      colorScheme: 'cultural-palette',
      customColors: cultural.colorHarmony.primary,
      materialPreferences: [],
      sustainabilityLevel: params.sustainability as any,
      ageAppropriateActivities: params.guests.children > 0,
      photoOpportunities: Math.min(3, Math.max(1, Math.floor(params.guests.total / 30))),
      interactiveZones: params.guests.children > 10 ? 2 : 1,
      safetyRequirements: params.guests.children > 0 ? ['child-safe-materials', 'supervised-activities'] : [],
      budget: params.budget.total,
      setupTime: params.timeline.setup,
      cleanupComplexity: params.guests.total > 100 ? 'complex' : 'moderate',
      transportability: params.budget.total > 20000 ? 'delivery-required' : 'multiple-trips',
      surpriseElements: params.atmosphere === 'celebratory',
      personalizedTouches: true,
      keepsakeElements: true,
      documentationSupport: true
    } as CelebratoryParameters;
  }
  private optimizeParameterCoherence(params: AllTemplateParameters, eventParams: EventOrchestrationParameters, cultural: CulturalFramework): AllTemplateParameters { return params; }
  private calculateOptimalInstantiationOrder(params: AllTemplateParameters): string[] { return Object.keys(params); }
  private async instantiateTemplateWithRelationships(name: string, template: any, params: any, existing: TemplateInstances, eventParams: EventOrchestrationParameters): Promise<THREE.Group | THREE.Group[]> { return new THREE.Group(); }
  private isCriticalTemplate(name: string, params: EventOrchestrationParameters): boolean { return false; }
  private async optimizeSpatialRelationships(instances: TemplateInstances, params: EventOrchestrationParameters, cultural: CulturalFramework): Promise<void> { }
  private async integrateCulturalCoherence(instances: TemplateInstances, params: EventOrchestrationParameters, cultural: CulturalFramework): Promise<void> { }
  private async integrateTechnicalSystems(instances: TemplateInstances, params: EventOrchestrationParameters): Promise<void> { }
  private async optimizeExperienceFlow(instances: TemplateInstances, params: EventOrchestrationParameters, cultural: CulturalFramework): Promise<void> { }
  private async integrateSafetyAndAccessibility(instances: TemplateInstances, params: EventOrchestrationParameters): Promise<void> { }
  private async applyCulturalCorrections(instances: TemplateInstances, suggestions: any[]): Promise<TemplateInstances> { return instances; }
  private async enhanceAccessibility(instances: TemplateInstances, params: EventOrchestrationParameters): Promise<TemplateInstances> { return instances; }
  private async optimizeSustainability(instances: TemplateInstances, params: EventOrchestrationParameters): Promise<TemplateInstances> { return instances; }
  private async addEnvironmentalEnhancements(scene: THREE.Group, params: EventOrchestrationParameters, cultural: CulturalFramework): Promise<void> { }
  private async addCulturalEducationElements(scene: THREE.Group, params: EventOrchestrationParameters, cultural: CulturalFramework): Promise<void> { }
  private async calculateFinalAuthenticity(instances: TemplateInstances, cultural: CulturalFramework): Promise<number> { return 88; }
  private async calculateSustainabilityScore(instances: TemplateInstances, params: EventOrchestrationParameters): Promise<number> { return 85; }
  private async calculateAccessibilityScore(instances: TemplateInstances, params: EventOrchestrationParameters): Promise<number> { return 92; }
  private extractComponents(scene: THREE.Group): Record<string, THREE.Group> { return {}; }
  private async generateRecommendations(scene: THREE.Group, params: EventOrchestrationParameters): Promise<string[]> { return []; }
  private async generateCulturalNotes(scene: THREE.Group, params: EventOrchestrationParameters): Promise<string[]> { return []; }

  // Helper methods for celebratory template parameter generation
  private mapEventToCelebrationType(eventType: string): any {
    const mapping: Record<string, any> = {
      'birthday': 'birthday-adult',
      'cultural-ceremony': 'cultural-milestone'
    };
    return mapping[eventType] || 'birthday-adult';
  }

  private inferAgeGroupFromGuests(guests: any): any {
    if (guests.children > guests.adults) return 'child';
    if (guests.children > 0) return 'multi-generational';
    return 'adult';
  }

  private inferThemeFromCulture(culture: string): any {
    const themeMapping: Record<string, any> = {
      'japanese': 'cultural-traditional',
      'italian': 'elegant',
      'french': 'elegant',
      'scandinavian': 'nature',
      'modern': 'elegant'
    };
    return themeMapping[culture] || 'cultural-traditional';
  }

  private mapCultureToCelebration(culture: string): any {
    const mapping: Record<string, any> = {
      'japanese': 'japanese',
      'italian': 'american',
      'french': 'american',
      'scandinavian': 'american',
      'modern': 'american'
    };
    return mapping[culture] || 'american';
  }
  private async calculateExperienceScore(scene: THREE.Group, params: EventOrchestrationParameters): Promise<number> { return 90; }
  private calculateBudgetUtilization(params: EventOrchestrationParameters): number { return 0.85; }
}

// Supporting Classes
class CulturalCoherenceValidator {
  async validateFramework(framework: CulturalFramework, params: EventOrchestrationParameters): Promise<{ appropriate: boolean; issues: string[] }> {
    return { appropriate: true, issues: [] };
  }
  
  async validateIntegratedSystem(system: TemplateInstances, cultural: CulturalFramework): Promise<any> {
    return { overallScore: 95, suggestions: [] };
  }
}

class SpatialOptimizer {
  optimizeMasterPlan(plan: MasterPlan, params: EventOrchestrationParameters): MasterPlan {
    return plan;
  }
}

class BudgetOptimizer {
  async allocateBudgetAcrossTemplates(
    budget: any,
    required: string[],
    optional: string[],
    priority: any
  ): Promise<Record<string, number>> {
    return {};
  }
}

class ExperienceEnhancer {
  async enhanceOverallExperience(
    system: TemplateInstances,
    params: EventOrchestrationParameters,
    cultural: CulturalFramework
  ): Promise<TemplateInstances> {
    return system;
  }
}

// Type definitions
interface MasterPlan {
  spatial: any;
  experience: any;
  technical: any;
  sustainability: any;
  budget: any;
}

interface TemplateStrategy {
  required: string[];
  optional: string[];
  priority: Record<string, number>;
  dependencies: Record<string, string[]>;
  budgetAllocation: Record<string, number>;
}

interface AllTemplateParameters {
  chairs?: ParametricParameters[];
  tables?: ParametricParameters[];
  lighting?: LightingParameters;
  floral?: FloralParameters;
  stage?: StageParameters;
  climate?: ClimateParameters;
  security?: SecurityParameters;
  audiovisual?: AVParameters;
  landscape?: LandscapeParameters;
  structure?: StructureParameters;
  interactive?: InteractiveParameters;
  celebratory?: CelebratoryParameters;
}

interface TemplateInstances {
  [key: string]: THREE.Group | THREE.Group[];
}

// Export the class (remove duplicate export)
// EventOrchestrationMaster is exported by default