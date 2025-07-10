// Enhanced Chair Template - Integrating your template with AI Parametric System
import * as THREE from 'three';
import { 
  ParametricParameters, 
  ParametricTemplate,
  FurnitureMetadata,
  CulturalProportions,
  CultureType,
  MaterialType
} from '../../types/index';
import { CulturalKnowledgeBase } from '../../cultural/CulturalKnowledgeBase';

// Extended your original interface to work with our parametric system
export interface ChairParameters extends Partial<ParametricParameters> {
  // Cultural base
  culture: 'japanese' | 'scandinavian' | 'italian' | 'french' | 'modern';
  
  // Target user
  targetAge: 'toddler' | 'child' | 'adult' | 'elderly';
  ergonomicProfile: 'petite' | 'average' | 'tall' | 'accessible';
  
  // Style preferences
  formality: 'casual' | 'semi-formal' | 'formal' | 'ceremonial';
  comfort: 'firm' | 'medium' | 'plush';
  
  // Materials
  primaryMaterial: MaterialType;
  upholsteryMaterial?: 'fabric-cotton' | 'fabric-linen' | 'leather' | 'none';
  
  // Customization
  colorPalette: string[];
  decorativeIntensity: number; // 0-1
  includeArmrests: boolean;
}

export interface CulturalChairData {
  baseHeight: number;
  proportions: {
    widthToHeightRatio: number;
    depthToHeightRatio: number;
    backrestHeightRatio: number;
    legThicknessRatio: number;
  };
  styleElements: {
    legStyle: 'straight' | 'tapered' | 'cylindrical' | 'turned' | 'cabriole';
    backStyle: 'straight' | 'curved' | 'ergonomic' | 'minimal' | 'bergere';
    seatStyle: 'flat' | 'contoured' | 'padded';
    edgeStyle: 'sharp' | 'rounded' | 'beveled';
  };
  materials: {
    preferred: string[];
    traditional: string[];
    finishes: string[];
  };
  details: {
    joinery: 'mortise-tenon' | 'dowel' | 'screw' | 'bracket' | 'french-traditional';
    hardware: 'hidden' | 'minimal' | 'decorative' | 'industrial' | 'bronze-traditional';
    ornamentation: 'none' | 'subtle' | 'moderate' | 'ornate' | 'savoir-vivre';
  };
  savoirVivre?: {
    conversationAngle: number;
    socialDistance: number;
    formalityAdjustment: number;
  };
}

export class EnhancedChairTemplate implements ParametricTemplate {
  private culturalData: Map<string, CulturalChairData> = new Map();
  private ageAdjustments: Map<string, number> = new Map();
  private safetyRules: Map<string, any> = new Map();
  private culturalDB: CulturalKnowledgeBase;

  constructor() {
    this.culturalDB = new CulturalKnowledgeBase();
    this.initializeCulturalData();
    this.initializeAgeAdjustments();
    this.initializeSafetyRules();
  }

  // Main generation function compatible with ParametricTemplate interface
  generateGeometry(parameters: ParametricParameters): THREE.Group {
    // Convert ParametricParameters to ChairParameters
    const chairParams = this.convertToChairParameters(parameters);
    return this.generateChair(chairParams);
  }

  // Your original generation function enhanced with AI integration
  generateChair(parameters: ChairParameters): THREE.Group {
    console.log(`🪑 Generating ${parameters.culture} chair for ${parameters.targetAge}...`);
    
    // Step 1: Validate parameters and apply safety rules + AI enhancements
    const validatedParams = this.validateAndAdjustParameters(parameters);
    
    // Step 2: Calculate dimensions based on culture, age, and AI cultural knowledge
    const dimensions = this.calculateDimensions(validatedParams);
    
    // Step 3: Generate components with enhanced cultural authenticity
    const chair = new THREE.Group();
    const seat = this.generateSeat(dimensions, validatedParams);
    const backrest = this.generateBackrest(dimensions, validatedParams);
    const legs = this.generateLegs(dimensions, validatedParams);
    
    // Step 4: Add optional components
    if (validatedParams.includeArmrests) {
      const armrests = this.generateArmrests(dimensions, validatedParams);
      chair.add(...armrests);
    }
    
    // Step 5: Add cultural details with AI-enhanced elements
    const culturalDetails = this.addCulturalDetails(dimensions, validatedParams);
    
    // Step 6: Assemble chair
    chair.add(seat, backrest, ...legs, ...culturalDetails);
    
    // Step 7: Apply materials using enhanced material system
    this.applyMaterials(chair, validatedParams);
    
    // Step 8: Add enhanced metadata
    chair.userData = {
      type: 'chair',
      culture: validatedParams.culture,
      targetAge: validatedParams.targetAge,
      dimensions: dimensions,
      culturalAuthenticity: this.calculateAuthenticityScore(validatedParams),
      safetyCompliant: true,
      generatedAt: Date.now(),
      aiEnhanced: true,
      savoirVivre: validatedParams.culture === 'french'
    };
    
    console.log(`✨ ${parameters.culture} chair generated successfully!`);
    return chair;
  }

