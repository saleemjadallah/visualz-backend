export class CulturalKnowledgeBase {
    constructor() {
        this.cultures = new Map();
        this.initializeCulturalData();
    }
    initializeCulturalData() {
        // Japanese Cultural Profile
        this.cultures.set('japanese', {
            name: 'Japanese Traditional',
            proportions: {
                seatHeight: 0.40, // Lower seating for floor-oriented culture
                tableHeight: 0.72, // Standard Japanese table height
                armrestHeight: 0.65,
                backrestAngle: 15, // Slight backward lean
                legThickness: 0.06, // Slender, elegant legs
                surfaceThickness: 0.04
            },
            materials: {
                preferred: ['wood-oak', 'wood-cherry', 'wood-bamboo', 'fabric-cotton'],
                traditional: ['wood-bamboo', 'wood-cherry', 'fabric-cotton', 'wood-pine'],
                avoided: ['metal-steel', 'glass'],
                seasonalPreferences: {
                    spring: ['wood-cherry', 'fabric-silk'],
                    summer: ['wood-bamboo', 'fabric-linen'],
                    autumn: ['wood-oak', 'fabric-wool'],
                    winter: ['wood-pine', 'fabric-cotton']
                }
            },
            aesthetics: {
                colorPalette: ['#8B4513', '#D2691E', '#F5DEB3', '#FFFAF0'],
                decorativeElements: [
                    'sashimono-joinery', 'subtle-curves', 'natural-grain',
                    'minimal-hardware', 'paper-panels', 'bamboo-accents'
                ],
                surfaceFinishes: ['natural-oil', 'urushi-lacquer', 'hand-polished'],
                joiningMethods: ['mortise-tenon', 'dovetail', 'finger-joint'],
                symbolism: {
                    'circle': 'harmony and perfection',
                    'asymmetry': 'natural beauty',
                    'simplicity': 'inner peace'
                }
            },
            ergonomics: {
                floorSeating: true,
                formalPosture: true,
                groupOrientation: 'circular',
                personalSpace: 0.8 // meters
            }
        });
        // Scandinavian Cultural Profile
        this.cultures.set('scandinavian', {
            name: 'Scandinavian Hygge',
            proportions: {
                seatHeight: 0.45, // Standard comfortable height
                tableHeight: 0.75,
                armrestHeight: 0.68,
                backrestAngle: 20, // Comfortable lean for relaxation
                legThickness: 0.08, // Sturdy, substantial legs
                surfaceThickness: 0.05
            },
            materials: {
                preferred: ['wood-pine', 'wood-oak', 'fabric-wool', 'fabric-linen'],
                traditional: ['wood-pine', 'wood-oak', 'fabric-wool', 'leather'],
                avoided: ['metal-brass', 'metal-copper'],
                seasonalPreferences: {
                    spring: ['wood-oak', 'fabric-linen'],
                    summer: ['wood-pine', 'fabric-cotton'],
                    autumn: ['wood-oak', 'fabric-wool'],
                    winter: ['wood-oak', 'fabric-wool', 'leather']
                }
            },
            aesthetics: {
                colorPalette: ['#F5F5DC', '#E6E6FA', '#B0C4DE', '#FFFAF0'],
                decorativeElements: [
                    'clean-lines', 'rounded-edges', 'light-woods',
                    'cozy-textures', 'minimal-ornamentation', 'functional-beauty'
                ],
                surfaceFinishes: ['white-wash', 'natural-oil', 'matte-lacquer'],
                joiningMethods: ['simple-screws', 'dowel-joints', 'bracket-connections'],
                symbolism: {
                    'light': 'hope during dark winters',
                    'warmth': 'comfort and security',
                    'simplicity': 'honest living'
                }
            },
            ergonomics: {
                floorSeating: false,
                formalPosture: false,
                groupOrientation: 'clustered',
                personalSpace: 0.6
            }
        });
        // Italian Cultural Profile
        this.cultures.set('italian', {
            name: 'Italian Luxury',
            proportions: {
                seatHeight: 0.46, // Elegant standard height
                tableHeight: 0.76,
                armrestHeight: 0.70,
                backrestAngle: 18, // Refined posture
                legThickness: 0.10, // Substantial, ornate legs
                surfaceThickness: 0.06
            },
            materials: {
                preferred: ['wood-cherry', 'wood-oak', 'leather', 'fabric-silk'],
                traditional: ['wood-cherry', 'leather', 'fabric-silk', 'marble'],
                avoided: ['wood-pine', 'fabric-cotton'],
                seasonalPreferences: {
                    spring: ['wood-cherry', 'fabric-silk'],
                    summer: ['wood-oak', 'fabric-linen'],
                    autumn: ['wood-cherry', 'leather'],
                    winter: ['wood-oak', 'leather']
                }
            },
            aesthetics: {
                colorPalette: ['#8B4513', '#CD853F', '#DAA520', '#F5DEB3'],
                decorativeElements: [
                    'ornate-carvings', 'gold-accents', 'curved-lines',
                    'luxurious-textures', 'classical-proportions', 'detailed-inlays'
                ],
                surfaceFinishes: ['high-gloss', 'hand-rubbed', 'gilded-details'],
                joiningMethods: ['traditional-joinery', 'ornate-brackets', 'carved-connections'],
                symbolism: {
                    'gold': 'luxury and prestige',
                    'curves': 'elegance and flow',
                    'detail': 'craftsmanship and pride'
                }
            },
            ergonomics: {
                floorSeating: false,
                formalPosture: true,
                groupOrientation: 'linear',
                personalSpace: 0.7
            }
        });
        // French Cultural Profile - Enhanced with Savoir-Vivre
        this.cultures.set('french', {
            name: 'French Savoir-Vivre',
            proportions: {
                seatHeight: 0.44, // Refined height for proper posture and conversation
                tableHeight: 0.75, // Classic French dining height for proper etiquette
                armrestHeight: 0.68, // Elegant armrest positioning for relaxed conversation
                backrestAngle: 18, // Graceful lean promoting both comfort and good posture
                legThickness: 0.095, // Substantial yet elegant legs showing quality craftsmanship
                surfaceThickness: 0.055 // Refined thickness demonstrating quality without ostentation
            },
            materials: {
                preferred: ['wood-cherry', 'wood-walnut', 'fabric-silk', 'fabric-linen', 'fabric-velvet'],
                traditional: ['wood-cherry', 'wood-walnut', 'wood-mahogany', 'fabric-silk', 'fabric-velvet', 'fabric-brocade', 'leather-fine', 'bronze-patina'],
                avoided: ['metal-steel', 'wood-pine', 'plastic', 'synthetic-materials'],
                seasonalPreferences: {
                    spring: ['wood-cherry', 'fabric-silk', 'fabric-linen', 'pastel-upholstery'],
                    summer: ['wood-oak', 'fabric-linen', 'fabric-cotton', 'light-cane'],
                    autumn: ['wood-walnut', 'fabric-velvet', 'leather-cognac', 'rich-tapestry'],
                    winter: ['wood-mahogany', 'fabric-wool', 'leather-burgundy', 'heavy-brocade']
                }
            },
            aesthetics: {
                colorPalette: [
                    '#F5F5DC', // Beige - sophisticated neutrality
                    '#E6E6FA', // Lavender - French countryside elegance
                    '#DDA0DD', // Plum - refined richness
                    '#F0E68C', // Khaki - understated luxury
                    '#D2B48C', // Tan - warm sophistication
                    '#CD853F', // Peru - earthy elegance
                    '#B0E0E6', // Powder Blue - salon refinement
                    '#F5DEB3' // Wheat - natural French charm
                ],
                decorativeElements: [
                    // Louis XVI and Neoclassical influences
                    'cabriole-legs', 'bergère-styling', 'louis-xvi-influences', 'neoclassical-lines',
                    // Refined craftsmanship
                    'refined-curves', 'graceful-proportions', 'subtle-ornamentation', 'hand-carved-details',
                    // Textile and upholstery excellence
                    'upholstered-elegance', 'fabric-accents', 'contrasting-piping', 'button-tufting',
                    // Hardware and finishing
                    'bronze-hardware', 'gilt-accents', 'marquetry-details', 'veneer-artistry',
                    // Regional influences
                    'provençal-influences', 'parisian-sophistication', 'château-grandeur',
                    // Art movements
                    'art-nouveau-touches', 'rococo-elements', 'empire-influences'
                ],
                surfaceFinishes: [
                    'french-polish', 'hand-rubbed-finish', 'distressed-elegance',
                    'patina-bronze', 'gilt-highlights', 'shellac-traditional',
                    'wax-finish-authentic', 'vernis-martin'
                ],
                joiningMethods: [
                    'mortise-tenon-traditional', 'dowel-reinforced', 'dovetail-refined',
                    'traditional-upholstery', 'hand-stitched-seams', 'french-seam-construction',
                    'spring-suspension-traditional', 'horsehair-stuffing'
                ],
                symbolism: {
                    'curves': 'grace, femininity, and fluid movement of French design',
                    'refinement': 'culture, education, and sophisticated taste',
                    'subtlety': 'understated luxury and bon goût (good taste)',
                    'proportion': 'harmony and classical beauty principles',
                    'craftsmanship': 'respect for artisanal traditions and métiers d\'art',
                    'comfort': 'art de vivre (art of living) and well-being',
                    'conversation': 'salon culture and intellectual exchange',
                    'elegance': 'effortless sophistication and savoir-faire',
                    'quality': 'preference for enduring beauty over fleeting trends',
                    'intimacy': 'creating spaces for meaningful human connection'
                }
            },
            ergonomics: {
                floorSeating: false,
                formalPosture: true, // Promotes proper posture for long conversations and meals
                groupOrientation: 'conversational', // Arranged to facilitate dialogue and social interaction
                personalSpace: 0.65, // Intimate yet respectful distance reflecting French social customs
                // Enhanced French lifestyle considerations
                savoirVivre: {
                    conversationDistance: 0.8, // Optimal distance for intimate conversation without intrusion
                    diningEtiquette: true, // Supports proper French dining customs and rituals
                    entertainingStyle: 'salon-tradition', // Reflects French salon culture and reception traditions
                    seasonalAdaptation: true, // Furniture adapts to French seasonal living patterns
                    artDeVivre: true, // Embodies the French art of living well and appreciating beauty
                    hospitalityPrinciples: true, // Facilitates the French tradition of gracious hosting
                    intellectualExchange: true, // Supports environments for cultural and intellectual discourse
                    aestheticAppreciation: true, // Encourages appreciation of beauty and craftsmanship
                    socialHierarchy: 'subtle', // Reflects French social nuances without ostentation
                    intimacyLevels: ['formal-reception', 'salon-gathering', 'family-intimacy'],
                    ceremonialUse: ['dining-ritual', 'afternoon-tea', 'evening-conversation']
                }
            }
        });
        // Modern Cultural Profile
        this.cultures.set('modern', {
            name: 'Modern Contemporary',
            proportions: {
                seatHeight: 0.45,
                tableHeight: 0.75,
                armrestHeight: 0.68,
                backrestAngle: 15, // Minimal lean
                legThickness: 0.07,
                surfaceThickness: 0.04
            },
            materials: {
                preferred: ['metal-steel', 'glass', 'wood-oak', 'leather'],
                traditional: ['metal-steel', 'glass', 'leather', 'fabric-cotton'],
                avoided: ['wood-pine', 'fabric-wool'],
                seasonalPreferences: {
                    spring: ['metal-steel', 'glass'],
                    summer: ['metal-steel', 'fabric-cotton'],
                    autumn: ['wood-oak', 'leather'],
                    winter: ['wood-oak', 'leather']
                }
            },
            aesthetics: {
                colorPalette: ['#000000', '#FFFFFF', '#808080', '#C0C0C0'],
                decorativeElements: [
                    'clean-lines', 'geometric-forms', 'minimal-details',
                    'industrial-materials', 'functional-design', 'monochromatic'
                ],
                surfaceFinishes: ['powder-coated', 'brushed-metal', 'high-gloss'],
                joiningMethods: ['welded-joints', 'precision-fasteners', 'adhesive-bonds'],
                symbolism: {
                    'minimalism': 'clarity and focus',
                    'function': 'efficiency and purpose',
                    'geometry': 'order and precision'
                }
            },
            ergonomics: {
                floorSeating: false,
                formalPosture: false,
                groupOrientation: 'linear',
                personalSpace: 0.5
            }
        });
    }
    getCulturalProfile(culture) {
        return this.cultures.get(culture);
    }
    getCulturalProportions(culture, furnitureType) {
        const profile = this.getCulturalProfile(culture);
        if (!profile)
            throw new Error(`Unknown culture: ${culture}`);
        return this.adaptProportionsForFurnitureType(profile.proportions, furnitureType);
    }
    validateCulturalAuthenticity(parameters, result) {
        const profile = this.getCulturalProfile(parameters.culture);
        if (!profile)
            return { overall: 0, proportions: 0, materials: 0, construction: 0, aesthetics: 0, culturalElements: 0 };
        const proportionScore = this.scoreCulturalProportions(parameters, profile);
        const materialScore = this.scoreCulturalMaterials(parameters, profile);
        const aestheticScore = this.scoreCulturalAesthetics(parameters, profile);
        const elementScore = this.scoreCulturalElements(parameters, profile);
        const constructionScore = this.scoreCulturalConstruction(parameters, profile);
        const overall = (proportionScore + materialScore + aestheticScore + elementScore + constructionScore) / 5;
        return {
            overall,
            proportions: proportionScore,
            materials: materialScore,
            construction: constructionScore,
            aesthetics: aestheticScore,
            culturalElements: elementScore
        };
    }
    adaptProportionsForFurnitureType(baseProportions, furnitureType) {
        const adapted = { ...baseProportions };
        switch (furnitureType) {
            case 'coffee-table':
                adapted.tableHeight = baseProportions.tableHeight * 0.6; // Lower coffee table
                break;
            case 'side-table':
                adapted.tableHeight = baseProportions.tableHeight * 0.8; // Medium height
                break;
            case 'bench':
                adapted.seatHeight = baseProportions.seatHeight * 0.95; // Slightly lower
                break;
            default:
                break;
        }
        return adapted;
    }
    scoreCulturalProportions(parameters, profile) {
        const expectedProps = this.getCulturalProportions(parameters.culture, parameters.type);
        let score = 100;
        // Check height accuracy
        const heightDifference = Math.abs(parameters.height - expectedProps.tableHeight) / expectedProps.tableHeight;
        if (heightDifference > 0.1)
            score -= 20; // 10% tolerance
        // Check width/depth ratios
        const ratio = parameters.width / parameters.depth;
        if (ratio < 0.5 || ratio > 2.0)
            score -= 10; // Reasonable proportions
        return Math.max(0, Math.min(100, score));
    }
    scoreCulturalMaterials(parameters, profile) {
        let score = 0;
        // Primary material check
        if (profile.materials.preferred.includes(parameters.primaryMaterial)) {
            score += 50;
        }
        else if (profile.materials.traditional.includes(parameters.primaryMaterial)) {
            score += 40;
        }
        else if (profile.materials.avoided.includes(parameters.primaryMaterial)) {
            score -= 20;
        }
        else {
            score += 20; // Neutral material
        }
        // Secondary material check
        if (parameters.secondaryMaterial) {
            if (profile.materials.preferred.includes(parameters.secondaryMaterial)) {
                score += 25;
            }
            else if (profile.materials.traditional.includes(parameters.secondaryMaterial)) {
                score += 20;
            }
        }
        else {
            score += 25; // No secondary material is fine
        }
        return Math.max(0, Math.min(100, score));
    }
    scoreCulturalAesthetics(parameters, profile) {
        let score = 50; // Base score
        // Color palette alignment
        const colorMatch = parameters.colorPalette.some(color => profile.aesthetics.colorPalette.includes(color));
        if (colorMatch)
            score += 25;
        // Decorative intensity appropriateness
        const expectedIntensity = this.getExpectedDecorativeIntensity(parameters.culture, parameters.formality);
        const intensityDiff = Math.abs(parameters.decorativeIntensity - expectedIntensity);
        if (intensityDiff < 0.2)
            score += 25;
        return Math.max(0, Math.min(100, score));
    }
    scoreCulturalElements(parameters, profile) {
        let score = 0;
        const totalElements = parameters.culturalElements.length;
        if (totalElements === 0)
            return 30; // Minimal but acceptable
        const matchingElements = parameters.culturalElements.filter(element => profile.aesthetics.decorativeElements.includes(element));
        score = (matchingElements.length / totalElements) * 100;
        return Math.max(0, Math.min(100, score));
    }
    scoreCulturalConstruction(parameters, profile) {
        let score = 70; // Base score for basic construction
        // Craftsmanship level appropriateness
        if (parameters.craftsmanshipLevel === 'masterwork' && parameters.culture === 'japanese') {
            score += 30; // Japanese craftsmanship tradition
        }
        else if (parameters.craftsmanshipLevel === 'refined' && parameters.culture === 'french') {
            score += 25; // French refinement
        }
        else if (parameters.craftsmanshipLevel === 'simple' && parameters.culture === 'modern') {
            score += 20; // Modern simplicity
        }
        return Math.max(0, Math.min(100, score));
    }
    getExpectedDecorativeIntensity(culture, formality) {
        const baseIntensity = {
            'japanese': 0.3,
            'scandinavian': 0.2,
            'italian': 0.8,
            'french': 0.6,
            'modern': 0.1
        };
        const formalityMultiplier = {
            'casual': 0.8,
            'semi-formal': 1.0,
            'formal': 1.2,
            'ceremonial': 1.5
        };
        return Math.min(1.0, (baseIntensity[culture] || 0.5) * (formalityMultiplier[formality] || 1.0));
    }
    isMaterialCulturallyAppropriate(material, culture) {
        const profile = this.getCulturalProfile(culture);
        if (!profile)
            return true; // Default to appropriate if unknown culture
        return !profile.materials.avoided.includes(material);
    }
    getCulturalRecommendations(culture) {
        const profile = this.getCulturalProfile(culture);
        if (!profile)
            return [];
        return [
            `Use ${profile.materials.preferred.slice(0, 3).join(', ')} for authentic materials`,
            `Incorporate ${profile.aesthetics.decorativeElements.slice(0, 3).join(', ')} for cultural accuracy`,
            `Consider ${profile.aesthetics.symbolism ? Object.keys(profile.aesthetics.symbolism)[0] : 'traditional elements'} for deeper meaning`,
            `Apply ${profile.aesthetics.surfaceFinishes[0]} finish for authentic appearance`
        ];
    }
}
//# sourceMappingURL=CulturalKnowledgeBase.js.map