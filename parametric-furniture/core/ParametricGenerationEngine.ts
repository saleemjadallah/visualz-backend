import * as THREE from 'three';
import { 
  ParametricParameters, 
  GenerationResult, 
  UserFurnitureRequest,
  AIFurnitureAnalysis,
  ParametricTemplate,
  OptimizationConstraints,
  FurnitureType,
  CultureType,
  MaterialType,
  FurnitureMetadata,
  AuthenticityScore,
  PerformanceMetrics,
  LightingParameters,
  FloralParameters,
  StageParameters,
  LandscapeParameters,
  StructureParameters,
  InteractiveParameters,
  TemplateParameters
} from '../types/index';
import { CulturalKnowledgeBase } from '../cultural/CulturalKnowledgeBase';
import { AIParameterAnalyzer } from '../ai-integration/AIParameterAnalyzer';
import { ParametricMaterialSystem } from '../materials/ParametricMaterialSystem';
import { ChairTemplate } from '../templates/seating/ChairTemplate';
import { TableTemplate } from '../templates/tables/TableTemplate';
import { LightingTemplate } from '../templates/lighting/LightingTemplate';
import { FloralTemplate } from '../templates/floral/FloralTemplate';
import { StageTemplate } from '../templates/stage/StageTemplate';
import { ClimateTemplate } from '../templates/climate/ClimateTemplate';
import { SecurityTemplate } from '../templates/security/SecurityTemplate';
import { AVTemplate } from '../templates/av/AVTemplate';
import { LandscapeTemplate } from '../templates/landscape/LandscapeTemplate';
import { StructureTemplate } from '../templates/structure/StructureTemplate';
import { InteractiveTemplate } from '../templates/interactive/InteractiveTemplate';

export class ParametricGenerationEngine {
  private templates: Map<FurnitureType, ParametricTemplate>;
  private lightingTemplate: LightingTemplate;
  private floralTemplate: FloralTemplate;
  private stageTemplate: StageTemplate;
  private climateTemplate: ClimateTemplate;
  private securityTemplate: SecurityTemplate;
  private avTemplate: AVTemplate;
  private landscapeTemplate: LandscapeTemplate;
  private structureTemplate: StructureTemplate;
  private interactiveTemplate: InteractiveTemplate;
  private culturalDB: CulturalKnowledgeBase;
  private aiAnalyzer: AIParameterAnalyzer;
  private materialSystem: ParametricMaterialSystem;
  private cache: Map<string, GenerationResult>;
  private performanceMetrics: Map<string, PerformanceMetrics[]>;

  constructor() {
    this.templates = new Map();
    this.lightingTemplate = new LightingTemplate();
    this.floralTemplate = new FloralTemplate();
    this.stageTemplate = new StageTemplate();
    this.climateTemplate = new ClimateTemplate();
    this.securityTemplate = new SecurityTemplate();
    this.avTemplate = new AVTemplate();
    this.landscapeTemplate = new LandscapeTemplate();
    this.structureTemplate = new StructureTemplate();
    this.interactiveTemplate = new InteractiveTemplate();
    this.culturalDB = new CulturalKnowledgeBase();
    this.aiAnalyzer = new AIParameterAnalyzer();
    this.materialSystem = new ParametricMaterialSystem();
    this.cache = new Map();
    this.performanceMetrics = new Map();
    
    this.initializeTemplates();
  }

  async generateFurnitureFromUserInput(userInput: UserFurnitureRequest): Promise<GenerationResult[]> {
    console.log('🤖 Starting AI analysis of user requirements...');
    
    try {
      // Step 1: AI analyzes user requirements and generates optimal parameters
      const aiParameters = await this.aiAnalyzer.analyzeUserRequirements(userInput);
      
      console.log('📊 AI analysis complete. Generating furniture pieces...');
      
      const results: GenerationResult[] = [];
      
      // Step 2: Generate each recommended furniture piece
      for (const furniturePiece of aiParameters.furniture_pieces) {
        console.log(`🛠️ Generating ${furniturePiece.type} (${furniturePiece.quantity}x)...`);
        
        for (let i = 0; i < furniturePiece.quantity; i++) {
          const result = await this.generateSinglePiece(furniturePiece.parameters);
          results.push(result);
        }
      }
      
      console.log('✅ Furniture generation complete!');
      return results;
      
    } catch (error) {
      console.error('❌ AI analysis failed, using fallback generation:', error);
      return this.generateFallbackFurniture(userInput);
    }
  }