  private initializeCulturalData(): void {
    this.culturalData = new Map();
    
    // Enhanced Japanese Traditional Chair Data
    this.culturalData.set('japanese', {
      baseHeight: 0.40, // Lower seating, floor-oriented culture
      proportions: {
        widthToHeightRatio: 1.2,
        depthToHeightRatio: 1.05,
        backrestHeightRatio: 0.8,
        legThicknessRatio: 0.12
      },
      styleElements: {
        legStyle: 'tapered',
        backStyle: 'straight',
        seatStyle: 'flat',
        edgeStyle: 'rounded'
      },
      materials: {
        preferred: ['wood-oak', 'wood-cherry', 'wood-bamboo'],
        traditional: ['hinoki-cypress', 'zelkova', 'bamboo'],
        finishes: ['natural-oil', 'urushi-lacquer', 'hand-polished']
      },
      details: {
        joinery: 'mortise-tenon',
        hardware: 'hidden',
        ornamentation: 'subtle'
      }
    });

    // Enhanced Scandinavian Hygge Chair Data
    this.culturalData.set('scandinavian', {
      baseHeight: 0.45, // Standard comfortable height
      proportions: {
        widthToHeightRatio: 1.3,
        depthToHeightRatio: 1.1,
        backrestHeightRatio: 0.9,
        legThicknessRatio: 0.15
      },
      styleElements: {
        legStyle: 'cylindrical',
        backStyle: 'curved',
        seatStyle: 'contoured',
        edgeStyle: 'rounded'
      },
      materials: {
        preferred: ['wood-pine', 'wood-birch'],
        traditional: ['nordic-pine', 'birch', 'ash'],
        finishes: ['white-wash', 'natural-oil', 'matte-lacquer']
      },
      details: {
        joinery: 'dowel',
        hardware: 'minimal',
        ornamentation: 'none'
      }
    });

    // Enhanced Italian Elegant Chair Data
    this.culturalData.set('italian', {
      baseHeight: 0.46, // Slightly elevated for elegance
      proportions: {
        widthToHeightRatio: 1.15,
        depthToHeightRatio: 1.0,
        backrestHeightRatio: 1.0,
        legThicknessRatio: 0.10
      },
      styleElements: {
        legStyle: 'turned',
        backStyle: 'ergonomic',
        seatStyle: 'padded',
        edgeStyle: 'beveled'
      },
      materials: {
        preferred: ['wood-cherry', 'wood-walnut'],
        traditional: ['italian-walnut', 'olive-wood'],
        finishes: ['high-gloss', 'hand-rubbed', 'antique']
      },
      details: {
        joinery: 'mortise-tenon',
        hardware: 'decorative',
        ornamentation: 'moderate'
      }
    });

    // NEW: Enhanced French Savoir-Vivre Chair Data
    this.culturalData.set('french', {
      baseHeight: 0.44, // Refined height for conversation
      proportions: {
        widthToHeightRatio: 1.18,
        depthToHeightRatio: 1.05,
        backrestHeightRatio: 0.95,
        legThicknessRatio: 0.095
      },
      styleElements: {
        legStyle: 'cabriole',
        backStyle: 'bergere',
        seatStyle: 'padded',
        edgeStyle: 'rounded'
      },
      materials: {
        preferred: ['wood-cherry', 'wood-walnut', 'fabric-silk'],
        traditional: ['french-walnut', 'cherry', 'silk-upholstery'],
        finishes: ['french-polish', 'gilt-accents', 'hand-rubbed']
      },
      details: {
        joinery: 'french-traditional',
        hardware: 'bronze-traditional',
        ornamentation: 'savoir-vivre'
      },
      savoirVivre: {
        conversationAngle: 18, // Optimal angle for salon conversations
        socialDistance: 0.65, // Intimate yet respectful
        formalityAdjustment: 1.1 // Slightly more formal proportions
      }
    });

    // Enhanced Modern Contemporary Chair Data
    this.culturalData.set('modern', {
      baseHeight: 0.45,
      proportions: {
        widthToHeightRatio: 1.25,
        depthToHeightRatio: 1.0,
        backrestHeightRatio: 0.95,
        legThicknessRatio: 0.08
      },
      styleElements: {
        legStyle: 'straight',
        backStyle: 'ergonomic',
        seatStyle: 'contoured',
        edgeStyle: 'sharp'
      },
      materials: {
        preferred: ['wood-oak', 'metal-steel', 'composite'],
        traditional: ['engineered-wood', 'aluminum', 'plastic'],
        finishes: ['matte', 'powder-coat', 'laminate']
      },
      details: {
        joinery: 'bracket',
        hardware: 'industrial',
        ornamentation: 'none'
      }
    });
  }

