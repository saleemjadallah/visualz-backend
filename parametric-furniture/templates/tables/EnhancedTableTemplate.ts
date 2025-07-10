// Enhanced Table Template - Integrating your template with AI Parametric System
import * as THREE from 'three';
import { 
  ParametricParameters, 
  ParametricTemplate,
  FurnitureMetadata,
  CulturalProportions,
  CultureType
} from '../../types/index';
import { CulturalKnowledgeBase } from '../../cultural/CulturalKnowledgeBase';

// Extended your original interface to work with our parametric system
export interface TableParameters extends Partial<ParametricParameters> {
  // Basic identification
  tableType: 'dining' | 'coffee' | 'side' | 'serving' | 'ceremonial';
  culture: 'japanese' | 'scandinavian' | 'italian' | 'french' | 'modern';
  
  // Functional requirements
  capacity: number; // Number of people to seat
  primaryUse: 'dining' | 'serving' | 'display' | 'ceremony' | 'work' | 'salon-conversation';
  
  // Dimensions (can be auto-calculated or specified)
  width?: number;
  depth?: number;
  height?: number;
  
  // Style preferences
  formality: 'casual' | 'semi-formal' | 'formal' | 'ceremonial';
  legStyle: 'four-leg' | 'pedestal' | 'trestle' | 'floating' | 'cabriole' | 'bergere-support' | 'salon-style';
  
  // Materials
  topMaterial: 'wood-oak' | 'wood-cherry' | 'wood-bamboo' | 'wood-walnut' | 'glass' | 'stone' | 'marble';
  baseMaterial: 'wood-oak' | 'wood-cherry' | 'wood-walnut' | 'metal-brass' | 'metal-steel' | 'bronze-patina';
  
  // Customization
  colorPalette: string[];
  decorativeIntensity: number; // 0-1
  includeStorage: boolean;
  weatherResistant: boolean; // For outdoor use
}

export interface CulturalTableData {
  baseHeight: number;
  proportions: {
    lengthToWidthRatio: number;
    legThicknessRatio: number;
    topThicknessRatio: number;
    overhangRatio: number;
  };
  styleElements: {
    topShape: 'rectangular' | 'oval' | 'round' | 'irregular' | 'elegant-oval';
    legConfiguration: 'corner' | 'inset' | 'central' | 'trestle' | 'salon-style';
    edgeProfile: 'square' | 'rounded' | 'beveled' | 'live-edge' | 'french-molded';
    supportStyle: 'minimal' | 'substantial' | 'decorative' | 'architectural' | 'salon-elegant';
  };
  culturalFeatures: {
    ceremonies: string[];
    seasonalElements: string[];
    traditionalUses: string[];
    socialArrangements: string[];
  };
  savoirVivre?: {
    conversationHeight: number;
    socialProximity: number;
    ceremonialSpacing: number;
    eleganceFactors: string[];
  };
}

export class EnhancedTableTemplate implements ParametricTemplate {
  private culturalData: Map<string, CulturalTableData> = new Map();
  private capacityCalculations: Map<string, any> = new Map();
  private materialProperties: Map<string, any> = new Map();
  private culturalDB: CulturalKnowledgeBase;

  constructor() {
    this.culturalDB = new CulturalKnowledgeBase();
    this.initializeCulturalData();
    this.initializeCapacityCalculations();
    this.initializeMaterialProperties();
  }

  // Main generation function compatible with ParametricTemplate interface
  generateGeometry(parameters: ParametricParameters): THREE.Group {
    // Convert ParametricParameters to TableParameters
    const tableParams = this.convertToTableParameters(parameters);
    return this.generateTable(tableParams);
  }

  // Your original generation function enhanced with AI integration
  generateTable(parameters: TableParameters): THREE.Group {
    console.log(`🍽️ Generating ${parameters.culture} ${parameters.tableType} table for ${parameters.capacity} people...`);
    
    // Step 1: Calculate optimal dimensions with AI cultural knowledge
    const dimensions = this.calculateOptimalDimensions(parameters);
    
    // Step 2: Validate cultural appropriateness with enhanced AI validation
    const validatedParams = this.validateCulturalParameters(parameters, dimensions);
    
    // Step 3: Generate table components with enhanced cultural authenticity
    const table = new THREE.Group();
    const tabletop = this.generateTabletop(dimensions, validatedParams);
    const base = this.generateTableBase(dimensions, validatedParams);
    const supports = this.generateSupports(dimensions, validatedParams);
    
    // Step 4: Add optional features
    if (validatedParams.includeStorage) {
      const storage = this.generateStorage(dimensions, validatedParams);
      table.add(...storage);
    }
    
    // Step 5: Add cultural elements with AI-enhanced details
    const culturalElements = this.addCulturalTableElements(dimensions, validatedParams);
    
    // Step 6: Assemble table
    table.add(tabletop, base, ...supports, ...culturalElements);
    
    // Step 7: Apply materials using enhanced material system
    this.applyTableMaterials(table, validatedParams);
    
    // Step 8: Add enhanced metadata
    table.userData = {
      type: 'table',
      subtype: validatedParams.tableType,
      culture: validatedParams.culture,
      capacity: validatedParams.capacity,
      dimensions: dimensions,
      culturalAuthenticity: this.calculateTableAuthenticity(validatedParams),
      generatedAt: Date.now(),
      aiEnhanced: true,
      savoirVivre: validatedParams.culture === 'french'
    };
    
    console.log(`✨ ${parameters.culture} ${parameters.tableType} table generated successfully!`);
    return table;
  }

  private mapLegConfiguration(legStyle?: string, legConfiguration?: string): string {
    if (legStyle) return legStyle;
    
    // Map cultural leg configuration to our leg style types
    switch (legConfiguration) {
      case 'corner': return 'four-leg';
      case 'central': return 'pedestal';
      case 'inset': return 'four-leg';
      default: return legConfiguration || 'four-leg';
    }
  }