  async generateSinglePiece(parameters: ParametricParameters): Promise<GenerationResult> {
    // Check cache first
    const cacheKey = this.generateCacheKey(parameters);
    if (this.cache.has(cacheKey)) {
      console.log('💾 Using cached result');
      return this.cache.get(cacheKey)!;
    }

    console.log(`🎨 Generating ${parameters.type} with ${parameters.culture} styling...`);
    
    const startTime = performance.now();
    
    try {
      // Step 1: Get appropriate template
      const template = this.templates.get(parameters.type);
      if (!template) {
        throw new Error(`No template available for furniture type: ${parameters.type}`);
      }

      // Step 2: Validate parameters
      if (!template.validateParameters(parameters)) {
        console.warn('⚠️ Invalid parameters detected, adjusting...');
        parameters = this.adjustInvalidParameters(parameters);
      }

      // Step 3: Validate cultural authenticity of parameters
      const culturalValidation = await this.validateCulturalParameters(parameters);
      if (culturalValidation.overall < 0.7) {
        console.warn('⚠️ Cultural authenticity below threshold, adjusting parameters...');
        parameters = await this.adjustForCulturalAuthenticity(parameters, culturalValidation);
      }

      // Step 4: Generate 3D geometry
      const geometry = template.generateGeometry(parameters);
      const geometryTime = performance.now() - startTime;

      // Step 5: Apply materials
      const materials = this.materialSystem.generateMaterials(parameters);
      this.applyMaterialsToGeometry(geometry, materials, parameters);

      // Step 6: Generate metadata
      const metadata = this.generateFurnitureMetadata(parameters);

      // Step 7: Calculate cultural authenticity score
      const authenticityScore = this.culturalDB.validateCulturalAuthenticity(parameters, {
        geometry,
        materials,
        metadata,
        culturalAuthenticity: { overall: 0, proportions: 0, materials: 0, construction: 0, aesthetics: 0, culturalElements: 0 },
        performanceMetrics: { generationTime: 0, polygonCount: 0, memoryUsage: 0 }
      });

      // Step 8: Calculate performance metrics
      const performanceMetrics = this.calculatePerformanceMetrics(geometry, geometryTime);

      const result: GenerationResult = {
        geometry,
        materials,
        metadata,
        culturalAuthenticity: authenticityScore,
        performanceMetrics
      };

      // Cache result
      this.cache.set(cacheKey, result);
      
      // Store performance metrics
      this.recordPerformanceMetrics(parameters.type, parameters.culture, performanceMetrics);

      console.log(`✨ Generated ${parameters.type} in ${geometryTime.toFixed(2)}ms`);
      console.log(`📈 Cultural authenticity: ${(authenticityScore.overall * 100).toFixed(1)}%`);
      
      return result;
      
    } catch (error) {
      console.error('❌ Generation failed:', error);
      throw error;
    }
  }

  async optimizeParametersInRealTime(
    currentParameters: ParametricParameters,
    userAdjustments: Partial<ParametricParameters>
  ): Promise<ParametricParameters> {
    // Merge user adjustments with current parameters
    const adjustedParameters = { ...currentParameters, ...userAdjustments };
    
    // AI validates and optimizes the adjusted parameters
    const optimizationConstraints: OptimizationConstraints = {
      spaceLimitations: this.calculateSpaceLimitations(adjustedParameters),
      budgetConstraints: this.calculateBudgetConstraints(adjustedParameters),
      accessibilityNeeds: this.calculateAccessibilityNeeds(adjustedParameters),
      culturalRequirements: this.calculateCulturalRequirements(adjustedParameters)
    };

    try {
      return await this.aiAnalyzer.optimizeParameters(adjustedParameters, optimizationConstraints);
    } catch (error) {
      console.warn('AI optimization failed, using rule-based optimization:', error);
      return this.ruleBasedOptimization(adjustedParameters, optimizationConstraints);
    }
  }