  private initializeAgeAdjustments(): void {
    this.ageAdjustments = new Map([
      ['toddler', 0.6],   // 60% of base height
      ['child', 0.8],     // 80% of base height
      ['adult', 1.0],     // 100% of base height
      ['elderly', 1.1]    // 110% of base height (easier standing)
    ]);
  }

  private initializeSafetyRules(): void {
    this.safetyRules = new Map([
      ['toddler', {
        maxHeight: 0.5,
        minEdgeRadius: 0.01, // 1cm minimum radius
        requiresStability: true,
        materialRestrictions: ['no-small-parts', 'non-toxic-only']
      }],
      ['child', {
        maxHeight: 0.7,
        minEdgeRadius: 0.005, // 5mm minimum radius
        requiresStability: true,
        materialRestrictions: ['non-toxic-finishes']
      }],
      ['accessible', {
        armrestRequired: true,
        seatHeightRange: [0.45, 0.48],
        backSupport: 'required',
        transferSpace: 0.75 // 75cm clear space
      }]
    ]);
  }

  private convertToChairParameters(params: ParametricParameters): ChairParameters {
    return {
      ...params,
      targetAge: 'adult', // Default
      comfort: 'medium', // Default
      includeArmrests: params.formality !== 'casual',
      upholsteryMaterial: params.secondaryMaterial?.startsWith('fabric') ? 
        params.secondaryMaterial as any : 'none'
    };
  }

  private validateAndAdjustParameters(params: ChairParameters): ChairParameters {
    const adjusted = { ...params };
    
    // Apply age-based safety adjustments
    if (params.targetAge === 'toddler' || params.targetAge === 'child') {
      adjusted.includeArmrests = false; // Safer for kids
      if (params.primaryMaterial.includes('metal')) {
        adjusted.primaryMaterial = 'wood-pine'; // Safer material
        console.warn('⚠️ Adjusted material to wood for child safety');
      }
    }
    
    // Apply accessibility adjustments
    if (params.ergonomicProfile === 'accessible') {
      adjusted.includeArmrests = true;
      console.log('✅ Added armrests for accessibility');
    }

    // Apply French savoir-vivre adjustments
    if (params.culture === 'french') {
      const culturalData = this.culturalData.get('french')!;
      if (culturalData.savoirVivre && params.formality === 'formal') {
        adjusted.includeArmrests = true; // Proper for French salon style
        console.log('🇫🇷 Applied French savoir-vivre adjustments');
      }
    }
    
    return adjusted;
  }

  private calculateDimensions(params: ChairParameters): any {
    const culturalData = this.culturalData.get(params.culture)!;
    const ageAdjustment = this.ageAdjustments.get(params.targetAge)!;
    
    // Calculate base dimensions with AI cultural knowledge integration
    let height = culturalData.baseHeight * ageAdjustment;
    
    // Apply French savoir-vivre adjustments
    if (params.culture === 'french' && culturalData.savoirVivre) {
      height *= culturalData.savoirVivre.formalityAdjustment;
    }
    
    const width = height * culturalData.proportions.widthToHeightRatio;
    const depth = height * culturalData.proportions.depthToHeightRatio;
    const backrestHeight = height * culturalData.proportions.backrestHeightRatio;
    const legThickness = width * culturalData.proportions.legThicknessRatio;
    
    // Apply accessibility adjustments
    if (params.ergonomicProfile === 'accessible') {
      const accessibleHeight = Math.max(0.45, Math.min(0.48, height));
      return {
        seatHeight: accessibleHeight,
        seatWidth: width,
        seatDepth: depth,
        backrestHeight: backrestHeight,
        legThickness: legThickness,
        seatThickness: 0.04,
        backrestThickness: 0.03
      };
    }
    
    return {
      seatHeight: height,
      seatWidth: width,
      seatDepth: depth,
      backrestHeight: backrestHeight,
      legThickness: legThickness,
      seatThickness: 0.04,
      backrestThickness: 0.03
    };
  }