  private initializeCulturalData(): void {
    this.culturalData = new Map();
    
    // Enhanced Japanese Traditional Table Data
    this.culturalData.set('japanese', {
      baseHeight: 0.72, // Standard but can be lower for floor seating
      proportions: {
        lengthToWidthRatio: 1.6, // Golden ratio influence
        legThicknessRatio: 0.08,
        topThicknessRatio: 0.05,
        overhangRatio: 0.15 // 15% overhang beyond legs
      },
      styleElements: {
        topShape: 'rectangular',
        legConfiguration: 'inset',
        edgeProfile: 'rounded',
        supportStyle: 'minimal'
      },
      culturalFeatures: {
        ceremonies: ['tea-ceremony', 'kaiseki-dining', 'seasonal-celebrations'],
        seasonalElements: ['cherry-blossom-motifs', 'autumn-leaves', 'winter-simplicity'],
        traditionalUses: ['meditation', 'calligraphy', 'flower-arrangement'],
        socialArrangements: ['circular-seating', 'hierarchical-placement', 'seasonal-rotation']
      }
    });

    // Enhanced Scandinavian Table Data
    this.culturalData.set('scandinavian', {
      baseHeight: 0.75, // Standard comfortable height
      proportions: {
        lengthToWidthRatio: 1.8, // Longer for family gatherings
        legThicknessRatio: 0.12, // Substantial but not bulky
        topThicknessRatio: 0.06,
        overhangRatio: 0.20 // Generous overhang for comfort
      },
      styleElements: {
        topShape: 'rectangular',
        legConfiguration: 'corner',
        edgeProfile: 'rounded',
        supportStyle: 'substantial'
      },
      culturalFeatures: {
        ceremonies: ['midsummer-feast', 'hygge-gatherings', 'christmas-dinner'],
        seasonalElements: ['light-maximization', 'candle-integration', 'natural-materials'],
        traditionalUses: ['family-dining', 'craft-activities', 'study-work'],
        socialArrangements: ['equal-seating', 'conversation-focus', 'child-friendly']
      }
    });

    // Enhanced Italian Table Data
    this.culturalData.set('italian', {
      baseHeight: 0.76, // Slightly elevated for elegance
      proportions: {
        lengthToWidthRatio: 1.5, // More square for intimate dining
        legThicknessRatio: 0.10, // Elegant proportions
        topThicknessRatio: 0.04, // Refined thickness
        overhangRatio: 0.12 // Modest overhang
      },
      styleElements: {
        topShape: 'rectangular',
        legConfiguration: 'corner',
        edgeProfile: 'beveled',
        supportStyle: 'decorative'
      },
      culturalFeatures: {
        ceremonies: ['family-feast', 'wine-tasting', 'celebration-dining'],
        seasonalElements: ['harvest-themes', 'wine-motifs', 'artistic-details'],
        traditionalUses: ['extended-dining', 'conversation', 'artistic-display'],
        socialArrangements: ['family-hierarchy', 'passionate-discussion', 'artistic-appreciation']
      }
    });

    // NEW: Enhanced French Savoir-Vivre Table Data
    this.culturalData.set('french', {
      baseHeight: 0.75, // Perfect height for French dining etiquette
      proportions: {
        lengthToWidthRatio: 1.7, // Elegant proportions for salon dining
        legThicknessRatio: 0.095, // Refined yet substantial
        topThicknessRatio: 0.055, // Quality thickness showing craftsmanship
        overhangRatio: 0.18 // Generous for proper place settings
      },
      styleElements: {
        topShape: 'elegant-oval', // Preferred for conversation flow
        legConfiguration: 'salon-style', // Cabriole or refined legs
        edgeProfile: 'french-molded', // Sophisticated edge treatment
        supportStyle: 'salon-elegant' // Balances beauty with function
      },
      culturalFeatures: {
        ceremonies: ['salon-dining', 'afternoon-tea', 'formal-reception', 'wine-tasting-elegant'],
        seasonalElements: ['seasonal-table-settings', 'french-garden-motifs', 'artistic-centerpieces'],
        traditionalUses: ['salon-conversation', 'formal-dining', 'artistic-appreciation', 'intellectual-discourse'],
        socialArrangements: ['conversation-circles', 'hierarchical-elegance', 'intimate-gatherings', 'cultural-exchange']
      },
      savoirVivre: {
        conversationHeight: 0.75, // Optimal for eye contact during conversation
        socialProximity: 0.65, // Intimate yet respectful spacing
        ceremonialSpacing: 0.8, // Formal occasion spacing
        eleganceFactors: ['proper-proportions', 'refined-materials', 'conversation-optimization', 'artistic-beauty']
      }
    });

    // Enhanced Modern Contemporary Table Data
    this.culturalData.set('modern', {
      baseHeight: 0.75,
      proportions: {
        lengthToWidthRatio: 1.4, // Flexible proportions
        legThicknessRatio: 0.06, // Minimalist legs
        topThicknessRatio: 0.03, // Thin, sleek top
        overhangRatio: 0.10 // Minimal overhang
      },
      styleElements: {
        topShape: 'rectangular',
        legConfiguration: 'inset',
        edgeProfile: 'square',
        supportStyle: 'minimal'
      },
      culturalFeatures: {
        ceremonies: ['business-dining', 'casual-gathering', 'modern-entertaining'],
        seasonalElements: ['year-round-consistency', 'artificial-lighting', 'climate-controlled'],
        traditionalUses: ['work-dining', 'casual-eating', 'multi-purpose'],
        socialArrangements: ['flexible-seating', 'individual-focus', 'efficiency-oriented']
      }
    });
  }

  private initializeCapacityCalculations(): void {
    this.capacityCalculations = new Map([
      ['dining', {
        spacePerPerson: 0.6, // 60cm per person
        minimumWidth: 0.8,   // 80cm minimum table width
        maximumLength: 3.0,  // 3m practical maximum
        comfortableDepth: 0.9 // 90cm for comfortable reach
      }],
      ['coffee', {
        spacePerPerson: 0.4, // Less space needed
        minimumWidth: 0.6,
        maximumLength: 1.5,
        comfortableDepth: 0.6
      }],
      ['ceremonial', {
        spacePerPerson: 0.8, // More formal spacing
        minimumWidth: 1.0,
        maximumLength: 2.5,
        comfortableDepth: 1.0
      }],
      ['salon-conversation', {
        spacePerPerson: 0.7, // French salon spacing
        minimumWidth: 0.9,
        maximumLength: 2.2,
        comfortableDepth: 0.85
      }]
    ]);
  }

