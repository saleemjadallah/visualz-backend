import * as THREE from 'three';
import { CulturalKnowledgeBase } from '../../cultural/CulturalKnowledgeBase.js';
export class ChairTemplate {
    constructor() {
        this.culturalDB = new CulturalKnowledgeBase();
    }
    generateGeometry(parameters) {
        const chair = new THREE.Group();
        chair.name = 'ParametricChair';
        // Generate components based on cultural and functional parameters
        const seat = this.generateSeat(parameters);
        const backrest = this.generateBackrest(parameters);
        const legs = this.generateLegs(parameters);
        const armrests = this.generateArmrests(parameters);
        // Add cultural details
        const culturalDetails = this.addCulturalElements(parameters);
        // Assemble chair
        chair.add(seat, backrest, ...legs);
        // Add armrests for appropriate styles
        if (parameters.style !== 'minimalist' && parameters.formality !== 'casual') {
            chair.add(...armrests);
        }
        // Add cultural details
        if (culturalDetails.length > 0) {
            chair.add(...culturalDetails);
        }
        // Add metadata
        chair.userData = this.generateMetadata(parameters);
        return chair;
    }
    generateSeat(parameters) {
        const culturalProps = this.getCulturalProportions(parameters.culture);
        // Calculate seat dimensions based on culture and ergonomics
        const seatWidth = this.calculateSeatWidth(parameters);
        const seatDepth = this.calculateSeatDepth(parameters);
        const seatHeight = culturalProps.seatHeight;
        const seatThickness = this.calculateSeatThickness(parameters);
        // Create seat geometry based on cultural style
        let seatGeometry;
        switch (parameters.culture) {
            case 'japanese':
                seatGeometry = this.createJapaneseSeatGeometry(seatWidth, seatDepth, seatThickness);
                break;
            case 'scandinavian':
                seatGeometry = this.createScandinavianSeatGeometry(seatWidth, seatDepth, seatThickness);
                break;
            case 'italian':
                seatGeometry = this.createItalianSeatGeometry(seatWidth, seatDepth, seatThickness);
                break;
            case 'french':
                seatGeometry = this.createFrenchSeatGeometry(seatWidth, seatDepth, seatThickness);
                break;
            case 'modern':
                seatGeometry = this.createModernSeatGeometry(seatWidth, seatDepth, seatThickness);
                break;
            default:
                seatGeometry = new THREE.BoxGeometry(seatWidth, seatThickness, seatDepth);
        }
        const seat = new THREE.Mesh(seatGeometry);
        seat.position.y = seatHeight;
        seat.castShadow = true;
        seat.receiveShadow = true;
        seat.userData.component = 'seat';
        return seat;
    }
    generateBackrest(parameters) {
        const culturalProps = this.getCulturalProportions(parameters.culture);
        const seatHeight = culturalProps.seatHeight;
        // Calculate backrest dimensions
        const backrestWidth = this.calculateSeatWidth(parameters) * 0.9;
        const backrestHeight = this.calculateBackrestHeight(parameters);
        const backrestThickness = 0.03;
        const backrestAngle = culturalProps.backrestAngle;
        // Create culturally appropriate backrest
        let backrestGeometry;
        switch (parameters.culture) {
            case 'japanese':
                backrestGeometry = this.createJapaneseBackrestGeometry(backrestWidth, backrestHeight, backrestThickness, parameters);
                break;
            case 'scandinavian':
                backrestGeometry = this.createScandinavianBackrestGeometry(backrestWidth, backrestHeight, backrestThickness, parameters);
                break;
            case 'italian':
                backrestGeometry = this.createItalianBackrestGeometry(backrestWidth, backrestHeight, backrestThickness, parameters);
                break;
            case 'french':
                backrestGeometry = this.createFrenchBackrestGeometry(backrestWidth, backrestHeight, backrestThickness, parameters);
                break;
            case 'modern':
                backrestGeometry = this.createModernBackrestGeometry(backrestWidth, backrestHeight, backrestThickness, parameters);
                break;
            default:
                backrestGeometry = new THREE.BoxGeometry(backrestWidth, backrestHeight, backrestThickness);
        }
        const backrest = new THREE.Mesh(backrestGeometry);
        // Position backrest
        backrest.position.y = seatHeight + (backrestHeight / 2);
        backrest.position.z = -this.calculateSeatDepth(parameters) / 2;
        // Apply cultural angle
        backrest.rotation.x = THREE.MathUtils.degToRad(-backrestAngle);
        backrest.castShadow = true;
        backrest.receiveShadow = true;
        backrest.userData.component = 'backrest';
        return backrest;
    }
    generateLegs(parameters) {
        const legs = [];
        const culturalProps = this.getCulturalProportions(parameters.culture);
        const legHeight = culturalProps.seatHeight;
        const legThickness = culturalProps.legThickness;
        const seatWidth = this.calculateSeatWidth(parameters);
        const seatDepth = this.calculateSeatDepth(parameters);
        // Create culturally appropriate leg geometry
        let legGeometry;
        switch (parameters.culture) {
            case 'japanese':
                legGeometry = this.createJapaneseLegGeometry(legThickness, legHeight);
                break;
            case 'scandinavian':
                legGeometry = new THREE.CylinderGeometry(legThickness / 2, legThickness / 2, legHeight, 8);
                break;
            case 'italian':
                legGeometry = this.createItalianLegGeometry(legThickness, legHeight);
                break;
            case 'french':
                legGeometry = this.createFrenchLegGeometry(legThickness, legHeight);
                break;
            case 'modern':
                legGeometry = new THREE.BoxGeometry(legThickness, legHeight, legThickness);
                break;
            default:
                legGeometry = new THREE.BoxGeometry(legThickness, legHeight, legThickness);
        }
        // Position legs based on cultural conventions
        const legPositions = this.calculateLegPositions(parameters, seatWidth, seatDepth);
        legPositions.forEach(position => {
            const leg = new THREE.Mesh(legGeometry.clone());
            leg.position.set(position.x, legHeight / 2, position.z);
            leg.castShadow = true;
            leg.userData.component = 'leg';
            legs.push(leg);
        });
        return legs;
    }
    generateArmrests(parameters) {
        const armrests = [];
        const culturalProps = this.getCulturalProportions(parameters.culture);
        const armrestHeight = culturalProps.armrestHeight;
        const armrestWidth = 0.08;
        const armrestLength = this.calculateSeatDepth(parameters) * 0.8;
        const seatWidth = this.calculateSeatWidth(parameters);
        // Create armrest geometry
        const armrestGeometry = new THREE.BoxGeometry(armrestWidth, 0.04, armrestLength);
        // Left armrest
        const leftArmrest = new THREE.Mesh(armrestGeometry);
        leftArmrest.position.set(-(seatWidth / 2 + armrestWidth / 2), armrestHeight, 0);
        leftArmrest.castShadow = true;
        leftArmrest.userData.component = 'armrest';
        armrests.push(leftArmrest);
        // Right armrest
        const rightArmrest = new THREE.Mesh(armrestGeometry);
        rightArmrest.position.set(seatWidth / 2 + armrestWidth / 2, armrestHeight, 0);
        rightArmrest.castShadow = true;
        rightArmrest.userData.component = 'armrest';
        armrests.push(rightArmrest);
        return armrests;
    }
    addCulturalElements(parameters) {
        const culturalElements = [];
        switch (parameters.culture) {
            case 'japanese':
                if (parameters.culturalElements.includes('bamboo-accents')) {
                    culturalElements.push(...this.createBambooAccents(parameters));
                }
                if (parameters.culturalElements.includes('natural-joinery')) {
                    culturalElements.push(...this.createJoineryDetails(parameters));
                }
                break;
            case 'scandinavian':
                if (parameters.culturalElements.includes('cozy-textures')) {
                    culturalElements.push(...this.createTextureElements(parameters));
                }
                break;
            case 'italian':
                if (parameters.culturalElements.includes('ornate-details')) {
                    culturalElements.push(...this.createOrnateDetails(parameters));
                }
                break;
            case 'french':
                // Add French savoir-vivre details
                if (parameters.culturalElements.includes('refined-curves')) {
                    culturalElements.push(...this.createElegantDetails(parameters));
                }
                if (parameters.culturalElements.includes('upholstered-elegance')) {
                    culturalElements.push(...this.createUpholsteryAccents(parameters));
                }
                if (parameters.culturalElements.includes('bronze-hardware')) {
                    culturalElements.push(...this.createBronzeAccents(parameters));
                }
                if (parameters.culturalElements.includes('louis-xvi-influences')) {
                    culturalElements.push(...this.createLouisXVIDetails(parameters));
                }
                break;
        }
        return culturalElements;
    }
    // Cultural-specific geometry creation methods
    createJapaneseSeatGeometry(width, depth, thickness) {
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
            bevelEnabled: true,
            bevelThickness: 0.005,
            bevelSize: 0.005,
            bevelSegments: 3
        };
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }
    createScandinavianSeatGeometry(width, depth, thickness) {
        // Simple box with rounded edges for Scandinavian comfort
        const geometry = new THREE.BoxGeometry(width, thickness, depth);
        return geometry;
    }
    createItalianSeatGeometry(width, depth, thickness) {
        // Slightly curved seat for Italian elegance
        const geometry = new THREE.BoxGeometry(width, thickness, depth);
        return geometry;
    }
    createFrenchSeatGeometry(width, depth, thickness) {
        // French savoir-vivre seat with gentle curves for comfort during long conversations
        const shape = new THREE.Shape();
        const radius = 0.03; // Gentle rounding for comfort
        // Create sophisticated curved seat reflecting French bergère tradition
        shape.moveTo(-width / 2 + radius, -depth / 2);
        shape.lineTo(width / 2 - radius, -depth / 2);
        shape.quadraticCurveTo(width / 2, -depth / 2, width / 2, -depth / 2 + radius);
        shape.lineTo(width / 2, depth / 2 - radius);
        shape.quadraticCurveTo(width / 2, depth / 2, width / 2 - radius, depth / 2);
        shape.lineTo(-width / 2 + radius, depth / 2);
        shape.quadraticCurveTo(-width / 2, depth / 2, -width / 2, depth / 2 - radius);
        shape.lineTo(-width / 2, -depth / 2 + radius);
        shape.quadraticCurveTo(-width / 2, -depth / 2, -width / 2 + radius, -depth / 2);
        // Add subtle curvature for comfort during salon gatherings
        const extrudeSettings = {
            depth: thickness,
            bevelEnabled: true,
            bevelThickness: 0.008, // Refined edge treatment
            bevelSize: 0.008,
            bevelSegments: 4
        };
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }
    createModernSeatGeometry(width, depth, thickness) {
        // Clean, geometric form for modern style
        const geometry = new THREE.BoxGeometry(width, thickness, depth);
        return geometry;
    }
    createJapaneseBackrestGeometry(width, height, thickness, parameters) {
        // Slightly curved backrest with traditional proportions
        const geometry = new THREE.BoxGeometry(width, height, thickness);
        return geometry;
    }
    createScandinavianBackrestGeometry(width, height, thickness, parameters) {
        // Comfortable, ergonomic backrest
        const geometry = new THREE.BoxGeometry(width, height, thickness);
        return geometry;
    }
    createItalianBackrestGeometry(width, height, thickness, parameters) {
        // Elegant, refined backrest
        const geometry = new THREE.BoxGeometry(width, height, thickness);
        return geometry;
    }
    createFrenchBackrestGeometry(width, height, thickness, parameters) {
        // French savoir-vivre backrest designed for elegant posture during conversation
        const shape = new THREE.Shape();
        const topRadius = 0.04; // Gentle curve at top for shoulder comfort
        const sideRadius = 0.02; // Side rounding for arm comfort
        // Create ergonomic backrest following Louis XVI proportions
        shape.moveTo(-width / 2 + sideRadius, -height / 2);
        shape.lineTo(width / 2 - sideRadius, -height / 2);
        shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + sideRadius);
        shape.lineTo(width / 2, height / 2 - topRadius);
        // Gentle curve at top for comfort during long salon conversations
        shape.quadraticCurveTo(width / 2, height / 2, width / 2 - topRadius, height / 2);
        shape.lineTo(-width / 2 + topRadius, height / 2);
        shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - topRadius);
        shape.lineTo(-width / 2, -height / 2 + sideRadius);
        shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + sideRadius, -height / 2);
        const extrudeSettings = {
            depth: thickness,
            bevelEnabled: true,
            bevelThickness: 0.006,
            bevelSize: 0.006,
            bevelSegments: 3
        };
        // Add subtle lumbar support curve for French posture ideals
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        // Apply gentle backward curve for conversation comfort
        if (parameters.formality === 'formal' || parameters.formality === 'ceremonial') {
            // More pronounced curve for formal occasions requiring proper posture
            const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, -height / 2, 0), new THREE.Vector3(0, 0, thickness * 0.3), new THREE.Vector3(0, height / 2, thickness * 0.1));
        }
        return geometry;
    }
    createModernBackrestGeometry(width, height, thickness, parameters) {
        // Clean, minimal backrest
        const geometry = new THREE.BoxGeometry(width, height, thickness);
        return geometry;
    }
    createJapaneseLegGeometry(thickness, height) {
        // Create tapered leg typical of Japanese furniture
        const topRadius = thickness / 2;
        const bottomRadius = thickness / 3;
        return new THREE.CylinderGeometry(bottomRadius, topRadius, height, 8);
    }
    createItalianLegGeometry(thickness, height) {
        // Ornate, turned leg for Italian style
        const topRadius = thickness / 2;
        const bottomRadius = thickness / 2;
        return new THREE.CylinderGeometry(bottomRadius, topRadius, height, 12);
    }
    createFrenchLegGeometry(thickness, height) {
        // Cabriole leg style embodying French savoir-vivre elegance
        const topRadius = thickness / 2;
        const bottomRadius = thickness / 2.2; // Gentle taper reflecting Louis XVI refinement
        const segments = 12; // Smoother curves for sophisticated appearance
        // Create cabriole-inspired leg with subtle S-curve
        const geometry = new THREE.CylinderGeometry(bottomRadius, topRadius, height, segments);
        // Add subtle decorative rings typical of French furniture
        const positions = geometry.attributes.position;
        if (positions) {
            for (let i = 0; i < positions.count; i++) {
                const y = positions.getY(i);
                const heightRatio = (y + height / 2) / height;
                // Add subtle bulge at 1/3 height (cabriole characteristic)
                if (heightRatio > 0.2 && heightRatio < 0.4) {
                    const x = positions.getX(i);
                    const z = positions.getZ(i);
                    const radius = Math.sqrt(x * x + z * z);
                    const newRadius = radius * 1.08; // 8% bulge for cabriole effect
                    positions.setX(i, x * (newRadius / radius));
                    positions.setZ(i, z * (newRadius / radius));
                }
                // Slight taper at foot for elegance
                if (heightRatio < 0.1) {
                    const x = positions.getX(i);
                    const z = positions.getZ(i);
                    const radius = Math.sqrt(x * x + z * z);
                    const newRadius = radius * 0.95; // Elegant foot taper
                    positions.setX(i, x * (newRadius / radius));
                    positions.setZ(i, z * (newRadius / radius));
                }
            }
            positions.needsUpdate = true;
        }
        return geometry;
    }
    // Cultural element creators
    createBambooAccents(parameters) {
        const accents = [];
        // Create bamboo-style vertical elements
        const bambooGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.1, 8);
        const bambooMaterial = new THREE.MeshStandardMaterial({ color: '#8B7355' });
        const bambooAccent = new THREE.Mesh(bambooGeometry, bambooMaterial);
        bambooAccent.position.set(0, 0.3, -0.25);
        bambooAccent.userData.component = 'cultural-accent';
        accents.push(bambooAccent);
        return accents;
    }
    createJoineryDetails(parameters) {
        const details = [];
        // Create visible joinery elements
        const jointGeometry = new THREE.BoxGeometry(0.02, 0.02, 0.02);
        const jointMaterial = new THREE.MeshStandardMaterial({ color: '#654321' });
        const joint = new THREE.Mesh(jointGeometry, jointMaterial);
        joint.position.set(0.2, 0.4, -0.2);
        joint.userData.component = 'joinery-detail';
        details.push(joint);
        return details;
    }
    createTextureElements(parameters) {
        const elements = [];
        // Create textured cushion or fabric element
        const cushionGeometry = new THREE.BoxGeometry(0.4, 0.05, 0.4);
        const cushionMaterial = new THREE.MeshStandardMaterial({
            color: '#E6E6FA',
            roughness: 0.8
        });
        const cushion = new THREE.Mesh(cushionGeometry, cushionMaterial);
        cushion.position.set(0, 0.43, 0);
        cushion.userData.component = 'texture-element';
        elements.push(cushion);
        return elements;
    }
    createOrnateDetails(parameters) {
        const details = [];
        // Create ornate decorative element
        const ornamentGeometry = new THREE.SphereGeometry(0.02, 8, 8);
        const ornamentMaterial = new THREE.MeshStandardMaterial({
            color: '#DAA520',
            metalness: 0.3
        });
        const ornament = new THREE.Mesh(ornamentGeometry, ornamentMaterial);
        ornament.position.set(0, 0.6, -0.23);
        ornament.userData.component = 'ornate-detail';
        details.push(ornament);
        return details;
    }
    // French savoir-vivre cultural element creators
    createElegantDetails(parameters) {
        const details = [];
        // Create refined molding detail along chair back
        const moldingGeometry = new THREE.BoxGeometry(0.02, 0.3, 0.01);
        const moldingMaterial = new THREE.MeshStandardMaterial({
            color: '#CD853F',
            roughness: 0.3,
            metalness: 0.1
        });
        const molding = new THREE.Mesh(moldingGeometry, moldingMaterial);
        molding.position.set(0, 0.5, -0.24);
        molding.userData.component = 'elegant-detail';
        details.push(molding);
        return details;
    }
    createUpholsteryAccents(parameters) {
        const accents = [];
        // Create button tufting detail
        const buttonGeometry = new THREE.SphereGeometry(0.01, 8, 8);
        const buttonMaterial = new THREE.MeshStandardMaterial({
            color: parameters.colorPalette[1] || '#E6E6FA',
            roughness: 0.8
        });
        // Add buttons in classic French pattern
        const buttonPositions = [
            { x: -0.08, y: 0.5, z: -0.23 },
            { x: 0.08, y: 0.5, z: -0.23 },
            { x: 0, y: 0.4, z: -0.23 }
        ];
        buttonPositions.forEach(pos => {
            const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
            button.position.set(pos.x, pos.y, pos.z);
            button.userData.component = 'upholstery-accent';
            accents.push(button);
        });
        return accents;
    }
    createBronzeAccents(parameters) {
        const accents = [];
        // Create bronze nail heads typical of French upholstery
        const nailGeometry = new THREE.CylinderGeometry(0.008, 0.008, 0.005, 8);
        const bronzeMaterial = new THREE.MeshStandardMaterial({
            color: '#CD7F32',
            metalness: 0.7,
            roughness: 0.3
        });
        // Add nail pattern around seat edge
        const nailCount = 12;
        for (let i = 0; i < nailCount; i++) {
            const angle = (i / nailCount) * Math.PI * 2;
            const radius = 0.22;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const nail = new THREE.Mesh(nailGeometry, bronzeMaterial);
            nail.position.set(x, 0.42, z);
            nail.userData.component = 'bronze-accent';
            accents.push(nail);
        }
        return accents;
    }
    createLouisXVIDetails(parameters) {
        const details = [];
        // Create neoclassical medallion detail
        const medallionGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.008, 16);
        const medallionMaterial = new THREE.MeshStandardMaterial({
            color: '#F0E68C',
            roughness: 0.2,
            metalness: 0.2
        });
        const medallion = new THREE.Mesh(medallionGeometry, medallionMaterial);
        medallion.position.set(0, 0.55, -0.24);
        medallion.rotation.x = Math.PI / 2;
        medallion.userData.component = 'louis-xvi-detail';
        details.push(medallion);
        // Add fluted leg details
        if (parameters.craftsmanshipLevel === 'masterwork') {
            const fluteGeometry = new THREE.BoxGeometry(0.005, 0.2, 0.005);
            const fluteMaterial = new THREE.MeshStandardMaterial({
                color: '#D2B48C',
                roughness: 0.4
            });
            // Add vertical flutes to front legs
            for (let i = 0; i < 3; i++) {
                const flute = new THREE.Mesh(fluteGeometry, fluteMaterial);
                const angleOffset = (i - 1) * 0.02;
                flute.position.set(0.2 + angleOffset, 0.3, 0.2);
                flute.userData.component = 'flute-detail';
                details.push(flute);
            }
        }
        return details;
    }
    // Helper calculation methods
    calculateSeatWidth(parameters) {
        const baseWidth = parameters.width;
        const ergonomicMultiplier = this.getErgonomicMultiplier(parameters.ergonomicProfile);
        return baseWidth * ergonomicMultiplier;
    }
    calculateSeatDepth(parameters) {
        const baseDepth = parameters.depth;
        const ergonomicMultiplier = this.getErgonomicMultiplier(parameters.ergonomicProfile);
        return baseDepth * ergonomicMultiplier;
    }
    calculateSeatThickness(parameters) {
        const baseThickness = 0.05;
        const comfortMultiplier = parameters.formality === 'casual' ? 1.2 : 1.0;
        return baseThickness * comfortMultiplier;
    }
    calculateBackrestHeight(parameters) {
        const baseHeight = 0.35;
        const formalityMultiplier = {
            'casual': 0.8,
            'semi-formal': 1.0,
            'formal': 1.2,
            'ceremonial': 1.4
        };
        return baseHeight * (formalityMultiplier[parameters.formality] || 1.0);
    }
    getErgonomicMultiplier(profile) {
        const multipliers = {
            'petite': 0.9,
            'average': 1.0,
            'tall': 1.1,
            'accessible': 1.2
        };
        return multipliers[profile] || 1.0;
    }
    calculateLegPositions(parameters, seatWidth, seatDepth) {
        const inset = 0.05;
        const halfWidth = (seatWidth / 2) - inset;
        const halfDepth = (seatDepth / 2) - inset;
        return [
            { x: -halfWidth, z: -halfDepth },
            { x: halfWidth, z: -halfDepth },
            { x: -halfWidth, z: halfDepth },
            { x: halfWidth, z: halfDepth }
        ];
    }
    // Template interface methods
    generateMetadata(parameters) {
        const culturalProfile = this.culturalDB.getCulturalProfile(parameters.culture);
        const culturalName = culturalProfile?.name || parameters.culture;
        return {
            id: `chair-${parameters.culture}-${Date.now()}`,
            name: `${culturalName} Chair`,
            description: `Authentic ${culturalName} chair with ${parameters.style} styling and ${parameters.craftsmanshipLevel} craftsmanship`,
            culturalSignificance: this.getCulturalSignificance(parameters.culture),
            usageGuidelines: this.getUsageGuidelines(parameters),
            maintenanceInstructions: this.getMaintenanceInstructions(parameters),
            estimatedCost: this.estimateCost(parameters)
        };
    }
    getCulturalProportions(culture) {
        return this.culturalDB.getCulturalProportions(culture, 'chair');
    }
    validateParameters(parameters) {
        return parameters.width > 0.3 && parameters.width < 1.0 &&
            parameters.height > 0.3 && parameters.height < 1.2 &&
            parameters.depth > 0.3 && parameters.depth < 1.0;
    }
    getCulturalSignificance(culture) {
        const significance = {
            'japanese': 'Represents harmony with nature and mindful living, embodying the principles of wabi-sabi',
            'scandinavian': 'Embodies hygge philosophy of comfort and well-being, prioritizing function and coziness',
            'italian': 'Reflects Renaissance ideals of beauty and craftsmanship, showcasing artistic excellence',
            'french': 'Embodies French savoir-vivre and art de vivre, reflecting centuries of refined taste, salon culture, and the tradition of creating spaces for intellectual exchange and gracious living. Represents the French mastery of combining comfort with elegance, promoting proper posture for long conversations while maintaining the understated luxury that defines bon goût.',
            'modern': 'Embodies form-follows-function philosophy and contemporary design principles'
        };
        return significance[culture] || 'Represents cultural design traditions and values';
    }
    getUsageGuidelines(parameters) {
        const guidelines = [
            'Suitable for indoor use in controlled environments',
            `Designed for ${parameters.formality} occasions`,
            `Accommodates ${parameters.ergonomicProfile} body types`,
            'Use appropriate cushioning for extended sitting'
        ];
        if (parameters.culture === 'japanese') {
            guidelines.push('Remove shoes before use in traditional settings');
        }
        else if (parameters.culture === 'french') {
            guidelines.push('Designed to promote proper posture for extended conversation and dining');
            guidelines.push('Positioned to encourage social interaction and intellectual exchange');
            guidelines.push('Maintains optimal distance for intimate yet respectful conversation');
            guidelines.push('Suitable for salon gatherings, formal dining, and ceremonial occasions');
            if (parameters.formality === 'formal' || parameters.formality === 'ceremonial') {
                guidelines.push('Supports traditional French dining etiquette and social customs');
            }
        }
        return guidelines;
    }
    getMaintenanceInstructions(parameters) {
        const instructions = [
            'Dust regularly with soft, dry cloth',
            'Avoid direct sunlight and extreme temperatures',
            'Clean spills immediately with appropriate cleaner'
        ];
        if (parameters.primaryMaterial.startsWith('wood')) {
            instructions.push('Apply wood conditioner quarterly');
        }
        if (parameters.primaryMaterial.startsWith('fabric')) {
            instructions.push('Vacuum upholstery regularly');
        }
        return instructions;
    }
    estimateCost(parameters) {
        let baseCost = 200; // Base cost in USD
        // Material cost multipliers
        const materialMultipliers = {
            'wood-bamboo': 1.2,
            'wood-cherry': 1.8,
            'wood-oak': 1.5,
            'wood-pine': 1.0,
            'wood-walnut': 2.0,
            'fabric-silk': 2.0,
            'fabric-linen': 1.3,
            'leather': 2.5
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
            'japanese': 1.3,
            'italian': 1.4,
            'french': 1.2,
            'scandinavian': 1.1,
            'modern': 1.0
        };
        baseCost *= culturalMultipliers[parameters.culture] || 1.0;
        return Math.round(baseCost);
    }
}
