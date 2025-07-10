import * as THREE from 'three';
import { CulturalKnowledgeBase } from '../cultural/CulturalKnowledgeBase';
import { AIParameterAnalyzer } from '../ai-integration/AIParameterAnalyzer';
import { ParametricMaterialSystem } from '../materials/ParametricMaterialSystem';
import { ChairTemplate } from '../templates/seating/ChairTemplate';
import { TableTemplate } from '../templates/tables/TableTemplate';
export class ParametricGenerationEngine {
    constructor() {
        this.templates = new Map();
        this.culturalDB = new CulturalKnowledgeBase();
        this.aiAnalyzer = new AIParameterAnalyzer();
        this.materialSystem = new ParametricMaterialSystem();
        this.cache = new Map();
        this.performanceMetrics = new Map();
        this.initializeTemplates();
    }
    async generateFurnitureFromUserInput(userInput) {
        console.log('🤖 Starting AI analysis of user requirements...');
        try {
            // Step 1: AI analyzes user requirements and generates optimal parameters
            const aiParameters = await this.aiAnalyzer.analyzeUserRequirements(userInput);
            console.log('📊 AI analysis complete. Generating furniture pieces...');
            const results = [];
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
        }
        catch (error) {
            console.error('❌ AI analysis failed, using fallback generation:', error);
            return this.generateFallbackFurniture(userInput);
        }
    }
    async generateSinglePiece(parameters) {
        // Check cache first
        const cacheKey = this.generateCacheKey(parameters);
        if (this.cache.has(cacheKey)) {
            console.log('💾 Using cached result');
            return this.cache.get(cacheKey);
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
            const result = {
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
        }
        catch (error) {
            console.error('❌ Generation failed:', error);
            throw error;
        }
    }
    async optimizeParametersInRealTime(currentParameters, userAdjustments) {
        // Merge user adjustments with current parameters
        const adjustedParameters = { ...currentParameters, ...userAdjustments };
        // AI validates and optimizes the adjusted parameters
        const optimizationConstraints = {
            spaceLimitations: this.calculateSpaceLimitations(adjustedParameters),
            budgetConstraints: this.calculateBudgetConstraints(adjustedParameters),
            accessibilityNeeds: this.calculateAccessibilityNeeds(adjustedParameters),
            culturalRequirements: this.calculateCulturalRequirements(adjustedParameters)
        };
        try {
            return await this.aiAnalyzer.optimizeParameters(adjustedParameters, optimizationConstraints);
        }
        catch (error) {
            console.warn('AI optimization failed, using rule-based optimization:', error);
            return this.ruleBasedOptimization(adjustedParameters, optimizationConstraints);
        }
    }
    // Real-time parameter adjustment for UI sliders
    adjustParametersRealTime(baseParameters, adjustments) {
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
                    adjusted[key] = value;
            }
        });
        return adjusted;
    }
    // Helper methods
    initializeTemplates() {
        this.templates.set('chair', new ChairTemplate());
        this.templates.set('dining-table', new TableTemplate());
        this.templates.set('coffee-table', new TableTemplate());
        this.templates.set('side-table', new TableTemplate());
        // Add more templates as they're implemented
    }
    generateCacheKey(parameters) {
        return JSON.stringify(parameters);
    }
    async validateCulturalParameters(parameters) {
        // Create a mock result for validation
        const mockResult = {
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
    async adjustForCulturalAuthenticity(parameters, validation) {
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
            }
            else if (parameters.type.includes('table')) {
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
    applyMaterialsToGeometry(geometry, materials, parameters) {
        let materialIndex = 0;
        geometry.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const component = child.userData.component;
                // Apply appropriate material based on component type
                if (component === 'seat' || component === 'backrest' || component === 'top') {
                    child.material = materials[0]; // Primary material
                }
                else if (component === 'leg' || component === 'frame') {
                    child.material = materials[Math.min(materialIndex, materials.length - 1)];
                }
                else if (component === 'cultural-accent' || component === 'ornate-detail') {
                    child.material = materials[materials.length - 1] || materials[0];
                }
                else {
                    child.material = materials[materialIndex % materials.length];
                }
                materialIndex++;
            }
        });
    }
    generateFurnitureMetadata(parameters) {
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
    calculatePerformanceMetrics(geometry, generationTime) {
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
    estimateGeometryMemoryUsage(geometry) {
        let usage = 0;
        Object.values(geometry.attributes).forEach(attribute => {
            usage += attribute.array.byteLength;
        });
        return usage;
    }
    recordPerformanceMetrics(furnitureType, culture, metrics) {
        const key = `${furnitureType}-${culture}`;
        if (!this.performanceMetrics.has(key)) {
            this.performanceMetrics.set(key, []);
        }
        this.performanceMetrics.get(key).push(metrics);
        // Keep only last 100 measurements
        const measurements = this.performanceMetrics.get(key);
        if (measurements.length > 100) {
            measurements.shift();
        }
    }
    // Constraint calculation methods
    calculateSpaceLimitations(parameters) {
        const volume = parameters.width * parameters.height * parameters.depth;
        return `Furniture volume: ${volume.toFixed(2)} cubic meters`;
    }
    calculateBudgetConstraints(parameters) {
        const template = this.templates.get(parameters.type);
        if (template) {
            const metadata = template.generateMetadata(parameters);
            return `Estimated cost: $${metadata.estimatedCost}`;
        }
        return 'Budget constraints not calculated';
    }
    calculateAccessibilityNeeds(parameters) {
        return `Ergonomic profile: ${parameters.ergonomicProfile}`;
    }
    calculateCulturalRequirements(parameters) {
        const culturalProfile = this.culturalDB.getCulturalProfile(parameters.culture);
        return culturalProfile ? `Cultural style: ${culturalProfile.name}` : 'No cultural requirements';
    }
    // Parameter constraint methods
    constrainHeight(value, culture, type) {
        const culturalProps = this.culturalDB.getCulturalProportions(culture, type);
        if (type === 'chair') {
            return Math.max(0.3, Math.min(1.2, value));
        }
        else if (type.includes('table')) {
            return Math.max(0.3, Math.min(1.0, value));
        }
        return Math.max(0.3, Math.min(2.0, value));
    }
    constrainWidth(value, culture, type) {
        if (type === 'chair') {
            return Math.max(0.3, Math.min(1.0, value));
        }
        else if (type.includes('table')) {
            return Math.max(0.5, Math.min(3.0, value));
        }
        return Math.max(0.3, Math.min(3.0, value));
    }
    constrainDepth(value, culture, type) {
        if (type === 'chair') {
            return Math.max(0.3, Math.min(1.0, value));
        }
        else if (type.includes('table')) {
            return Math.max(0.5, Math.min(2.0, value));
        }
        return Math.max(0.3, Math.min(2.0, value));
    }
    calculateDecorativeIntensity(formality, culture) {
        const baseIntensity = {
            'casual': 0.3,
            'semi-formal': 0.5,
            'formal': 0.7,
            'ceremonial': 0.9
        };
        const culturalMultiplier = {
            'japanese': 0.8,
            'scandinavian': 0.6,
            'italian': 1.2,
            'french': 1.0,
            'modern': 0.4
        };
        return Math.min(1.0, (baseIntensity[formality] || 0.5) * (culturalMultiplier[culture] || 1.0));
    }
    // Fallback methods
    async generateFallbackFurniture(userInput) {
        console.log('🔄 Generating fallback furniture...');
        const culturalProfile = this.culturalDB.getCulturalProfile(userInput.culture);
        const basicParameters = {
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
        const results = [];
        const chairCount = Math.min(userInput.guestCount, 8);
        for (let i = 0; i < chairCount; i++) {
            const result = await this.generateSinglePiece(basicParameters);
            results.push(result);
        }
        return results;
    }
    adjustInvalidParameters(parameters) {
        const adjusted = { ...parameters };
        // Adjust dimensions to valid ranges
        adjusted.width = this.constrainWidth(adjusted.width, adjusted.culture, adjusted.type);
        adjusted.height = this.constrainHeight(adjusted.height, adjusted.culture, adjusted.type);
        adjusted.depth = this.constrainDepth(adjusted.depth, adjusted.culture, adjusted.type);
        // Ensure decorative intensity is in valid range
        adjusted.decorativeIntensity = Math.max(0, Math.min(1, adjusted.decorativeIntensity));
        return adjusted;
    }
    ruleBasedOptimization(parameters, constraints) {
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
    getCacheSize() {
        return this.cache.size;
    }
    clearCache() {
        this.cache.clear();
    }
    getPerformanceReport() {
        const report = {};
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
    getSupportedFurnitureTypes() {
        return Array.from(this.templates.keys());
    }
    getSupportedCultures() {
        return ['japanese', 'scandinavian', 'italian', 'french', 'modern'];
    }
}
//# sourceMappingURL=ParametricGenerationEngine.js.map