  private initializeMaterialProperties(): void {
    this.materialProperties = new Map([
      ['wood-oak', {
        density: 'medium',
        durability: 'high',
        workability: 'good',
        culturalFit: ['japanese', 'scandinavian', 'french', 'modern'],
        finish: 'natural-grain'
      }],
      ['wood-cherry', {
        density: 'medium-high',
        durability: 'high',
        workability: 'excellent',
        culturalFit: ['japanese', 'italian', 'french'],
        finish: 'warm-grain'
      }],
      ['wood-walnut', {
        density: 'high',
        durability: 'excellent',
        workability: 'excellent',
        culturalFit: ['french', 'italian'],
        finish: 'rich-grain'
      }],
      ['glass', {
        density: 'high',
        durability: 'medium',
        workability: 'specialized',
        culturalFit: ['modern', 'italian'],
        finish: 'transparent'
      }],
      ['marble', {
        density: 'very-high',
        durability: 'excellent',
        workability: 'specialized',
        culturalFit: ['french', 'italian'],
        finish: 'polished-stone'
      }]
    ]);
  }

  private convertToTableParameters(params: ParametricParameters): TableParameters {
    return {
      ...params,
      tableType: params.type.includes('table') ? 
        params.type.replace('-table', '') as any : 'dining',
      capacity: params.capacity || 6,
      primaryUse: params.formality === 'ceremonial' ? 'ceremony' : 'dining',
      legStyle: 'four-leg', // Default
      topMaterial: params.primaryMaterial?.startsWith('wood') ? 
        params.primaryMaterial as any : 'wood-oak',
      baseMaterial: params.secondaryMaterial?.startsWith('wood') || params.secondaryMaterial?.startsWith('metal') ? 
        params.secondaryMaterial as any : 'wood-oak',
      includeStorage: false, // Default
      weatherResistant: false // Default
    };
  }

  private calculateOptimalDimensions(params: TableParameters): any {
    const culturalData = this.culturalData.get(params.culture)!;
    const capacityData = this.capacityCalculations.get(params.tableType) || 
                        this.capacityCalculations.get(params.primaryUse) || 
                        this.capacityCalculations.get('dining')!;
    
    // Calculate dimensions based on capacity if not specified
    let calculatedWidth = params.width;
    let calculatedDepth = params.depth;
    let calculatedHeight = params.height;
    
    if (!calculatedWidth || !calculatedDepth) {
      // Calculate based on capacity and cultural proportions
      const totalPerimeterNeeded = params.capacity * capacityData.spacePerPerson;
      
      // Use cultural length-to-width ratio
      const ratio = culturalData.proportions.lengthToWidthRatio;
      calculatedWidth = Math.sqrt(totalPerimeterNeeded * ratio / 2);
      calculatedDepth = calculatedWidth / ratio;
      
      // Apply constraints
      calculatedWidth = Math.max(capacityData.minimumWidth, Math.min(capacityData.maximumLength, calculatedWidth));
      calculatedDepth = Math.max(0.6, Math.min(capacityData.comfortableDepth, calculatedDepth));
    }
    
    if (!calculatedHeight) {
      calculatedHeight = culturalData.baseHeight;
      
      // Apply French savoir-vivre adjustments
      if (params.culture === 'french' && culturalData.savoirVivre) {
        if (params.formality === 'formal' || params.formality === 'ceremonial') {
          calculatedHeight = culturalData.savoirVivre.conversationHeight;
        }
      }
      
      // Adjust for table type
      if (params.tableType === 'coffee') {
        calculatedHeight *= 0.6; // Coffee tables are lower
      } else if (params.tableType === 'ceremonial' && params.culture === 'japanese') {
        calculatedHeight *= 0.4; // Very low for floor seating
      }
    }
    
    return {
      width: calculatedWidth,
      depth: calculatedDepth,
      height: calculatedHeight,
      topThickness: calculatedWidth * culturalData.proportions.topThicknessRatio,
      legThickness: calculatedWidth * culturalData.proportions.legThicknessRatio,
      overhang: calculatedWidth * culturalData.proportions.overhangRatio
    };
  }

  private validateCulturalParameters(params: TableParameters, dimensions: any): TableParameters {
    const validated = { ...params };
    const culturalData = this.culturalData.get(params.culture)!;
    
    // Japanese-specific validations
    if (params.culture === 'japanese') {
      if (params.tableType === 'ceremonial') {
        dimensions.height = Math.min(dimensions.height, 0.3);
        console.log('✅ Adjusted height for Japanese tea ceremony');
      }
      
      if (params.topMaterial === 'glass') {
        validated.topMaterial = 'wood-oak';
        console.warn('⚠️ Adjusted material to wood for Japanese authenticity');
      }
    }
    
    // Scandinavian validations
    if (params.culture === 'scandinavian') {
      if (params.topMaterial === 'stone') {
        validated.topMaterial = 'wood-oak';
        console.warn('⚠️ Adjusted to wood for Scandinavian hygge');
      }
    }

    // French savoir-vivre validations
    if (params.culture === 'french') {
      if (params.capacity > 10) {
        validated.capacity = 10; // French prefer intimate gatherings
        console.log('🇫🇷 Adjusted capacity for French savoir-vivre intimacy');
      }
      
      if (params.formality === 'casual') {
        validated.formality = 'semi-formal'; // French maintain elegance
        console.log('🇫🇷 Elevated formality for French dining standards');
      }
      
      // French prefer refined woods - already handled in material validation
    }
    
    return validated;
  }