  // Real-time parameter adjustment for UI sliders
  adjustParametersRealTime(
    baseParameters: ParametricParameters,
    adjustments: { [key: string]: any }
  ): ParametricParameters {
    const adjusted = { ...baseParameters };
    
    // Apply adjustments with intelligent constraints
    Object.entries(adjustments).forEach(([key, value]) => {
      switch (key) {
        case 'height':
          adjusted.height = this.constrainHeight(value, baseParameters.culture, baseParameters.type);
          break;
        case 'width':
          adjusted.width = this.constrainWidth(value, baseParameters.culture, baseParameters.type);
          break;
        case 'depth':
          adjusted.depth = this.constrainDepth(value, baseParameters.culture, baseParameters.type);
          break;
        case 'formality':
          adjusted.formality = value;
          // Auto-adjust other parameters based on formality
          adjusted.decorativeIntensity = this.calculateDecorativeIntensity(value, baseParameters.culture);
          break;
        case 'primaryMaterial':
          adjusted.primaryMaterial = value;
          // Validate material cultural appropriateness
          if (!this.culturalDB.isMaterialCulturallyAppropriate(value, baseParameters.culture)) {
            console.warn(`⚠️ Material ${value} may not be culturally appropriate for ${baseParameters.culture}`);
          }
          break;
        case 'decorativeIntensity':
          adjusted.decorativeIntensity = Math.max(0, Math.min(1, value));
          break;
        case 'craftsmanshipLevel':
          adjusted.craftsmanshipLevel = value;
          break;
        default:
          (adjusted as any)[key] = value;
      }
    });

    return adjusted;
  }

  // Helper methods
  private initializeTemplates(): void {
    this.templates.set('chair', new ChairTemplate());
    this.templates.set('dining-table', new TableTemplate());
    this.templates.set('coffee-table', new TableTemplate());
    this.templates.set('side-table', new TableTemplate());
    
    // System templates (non-furniture)
    // Note: Climate, Security, and AV templates are specialized systems
    // They use their own parameter interfaces and generation methods
    // Access via: climateTemplate, securityTemplate, avTemplate
  }

  private generateCacheKey(parameters: ParametricParameters): string {
    return JSON.stringify(parameters);
  }

  private async validateCulturalParameters(parameters: ParametricParameters): Promise<AuthenticityScore> {
    // Create a mock result for validation
    const mockResult: GenerationResult = {
      geometry: new THREE.Group(),
      materials: [],
      metadata: {
        id: 'mock',
        name: 'Mock',
        description: 'Mock',
        culturalSignificance: 'Mock',
        usageGuidelines: [],
        maintenanceInstructions: [],
        estimatedCost: 0
      },
      culturalAuthenticity: { overall: 0, proportions: 0, materials: 0, construction: 0, aesthetics: 0, culturalElements: 0 },
      performanceMetrics: { generationTime: 0, polygonCount: 0, memoryUsage: 0 }
    };

    return this.culturalDB.validateCulturalAuthenticity(parameters, mockResult);
  }

  private async adjustForCulturalAuthenticity(
    parameters: ParametricParameters,
    validation: AuthenticityScore
  ): Promise<ParametricParameters> {
    const adjusted = { ...parameters };
    
    // Adjust based on low scoring areas
    if (validation.materials < 0.7) {
      const culturalProfile = this.culturalDB.getCulturalProfile(parameters.culture);
      if (culturalProfile && culturalProfile.materials.preferred.length > 0) {
        adjusted.primaryMaterial = culturalProfile.materials.preferred[0];
      }
    }
    
    if (validation.proportions < 0.7) {
      const culturalProps = this.culturalDB.getCulturalProportions(parameters.culture, parameters.type);
      if (parameters.type === 'chair') {
        adjusted.height = culturalProps.seatHeight;
      } else if (parameters.type.includes('table')) {
        adjusted.height = culturalProps.tableHeight;
      }
    }
    
    if (validation.culturalElements < 0.7) {
      const culturalProfile = this.culturalDB.getCulturalProfile(parameters.culture);
      if (culturalProfile) {
        adjusted.culturalElements = culturalProfile.aesthetics.decorativeElements.slice(0, 3);
      }
    }
    
    return adjusted;
  }