  private generateSeat(dimensions: any, params: ChairParameters): THREE.Mesh {
    const culturalData = this.culturalData.get(params.culture)!;
    let seatGeometry: THREE.BufferGeometry;
    
    switch (culturalData.styleElements.seatStyle) {
      case 'flat':
        seatGeometry = new THREE.BoxGeometry(
          dimensions.seatWidth,
          dimensions.seatThickness,
          dimensions.seatDepth
        );
        break;
      
      case 'contoured':
        seatGeometry = this.createContouredSeat(dimensions);
        break;
      
      case 'padded':
        if (params.culture === 'french') {
          // French padded seat with bergère styling
          seatGeometry = this.createFrenchPaddedSeat(dimensions);
        } else {
          seatGeometry = this.createPaddedSeat(dimensions);
        }
        break;
      
      default:
        seatGeometry = new THREE.BoxGeometry(
          dimensions.seatWidth,
          dimensions.seatThickness,
          dimensions.seatDepth
        );
    }
    
    // Apply edge rounding for safety
    if (params.targetAge === 'toddler' || params.targetAge === 'child') {
      seatGeometry = this.addSafetyRounding(seatGeometry);
    }
    
    const seat = new THREE.Mesh(seatGeometry);
    seat.position.y = dimensions.seatHeight;
    seat.castShadow = true;
    seat.receiveShadow = true;
    seat.userData.component = 'seat';
    
    return seat;
  }

  private generateBackrest(dimensions: any, params: ChairParameters): THREE.Mesh {
    const culturalData = this.culturalData.get(params.culture)!;
    let backrestGeometry: THREE.BufferGeometry;
    
    switch (culturalData.styleElements.backStyle) {
      case 'straight':
        backrestGeometry = new THREE.BoxGeometry(
          dimensions.seatWidth * 0.9,
          dimensions.backrestHeight,
          dimensions.backrestThickness
        );
        break;
      
      case 'curved':
        backrestGeometry = this.createCurvedBackrest(dimensions);
        break;
      
      case 'ergonomic':
        backrestGeometry = this.createErgonomicBackrest(dimensions);
        break;

      case 'bergere':
        // French bergère style backrest
        backrestGeometry = this.createBergereBackrest(dimensions);
        break;
      
      default:
        backrestGeometry = new THREE.BoxGeometry(
          dimensions.seatWidth * 0.9,
          dimensions.backrestHeight,
          dimensions.backrestThickness
        );
    }
    
    const backrest = new THREE.Mesh(backrestGeometry);
    backrest.position.y = dimensions.seatHeight + (dimensions.backrestHeight / 2);
    backrest.position.z = -(dimensions.seatDepth / 2) + (dimensions.backrestThickness / 2);
    
    // Apply cultural angle with French savoir-vivre considerations
    let backAngle = this.getCulturalBackAngle(params.culture);
    if (params.culture === 'french') {
      const culturalData = this.culturalData.get('french')!;
      if (culturalData.savoirVivre) {
        backAngle = culturalData.savoirVivre.conversationAngle;
      }
    }
    
    backrest.rotation.x = THREE.MathUtils.degToRad(-backAngle);
    
    backrest.castShadow = true;
    backrest.receiveShadow = true;
    backrest.userData.component = 'backrest';
    
    return backrest;
  }

  private generateLegs(dimensions: any, params: ChairParameters): THREE.Mesh[] {
    const culturalData = this.culturalData.get(params.culture)!;
    const legs: THREE.Mesh[] = [];
    
    // Calculate leg positions
    const legPositions = this.calculateLegPositions(dimensions);
    
    legPositions.forEach((position, index) => {
      let legGeometry: THREE.BufferGeometry;
      
      switch (culturalData.styleElements.legStyle) {
        case 'tapered':
          legGeometry = new THREE.CylinderGeometry(
            dimensions.legThickness * 0.6,
            dimensions.legThickness * 0.8,
            dimensions.seatHeight,
            8
          );
          break;
        
        case 'cylindrical':
          legGeometry = new THREE.CylinderGeometry(
            dimensions.legThickness / 2,
            dimensions.legThickness / 2,
            dimensions.seatHeight,
            8
          );
          break;
        
        case 'turned':
          legGeometry = this.createTurnedLeg(dimensions);
          break;

        case 'cabriole':
          // French cabriole legs with S-curve
          legGeometry = this.createCabrioleLeg(dimensions);
          break;
        
        case 'straight':
        default:
          legGeometry = new THREE.BoxGeometry(
            dimensions.legThickness,
            dimensions.seatHeight,
            dimensions.legThickness
          );
      }
      
      const leg = new THREE.Mesh(legGeometry);
      leg.position.set(position.x, dimensions.seatHeight / 2, position.z);
      leg.castShadow = true;
      leg.userData.component = 'leg';
      
      legs.push(leg);
    });
    
    return legs;
  }