  private generateTabletop(dimensions: any, params: TableParameters): THREE.Mesh {
    const culturalData = this.culturalData.get(params.culture)!;
    let topGeometry: THREE.BufferGeometry;
    
    switch (culturalData.styleElements.topShape) {
      case 'rectangular':
        topGeometry = this.createRectangularTop(dimensions, params);
        break;
      case 'oval':
        topGeometry = this.createOvalTop(dimensions, params);
        break;
      case 'elegant-oval':
        // French elegant oval
        topGeometry = this.createFrenchElegantOval(dimensions, params);
        break;
      case 'round':
        topGeometry = this.createRoundTop(dimensions, params);
        break;
      default:
        topGeometry = this.createRectangularTop(dimensions, params);
    }
    
    const tabletop = new THREE.Mesh(topGeometry);
    tabletop.position.y = dimensions.height - (dimensions.topThickness / 2);
    tabletop.castShadow = true;
    tabletop.receiveShadow = true;
    tabletop.userData.component = 'tabletop';
    
    return tabletop;
  }

  private createRectangularTop(dimensions: any, params: TableParameters): THREE.BufferGeometry {
    const culturalData = this.culturalData.get(params.culture)!;
    let geometry: THREE.BufferGeometry;
    
    switch (culturalData.styleElements.edgeProfile) {
      case 'rounded':
        geometry = this.createRoundedRectangularTop(dimensions);
        break;
      case 'beveled':
        geometry = this.createBeveledRectangularTop(dimensions);
        break;
      case 'live-edge':
        geometry = this.createLiveEdgeTop(dimensions);
        break;
      case 'french-molded':
        geometry = this.createFrenchMoldedTop(dimensions);
        break;
      case 'square':
      default:
        geometry = new THREE.BoxGeometry(
          dimensions.width,
          dimensions.topThickness,
          dimensions.depth
        );
    }
    
    return geometry;
  }

  private createFrenchElegantOval(dimensions: any, params: TableParameters): THREE.BufferGeometry {
    // Create sophisticated French oval with refined proportions
    const curve = new THREE.EllipseCurve(
      0, 0,                    // center
      dimensions.width / 2,    // x radius - slightly wider for elegance
      dimensions.depth / 2.2,  // y radius - more elongated for French proportions
      0, 2 * Math.PI,         // start angle, end angle
      false,                  // clockwise
      0                       // rotation
    );
    
    const points = curve.getPoints(64); // More points for smoother curve
    const shape = new THREE.Shape(points);
    
    return new THREE.ExtrudeGeometry(shape, {
      depth: dimensions.topThickness,
      bevelEnabled: true,
      bevelThickness: 0.008, // Refined edge treatment
      bevelSize: 0.008,
      bevelSegments: 4
    });
  }

  private createFrenchMoldedTop(dimensions: any): THREE.BufferGeometry {
    // Create French-style molded edge
    const shape = new THREE.Shape();
    const width = dimensions.width;
    const depth = dimensions.depth;
    const radius = Math.min(width, depth) * 0.03; // Subtle but elegant rounding
    
    // Create sophisticated rounded rectangle with French proportions
    shape.moveTo(-width/2 + radius, -depth/2);
    shape.lineTo(width/2 - radius, -depth/2);
    shape.quadraticCurveTo(width/2, -depth/2, width/2, -depth/2 + radius);
    shape.lineTo(width/2, depth/2 - radius);
    shape.quadraticCurveTo(width/2, depth/2, width/2 - radius, depth/2);
    shape.lineTo(-width/2 + radius, depth/2);
    shape.quadraticCurveTo(-width/2, depth/2, -width/2, depth/2 - radius);
    shape.lineTo(-width/2, -depth/2 + radius);
    shape.quadraticCurveTo(-width/2, -depth/2, -width/2 + radius, -depth/2);
    
    return new THREE.ExtrudeGeometry(shape, {
      depth: dimensions.topThickness,
      bevelEnabled: true,
      bevelThickness: 0.01, // More pronounced molding
      bevelSize: 0.008,
      bevelSegments: 5 // Smoother molding profile
    });
  }

  // Keep all your original methods with enhancements
  private createRoundedRectangularTop(dimensions: any): THREE.BufferGeometry {
    const shape = new THREE.Shape();
    const width = dimensions.width;
    const depth = dimensions.depth;
    const radius = Math.min(width, depth) * 0.05;
    
    shape.moveTo(-width/2 + radius, -depth/2);
    shape.lineTo(width/2 - radius, -depth/2);
    shape.quadraticCurveTo(width/2, -depth/2, width/2, -depth/2 + radius);
    shape.lineTo(width/2, depth/2 - radius);
    shape.quadraticCurveTo(width/2, depth/2, width/2 - radius, depth/2);
    shape.lineTo(-width/2 + radius, depth/2);
    shape.quadraticCurveTo(-width/2, depth/2, -width/2, depth/2 - radius);
    shape.lineTo(-width/2, -depth/2 + radius);
    shape.quadraticCurveTo(-width/2, -depth/2, -width/2 + radius, -depth/2);
    
    return new THREE.ExtrudeGeometry(shape, {
      depth: dimensions.topThickness,
      bevelEnabled: false
    });
  }

  private createBeveledRectangularTop(dimensions: any): THREE.BufferGeometry {
    const geometry = new THREE.BoxGeometry(
      dimensions.width,
      dimensions.topThickness,
      dimensions.depth
    );
    
    geometry.userData.bevelStyle = 'italian-elegant';
    return geometry;
  }

  private createLiveEdgeTop(dimensions: any): THREE.BufferGeometry {
    const geometry = new THREE.BoxGeometry(
      dimensions.width,
      dimensions.topThickness,
      dimensions.depth
    );
    
    geometry.userData.edgeStyle = 'live-edge';
    return geometry;
  }

  private createOvalTop(dimensions: any, params: TableParameters): THREE.BufferGeometry {
    const curve = new THREE.EllipseCurve(
      0, 0,
      dimensions.width / 2,
      dimensions.depth / 2,
      0, 2 * Math.PI,
      false,
      0
    );
    
    const points = curve.getPoints(50);
    const shape = new THREE.Shape(points);
    
    return new THREE.ExtrudeGeometry(shape, {
      depth: dimensions.topThickness,
      bevelEnabled: true,
      bevelThickness: 0.005,
      bevelSize: 0.005
    });
  }