  private applyMaterialsToGeometry(
    geometry: THREE.Group,
    materials: THREE.Material[],
    parameters: ParametricParameters
  ): void {
    let materialIndex = 0;
    
    geometry.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const component = child.userData.component;
        
        // Apply appropriate material based on component type
        if (component === 'seat' || component === 'backrest' || component === 'top') {
          child.material = materials[0]; // Primary material
        } else if (component === 'leg' || component === 'frame') {
          child.material = materials[Math.min(materialIndex, materials.length - 1)];
        } else if (component === 'cultural-accent' || component === 'ornate-detail') {
          child.material = materials[materials.length - 1] || materials[0];
        } else {
          child.material = materials[materialIndex % materials.length];
        }
        
        materialIndex++;
      }
    });
  }

  private generateFurnitureMetadata(parameters: ParametricParameters): FurnitureMetadata {
    const template = this.templates.get(parameters.type);
    if (template) {
      return template.generateMetadata(parameters);
    }
    
    // Fallback metadata
    return {
      id: `${parameters.type}-${parameters.culture}-${Date.now()}`,
      name: `${parameters.culture} ${parameters.type}`,
      description: `Generated ${parameters.type} with ${parameters.culture} styling`,
      culturalSignificance: 'Generated furniture piece',
      usageGuidelines: ['Handle with care'],
      maintenanceInstructions: ['Clean regularly'],
      estimatedCost: 100
    };
  }

  private calculatePerformanceMetrics(geometry: THREE.Group, generationTime: number): PerformanceMetrics {
    let polygonCount = 0;
    let memoryUsage = 0;

    geometry.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry) {
        const positions = child.geometry.attributes.position;
        if (positions) {
          polygonCount += positions.count / 3;
        }
        memoryUsage += this.estimateGeometryMemoryUsage(child.geometry);
      }
    });

    return {
      generationTime,
      polygonCount,
      memoryUsage
    };
  }

  private estimateGeometryMemoryUsage(geometry: THREE.BufferGeometry): number {
    let usage = 0;
    Object.values(geometry.attributes).forEach(attribute => {
      usage += attribute.array.byteLength;
    });
    return usage;
  }

  private recordPerformanceMetrics(
    furnitureType: FurnitureType,
    culture: CultureType,
    metrics: PerformanceMetrics
  ): void {
    const key = `${furnitureType}-${culture}`;
    
    if (!this.performanceMetrics.has(key)) {
      this.performanceMetrics.set(key, []);
    }
    
    this.performanceMetrics.get(key)!.push(metrics);
    
    // Keep only last 100 measurements
    const measurements = this.performanceMetrics.get(key)!;
    if (measurements.length > 100) {
      measurements.shift();
    }
  }

  // Constraint calculation methods
  private calculateSpaceLimitations(parameters: ParametricParameters): string {
    const volume = parameters.width * parameters.height * parameters.depth;
    return `Furniture volume: ${volume.toFixed(2)} cubic meters`;
  }

  private calculateBudgetConstraints(parameters: ParametricParameters): string {
    const template = this.templates.get(parameters.type);
    if (template) {
      const metadata = template.generateMetadata(parameters);
      return `Estimated cost: $${metadata.estimatedCost}`;
    }
    return 'Budget constraints not calculated';
  }

  private calculateAccessibilityNeeds(parameters: ParametricParameters): string {
    return `Ergonomic profile: ${parameters.ergonomicProfile}`;
  }

  private calculateCulturalRequirements(parameters: ParametricParameters): string {
    const culturalProfile = this.culturalDB.getCulturalProfile(parameters.culture);
    return culturalProfile ? `Cultural style: ${culturalProfile.name}` : 'No cultural requirements';
  }

  // Parameter constraint methods
  private constrainHeight(value: number, culture: CultureType, type: FurnitureType): number {
    const culturalProps = this.culturalDB.getCulturalProportions(culture, type);
    
    if (type === 'chair') {
      return Math.max(0.3, Math.min(1.2, value));
    } else if (type.includes('table')) {
      return Math.max(0.3, Math.min(1.0, value));
    }
    
    return Math.max(0.3, Math.min(2.0, value));
  }

  private constrainWidth(value: number, culture: CultureType, type: FurnitureType): number {
    if (type === 'chair') {
      return Math.max(0.3, Math.min(1.0, value));
    } else if (type.includes('table')) {
      return Math.max(0.5, Math.min(3.0, value));
    }
    
    return Math.max(0.3, Math.min(3.0, value));
  }

  private constrainDepth(value: number, culture: CultureType, type: FurnitureType): number {
    if (type === 'chair') {
      return Math.max(0.3, Math.min(1.0, value));
    } else if (type.includes('table')) {
      return Math.max(0.5, Math.min(2.0, value));
    }
    
    return Math.max(0.3, Math.min(2.0, value));
  }

  private calculateDecorativeIntensity(formality: string, culture: CultureType): number {
    const baseIntensity: Record<string, number> = {
      'casual': 0.3,
      'semi-formal': 0.5,
      'formal': 0.7,
      'ceremonial': 0.9
    };
    
    const culturalMultiplier: Record<CultureType, number> = {
      'japanese': 0.8,
      'scandinavian': 0.6,
      'italian': 1.2,
      'french': 1.0,
      'modern': 0.4
    };
    
    return Math.min(1.0, (baseIntensity[formality] || 0.5) * (culturalMultiplier[culture] || 1.0));
  }

  // Fallback methods
  private async generateFallbackFurniture(userInput: UserFurnitureRequest): Promise<GenerationResult[]> {
    console.log('🔄 Generating fallback furniture...');
    
    const culturalProfile = this.culturalDB.getCulturalProfile(userInput.culture);
    const basicParameters: ParametricParameters = {
      type: 'chair',
      culture: userInput.culture,
      width: 0.5,
      height: culturalProfile?.proportions.seatHeight || 0.45,
      depth: 0.5,
      style: 'traditional',
      formality: userInput.formalityLevel,
      primaryMaterial: culturalProfile?.materials.preferred[0] || 'wood-oak',
      culturalElements: culturalProfile?.aesthetics.decorativeElements.slice(0, 2) || [],
      ergonomicProfile: 'average',
      colorPalette: culturalProfile?.aesthetics.colorPalette || ['#8B4513'],
      decorativeIntensity: 0.5,
      craftsmanshipLevel: 'refined'
    };

    const results: GenerationResult[] = [];
    const chairCount = Math.min(userInput.guestCount, 8);
    
    for (let i = 0; i < chairCount; i++) {
      const result = await this.generateSinglePiece(basicParameters);
      results.push(result);
    }

    return results;
  }

  private adjustInvalidParameters(parameters: ParametricParameters): ParametricParameters {
    const adjusted = { ...parameters };
    
    // Adjust dimensions to valid ranges
    adjusted.width = this.constrainWidth(adjusted.width, adjusted.culture, adjusted.type);
    adjusted.height = this.constrainHeight(adjusted.height, adjusted.culture, adjusted.type);
    adjusted.depth = this.constrainDepth(adjusted.depth, adjusted.culture, adjusted.type);
    
    // Ensure decorative intensity is in valid range
    adjusted.decorativeIntensity = Math.max(0, Math.min(1, adjusted.decorativeIntensity));
    
    return adjusted;
  }

  private ruleBasedOptimization(
    parameters: ParametricParameters,
    constraints: OptimizationConstraints
  ): ParametricParameters {
    const optimized = { ...parameters };
    
    // Apply simple rule-based optimizations
    if (constraints.spaceLimitations.includes('small')) {
      optimized.width = Math.min(optimized.width, 0.8);
      optimized.depth = Math.min(optimized.depth, 0.8);
    }
    
    if (constraints.budgetConstraints.includes('low')) {
      optimized.craftsmanshipLevel = 'simple';
      optimized.decorativeIntensity = Math.min(optimized.decorativeIntensity, 0.5);
    }
    
    return optimized;
  }

  // Public utility methods
  getCacheSize(): number {
    return this.cache.size;
  }

  clearCache(): void {
    this.cache.clear();
  }

  getPerformanceReport(): any {
    const report: any = {};
    
    for (const [key, metrics] of this.performanceMetrics) {
      const avgTime = metrics.reduce((sum, m) => sum + m.generationTime, 0) / metrics.length;
      const avgPolygons = metrics.reduce((sum, m) => sum + m.polygonCount, 0) / metrics.length;
      const avgMemory = metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / metrics.length;
      
      report[key] = {
        count: metrics.length,
        averageGenerationTime: avgTime,
        averagePolygonCount: avgPolygons,
        averageMemoryUsage: avgMemory
      };
    }
    
    return report;
  }

  getSupportedFurnitureTypes(): FurnitureType[] {
    return Array.from(this.templates.keys());
  }

  getSupportedCultures(): CultureType[] {
    return ['japanese', 'scandinavian', 'italian', 'french', 'modern'];
  }

  // New methods for expanded template system
  async generateLightingSystem(parameters: LightingParameters): Promise<THREE.Group> {
    console.log(`💡 Generating lighting system for ${parameters.culture} ${parameters.eventType}...`);
    
    const startTime = performance.now();
    const lightingSystem = this.lightingTemplate.generateLightingSystem(parameters);
    const generationTime = performance.now() - startTime;
    
    console.log(`✨ Lighting system generated in ${generationTime.toFixed(2)}ms`);
    return lightingSystem;
  }

  async generateFloralArrangements(parameters: FloralParameters): Promise<THREE.Group> {
    console.log(`🌸 Generating floral arrangements for ${parameters.culture} ${parameters.eventType}...`);
    
    const startTime = performance.now();
    const floralSystem = this.floralTemplate.generateFloralArrangements(parameters);
    const generationTime = performance.now() - startTime;
    
    console.log(`✨ Floral arrangements generated in ${generationTime.toFixed(2)}ms`);
    return floralSystem;
  }

  async generateStageSystem(parameters: StageParameters): Promise<THREE.Group> {
    console.log(`🎭 Generating stage system for ${parameters.culture} ${parameters.performanceType}...`);
    
    const startTime = performance.now();
    const stageSystem = this.stageTemplate.generateStageSystem(parameters);
    const generationTime = performance.now() - startTime;
    
    console.log(`✨ Stage system generated in ${generationTime.toFixed(2)}ms`);
    return stageSystem;
  }

  // Comprehensive event generation that combines all systems
  async generateCompleteEventSetup(eventSpec: {
    furniture: UserFurnitureRequest;
    lighting?: LightingParameters;
    floral?: FloralParameters;
    stage?: StageParameters;
  }): Promise<{
    furniture: GenerationResult[];
    lighting?: THREE.Group;
    floral?: THREE.Group;
    stage?: THREE.Group;
    summary: {
      totalPieces: number;
      totalCost: number;
      generationTime: number;
      culturalTheme: string;
    };
  }> {
    console.log('🎯 Starting complete event setup generation...');
    const startTime = performance.now();
    
    // Generate furniture
    const furniture = await this.generateFurnitureFromUserInput(eventSpec.furniture);
    
    // Generate optional systems
    const lighting = eventSpec.lighting 
      ? await this.generateLightingSystem(eventSpec.lighting)
      : undefined;
      
    const floral = eventSpec.floral 
      ? await this.generateFloralArrangements(eventSpec.floral)
      : undefined;
      
    const stage = eventSpec.stage 
      ? await this.generateStageSystem(eventSpec.stage)
      : undefined;
    
    const totalTime = performance.now() - startTime;
    
    // Calculate summary
    const totalCost = furniture.reduce((sum, item) => sum + item.metadata.estimatedCost, 0) +
      (lighting?.userData.estimatedCost || 0) +
      (floral?.userData.estimatedCost || 0) +
      (stage?.userData.estimatedCost || 0);
    
    const summary = {
      totalPieces: furniture.length + (lighting ? 1 : 0) + (floral ? 1 : 0) + (stage ? 1 : 0),
      totalCost,
      generationTime: totalTime,
      culturalTheme: eventSpec.furniture.culture
    };
    
    console.log(`🎉 Complete event setup generated! Total time: ${totalTime.toFixed(2)}ms`);
    console.log(`📊 Summary: ${summary.totalPieces} pieces, $${summary.totalCost}, ${summary.culturalTheme} theme`);
    
    return {
      furniture,
      lighting,
      floral,
      stage,
      summary
    };
  }

  // Enhanced user input that can handle all template types
  async generateFromUserInput(userInput: UserFurnitureRequest & {
    includeLighting?: boolean;
    includeFloral?: boolean;
    includeStage?: boolean;
    lightingPreferences?: Partial<LightingParameters>;
    floralPreferences?: Partial<FloralParameters>;
    stagePreferences?: Partial<StageParameters>;
  }): Promise<{
    furniture: GenerationResult[];
    lighting?: THREE.Group;
    floral?: THREE.Group;
    stage?: THREE.Group;
    summary: any;
  }> {
    const eventSpec: any = { furniture: userInput };
    
    // Auto-generate lighting parameters if requested
    if (userInput.includeLighting) {
      eventSpec.lighting = {
        culture: userInput.culture,
        eventType: this.mapEventToLightingType(userInput.eventType),
        timeOfDay: 'evening',
        season: 'spring',
        spaceType: 'indoor',
        spaceDimensions: userInput.spaceDimensions,
        ambiance: this.mapFormalityToAmbiance(userInput.formalityLevel),
        functionality: 'balanced',
        powerBudget: 3000,
        installationComplexity: 'moderate',
        weatherResistance: false,
        traditionalElements: [],
        colorTemperature: 'warm',
        brightness: 'moderate',
        ...userInput.lightingPreferences
      };
    }
    
    // Auto-generate floral parameters if requested
    if (userInput.includeFloral) {
      eventSpec.floral = {
        culture: userInput.culture,
        eventType: this.mapEventToFloralType(userInput.eventType),
        formality: userInput.formalityLevel,
        season: 'spring',
        arrangementStyle: 'centerpiece',
        scale: this.mapGuestCountToScale(userInput.guestCount),
        colorScheme: 'natural',
        budget: this.calculateFloralBudget(userInput.budgetRange),
        venue: 'indoor',
        duration: 4,
        maintenance: 'medium',
        symbolism: [],
        traditionalFlowers: [],
        avoidFlowers: [],
        localSourcing: true,
        sustainablePractices: true,
        reusability: false,
        ...userInput.floralPreferences
      };
    }
    
    // Auto-generate stage parameters if requested
    if (userInput.includeStage) {
      eventSpec.stage = {
        performanceType: 'ceremony',
        audienceSize: userInput.guestCount,
        interactionLevel: 'some-interaction',
        audioRequirements: 'professional',
        visualRequirements: 'standard',
        lightingIntegration: true,
        culture: userInput.culture,
        ceremony: true,
        traditionalElements: [],
        spaceDimensions: {
          ...userInput.spaceDimensions,
          maxHeight: userInput.spaceDimensions.height
        },
        budget: this.calculateStageBudget(userInput.budgetRange),
        setupTime: 4,
        weatherProtection: false,
        accessibilityRequired: true,
        multilingual: false,
        hearingAssistance: false,
        visualAssistance: false,
        ...userInput.stagePreferences
      };
    }
    
    return this.generateCompleteEventSetup(eventSpec);
  }

  // Helper methods for auto-parameter generation
  private mapEventToLightingType(eventType: string): 'intimate-dinner' | 'celebration' | 'ceremony' | 'reception' | 'corporate' {
    const mapping: Record<string, any> = {
      'dinner': 'intimate-dinner',
      'wedding': 'ceremony',
      'birthday': 'celebration',
      'corporate': 'corporate',
      'reception': 'reception'
    };
    return mapping[eventType] || 'ceremony';
  }

  private mapEventToFloralType(eventType: string): 'wedding' | 'birthday' | 'corporate' | 'memorial' | 'celebration' {
    const mapping: Record<string, any> = {
      'wedding': 'wedding',
      'birthday': 'birthday',
      'corporate': 'corporate',
      'memorial': 'memorial'
    };
    return mapping[eventType] || 'celebration';
  }

  private mapFormalityToAmbiance(formality: string): 'romantic' | 'energetic' | 'serene' | 'dramatic' | 'professional' {
    const mapping: Record<string, any> = {
      'casual': 'energetic',
      'semi-formal': 'serene',
      'formal': 'romantic',
      'ceremonial': 'dramatic'
    };
    return mapping[formality] || 'serene';
  }

  private mapGuestCountToScale(guestCount: number): 'intimate' | 'medium' | 'grand' | 'monumental' {
    if (guestCount <= 10) return 'intimate';
    if (guestCount <= 50) return 'medium';
    if (guestCount <= 200) return 'grand';
    return 'monumental';
  }

  private calculateFloralBudget(budgetRange: string): number {
    const budgets: Record<string, number> = {
      'low': 200,
      'medium': 500,
      'high': 1000,
      'luxury': 2500
    };
    return budgets[budgetRange] || 500;
  }

  private calculateStageBudget(budgetRange: string): number {
    const budgets: Record<string, number> = {
      'low': 1000,
      'medium': 3000,
      'high': 7000,
      'luxury': 15000
    };
    return budgets[budgetRange] || 3000;
  }

  // Access specialized system templates
  getClimateTemplate(): ClimateTemplate {
    return this.climateTemplate;
  }

  getSecurityTemplate(): SecurityTemplate {
    return this.securityTemplate;
  }

  getAVTemplate(): AVTemplate {
    return this.avTemplate;
  }

  getLandscapeTemplate(): LandscapeTemplate {
    return this.landscapeTemplate;
  }

  getStructureTemplate(): StructureTemplate {
    return this.structureTemplate;
  }

  getInteractiveTemplate(): InteractiveTemplate {
    return this.interactiveTemplate;
  }

  // New generation methods for final 3 templates
  async generateLandscapeDesign(parameters: LandscapeParameters): Promise<THREE.Group> {
    console.log(`🌸 Generating landscape design for ${parameters.culture} ${parameters.gardenStyle}...`);
    
    const startTime = performance.now();
    const landscapeSystem = this.landscapeTemplate.generateLandscape(parameters);
    const generationTime = performance.now() - startTime;
    
    console.log(`✨ Landscape design generated in ${generationTime.toFixed(2)}ms`);
    return landscapeSystem;
  }

  async generateArchitecturalStructure(parameters: StructureParameters): Promise<THREE.Group> {
    console.log(`🏗️ Generating architectural structure for ${parameters.culture} ${parameters.architecturalStyle}...`);
    
    const startTime = performance.now();
    const structureSystem = this.structureTemplate.generateStructure(parameters);
    const generationTime = performance.now() - startTime;
    
    console.log(`✨ Architectural structure generated in ${generationTime.toFixed(2)}ms`);
    return structureSystem;
  }

  async generateInteractiveExperience(parameters: InteractiveParameters): Promise<THREE.Group> {
    console.log(`🎮 Generating interactive experience for ${parameters.culture} ${parameters.experienceType}...`);
    
    const startTime = performance.now();
    const interactiveSystem = this.interactiveTemplate.generateInteractiveExperience(parameters);
    const generationTime = performance.now() - startTime;
    
    console.log(`✨ Interactive experience generated in ${generationTime.toFixed(2)}ms`);
    return interactiveSystem;
  }
}