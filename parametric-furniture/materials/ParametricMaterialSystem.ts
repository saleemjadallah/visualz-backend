import * as THREE from 'three';
import { MaterialType, ParametricParameters, CultureType } from '../types/index';

export class ParametricMaterialSystem {
  private materialCache: Map<string, THREE.Material> = new Map();
  private textureLoader: THREE.TextureLoader;

  constructor() {
    this.textureLoader = new THREE.TextureLoader();
    this.initializeMaterials();
  }

  getMaterial(materialType: MaterialType, parameters: ParametricParameters): THREE.Material {
    const cacheKey = `${materialType}-${parameters.culture}-${parameters.decorativeIntensity}`;
    
    if (this.materialCache.has(cacheKey)) {
      return this.materialCache.get(cacheKey)!.clone();
    }

    const material = this.createMaterial(materialType, parameters);
    this.materialCache.set(cacheKey, material);
    return material.clone();
  }

  generateMaterials(parameters: ParametricParameters): THREE.Material[] {
    const materials: THREE.Material[] = [];
    
    // Primary material
    materials.push(this.getMaterial(parameters.primaryMaterial, parameters));
    
    // Secondary material if specified
    if (parameters.secondaryMaterial) {
      materials.push(this.getMaterial(parameters.secondaryMaterial, parameters));
    }
    
    return materials;
  }

  private createMaterial(materialType: MaterialType, parameters: ParametricParameters): THREE.Material {
    const culturalColors = this.getCulturalColors(parameters.culture);
    const baseColor = parameters.colorPalette[0] || culturalColors[0];
    
    switch (materialType) {
      case 'wood-oak':
        return this.createWoodMaterial(baseColor, 'oak', parameters);
      case 'wood-pine':
        return this.createWoodMaterial(baseColor, 'pine', parameters);
      case 'wood-cherry':
        return this.createWoodMaterial(baseColor, 'cherry', parameters);
      case 'wood-bamboo':
        return this.createWoodMaterial(baseColor, 'bamboo', parameters);
      
      case 'fabric-cotton':
        return this.createFabricMaterial(baseColor, 'cotton', parameters);
      case 'fabric-linen':
        return this.createFabricMaterial(baseColor, 'linen', parameters);
      case 'fabric-silk':
        return this.createFabricMaterial(baseColor, 'silk', parameters);
      case 'fabric-wool':
        return this.createFabricMaterial(baseColor, 'wool', parameters);
      
      case 'metal-brass':
        return this.createMetalMaterial(baseColor, 'brass', parameters);
      case 'metal-steel':
        return this.createMetalMaterial(baseColor, 'steel', parameters);
      case 'metal-copper':
        return this.createMetalMaterial(baseColor, 'copper', parameters);
      
      case 'leather':
        return this.createLeatherMaterial(baseColor, parameters);
      case 'ceramic':
        return this.createCeramicMaterial(baseColor, parameters);
      case 'glass':
        return this.createGlassMaterial(baseColor, parameters);
      case 'stone':
        return this.createStoneMaterial(baseColor, parameters);
      
      default:
        return this.createDefaultMaterial(baseColor, parameters);
    }
  }