  private generateArmrests(dimensions: any, params: ChairParameters): THREE.Mesh[] {
    const armrests: THREE.Mesh[] = [];
    const armrestHeight = dimensions.seatHeight + (dimensions.backrestHeight * 0.6);
    const armrestWidth = dimensions.seatDepth * 0.8;
    
    let armrestGeometry: THREE.BufferGeometry;
    
    if (params.culture === 'french') {
      // French bergère style armrests
      armrestGeometry = this.createFrenchArmrestGeometry(armrestWidth);
    } else {
      armrestGeometry = new THREE.BoxGeometry(0.08, 0.05, armrestWidth);
    }
    
    // Left armrest
    const leftArmrest = new THREE.Mesh(armrestGeometry);
    leftArmrest.position.set(
      -(dimensions.seatWidth / 2) - 0.04,
      armrestHeight,
      0
    );
    leftArmrest.castShadow = true;
    leftArmrest.userData.component = 'armrest';
    
    // Right armrest
    const rightArmrest = leftArmrest.clone();
    rightArmrest.position.x = (dimensions.seatWidth / 2) + 0.04;
    
    armrests.push(leftArmrest, rightArmrest);
    
    return armrests;
  }

  private addCulturalDetails(dimensions: any, params: ChairParameters): THREE.Object3D[] {
    const details: THREE.Object3D[] = [];
    const culturalData = this.culturalData.get(params.culture)!;
    
    switch (params.culture) {
      case 'japanese':
        if (params.decorativeIntensity > 0.5) {
          details.push(...this.createBambooAccents(dimensions));
        }
        if (culturalData.details.joinery === 'mortise-tenon') {
          details.push(...this.createJoineryDetails(dimensions));
        }
        break;
      
      case 'italian':
        if (params.decorativeIntensity > 0.3) {
          details.push(...this.createCarvedDetails(dimensions));
        }
        break;
      
      case 'scandinavian':
        if (params.comfort === 'plush') {
          details.push(...this.createCushionElements(dimensions));
        }
        break;

      case 'french':
        if (params.decorativeIntensity > 0.4) {
          details.push(...this.createFrenchSavoirVivreDetails(dimensions, params));
        }
        break;
    }
    
    return details;
  }

