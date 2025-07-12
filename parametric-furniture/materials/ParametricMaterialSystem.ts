import * as THREE from 'three';
import { MaterialType, ParametricParameters, CultureType } from '../types/index';

interface TextureSet {
  map?: THREE.Texture;
  normalMap?: THREE.Texture;
  roughnessMap?: THREE.Texture;
  metalnessMap?: THREE.Texture;
  aoMap?: THREE.Texture;
  displacementMap?: THREE.Texture;
}

export class ParametricMaterialSystem {
  private materialCache: Map<string, THREE.Material> = new Map();
  private textureLoader: THREE.TextureLoader;
  private textureCache: Map<string, THREE.Texture> = new Map();
  private loadingManager: THREE.LoadingManager;
  private loadingState = { loaded: 0, total: 0 };

  constructor() {
    this.loadingManager = new THREE.LoadingManager();
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
    this.initializeMaterials();
    this.setupLoadingCallbacks();
  }

  private setupLoadingCallbacks(): void {
    this.loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
      console.log(`Started loading texture: ${url}`);
      this.loadingState.loaded = itemsLoaded;
      this.loadingState.total = itemsTotal;
    };

    this.loadingManager.onLoad = () => {
      console.log('All textures loaded');
      this.loadingState.loaded = this.loadingState.total;
    };

    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      console.log(`Loading progress: ${itemsLoaded} / ${itemsTotal}`);
      this.loadingState.loaded = itemsLoaded;
      this.loadingState.total = itemsTotal;
    };

    this.loadingManager.onError = (url) => {
      console.error(`Error loading texture: ${url}`);
    };
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
      // Texture loading is async, so we initiate it but don't await
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
      // Texture loading is async, so we initiate it but don't await
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

    // Add metal textures if high decorative intensity
    if (parameters.decorativeIntensity > 0.5) {
      // Texture loading is async, so we initiate it but don't await
      this.addMetalTexture(material, metalType);
    }

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
      // Texture loading is async, so we initiate it but don't await
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
      // Texture loading is async, so we initiate it but don't await
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

  // Texture URL mapping - using placeholder CDN URLs that can be replaced with actual assets
  private getTextureURLs(materialType: string): Partial<Record<keyof TextureSet, string>> {
    // These are placeholder URLs - replace with actual texture assets when available
    const baseURL = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/';
    
    const textureMap: Record<string, Partial<Record<keyof TextureSet, string>>> = {
      'wood-oak': {
        map: `${baseURL}hardwood2_diffuse.jpg`,
        normalMap: `${baseURL}hardwood2_normal.jpg`,
        roughnessMap: `${baseURL}hardwood2_roughness.jpg`,
        aoMap: `${baseURL}hardwood2_ao.jpg`
      },
      'wood-pine': {
        map: `${baseURL}hardwood2_diffuse.jpg`,
        normalMap: `${baseURL}hardwood2_normal.jpg`,
        roughnessMap: `${baseURL}hardwood2_roughness.jpg`
      },
      'wood-cherry': {
        map: `${baseURL}hardwood2_diffuse.jpg`,
        normalMap: `${baseURL}hardwood2_normal.jpg`,
        roughnessMap: `${baseURL}hardwood2_roughness.jpg`
      },
      'wood-bamboo': {
        map: `${baseURL}hardwood2_diffuse.jpg`,
        normalMap: `${baseURL}hardwood2_normal.jpg`
      },
      'fabric-cotton': {
        map: `${baseURL}fabric_diffuse.jpg`,
        normalMap: `${baseURL}fabric_normal.jpg`,
        roughnessMap: `${baseURL}fabric_roughness.jpg`
      },
      'fabric-silk': {
        map: `${baseURL}fabric_diffuse.jpg`,
        normalMap: `${baseURL}fabric_normal.jpg`
      },
      'leather': {
        map: `${baseURL}leather_diffuse.jpg`,
        normalMap: `${baseURL}leather_normal.jpg`,
        roughnessMap: `${baseURL}leather_roughness.jpg`
      },
      'metal-brass': {
        map: `${baseURL}metal_diffuse.jpg`,
        normalMap: `${baseURL}metal_normal.jpg`,
        roughnessMap: `${baseURL}metal_roughness.jpg`,
        metalnessMap: `${baseURL}metal_metalness.jpg`
      },
      'metal-steel': {
        normalMap: `${baseURL}metal_normal.jpg`,
        roughnessMap: `${baseURL}metal_roughness.jpg`,
        metalnessMap: `${baseURL}metal_metalness.jpg`
      },
      'stone': {
        map: `${baseURL}stone_diffuse.jpg`,
        normalMap: `${baseURL}stone_normal.jpg`,
        roughnessMap: `${baseURL}stone_roughness.jpg`,
        aoMap: `${baseURL}stone_ao.jpg`,
        displacementMap: `${baseURL}stone_displacement.jpg`
      },
      'ceramic': {
        map: `${baseURL}ceramic_tiles_diffuse.jpg`,
        normalMap: `${baseURL}ceramic_tiles_normal.jpg`
      }
    };
    
    return textureMap[materialType] || {};
  }

  // Load texture with caching
  private async loadTexture(url: string, settings?: {
    wrapS?: THREE.Wrapping;
    wrapT?: THREE.Wrapping;
    repeat?: THREE.Vector2;
    anisotropy?: number;
  }): Promise<THREE.Texture> {
    if (this.textureCache.has(url)) {
      return this.textureCache.get(url)!.clone();
    }

    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        url,
        (texture) => {
          // Apply settings
          if (settings?.wrapS) texture.wrapS = settings.wrapS;
          if (settings?.wrapT) texture.wrapT = settings.wrapT;
          if (settings?.repeat) texture.repeat.copy(settings.repeat);
          if (settings?.anisotropy) texture.anisotropy = settings.anisotropy;
          
          // Default settings for better quality
          texture.generateMipmaps = true;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          
          this.textureCache.set(url, texture);
          resolve(texture.clone());
        },
        (progress) => {
          // Progress callback
        },
        (error) => {
          console.error(`Failed to load texture: ${url}`, error);
          reject(error);
        }
      );
    });
  }

  // Load texture set for PBR materials
  private async loadTextureSet(materialType: string, tiling: number = 1): Promise<TextureSet> {
    const urls = this.getTextureURLs(materialType);
    const textureSet: TextureSet = {};
    const loadPromises: Promise<void>[] = [];

    const textureSettings = {
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping,
      repeat: new THREE.Vector2(tiling, tiling),
      anisotropy: 16
    };

    // Load each texture type if URL exists
    if (urls.map) {
      loadPromises.push(
        this.loadTexture(urls.map, textureSettings).then(texture => {
          textureSet.map = texture;
        })
      );
    }

    if (urls.normalMap) {
      loadPromises.push(
        this.loadTexture(urls.normalMap, textureSettings).then(texture => {
          textureSet.normalMap = texture;
        })
      );
    }

    if (urls.roughnessMap) {
      loadPromises.push(
        this.loadTexture(urls.roughnessMap, textureSettings).then(texture => {
          textureSet.roughnessMap = texture;
        })
      );
    }

    if (urls.metalnessMap) {
      loadPromises.push(
        this.loadTexture(urls.metalnessMap, textureSettings).then(texture => {
          textureSet.metalnessMap = texture;
        })
      );
    }

    if (urls.aoMap) {
      loadPromises.push(
        this.loadTexture(urls.aoMap, textureSettings).then(texture => {
          textureSet.aoMap = texture;
        })
      );
    }

    if (urls.displacementMap) {
      loadPromises.push(
        this.loadTexture(urls.displacementMap, textureSettings).then(texture => {
          textureSet.displacementMap = texture;
        })
      );
    }

    await Promise.all(loadPromises);
    return textureSet;
  }

  // Texture application methods with actual PBR texture loading
  private async addWoodGrainTexture(material: THREE.MeshStandardMaterial, woodType: string): Promise<void> {
    try {
      const textureSet = await this.loadTextureSet(`wood-${woodType}`, 2);
      
      if (textureSet.map) {
        material.map = textureSet.map;
        material.needsUpdate = true;
      }
      
      if (textureSet.normalMap) {
        material.normalMap = textureSet.normalMap;
        material.normalScale = new THREE.Vector2(1, 1);
      }
      
      if (textureSet.roughnessMap) {
        material.roughnessMap = textureSet.roughnessMap;
      }
      
      if (textureSet.aoMap) {
        material.aoMap = textureSet.aoMap;
        material.aoMapIntensity = 1;
      }
    } catch (error) {
      console.error(`Failed to load wood textures for ${woodType}:`, error);
      // Fallback to procedural adjustment
      material.roughness = material.roughness * 0.9;
    }
  }

  private async addFabricTexture(material: THREE.MeshStandardMaterial, fabricType: string): Promise<void> {
    try {
      const textureSet = await this.loadTextureSet(`fabric-${fabricType}`, 4);
      
      if (textureSet.map) {
        material.map = textureSet.map;
        material.needsUpdate = true;
      }
      
      if (textureSet.normalMap) {
        material.normalMap = textureSet.normalMap;
        material.normalScale = new THREE.Vector2(0.5, 0.5);
      }
      
      if (textureSet.roughnessMap) {
        material.roughnessMap = textureSet.roughnessMap;
      }
    } catch (error) {
      console.error(`Failed to load fabric textures for ${fabricType}:`, error);
      // Fallback to procedural properties
      if (fabricType === 'wool') {
        material.roughness = 1.0;
      } else if (fabricType === 'silk') {
        material.roughness = 0.2;
      }
    }
  }

  private async addLeatherTexture(material: THREE.MeshStandardMaterial): Promise<void> {
    try {
      const textureSet = await this.loadTextureSet('leather', 2);
      
      if (textureSet.map) {
        material.map = textureSet.map;
        material.needsUpdate = true;
      }
      
      if (textureSet.normalMap) {
        material.normalMap = textureSet.normalMap;
        material.normalScale = new THREE.Vector2(2, 2);
      }
      
      if (textureSet.roughnessMap) {
        material.roughnessMap = textureSet.roughnessMap;
      }
    } catch (error) {
      console.error('Failed to load leather textures:', error);
      material.roughness = 0.9;
    }
  }

  private async addStoneTexture(material: THREE.MeshStandardMaterial): Promise<void> {
    try {
      const textureSet = await this.loadTextureSet('stone', 1);
      
      if (textureSet.map) {
        material.map = textureSet.map;
        material.needsUpdate = true;
      }
      
      if (textureSet.normalMap) {
        material.normalMap = textureSet.normalMap;
        material.normalScale = new THREE.Vector2(1, 1);
      }
      
      if (textureSet.roughnessMap) {
        material.roughnessMap = textureSet.roughnessMap;
      }
      
      if (textureSet.aoMap) {
        material.aoMap = textureSet.aoMap;
        material.aoMapIntensity = 1;
      }
      
      if (textureSet.displacementMap) {
        material.displacementMap = textureSet.displacementMap;
        material.displacementScale = 0.1;
      }
    } catch (error) {
      console.error('Failed to load stone textures:', error);
      material.roughness = 1.0;
    }
  }

  private async addMetalTexture(material: THREE.MeshStandardMaterial, metalType: string): Promise<void> {
    try {
      const textureSet = await this.loadTextureSet(`metal-${metalType}`, 1);
      
      // Metals typically don't have a color map to preserve their metallic appearance
      if (textureSet.map && metalType === 'brass') {
        // Brass can have a color map for patina effects
        material.map = textureSet.map;
        material.needsUpdate = true;
      }
      
      if (textureSet.normalMap) {
        material.normalMap = textureSet.normalMap;
        material.normalScale = new THREE.Vector2(0.5, 0.5);
      }
      
      if (textureSet.roughnessMap) {
        material.roughnessMap = textureSet.roughnessMap;
      }
      
      if (textureSet.metalnessMap) {
        material.metalnessMap = textureSet.metalnessMap;
      }
    } catch (error) {
      console.error(`Failed to load metal textures for ${metalType}:`, error);
      // Keep the procedural metalness/roughness values as fallback
    }
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

  getCachedTextureCount(): number {
    return this.textureCache.size;
  }

  clearMaterialCache(): void {
    this.materialCache.clear();
    this.initializeMaterials();
  }

  clearTextureCache(): void {
    // Dispose of all cached textures to free memory
    this.textureCache.forEach(texture => {
      texture.dispose();
    });
    this.textureCache.clear();
  }

  // Preload textures for specific material types
  async preloadTextures(materialTypes: MaterialType[]): Promise<void> {
    const preloadPromises: Promise<void>[] = [];
    
    for (const materialType of materialTypes) {
      preloadPromises.push(
        this.loadTextureSet(materialType).then(() => {
          console.log(`Preloaded textures for ${materialType}`);
        }).catch(error => {
          console.error(`Failed to preload textures for ${materialType}:`, error);
        })
      );
    }
    
    await Promise.all(preloadPromises);
  }

  // Get loading progress
  getLoadingProgress(): { loaded: number; total: number; progress: number } {
    const { loaded, total } = this.loadingState;
    const progress = total > 0 ? loaded / total : 0;
    
    return { loaded, total, progress };
  }

  // Create a high-quality PBR material with all texture features
  async createPBRMaterial(
    materialType: MaterialType, 
    parameters: ParametricParameters,
    options?: {
      enableDisplacement?: boolean;
      tiling?: number;
      normalIntensity?: number;
    }
  ): Promise<THREE.Material> {
    const baseColor = parameters.colorPalette[0] || this.getCulturalColors(parameters.culture)[0];
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(baseColor),
      name: `${materialType}-pbr`
    });

    try {
      const textureSet = await this.loadTextureSet(materialType, options?.tiling || 1);
      
      if (textureSet.map) {
        material.map = textureSet.map;
        material.needsUpdate = true;
      }
      
      if (textureSet.normalMap) {
        material.normalMap = textureSet.normalMap;
        material.normalScale = new THREE.Vector2(
          options?.normalIntensity || 1,
          options?.normalIntensity || 1
        );
      }
      
      if (textureSet.roughnessMap) {
        material.roughnessMap = textureSet.roughnessMap;
      }
      
      if (textureSet.metalnessMap) {
        material.metalnessMap = textureSet.metalnessMap;
      }
      
      if (textureSet.aoMap) {
        material.aoMap = textureSet.aoMap;
        material.aoMapIntensity = 1;
      }
      
      if (textureSet.displacementMap && options?.enableDisplacement) {
        material.displacementMap = textureSet.displacementMap;
        material.displacementScale = 0.1;
      }
      
      // Apply material-specific properties
      switch (materialType) {
        case 'wood-oak':
        case 'wood-pine':
        case 'wood-cherry':
        case 'wood-bamboo':
          material.roughness = this.getWoodRoughness(materialType.split('-')[1], parameters);
          material.metalness = 0.0;
          break;
        case 'metal-brass':
        case 'metal-steel':
        case 'metal-copper':
          material.roughness = this.getMetalRoughness(materialType.split('-')[1], parameters);
          material.metalness = this.getMetalness(materialType.split('-')[1], parameters);
          break;
        case 'fabric-cotton':
        case 'fabric-linen':
        case 'fabric-silk':
        case 'fabric-wool':
          material.roughness = this.getFabricRoughness(materialType.split('-')[1], parameters);
          material.metalness = 0.0;
          break;
        case 'leather':
          material.roughness = 0.8;
          material.metalness = 0.0;
          break;
        case 'ceramic':
          material.roughness = 0.1;
          material.metalness = 0.0;
          break;
        case 'stone':
          material.roughness = 0.9;
          material.metalness = 0.0;
          break;
      }
      
      // Apply cultural finishing
      this.applyCulturalFinishing(material, parameters);
      
    } catch (error) {
      console.error(`Failed to create PBR material for ${materialType}:`, error);
      // Fallback to basic material
      return this.createMaterial(materialType, parameters);
    }
    
    return material;
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