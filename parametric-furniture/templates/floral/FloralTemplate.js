// Parametric Floral Arrangement Template
import * as THREE from 'three';
export class FloralTemplate {
    constructor() {
        this.culturalFlowerData = new Map();
        this.seasonalAvailability = new Map();
        this.symbolismDatabase = new Map();
        this.initializeCulturalData();
        this.initializeSeasonalData();
        this.initializeSymbolism();
    }
    generateFloralArrangements(parameters) {
        console.log(`🌸 Generating ${parameters.culture} florals for ${parameters.eventType}...`);
        // Step 1: Select culturally appropriate flowers
        const selectedFlowers = this.selectCulturalFlowers(parameters);
        // Step 2: Design arrangement composition
        const composition = this.designComposition(parameters, selectedFlowers);
        // Step 3: Generate 3D arrangements
        const floralSystem = new THREE.Group();
        const centerpieces = this.generateCenterpieces(composition, parameters);
        const accentPieces = this.generateAccentArrangements(composition, parameters);
        const culturalElements = this.addCulturalFloralElements(parameters);
        // Step 4: Add sustainable elements
        if (parameters.sustainablePractices) {
            const sustainableElements = this.addSustainableElements(parameters);
            floralSystem.add(...sustainableElements);
        }
        // Step 5: Assemble complete system
        floralSystem.add(...centerpieces, ...accentPieces, ...culturalElements);
        // Step 6: Apply materials and textures
        this.applyFloralMaterials(floralSystem, parameters);
        floralSystem.userData = {
            type: 'floral-arrangement-system',
            culture: parameters.culture,
            flowers: selectedFlowers,
            symbolism: this.getArrangementSymbolism(parameters),
            sustainability: parameters.sustainablePractices,
            estimatedCost: this.calculateFloralCost(parameters, selectedFlowers),
            generatedAt: Date.now()
        };
        console.log(`✨ ${parameters.culture} floral arrangements generated successfully!`);
        return floralSystem;
    }
    initializeCulturalData() {
        // Japanese Ikebana Principles
        this.culturalFlowerData.set('japanese', {
            philosophy: 'Harmony with nature, asymmetrical balance, seasonal awareness',
            preferredFlowers: ['cherry-blossom', 'chrysanthemum', 'iris', 'camellia', 'plum-blossom', 'pine-branches'],
            arrangements: ['ikebana', 'moribana', 'nageire'],
            principles: ['heaven-earth-human', 'asymmetry', 'negative-space', 'seasonal-focus'],
            materials: ['bamboo', 'ceramic', 'natural-branches'],
            colorPhilosophy: 'subtle-gradations',
            seasonalEmphasis: true,
            symbolism: {
                'cherry-blossom': 'ephemeral beauty',
                'chrysanthemum': 'autumn and longevity',
                'iris': 'valor and wisdom',
                'camellia': 'divine and perfect love',
                'pine-branches': 'eternal life and steadfastness'
            }
        });
        // Scandinavian Natural Simplicity
        this.culturalFlowerData.set('scandinavian', {
            philosophy: 'Natural simplicity, organic forms, hygge comfort',
            preferredFlowers: ['tulip', 'daffodil', 'lily-of-valley', 'wildflowers', 'birch-branches'],
            arrangements: ['loose-natural', 'foraged-style', 'minimal-modern'],
            principles: ['simplicity', 'natural-beauty', 'seasonal-local'],
            materials: ['wood', 'ceramic', 'glass', 'natural-fibers'],
            colorPhilosophy: 'muted-naturals',
            seasonalEmphasis: true,
            symbolism: {
                'tulip': 'perfect love and elegance',
                'daffodil': 'new beginnings and rebirth',
                'lily-of-valley': 'humility and sweetness',
                'wildflowers': 'freedom and natural beauty',
                'birch-branches': 'new beginnings and renewal'
            }
        });
        // Italian Renaissance Elegance
        this.culturalFlowerData.set('italian', {
            philosophy: 'Artistic beauty, abundant luxury, classical proportions',
            preferredFlowers: ['rose', 'lily', 'peony', 'lavender', 'olive-branches'],
            arrangements: ['abundant-classical', 'renaissance-style', 'villa-garden'],
            principles: ['abundance', 'classical-beauty', 'artistic-arrangement'],
            materials: ['terracotta', 'marble', 'bronze', 'silk'],
            colorPhilosophy: 'rich-harmonies',
            seasonalEmphasis: false,
            symbolism: {
                'rose': 'love and passion',
                'lily': 'purity and rebirth',
                'peony': 'prosperity and honor',
                'lavender': 'serenity and grace',
                'olive-branches': 'peace and wisdom'
            }
        });
        // French Savoir-vivre Elegance
        this.culturalFlowerData.set('french', {
            philosophy: 'Refined elegance, sophisticated arrangements, artful composition',
            preferredFlowers: ['garden-rose', 'peony', 'hydrangea', 'delphinium', 'ranunculus'],
            arrangements: ['salon-style', 'garden-party', 'sophisticated-centerpiece'],
            principles: ['artistic-composition', 'refined-elegance', 'seasonal-sophistication'],
            materials: ['porcelain', 'crystal', 'silver', 'silk'],
            colorPhilosophy: 'sophisticated-harmonies',
            seasonalEmphasis: true,
            symbolism: {
                'garden-rose': 'passionate romance',
                'peony': 'prosperity and honor',
                'hydrangea': 'heartfelt emotions',
                'delphinium': 'cheerfulness and goodwill',
                'ranunculus': 'radiant charm'
            }
        });
        // Modern minimalist
        this.culturalFlowerData.set('modern', {
            philosophy: 'Clean lines, architectural forms, contemporary elegance',
            preferredFlowers: ['orchid', 'anthurium', 'calla-lily', 'bird-of-paradise', 'modern-roses'],
            arrangements: ['architectural', 'geometric', 'monochromatic-modern'],
            principles: ['clean-lines', 'architectural-form', 'contemporary-elegance'],
            materials: ['glass', 'metal', 'acrylic', 'concrete'],
            colorPhilosophy: 'bold-monochromatic',
            seasonalEmphasis: false,
            symbolism: {
                'orchid': 'luxury and strength',
                'anthurium': 'hospitality and happiness',
                'calla-lily': 'magnificent beauty',
                'bird-of-paradise': 'freedom and perspective',
                'modern-roses': 'contemporary love'
            }
        });
    }
    selectCulturalFlowers(params) {
        const culturalData = this.culturalFlowerData.get(params.culture);
        let availableFlowers = culturalData.preferredFlowers;
        // Filter by seasonal availability if local sourcing is required
        if (params.localSourcing) {
            const seasonalFlowers = this.getSeasonalFlowers(params.season);
            availableFlowers = availableFlowers.filter(flower => seasonalFlowers.includes(flower));
        }
        // Remove avoided flowers
        availableFlowers = availableFlowers.filter(flower => !params.avoidFlowers.includes(flower));
        // Add traditional flowers if specified
        const allSelected = [...new Set([...availableFlowers, ...params.traditionalFlowers])];
        // Select based on budget and scale
        return this.selectByBudgetAndScale(allSelected, params);
    }
    selectByBudgetAndScale(flowers, params) {
        const flowerCosts = {
            'cherry-blossom': 25, 'rose': 15, 'orchid': 35, 'tulip': 8,
            'chrysanthemum': 12, 'lily': 20, 'peony': 30, 'daffodil': 6,
            'iris': 18, 'anthurium': 25, 'calla-lily': 22, 'lily-of-valley': 40,
            'camellia': 28, 'lavender': 10, 'wildflowers': 5, 'bird-of-paradise': 45
        };
        const scaleMultipliers = {
            'intimate': 1, 'medium': 2, 'grand': 4, 'monumental': 8
        };
        const budgetPerFlower = params.budget / (scaleMultipliers[params.scale] * 3);
        return flowers.filter(flower => (flowerCosts[flower] || 15) <= budgetPerFlower);
    }
    generateCenterpieces(composition, params) {
        const centerpieces = [];
        switch (params.arrangementStyle) {
            case 'centerpiece':
                centerpieces.push(this.createMainCenterpiece(params, composition));
                break;
            case 'altar':
                centerpieces.push(this.createAltarArrangement(params, composition));
                break;
            case 'entrance':
                centerpieces.push(this.createEntranceArrangement(params, composition));
                break;
            case 'scattered':
                for (let i = 0; i < 3; i++) {
                    centerpieces.push(this.createScatteredArrangement(params, composition, i));
                }
                break;
            default:
                centerpieces.push(this.createMainCenterpiece(params, composition));
        }
        return centerpieces;
    }
    createMainCenterpiece(params, composition) {
        const centerpiece = new THREE.Group();
        switch (params.culture) {
            case 'japanese':
                return this.createIkebanaArrangement(params, composition);
            case 'scandinavian':
                return this.createNaturalArrangement(params, composition);
            case 'italian':
                return this.createRenaissanceArrangement(params, composition);
            case 'french':
                return this.createFrenchArrangement(params, composition);
            case 'modern':
                return this.createModernArrangement(params, composition);
            default:
                return this.createTraditionalArrangement(params, composition);
        }
    }
    createIkebanaArrangement(params, composition) {
        const ikebana = new THREE.Group();
        // Create kenzan (pin holder) base
        const baseGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 12);
        const baseMaterial = new THREE.MeshLambertMaterial({ color: '#8B4513' });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        ikebana.add(base);
        // Create asymmetrical arrangement following heaven-earth-human principle
        const heavenBranch = this.createBranch(0.6, 0.02, '#654321');
        heavenBranch.position.set(0.05, 0.05, 0);
        heavenBranch.rotation.z = Math.PI / 6; // 30 degrees
        const earthBranch = this.createBranch(0.4, 0.015, '#654321');
        earthBranch.position.set(-0.08, 0.05, 0.03);
        earthBranch.rotation.z = -Math.PI / 4; // -45 degrees
        const humanBranch = this.createBranch(0.3, 0.01, '#654321');
        humanBranch.position.set(0.02, 0.05, -0.05);
        humanBranch.rotation.z = Math.PI / 8; // 22.5 degrees
        ikebana.add(heavenBranch, earthBranch, humanBranch);
        // Add minimal flowers at strategic points
        const flowers = this.createMinimalFlowers(['cherry-blossom', 'iris'], 3);
        flowers.forEach((flower, index) => {
            const positions = [
                new THREE.Vector3(0.03, 0.3, 0.02),
                new THREE.Vector3(-0.05, 0.2, 0.04),
                new THREE.Vector3(0.01, 0.15, -0.03)
            ];
            flower.position.copy(positions[index]);
            ikebana.add(flower);
        });
        ikebana.userData = { type: 'ikebana-centerpiece', culture: 'japanese' };
        return ikebana;
    }
    createNaturalArrangement(params, composition) {
        const arrangement = new THREE.Group();
        // Create natural wooden base
        const baseGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.2);
        const baseMaterial = new THREE.MeshLambertMaterial({ color: '#DEB887' });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        arrangement.add(base);
        // Create loose, natural cluster
        const wildflowers = this.createWildflowerCluster(['tulip', 'daffodil', 'wildflowers'], 8);
        wildflowers.position.y = 0.05;
        arrangement.add(wildflowers);
        // Add natural branches
        const birchBranches = this.createNaturalBranches(3);
        birchBranches.forEach(branch => arrangement.add(branch));
        arrangement.userData = { type: 'natural-centerpiece', culture: 'scandinavian' };
        return arrangement;
    }
    createRenaissanceArrangement(params, composition) {
        const arrangement = new THREE.Group();
        // Create ornate marble-style base
        const baseGeometry = new THREE.CylinderGeometry(0.2, 0.25, 0.15, 16);
        const baseMaterial = new THREE.MeshPhongMaterial({
            color: '#F8F8FF',
            shininess: 100
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        arrangement.add(base);
        // Create abundant, layered arrangement
        const abundantFlowers = this.createAbundantArrangement(['rose', 'lily', 'peony'], 15);
        abundantFlowers.position.y = 0.075;
        arrangement.add(abundantFlowers);
        // Add classical elements
        const oliveGarland = this.createOliveGarland();
        arrangement.add(oliveGarland);
        arrangement.userData = { type: 'renaissance-centerpiece', culture: 'italian' };
        return arrangement;
    }
    createModernArrangement(params, composition) {
        const arrangement = new THREE.Group();
        // Create sleek modern base
        const baseGeometry = new THREE.BoxGeometry(0.4, 0.1, 0.1);
        const baseMaterial = new THREE.MeshPhongMaterial({
            color: '#2F2F2F',
            shininess: 200
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        arrangement.add(base);
        // Create geometric arrangement
        const geometricFlowers = this.createGeometricArrangement(['orchid', 'calla-lily', 'anthurium'], 5);
        geometricFlowers.position.y = 0.05;
        arrangement.add(geometricFlowers);
        arrangement.userData = { type: 'modern-centerpiece', culture: 'modern' };
        return arrangement;
    }
    createFrenchArrangement(params, composition) {
        const arrangement = new THREE.Group();
        // Create elegant porcelain base
        const baseGeometry = new THREE.CylinderGeometry(0.18, 0.2, 0.25, 16);
        const baseMaterial = new THREE.MeshPhongMaterial({
            color: '#F8F8FF',
            shininess: 100
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        arrangement.add(base);
        // Create sophisticated French arrangement
        const frenchFlowers = this.createSophisticatedArrangement(['garden-rose', 'peony', 'hydrangea'], 12);
        frenchFlowers.position.y = 0.125;
        arrangement.add(frenchFlowers);
        // Add French decorative elements
        const ribbonAccent = this.createSilkRibbon();
        arrangement.add(ribbonAccent);
        arrangement.userData = { type: 'french-centerpiece', culture: 'french' };
        return arrangement;
    }
    createTraditionalArrangement(params, composition) {
        const arrangement = new THREE.Group();
        // Create simple ceramic base
        const baseGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 16);
        const baseMaterial = new THREE.MeshLambertMaterial({ color: '#FFFFFF' });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        arrangement.add(base);
        // Create balanced traditional arrangement
        const traditionalFlowers = this.createBalancedArrangement(['rose', 'lily'], 7);
        traditionalFlowers.position.y = 0.1;
        arrangement.add(traditionalFlowers);
        arrangement.userData = { type: 'traditional-centerpiece', culture: 'traditional' };
        return arrangement;
    }
    createBranch(length, thickness, color) {
        const branchGeometry = new THREE.CylinderGeometry(thickness, thickness * 0.5, length, 6);
        const branchMaterial = new THREE.MeshLambertMaterial({ color });
        const branch = new THREE.Mesh(branchGeometry, branchMaterial);
        branch.position.y = length / 2;
        return branch;
    }
    createMinimalFlowers(flowerTypes, count) {
        const flowers = [];
        for (let i = 0; i < count; i++) {
            const flowerType = flowerTypes[i % flowerTypes.length];
            const flower = this.createSingleFlower(flowerType);
            flowers.push(flower);
        }
        return flowers;
    }
    createSingleFlower(type) {
        const flowerGroup = new THREE.Group();
        const colors = {
            'cherry-blossom': 0xFFB6C1,
            'rose': 0xFF69B4,
            'tulip': 0xFF4500,
            'iris': 0x9370DB,
            'lily': 0xFFFFFF,
            'orchid': 0xDA70D6,
            'daffodil': 0xFFFF00,
            'wildflowers': 0x98FB98
        };
        // Flower head
        const flowerGeometry = new THREE.SphereGeometry(0.02, 8, 6);
        const flowerMaterial = new THREE.MeshLambertMaterial({
            color: colors[type] || 0xFFB6C1
        });
        const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
        // Stem
        const stemGeometry = new THREE.CylinderGeometry(0.002, 0.002, 0.1, 4);
        const stemMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.y = -0.05;
        flowerGroup.add(flower, stem);
        flowerGroup.userData = { type: 'flower', variety: type };
        return flowerGroup;
    }
    createWildflowerCluster(flowerTypes, count) {
        const cluster = new THREE.Group();
        for (let i = 0; i < count; i++) {
            const flowerType = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
            const flower = this.createSingleFlower(flowerType);
            // Random natural positioning
            flower.position.set((Math.random() - 0.5) * 0.25, Math.random() * 0.2 + 0.05, (Math.random() - 0.5) * 0.15);
            flower.scale.setScalar(0.5 + Math.random() * 0.5);
            flower.rotation.y = Math.random() * Math.PI * 2;
            cluster.add(flower);
        }
        return cluster;
    }
    createNaturalBranches(count) {
        const branches = [];
        for (let i = 0; i < count; i++) {
            const branch = this.createBranch(0.3 + Math.random() * 0.3, 0.01 + Math.random() * 0.01, '#8B7355');
            branch.position.set((Math.random() - 0.5) * 0.2, 0.1, (Math.random() - 0.5) * 0.1);
            branch.rotation.z = (Math.random() - 0.5) * Math.PI / 3;
            branches.push(branch);
        }
        return branches;
    }
    createAbundantArrangement(flowerTypes, count) {
        const arrangement = new THREE.Group();
        // Create layered, abundant arrangement
        for (let i = 0; i < count; i++) {
            const flowerType = flowerTypes[i % flowerTypes.length];
            const flower = this.createSingleFlower(flowerType);
            // Layered positioning
            const layer = Math.floor(i / 5);
            const angle = (i % 5) * (Math.PI * 2 / 5);
            const radius = 0.1 + layer * 0.05;
            flower.position.set(Math.cos(angle) * radius, layer * 0.08 + 0.02, Math.sin(angle) * radius);
            flower.scale.setScalar(1.2 - layer * 0.2);
            arrangement.add(flower);
        }
        return arrangement;
    }
    createGeometricArrangement(flowerTypes, count) {
        const arrangement = new THREE.Group();
        // Create precise geometric arrangement
        for (let i = 0; i < count; i++) {
            const flowerType = flowerTypes[i % flowerTypes.length];
            const flower = this.createSingleFlower(flowerType);
            // Linear geometric positioning
            flower.position.set((i - count / 2) * 0.08, 0.02, 0);
            flower.scale.setScalar(1.5);
            arrangement.add(flower);
        }
        return arrangement;
    }
    createBalancedArrangement(flowerTypes, count) {
        const arrangement = new THREE.Group();
        // Create symmetrical arrangement
        for (let i = 0; i < count; i++) {
            const flowerType = flowerTypes[i % flowerTypes.length];
            const flower = this.createSingleFlower(flowerType);
            // Circular symmetric positioning
            const angle = (i / count) * Math.PI * 2;
            const radius = 0.12;
            flower.position.set(Math.cos(angle) * radius, 0.02, Math.sin(angle) * radius);
            arrangement.add(flower);
        }
        return arrangement;
    }
    createSophisticatedArrangement(flowerTypes, count) {
        const arrangement = new THREE.Group();
        // Create sophisticated layered arrangement with French salon style
        for (let i = 0; i < count; i++) {
            const flowerType = flowerTypes[i % flowerTypes.length];
            const flower = this.createSingleFlower(flowerType);
            // Sophisticated spiral positioning
            const spiralProgress = i / count;
            const angle = spiralProgress * Math.PI * 3; // 1.5 full rotations
            const radius = 0.08 + spiralProgress * 0.1; // Expanding spiral
            const height = spiralProgress * 0.15; // Rising spiral
            flower.position.set(Math.cos(angle) * radius, height + 0.02, Math.sin(angle) * radius);
            // Scale flowers for depth and sophistication
            flower.scale.setScalar(1.2 - spiralProgress * 0.4);
            arrangement.add(flower);
        }
        return arrangement;
    }
    createSilkRibbon() {
        const ribbonGroup = new THREE.Group();
        // Create elegant silk ribbon accent
        const ribbonGeometry = new THREE.PlaneGeometry(0.4, 0.03);
        const ribbonMaterial = new THREE.MeshLambertMaterial({
            color: '#FFB6C1',
            transparent: true,
            opacity: 0.8
        });
        const ribbon = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
        // Position ribbon elegantly around the arrangement
        ribbon.position.set(0, 0.15, 0.2);
        ribbon.rotation.x = Math.PI / 6;
        ribbonGroup.add(ribbon);
        ribbonGroup.userData = { type: 'silk-ribbon', culture: 'french' };
        return ribbonGroup;
    }
    createOliveGarland() {
        const garland = new THREE.Group();
        // Create olive branch garland around base
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.02, 0.01), new THREE.MeshLambertMaterial({ color: 0x9ACD32 }));
            leaf.position.set(Math.cos(angle) * 0.28, 0.075, Math.sin(angle) * 0.28);
            leaf.rotation.y = angle;
            garland.add(leaf);
        }
        return garland;
    }
    // Additional helper methods
    createAltarArrangement(params, composition) {
        const altar = new THREE.Group();
        // Large-scale arrangement for altar/ceremony setting
        return altar;
    }
    createEntranceArrangement(params, composition) {
        const entrance = new THREE.Group();
        // Welcoming entrance arrangement
        return entrance;
    }
    createScatteredArrangement(params, composition, index) {
        const scattered = this.createMainCenterpiece(params, composition);
        scattered.scale.setScalar(0.7); // Smaller for scattered placement
        // Position for scattered placement
        const positions = [
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(1, 0, -0.5),
            new THREE.Vector3(0, 0, 1)
        ];
        scattered.position.copy(positions[index % positions.length]);
        return scattered;
    }
    generateAccentArrangements(composition, params) {
        const accents = [];
        // Add smaller accent arrangements based on style
        if (params.arrangementStyle === 'perimeter') {
            for (let i = 0; i < 4; i++) {
                const accent = this.createSmallAccent(params, i);
                accents.push(accent);
            }
        }
        return accents;
    }
    createSmallAccent(params, index) {
        const accent = new THREE.Group();
        // Create small accent arrangement
        const smallBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 8), new THREE.MeshLambertMaterial({ color: '#DEB887' }));
        const smallFlower = this.createSingleFlower('wildflowers');
        smallFlower.position.y = 0.03;
        accent.add(smallBase, smallFlower);
        // Position around perimeter
        const angle = (index / 4) * Math.PI * 2;
        accent.position.set(Math.cos(angle) * 2, 0, Math.sin(angle) * 2);
        return accent;
    }
    addCulturalFloralElements(params) {
        const elements = [];
        // Add culture-specific elements
        const culturalData = this.culturalFlowerData.get(params.culture);
        if (params.culture === 'japanese' && params.traditionalFlowers.includes('cherry-blossom')) {
            const sakuraPetals = this.createSakuraPetals();
            elements.push(sakuraPetals);
        }
        return elements;
    }
    createSakuraPetals() {
        const petals = new THREE.Group();
        // Create scattered cherry blossom petals
        for (let i = 0; i < 20; i++) {
            const petal = new THREE.Mesh(new THREE.PlaneGeometry(0.01, 0.005), new THREE.MeshLambertMaterial({
                color: 0xFFB6C1,
                transparent: true,
                opacity: 0.8
            }));
            petal.position.set((Math.random() - 0.5) * 4, Math.random() * 0.1, (Math.random() - 0.5) * 4);
            petal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            petals.add(petal);
        }
        petals.userData = { type: 'sakura-petals', culture: 'japanese' };
        return petals;
    }
    addSustainableElements(params) {
        const sustainable = [];
        if (params.reusability) {
            // Add reusable elements like planted flowers in pots
            const plantedArrangement = this.createPlantedArrangement();
            sustainable.push(plantedArrangement);
        }
        return sustainable;
    }
    createPlantedArrangement() {
        const planted = new THREE.Group();
        // Create potted plant arrangement
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.12, 0.2, 12), new THREE.MeshLambertMaterial({ color: '#8B4513' }));
        const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.02, 12), new THREE.MeshLambertMaterial({ color: '#654321' }));
        soil.position.y = 0.09;
        const plantedFlower = this.createSingleFlower('tulip');
        plantedFlower.position.y = 0.15;
        planted.add(pot, soil, plantedFlower);
        planted.userData = { type: 'planted-arrangement', sustainable: true };
        return planted;
    }
    applyFloralMaterials(system, params) {
        // Apply culturally appropriate materials and finishes
        const culturalData = this.culturalFlowerData.get(params.culture);
        system.traverse((child) => {
            if (child instanceof THREE.Mesh && child.userData.component === 'base') {
                // Apply cultural material preferences to bases
                if (culturalData.materials.includes('ceramic')) {
                    child.material = new THREE.MeshPhongMaterial({
                        color: child.material.color,
                        shininess: 50
                    });
                }
            }
        });
    }
    designComposition(params, flowers) {
        const culturalData = this.culturalFlowerData.get(params.culture);
        return {
            style: culturalData.arrangements[0],
            flowers: flowers,
            scale: params.scale,
            colorScheme: params.colorScheme,
            principles: culturalData.principles
        };
    }
    initializeSeasonalData() {
        this.seasonalAvailability.set('spring', [
            'cherry-blossom', 'tulip', 'daffodil', 'iris', 'lily-of-valley'
        ]);
        this.seasonalAvailability.set('summer', [
            'rose', 'lily', 'lavender', 'wildflowers', 'anthurium'
        ]);
        this.seasonalAvailability.set('autumn', [
            'chrysanthemum', 'peony', 'marigold', 'aster'
        ]);
        this.seasonalAvailability.set('winter', [
            'camellia', 'orchid', 'pine-branches', 'holly'
        ]);
    }
    initializeSymbolism() {
        // Initialize comprehensive flower symbolism database
        this.symbolismDatabase.set('universal', {
            'rose': 'love and passion',
            'lily': 'purity and rebirth',
            'orchid': 'luxury and strength',
            'tulip': 'perfect love'
        });
    }
    getSeasonalFlowers(season) {
        return this.seasonalAvailability.get(season) || [];
    }
    getArrangementSymbolism(params) {
        const culturalData = this.culturalFlowerData.get(params.culture);
        const symbolism = {};
        // Combine cultural symbolism with universal meanings
        Object.entries(culturalData.symbolism).forEach(([flower, meaning]) => {
            symbolism[flower] = meaning;
        });
        return symbolism;
    }
    calculateFloralCost(params, flowers) {
        const baseCosts = {
            'cherry-blossom': 25, 'rose': 15, 'orchid': 35, 'tulip': 8,
            'chrysanthemum': 12, 'lily': 20, 'peony': 30, 'daffodil': 6
        };
        const scaleMultipliers = {
            'intimate': 1, 'medium': 2, 'grand': 4, 'monumental': 8
        };
        let totalCost = 0;
        flowers.forEach(flower => {
            totalCost += (baseCosts[flower] || 15) * scaleMultipliers[params.scale];
        });
        return totalCost;
    }
}
