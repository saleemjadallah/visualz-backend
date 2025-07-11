import * as THREE from 'three';
import { CulturalKnowledgeBase } from '../../cultural/CulturalKnowledgeBase.js';
export class TableTemplate {
    constructor() {
        this.culturalDB = new CulturalKnowledgeBase();
    }
    generateGeometry(parameters) {
        const table = new THREE.Group();
        table.name = 'ParametricTable';
        // Generate table components
        const top = this.generateTableTop(parameters);
        const legs = this.generateTableLegs(parameters);
        const supports = this.generateSupports(parameters);
        const culturalDetails = this.addCulturalTableElements(parameters);
        // Assemble table
        table.add(top, ...legs);
        if (supports.length > 0) {
            table.add(...supports);
        }
        if (culturalDetails.length > 0) {
            table.add(...culturalDetails);
        }
        // Add metadata
        table.userData = this.generateMetadata(parameters);
        return table;
    }
    generateTableTop(parameters) {
        const culturalProps = this.getCulturalProportions(parameters.culture);
        const topWidth = parameters.width;
        const topDepth = parameters.depth;
        const topThickness = culturalProps.surfaceThickness;
        let topGeometry;
        // Create culturally appropriate table top
        switch (parameters.culture) {
            case 'japanese':
                topGeometry = this.createJapaneseTableTop(topWidth, topDepth, topThickness);
                break;
            case 'scandinavian':
                topGeometry = this.createScandinavianTableTop(topWidth, topDepth, topThickness);
                break;
            case 'italian':
                topGeometry = this.createItalianTableTop(topWidth, topDepth, topThickness);
                break;
            case 'french':
                topGeometry = this.createFrenchTableTop(topWidth, topDepth, topThickness);
                break;
            case 'modern':
                topGeometry = this.createModernTableTop(topWidth, topDepth, topThickness);
                break;
            default:
                topGeometry = new THREE.BoxGeometry(topWidth, topThickness, topDepth);
        }
        const tableTop = new THREE.Mesh(topGeometry);
        tableTop.position.y = parameters.height - (topThickness / 2);
        tableTop.castShadow = true;
        tableTop.receiveShadow = true;
        tableTop.userData.component = 'top';
        return tableTop;
    }
    generateTableLegs(parameters) {
        const legs = [];
        const culturalProps = this.getCulturalProportions(parameters.culture);
        const legHeight = parameters.height - culturalProps.surfaceThickness;
        const legThickness = culturalProps.legThickness;
        // Determine leg style and count based on culture and table type
        const legConfiguration = this.determineLegConfiguration(parameters);
        legConfiguration.positions.forEach((position, index) => {
            const legGeometry = this.createCulturalLegGeometry(parameters.culture, legThickness, legHeight, index, legConfiguration.style);
            const leg = new THREE.Mesh(legGeometry);
            leg.position.set(position.x, legHeight / 2, position.z);
            leg.castShadow = true;
            leg.userData.component = 'leg';
            legs.push(leg);
        });
        return legs;
    }
    generateSupports(parameters) {
        const supports = [];
        // Add support structures for larger tables
        if (parameters.width > 1.5 || parameters.depth > 1.0) {
            const supportHeight = 0.08;
            const supportThickness = 0.04;
            // Cross support
            const crossSupportGeometry = new THREE.BoxGeometry(parameters.width * 0.8, supportThickness, supportThickness);
            const crossSupport = new THREE.Mesh(crossSupportGeometry);
            crossSupport.position.y = parameters.height * 0.3;
            crossSupport.castShadow = true;
            crossSupport.userData.component = 'support';
            supports.push(crossSupport);
        }
        return supports;
    }
    addCulturalTableElements(parameters) {
        const culturalElements = [];
        switch (parameters.culture) {
            case 'japanese':
                if (parameters.culturalElements.includes('natural-grain')) {
                    culturalElements.push(...this.createGrainDetails(parameters));
                }
                break;
            case 'scandinavian':
                if (parameters.culturalElements.includes('clean-lines')) {
                    culturalElements.push(...this.createMinimalDetails(parameters));
                }
                break;
            case 'italian':
                if (parameters.culturalElements.includes('ornate-details')) {
                    culturalElements.push(...this.createLuxuryDetails(parameters));
                }
                break;
            case 'french':
                if (parameters.culturalElements.includes('refined-curves')) {
                    culturalElements.push(...this.createElegantDetails(parameters));
                }
                break;
        }
        return culturalElements;
    }
    // Cultural table top creation methods
    createJapaneseTableTop(width, depth, thickness) {
        // Create table top with traditional Japanese proportions and subtle details
        const geometry = new THREE.BoxGeometry(width, thickness, depth);
        // Add subtle beveling for traditional craftsmanship look
        return geometry;
    }
    createScandinavianTableTop(width, depth, thickness) {
        // Clean, functional design with rounded edges
        const shape = new THREE.Shape();
        const radius = 0.02;
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
        const extrudeSettings = {
            depth: thickness,
            bevelEnabled: false
        };
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }
    createItalianTableTop(width, depth, thickness) {
        // Elegant proportions with sophisticated edge treatment
        const geometry = new THREE.BoxGeometry(width, thickness, depth);
        return geometry;
    }
    createFrenchTableTop(width, depth, thickness) {
        // Graceful, refined design with gentle curves
        const geometry = new THREE.BoxGeometry(width, thickness, depth);
        return geometry;
    }
    createModernTableTop(width, depth, thickness) {
        // Clean, geometric form
        const geometry = new THREE.BoxGeometry(width, thickness, depth);
        return geometry;
    }
    determineLegConfiguration(parameters) {
        switch (parameters.culture) {
            case 'japanese':
                if (parameters.type === 'coffee-table') {
                    return {
                        style: 'tapered',
                        count: 4,
                        positions: this.calculateFourLegPositions(parameters)
                    };
                }
                else {
                    return {
                        style: 'straight',
                        count: 4,
                        positions: this.calculateFourLegPositions(parameters)
                    };
                }
            case 'scandinavian':
                return {
                    style: 'cylindrical',
                    count: 4,
                    positions: this.calculateFourLegPositions(parameters)
                };
            case 'italian':
                if (parameters.style === 'elegant' && parameters.width > 1.5) {
                    return {
                        style: 'pedestal',
                        count: 1,
                        positions: [{ x: 0, z: 0 }]
                    };
                }
                else {
                    return {
                        style: 'turned',
                        count: 4,
                        positions: this.calculateFourLegPositions(parameters)
                    };
                }
            case 'french':
                return {
                    style: 'turned',
                    count: 4,
                    positions: this.calculateFourLegPositions(parameters)
                };
            case 'modern':
                return {
                    style: 'straight',
                    count: 4,
                    positions: this.calculateFourLegPositions(parameters)
                };
            default:
                return {
                    style: 'straight',
                    count: 4,
                    positions: this.calculateFourLegPositions(parameters)
                };
        }
    }
    createCulturalLegGeometry(culture, thickness, height, index, style) {
        switch (style) {
            case 'tapered':
                return new THREE.CylinderGeometry(thickness / 3, // bottom (smaller)
                thickness / 2, // top (larger)
                height, 8);
            case 'cylindrical':
                return new THREE.CylinderGeometry(thickness / 2, thickness / 2, height, 12);
            case 'turned':
                return this.createTurnedLegGeometry(thickness, height);
            case 'pedestal':
                return this.createPedestalGeometry(thickness, height);
            case 'straight':
            default:
                return new THREE.BoxGeometry(thickness, height, thickness);
        }
    }
    createTurnedLegGeometry(thickness, height) {
        // Create a turned leg with decorative elements
        const segments = 16;
        const geometry = new THREE.CylinderGeometry(thickness / 2, thickness / 2, height, segments);
        // Add decorative rings (simplified)
        return geometry;
    }
    createPedestalGeometry(thickness, height) {
        // Create a substantial pedestal base
        const baseRadius = thickness * 2;
        const topRadius = thickness / 2;
        return new THREE.CylinderGeometry(topRadius, baseRadius, height, 16);
    }
    calculateFourLegPositions(parameters) {
        const inset = 0.1; // 10cm inset from edges
        const halfWidth = (parameters.width / 2) - inset;
        const halfDepth = (parameters.depth / 2) - inset;
        return [
            { x: -halfWidth, z: -halfDepth },
            { x: halfWidth, z: -halfDepth },
            { x: -halfWidth, z: halfDepth },
            { x: halfWidth, z: halfDepth }
        ];
    }
    // Cultural detail creators
    createGrainDetails(parameters) {
        const details = [];
        // Create subtle wood grain texture elements
        const grainGeometry = new THREE.PlaneGeometry(parameters.width * 0.8, parameters.depth * 0.8);
        const grainMaterial = new THREE.MeshStandardMaterial({
            color: '#8B4513',
            transparent: true,
            opacity: 0.1
        });
        const grainDetail = new THREE.Mesh(grainGeometry, grainMaterial);
        grainDetail.rotation.x = -Math.PI / 2;
        grainDetail.position.y = parameters.height + 0.001;
        grainDetail.userData.component = 'grain-detail';
        details.push(grainDetail);
        return details;
    }
    createMinimalDetails(parameters) {
        const details = [];
        // Create clean, minimal edge details
        const edgeGeometry = new THREE.BoxGeometry(parameters.width, 0.005, 0.01);
        const edgeMaterial = new THREE.MeshStandardMaterial({ color: '#F5F5DC' });
        const edgeDetail = new THREE.Mesh(edgeGeometry, edgeMaterial);
        edgeDetail.position.y = parameters.height;
        edgeDetail.position.z = parameters.depth / 2;
        edgeDetail.userData.component = 'edge-detail';
        details.push(edgeDetail);
        return details;
    }
    createLuxuryDetails(parameters) {
        const details = [];
        // Create ornate corner details
        const cornerGeometry = new THREE.SphereGeometry(0.03, 8, 8);
        const cornerMaterial = new THREE.MeshStandardMaterial({
            color: '#DAA520',
            metalness: 0.3,
            roughness: 0.2
        });
        const corners = this.calculateFourLegPositions(parameters);
        corners.forEach(corner => {
            const cornerDetail = new THREE.Mesh(cornerGeometry, cornerMaterial);
            cornerDetail.position.set(corner.x, parameters.height + 0.01, corner.z);
            cornerDetail.userData.component = 'luxury-detail';
            details.push(cornerDetail);
        });
        return details;
    }
    createElegantDetails(parameters) {
        const details = [];
        // Create subtle curved edge molding
        const moldingGeometry = new THREE.BoxGeometry(parameters.width, 0.01, 0.02);
        const moldingMaterial = new THREE.MeshStandardMaterial({ color: '#F0E68C' });
        const molding = new THREE.Mesh(moldingGeometry, moldingMaterial);
        molding.position.y = parameters.height;
        molding.position.z = parameters.depth / 2;
        molding.userData.component = 'elegant-detail';
        details.push(molding);
        return details;
    }
    // Template interface methods
    generateMetadata(parameters) {
        const culturalProfile = this.culturalDB.getCulturalProfile(parameters.culture);
        const culturalName = culturalProfile?.name || parameters.culture;
        const tableType = this.getTableTypeName(parameters.type);
        return {
            id: `table-${parameters.culture}-${parameters.type}-${Date.now()}`,
            name: `${culturalName} ${tableType}`,
            description: `Authentic ${culturalName} ${tableType} with ${parameters.style} styling and ${parameters.craftsmanshipLevel} craftsmanship`,
            culturalSignificance: this.getCulturalSignificance(parameters.culture, parameters.type),
            usageGuidelines: this.getUsageGuidelines(parameters),
            maintenanceInstructions: this.getMaintenanceInstructions(parameters),
            estimatedCost: this.estimateCost(parameters)
        };
    }
    getCulturalProportions(culture) {
        return this.culturalDB.getCulturalProportions(culture, 'dining-table');
    }
    validateParameters(parameters) {
        const minWidth = parameters.type === 'coffee-table' ? 0.6 : 1.0;
        const maxWidth = parameters.type === 'side-table' ? 0.8 : 3.0;
        const minHeight = parameters.type === 'coffee-table' ? 0.35 : 0.65;
        const maxHeight = parameters.type === 'coffee-table' ? 0.50 : 0.85;
        return parameters.width >= minWidth && parameters.width <= maxWidth &&
            parameters.height >= minHeight && parameters.height <= maxHeight &&
            parameters.depth >= 0.5 && parameters.depth <= 2.0;
    }
    getTableTypeName(type) {
        const typeNames = {
            'dining-table': 'Dining Table',
            'coffee-table': 'Coffee Table',
            'side-table': 'Side Table'
        };
        return typeNames[type] || 'Table';
    }
    getCulturalSignificance(culture, type) {
        const baseSignificance = {
            'japanese': 'Central to Japanese dining culture, promoting mindful eating and family gathering',
            'scandinavian': 'Embodies hygge lifestyle, encouraging togetherness and comfort',
            'italian': 'Reflects Italian emphasis on family meals and social gathering',
            'french': 'Represents French culinary tradition and elegant entertaining',
            'modern': 'Symbolizes contemporary living and functional design'
        };
        let significance = baseSignificance[culture] || 'Represents cultural dining traditions';
        if (type === 'coffee-table') {
            significance += ', serving as a focal point for casual social interaction';
        }
        else if (type === 'side-table') {
            significance += ', providing functional support for daily activities';
        }
        return significance;
    }
    getUsageGuidelines(parameters) {
        const guidelines = [
            'Suitable for indoor use in controlled environments',
            `Designed for ${parameters.formality} occasions`,
            'Use appropriate table linens and protection for surface',
            'Maintain proper clearance around table for comfortable seating'
        ];
        if (parameters.type === 'dining-table') {
            guidelines.push('Allow 60cm per person for comfortable dining');
        }
        if (parameters.capacity) {
            guidelines.push(`Comfortably seats ${parameters.capacity} people`);
        }
        return guidelines;
    }
    getMaintenanceInstructions(parameters) {
        const instructions = [
            'Clean spills immediately to prevent staining',
            'Use coasters and placemats to protect surface',
            'Dust regularly with soft, dry cloth',
            'Avoid direct sunlight and extreme temperatures'
        ];
        if (parameters.primaryMaterial.startsWith('wood')) {
            instructions.push('Apply wood conditioner and polish quarterly');
            instructions.push('Sand lightly and refinish annually for heavy use');
        }
        if (parameters.primaryMaterial === 'glass') {
            instructions.push('Clean with glass cleaner and soft cloth');
        }
        return instructions;
    }
    estimateCost(parameters) {
        let baseCost = 300; // Base cost for dining table
        // Adjust for table type
        if (parameters.type === 'coffee-table') {
            baseCost = 200;
        }
        else if (parameters.type === 'side-table') {
            baseCost = 150;
        }
        // Size multiplier
        const sizeMultiplier = (parameters.width * parameters.depth) / 1.5; // Normalized to 1.5m²
        baseCost *= sizeMultiplier;
        // Material cost multipliers
        const materialMultipliers = {
            'wood-bamboo': 1.2,
            'wood-cherry': 1.8,
            'wood-oak': 1.5,
            'wood-pine': 1.0,
            'wood-walnut': 1.6,
            'glass': 1.4,
            'stone': 2.0
        };
        baseCost *= materialMultipliers[parameters.primaryMaterial] || 1.0;
        // Craftsmanship multipliers
        const craftsmanshipMultipliers = {
            'simple': 1.0,
            'refined': 1.5,
            'masterwork': 2.5
        };
        baseCost *= craftsmanshipMultipliers[parameters.craftsmanshipLevel] || 1.0;
        // Cultural complexity multipliers
        const culturalMultipliers = {
            'japanese': 1.4,
            'italian': 1.5,
            'french': 1.3,
            'scandinavian': 1.2,
            'modern': 1.0
        };
        baseCost *= culturalMultipliers[parameters.culture] || 1.0;
        return Math.round(baseCost);
    }
}
//# sourceMappingURL=TableTemplate.js.map