  private createRoundTop(dimensions: any, params: TableParameters): THREE.BufferGeometry {
    const radius = Math.min(dimensions.width, dimensions.depth) / 2;
    return new THREE.CylinderGeometry(radius, radius, dimensions.topThickness, 32);
  }

  private generateTableBase(dimensions: any, params: TableParameters): THREE.Group {
    const base = new THREE.Group();
    const culturalData = this.culturalData.get(params.culture)!;
    
    const effectiveLegStyle = this.mapLegConfiguration(params.legStyle, culturalData.styleElements.legConfiguration);
    
    switch (effectiveLegStyle) {
      case 'four-leg':
        base.add(...this.createFourLegBase(dimensions, params));
        break;
      case 'pedestal':
        base.add(this.createPedestalBase(dimensions, params));
        break;
      case 'trestle':
        base.add(...this.createTrestleBase(dimensions, params));
        break;
      case 'salon-style':
        // French salon style legs
        base.add(...this.createFrenchSalonBase(dimensions, params));
        break;
      case 'cabriole':
        // French cabriole legs for tables
        base.add(...this.createCabrioleTableBase(dimensions, params));
        break;
      default:
        base.add(...this.createFourLegBase(dimensions, params));
    }
    
    base.userData.component = 'table-base';
    return base;
  }

  private createFourLegBase(dimensions: any, params: TableParameters): THREE.Mesh[] {
    const legs: THREE.Mesh[] = [];
    const legHeight = dimensions.height - dimensions.topThickness;
    const culturalData = this.culturalData.get(params.culture)!;
    
    const positions = this.calculateLegPositions(dimensions);
    
    positions.forEach((position, index) => {
      let legGeometry: THREE.BufferGeometry;
      
      switch (culturalData.styleElements.supportStyle) {
        case 'minimal':
          legGeometry = new THREE.BoxGeometry(
            dimensions.legThickness * 0.8,
            legHeight,
            dimensions.legThickness * 0.8
          );
          break;
        
        case 'substantial':
          legGeometry = new THREE.CylinderGeometry(
            dimensions.legThickness / 2,
            dimensions.legThickness / 2,
            legHeight,
            8
          );
          break;
        
        case 'decorative':
          legGeometry = this.createDecorativeLeg(dimensions, legHeight);
          break;

        case 'salon-elegant':
          // French salon style
          legGeometry = this.createFrenchSalonLeg(dimensions, legHeight);
          break;
        
        default:
          legGeometry = new THREE.BoxGeometry(
            dimensions.legThickness,
            legHeight,
            dimensions.legThickness
          );
      }
      
      const leg = new THREE.Mesh(legGeometry);
      leg.position.set(position.x, legHeight / 2, position.z);
      leg.castShadow = true;
      leg.userData.component = 'table-leg';
      
      legs.push(leg);
    });
    
    return legs;
  }

  private createFrenchSalonBase(dimensions: any, params: TableParameters): THREE.Mesh[] {
    // Create elegant French salon style legs
    const legs: THREE.Mesh[] = [];
    const legHeight = dimensions.height - dimensions.topThickness;
    const positions = this.calculateLegPositions(dimensions);
    
    positions.forEach((position, index) => {
      const legGeometry = this.createFrenchSalonLeg(dimensions, legHeight);
      const leg = new THREE.Mesh(legGeometry);
      leg.position.set(position.x, legHeight / 2, position.z);
      leg.castShadow = true;
      leg.userData.component = 'french-salon-leg';
      legs.push(leg);
    });
    
    return legs;
  }

  private createCabrioleTableBase(dimensions: any, params: TableParameters): THREE.Mesh[] {
    // Create French cabriole table legs
    const legs: THREE.Mesh[] = [];
    const legHeight = dimensions.height - dimensions.topThickness;
    const positions = this.calculateLegPositions(dimensions);
    
    positions.forEach((position, index) => {
      const legGeometry = this.createCabrioleTableLeg(dimensions, legHeight);
      const leg = new THREE.Mesh(legGeometry);
      leg.position.set(position.x, legHeight / 2, position.z);
      leg.castShadow = true;
      leg.userData.component = 'cabriole-table-leg';
      legs.push(leg);
    });
    
    return legs;
  }

  private createFrenchSalonLeg(dimensions: any, height: number): THREE.BufferGeometry {
    // Create elegant French salon leg with refined proportions
    const points = [];
    const maxRadius = dimensions.legThickness / 2;
    
    for (let i = 0; i <= 24; i++) {
      const y = (i / 24) * height;
      let radius = maxRadius;
      
      // French salon leg profile - elegant taper with subtle decorative elements
      if (i > 2 && i < 5) radius *= 1.08; // Subtle capital
      if (i > 19 && i < 22) radius *= 0.92; // Gentle taper toward foot
      if (i > 22) radius *= 1.05; // Slight foot
      
      points.push(new THREE.Vector2(radius, y));
    }
    
    return new THREE.LatheGeometry(points, 16);
  }

  private createCabrioleTableLeg(dimensions: any, height: number): THREE.BufferGeometry {
    // Create cabriole leg adapted for table use
    const points = [];
    const maxRadius = dimensions.legThickness / 2;
    
    for (let i = 0; i <= 28; i++) {
      const y = (i / 28) * height;
      let radius = maxRadius;
      
      // Cabriole S-curve for table legs
      if (i > 3 && i < 8) radius *= 1.12; // Upper bulge
      if (i > 8 && i < 16) radius *= 0.95; // Curve inward
      if (i > 16 && i < 20) radius *= 0.88; // Continue taper
      if (i > 20 && i < 24) radius *= 1.06; // Lower bulge
      if (i > 24) radius *= 1.08; // Foot
      
      points.push(new THREE.Vector2(radius, y));
    }
    
    return new THREE.LatheGeometry(points, 20); // More segments for smoother curves
  }