  private createWoodMaterial(baseColor: string, woodType: string, parameters: ParametricParameters): THREE.Material {
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(baseColor),
      roughness: this.getWoodRoughness(woodType, parameters),
      metalness: 0.0,
      name: `${woodType}-wood`
    });

    // Apply cultural finishing
    this.applyCulturalFinishing(material, parameters);
    
    // Add grain texture if high decorative intensity
    if (parameters.decorativeIntensity > 0.5) {
      this.addWoodGrainTexture(material, woodType);
    }

    return material;
  }

  private createFabricMaterial(baseColor: string, fabricType: string, parameters: ParametricParameters): THREE.Material {
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(baseColor),
      roughness: this.getFabricRoughness(fabricType, parameters),
      metalness: 0.0,
      name: `${fabricType}-fabric`
    });

    // Apply cultural patterns
    this.applyCulturalPatterns(material, parameters);
    
    // Add fabric texture
    if (parameters.decorativeIntensity > 0.3) {
      this.addFabricTexture(material, fabricType);
    }

    return material;
  }

  private createMetalMaterial(baseColor: string, metalType: string, parameters: ParametricParameters): THREE.Material {
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(baseColor),
      roughness: this.getMetalRoughness(metalType, parameters),
      metalness: this.getMetalness(metalType, parameters),
      name: `${metalType}-metal`
    });

    // Apply cultural finishing
    this.applyCulturalFinishing(material, parameters);

    return material;
  }

  private createLeatherMaterial(baseColor: string, parameters: ParametricParameters): THREE.Material {
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(baseColor),
      roughness: 0.8,
      metalness: 0.0,
      name: 'leather'
    });

    // Add leather texture
    if (parameters.decorativeIntensity > 0.4) {
      this.addLeatherTexture(material);
    }

    return material;
  }

  private createCeramicMaterial(baseColor: string, parameters: ParametricParameters): THREE.Material {
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(baseColor),
      roughness: 0.1,
      metalness: 0.0,
      name: 'ceramic'
    });

    // Apply cultural glazing
    this.applyCulturalGlazing(material, parameters);

    return material;
  }

  private createGlassMaterial(baseColor: string, parameters: ParametricParameters): THREE.Material {
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(baseColor),
      roughness: 0.0,
      metalness: 0.0,
      transmission: 0.9,
      transparent: true,
      opacity: 0.8,
      name: 'glass'
    });

    return material;
  }

  private createStoneMaterial(baseColor: string, parameters: ParametricParameters): THREE.Material {
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(baseColor),
      roughness: 0.9,
      metalness: 0.0,
      name: 'stone'
    });

    // Add stone texture
    if (parameters.decorativeIntensity > 0.3) {
      this.addStoneTexture(material);
    }

    return material;
  }

  private createDefaultMaterial(baseColor: string, parameters: ParametricParameters): THREE.Material {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(baseColor),
      roughness: 0.5,
      metalness: 0.0,
      name: 'default'
    });
  }

  // Cultural color schemes
  private getCulturalColors(culture: CultureType): string[] {
    const culturalPalettes = {
      'japanese': ['#8B4513', '#D2691E', '#F5DEB3', '#FFFAF0'],
      'scandinavian': ['#F5F5DC', '#E6E6FA', '#B0C4DE', '#FFFAF0'],
      'italian': ['#8B4513', '#CD853F', '#DAA520', '#F5DEB3'],
      'french': ['#F5F5DC', '#E6E6FA', '#DDA0DD', '#F0E68C'],
      'modern': ['#000000', '#FFFFFF', '#808080', '#C0C0C0']
    };
    
    return culturalPalettes[culture] || culturalPalettes['modern'];
  }

  // Material property calculators
  private getWoodRoughness(woodType: string, parameters: ParametricParameters): number {
    const baseRoughness: Record<string, number> = {
      'oak': 0.8,
      'pine': 0.7,
      'cherry': 0.6,
      'bamboo': 0.5
    };
    
    const base = baseRoughness[woodType] || 0.7;
    const craftsmanshipMultiplier: Record<string, number> = {
      'simple': 1.2,
      'refined': 1.0,
      'masterwork': 0.8
    };
    
    return base * (craftsmanshipMultiplier[parameters.craftsmanshipLevel] || 1.0);
  }

  private getFabricRoughness(fabricType: string, parameters: ParametricParameters): number {
    const baseRoughness: Record<string, number> = {
      'cotton': 0.9,
      'linen': 0.8,
      'silk': 0.3,
      'wool': 1.0
    };
    
    return baseRoughness[fabricType] || 0.8;
  }

  private getMetalRoughness(metalType: string, parameters: ParametricParameters): number {
    const baseRoughness: Record<string, number> = {
      'brass': 0.3,
      'steel': 0.2,
      'copper': 0.4
    };
    
    const base = baseRoughness[metalType] || 0.3;
    const culturalMultiplier = this.getCulturalMetalFinish(parameters.culture);
    
    return base * culturalMultiplier;
  }

  private getMetalness(metalType: string, parameters: ParametricParameters): number {
    const baseMetalness: Record<string, number> = {
      'brass': 0.9,
      'steel': 1.0,
      'copper': 0.8
    };
    
    return baseMetalness[metalType] || 0.8;
  }

  private getCulturalMetalFinish(culture: CultureType): number {
    const finishMultipliers = {
      'japanese': 1.2, // More matte, natural finish
      'scandinavian': 1.1,
      'italian': 0.8, // More polished
      'french': 0.9,
      'modern': 0.7 // Highly polished
    };
    
    return finishMultipliers[culture] || 1.0;
  }

  // Cultural finishing applications
  private applyCulturalFinishing(material: THREE.MeshStandardMaterial, parameters: ParametricParameters): void {
    switch (parameters.culture) {
      case 'japanese':
        // Apply natural, matte finish
        material.roughness = Math.min(1.0, material.roughness * 1.2);
        break;
      case 'scandinavian':
        // Apply clean, practical finish
        material.roughness = Math.min(1.0, material.roughness * 1.1);
        break;
      case 'italian':
        // Apply polished, luxurious finish
        material.roughness = Math.max(0.1, material.roughness * 0.8);
        break;
      case 'french':
        // Apply refined, elegant finish
        material.roughness = Math.max(0.2, material.roughness * 0.9);
        break;
      case 'modern':
        // Apply precise, controlled finish
        material.roughness = Math.max(0.1, material.roughness * 0.7);
        break;
    }
  }

  private applyCulturalPatterns(material: THREE.MeshStandardMaterial, parameters: ParametricParameters): void {
    // Apply cultural patterns based on decorative intensity
    if (parameters.decorativeIntensity > 0.6) {
      switch (parameters.culture) {
        case 'japanese':
          // Subtle geometric patterns
          break;
        case 'scandinavian':
          // Simple stripes or checks
          break;
        case 'italian':
          // Ornate floral patterns
          break;
        case 'french':
          // Elegant damask patterns
          break;
      }
    }
  }

  private applyCulturalGlazing(material: THREE.MeshStandardMaterial, parameters: ParametricParameters): void {
    switch (parameters.culture) {
      case 'japanese':
        // Celadon or tenmoku glazing
        material.roughness = 0.2;
        break;
      case 'scandinavian':
        // Clean, white glazing
        material.roughness = 0.1;
        break;
      case 'italian':
        // Rich, colorful glazing
        material.roughness = 0.15;
        break;
      case 'french':
        // Elegant, refined glazing
        material.roughness = 0.1;
        break;
    }
  }

  // Texture application methods
  private addWoodGrainTexture(material: THREE.MeshStandardMaterial, woodType: string): void {
    // In a real implementation, these would load actual texture files
    // For now, we'll simulate with procedural adjustments
    material.roughness = material.roughness * 0.9; // Slight texture variation
  }

  private addFabricTexture(material: THREE.MeshStandardMaterial, fabricType: string): void {
    // Add fabric-specific texture properties
    if (fabricType === 'wool') {
      material.roughness = 1.0;
    } else if (fabricType === 'silk') {
      material.roughness = 0.2;
    }
  }

  private addLeatherTexture(material: THREE.MeshStandardMaterial): void {
    // Add leather grain texture
    material.roughness = 0.9;
  }

  private addStoneTexture(material: THREE.MeshStandardMaterial): void {
    // Add stone surface texture
    material.roughness = 1.0;
  }

  // Material validation and optimization
  validateMaterial(material: THREE.Material): boolean {
    return material instanceof THREE.MeshStandardMaterial || 
           material instanceof THREE.MeshPhysicalMaterial;
  }

  optimizeMaterial(material: THREE.Material): THREE.Material {
    // Optimize material for performance
    if (material instanceof THREE.MeshStandardMaterial) {
      // Reduce unnecessary properties for performance
      if (material.metalness === 0) {
        material.metalness = 0.0;
      }
    }
    
    return material;
  }

  // Initialize common materials
  private initializeMaterials(): void {
    // Pre-cache common materials for performance
    const commonMaterials = [
      'wood-oak',
      'wood-pine',
      'fabric-cotton',
      'metal-steel'
    ];
    
    const baseParameters = {
      type: 'chair' as const,
      culture: 'modern' as const,
      width: 0.5,
      height: 0.8,
      depth: 0.5,
      style: 'contemporary' as const,
      formality: 'semi-formal' as const,
      primaryMaterial: 'wood-oak' as const,
      culturalElements: [],
      ergonomicProfile: 'average' as const,
      colorPalette: ['#8B4513'],
      decorativeIntensity: 0.5,
      craftsmanshipLevel: 'refined' as const
    };
    
    commonMaterials.forEach(materialType => {
      const material = this.createMaterial(materialType as MaterialType, baseParameters);
      this.materialCache.set(`${materialType}-modern-0.5`, material);
    });
  }

  // Material system utilities
  getCachedMaterialCount(): number {
    return this.materialCache.size;
  }

  clearMaterialCache(): void {
    this.materialCache.clear();
    this.initializeMaterials();
  }

  getMaterialInfo(materialType: MaterialType): {
    name: string;
    description: string;
    properties: string[];
    culturalFit: CultureType[];
  } {
    const materialInfo: Record<string, any> = {
      'wood-oak': {
        name: 'Oak Wood',
        description: 'Durable hardwood with prominent grain',
        properties: ['Strong', 'Traditional', 'Natural'],
        culturalFit: ['japanese', 'scandinavian', 'french'] as CultureType[]
      },
      'wood-pine': {
        name: 'Pine Wood',
        description: 'Softwood with light color and subtle grain',
        properties: ['Light', 'Affordable', 'Versatile'],
        culturalFit: ['scandinavian', 'modern'] as CultureType[]
      },
      'wood-cherry': {
        name: 'Cherry Wood',
        description: 'Rich hardwood with warm reddish tone',
        properties: ['Elegant', 'Warm', 'Premium'],
        culturalFit: ['japanese', 'italian', 'french'] as CultureType[]
      },
      'wood-walnut': {
        name: 'Walnut Wood',
        description: 'Luxury hardwood with rich chocolate tones',
        properties: ['Luxurious', 'Rich', 'Sophisticated'],
        culturalFit: ['french', 'italian'] as CultureType[]
      },
      'fabric-silk': {
        name: 'Silk Fabric',
        description: 'Luxurious natural fiber with lustrous appearance',
        properties: ['Luxurious', 'Smooth', 'Elegant'],
        culturalFit: ['italian', 'french'] as CultureType[]
      },
      'fabric-velvet': {
        name: 'Velvet Fabric',
        description: 'Soft pile fabric with rich texture',
        properties: ['Luxurious', 'Soft', 'Rich'],
        culturalFit: ['french', 'italian'] as CultureType[]
      },
      'metal-steel': {
        name: 'Steel',
        description: 'Strong, durable metal with modern appeal',
        properties: ['Strong', 'Modern', 'Industrial'],
        culturalFit: ['modern'] as CultureType[]
      },
      'bronze-patina': {
        name: 'Bronze with Patina',
        description: 'Traditional metal with aged finish',
        properties: ['Traditional', 'Elegant', 'Aged'],
        culturalFit: ['french', 'italian'] as CultureType[]
      },
      'marble': {
        name: 'Marble',
        description: 'Luxury natural stone with veining',
        properties: ['Luxurious', 'Natural', 'Premium'],
        culturalFit: ['italian', 'french'] as CultureType[]
      }
    };
    
    return materialInfo[materialType] || {
      name: 'Unknown Material',
      description: 'Material information not available',
      properties: [],
      culturalFit: []
    };
  }
}