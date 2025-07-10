// Enhanced Playground Template - Integrating your template with AI Parametric System
import * as THREE from 'three';
import { CulturalKnowledgeBase } from '../../cultural/CulturalKnowledgeBase';
export class EnhancedPlaygroundTemplate {
    constructor() {
        this.safetyStandards = new Map();
        this.ageGroupConstraints = new Map();
        this.equipmentSpecs = new Map();
        this.materialProperties = new Map();
        this.culturalDB = new CulturalKnowledgeBase();
        this.initializeSafetyStandards();
        this.initializeAgeConstraints();
        this.initializeEquipmentSpecs();
        this.initializeMaterialProperties();
    }
    // Main generation function compatible with ParametricTemplate interface
    generateGeometry(parameters) {
        // Convert ParametricParameters to PlaygroundParameters
        const playgroundParams = this.convertToPlaygroundParameters(parameters);
        return this.generatePlayground(playgroundParams);
    }
    // Your original generation function enhanced with AI integration
    generatePlayground(parameters) {
        console.log(`🎪 Generating ${parameters.culture || 'universal'} ${parameters.themeStyle} playground for age ${parameters.targetAgeGroup}...`);
        // Step 1: Validate safety requirements with AI cultural awareness
        const safetyValidation = this.validateSafetyRequirements(parameters);
        if (!safetyValidation.passed) {
            throw new Error(`Safety validation failed: ${safetyValidation.issues.join(', ')}`);
        }
        // Step 2: Apply cultural intelligence to playground design
        const culturallyEnhancedParams = this.enhanceWithCulturalIntelligence(parameters);
        // Step 3: Calculate optimal layout with cultural play patterns
        const layout = this.calculateOptimalLayout(culturallyEnhancedParams);
        // Step 4: Generate playground structure with cultural elements
        const playground = new THREE.Group();
        const mainStructure = this.generateMainStructure(culturallyEnhancedParams, layout);
        const equipment = this.generatePlayEquipment(culturallyEnhancedParams, layout);
        const safetyFeatures = this.generateSafetyFeatures(culturallyEnhancedParams, layout);
        const pathways = this.generatePathways(culturallyEnhancedParams, layout);
        // Step 5: Add themed elements with cultural authenticity
        const themedElements = this.addThemedElements(culturallyEnhancedParams, layout);
        // Step 6: Add cultural playground features
        const culturalFeatures = this.addCulturalPlayFeatures(culturallyEnhancedParams, layout);
        // Step 7: Add accessibility features
        if (parameters.accessibilityRequired) {
            const accessibilityFeatures = this.generateAccessibilityFeatures(culturallyEnhancedParams, layout);
            playground.add(...accessibilityFeatures);
        }
        // Step 8: Assemble playground
        playground.add(mainStructure, ...equipment, ...safetyFeatures, ...pathways, ...themedElements, ...culturalFeatures);
        // Step 9: Apply materials with cultural appropriateness
        this.applyPlaygroundMaterials(playground, culturallyEnhancedParams);
        // Step 10: Add enhanced metadata for cultural compliance
        playground.userData = {
            type: 'playground',
            ageGroup: parameters.targetAgeGroup,
            capacity: parameters.maxCapacity,
            safetyStandard: parameters.safetyStandard,
            culture: parameters.culture || 'universal',
            culturalAuthenticity: this.validateCulturalPlayAuthenticity(culturallyEnhancedParams),
            safetyCompliant: true,
            accessibilityCompliant: parameters.accessibilityRequired,
            layout: layout,
            generatedAt: Date.now()
        };
        console.log(`✨ Safe ${parameters.culture || 'universal'} ${parameters.themeStyle} playground generated successfully!`);
        return playground;
    }
    // Convert AI ParametricParameters to PlaygroundParameters
    convertToPlaygroundParameters(parameters) {
        return {
            // Map AI parameters to playground-specific parameters
            targetAgeGroup: this.mapAgeGroup(parameters.ergonomicProfile),
            maxCapacity: parameters.capacity || 15,
            safetyStandard: 'ASTM', // Default safety standard
            equipmentTypes: this.mapEquipmentTypes(parameters.type, parameters.culturalElements),
            themeStyle: this.mapThemeStyle(parameters.style, parameters.culture),
            availableSpace: {
                width: parameters.width * 3, // Scale up for playground space
                depth: parameters.depth * 3,
                height: parameters.height
            },
            primaryMaterial: this.mapPlaygroundMaterial(parameters.primaryMaterial),
            colorScheme: this.mapColorScheme(parameters.colorPalette),
            colorPalette: parameters.colorPalette,
            accessibilityRequired: parameters.ergonomicProfile === 'accessible',
            inclusiveDesign: true,
            indoorOutdoor: 'outdoor',
            weatherResistance: true,
            culture: parameters.culture,
            culturalElements: parameters.culturalElements,
            // Enhanced AI cultural features
            culturalPlayPatterns: this.generateCulturalPlayPatterns(parameters.culture, parameters.culturalElements)
            // Note: Not spreading parameters to avoid type conflicts
        };
    }
    mapAgeGroup(ergonomicProfile) {
        switch (ergonomicProfile) {
            case 'petite': return '2-5';
            case 'average': return '5-12';
            case 'tall': return '12+';
            default: return 'mixed';
        }
    }
    mapEquipmentTypes(furnitureType, culturalElements) {
        const baseEquipment = ['slide', 'swing', 'climbing-wall'];
        // Add cultural-specific equipment
        if (culturalElements.includes('zen-garden')) {
            baseEquipment.push('sandbox');
        }
        if (culturalElements.includes('social-gathering')) {
            baseEquipment.push('playhouse');
        }
        if (culturalElements.includes('balance-training')) {
            baseEquipment.push('balance-beam');
        }
        return baseEquipment;
    }
    mapThemeStyle(style, culture) {
        if (culture === 'japanese')
            return 'natural';
        if (culture === 'scandinavian')
            return 'natural';
        if (culture === 'french')
            return 'castle';
        if (culture === 'italian')
            return 'castle';
        if (culture === 'modern')
            return 'modern';
        switch (style) {
            case 'rustic': return 'natural';
            case 'elegant': return 'castle';
            case 'minimalist': return 'modern';
            default: return 'cultural';
        }
    }
    mapPlaygroundMaterial(material) {
        if (material.includes('wood-oak'))
            return 'wood-oak';
        if (material.includes('wood-pine'))
            return 'wood-pine';
        if (material.includes('wood'))
            return 'wood-oak';
        if (material.includes('metal'))
            return 'metal-steel';
        return 'composite';
    }
    mapColorScheme(colorPalette) {
        if (colorPalette.some(color => color.includes('#F') || color.includes('#E')))
            return 'pastel';
        if (colorPalette.some(color => color.includes('#8') || color.includes('#D')))
            return 'natural';
        return 'themed';
    }
    generateCulturalPlayPatterns(culture, culturalElements) {
        const profile = this.culturalDB.getCulturalProfile(culture);
        if (!profile)
            return {};
        const patterns = {};
        switch (culture) {
            case 'japanese':
                patterns.socialInteraction = 'group';
                patterns.learningStyle = 'contemplative';
                patterns.movementCulture = 'balanced';
                patterns.seasonalPlay = true;
                break;
            case 'scandinavian':
                patterns.socialInteraction = 'mixed';
                patterns.learningStyle = 'exploration';
                patterns.movementCulture = 'dynamic';
                patterns.seasonalPlay = true;
                break;
            case 'french':
                patterns.socialInteraction = 'group';
                patterns.learningStyle = 'structured';
                patterns.movementCulture = 'contemplative';
                patterns.seasonalPlay = false;
                break;
            case 'italian':
                patterns.socialInteraction = 'group';
                patterns.learningStyle = 'creative';
                patterns.movementCulture = 'dynamic';
                patterns.seasonalPlay = false;
                break;
            default:
                patterns.socialInteraction = 'mixed';
                patterns.learningStyle = 'exploration';
                patterns.movementCulture = 'balanced';
                patterns.seasonalPlay = false;
        }
        return patterns;
    }
    enhanceWithCulturalIntelligence(parameters) {
        if (!parameters.culture)
            return parameters;
        const culturalProfile = this.culturalDB.getCulturalProfile(parameters.culture);
        if (!culturalProfile)
            return parameters;
        const enhanced = { ...parameters };
        // Apply cultural color palette if not specified
        if (!enhanced.colorPalette || enhanced.colorPalette.length === 0) {
            enhanced.colorPalette = culturalProfile.aesthetics.colorPalette;
            enhanced.colorScheme = 'themed';
        }
        // Add cultural elements based on profile
        if (!enhanced.culturalElements || enhanced.culturalElements.length === 0) {
            enhanced.culturalElements = culturalProfile.aesthetics.decorativeElements.slice(0, 3);
        }
        // Apply cultural ergonomics to playground design
        if (culturalProfile.ergonomics.floorSeating) {
            enhanced.culturalElements.push('ground-level-play');
        }
        if (culturalProfile.ergonomics.groupOrientation === 'circular') {
            enhanced.culturalElements.push('circular-arrangement');
        }
        return enhanced;
    }
    validateCulturalPlayAuthenticity(parameters) {
        if (!parameters.culture)
            return { overall: 100, cultural: 100 };
        const culturalProfile = this.culturalDB.getCulturalProfile(parameters.culture);
        if (!culturalProfile)
            return { overall: 100, cultural: 100 };
        let culturalScore = 100;
        // Check material appropriateness
        if (parameters.primaryMaterial === 'plastic' && parameters.culture === 'japanese') {
            culturalScore -= 20; // Prefer natural materials
        }
        // Check color appropriateness
        const colorMatch = parameters.colorPalette.some(color => culturalProfile.aesthetics.colorPalette.includes(color));
        if (!colorMatch)
            culturalScore -= 15;
        // Check cultural elements integration
        if (parameters.culturalElements && parameters.culturalElements.length > 0) {
            const elementMatch = parameters.culturalElements.some(element => culturalProfile.aesthetics.decorativeElements.includes(element));
            if (elementMatch)
                culturalScore += 10;
        }
        return {
            overall: culturalScore,
            cultural: culturalScore,
            materials: culturalScore,
            colors: colorMatch ? 100 : 80,
            elements: parameters.culturalElements?.length || 0 > 0 ? 100 : 70
        };
    }
    addCulturalPlayFeatures(parameters, layout) {
        const culturalFeatures = [];
        if (!parameters.culture)
            return culturalFeatures;
        switch (parameters.culture) {
            case 'japanese':
                culturalFeatures.push(...this.createJapanesePlayFeatures(parameters, layout));
                break;
            case 'scandinavian':
                culturalFeatures.push(...this.createScandinavianPlayFeatures(parameters, layout));
                break;
            case 'french':
                culturalFeatures.push(...this.createFrenchPlayFeatures(parameters, layout));
                break;
            case 'italian':
                culturalFeatures.push(...this.createItalianPlayFeatures(parameters, layout));
                break;
        }
        return culturalFeatures;
    }
    createJapanesePlayFeatures(parameters, layout) {
        const features = [];
        // Create zen garden play area
        const zenGardenGeometry = new THREE.CircleGeometry(2, 32);
        const zenGarden = new THREE.Mesh(zenGardenGeometry);
        zenGarden.rotation.x = -Math.PI / 2;
        zenGarden.position.set(3, 0.02, 3);
        zenGarden.userData = {
            component: 'zen-garden',
            culturalSignificance: 'promotes mindfulness and nature connection',
            interactionType: 'contemplative-play'
        };
        features.push(zenGarden);
        // Create natural stepping stones
        for (let i = 0; i < 5; i++) {
            const stoneGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 8);
            const stone = new THREE.Mesh(stoneGeometry);
            stone.position.set(i * 0.8 - 2, 0.05, 0);
            stone.userData = {
                component: 'stepping-stone',
                culturalElement: 'natural-path'
            };
            features.push(stone);
        }
        return features;
    }
    createScandinavianPlayFeatures(parameters, layout) {
        const features = [];
        // Create cozy reading nook
        const nookGeometry = new THREE.BoxGeometry(2, 1.5, 2);
        const nook = new THREE.Mesh(nookGeometry);
        nook.position.set(-3, 0.75, -3);
        nook.userData = {
            component: 'reading-nook',
            culturalSignificance: 'promotes hygge and learning',
            interactionType: 'quiet-play'
        };
        features.push(nook);
        // Create natural log balance beams
        const logGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 8);
        const log = new THREE.Mesh(logGeometry);
        log.rotation.z = Math.PI / 2;
        log.position.set(0, 0.2, -2);
        log.userData = {
            component: 'log-balance',
            culturalElement: 'natural-play'
        };
        features.push(log);
        return features;
    }
    createFrenchPlayFeatures(parameters, layout) {
        const features = [];
        // Create elegant garden play area with French savoir-vivre
        const gardenGeometry = new THREE.BoxGeometry(3, 0.3, 3);
        const garden = new THREE.Mesh(gardenGeometry);
        garden.position.set(2, 0.15, 2);
        garden.userData = {
            component: 'french-garden',
            culturalSignificance: 'promotes appreciation of beauty and structured play',
            interactionType: 'educational-play',
            savoirVivre: 'encourages proper social interaction and aesthetic appreciation'
        };
        features.push(garden);
        // Create conversation circle for social development
        const circleGeometry = new THREE.CircleGeometry(2, 32);
        const circle = new THREE.Mesh(circleGeometry);
        circle.rotation.x = -Math.PI / 2;
        circle.position.set(-2, 0.02, 2);
        circle.userData = {
            component: 'conversation-circle',
            culturalElement: 'social-gathering',
            savoirVivre: 'promotes elegant conversation and social skills'
        };
        features.push(circle);
        return features;
    }
    createItalianPlayFeatures(parameters, layout) {
        const features = [];
        // Create artistic expression area
        const artAreaGeometry = new THREE.BoxGeometry(2.5, 0.1, 2.5);
        const artArea = new THREE.Mesh(artAreaGeometry);
        artArea.position.set(0, 0.05, 3);
        artArea.userData = {
            component: 'art-area',
            culturalSignificance: 'promotes creativity and artistic expression',
            interactionType: 'creative-play'
        };
        features.push(artArea);
        // Create amphitheater-style seating for storytelling
        const amphitheaterGeometry = new THREE.CylinderGeometry(2, 2.5, 0.3, 16);
        const amphitheater = new THREE.Mesh(amphitheaterGeometry);
        amphitheater.position.set(-2, 0.15, -2);
        amphitheater.userData = {
            component: 'amphitheater',
            culturalElement: 'storytelling-space'
        };
        features.push(amphitheater);
        return features;
    }
    // Your original methods preserved and enhanced
    initializeSafetyStandards() {
        this.safetyStandards = new Map();
        // ASTM F1487 (US Standard)
        this.safetyStandards.set('ASTM', {
            maxHeight: 2.44, // 8 feet maximum for school age
            fallZoneRadius: 1.83, // 6 feet minimum
            minimumSpacing: 2.44, // 8 feet between structures
            surfaceMaterial: 'impact-absorbing',
            requiredBarriers: true,
            entrapmentPrevention: {
                minOpening: 0.089, // 3.5 inches
                maxOpening: 0.229 // 9 inches
            },
            accessibilityFeatures: ['ada-compliant-routes', 'transfer-platforms']
        });
        // EN 1176 (European Standard)
        this.safetyStandards.set('EN1176', {
            maxHeight: 3.0, // 3 meters maximum
            fallZoneRadius: 2.0, // 2 meters minimum
            minimumSpacing: 2.5, // 2.5 meters between structures
            surfaceMaterial: 'certified-impact-surface',
            requiredBarriers: true,
            entrapmentPrevention: {
                minOpening: 0.089,
                maxOpening: 0.230
            },
            accessibilityFeatures: ['wheelchair-accessible', 'inclusive-play-elements']
        });
    }
    initializeAgeConstraints() {
        this.ageGroupConstraints = new Map();
        // Ages 2-5 (Toddler/Preschool)
        this.ageGroupConstraints.set('2-5', {
            maxHeight: 1.22, // 4 feet maximum
            fallZoneRadius: 1.83, // 6 feet minimum
            minimumSpacing: 1.83, // 6 feet between equipment
            surfaceMaterial: 'soft-impact-surface',
            requiredBarriers: true,
            entrapmentPrevention: {
                minOpening: 0.089, // No head entrapment
                maxOpening: 0.229
            },
            accessibilityFeatures: ['low-transfer-height', 'wide-platforms']
        });
        // Ages 5-12 (School Age)
        this.ageGroupConstraints.set('5-12', {
            maxHeight: 2.44, // 8 feet maximum
            fallZoneRadius: 1.83, // 6 feet minimum
            minimumSpacing: 2.44, // 8 feet between equipment
            surfaceMaterial: 'impact-absorbing-surface',
            requiredBarriers: false, // Optional for this age
            entrapmentPrevention: {
                minOpening: 0.089,
                maxOpening: 0.229
            },
            accessibilityFeatures: ['accessible-routes', 'inclusive-elements']
        });
        // Ages 12+ (Teen)
        this.ageGroupConstraints.set('12+', {
            maxHeight: 3.66, // 12 feet maximum
            fallZoneRadius: 1.83, // 6 feet minimum
            minimumSpacing: 2.44, // 8 feet between equipment
            surfaceMaterial: 'standard-impact-surface',
            requiredBarriers: false,
            entrapmentPrevention: {
                minOpening: 0.089,
                maxOpening: 0.229
            },
            accessibilityFeatures: ['accessible-challenges', 'adaptive-equipment']
        });
    }
    initializeEquipmentSpecs() {
        this.equipmentSpecs = new Map();
        this.equipmentSpecs.set('slide', {
            minLength: 1.22, // 4 feet
            maxLength: 3.66, // 12 feet
            maxAngle: 30, // degrees
            sideHeight: 0.10, // 4 inches minimum
            exitZone: 0.43, // 17 inches minimum
            requiredPlatform: true,
            ageVariations: {
                '2-5': { maxHeight: 1.22, maxAngle: 24 },
                '5-12': { maxHeight: 2.44, maxAngle: 30 },
                '12+': { maxHeight: 3.66, maxAngle: 30 }
            }
        });
        this.equipmentSpecs.set('swing', {
            seatHeight: 0.61, // 24 inches standard
            chainLength: 2.44, // 8 feet standard
            fallZone: 1.83, // 6 feet each direction
            seatSpacing: 0.61, // 24 inches minimum
            frameHeight: 2.44, // 8 feet standard
            ageVariations: {
                '2-5': { seatHeight: 0.36, frameHeight: 1.83 },
                '5-12': { seatHeight: 0.61, frameHeight: 2.44 },
                '12+': { seatHeight: 0.61, frameHeight: 2.44 }
            }
        });
        this.equipmentSpecs.set('climbing-wall', {
            maxHeight: 2.44, // 8 feet
            maxAngle: 90, // degrees from horizontal
            handHoldSpacing: 0.30, // 12 inches maximum
            fallZone: 1.83, // 6 feet minimum
            requiredMats: true,
            ageVariations: {
                '2-5': { maxHeight: 1.22, maxAngle: 45 },
                '5-12': { maxHeight: 2.44, maxAngle: 75 },
                '12+': { maxHeight: 3.66, maxAngle: 90 }
            }
        });
        this.equipmentSpecs.set('playhouse', {
            minCeiling: 1.83, // 6 feet minimum
            maxCeiling: 2.44, // 8 feet maximum
            doorWidth: 0.81, // 32 inches minimum
            windowHeight: 0.61, // 24 inches from floor
            fallZone: 1.22, // 4 feet around structure
            ageVariations: {
                '2-5': { ceilingHeight: 1.83, doorWidth: 0.71 },
                '5-12': { ceilingHeight: 2.13, doorWidth: 0.81 },
                '12+': { ceilingHeight: 2.44, doorWidth: 0.91 }
            }
        });
    }
    initializeMaterialProperties() {
        this.materialProperties = new Map([
            ['plastic', {
                    safety: 'high',
                    durability: 'high',
                    weather: 'excellent',
                    maintenance: 'low',
                    cost: 'medium',
                    colors: 'unlimited',
                    sustainability: 'medium'
                }],
            ['wood', {
                    safety: 'high',
                    durability: 'medium',
                    weather: 'treated-good',
                    maintenance: 'medium',
                    cost: 'high',
                    colors: 'natural-stains',
                    sustainability: 'high'
                }],
            ['metal', {
                    safety: 'high',
                    durability: 'excellent',
                    weather: 'powder-coated',
                    maintenance: 'low',
                    cost: 'high',
                    colors: 'powder-coat-options',
                    sustainability: 'high'
                }],
            ['composite', {
                    safety: 'high',
                    durability: 'excellent',
                    weather: 'excellent',
                    maintenance: 'very-low',
                    cost: 'very-high',
                    colors: 'molded-in',
                    sustainability: 'medium'
                }]
        ]);
    }
    validateSafetyRequirements(params) {
        const issues = [];
        const ageConstraints = this.ageGroupConstraints.get(params.targetAgeGroup);
        const safetyStandard = this.safetyStandards.get(params.safetyStandard);
        if (!ageConstraints || !safetyStandard) {
            issues.push('Invalid age group or safety standard specified');
            return { passed: false, issues };
        }
        // Check space requirements
        const minSpaceRequired = this.calculateMinimumSpace(params);
        if (params.availableSpace.width < minSpaceRequired.width ||
            params.availableSpace.depth < minSpaceRequired.depth) {
            issues.push(`Insufficient space: need ${minSpaceRequired.width}m x ${minSpaceRequired.depth}m minimum`);
        }
        // Check equipment compatibility
        for (const equipment of params.equipmentTypes) {
            const equipSpec = this.equipmentSpecs.get(equipment);
            if (equipSpec && equipSpec.ageVariations[params.targetAgeGroup]) {
                const ageSpec = equipSpec.ageVariations[params.targetAgeGroup];
                if (ageSpec.maxHeight > ageConstraints.maxHeight) {
                    issues.push(`${equipment} height exceeds safe limit for age ${params.targetAgeGroup}`);
                }
            }
        }
        // Check material safety
        if (params.primaryMaterial.includes('metal') && params.targetAgeGroup === '2-5' && params.indoorOutdoor === 'outdoor') {
            issues.push('Metal equipment not recommended for toddlers in outdoor environments (heating risk)');
        }
        return { passed: issues.length === 0, issues };
    }
    calculateMinimumSpace(params) {
        const ageConstraints = this.ageGroupConstraints.get(params.targetAgeGroup);
        const baseSpacePerChild = 5; // 5 square meters per child
        const totalArea = params.maxCapacity * baseSpacePerChild;
        // Add fall zones and safety spacing
        const fallZoneArea = params.equipmentTypes.length * (ageConstraints.fallZoneRadius * 2) ** 2;
        const requiredArea = totalArea + fallZoneArea;
        // Calculate dimensions (roughly square with some flexibility)
        const dimension = Math.sqrt(requiredArea);
        return {
            width: Math.ceil(dimension * 1.2), // Add 20% buffer for pathways
            depth: Math.ceil(dimension * 0.9)
        };
    }
    calculateOptimalLayout(params) {
        const layout = {
            zones: [],
            pathways: [],
            safetyBarriers: [],
            fallZones: [],
            accessPoints: []
        };
        const ageConstraints = this.ageGroupConstraints.get(params.targetAgeGroup);
        const availableWidth = params.availableSpace.width;
        const availableDepth = params.availableSpace.depth;
        // Position equipment with proper spacing and cultural considerations
        let currentX = -availableWidth / 2 + 2; // Start with 2m border
        let currentZ = -availableDepth / 2 + 2;
        // Apply cultural layout patterns
        const culturalLayout = this.applyCulturalLayout(params, availableWidth, availableDepth);
        params.equipmentTypes.forEach((equipmentType, index) => {
            const equipSpec = this.equipmentSpecs.get(equipmentType);
            if (!equipSpec)
                return;
            const ageSpec = equipSpec.ageVariations[params.targetAgeGroup];
            if (!ageSpec)
                return;
            // Calculate position with cultural considerations
            const position = culturalLayout.positions[index] || new THREE.Vector3(currentX, 0, currentZ);
            // Create play zone
            const zone = {
                equipment: equipmentType,
                position: position,
                rotation: culturalLayout.rotations[index] || 0,
                safetyZone: new THREE.Box3(new THREE.Vector3(position.x - ageConstraints.fallZoneRadius, 0, position.z - ageConstraints.fallZoneRadius), new THREE.Vector3(position.x + ageConstraints.fallZoneRadius, ageSpec.maxHeight || ageConstraints.maxHeight, position.z + ageConstraints.fallZoneRadius)),
                ageGroup: params.targetAgeGroup,
                capacity: Math.ceil(params.maxCapacity / params.equipmentTypes.length)
            };
            layout.zones.push(zone);
            // Update position for next equipment
            currentX += ageConstraints.minimumSpacing;
            if (currentX > availableWidth / 2 - 2) {
                currentX = -availableWidth / 2 + 2;
                currentZ += ageConstraints.minimumSpacing;
            }
        });
        // Generate pathways
        layout.pathways = this.generatePathwayLayout(layout.zones, params);
        // Generate safety barriers if required
        if (ageConstraints.requiredBarriers) {
            layout.safetyBarriers = this.generateBarrierLayout(layout.zones, params);
        }
        // Generate accessibility features
        if (params.accessibilityRequired) {
            layout.accessPoints = this.generateAccessibilityLayout(layout.zones, params);
        }
        return layout;
    }
    applyCulturalLayout(params, width, depth) {
        const positions = [];
        const rotations = [];
        if (!params.culture) {
            return { positions, rotations };
        }
        const culturalProfile = this.culturalDB.getCulturalProfile(params.culture);
        if (!culturalProfile) {
            return { positions, rotations };
        }
        // Apply cultural group orientation
        switch (culturalProfile.ergonomics.groupOrientation) {
            case 'circular':
                // Arrange equipment in a circle
                const radius = Math.min(width, depth) / 4;
                const center = new THREE.Vector3(0, 0, 0);
                params.equipmentTypes.forEach((_, index) => {
                    const angle = (index / params.equipmentTypes.length) * Math.PI * 2;
                    positions.push(new THREE.Vector3(center.x + Math.cos(angle) * radius, 0, center.z + Math.sin(angle) * radius));
                    rotations.push(angle + Math.PI / 2); // Face center
                });
                break;
            case 'linear':
                // Arrange equipment in a line
                const spacing = width / (params.equipmentTypes.length + 1);
                params.equipmentTypes.forEach((_, index) => {
                    positions.push(new THREE.Vector3(-width / 2 + spacing * (index + 1), 0, 0));
                    rotations.push(0);
                });
                break;
            case 'conversational':
                // Arrange equipment to encourage interaction
                const conversationRadius = culturalProfile.ergonomics.personalSpace;
                params.equipmentTypes.forEach((_, index) => {
                    const angle = (index / params.equipmentTypes.length) * Math.PI * 2;
                    positions.push(new THREE.Vector3(Math.cos(angle) * conversationRadius * 2, 0, Math.sin(angle) * conversationRadius * 2));
                    rotations.push(angle + Math.PI); // Face each other
                });
                break;
        }
        return { positions, rotations };
    }
    // Continue with all your original methods...
    generateMainStructure(params, layout) {
        const mainStructure = new THREE.Group();
        // Generate base platform if needed
        if (params.equipmentTypes.includes('slide') || params.equipmentTypes.includes('climbing-wall')) {
            const platform = this.generateMainPlatform(params, layout);
            mainStructure.add(platform);
        }
        mainStructure.userData.component = 'main-structure';
        return mainStructure;
    }
    generateMainPlatform(params, layout) {
        const ageConstraints = this.ageGroupConstraints.get(params.targetAgeGroup);
        // Calculate platform size based on equipment needs
        const platformWidth = 2.44; // 8 feet standard
        const platformDepth = 2.44; // 8 feet standard
        const platformHeight = ageConstraints.maxHeight * 0.6; // Platform at 60% of max height
        const platformThickness = 0.05; // 2 inches thick
        // Create platform with safety features
        const platformGeometry = this.createSafePlatformGeometry(platformWidth, platformDepth, platformThickness, params.targetAgeGroup);
        const platform = new THREE.Mesh(platformGeometry);
        platform.position.y = platformHeight;
        platform.castShadow = true;
        platform.receiveShadow = true;
        platform.userData.component = 'platform';
        platform.userData.safetyFeatures = ['guardrails', 'anti-slip-surface', 'rounded-edges'];
        return platform;
    }
    createSafePlatformGeometry(width, depth, thickness, ageGroup) {
        // Create platform with rounded edges for safety
        const shape = new THREE.Shape();
        const radius = 0.05; // 2 inch radius for safety
        // Create rounded rectangle
        shape.moveTo(-width / 2 + radius, -depth / 2);
        shape.lineTo(width / 2 - radius, -depth / 2);
        shape.quadraticCurveTo(width / 2, -depth / 2, width / 2, -depth / 2 + radius);
        shape.lineTo(width / 2, depth / 2 - radius);
        shape.quadraticCurveTo(width / 2, depth / 2, width / 2 - radius, depth / 2);
        shape.lineTo(-width / 2 + radius, depth / 2);
        shape.quadraticCurveTo(-width / 2, depth / 2, -width / 2, depth / 2 - radius);
        shape.lineTo(-width / 2, -depth / 2 + radius);
        shape.quadraticCurveTo(-width / 2, -depth / 2, -width / 2 + radius, -depth / 2);
        return new THREE.ExtrudeGeometry(shape, {
            depth: thickness,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.01,
            bevelSegments: 3
        });
    }
    generatePlayEquipment(params, layout) {
        const equipment = [];
        layout.zones.forEach(zone => {
            let equipmentObject;
            switch (zone.equipment) {
                case 'slide':
                    equipmentObject = this.createSlide(params, zone);
                    break;
                case 'swing':
                    equipmentObject = this.createSwing(params, zone);
                    break;
                case 'climbing-wall':
                    equipmentObject = this.createClimbingWall(params, zone);
                    break;
                case 'playhouse':
                    equipmentObject = this.createPlayhouse(params, zone);
                    break;
                case 'sandbox':
                    equipmentObject = this.createSandbox(params, zone);
                    break;
                case 'seesaw':
                    equipmentObject = this.createSeesaw(params, zone);
                    break;
                default:
                    equipmentObject = this.createGenericEquipment(params, zone);
            }
            equipmentObject.position.copy(zone.position);
            equipmentObject.rotation.y = zone.rotation;
            equipment.push(equipmentObject);
        });
        return equipment;
    }
    createSlide(params, zone) {
        const slide = new THREE.Group();
        const ageConstraints = this.ageGroupConstraints.get(params.targetAgeGroup);
        const equipSpec = this.equipmentSpecs.get('slide');
        const ageSpec = equipSpec.ageVariations[params.targetAgeGroup];
        const slideHeight = ageSpec.maxHeight;
        const slideLength = slideHeight / Math.tan(THREE.MathUtils.degToRad(ageSpec.maxAngle));
        const slideWidth = 0.61; // 24 inches standard
        // Create slide chute
        const chuteGeometry = new THREE.BoxGeometry(slideWidth, 0.05, slideLength);
        const chute = new THREE.Mesh(chuteGeometry);
        chute.position.set(0, slideHeight / 2, slideLength / 2);
        chute.rotation.x = -THREE.MathUtils.degToRad(ageSpec.maxAngle);
        chute.userData.component = 'slide-chute';
        // Create slide sides for safety
        const sideHeight = equipSpec.sideHeight;
        const leftSideGeometry = new THREE.BoxGeometry(0.02, sideHeight, slideLength);
        const leftSide = new THREE.Mesh(leftSideGeometry);
        leftSide.position.set(-slideWidth / 2, slideHeight / 2 + sideHeight / 2, slideLength / 2);
        leftSide.rotation.x = -THREE.MathUtils.degToRad(ageSpec.maxAngle);
        leftSide.userData.component = 'slide-safety-side';
        const rightSide = leftSide.clone();
        rightSide.position.x = slideWidth / 2;
        // Create support structure
        const supportGeometry = new THREE.BoxGeometry(0.1, slideHeight, 0.1);
        const support = new THREE.Mesh(supportGeometry);
        support.position.set(0, slideHeight / 2, 0);
        support.userData.component = 'slide-support';
        slide.add(chute, leftSide, rightSide, support);
        slide.userData = {
            component: 'slide',
            ageGroup: params.targetAgeGroup,
            height: slideHeight,
            safetyCompliant: true
        };
        return slide;
    }
    createSwing(params, zone) {
        const swing = new THREE.Group();
        const equipSpec = this.equipmentSpecs.get('swing');
        const ageSpec = equipSpec.ageVariations[params.targetAgeGroup];
        const frameHeight = ageSpec.frameHeight;
        const frameWidth = 2.44; // 8 feet standard
        const seatHeight = ageSpec.seatHeight;
        // Create swing frame
        const leftPostGeometry = new THREE.BoxGeometry(0.1, frameHeight, 0.1);
        const leftPost = new THREE.Mesh(leftPostGeometry);
        leftPost.position.set(-frameWidth / 2, frameHeight / 2, 0);
        leftPost.userData.component = 'swing-post';
        const rightPost = leftPost.clone();
        rightPost.position.x = frameWidth / 2;
        const topBarGeometry = new THREE.BoxGeometry(frameWidth, 0.1, 0.1);
        const topBar = new THREE.Mesh(topBarGeometry);
        topBar.position.set(0, frameHeight - 0.05, 0);
        topBar.userData.component = 'swing-top-bar';
        // Create swing seat
        const seatGeometry = new THREE.BoxGeometry(0.46, 0.03, 0.20); // 18" x 8" seat
        const seat = new THREE.Mesh(seatGeometry);
        seat.position.set(0, seatHeight, 0);
        seat.userData.component = 'swing-seat';
        // Create chains (simplified as cylinders)
        const chainGeometry = new THREE.CylinderGeometry(0.01, 0.01, frameHeight - seatHeight - 0.1);
        const leftChain = new THREE.Mesh(chainGeometry);
        leftChain.position.set(-0.15, (frameHeight + seatHeight) / 2, 0);
        leftChain.userData.component = 'swing-chain';
        const rightChain = leftChain.clone();
        rightChain.position.x = 0.15;
        swing.add(leftPost, rightPost, topBar, seat, leftChain, rightChain);
        swing.userData = {
            component: 'swing',
            ageGroup: params.targetAgeGroup,
            safetyCompliant: true
        };
        return swing;
    }
    createClimbingWall(params, zone) {
        const climbingWall = new THREE.Group();
        const equipSpec = this.equipmentSpecs.get('climbing-wall');
        const ageSpec = equipSpec.ageVariations[params.targetAgeGroup];
        const wallHeight = ageSpec.maxHeight;
        const wallWidth = 2.44; // 8 feet wide
        const wallThickness = 0.15; // 6 inches thick
        // Create main wall
        const wallGeometry = new THREE.BoxGeometry(wallWidth, wallHeight, wallThickness);
        const wall = new THREE.Mesh(wallGeometry);
        wall.position.set(0, wallHeight / 2, 0);
        wall.rotation.x = -THREE.MathUtils.degToRad(ageSpec.maxAngle);
        wall.userData.component = 'climbing-wall';
        // Create climbing holds
        const holds = this.createClimbingHolds(wallWidth, wallHeight, params.targetAgeGroup);
        holds.forEach(hold => {
            hold.position.z = wallThickness / 2 + 0.05; // Mount on wall surface
            climbingWall.add(hold);
        });
        climbingWall.add(wall);
        climbingWall.userData = {
            component: 'climbing-wall',
            ageGroup: params.targetAgeGroup,
            safetyCompliant: true
        };
        return climbingWall;
    }
    createClimbingHolds(wallWidth, wallHeight, ageGroup) {
        const holds = [];
        const holdSpacing = ageGroup === '2-5' ? 0.20 : 0.30; // Closer spacing for younger kids
        const holdSize = ageGroup === '2-5' ? 0.08 : 0.10;
        for (let x = -wallWidth / 2 + holdSpacing; x < wallWidth / 2; x += holdSpacing) {
            for (let y = holdSpacing; y < wallHeight; y += holdSpacing * 1.5) {
                // Randomize hold positions slightly for realistic climbing
                const offsetX = (Math.random() - 0.5) * 0.05;
                const offsetY = (Math.random() - 0.5) * 0.05;
                const holdGeometry = new THREE.SphereGeometry(holdSize, 8, 6);
                const hold = new THREE.Mesh(holdGeometry);
                hold.position.set(x + offsetX, y + offsetY, 0);
                hold.userData.component = 'climbing-hold';
                holds.push(hold);
            }
        }
        return holds;
    }
    createPlayhouse(params, zone) {
        const playhouse = new THREE.Group();
        const equipSpec = this.equipmentSpecs.get('playhouse');
        const ageSpec = equipSpec.ageVariations[params.targetAgeGroup];
        const houseWidth = 2.44; // 8 feet
        const houseDepth = 2.44; // 8 feet
        const houseHeight = ageSpec.ceilingHeight;
        const wallThickness = 0.1;
        // Create walls
        const frontWallGeometry = new THREE.BoxGeometry(houseWidth, houseHeight, wallThickness);
        const frontWall = new THREE.Mesh(frontWallGeometry);
        frontWall.position.set(0, houseHeight / 2, houseDepth / 2);
        // Cut door opening
        frontWall.userData.component = 'playhouse-wall';
        frontWall.userData.hasDoor = true;
        frontWall.userData.doorWidth = equipSpec.doorWidth;
        const backWall = frontWall.clone();
        backWall.position.z = -houseDepth / 2;
        backWall.userData.hasDoor = false;
        const leftWallGeometry = new THREE.BoxGeometry(wallThickness, houseHeight, houseDepth);
        const leftWall = new THREE.Mesh(leftWallGeometry);
        leftWall.position.set(-houseWidth / 2, houseHeight / 2, 0);
        leftWall.userData.component = 'playhouse-wall';
        const rightWall = leftWall.clone();
        rightWall.position.x = houseWidth / 2;
        // Create roof
        const roofGeometry = new THREE.BoxGeometry(houseWidth, 0.1, houseDepth);
        const roof = new THREE.Mesh(roofGeometry);
        roof.position.y = houseHeight;
        roof.userData.component = 'playhouse-roof';
        // Create floor
        const floorGeometry = new THREE.BoxGeometry(houseWidth, 0.05, houseDepth);
        const floor = new THREE.Mesh(floorGeometry);
        floor.position.y = 0.025;
        floor.userData.component = 'playhouse-floor';
        playhouse.add(frontWall, backWall, leftWall, rightWall, roof, floor);
        playhouse.userData = {
            component: 'playhouse',
            ageGroup: params.targetAgeGroup,
            theme: params.themeStyle,
            safetyCompliant: true
        };
        return playhouse;
    }
    createSandbox(params, zone) {
        const sandbox = new THREE.Group();
        const boxWidth = 3.66; // 12 feet
        const boxDepth = 3.66; // 12 feet
        const boxHeight = 0.30; // 12 inches deep
        const borderHeight = 0.20; // 8 inch sitting border
        // Create sandbox border
        const borderThickness = 0.15; // 6 inches thick
        // Front border
        const frontBorderGeometry = new THREE.BoxGeometry(boxWidth, borderHeight, borderThickness);
        const frontBorder = new THREE.Mesh(frontBorderGeometry);
        frontBorder.position.set(0, borderHeight / 2, boxDepth / 2);
        frontBorder.userData.component = 'sandbox-border';
        const backBorder = frontBorder.clone();
        backBorder.position.z = -boxDepth / 2;
        const leftBorderGeometry = new THREE.BoxGeometry(borderThickness, borderHeight, boxDepth);
        const leftBorder = new THREE.Mesh(leftBorderGeometry);
        leftBorder.position.set(-boxWidth / 2, borderHeight / 2, 0);
        leftBorder.userData.component = 'sandbox-border';
        const rightBorder = leftBorder.clone();
        rightBorder.position.x = boxWidth / 2;
        // Create sand area (simplified as a plane)
        const sandGeometry = new THREE.PlaneGeometry(boxWidth - borderThickness, boxDepth - borderThickness);
        const sand = new THREE.Mesh(sandGeometry);
        sand.rotation.x = -Math.PI / 2;
        sand.position.y = 0.05; // Slightly above ground
        sand.userData.component = 'sandbox-sand';
        sandbox.add(frontBorder, backBorder, leftBorder, rightBorder, sand);
        sandbox.userData = {
            component: 'sandbox',
            ageGroup: params.targetAgeGroup,
            safetyCompliant: true,
            requiresCover: true // For safety and cleanliness
        };
        return sandbox;
    }
    createSeesaw(params, zone) {
        const seesaw = new THREE.Group();
        const boardLength = 3.66; // 12 feet
        const boardWidth = 0.30; // 12 inches
        const boardThickness = 0.05; // 2 inches
        const fulcrumHeight = 0.61; // 24 inches
        // Create seesaw board
        const boardGeometry = new THREE.BoxGeometry(boardLength, boardThickness, boardWidth);
        const board = new THREE.Mesh(boardGeometry);
        board.position.y = fulcrumHeight;
        board.userData.component = 'seesaw-board';
        // Create fulcrum
        const fulcrumGeometry = new THREE.CylinderGeometry(0.1, 0.1, fulcrumHeight, 8);
        const fulcrum = new THREE.Mesh(fulcrumGeometry);
        fulcrum.position.y = fulcrumHeight / 2;
        fulcrum.userData.component = 'seesaw-fulcrum';
        // Create handles
        const handleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
        const leftHandle = new THREE.Mesh(handleGeometry);
        leftHandle.position.set(-boardLength / 2 + 0.3, fulcrumHeight + 0.15, 0);
        leftHandle.userData.component = 'seesaw-handle';
        const rightHandle = leftHandle.clone();
        rightHandle.position.x = boardLength / 2 - 0.3;
        seesaw.add(board, fulcrum, leftHandle, rightHandle);
        seesaw.userData = {
            component: 'seesaw',
            ageGroup: params.targetAgeGroup,
            safetyCompliant: true
        };
        return seesaw;
    }
    createGenericEquipment(params, zone) {
        // Fallback for equipment types not yet implemented
        const genericGeometry = new THREE.BoxGeometry(1, 1, 1);
        const generic = new THREE.Mesh(genericGeometry);
        generic.userData = {
            component: zone.equipment,
            ageGroup: params.targetAgeGroup,
            placeholder: true
        };
        return generic;
    }
    generateSafetyFeatures(params, layout) {
        const safetyFeatures = [];
        // Generate fall zone indicators
        layout.zones.forEach(zone => {
            const fallZone = this.createFallZoneIndicator(zone);
            safetyFeatures.push(fallZone);
        });
        // Generate safety barriers if required
        if (layout.safetyBarriers.length > 0) {
            const barriers = this.createSafetyBarriers(layout.safetyBarriers, params);
            safetyFeatures.push(...barriers);
        }
        return safetyFeatures;
    }
    createFallZoneIndicator(zone) {
        const ageConstraints = this.ageGroupConstraints.get(zone.ageGroup);
        const fallZoneRadius = ageConstraints.fallZoneRadius;
        // Create visual indicator for fall zone (would be surfacing material in reality)
        const fallZoneGeometry = new THREE.CircleGeometry(fallZoneRadius, 32);
        const fallZone = new THREE.Mesh(fallZoneGeometry);
        fallZone.rotation.x = -Math.PI / 2; // Horizontal
        fallZone.position.copy(zone.position);
        fallZone.position.y = 0.01; // Slightly above ground
        fallZone.userData = {
            component: 'fall-zone',
            equipment: zone.equipment,
            surfaceMaterial: ageConstraints.surfaceMaterial
        };
        return fallZone;
    }
    createSafetyBarriers(barriers, params) {
        // Implementation would create actual barrier meshes based on barrier definitions
        return [];
    }
    generatePathways(params, layout) {
        const pathways = [];
        // Create main pathway around playground
        const pathwayWidth = 1.22; // 4 feet wide for accessibility
        const pathwayGeometry = new THREE.PlaneGeometry(params.availableSpace.width, pathwayWidth);
        const pathway = new THREE.Mesh(pathwayGeometry);
        pathway.rotation.x = -Math.PI / 2;
        pathway.position.y = 0.02; // Slightly raised
        pathway.userData = {
            component: 'pathway',
            accessible: params.accessibilityRequired,
            material: 'non-slip-surface'
        };
        pathways.push(pathway);
        return pathways;
    }
    generatePathwayLayout(zones, params) {
        // Implementation would calculate optimal pathway routing
        return [];
    }
    generateBarrierLayout(zones, params) {
        // Implementation would determine where barriers are needed
        return [];
    }
    generateAccessibilityLayout(zones, params) {
        // Implementation would create accessibility access points
        return [];
    }
    generateAccessibilityFeatures(params, layout) {
        const accessibilityFeatures = [];
        if (params.accessibilityRequired) {
            // Create transfer platforms for wheelchair users
            const transferPlatform = this.createTransferPlatform(params);
            accessibilityFeatures.push(transferPlatform);
            // Create accessible ramps
            const ramp = this.createAccessibleRamp(params);
            accessibilityFeatures.push(ramp);
        }
        return accessibilityFeatures;
    }
    createTransferPlatform(params) {
        const platformWidth = 0.76; // 30 inches
        const platformDepth = 0.61; // 24 inches
        const platformHeight = 0.46; // 18 inches (transfer height)
        const transferGeometry = new THREE.BoxGeometry(platformWidth, platformHeight, platformDepth);
        const transfer = new THREE.Mesh(transferGeometry);
        transfer.position.y = platformHeight / 2;
        transfer.userData = {
            component: 'transfer-platform',
            accessible: true,
            adaCompliant: true
        };
        return transfer;
    }
    createAccessibleRamp(params) {
        const rampWidth = 0.91; // 36 inches
        const rampLength = 3.66; // 12 feet (1:12 slope)
        const rampHeight = 0.30; // 12 inches rise
        const rampGeometry = new THREE.BoxGeometry(rampWidth, 0.05, rampLength);
        const ramp = new THREE.Mesh(rampGeometry);
        ramp.position.set(0, rampHeight / 2, 0);
        ramp.rotation.x = -Math.atan(rampHeight / rampLength); // 1:12 slope
        ramp.userData = {
            component: 'accessible-ramp',
            slope: '1:12',
            adaCompliant: true
        };
        return ramp;
    }
    addThemedElements(params, layout) {
        const themedElements = [];
        switch (params.themeStyle) {
            case 'castle':
                themedElements.push(...this.createCastleTheme(params, layout));
                break;
            case 'pirate':
                themedElements.push(...this.createPirateTheme(params, layout));
                break;
            case 'space':
                themedElements.push(...this.createSpaceTheme(params, layout));
                break;
            case 'natural':
                themedElements.push(...this.createNaturalTheme(params, layout));
                break;
            case 'cultural':
                themedElements.push(...this.createCulturalTheme(params, layout));
                break;
        }
        return themedElements;
    }
    createCastleTheme(params, layout) {
        const castleElements = [];
        // Create castle towers
        const towerGeometry = new THREE.CylinderGeometry(0.5, 0.6, 2, 8);
        const tower = new THREE.Mesh(towerGeometry);
        tower.position.set(-2, 1, -2);
        tower.userData.component = 'castle-tower';
        castleElements.push(tower);
        return castleElements;
    }
    createPirateTheme(params, layout) {
        // Implementation for pirate ship themed elements
        return [];
    }
    createSpaceTheme(params, layout) {
        // Implementation for space themed elements
        return [];
    }
    createNaturalTheme(params, layout) {
        // Implementation for natural/forest themed elements
        return [];
    }
    createCulturalTheme(params, layout) {
        // Implementation for cultural themed elements based on params.culture
        if (!params.culture)
            return [];
        switch (params.culture) {
            case 'japanese':
                return this.createJapaneseThemedElements(params, layout);
            case 'scandinavian':
                return this.createScandinavianThemedElements(params, layout);
            case 'french':
                return this.createFrenchThemedElements(params, layout);
            case 'italian':
                return this.createItalianThemedElements(params, layout);
            default:
                return [];
        }
    }
    createJapaneseThemedElements(params, layout) {
        const elements = [];
        // Create torii gate entrance
        const toriiGeometry = new THREE.BoxGeometry(3, 0.2, 0.2);
        const torii = new THREE.Mesh(toriiGeometry);
        torii.position.set(0, 2, -4);
        torii.userData.component = 'torii-gate';
        elements.push(torii);
        return elements;
    }
    createScandinavianThemedElements(params, layout) {
        const elements = [];
        // Create log cabin playhouse
        const cabinGeometry = new THREE.BoxGeometry(2, 1.5, 2);
        const cabin = new THREE.Mesh(cabinGeometry);
        cabin.position.set(2, 0.75, 2);
        cabin.userData.component = 'log-cabin';
        elements.push(cabin);
        return elements;
    }
    createFrenchThemedElements(params, layout) {
        const elements = [];
        // Create elegant pavilion
        const pavilionGeometry = new THREE.CylinderGeometry(2, 2, 0.2, 8);
        const pavilion = new THREE.Mesh(pavilionGeometry);
        pavilion.position.set(0, 2.5, 0);
        pavilion.userData.component = 'french-pavilion';
        elements.push(pavilion);
        return elements;
    }
    createItalianThemedElements(params, layout) {
        const elements = [];
        // Create roman column
        const columnGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2.5, 16);
        const column = new THREE.Mesh(columnGeometry);
        column.position.set(-2, 1.25, 0);
        column.userData.component = 'roman-column';
        elements.push(column);
        return elements;
    }
    applyPlaygroundMaterials(playground, params) {
        playground.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const component = child.userData.component;
                switch (component) {
                    case 'platform':
                    case 'slide-chute':
                    case 'playhouse-floor':
                        child.material = this.createSafeSurfaceMaterial(params);
                        break;
                    case 'slide-safety-side':
                    case 'swing-post':
                    case 'climbing-wall':
                        child.material = this.createStructuralMaterial(params);
                        break;
                    case 'fall-zone':
                        child.material = this.createFallZoneMaterial(params);
                        break;
                    case 'sandbox-sand':
                        child.material = this.createSandMaterial(params);
                        break;
                    default:
                        child.material = this.createGeneralPlaygroundMaterial(params);
                }
            }
        });
    }
    createSafeSurfaceMaterial(params) {
        return new THREE.MeshLambertMaterial({
            color: '#E6E6FA', // Light purple for soft surfaces
            transparent: false
        });
    }
    createStructuralMaterial(params) {
        const materialColors = {
            'plastic': '#4169E1',
            'wood-oak': '#D2B48C',
            'wood-pine': '#F5DEB3',
            'metal-steel': '#708090',
            'composite': '#556B2F'
        };
        return new THREE.MeshLambertMaterial({
            color: materialColors[params.primaryMaterial] || materialColors['plastic']
        });
    }
    createFallZoneMaterial(params) {
        return new THREE.MeshLambertMaterial({
            color: '#90EE90', // Light green for safe surfaces
            transparent: true,
            opacity: 0.3
        });
    }
    createSandMaterial(params) {
        return new THREE.MeshLambertMaterial({
            color: '#F4A460' // Sandy brown
        });
    }
    createGeneralPlaygroundMaterial(params) {
        // Apply color scheme based on parameters
        const colors = {
            'bright': ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
            'natural': ['#D2B48C', '#8FBC8F', '#DEB887', '#F5DEB3'],
            'pastel': ['#FFB6C1', '#E6E6FA', '#F0E68C', '#98FB98'],
            'themed': params.colorPalette
        };
        const colorArray = colors[params.colorScheme] || colors['bright'];
        const randomColor = colorArray[Math.floor(Math.random() * colorArray.length)];
        return new THREE.MeshLambertMaterial({
            color: randomColor
        });
    }
    // Template interface methods
    generateMetadata(parameters) {
        const playgroundParams = this.convertToPlaygroundParameters(parameters);
        return {
            id: `playground-${playgroundParams.culture || 'universal'}-${Date.now()}`,
            name: `${playgroundParams.culture || 'Universal'} ${playgroundParams.themeStyle} Playground`,
            description: `Safe, ${playgroundParams.culture || 'universal'} culturally-aware playground for ages ${playgroundParams.targetAgeGroup} with ${playgroundParams.equipmentTypes.join(', ')} equipment`,
            culturalSignificance: this.getCulturalSignificanceForPlayground(playgroundParams.culture),
            usageGuidelines: this.getPlaygroundUsageGuidelines(playgroundParams),
            maintenanceInstructions: this.getPlaygroundMaintenanceInstructions(playgroundParams),
            estimatedCost: this.estimatePlaygroundCost(playgroundParams)
        };
    }
    getCulturalProportions(culture) {
        return this.culturalDB.getCulturalProportions(culture, 'playground');
    }
    validateParameters(parameters) {
        const playgroundParams = this.convertToPlaygroundParameters(parameters);
        const validation = this.validateSafetyRequirements(playgroundParams);
        return validation.passed;
    }
    getCulturalSignificanceForPlayground(culture) {
        if (!culture)
            return 'Universal playground design promoting safe play and development';
        const significance = {
            'japanese': 'Promotes harmony with nature, mindful play, and respect for natural elements through zen-inspired design',
            'scandinavian': 'Embodies hygge philosophy with cozy, safe spaces that encourage exploration and connection with nature',
            'italian': 'Reflects Renaissance ideals of beauty and creativity, encouraging artistic expression and social interaction',
            'french': 'Embodies French savoir-vivre with elegant design promoting proper social development, aesthetic appreciation, and structured play that builds cultural refinement',
            'modern': 'Represents contemporary safety standards and inclusive design principles for all children'
        };
        return significance[culture] || 'Promotes cultural awareness and inclusive play experiences';
    }
    getPlaygroundUsageGuidelines(params) {
        const guidelines = [
            `Designed for children ages ${params.targetAgeGroup}`,
            `Maximum capacity: ${params.maxCapacity} children`,
            `Safety standard: ${params.safetyStandard} compliant`,
            `Suitable for ${params.indoorOutdoor} use`,
            'Adult supervision recommended at all times'
        ];
        if (params.culture) {
            guidelines.push(`Incorporates ${params.culture} cultural elements for educational play`);
        }
        if (params.accessibilityRequired) {
            guidelines.push('Designed with accessibility features for inclusive play');
        }
        return guidelines;
    }
    getPlaygroundMaintenanceInstructions(params) {
        const instructions = [
            'Daily visual inspection of all equipment',
            'Weekly detailed safety inspection',
            'Monthly deep cleaning of all surfaces',
            'Quarterly professional safety audit',
            'Annual equipment replacement assessment'
        ];
        if (params.primaryMaterial.includes('wood')) {
            instructions.push('Apply wood preservative annually');
        }
        if (params.equipmentTypes.includes('sandbox')) {
            instructions.push('Replace sandbox sand every 6 months');
        }
        return instructions;
    }
    estimatePlaygroundCost(params) {
        let baseCost = 15000; // Base cost for basic playground
        // Equipment cost multipliers
        const equipmentCosts = {
            'slide': 2000,
            'swing': 1500,
            'climbing-wall': 3000,
            'playhouse': 2500,
            'sandbox': 800,
            'seesaw': 1200,
            'monkey-bars': 2200,
            'spring-rider': 800,
            'tunnel': 1800,
            'balance-beam': 600,
            'spinning-top': 1000,
            'trampoline': 3500
        };
        // Add equipment costs
        params.equipmentTypes.forEach(equipment => {
            baseCost += equipmentCosts[equipment] || 1000;
        });
        // Material multipliers
        const materialMultipliers = {
            'plastic': 1.0,
            'wood-oak': 1.3,
            'wood-pine': 1.2,
            'metal-steel': 1.2,
            'composite': 1.5
        };
        baseCost *= materialMultipliers[params.primaryMaterial] || 1.0;
        // Cultural customization multiplier
        if (params.culture && params.culture !== 'modern') {
            baseCost *= 1.15; // 15% premium for cultural features
        }
        // Accessibility multiplier
        if (params.accessibilityRequired) {
            baseCost *= 1.25; // 25% premium for accessibility features
        }
        return Math.round(baseCost);
    }
}
// Testing function
export function createTestPlayground() {
    const playgroundTemplate = new EnhancedPlaygroundTemplate();
    const testPlaygroundParams = {
        targetAgeGroup: '5-12',
        maxCapacity: 15,
        safetyStandard: 'ASTM',
        equipmentTypes: ['slide', 'swing', 'climbing-wall', 'playhouse'],
        themeStyle: 'cultural',
        availableSpace: {
            width: 15,
            depth: 12
        },
        primaryMaterial: 'composite',
        colorScheme: 'themed',
        colorPalette: ['#F5F5DC', '#E6E6FA', '#DDA0DD'],
        accessibilityRequired: true,
        inclusiveDesign: true,
        indoorOutdoor: 'outdoor',
        weatherResistance: true,
        culture: 'french',
        culturalElements: ['refined-curves', 'elegant-proportions', 'social-gathering'],
        culturalPlayPatterns: {
            socialInteraction: 'group',
            learningStyle: 'structured',
            movementCulture: 'contemplative',
            seasonalPlay: false
        }
    };
    return playgroundTemplate.generatePlayground(testPlaygroundParams);
}
//# sourceMappingURL=EnhancedPlaygroundTemplate.js.map