  // Keep all your original methods
  private createPedestalBase(dimensions: any, params: TableParameters): THREE.Mesh {
    const baseHeight = dimensions.height - dimensions.topThickness;
    const baseRadius = Math.min(dimensions.width, dimensions.depth) * 0.15;
    
    const pedestalGeometry = new THREE.CylinderGeometry(
      baseRadius * 0.6,
      baseRadius,
      baseHeight,
      12
    );
    
    const pedestal = new THREE.Mesh(pedestalGeometry);
    pedestal.position.y = baseHeight / 2;
    pedestal.castShadow = true;
    pedestal.userData.component = 'table-pedestal';
    
    return pedestal;
  }

  private createTrestleBase(dimensions: any, params: TableParameters): THREE.Mesh[] {
    const trestleComponents: THREE.Mesh[] = [];
    const baseHeight = dimensions.height - dimensions.topThickness;
    
    const supportWidth = dimensions.legThickness;
    const supportDepth = dimensions.depth * 0.8;
    
    const leftTrestle = this.createTrestleSupport(supportWidth, baseHeight, supportDepth);
    leftTrestle.position.x = -dimensions.width * 0.3;
    
    const rightTrestle = this.createTrestleSupport(supportWidth, baseHeight, supportDepth);
    rightTrestle.position.x = dimensions.width * 0.3;
    
    const beamGeometry = new THREE.BoxGeometry(
      dimensions.width * 0.6,
      supportWidth,
      supportWidth
    );
    const beam = new THREE.Mesh(beamGeometry);
    beam.position.y = baseHeight * 0.3;
    beam.userData.component = 'trestle-beam';
    
    trestleComponents.push(leftTrestle, rightTrestle, beam);
    return trestleComponents;
  }

  private createTrestleSupport(width: number, height: number, depth: number): THREE.Mesh {
    const trestleGeometry = new THREE.BoxGeometry(width, height, depth);
    const trestle = new THREE.Mesh(trestleGeometry);
    trestle.position.y = height / 2;
    trestle.castShadow = true;
    trestle.userData.component = 'trestle-support';
    
    return trestle;
  }

  private createDecorativeLeg(dimensions: any, height: number): THREE.BufferGeometry {
    const points = [];
    const maxRadius = dimensions.legThickness / 2;
    
    for (let i = 0; i <= 20; i++) {
      const y = (i / 20) * height;
      let radius = maxRadius;
      
      if (i > 3 && i < 7) radius *= 1.15;
      if (i > 13 && i < 17) radius *= 0.85;
      
      points.push(new THREE.Vector2(radius, y));
    }
    
    return new THREE.LatheGeometry(points, 12);
  }

  private calculateLegPositions(dimensions: any): Array<{x: number, z: number}> {
    const inset = dimensions.overhang;
    const halfWidth = (dimensions.width / 2) - inset;
    const halfDepth = (dimensions.depth / 2) - inset;
    
    return [
      { x: -halfWidth, z: -halfDepth },
      { x: halfWidth, z: -halfDepth },
      { x: -halfWidth, z: halfDepth },
      { x: halfWidth, z: halfDepth }
    ];
  }

  private generateSupports(dimensions: any, params: TableParameters): THREE.Object3D[] {
    const supports: THREE.Object3D[] = [];
    
    if (params.legStyle === 'four-leg') {
      supports.push(...this.createTableAprons(dimensions, params));
    }
    
    return supports;
  }

  private createTableAprons(dimensions: any, params: TableParameters): THREE.Mesh[] {
    const aprons: THREE.Mesh[] = [];
    const apronHeight = 0.08;
    const apronThickness = 0.02;
    const apronPosition = dimensions.height - dimensions.topThickness - apronHeight - 0.05;
    
    const frontBackApronGeometry = new THREE.BoxGeometry(
      dimensions.width - (dimensions.overhang * 2),
      apronHeight,
      apronThickness
    );
    
    const frontApron = new THREE.Mesh(frontBackApronGeometry);
    frontApron.position.set(0, apronPosition, -(dimensions.depth / 2) + dimensions.overhang);
    frontApron.userData.component = 'table-apron';
    
    const backApron = new THREE.Mesh(frontBackApronGeometry);
    backApron.position.set(0, apronPosition, (dimensions.depth / 2) - dimensions.overhang);
    backApron.userData.component = 'table-apron';
    
    aprons.push(frontApron, backApron);
    
    return aprons;
  }

  private generateStorage(dimensions: any, params: TableParameters): THREE.Object3D[] {
    const storage: THREE.Object3D[] = [];
    
    if (params.includeStorage) {
      const drawerGeometry = new THREE.BoxGeometry(
        dimensions.width * 0.6,
        0.1,
        dimensions.depth * 0.4
      );
      
      const drawer = new THREE.Mesh(drawerGeometry);
      drawer.position.y = dimensions.height * 0.4;
      drawer.userData.component = 'storage-drawer';
      
      storage.push(drawer);
    }
    
    return storage;
  }

  private addCulturalTableElements(dimensions: any, params: TableParameters): THREE.Object3D[] {
    const culturalElements: THREE.Object3D[] = [];
    const culturalData = this.culturalData.get(params.culture)!;
    
    switch (params.culture) {
      case 'japanese':
        if (params.tableType === 'ceremonial') {
          culturalElements.push(...this.createTeaCeremonyElements(dimensions));
        }
        if (params.decorativeIntensity > 0.5) {
          culturalElements.push(...this.createJapaneseAccents(dimensions));
        }
        break;
      
      case 'scandinavian':
        if (params.decorativeIntensity > 0.3) {
          culturalElements.push(...this.createScandinavianAccents(dimensions));
        }
        break;
      
      case 'italian':
        if (params.decorativeIntensity > 0.4) {
          culturalElements.push(...this.createItalianAccents(dimensions));
        }
        break;

      case 'french':
        if (params.decorativeIntensity > 0.4) {
          culturalElements.push(...this.createFrenchSavoirVivreTableElements(dimensions, params));
        }
        break;
    }
    
    return culturalElements;
  }