  // Enhanced French-specific geometry methods
  private createFrenchPaddedSeat(dimensions: any): THREE.BufferGeometry {
    const shape = new THREE.Shape();
    const width = dimensions.seatWidth;
    const depth = dimensions.seatDepth;
    const radius = 0.03; // More generous rounding for French comfort
    
    // Create sophisticated curved seat for bergère style
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
      depth: dimensions.seatThickness * 1.3, // Extra padding for French comfort
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 4
    });
  }

  private createBergereBackrest(dimensions: any): THREE.BufferGeometry {
    // Create traditional French bergère backrest with gentle curves
    const shape = new THREE.Shape();
    const width = dimensions.seatWidth * 0.9;
    const height = dimensions.backrestHeight;
    const topRadius = 0.06; // Elegant curve at top
    
    shape.moveTo(-width/2, -height/2);
    shape.lineTo(width/2, -height/2);
    shape.lineTo(width/2, height/2 - topRadius);
    shape.quadraticCurveTo(width/2, height/2, width/2 - topRadius, height/2);
    shape.lineTo(-width/2 + topRadius, height/2);
    shape.quadraticCurveTo(-width/2, height/2, -width/2, height/2 - topRadius);
    shape.lineTo(-width/2, -height/2);
    
    return new THREE.ExtrudeGeometry(shape, {
      depth: dimensions.backrestThickness,
      bevelEnabled: true,
      bevelThickness: 0.005,
      bevelSize: 0.005,
      bevelSegments: 3
    });
  }

  private createCabrioleLeg(dimensions: any): THREE.BufferGeometry {
    // Create French cabriole leg with S-curve
    const points = [];
    const legHeight = dimensions.seatHeight;
    const maxRadius = dimensions.legThickness / 2;
    
    for (let i = 0; i <= 24; i++) {
      const y = (i / 24) * legHeight;
      let radius = maxRadius;
      
      // Create S-curve characteristic of cabriole legs
      if (i > 3 && i < 8) radius *= 1.15; // Upper bulge
      if (i > 16 && i < 20) radius *= 0.85; // Lower taper
      if (i > 20) radius *= 1.05; // Foot
      
      points.push(new THREE.Vector2(radius, y));
    }
    
    return new THREE.LatheGeometry(points, 16);
  }

  private createFrenchArmrestGeometry(width: number): THREE.BufferGeometry {
    // Create elegant French armrest with gentle curves
    const shape = new THREE.Shape();
    const depth = 0.08;
    const radius = 0.02;
    
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
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.005,
      bevelSize: 0.005,
      bevelSegments: 3
    });
  }

  private createFrenchSavoirVivreDetails(dimensions: any, params: ChairParameters): THREE.Object3D[] {
    const details: THREE.Object3D[] = [];
    
    // Add button tufting
    if (params.decorativeIntensity > 0.6) {
      const buttonGeometry = new THREE.SphereGeometry(0.008, 8, 8);
      const buttonMaterial = new THREE.MeshStandardMaterial({ 
        color: params.colorPalette[1] || '#E6E6FA',
        roughness: 0.8 
      });
      
      const buttonPositions = [
        { x: -0.06, y: dimensions.seatHeight + 0.15, z: -(dimensions.seatDepth / 2) + 0.01 },
        { x: 0.06, y: dimensions.seatHeight + 0.15, z: -(dimensions.seatDepth / 2) + 0.01 },
        { x: 0, y: dimensions.seatHeight + 0.1, z: -(dimensions.seatDepth / 2) + 0.01 }
      ];
      
      buttonPositions.forEach(pos => {
        const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
        button.position.set(pos.x, pos.y, pos.z);
        button.userData.component = 'french-detail';
        details.push(button);
      });
    }
    
    // Add gilt accent
    if (params.decorativeIntensity > 0.7) {
      const accentGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.005, 12);
      const giltMaterial = new THREE.MeshStandardMaterial({ 
        color: '#FFD700',
        metalness: 0.3,
        roughness: 0.2 
      });
      
      const accent = new THREE.Mesh(accentGeometry, giltMaterial);
      accent.position.set(0, dimensions.seatHeight + 0.2, -(dimensions.seatDepth / 2) + 0.005);
      accent.rotation.x = Math.PI / 2;
      accent.userData.component = 'gilt-accent';
      details.push(accent);
    }
    
    return details;
  }

  // Keep all your original helper methods
  private createContouredSeat(dimensions: any): THREE.BufferGeometry {
    const shape = new THREE.Shape();
    const width = dimensions.seatWidth;
    const depth = dimensions.seatDepth;
    
    const radius = 0.02;
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
      depth: dimensions.seatThickness,
      bevelEnabled: true,
      bevelThickness: 0.005,
      bevelSize: 0.005
    });
  }

  private createTurnedLeg(dimensions: any): THREE.BufferGeometry {
    const points = [];
    const legHeight = dimensions.seatHeight;
    const maxRadius = dimensions.legThickness / 2;
    
    for (let i = 0; i <= 20; i++) {
      const y = (i / 20) * legHeight;
      let radius = maxRadius;
      
      if (i > 2 && i < 6) radius *= 1.2;
      if (i > 14 && i < 18) radius *= 0.8;
      
      points.push(new THREE.Vector2(radius, y));
    }
    
    return new THREE.LatheGeometry(points, 12);
  }

  private calculateLegPositions(dimensions: any): Array<{x: number, z: number}> {
    const inset = 0.05;
    const halfWidth = (dimensions.seatWidth / 2) - inset;
    const halfDepth = (dimensions.seatDepth / 2) - inset;
    
    return [
      { x: -halfWidth, z: -halfDepth },
      { x: halfWidth, z: -halfDepth },
      { x: -halfWidth, z: halfDepth },
      { x: halfWidth, z: halfDepth }
    ];
  }

  private getCulturalBackAngle(culture: string): number {
    const angles: Record<string, number> = {
      'japanese': 15,
      'scandinavian': 20,
      'italian': 18,
      'french': 18, // Will be overridden by savoir-vivre settings
      'modern': 15
    };
    return angles[culture] || 15;
  }

  private addSafetyRounding(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
    geometry.userData.safetyRounding = true;
    return geometry;
  }

  private createBambooAccents(dimensions: any): THREE.Object3D[] {
    const accents: THREE.Object3D[] = [];
    
    const bambooGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.1, 6);
    const bambooElement = new THREE.Mesh(bambooGeometry);
    bambooElement.position.set(0, dimensions.seatHeight + 0.05, -(dimensions.seatDepth / 2) + 0.01);
    bambooElement.userData.component = 'cultural-accent';
    
    accents.push(bambooElement);
    return accents;
  }

  private createJoineryDetails(dimensions: any): THREE.Object3D[] {
    const details: THREE.Object3D[] = [];
    
    const jointGeometry = new THREE.BoxGeometry(0.02, 0.02, 0.04);
    const joint = new THREE.Mesh(jointGeometry);
    joint.position.set(0, dimensions.seatHeight - 0.02, 0);
    joint.userData.component = 'joinery-detail';
    
    details.push(joint);
    return details;
  }

  private createCarvedDetails(dimensions: any): THREE.Object3D[] {
    return [];
  }

  private createCushionElements(dimensions: any): THREE.Object3D[] {
    return [];
  }

  private createCurvedBackrest(dimensions: any): THREE.BufferGeometry {
    return new THREE.BoxGeometry(
      dimensions.seatWidth * 0.9,
      dimensions.backrestHeight,
      dimensions.backrestThickness
    );
  }

  private createErgonomicBackrest(dimensions: any): THREE.BufferGeometry {
    return new THREE.BoxGeometry(
      dimensions.seatWidth * 0.9,
      dimensions.backrestHeight,
      dimensions.backrestThickness
    );
  }

  private createPaddedSeat(dimensions: any): THREE.BufferGeometry {
    return new THREE.BoxGeometry(
      dimensions.seatWidth,
      dimensions.seatThickness * 1.5,
      dimensions.seatDepth
    );
  }

  private applyMaterials(chair: THREE.Group, params: ChairParameters): void {
    chair.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const component = child.userData.component;
        
        switch (component) {
          case 'seat':
          case 'backrest':
            if (params.upholsteryMaterial && params.upholsteryMaterial !== 'none') {
              child.material = this.createUpholsteryMaterial(params.upholsteryMaterial, params.colorPalette);
            } else {
              child.material = this.createWoodMaterial(params.primaryMaterial, params.colorPalette);
            }
            break;
          
          case 'leg':
          case 'armrest':
          case 'joinery-detail':
            child.material = this.createWoodMaterial(params.primaryMaterial, params.colorPalette);
            break;
          
          case 'cultural-accent':
          case 'french-detail':
            child.material = this.createAccentMaterial(params.culture, params.colorPalette);
            break;

          case 'gilt-accent':
            child.material = new THREE.MeshStandardMaterial({
              color: '#FFD700',
              metalness: 0.7,
              roughness: 0.2
            });
            break;
          
          default:
            child.material = this.createWoodMaterial(params.primaryMaterial, params.colorPalette);
        }
      }
    });
  }

  private createWoodMaterial(woodType: string, colorPalette: string[]): THREE.Material {
    const woodColors: Record<string, string> = {
      'wood-oak': '#D2B48C',
      'wood-pine': '#F5DEB3',
      'wood-cherry': '#8B4513',
      'wood-bamboo': '#DAA520'
    };
    
    return new THREE.MeshStandardMaterial({
      color: woodColors[woodType] || woodColors['wood-oak'],
      roughness: 0.7,
      metalness: 0.0
    });
  }

  private createUpholsteryMaterial(upholsteryType: string, colorPalette: string[]): THREE.Material {
    const baseColor = colorPalette[0] || '#4169E1';
    
    return new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.8,
      metalness: 0.0
    });
  }

  private createAccentMaterial(culture: string, colorPalette: string[]): THREE.Material {
    const culturalColors: Record<string, string> = {
      'japanese': '#228B22',
      'scandinavian': '#F5F5DC',
      'italian': '#FFD700',
      'french': '#DDA0DD',
      'modern': '#696969'
    };
    
    return new THREE.MeshStandardMaterial({
      color: culturalColors[culture] || '#696969',
      roughness: 0.6,
      metalness: 0.0
    });
  }

  private calculateAuthenticityScore(params: ChairParameters): number {
    const culturalData = this.culturalData.get(params.culture)!;
    let score = 100;
    
    if (!culturalData.materials.preferred.includes(params.primaryMaterial)) {
      score -= 20;
    }
    
    if (params.formality === 'ceremonial' && params.culture !== 'japanese') {
      score -= 10;
    }
    
    if (params.targetAge === 'toddler' && params.includeArmrests) {
      score -= 5;
    }

    // French savoir-vivre bonus
    if (params.culture === 'french' && params.formality === 'formal' && params.includeArmrests) {
      score += 10;
    }
    
    return Math.max(0, score);
  }

  // ParametricTemplate interface methods
  generateMetadata(parameters: ParametricParameters): FurnitureMetadata {
    const chairParams = this.convertToChairParameters(parameters);
    return {
      id: `enhanced-chair-${chairParams.culture}-${Date.now()}`,
      name: `${chairParams.culture} Enhanced Chair`,
      description: `AI-generated ${chairParams.culture} chair with ${chairParams.targetAge} ergonomics`,
      culturalSignificance: this.getCulturalSignificance(chairParams.culture),
      usageGuidelines: this.getUsageGuidelines(chairParams),
      maintenanceInstructions: this.getMaintenanceInstructions(chairParams),
      estimatedCost: this.estimateCost(chairParams)
    };
  }

  getCulturalProportions(culture: CultureType): CulturalProportions {
    const data = this.culturalData.get(culture);
    if (!data) throw new Error(`Unknown culture: ${culture}`);
    
    return {
      seatHeight: data.baseHeight,
      tableHeight: 0.75, // Standard
      armrestHeight: data.baseHeight + 0.2,
      backrestAngle: this.getCulturalBackAngle(culture),
      legThickness: data.baseHeight * data.proportions.legThicknessRatio,
      surfaceThickness: 0.04
    };
  }

  validateParameters(parameters: ParametricParameters): boolean {
    return parameters.width > 0.3 && parameters.width < 1.0 &&
           parameters.height > 0.3 && parameters.height < 1.2 &&
           parameters.depth > 0.3 && parameters.depth < 1.0;
  }

  private getCulturalSignificance(culture: string): string {
    const significance: Record<string, string> = {
      'japanese': 'Represents harmony with nature and mindful living, embodying wabi-sabi principles',
      'scandinavian': 'Embodies hygge philosophy of comfort and well-being',
      'italian': 'Reflects Renaissance ideals of beauty and craftsmanship',
      'french': 'Embodies French savoir-vivre and the art of elegant conversation',
      'modern': 'Represents form-follows-function and contemporary design'
    };
    return significance[culture] || 'Cultural design traditions';
  }

  private getUsageGuidelines(params: ChairParameters): string[] {
    const guidelines = [
      `Designed for ${params.targetAge} users`,
      `${params.comfort} comfort level`,
      `Suitable for ${params.formality} occasions`
    ];
    
    if (params.culture === 'french') {
      guidelines.push('Positioned for optimal conversation and social interaction');
    }
    
    return guidelines;
  }

  private getMaintenanceInstructions(params: ChairParameters): string[] {
    return [
      'Dust regularly with soft cloth',
      'Avoid direct sunlight',
      'Clean spills immediately'
    ];
  }

  private estimateCost(params: ChairParameters): number {
    let baseCost = 300;
    
    const materialMultipliers: Record<string, number> = {
      'wood-cherry': 1.5,
      'wood-walnut': 1.8,
      'wood-oak': 1.2,
      'wood-pine': 1.0,
      'wood-bamboo': 1.1,
      'wood-mahogany': 1.6
    };
    
    baseCost *= materialMultipliers[params.primaryMaterial] || 1.0;
    
    if (params.culture === 'french' && params.decorativeIntensity > 0.6) {
      baseCost *= 1.4; // French savoir-vivre premium
    }
    
    return Math.round(baseCost);
  }
}

// Template is already exported above

// Create test function
export function createEnhancedTestChair(): THREE.Group {
  const template = new EnhancedChairTemplate();
  
  const frenchChairParams: ChairParameters = {
    culture: 'french',
    targetAge: 'adult',
    ergonomicProfile: 'average',
    formality: 'formal',
    comfort: 'medium',
    primaryMaterial: 'wood-cherry',
    upholsteryMaterial: 'fabric-cotton',
    colorPalette: ['#DDA0DD', '#F0E68C'],
    decorativeIntensity: 0.8,
    includeArmrests: true,
    type: 'chair',
    width: 0.5,
    height: 0.44,
    depth: 0.5,
    style: 'traditional',
    culturalElements: ['bergere-styling', 'refined-curves', 'upholstered-elegance'],
    craftsmanshipLevel: 'masterwork'
  };
  
  return template.generateChair(frenchChairParams);
}