  private createFrenchSavoirVivreTableElements(dimensions: any, params: TableParameters): THREE.Object3D[] {
    const elements: THREE.Object3D[] = [];
    
    // Add elegant French table details
    if (params.decorativeIntensity > 0.6) {
      // Create decorative bronze corner mounts
      const cornerMountGeometry = new THREE.BoxGeometry(0.04, 0.02, 0.04);
      const bronzeMaterial = new THREE.MeshStandardMaterial({ 
        color: '#CD7F32',
        metalness: 0.7,
        roughness: 0.3 
      });
      
      const positions = this.calculateLegPositions(dimensions);
      positions.forEach(pos => {
        const mount = new THREE.Mesh(cornerMountGeometry, bronzeMaterial);
        mount.position.set(pos.x, dimensions.height - 0.01, pos.z);
        mount.userData.component = 'french-corner-mount';
        elements.push(mount);
      });
    }
    
    // Add salon conversation marker
    if (params.primaryUse === 'salon-conversation' || params.formality === 'formal') {
      const centerMarkGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.003, 12);
      const giltMaterial = new THREE.MeshStandardMaterial({ 
        color: '#FFD700',
        metalness: 0.4,
        roughness: 0.2 
      });
      
      const centerMark = new THREE.Mesh(centerMarkGeometry, giltMaterial);
      centerMark.position.y = dimensions.height + 0.002;
      centerMark.userData.component = 'salon-marker';
      elements.push(centerMark);
    }
    
    return elements;
  }

  // Keep your original cultural element methods
  private createTeaCeremonyElements(dimensions: any): THREE.Object3D[] {
    const elements: THREE.Object3D[] = [];
    
    const centerMarkGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.002, 16);
    const centerMark = new THREE.Mesh(centerMarkGeometry);
    centerMark.position.y = dimensions.height + 0.001;
    centerMark.userData.component = 'ceremony-marker';
    
    elements.push(centerMark);
    return elements;
  }

  private createJapaneseAccents(dimensions: any): THREE.Object3D[] {
    return [];
  }

  private createScandinavianAccents(dimensions: any): THREE.Object3D[] {
    return [];
  }

  private createItalianAccents(dimensions: any): THREE.Object3D[] {
    return [];
  }

  private applyTableMaterials(table: THREE.Group, params: TableParameters): void {
    table.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const component = child.userData.component;
        
        switch (component) {
          case 'tabletop':
            child.material = this.createTopMaterial(params.topMaterial, params.colorPalette);
            break;
          
          case 'table-leg':
          case 'table-pedestal':
          case 'trestle-support':
          case 'trestle-beam':
          case 'table-apron':
          case 'french-salon-leg':
          case 'cabriole-table-leg':
            child.material = this.createBaseMaterial(params.baseMaterial, params.colorPalette);
            break;
          
          case 'storage-drawer':
            child.material = this.createStorageMaterial(params.baseMaterial, params.colorPalette);
            break;
          
          case 'ceremony-marker':
          case 'salon-marker':
            child.material = this.createAccentMaterial(params.culture, params.colorPalette);
            break;

          case 'french-corner-mount':
            child.material = new THREE.MeshStandardMaterial({
              color: '#CD7F32',
              metalness: 0.7,
              roughness: 0.3
            });
            break;
          
          default:
            child.material = this.createBaseMaterial(params.baseMaterial, params.colorPalette);
        }
      }
    });
  }

  private createTopMaterial(topMaterial: string, colorPalette: string[]): THREE.Material {
    const materialColors: Record<string, string> = {
      'wood-oak': '#D2B48C',
      'wood-cherry': '#8B4513',
      'wood-walnut': '#654321',
      'wood-bamboo': '#DAA520',
      'glass': '#F0F8FF',
      'stone': '#696969',
      'marble': '#F8F8FF'
    };
    
    const color = materialColors[topMaterial] || materialColors['wood-oak'];
    
    if (topMaterial === 'glass') {
      return new THREE.MeshPhysicalMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
        transmission: 0.9,
        roughness: 0.0,
        metalness: 0.0
      });
    } else if (topMaterial === 'marble') {
      return new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.1,
        metalness: 0.0
      });
    } else {
      return new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.6,
        metalness: 0.0
      });
    }
  }

  private createBaseMaterial(baseMaterial: string, colorPalette: string[]): THREE.Material {
    const materialColors: Record<string, string> = {
      'wood-oak': '#D2B48C',
      'wood-cherry': '#8B4513',
      'wood-walnut': '#654321',
      'metal-brass': '#B5651D',
      'metal-steel': '#71797E',
      'bronze-patina': '#CD7F32'
    };
    
    const color = materialColors[baseMaterial] || materialColors['wood-oak'];
    const isMetallic = baseMaterial.startsWith('metal') || baseMaterial.startsWith('bronze');
    
    return new THREE.MeshStandardMaterial({
      color: color,
      roughness: isMetallic ? 0.3 : 0.7,
      metalness: isMetallic ? 0.8 : 0.0
    });
  }

  private createStorageMaterial(material: string, colorPalette: string[]): THREE.Material {
    return this.createBaseMaterial(material, colorPalette);
  }

  private createAccentMaterial(culture: string, colorPalette: string[]): THREE.Material {
    const culturalColors: Record<string, string> = {
      'japanese': '#8B4513',
      'scandinavian': '#F5F5DC',
      'italian': '#FFD700',
      'french': '#DDA0DD',
      'modern': '#696969'
    };
    
    return new THREE.MeshStandardMaterial({
      color: culturalColors[culture] || '#696969',
      roughness: 0.5,
      metalness: 0.0
    });
  }

  private calculateTableAuthenticity(params: TableParameters): number {
    const culturalData = this.culturalData.get(params.culture)!;
    let score = 100;
    
    const materialProps = this.materialProperties.get(params.topMaterial);
    if (materialProps && !materialProps.culturalFit.includes(params.culture)) {
      score -= 15;
    }
    
    if (params.capacity > 12 && params.culture === 'japanese') {
      score -= 10;
    }

    if (params.capacity > 10 && params.culture === 'french') {
      score -= 8; // French prefer intimate gatherings
    }
    
    if (params.tableType === 'ceremonial' && params.formality !== 'ceremonial') {
      score -= 5;
    }

    // French savoir-vivre bonus
    if (params.culture === 'french' && params.formality === 'formal' && params.capacity <= 8) {
      score += 10; // Perfect for salon dining
    }
    
    return Math.max(0, score);
  }

  // ParametricTemplate interface methods
  generateMetadata(parameters: ParametricParameters): FurnitureMetadata {
    const tableParams = this.convertToTableParameters(parameters);
    return {
      id: `enhanced-table-${tableParams.culture}-${tableParams.tableType}-${Date.now()}`,
      name: `${tableParams.culture} Enhanced ${tableParams.tableType} Table`,
      description: `AI-generated ${tableParams.culture} ${tableParams.tableType} table for ${tableParams.capacity} people`,
      culturalSignificance: this.getCulturalSignificance(tableParams.culture, tableParams.tableType),
      usageGuidelines: this.getUsageGuidelines(tableParams),
      maintenanceInstructions: this.getMaintenanceInstructions(tableParams),
      estimatedCost: this.estimateCost(tableParams)
    };
  }

  getCulturalProportions(culture: CultureType): CulturalProportions {
    const data = this.culturalData.get(culture);
    if (!data) throw new Error(`Unknown culture: ${culture}`);
    
    return {
      seatHeight: 0.45, // Standard
      tableHeight: data.baseHeight,
      armrestHeight: 0.68, // Standard
      backrestAngle: 15, // Standard
      legThickness: data.baseHeight * data.proportions.legThicknessRatio,
      surfaceThickness: data.baseHeight * data.proportions.topThicknessRatio
    };
  }

  validateParameters(parameters: ParametricParameters): boolean {
    return parameters.width! > 0.5 && parameters.width! < 4.0 &&
           parameters.height! > 0.3 && parameters.height! < 1.0 &&
           parameters.depth! > 0.5 && parameters.depth! < 2.0;
  }

  private getCulturalSignificance(culture: string, tableType: string): string {
    const significance: Record<string, string> = {
      'japanese': 'Represents harmony, respect, and mindful dining traditions',
      'scandinavian': 'Embodies hygge and family togetherness',
      'italian': 'Reflects passion for food, family, and artistic beauty',
      'french': 'Embodies savoir-vivre, the art of elegant dining and refined conversation',
      'modern': 'Represents efficiency and contemporary living'
    };
    
    let base = significance[culture] || 'Cultural dining traditions';
    
    if (culture === 'french' && tableType === 'dining') {
      base += ', designed for the French tradition of lengthy, sophisticated meals that combine culinary excellence with intellectual discourse';
    }
    
    return base;
  }

  private getUsageGuidelines(params: TableParameters): string[] {
    const guidelines = [
      `Designed for ${params.capacity} people`,
      `Optimized for ${params.primaryUse}`,
      `${params.formality} dining occasions`
    ];
    
    if (params.culture === 'french') {
      guidelines.push('Positioned to encourage conversation and social interaction');
      guidelines.push('Suitable for extended French dining experiences');
    }
    
    return guidelines;
  }

  private getMaintenanceInstructions(params: TableParameters): string[] {
    const instructions = [
      'Clean spills immediately',
      'Use appropriate table protection',
      'Dust regularly with soft cloth'
    ];
    
    if (params.topMaterial.startsWith('wood')) {
      instructions.push('Apply wood conditioner quarterly');
    }
    
    if (params.topMaterial === 'glass') {
      instructions.push('Clean with glass cleaner');
    }
    
    return instructions;
  }

  private estimateCost(params: TableParameters): number {
    let baseCost = 600; // Base cost for dining table
    
    // Adjust for table type
    const typeMultipliers = {
      'coffee': 0.6,
      'side': 0.4,
      'serving': 0.8,
      'ceremonial': 1.3,
      'dining': 1.0
    };
    
    baseCost *= typeMultipliers[params.tableType] || 1.0;
    
    // Size multiplier
    const dimensions = this.calculateOptimalDimensions(params);
    const sizeMultiplier = (dimensions.width * dimensions.depth) / 2.0; // Normalized to 2m²
    baseCost *= sizeMultiplier;
    
    // Material multipliers
    const materialMultipliers: Record<string, number> = {
      'wood-cherry': 1.5,
      'wood-walnut': 1.8,
      'wood-oak': 1.2,
      'wood-bamboo': 1.1,
      'glass': 1.3,
      'stone': 1.4,
      'marble': 2.2,
      'bronze-patina': 1.6
    };
    
    baseCost *= materialMultipliers[params.topMaterial] || 1.0;
    
    // French savoir-vivre premium
    if (params.culture === 'french' && params.decorativeIntensity > 0.6) {
      baseCost *= 1.5;
    }
    
    return Math.round(baseCost);
  }
}

// Template is already exported above

// Create test function
export function createEnhancedTestTable(): THREE.Group {
  const template = new EnhancedTableTemplate();
  
  const frenchDiningTableParams: TableParameters = {
    tableType: 'dining',
    culture: 'french',
    capacity: 8,
    primaryUse: 'salon-conversation',
    formality: 'formal',
    legStyle: 'salon-style',
    topMaterial: 'wood-walnut',
    baseMaterial: 'bronze-patina',
    colorPalette: ['#654321', '#CD7F32', '#DDA0DD'],
    decorativeIntensity: 0.8,
    includeStorage: false,
    weatherResistant: false,
    type: 'dining-table',
    width: 2.0,
    height: 0.75,
    depth: 1.2,
    style: 'traditional',
    culturalElements: ['salon-style', 'refined-curves', 'bronze-hardware'],
    craftsmanshipLevel: 'masterwork'
  };
  
  return template.generateTable(frenchDiningTableParams);
}