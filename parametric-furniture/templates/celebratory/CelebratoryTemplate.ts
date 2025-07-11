// Parametric Celebratory Props & Themed Decorations Template - Complete Implementation
import * as THREE from 'three';

export interface CelebratoryParameters {
  // Celebration foundation
  celebrationType: 'birthday-child' | 'birthday-teen' | 'birthday-adult' | 'baby-shower' | 'graduation' | 'anniversary' | 'quinceañera' | 'bar-bat-mitzvah' | 'cultural-milestone';
  ageGroup: 'toddler' | 'child' | 'teen' | 'young-adult' | 'adult' | 'senior' | 'multi-generational';
  theme: 'superhero' | 'princess' | 'sports' | 'nature' | 'space' | 'unicorn' | 'dinosaur' | 'elegant' | 'cultural-traditional' | 'custom';
  
  // Cultural integration
  culture: 'american' | 'mexican' | 'korean' | 'japanese' | 'jewish' | 'indian' | 'african' | 'latin' | 'mixed-heritage';
  culturalTraditions: string[];
  religiousConsiderations: string[];
  familyCustoms: string[];
  
  // Guest specifications
  guestCount: number;
  childrenCount: number;
  adultCount: number;
  specialNeeds: string[];
  
  // Event specifications
  duration: number; // Hours
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'all-day';
  seasonality: 'spring' | 'summer' | 'autumn' | 'winter' | 'year-round';
  
  // Space requirements
  spaceDimensions: {
    width: number;
    depth: number;
    height: number;
    indoorOutdoor: 'indoor' | 'outdoor' | 'mixed';
  };
  existingElements: string[];
  spaceConstraints: string[];
  
  // Prop categories needed
  balloonSystems: boolean;
  photoBackdrops: boolean;
  interactiveProps: boolean;
  ceremonialElements: boolean;
  giftDisplayAreas: boolean;
  entertainmentProps: boolean;
  
  // Design preferences
  colorScheme: 'theme-based' | 'cultural-palette' | 'pastel' | 'bright' | 'elegant' | 'custom';
  customColors: string[];
  materialPreferences: string[];
  sustainabilityLevel: 'basic' | 'moderate' | 'high' | 'eco-focused';
  
  // Interaction requirements
  ageAppropriateActivities: boolean;
  photoOpportunities: number;
  interactiveZones: number;
  safetyRequirements: string[];
  
  // Practical constraints
  budget: number;
  setupTime: number; // Hours
  cleanupComplexity: 'simple' | 'moderate' | 'complex';
  transportability: 'single-trip' | 'multiple-trips' | 'delivery-required';
  
  // Special features
  surpriseElements: boolean;
  personalizedTouches: boolean;
  keepsakeElements: boolean;
  documentationSupport: boolean;
}

export interface CulturalCelebrationData {
  philosophy: string;
  celebrationPrinciples: {
    communal: string[];
    individual: string[];
    ceremonial: string[];
    festive: string[];
  };
  traditionalElements: {
    symbols: { [symbol: string]: string };
    colors: { [color: string]: string };
    objects: { [object: string]: string };
    arrangements: { [arrangement: string]: string };
  };
  ageSpecificTraditions: {
    [ageGroup: string]: {
      rituals: string[];
      gifts: string[];
      foods: string[];
      activities: string[];
    };
  };
  ceremonialObjects: {
    required: string[];
    optional: string[];
    sacred: string[];
    symbolic: string[];
  };
  modernAdaptations: {
    digitalIntegration: string[];
    contemporaryElements: string[];
    fusionApproaches: string[];
  };
  safetyConsiderations: {
    materials: string[];
    interactions: string[];
    supervision: string[];
  };
}

export class CelebratoryTemplate {
  private culturalData: Map<string, CulturalCelebrationData> = new Map();
  private themeDatabase: Map<string, any> = new Map();
  private safetyStandards: Map<string, any> = new Map();
  private ageAppropriateGuidelines: Map<string, any> = new Map();

  constructor() {
    this.initializeCulturalData();
    this.initializeThemeDatabase();
    this.initializeSafetyStandards();
    this.initializeAgeAppropriateGuidelines();
  }

  generateCelebratorySystem(parameters: CelebratoryParameters): THREE.Group {
    console.log(`🎉 Generating ${parameters.culture} ${parameters.celebrationType} celebration system...`);
    
    // Step 1: Analyze celebration requirements and cultural context
    const celebrationSpecs = this.analyzeCelebrationRequirements(parameters);
    
    // Step 2: Design age-appropriate and culturally-sensitive layout
    const celebrationLayout = this.designCelebrationLayout(parameters, celebrationSpecs);
    
    // Step 3: Generate celebration prop systems
    const celebrationSystem = new THREE.Group();
    const balloonSystems = parameters.balloonSystems ? this.generateBalloonSystems(celebrationLayout, parameters) : [];
    const photoBackdrops = parameters.photoBackdrops ? this.generatePhotoBackdrops(celebrationLayout, parameters) : [];
    const interactiveProps = parameters.interactiveProps ? this.generateInteractiveProps(celebrationLayout, parameters) : [];
    const ceremonialElements = parameters.ceremonialElements ? this.generateCeremonialElements(celebrationLayout, parameters) : [];
    
    // Step 4: Add cultural celebration elements
    const culturalCelebrationFeatures = this.addCulturalCelebrationElements(parameters);
    
    // Step 5: Generate themed decoration systems
    const themedDecorations = this.generateThemedDecorations(parameters);
    
    // Step 6: Create gift and display areas
    const giftDisplaySystems = parameters.giftDisplayAreas ? this.generateGiftDisplaySystems(parameters) : [];
    
    // Step 7: Add entertainment and activity props
    const entertainmentProps = parameters.entertainmentProps ? this.generateEntertainmentProps(parameters) : [];
    
    // Step 8: Create personalized and surprise elements
    let personalizedElements: THREE.Object3D[] = [];
    if (parameters.personalizedTouches || parameters.surpriseElements) {
      personalizedElements = this.generatePersonalizedElements(parameters);
    }
    
    // Step 9: Assemble complete celebration system
    celebrationSystem.add(
      ...balloonSystems,
      ...photoBackdrops,
      ...interactiveProps,
      ...ceremonialElements,
      ...culturalCelebrationFeatures,
      ...themedDecorations,
      ...giftDisplaySystems,
      ...entertainmentProps,
      ...personalizedElements
    );
    
    // Step 10: Apply celebration aesthetics and safety measures
    this.applyCelebrationAesthetics(celebrationSystem, parameters);
    this.implementSafetyMeasures(celebrationSystem, parameters);
    
    celebrationSystem.userData = {
      type: 'celebratory-props-system',
      celebrationType: parameters.celebrationType,
      theme: parameters.theme,
      culture: parameters.culture,
      ageGroup: parameters.ageGroup,
      guestCapacity: parameters.guestCount,
      culturalAuthenticity: this.calculateCelebrationAuthenticity(parameters),
      safetyCompliance: this.calculateSafetyCompliance(parameters),
      ageAppropriateness: this.calculateAgeAppropriateness(parameters),
      memoryCreationPotential: this.calculateMemoryPotential(parameters),
      generatedAt: Date.now()
    };
    
    console.log(`✨ ${parameters.culture} ${parameters.celebrationType} celebration system generated successfully!`);
    return celebrationSystem;
  }

  private initializeCulturalData(): void {
    this.culturalData = new Map();

    // Mexican/Latin Celebration Traditions
    this.culturalData.set('mexican', {
      philosophy: 'Communal joy, family unity, generational connection, vibrant celebration',
      celebrationPrinciples: {
        communal: ['extended-family-inclusion', 'neighborhood-participation', 'collective-preparation', 'shared-responsibility'],
        individual: ['personal-honor', 'milestone-recognition', 'individual-blessing', 'special-treatment'],
        ceremonial: ['religious-blessing', 'traditional-rituals', 'symbolic-actions', 'ancestral-honor'],
        festive: ['music-dancing', 'abundant-food', 'colorful-decoration', 'joyful-expression']
      },
      traditionalElements: {
        symbols: {
          'marigold': 'life-celebration-remembrance',
          'papel-picado': 'joy-festivity-community',
          'piñata': 'abundance-surprise-sharing',
          'luminarias': 'guidance-hope-celebration',
          'cross': 'blessing-protection-faith',
          'butterfly': 'transformation-renewal-soul'
        },
        colors: {
          'vibrant-pink': 'joy-femininity-celebration',
          'bright-orange': 'energy-warmth-festivity',
          'deep-red': 'passion-love-life',
          'royal-blue': 'loyalty-trust-stability',
          'golden-yellow': 'happiness-prosperity-sun',
          'emerald-green': 'growth-hope-nature'
        },
        objects: {
          'papel-picado-banners': 'celebration-announcement-decoration',
          'ceramic-talavera': 'tradition-craftsmanship-beauty',
          'wooden-crosses': 'blessing-protection-faith',
          'fabric-flowers': 'eternal-beauty-celebration',
          'clay-luminarias': 'light-guidance-welcome',
          'embroidered-textiles': 'heritage-skill-beauty'
        },
        arrangements: {
          'altar-creation': 'honor-remembrance-blessing',
          'circular-gathering': 'unity-inclusion-equality',
          'abundant-display': 'generosity-prosperity-celebration',
          'height-variation': 'visual-interest-accessibility'
        }
      },
      ageSpecificTraditions: {
        'toddler': {
          rituals: ['blessing-ceremony', 'first-piñata', 'family-circle'],
          gifts: ['religious-medallions', 'traditional-toys', 'handmade-clothes'],
          foods: ['tres-leches-cake', 'fruit-waters', 'soft-traditional-sweets'],
          activities: ['gentle-music', 'family-dancing', 'blessing-receiving']
        },
        'child': {
          rituals: ['piñata-ceremony', 'birthday-blessing', 'gift-receiving'],
          gifts: ['toys', 'books', 'traditional-games', 'religious-items'],
          foods: ['decorated-cake', 'traditional-sweets', 'fruit-drinks'],
          activities: ['piñata-breaking', 'traditional-games', 'group-dancing']
        },
        'teen': {
          rituals: ['quinceañera-preparation', 'coming-of-age-recognition'],
          gifts: ['jewelry', 'religious-items', 'adult-symbols'],
          foods: ['elaborate-cake', 'traditional-feast', 'ceremonial-drinks'],
          activities: ['formal-dancing', 'ceremony-participation', 'family-toasts']
        },
        'adult': {
          rituals: ['family-blessing', 'achievement-recognition', 'milestone-honor'],
          gifts: ['family-heirlooms', 'practical-items', 'symbolic-objects'],
          foods: ['traditional-feast', 'ceremonial-drinks', 'family-recipes'],
          activities: ['storytelling', 'music-sharing', 'family-bonding']
        }
      },
      ceremonialObjects: {
        required: ['religious-symbols', 'family-photos', 'traditional-music'],
        optional: ['papel-picado', 'luminarias', 'traditional-games'],
        sacred: ['crosses', 'religious-medals', 'blessed-objects'],
        symbolic: ['piñatas', 'marigolds', 'family-heirlooms']
      },
      modernAdaptations: {
        digitalIntegration: ['photo-sharing-stations', 'music-playlists', 'video-calls-family'],
        contemporaryElements: ['modern-decorations', 'fusion-foods', 'updated-activities'],
        fusionApproaches: ['traditional-modern-blend', 'cultural-fusion', 'contemporary-interpretation']
      },
      safetyConsiderations: {
        materials: ['non-toxic-paint', 'fire-safe-decorations', 'child-safe-items'],
        interactions: ['supervised-activities', 'age-appropriate-games', 'safe-spaces'],
        supervision: ['adult-oversight', 'safety-briefings', 'emergency-planning']
      }
    });

    // Korean Celebration Traditions
    this.culturalData.set('korean', {
      philosophy: 'Respect for elders, family harmony, educational achievement, communal support',
      celebrationPrinciples: {
        communal: ['family-honor', 'community-recognition', 'collective-celebration', 'shared-prosperity'],
        individual: ['personal-achievement', 'milestone-recognition', 'individual-blessing', 'future-wishes'],
        ceremonial: ['respectful-rituals', 'traditional-customs', 'ancestral-acknowledgment', 'formal-procedures'],
        festive: ['joyful-gathering', 'abundant-food', 'gift-giving', 'well-wishes']
      },
      traditionalElements: {
        symbols: {
          'crane': 'longevity-wisdom-good-fortune',
          'bamboo': 'strength-flexibility-growth',
          'lotus': 'purity-enlightenment-rebirth',
          'turtle': 'longevity-stability-wisdom',
          'dragon': 'power-wisdom-protection',
          'phoenix': 'renewal-virtue-grace'
        },
        colors: {
          'red': 'good-fortune-joy-celebration',
          'gold': 'prosperity-success-nobility',
          'white': 'purity-peace-new-beginnings',
          'blue': 'harmony-stability-trust',
          'green': 'growth-health-nature',
          'purple': 'nobility-spirituality-wisdom'
        },
        objects: {
          'hanbok-elements': 'cultural-identity-tradition-honor',
          'traditional-fans': 'grace-elegance-ceremony',
          'ceramic-vessels': 'craftsmanship-tradition-beauty',
          'silk-fabrics': 'luxury-tradition-celebration',
          'wooden-crafts': 'nature-skill-heritage',
          'paper-art': 'creativity-tradition-celebration'
        },
        arrangements: {
          'hierarchical-seating': 'respect-age-status-tradition',
          'circular-harmony': 'unity-inclusion-balance',
          'symmetrical-balance': 'order-harmony-beauty',
          'nature-integration': 'natural-harmony-balance'
        }
      },
      ageSpecificTraditions: {
        'toddler': {
          rituals: ['doljanchi-celebration', 'future-prediction-ceremony', 'blessing-receiving'],
          gifts: ['educational-toys', 'traditional-clothes', 'symbolic-items'],
          foods: ['rainbow-rice-cake', 'traditional-sweets', 'ceremonial-foods'],
          activities: ['object-selection-ceremony', 'family-blessing', 'photo-documentation']
        },
        'child': {
          rituals: ['achievement-recognition', 'educational-encouragement', 'family-blessing'],
          gifts: ['books', 'educational-materials', 'traditional-toys'],
          foods: ['celebration-cake', 'traditional-foods', 'healthy-options'],
          activities: ['learning-games', 'family-sharing', 'cultural-activities']
        },
        'teen': {
          rituals: ['coming-of-age-recognition', 'educational-achievement-honor'],
          gifts: ['educational-support', 'future-preparation-items', 'cultural-objects'],
          foods: ['formal-meal', 'traditional-dishes', 'celebration-desserts'],
          activities: ['formal-ceremonies', 'family-discussions', 'future-planning']
        },
        'adult': {
          rituals: ['life-milestone-honor', 'achievement-celebration', 'family-gathering'],
          gifts: ['practical-items', 'luxury-goods', 'meaningful-objects'],
          foods: ['elaborate-feast', 'traditional-specialties', 'ceremonial-dishes'],
          activities: ['formal-toasts', 'family-sharing', 'wisdom-exchange']
        }
      },
      ceremonialObjects: {
        required: ['family-photos', 'traditional-foods', 'respectful-seating'],
        optional: ['traditional-music', 'cultural-decorations', 'ceremonial-items'],
        sacred: ['ancestral-acknowledgments', 'family-heirlooms', 'blessed-objects'],
        symbolic: ['longevity-symbols', 'prosperity-items', 'wisdom-representations']
      },
      modernAdaptations: {
        digitalIntegration: ['video-documentation', 'family-connections', 'modern-music'],
        contemporaryElements: ['modern-decorations', 'fusion-celebration', 'updated-traditions'],
        fusionApproaches: ['east-west-blend', 'traditional-contemporary', 'global-korean']
      },
      safetyConsiderations: {
        materials: ['natural-materials', 'child-safe-items', 'quality-construction'],
        interactions: ['respectful-behavior', 'supervised-activities', 'safe-participation'],
        supervision: ['elder-guidance', 'safety-awareness', 'respectful-monitoring']
      }
    });

    // Jewish Celebration Traditions
    this.culturalData.set('jewish', {
      philosophy: 'Learning and growth, community responsibility, family tradition, spiritual development',
      celebrationPrinciples: {
        communal: ['community-participation', 'collective-responsibility', 'shared-learning', 'mutual-support'],
        individual: ['personal-development', 'milestone-achievement', 'spiritual-growth', 'individual-honor'],
        ceremonial: ['ritual-observance', 'traditional-blessings', 'sacred-elements', 'meaningful-customs'],
        festive: ['joyful-celebration', 'learning-integration', 'family-bonding', 'community-connection']
      },
      traditionalElements: {
        symbols: {
          'star-of-david': 'jewish-identity-protection-blessing',
          'menorah': 'light-wisdom-divine-presence',
          'torah': 'learning-wisdom-tradition',
          'chai': 'life-blessing-good-fortune',
          'hamsa': 'protection-blessing-good-fortune',
          'pomegranate': 'abundance-fertility-righteousness'
        },
        colors: {
          'blue': 'divine-protection-spirituality',
          'white': 'purity-peace-holiness',
          'gold': 'divine-light-precious-wisdom',
          'silver': 'purity-clarity-divine-reflection',
          'purple': 'royalty-nobility-spiritual-dignity',
          'red': 'life-strength-celebration'
        },
        objects: {
          'kiddush-cups': 'blessing-sanctification-ceremony',
          'challah-covers': 'sabbath-blessing-tradition',
          'havdalah-sets': 'separation-blessing-ceremony',
          'torah-covers': 'sacred-protection-honor',
          'prayer-books': 'learning-worship-tradition',
          'ceremonial-items': 'ritual-observance-tradition'
        },
        arrangements: {
          'blessing-focused': 'sacred-central-honor-reverence',
          'learning-centered': 'education-discussion-growth',
          'family-inclusive': 'generational-connection-tradition',
          'community-welcoming': 'hospitality-inclusion-warmth'
        }
      },
      ageSpecificTraditions: {
        'child': {
          rituals: ['blessing-receiving', 'learning-encouragement', 'family-inclusion'],
          gifts: ['books', 'educational-toys', 'jewish-items', 'ceremonial-objects'],
          foods: ['kosher-cake', 'traditional-sweets', 'festive-foods'],
          activities: ['learning-games', 'story-telling', 'tradition-sharing']
        },
        'teen': {
          rituals: ['bar-bat-mitzvah-preparation', 'adult-responsibility-recognition'],
          gifts: ['religious-items', 'educational-materials', 'adult-symbols'],
          foods: ['ceremonial-feast', 'traditional-foods', 'celebration-desserts'],
          activities: ['torah-reading', 'community-participation', 'family-celebration']
        },
        'adult': {
          rituals: ['life-cycle-celebrations', 'achievement-recognition', 'family-milestones'],
          gifts: ['meaningful-objects', 'charitable-donations', 'family-heirlooms'],
          foods: ['traditional-feast', 'kosher-specialties', 'ceremonial-foods'],
          activities: ['community-gathering', 'family-sharing', 'tradition-continuation']
        }
      },
      ceremonialObjects: {
        required: ['blessing-elements', 'kosher-foods', 'ceremonial-items'],
        optional: ['traditional-music', 'cultural-decorations', 'educational-materials'],
        sacred: ['torah-elements', 'prayer-items', 'blessed-objects'],
        symbolic: ['religious-symbols', 'tradition-items', 'cultural-objects']
      },
      modernAdaptations: {
        digitalIntegration: ['virtual-participation', 'modern-music', 'digital-learning'],
        contemporaryElements: ['modern-decorations', 'updated-traditions', 'contemporary-interpretation'],
        fusionApproaches: ['traditional-modern-blend', 'cultural-integration', 'contemporary-observance']
      },
      safetyConsiderations: {
        materials: ['kosher-safe-items', 'child-appropriate', 'quality-construction'],
        interactions: ['respectful-participation', 'supervised-activities', 'inclusive-environment'],
        supervision: ['adult-guidance', 'safety-awareness', 'respectful-oversight']
      }
    });

    // American/Contemporary Celebration Culture
    this.culturalData.set('american', {
      philosophy: 'Individual expression, fun and creativity, inclusive celebration, memorable experiences',
      celebrationPrinciples: {
        communal: ['inclusive-participation', 'friend-family-integration', 'community-building', 'shared-enjoyment'],
        individual: ['personal-preferences', 'individual-expression', 'unique-celebration', 'personal-interests'],
        ceremonial: ['milestone-recognition', 'achievement-celebration', 'memory-creation', 'tradition-building'],
        festive: ['fun-focused', 'creative-expression', 'entertainment-rich', 'joy-maximization']
      },
      traditionalElements: {
        symbols: {
          'birthday-candles': 'wishes-hope-celebration',
          'balloons': 'joy-festivity-celebration',
          'cake': 'sweetness-sharing-tradition',
          'presents': 'love-thoughtfulness-generosity',
          'party-hats': 'festivity-fun-special-occasion',
          'streamers': 'decoration-celebration-joy'
        },
        colors: {
          'bright-primary': 'energy-fun-childhood-joy',
          'pastel-soft': 'gentleness-sweetness-calm-celebration',
          'theme-specific': 'personal-interest-individual-expression',
          'rainbow-spectrum': 'diversity-inclusion-comprehensive-joy',
          'metallic-accents': 'special-occasion-luxury-celebration',
          'seasonal-appropriate': 'timing-relevance-natural-harmony'
        },
        objects: {
          'balloon-arrangements': 'festivity-decoration-celebration',
          'themed-decorations': 'personal-interest-individual-expression',
          'photo-props': 'memory-creation-fun-documentation',
          'activity-stations': 'engagement-entertainment-participation',
          'cake-displays': 'centerpiece-tradition-sweetness',
          'gift-areas': 'generosity-love-celebration'
        },
        arrangements: {
          'activity-zones': 'engagement-age-appropriate-fun',
          'photo-opportunities': 'memory-creation-documentation',
          'flexible-spaces': 'adaptability-inclusion-comfort',
          'safety-priority': 'child-protection-adult-peace-mind'
        }
      },
      ageSpecificTraditions: {
        'toddler': {
          rituals: ['cake-smashing', 'simple-games', 'family-singing'],
          gifts: ['age-appropriate-toys', 'books', 'clothes', 'keepsakes'],
          foods: ['simple-cake', 'finger-foods', 'healthy-options'],
          activities: ['gentle-play', 'music-movement', 'sensory-activities']
        },
        'child': {
          rituals: ['candle-blowing', 'wish-making', 'gift-opening', 'game-playing'],
          gifts: ['toys', 'games', 'books', 'creative-supplies'],
          foods: ['themed-cake', 'kid-friendly-foods', 'treats'],
          activities: ['organized-games', 'creative-activities', 'themed-entertainment']
        },
        'teen': {
          rituals: ['milestone-recognition', 'independence-celebration', 'friend-gathering'],
          gifts: ['personal-items', 'technology', 'experiences', 'money'],
          foods: ['sophisticated-cake', 'favorite-foods', 'trendy-treats'],
          activities: ['social-activities', 'entertainment', 'photo-sessions']
        },
        'adult': {
          rituals: ['milestone-celebration', 'achievement-recognition', 'relationship-honor'],
          gifts: ['meaningful-items', 'experiences', 'luxury-goods', 'practical-items'],
          foods: ['elegant-cake', 'favorite-cuisine', 'specialty-items'],
          activities: ['sophisticated-entertainment', 'conversation', 'experience-sharing']
        }
      },
      ceremonialObjects: {
        required: ['birthday-cake', 'candles', 'celebration-music'],
        optional: ['themed-decorations', 'party-favors', 'entertainment'],
        sacred: ['family-traditions', 'personal-meaningful-items'],
        symbolic: ['wishes-candles', 'celebration-symbols', 'memory-items']
      },
      modernAdaptations: {
        digitalIntegration: ['social-media-ready', 'digital-entertainment', 'virtual-participation'],
        contemporaryElements: ['trending-themes', 'modern-technology', 'contemporary-style'],
        fusionApproaches: ['cultural-integration', 'personal-preference', 'creative-fusion']
      },
      safetyConsiderations: {
        materials: ['non-toxic-safe', 'age-appropriate', 'allergen-aware'],
        interactions: ['supervised-play', 'safe-activities', 'inclusive-environment'],
        supervision: ['adult-oversight', 'safety-protocols', 'emergency-preparedness']
      }
    });
  }

  private generateBalloonSystems(layout: any, params: CelebratoryParameters): THREE.Object3D[] {
    const balloonSystems: THREE.Object3D[] = [];
    
    switch (params.theme) {
      case 'superhero':
        balloonSystems.push(...this.createSuperheroBoulloonArch(params));
        balloonSystems.push(...this.createThemeFloatingBalloons(params, 'superhero'));
        break;
      case 'princess':
        balloonSystems.push(...this.createElegantBalloonColumns(params));
        balloonSystems.push(...this.createPrincessBalloonClouds(params));
        break;
      case 'cultural-traditional':
        balloonSystems.push(...this.createCulturalBalloonDisplay(params));
        break;
      default:
        balloonSystems.push(...this.createStandardBalloonArrangement(params));
    }
    
    return balloonSystems;
  }

  private createSuperheroBoulloonArch(params: CelebratoryParameters): THREE.Object3D[] {
    const balloonArch: THREE.Object3D[] = [];
    const archWidth = Math.min(params.spaceDimensions.width * 0.8, 6.0);
    const archHeight = 2.5;
    
    // Create balloon arch structure
    const balloonCount = 40;
    const superheroColors = ['#FF0000', '#0000FF', '#FFD700', '#008000', '#800080'];
    
    for (let i = 0; i < balloonCount; i++) {
      const balloonGroup = new THREE.Group();
      
      // Balloon geometry
      const balloonGeometry = new THREE.SphereGeometry(0.15, 12, 12);
      balloonGeometry.scale(1, 1.3, 1); // Slightly elongated
      
      const balloonMaterial = new THREE.MeshLambertMaterial({ 
        color: superheroColors[Math.floor(Math.random() * superheroColors.length)]
      });
      const balloon = new THREE.Mesh(balloonGeometry, balloonMaterial);
      
      // Balloon string
      const stringGeometry = new THREE.CylinderGeometry(0.002, 0.002, 0.3, 4);
      const stringMaterial = new THREE.MeshLambertMaterial({ color: '#FFFFFF' });
      const string = new THREE.Mesh(stringGeometry, stringMaterial);
      string.position.y = -0.15;
      
      balloonGroup.add(balloon, string);
      
      // Position along arch curve
      const t = i / (balloonCount - 1);
      const angle = t * Math.PI;
      const x = (t - 0.5) * archWidth;
      const y = Math.sin(angle) * archHeight + 1.5;
      const z = Math.cos(angle * 0.5) * 0.3; // Slight depth variation
      
      balloonGroup.position.set(x, y, z);
      balloonGroup.userData = {
        component: 'superhero-balloon-arch',
        index: i,
        color: balloonMaterial.color.getHexString()
      };
      
      balloonArch.push(balloonGroup);
    }
    
    return balloonArch;
  }

  private createPrincessBalloonClouds(params: CelebratoryParameters): THREE.Object3D[] {
    const balloonClouds: THREE.Object3D[] = [];
    const princessColors = ['#FFB6C1', '#E6E6FA', '#F0F8FF', '#FFF8DC', '#FFE4E1'];
    
    // Create 3 balloon cloud clusters
    for (let cluster = 0; cluster < 3; cluster++) {
      const cloudGroup = new THREE.Group();
      const balloonCount = 12 + Math.floor(Math.random() * 8);
      
      for (let i = 0; i < balloonCount; i++) {
        const balloonGroup = new THREE.Group();
        
        // Varying balloon sizes for organic look
        const size = 0.12 + Math.random() * 0.08;
        const balloonGeometry = new THREE.SphereGeometry(size, 12, 12);
        balloonGeometry.scale(1, 1.2, 1);
        
        const balloonMaterial = new THREE.MeshPhongMaterial({ 
          color: princessColors[Math.floor(Math.random() * princessColors.length)],
          shininess: 100,
          transparent: true,
          opacity: 0.9
        });
        const balloon = new THREE.Mesh(balloonGeometry, balloonMaterial);
        
        // Delicate ribbon
        const ribbonGeometry = new THREE.CylinderGeometry(0.001, 0.001, 0.4, 4);
        const ribbonMaterial = new THREE.MeshLambertMaterial({ color: '#FFD700' });
        const ribbon = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
        ribbon.position.y = -size - 0.2;
        
        balloonGroup.add(balloon, ribbon);
        
        // Cluster positioning
        const clusterRadius = 0.8;
        const angle = (i / balloonCount) * Math.PI * 2;
        const radius = Math.random() * clusterRadius;
        const height = Math.random() * 0.5;
        
        balloonGroup.position.set(
          Math.cos(angle) * radius,
          2.0 + height,
          Math.sin(angle) * radius
        );
        
        cloudGroup.add(balloonGroup);
      }
      
      // Position clusters around space
      const clusterAngle = (cluster / 3) * Math.PI * 2;
      const clusterDistance = params.spaceDimensions.width * 0.3;
      cloudGroup.position.set(
        Math.cos(clusterAngle) * clusterDistance,
        0,
        Math.sin(clusterAngle) * clusterDistance
      );
      
      cloudGroup.userData = {
        component: 'princess-balloon-cloud',
        cluster: cluster,
        balloonCount: balloonCount
      };
      
      balloonClouds.push(cloudGroup);
    }
    
    return balloonClouds;
  }

  private generatePhotoBackdrops(layout: any, params: CelebratoryParameters): THREE.Object3D[] {
    const photoBackdrops: THREE.Object3D[] = [];
    
    // Main backdrop based on theme and age
    const mainBackdrop = this.createMainPhotoBackdrop(params);
    photoBackdrops.push(mainBackdrop);
    
    // Additional photo opportunity areas
    if (params.photoOpportunities > 1) {
      for (let i = 1; i < params.photoOpportunities; i++) {
        const additionalBackdrop = this.createAdditionalPhotoArea(params, i);
        photoBackdrops.push(additionalBackdrop);
      }
    }
    
    return photoBackdrops;
  }

  private createMainPhotoBackdrop(params: CelebratoryParameters): THREE.Object3D {
    const backdropGroup = new THREE.Group();
    
    // Backdrop frame
    const frameWidth = 3.0;
    const frameHeight = 2.5;
    
    // Background panel
    const backgroundGeometry = new THREE.PlaneGeometry(frameWidth, frameHeight);
    let backgroundMaterial: THREE.Material;
    
    switch (params.theme) {
      case 'superhero':
        backgroundMaterial = new THREE.MeshLambertMaterial({ 
          color: '#001122'
        });
        break;
      case 'princess':
        backgroundMaterial = new THREE.MeshPhongMaterial({ 
          color: '#FFE4E1',
          shininess: 30
        });
        break;
      case 'space':
        backgroundMaterial = new THREE.MeshLambertMaterial({ 
          color: '#000033'
        });
        break;
      default:
        backgroundMaterial = new THREE.MeshLambertMaterial({ 
          color: this.getThemeMainColor(params.theme)
        });
    }
    
    const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    
    // Decorative frame
    const frameThickness = 0.1;
    const frameGeometry = new THREE.BoxGeometry(frameWidth + 0.2, frameHeight + 0.2, frameThickness);
    const frameMaterial = new THREE.MeshPhongMaterial({ 
      color: '#FFD700',
      shininess: 80
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.z = -0.05;
    
    // Theme-specific decorative elements
    const decorativeElements = this.createBackdropDecorations(params);
    
    backdropGroup.add(frame, background, ...decorativeElements);
    
    // Position backdrop
    backdropGroup.position.set(
      -params.spaceDimensions.width * 0.3,
      frameHeight / 2,
      -params.spaceDimensions.depth * 0.4
    );
    backdropGroup.rotation.y = Math.PI / 6; // Slight angle
    
    backdropGroup.userData = {
      component: 'main-photo-backdrop',
      theme: params.theme,
      dimensions: { width: frameWidth, height: frameHeight }
    };
    
    return backdropGroup;
  }

  private createBackdropDecorations(params: CelebratoryParameters): THREE.Object3D[] {
    const decorations: THREE.Object3D[] = [];
    
    switch (params.theme) {
      case 'superhero':
        // Comic book style elements
        decorations.push(...this.createComicBookElements());
        break;
      case 'princess':
        // Elegant fairy tale elements
        decorations.push(...this.createFairyTaleElements());
        break;
      case 'space':
        // Space exploration elements
        decorations.push(...this.createSpaceElements());
        break;
      case 'nature':
        // Natural forest elements
        decorations.push(...this.createNatureElements());
        break;
    }
    
    return decorations;
  }

  private createComicBookElements(): THREE.Object3D[] {
    const elements: THREE.Object3D[] = [];
    
    // "POW!" text effect
    const powGeometry = new THREE.PlaneGeometry(0.6, 0.3);
    const powMaterial = new THREE.MeshLambertMaterial({ 
      color: '#FFFF00',
      transparent: true,
      opacity: 0.9
    });
    const pow = new THREE.Mesh(powGeometry, powMaterial);
    pow.position.set(1.0, 0.8, 0.1);
    pow.userData.component = 'comic-text-pow';
    
    // "BOOM!" text effect
    const boomGeometry = new THREE.PlaneGeometry(0.8, 0.4);
    const boomMaterial = new THREE.MeshLambertMaterial({ 
      color: '#FF4500',
      transparent: true,
      opacity: 0.9
    });
    const boom = new THREE.Mesh(boomGeometry, boomMaterial);
    boom.position.set(-0.8, -0.5, 0.1);
    boom.userData.component = 'comic-text-boom';
    
    // Star bursts
    for (let i = 0; i < 5; i++) {
      const starGroup = this.createComicStar();
      starGroup.position.set(
        (Math.random() - 0.5) * 2.5,
        (Math.random() - 0.5) * 2.0,
        0.05
      );
      starGroup.scale.setScalar(0.3 + Math.random() * 0.4);
      elements.push(starGroup);
    }
    
    elements.push(pow, boom);
    return elements;
  }

  private createComicStar(): THREE.Object3D {
    const starGroup = new THREE.Group();
    
    // Create 8-pointed star
    const starPoints = 8;
    const outerRadius = 0.15;
    const innerRadius = 0.07;
    
    const starGeometry = new THREE.BufferGeometry();
    const vertices = [];
    
    for (let i = 0; i < starPoints * 2; i++) {
      const angle = (i / (starPoints * 2)) * Math.PI * 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      vertices.push(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const starMaterial = new THREE.MeshLambertMaterial({ color: '#FFFF00' });
    const star = new THREE.Mesh(starGeometry, starMaterial);
    
    starGroup.add(star);
    starGroup.userData.component = 'comic-star';
    
    return starGroup;
  }

  private generateInteractiveProps(layout: any, params: CelebratoryParameters): THREE.Object3D[] {
    const interactiveProps: THREE.Object3D[] = [];
    
    // Age-appropriate interactive elements
    if (params.ageGroup === 'toddler' || params.ageGroup === 'child') {
      interactiveProps.push(...this.createChildInteractiveProps(params));
    } else if (params.ageGroup === 'teen') {
      interactiveProps.push(...this.createTeenInteractiveProps(params));
    } else {
      interactiveProps.push(...this.createAdultInteractiveProps(params));
    }
    
    return interactiveProps;
  }

  private createChildInteractiveProps(params: CelebratoryParameters): THREE.Object3D[] {
    const childProps: THREE.Object3D[] = [];
    
    // Piñata (if culturally appropriate)
    if (params.culture === 'mexican' || params.culture === 'latin') {
      const pinata = this.createPinata(params);
      childProps.push(pinata);
    }
    
    // Activity station table
    const activityTable = this.createActivityTable(params);
    childProps.push(activityTable);
    
    // Themed play props
    const playProps = this.createThemedPlayProps(params);
    childProps.push(...playProps);
    
    return childProps;
  }

  private createPinata(params: CelebratoryParameters): THREE.Object3D {
    const pinataGroup = new THREE.Group();
    
    // Piñata body based on theme
    let pinataGeometry: THREE.BufferGeometry;
    let pinataMaterial: THREE.Material;
    
    switch (params.theme) {
      case 'superhero':
        // Star-shaped piñata
        pinataGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 8);
        pinataMaterial = new THREE.MeshLambertMaterial({ color: '#FF0000' });
        break;
      case 'princess':
        // Crown-shaped piñata
        pinataGeometry = new THREE.ConeGeometry(0.25, 0.4, 8);
        pinataMaterial = new THREE.MeshPhongMaterial({ 
          color: '#FFB6C1',
          shininess: 60
        });
        break;
      case 'unicorn':
        // Unicorn head piñata
        pinataGeometry = new THREE.SphereGeometry(0.2, 12, 12);
        pinataMaterial = new THREE.MeshLambertMaterial({ color: '#FFFFFF' });
        break;
      default:
        // Traditional donkey/burro shape
        pinataGeometry = new THREE.BoxGeometry(0.5, 0.3, 0.2);
        pinataMaterial = new THREE.MeshLambertMaterial({ color: '#FF69B4' });
    }
    
    const pinata = new THREE.Mesh(pinataGeometry, pinataMaterial);
    
    // Colorful tissue paper fringe effect
    const fringeCount = 20;
    for (let i = 0; i < fringeCount; i++) {
      const fringeGeometry = new THREE.PlaneGeometry(0.05, 0.15);
      const fringeColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];
      const fringeMaterial = new THREE.MeshLambertMaterial({ 
        color: fringeColors[i % fringeColors.length],
        transparent: true,
        opacity: 0.8
      });
      const fringe = new THREE.Mesh(fringeGeometry, fringeMaterial);
      
      const angle = (i / fringeCount) * Math.PI * 2;
      fringe.position.set(
        Math.cos(angle) * 0.25,
        -0.2,
        Math.sin(angle) * 0.25
      );
      fringe.rotation.y = angle;
      
      pinataGroup.add(fringe);
    }
    
    // Hanging rope
    const ropeGeometry = new THREE.CylinderGeometry(0.01, 0.01, 1.0, 8);
    const ropeMaterial = new THREE.MeshLambertMaterial({ color: '#8B4513' });
    const rope = new THREE.Mesh(ropeGeometry, ropeMaterial);
    rope.position.y = 0.7;
    
    pinataGroup.add(pinata, rope);
    
    // Position piñata
    pinataGroup.position.set(
      params.spaceDimensions.width * 0.2,
      2.5,
      params.spaceDimensions.depth * 0.2
    );
    
    pinataGroup.userData = {
      component: 'cultural-pinata',
      theme: params.theme,
      culture: params.culture,
      interactionType: 'breaking-activity'
    };
    
    return pinataGroup;
  }

  private createActivityTable(params: CelebratoryParameters): THREE.Object3D {
    const tableGroup = new THREE.Group();
    
    // Child-height table
    const tableHeight = 0.6; // Appropriate for children
    const tableWidth = 1.2;
    const tableDepth = 0.8;
    
    // Table top
    const topGeometry = new THREE.BoxGeometry(tableWidth, 0.05, tableDepth);
    const topMaterial = new THREE.MeshLambertMaterial({ color: '#F5DEB3' });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = tableHeight;
    
    // Table legs
    const legGeometry = new THREE.CylinderGeometry(0.03, 0.03, tableHeight, 8);
    const legMaterial = new THREE.MeshLambertMaterial({ color: '#8B4513' });
    
    const legPositions = [
      [-tableWidth/2 + 0.1, tableHeight/2, -tableDepth/2 + 0.1],
      [tableWidth/2 - 0.1, tableHeight/2, -tableDepth/2 + 0.1],
      [-tableWidth/2 + 0.1, tableHeight/2, tableDepth/2 - 0.1],
      [tableWidth/2 - 0.1, tableHeight/2, tableDepth/2 - 0.1]
    ];
    
    legPositions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(pos[0], pos[1], pos[2]);
      tableGroup.add(leg);
    });
    
    // Activity supplies on table
    const supplies = this.createActivitySupplies(params);
    supplies.forEach(supply => {
      supply.position.y += tableHeight + 0.025;
      tableGroup.add(supply);
    });
    
    tableGroup.add(top);
    
    // Position table
    tableGroup.position.set(
      params.spaceDimensions.width * 0.3,
      0,
      -params.spaceDimensions.depth * 0.3
    );
    
    tableGroup.userData = {
      component: 'activity-table',
      height: tableHeight,
      activities: ['coloring', 'crafts', 'games']
    };
    
    return tableGroup;
  }

  private createActivitySupplies(params: CelebratoryParameters): THREE.Object3D[] {
    const supplies: THREE.Object3D[] = [];
    
    // Coloring books
    const coloringBookGeometry = new THREE.BoxGeometry(0.2, 0.01, 0.25);
    const coloringBookMaterial = new THREE.MeshLambertMaterial({ color: '#FFFFFF' });
    const coloringBook = new THREE.Mesh(coloringBookGeometry, coloringBookMaterial);
    coloringBook.position.set(-0.3, 0, -0.2);
    coloringBook.userData.component = 'coloring-book';
    
    // Crayon box
    const crayonBoxGeometry = new THREE.BoxGeometry(0.15, 0.03, 0.1);
    const crayonBoxMaterial = new THREE.MeshLambertMaterial({ color: '#FFD700' });
    const crayonBox = new THREE.Mesh(crayonBoxGeometry, crayonBoxMaterial);
    crayonBox.position.set(-0.1, 0, -0.1);
    crayonBox.userData.component = 'crayon-box';
    
    // Sticker sheets
    const stickerGeometry = new THREE.PlaneGeometry(0.12, 0.18);
    const stickerMaterial = new THREE.MeshLambertMaterial({ color: '#FF69B4' });
    const stickers = new THREE.Mesh(stickerGeometry, stickerMaterial);
    stickers.rotation.x = -Math.PI / 2;
    stickers.position.set(0.2, 0, 0.1);
    stickers.userData.component = 'sticker-sheets';
    
    // Small toys/prizes
    for (let i = 0; i < 3; i++) {
      const toyGeometry = new THREE.SphereGeometry(0.02, 8, 6);
      const toyColors = ['#FF0000', '#00FF00', '#0000FF'];
      const toyMaterial = new THREE.MeshPhongMaterial({ 
        color: toyColors[i],
        shininess: 80
      });
      const toy = new THREE.Mesh(toyGeometry, toyMaterial);
      toy.position.set(0.3 + i * 0.05, 0, 0.2);
      toy.userData.component = 'small-toy';
      supplies.push(toy);
    }
    
    supplies.push(coloringBook, crayonBox, stickers);
    return supplies;
  }

  private generateCeremonialElements(layout: any, params: CelebratoryParameters): THREE.Object3D[] {
    const ceremonialElements: THREE.Object3D[] = [];
    
    // Cake display area
    const cakeDisplay = this.createCakeDisplayArea(params);
    ceremonialElements.push(cakeDisplay);
    
    // Cultural ceremonial elements
    if (params.culturalTraditions.length > 0) {
      const culturalElements = this.createCulturalCeremonialElements(params);
      ceremonialElements.push(...culturalElements);
    }
    
    // Age-specific ceremonial elements
    const ageSpecificElements = this.createAgeSpecificCeremonialElements(params);
    ceremonialElements.push(...ageSpecificElements);
    
    return ceremonialElements;
  }

  private createCakeDisplayArea(params: CelebratoryParameters): THREE.Object3D {
    const cakeDisplayGroup = new THREE.Group();
    
    // Cake table - elegant height for ceremony
    const tableHeight = 0.75;
    const tableWidth = 1.0;
    const tableDepth = 0.6;
    
    // Table top with elegant finish
    const topGeometry = new THREE.CylinderGeometry(tableWidth/2, tableWidth/2, 0.05, 16);
    const topMaterial = new THREE.MeshPhongMaterial({ 
      color: '#FFFFFF',
      shininess: 80
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = tableHeight;
    
    // Elegant table base
    const baseGeometry = new THREE.CylinderGeometry(0.15, 0.25, tableHeight, 12);
    const baseMaterial = new THREE.MeshPhongMaterial({ 
      color: '#C0C0C0',
      shininess: 60
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = tableHeight / 2;
    
    // Table cloth
    const clothGeometry = new THREE.CylinderGeometry(tableWidth/2 + 0.1, tableWidth/2 + 0.1, 0.01, 16);
    const clothMaterial = new THREE.MeshLambertMaterial({ 
      color: this.getThemeMainColor(params.theme),
      transparent: true,
      opacity: 0.8
    });
    const cloth = new THREE.Mesh(clothGeometry, clothMaterial);
    cloth.position.y = tableHeight + 0.02;
    
    // Birthday cake
    const cake = this.createThemeBirthdayCake(params);
    cake.position.y = tableHeight + 0.1;
    
    // Candles based on age (if child/teen)
    let candles: THREE.Object3D[] = [];
    if (params.ageGroup === 'child' || params.ageGroup === 'teen') {
      candles = this.createBirthdayCandles(params);
      candles.forEach(candle => {
        candle.position.y += tableHeight + 0.2;
        cakeDisplayGroup.add(candle);
      });
    }
    
    cakeDisplayGroup.add(top, base, cloth, cake);
    
    // Position as focal point
    cakeDisplayGroup.position.set(0, 0, 0); // Center of space
    
    cakeDisplayGroup.userData = {
      component: 'cake-display-ceremonial',
      theme: params.theme,
      function: 'birthday-ceremony'
    };
    
    return cakeDisplayGroup;
  }

  private createThemeBirthdayCake(params: CelebratoryParameters): THREE.Object3D {
    const cakeGroup = new THREE.Group();
    
    // Multi-tier cake based on celebration size
    const tierCount = params.guestCount > 20 ? 3 : params.guestCount > 10 ? 2 : 1;
    
    const tierSizes = [0.25, 0.2, 0.15]; // Decreasing sizes
    const tierHeights = [0.12, 0.1, 0.08];
    let currentY = 0;
    
    for (let tier = 0; tier < tierCount; tier++) {
      // Cake layer
      const cakeGeometry = new THREE.CylinderGeometry(tierSizes[tier], tierSizes[tier], tierHeights[tier], 16);
      const cakeMaterial = new THREE.MeshLambertMaterial({ 
        color: '#F5F5DC' // Vanilla base
      });
      const cakeLayer = new THREE.Mesh(cakeGeometry, cakeMaterial);
      cakeLayer.position.y = currentY + tierHeights[tier] / 2;
      
      // Frosting
      const frostingGeometry = new THREE.CylinderGeometry(tierSizes[tier] + 0.01, tierSizes[tier] + 0.01, tierHeights[tier] + 0.02, 16);
      const frostingMaterial = new THREE.MeshPhongMaterial({ 
        color: this.getThemeFrostingColor(params.theme),
        shininess: 30
      });
      const frosting = new THREE.Mesh(frostingGeometry, frostingMaterial);
      frosting.position.y = currentY + tierHeights[tier] / 2;
      
      // Theme decorations on cake
      const decorations = this.createCakeDecorations(params, tierSizes[tier], tier);
      decorations.forEach(decoration => {
        decoration.position.y += currentY + tierHeights[tier];
        cakeGroup.add(decoration);
      });
      
      cakeGroup.add(cakeLayer, frosting);
      currentY += tierHeights[tier];
    }
    
    cakeGroup.userData = {
      component: 'themed-birthday-cake',
      theme: params.theme,
      tiers: tierCount
    };
    
    return cakeGroup;
  }

  private createBirthdayCandles(params: CelebratoryParameters): THREE.Object3D[] {
    const candles: THREE.Object3D[] = [];
    
    // Determine number of candles based on age group
    let candleCount = 5; // Default
    
    if (params.celebrationType === 'birthday-child') {
      // Could be based on actual age, defaulting to symbolic number
      candleCount = 8;
    } else if (params.celebrationType === 'birthday-teen') {
      candleCount = 16;
    }
    
    const candleRadius = 0.15; // Radius for candle placement
    
    for (let i = 0; i < candleCount; i++) {
      const candleGroup = new THREE.Group();
      
      // Candle body
      const candleGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.08, 8);
      const candleColors = ['#FF69B4', '#87CEEB', '#98FB98', '#FFB6C1', '#F0E68C'];
      const candleMaterial = new THREE.MeshLambertMaterial({ 
        color: candleColors[i % candleColors.length]
      });
      const candle = new THREE.Mesh(candleGeometry, candleMaterial);
      candle.position.y = 0.04;
      
      // Candle flame
      const flameGeometry = new THREE.SphereGeometry(0.008, 6, 6);
      const flameMaterial = new THREE.MeshLambertMaterial({ 
        color: '#FFA500',
        transparent: true,
        opacity: 0.8
      });
      const flame = new THREE.Mesh(flameGeometry, flameMaterial);
      flame.position.y = 0.09;
      flame.scale.y = 1.5;
      
      candleGroup.add(candle, flame);
      
      // Position candles in circle on cake
      const angle = (i / candleCount) * Math.PI * 2;
      candleGroup.position.set(
        Math.cos(angle) * candleRadius,
        0,
        Math.sin(angle) * candleRadius
      );
      
      candleGroup.userData = {
        component: 'birthday-candle',
        index: i,
        color: candleMaterial.color.getHexString()
      };
      
      candles.push(candleGroup);
    }
    
    return candles;
  }

  // Helper methods for theme-specific elements
  private getThemeMainColor(theme: string): string {
    const themeColors: Record<string, string> = {
      'superhero': '#FF0000',
      'princess': '#FFB6C1',
      'space': '#000080',
      'nature': '#228B22',
      'unicorn': '#FF69B4',
      'dinosaur': '#32CD32',
      'sports': '#1E90FF',
      'elegant': '#C0C0C0'
    };
    return themeColors[theme] || '#87CEEB';
  }

  private getThemeFrostingColor(theme: string): string {
    const frostingColors: Record<string, string> = {
      'superhero': '#87CEEB',
      'princess': '#FFE4E1',
      'space': '#4169E1',
      'nature': '#90EE90',
      'unicorn': '#E6E6FA',
      'dinosaur': '#98FB98',
      'sports': '#ADD8E6',
      'elegant': '#F5F5F5'
    };
    return frostingColors[theme] || '#FFFFFF';
  }

  // Additional helper methods for comprehensive implementation
  private analyzeCelebrationRequirements(params: CelebratoryParameters): any {
    const culturalData = this.culturalData.get(params.culture)!;
    return {
      culturalConsiderations: culturalData.celebrationPrinciples,
      safetyRequirements: this.analyzeSafetyRequirements(params),
      ageAppropriateElements: this.analyzeAgeRequirements(params),
      spaceOptimization: this.analyzeSpaceRequirements(params)
    };
  }

  private designCelebrationLayout(params: CelebratoryParameters, specs: any): any {
    return {
      activityZones: this.defineActivityZones(params),
      photoAreas: this.planPhotoOpportunities(params),
      ceremonyFocus: this.planCeremonialFocus(params),
      safetyZones: this.defineSafetyZones(params)
    };
  }

  // Placeholder implementations for remaining methods
  private initializeThemeDatabase(): void { this.themeDatabase = new Map(); }
  private initializeSafetyStandards(): void { this.safetyStandards = new Map(); }
  private initializeAgeAppropriateGuidelines(): void { this.ageAppropriateGuidelines = new Map(); }
  private createCulturalBalloonDisplay(params: CelebratoryParameters): THREE.Object3D[] { return []; }
  private createStandardBalloonArrangement(params: CelebratoryParameters): THREE.Object3D[] { return []; }
  private createThemeFloatingBalloons(params: CelebratoryParameters, theme: string): THREE.Object3D[] { return []; }
  private createElegantBalloonColumns(params: CelebratoryParameters): THREE.Object3D[] { return []; }
  private createAdditionalPhotoArea(params: CelebratoryParameters, index: number): THREE.Object3D { return new THREE.Group(); }
  private createFairyTaleElements(): THREE.Object3D[] { return []; }
  private createSpaceElements(): THREE.Object3D[] { return []; }
  private createNatureElements(): THREE.Object3D[] { return []; }
  private createTeenInteractiveProps(params: CelebratoryParameters): THREE.Object3D[] { return []; }
  private createAdultInteractiveProps(params: CelebratoryParameters): THREE.Object3D[] { return []; }
  private createThemedPlayProps(params: CelebratoryParameters): THREE.Object3D[] { return []; }
  private addCulturalCelebrationElements(params: CelebratoryParameters): THREE.Object3D[] { return []; }
  private generateThemedDecorations(params: CelebratoryParameters): THREE.Object3D[] { return []; }
  private generateGiftDisplaySystems(params: CelebratoryParameters): THREE.Object3D[] { return []; }
  private generateEntertainmentProps(params: CelebratoryParameters): THREE.Object3D[] { return []; }
  private generatePersonalizedElements(params: CelebratoryParameters): THREE.Object3D[] { return []; }
  private applyCelebrationAesthetics(system: THREE.Group, params: CelebratoryParameters): void {}
  private implementSafetyMeasures(system: THREE.Group, params: CelebratoryParameters): void {}
  private calculateCelebrationAuthenticity(params: CelebratoryParameters): number { return 90; }
  private calculateSafetyCompliance(params: CelebratoryParameters): number { return 95; }
  private calculateAgeAppropriateness(params: CelebratoryParameters): number { return 93; }
  private calculateMemoryPotential(params: CelebratoryParameters): number { return 96; }
  private createCulturalCeremonialElements(params: CelebratoryParameters): THREE.Object3D[] { return []; }
  private createAgeSpecificCeremonialElements(params: CelebratoryParameters): THREE.Object3D[] { return []; }
  private createCakeDecorations(params: CelebratoryParameters, tierSize: number, tier: number): THREE.Object3D[] { return []; }
  private analyzeSafetyRequirements(params: CelebratoryParameters): any { return {}; }
  private analyzeAgeRequirements(params: CelebratoryParameters): any { return {}; }
  private analyzeSpaceRequirements(params: CelebratoryParameters): any { return {}; }
  private defineActivityZones(params: CelebratoryParameters): any[] { return []; }
  private planPhotoOpportunities(params: CelebratoryParameters): any { return {}; }
  private planCeremonialFocus(params: CelebratoryParameters): any { return {}; }
  private defineSafetyZones(params: CelebratoryParameters): any[] { return []; }
}

// Enhanced Implementation: Cultural-Specific Celebration Generators

export class QuinceañeraTemplate extends CelebratoryTemplate {
  generateQuinceañera(parameters: CelebratoryParameters): THREE.Group {
    console.log(`👑 Generating Quinceañera celebration system...`);
    
    const quinceSystem = new THREE.Group();
    
    // Traditional altar/throne area
    const throne = this.createQuinceañeraThrone();
    quinceSystem.add(throne);
    
    // Ceremonial doll table
    const dollTable = this.createCeremonialDollTable();
    quinceSystem.add(dollTable);
    
    // Dancing area with traditional decorations
    const danceFloor = this.createFormalDanceArea(parameters);
    quinceSystem.add(danceFloor);
    
    // Photo memory table
    const memoryTable = this.createMemoryTable();
    quinceSystem.add(memoryTable);
    
    // Traditional color scheme decorations
    const traditionalDecorations = this.createQuinceTraditionalDecorations(parameters);
    quinceSystem.add(...traditionalDecorations);
    
    quinceSystem.userData = {
      type: 'quinceañera-celebration',
      traditions: ['doll-ceremony', 'shoe-changing', 'crown-ceremony', 'father-daughter-dance'],
      culturalSignificance: 'coming-of-age-celebration'
    };
    
    return quinceSystem;
  }

  private createQuinceañeraThrone(): THREE.Object3D {
    const throneGroup = new THREE.Group();
    
    // Elegant chair/throne
    const seatGeometry = new THREE.BoxGeometry(0.6, 0.08, 0.5);
    const seatMaterial = new THREE.MeshPhongMaterial({ 
      color: '#FFB6C1',
      shininess: 80
    });
    const seat = new THREE.Mesh(seatGeometry, seatMaterial);
    seat.position.y = 0.45;
    
    // High back with decorative elements
    const backGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.05);
    const backMaterial = new THREE.MeshPhongMaterial({ 
      color: '#FF69B4',
      shininess: 60
    });
    const back = new THREE.Mesh(backGeometry, backMaterial);
    back.position.set(0, 0.8, -0.225);
    
    // Decorative crown on top
    const crownGeometry = new THREE.ConeGeometry(0.15, 0.2, 8);
    const crownMaterial = new THREE.MeshPhongMaterial({ 
      color: '#FFD700',
      shininess: 100
    });
    const crown = new THREE.Mesh(crownGeometry, crownMaterial);
    crown.position.set(0, 1.3, -0.225);
    
    // Elegant legs
    const legPositions = [
      [-0.25, 0.2, -0.2],
      [0.25, 0.2, -0.2],
      [-0.25, 0.2, 0.2],
      [0.25, 0.2, 0.2]
    ];
    
    legPositions.forEach(pos => {
      const legGeometry = new THREE.CylinderGeometry(0.03, 0.04, 0.4, 8);
      const legMaterial = new THREE.MeshPhongMaterial({ 
        color: '#C0C0C0',
        shininess: 80
      });
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(pos[0], pos[1], pos[2]);
      throneGroup.add(leg);
    });
    
    throneGroup.add(seat, back, crown);
    throneGroup.position.set(0, 0, -3);
    
    throneGroup.userData = {
      component: 'quinceañera-throne',
      function: 'ceremonial-seating'
    };
    
    return throneGroup;
  }

  private createCeremonialDollTable(): THREE.Object3D {
    const dollTableGroup = new THREE.Group();
    
    // Small elegant table
    const tableTop = new THREE.CylinderGeometry(0.3, 0.3, 0.03, 12);
    const tableMaterial = new THREE.MeshPhongMaterial({ 
      color: '#FFFFFF',
      shininess: 80
    });
    const table = new THREE.Mesh(tableTop, tableMaterial);
    table.position.y = 0.65;
    
    // Table base
    const baseGeometry = new THREE.CylinderGeometry(0.08, 0.12, 0.65, 8);
    const baseMaterial = new THREE.MeshPhongMaterial({ 
      color: '#C0C0C0',
      shininess: 60
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.325;
    
    // Ceremonial doll
    const dollGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.25, 8);
    const dollMaterial = new THREE.MeshLambertMaterial({ color: '#FFB6C1' });
    const doll = new THREE.Mesh(dollGeometry, dollMaterial);
    doll.position.y = 0.78;
    
    // Doll's dress (simplified)
    const dressGeometry = new THREE.ConeGeometry(0.08, 0.15, 8);
    const dressMaterial = new THREE.MeshLambertMaterial({ color: '#FF69B4' });
    const dress = new THREE.Mesh(dressGeometry, dressMaterial);
    dress.position.y = 0.70;
    
    dollTableGroup.add(table, base, doll, dress);
    dollTableGroup.position.set(2, 0, -2);
    
    dollTableGroup.userData = {
      component: 'ceremonial-doll-table',
      tradition: 'doll-giving-ceremony',
      significance: 'childhood-to-womanhood-transition'
    };
    
    return dollTableGroup;
  }

  private createFormalDanceArea(params: CelebratoryParameters): THREE.Object3D {
    const danceAreaGroup = new THREE.Group();
    
    // Dance floor
    const floorGeometry = new THREE.CylinderGeometry(3.0, 3.0, 0.02, 24);
    const floorMaterial = new THREE.MeshPhongMaterial({ 
      color: '#F5F5F5',
      shininess: 100
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = 0.01;
    
    // Decorative border
    const borderGeometry = new THREE.TorusGeometry(3.05, 0.05, 8, 24);
    const borderMaterial = new THREE.MeshPhongMaterial({ 
      color: '#FFD700',
      shininess: 80
    });
    const border = new THREE.Mesh(borderGeometry, borderMaterial);
    border.rotation.x = Math.PI / 2;
    border.position.y = 0.05;
    
    danceAreaGroup.add(floor, border);
    danceAreaGroup.position.set(0, 0, 1);
    
    danceAreaGroup.userData = {
      component: 'formal-dance-area',
      traditions: ['father-daughter-dance', 'court-presentation', 'waltz']
    };
    
    return danceAreaGroup;
  }

  private createQuinceTraditionalDecorations(params: CelebratoryParameters): THREE.Object3D[] {
    const decorations: THREE.Object3D[] = [];
    
    // Traditional papel picado
    const papelPicado = this.createPapelPicadoBanners(params);
    decorations.push(papelPicado);
    
    // Floral arrangements in quinceañera colors
    const florals = this.createQuinceFloralArrangements();
    decorations.push(...florals);
    
    // Luminarias for ambiance
    const luminarias = this.createLuminarias();
    decorations.push(...luminarias);
    
    return decorations;
  }

  private createPapelPicadoBanners(params: CelebratoryParameters): THREE.Object3D {
    const bannerGroup = new THREE.Group();
    
    const bannerCount = 12;
    const bannerWidth = params.spaceDimensions.width * 1.2;
    
    for (let i = 0; i < bannerCount; i++) {
      const bannerGeometry = new THREE.PlaneGeometry(0.3, 0.4);
      const quinceColors = ['#FF69B4', '#FFB6C1', '#FFD700', '#FFFFFF', '#FF1493'];
      const bannerMaterial = new THREE.MeshLambertMaterial({ 
        color: quinceColors[i % quinceColors.length],
        transparent: true,
        opacity: 0.8
      });
      const banner = new THREE.Mesh(bannerGeometry, bannerMaterial);
      
      banner.position.set(
        (i / bannerCount - 0.5) * bannerWidth,
        2.5,
        -params.spaceDimensions.depth * 0.4
      );
      
      // Add decorative cuts (simplified)
      const cutoutGeometry = new THREE.PlaneGeometry(0.25, 0.05);
      const cutoutMaterial = new THREE.MeshLambertMaterial({ 
        color: '#FFFFFF',
        transparent: true,
        opacity: 0.0 // Invisible to simulate cutouts
      });
      const cutout = new THREE.Mesh(cutoutGeometry, cutoutMaterial);
      cutout.position.z = 0.001;
      banner.add(cutout);
      
      bannerGroup.add(banner);
    }
    
    bannerGroup.userData = {
      component: 'papel-picado-banners',
      cultural: 'mexican-celebration-tradition'
    };
    
    return bannerGroup;
  }

  private createQuinceFloralArrangements(): THREE.Object3D[] {
    const florals: THREE.Object3D[] = [];
    
    // Large centerpiece arrangements
    for (let i = 0; i < 4; i++) {
      const floralGroup = new THREE.Group();
      
      // Vase
      const vaseGeometry = new THREE.CylinderGeometry(0.12, 0.08, 0.25, 12);
      const vaseMaterial = new THREE.MeshPhongMaterial({ 
        color: '#C0C0C0',
        shininess: 80
      });
      const vase = new THREE.Mesh(vaseGeometry, vaseMaterial);
      vase.position.y = 0.125;
      
      // Flowers (roses and lilies)
      const flowerCount = 8;
      for (let j = 0; j < flowerCount; j++) {
        const flowerGeometry = new THREE.SphereGeometry(0.03, 8, 6);
        const flowerColors = ['#FF69B4', '#FFFFFF', '#FFB6C1'];
        const flowerMaterial = new THREE.MeshLambertMaterial({ 
          color: flowerColors[j % flowerColors.length]
        });
        const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
        
        const angle = (j / flowerCount) * Math.PI * 2;
        flower.position.set(
          Math.cos(angle) * 0.1,
          0.3 + Math.random() * 0.15,
          Math.sin(angle) * 0.1
        );
        
        floralGroup.add(flower);
      }
      
      floralGroup.add(vase);
      
      // Position arrangements around space
      const angle = (i / 4) * Math.PI * 2;
      floralGroup.position.set(
        Math.cos(angle) * 2.5,
        0,
        Math.sin(angle) * 2.5
      );
      
      floralGroup.userData = {
        component: 'quinceañera-floral-arrangement',
        flowers: ['roses', 'lilies', 'baby-breath']
      };
      
      florals.push(floralGroup);
    }
    
    return florals;
  }

  private createMemoryTable(): THREE.Object3D { return new THREE.Group(); }
  private createLuminarias(): THREE.Object3D[] { return []; }
}

export class BarBatMitzvahTemplate extends CelebratoryTemplate {
  generateBarBatMitzvah(parameters: CelebratoryParameters): THREE.Group {
    console.log(`✡️ Generating Bar/Bat Mitzvah celebration system...`);
    
    const mitzvahSystem = new THREE.Group();
    
    // Torah/reading area
    const torahArea = this.createTorahReadingArea();
    mitzvahSystem.add(torahArea);
    
    // Kiddush/blessing table
    const kiddushTable = this.createKiddushTable();
    mitzvahSystem.add(kiddushTable);
    
    // Memory display area
    const memoryDisplay = this.createFamilyMemoryDisplay();
    mitzvahSystem.add(memoryDisplay);
    
    // Traditional decorations
    const jewishDecorations = this.createJewishTraditionalDecorations(parameters);
    mitzvahSystem.add(...jewishDecorations);
    
    // Learning celebration area
    const learningArea = this.createLearningCelebrationArea();
    mitzvahSystem.add(learningArea);
    
    mitzvahSystem.userData = {
      type: 'bar-bat-mitzvah-celebration',
      traditions: ['torah-reading', 'kiddush-blessing', 'family-celebration', 'learning-honor'],
      culturalSignificance: 'coming-of-age-religious-milestone'
    };
    
    return mitzvahSystem;
  }

  private createTorahReadingArea(): THREE.Object3D {
    const torahAreaGroup = new THREE.Group();
    
    // Reading stand/bimah (simplified)
    const standGeometry = new THREE.BoxGeometry(0.8, 1.0, 0.6);
    const standMaterial = new THREE.MeshPhongMaterial({ 
      color: '#8B4513',
      shininess: 60
    });
    const stand = new THREE.Mesh(standGeometry, standMaterial);
    stand.position.y = 0.5;
    
    // Torah scroll (symbolic)
    const torahGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8);
    const torahMaterial = new THREE.MeshLambertMaterial({ color: '#F5DEB3' });
    const torah1 = new THREE.Mesh(torahGeometry, torahMaterial);
    torah1.position.set(-0.15, 1.05, 0);
    torah1.rotation.z = Math.PI / 2;
    
    const torah2 = new THREE.Mesh(torahGeometry, torahMaterial);
    torah2.position.set(0.15, 1.05, 0);
    torah2.rotation.z = Math.PI / 2;
    
    // Parchment between scrolls
    const parchmentGeometry = new THREE.PlaneGeometry(0.3, 0.2);
    const parchmentMaterial = new THREE.MeshLambertMaterial({ color: '#FFFAF0' });
    const parchment = new THREE.Mesh(parchmentGeometry, parchmentMaterial);
    parchment.rotation.x = -Math.PI / 2;
    parchment.position.y = 1.06;
    
    // Star of David above
    const starGroup = this.createStarOfDavid();
    starGroup.position.set(0, 1.5, 0);
    
    torahAreaGroup.add(stand, torah1, torah2, parchment, starGroup);
    torahAreaGroup.position.set(0, 0, -2);
    
    torahAreaGroup.userData = {
      component: 'torah-reading-area',
      function: 'religious-ceremony',
      tradition: 'torah-study-celebration'
    };
    
    return torahAreaGroup;
  }

  private createStarOfDavid(): THREE.Object3D {
    const starGroup = new THREE.Group();
    
    // Create two triangles to form Star of David
    const triangleGeometry = new THREE.ConeGeometry(0.15, 0.02, 3);
    const starMaterial = new THREE.MeshPhongMaterial({ 
      color: '#0000FF',
      shininess: 80
    });
    
    const triangle1 = new THREE.Mesh(triangleGeometry, starMaterial);
    triangle1.rotation.x = Math.PI / 2;
    
    const triangle2 = new THREE.Mesh(triangleGeometry, starMaterial);
    triangle2.rotation.x = Math.PI / 2;
    triangle2.rotation.z = Math.PI;
    
    starGroup.add(triangle1, triangle2);
    starGroup.userData = {
      component: 'star-of-david',
      significance: 'jewish-identity-symbol'
    };
    
    return starGroup;
  }

  private createKiddushTable(): THREE.Object3D {
    const kiddushGroup = new THREE.Group();
    
    // Ceremonial table
    const tableGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.05, 16);
    const tableMaterial = new THREE.MeshPhongMaterial({ 
      color: '#8B4513',
      shininess: 60
    });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.y = 0.75;
    
    // Table legs
    const legGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.75, 8);
    const legMaterial = new THREE.MeshLambertMaterial({ color: '#654321' });
    
    const legPositions = [
      [0.3, 0.375, 0],
      [-0.3, 0.375, 0],
      [0, 0.375, 0.3],
      [0, 0.375, -0.3]
    ];
    
    legPositions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(pos[0], pos[1], pos[2]);
      kiddushGroup.add(leg);
    });
    
    // Kiddush cup
    const cupGeometry = new THREE.CylinderGeometry(0.04, 0.03, 0.08, 12);
    const cupMaterial = new THREE.MeshPhongMaterial({ 
      color: '#C0C0C0',
      shininess: 100
    });
    const cup = new THREE.Mesh(cupGeometry, cupMaterial);
    cup.position.set(0, 0.82, 0);
    
    // Challah cover (simplified)
    const coverGeometry = new THREE.PlaneGeometry(0.25, 0.15);
    const coverMaterial = new THREE.MeshLambertMaterial({ 
      color: '#FFFFFF',
      transparent: true,
      opacity: 0.8
    });
    const cover = new THREE.Mesh(coverGeometry, coverMaterial);
    cover.rotation.x = -Math.PI / 2;
    cover.position.set(0.15, 0.78, 0.15);
    
    // Candles
    const candlePositions = [[-0.15, 0.78, -0.15], [0.15, 0.78, -0.15]];
    candlePositions.forEach(pos => {
      const candleGeometry = new THREE.CylinderGeometry(0.008, 0.008, 0.12, 8);
      const candleMaterial = new THREE.MeshLambertMaterial({ color: '#FFFAF0' });
      const candle = new THREE.Mesh(candleGeometry, candleMaterial);
      candle.position.set(pos[0], pos[1], pos[2]);
      
      // Flame
      const flameGeometry = new THREE.SphereGeometry(0.01, 6, 6);
      const flameMaterial = new THREE.MeshLambertMaterial({ 
        color: '#FFA500',
        transparent: true,
        opacity: 0.8
      });
      const flame = new THREE.Mesh(flameGeometry, flameMaterial);
      flame.position.y = 0.07;
      flame.scale.y = 1.5;
      candle.add(flame);
      
      kiddushGroup.add(candle);
    });
    
    kiddushGroup.add(table, cup, cover);
    kiddushGroup.position.set(2, 0, -1);
    
    kiddushGroup.userData = {
      component: 'kiddush-blessing-table',
      items: ['kiddush-cup', 'challah-cover', 'sabbath-candles'],
      function: 'religious-blessing-ceremony'
    };
    
    return kiddushGroup;
  }

  private createJewishTraditionalDecorations(params: CelebratoryParameters): THREE.Object3D[] {
    const decorations: THREE.Object3D[] = [];
    
    // Blue and white color scheme decorations
    const colorDecorations = this.createBlueWhiteDecorations();
    decorations.push(...colorDecorations);
    
    // Hebrew-inspired banners
    const hebrewBanners = this.createHebrewStyleBanners();
    decorations.push(hebrewBanners);
    
    // Family heritage display
    const heritageDisplay = this.createHeritageDisplay();
    decorations.push(heritageDisplay);
    
    return decorations;
  }

  private createBlueWhiteDecorations(): THREE.Object3D[] {
    const decorations: THREE.Object3D[] = [];
    
    // Blue and white fabric draping
    const drapingCount = 6;
    for (let i = 0; i < drapingCount; i++) {
      const drapingGeometry = new THREE.PlaneGeometry(0.8, 2.0);
      const drapingMaterial = new THREE.MeshLambertMaterial({ 
        color: i % 2 === 0 ? '#0000FF' : '#FFFFFF',
        transparent: true,
        opacity: 0.7
      });
      const draping = new THREE.Mesh(drapingGeometry, drapingMaterial);
      
      const angle = (i / drapingCount) * Math.PI * 2;
      draping.position.set(
        Math.cos(angle) * 3.0,
        1.5,
        Math.sin(angle) * 3.0
      );
      draping.lookAt(new THREE.Vector3(0, 1.5, 0));
      
      draping.userData = {
        component: 'blue-white-draping',
        significance: 'israeli-flag-colors'
      };
      
      decorations.push(draping);
    }
    
    return decorations;
  }

  private createHebrewStyleBanners(): THREE.Object3D { return new THREE.Group(); }
  private createHeritageDisplay(): THREE.Object3D { return new THREE.Group(); }
  private createFamilyMemoryDisplay(): THREE.Object3D { return new THREE.Group(); }
  private createLearningCelebrationArea(): THREE.Object3D { return new THREE.Group(); }
}

export class KoreanDoljanchTemplate extends CelebratoryTemplate {
  generateDoljanchi(parameters: CelebratoryParameters): THREE.Group {
    console.log(`🍼 Generating Korean Doljanchi (1st Birthday) celebration system...`);
    
    const doljanchSystem = new THREE.Group();
    
    // Traditional doljabi table for object selection ceremony
    const doljabiTable = this.createDoljabiTable();
    doljanchSystem.add(doljabiTable);
    
    // Rainbow rice cake display (traditional dessert)
    const riceCakeDisplay = this.createRainbowRiceCakeDisplay();
    doljanchSystem.add(riceCakeDisplay);
    
    // Hanbok display area
    const hanbokDisplay = this.createHanbokDisplay();
    doljanchSystem.add(hanbokDisplay);
    
    // Korean traditional decorations
    const koreanDecorations = this.createKoreanTraditionalDecorations(parameters);
    doljanchSystem.add(...koreanDecorations);
    
    // Family blessing area
    const blessingArea = this.createFamilyBlessingArea();
    doljanchSystem.add(blessingArea);
    
    doljanchSystem.userData = {
      type: 'korean-doljanchi-celebration',
      traditions: ['doljabi-object-selection', 'rainbow-rice-cake', 'hanbok-wearing', 'family-blessing'],
      culturalSignificance: 'first-birthday-future-prediction-ceremony'
    };
    
    return doljanchSystem;
  }

  private createDoljabiTable(): THREE.Object3D {
    const doljabiGroup = new THREE.Group();
    
    // Low traditional table
    const tableGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.8);
    const tableMaterial = new THREE.MeshLambertMaterial({ color: '#8B4513' });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.y = 0.3;
    
    // Traditional objects for selection ceremony
    const doljabiObjects = [
      { name: 'book', color: '#8B4513', significance: 'scholar-intelligence' },
      { name: 'money', color: '#FFD700', significance: 'wealth-prosperity' },
      { name: 'thread', color: '#FFFFFF', significance: 'longevity' },
      { name: 'rice', color: '#F5DEB3', significance: 'abundance-never-hungry' },
      { name: 'pencil', color: '#FFFF00', significance: 'artist-writer' },
      { name: 'ball', color: '#FF0000', significance: 'athlete-health' }
    ];
    
    doljabiObjects.forEach((obj, index) => {
      const objGeometry = new THREE.BoxGeometry(0.08, 0.03, 0.08);
      const objMaterial = new THREE.MeshLambertMaterial({ color: obj.color });
      const object = new THREE.Mesh(objGeometry, objMaterial);
      
      object.position.set(
        (index % 3 - 1) * 0.25,
        0.37,
        Math.floor(index / 3) * 0.2 - 0.1
      );
      
      object.userData = {
        component: 'doljabi-object',
        name: obj.name,
        significance: obj.significance
      };
      
      doljabiGroup.add(object);
    });
    
    // Decorative table cloth
    const clothGeometry = new THREE.PlaneGeometry(1.6, 0.9);
    const clothMaterial = new THREE.MeshLambertMaterial({ 
      color: '#FF0000',
      transparent: true,
      opacity: 0.6
    });
    const cloth = new THREE.Mesh(clothGeometry, clothMaterial);
    cloth.rotation.x = -Math.PI / 2;
    cloth.position.y = 0.31;
    
    doljabiGroup.add(table, cloth);
    doljabiGroup.position.set(0, 0, 0);
    
    doljabiGroup.userData = {
      component: 'doljabi-ceremony-table',
      tradition: 'future-prediction-object-selection',
      culturalSignificance: 'child-destiny-prediction'
    };
    
    return doljabiGroup;
  }

  private createRainbowRiceCakeDisplay(): THREE.Object3D {
    const riceCakeGroup = new THREE.Group();
    
    // Display stand
    const standGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.05, 16);
    const standMaterial = new THREE.MeshPhongMaterial({ 
      color: '#FFFFFF',
      shininess: 80
    });
    const stand = new THREE.Mesh(standGeometry, standMaterial);
    stand.position.y = 0.6;
    
    // Rainbow-colored rice cake layers
    const rainbowColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
    
    rainbowColors.forEach((color, index) => {
      const layerGeometry = new THREE.CylinderGeometry(0.2 - index * 0.02, 0.2 - index * 0.02, 0.03, 16);
      const layerMaterial = new THREE.MeshLambertMaterial({ color: color });
      const layer = new THREE.Mesh(layerGeometry, layerMaterial);
      layer.position.y = 0.63 + index * 0.035;
      riceCakeGroup.add(layer);
    });
    
    // Decorative elements on top
    const topDecorGeometry = new THREE.SphereGeometry(0.02, 8, 6);
    const topDecorMaterial = new THREE.MeshPhongMaterial({ 
      color: '#FFD700',
      shininess: 100
    });
    const topDecor = new THREE.Mesh(topDecorGeometry, topDecorMaterial);
    topDecor.position.y = 0.9;
    
    riceCakeGroup.add(stand, topDecor);
    riceCakeGroup.position.set(-2, 0, 1);
    
    riceCakeGroup.userData = {
      component: 'rainbow-rice-cake-display',
      tradition: 'korean-traditional-dessert',
      colors: 'rainbow-seven-colors',
      significance: 'colorful-bright-future'
    };
    
    return riceCakeGroup;
  }

  private createKoreanTraditionalDecorations(params: CelebratoryParameters): THREE.Object3D[] {
    const decorations: THREE.Object3D[] = [];
    
    // Traditional Korean patterns and symbols
    const patterns = this.createKoreanPatterns();
    decorations.push(...patterns);
    
    // Longevity symbols
    const longevitySymbols = this.createLongevitySymbols();
    decorations.push(...longevitySymbols);
    
    // Traditional color decorations (five colors: 오방색)
    const colorDecorations = this.createObangSaekDecorations();
    decorations.push(...colorDecorations);
    
    return decorations;
  }

  private createKoreanPatterns(): THREE.Object3D[] {
    const patterns: THREE.Object3D[] = [];
    
    // Traditional Korean cloud patterns
    for (let i = 0; i < 4; i++) {
      const cloudGeometry = new THREE.PlaneGeometry(0.3, 0.2);
      const cloudMaterial = new THREE.MeshLambertMaterial({ 
        color: '#87CEEB',
        transparent: true,
        opacity: 0.7
      });
      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
      
      cloud.position.set(
        (i % 2 - 0.5) * 4,
        2.5,
        Math.floor(i / 2) * 3 - 1.5
      );
      
      cloud.userData = {
        component: 'korean-cloud-pattern',
        significance: 'prosperity-good-fortune'
      };
      
      patterns.push(cloud);
    }
    
    return patterns;
  }

  private createLongevitySymbols(): THREE.Object3D[] {
    const symbols: THREE.Object3D[] = [];
    
    // Crane symbols (longevity in Korean culture)
    for (let i = 0; i < 2; i++) {
      const craneGroup = new THREE.Group();
      
      // Simplified crane body
      const bodyGeometry = new THREE.SphereGeometry(0.05, 8, 6);
      const bodyMaterial = new THREE.MeshLambertMaterial({ color: '#FFFFFF' });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      
      // Crane neck
      const neckGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.08, 6);
      const neckMaterial = new THREE.MeshLambertMaterial({ color: '#FFFFFF' });
      const neck = new THREE.Mesh(neckGeometry, neckMaterial);
      neck.position.y = 0.08;
      neck.rotation.z = Math.PI / 6;
      
      // Wings
      const wingGeometry = new THREE.PlaneGeometry(0.08, 0.04);
      const wingMaterial = new THREE.MeshLambertMaterial({ color: '#F5F5F5' });
      const wing1 = new THREE.Mesh(wingGeometry, wingMaterial);
      wing1.position.set(-0.04, 0.02, 0);
      wing1.rotation.z = Math.PI / 4;
      
      const wing2 = new THREE.Mesh(wingGeometry, wingMaterial);
      wing2.position.set(0.04, 0.02, 0);
      wing2.rotation.z = -Math.PI / 4;
      
      craneGroup.add(body, neck, wing1, wing2);
      craneGroup.position.set(
        i * 4 - 2,
        2.0,
        2
      );
      
      craneGroup.userData = {
        component: 'korean-crane-symbol',
        significance: 'longevity-wisdom-good-fortune'
      };
      
      symbols.push(craneGroup);
    }
    
    return symbols;
  }

  private createObangSaekDecorations(): THREE.Object3D[] {
    const decorations: THREE.Object3D[] = [];
    
    // Five traditional Korean colors (오방색)
    const obangSaekColors = [
      { color: '#FF0000', direction: 'south', element: 'fire' },
      { color: '#000000', direction: 'north', element: 'water' },
      { color: '#FFFFFF', direction: 'west', element: 'metal' },
      { color: '#0000FF', direction: 'east', element: 'wood' },
      { color: '#FFFF00', direction: 'center', element: 'earth' }
    ];
    
    obangSaekColors.forEach((colorData, index) => {
      const decorGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.02, 16);
      const decorMaterial = new THREE.MeshLambertMaterial({ color: colorData.color });
      const decoration = new THREE.Mesh(decorGeometry, decorMaterial);
      
      const angle = (index / 5) * Math.PI * 2;
      decoration.position.set(
        Math.cos(angle) * 2.5,
        1.5,
        Math.sin(angle) * 2.5
      );
      
      decoration.userData = {
        component: 'obangsaek-decoration',
        color: colorData.color,
        direction: colorData.direction,
        element: colorData.element,
        significance: 'five-elements-protection'
      };
      
      decorations.push(decoration);
    });
    
    return decorations;
  }

  private createHanbokDisplay(): THREE.Object3D { return new THREE.Group(); }
  private createFamilyBlessingArea(): THREE.Object3D { return new THREE.Group(); }
}

// Testing functions for cultural celebration templates
export function createTestQuinceañera(): THREE.Group {
  const quinceTemplate = new QuinceañeraTemplate();
  
  const testQuinceParams: CelebratoryParameters = {
    celebrationType: 'cultural-milestone',
    ageGroup: 'teen',
    theme: 'cultural-traditional',
    culture: 'mexican',
    culturalTraditions: ['doll-ceremony', 'shoe-changing', 'crown-ceremony'],
    religiousConsiderations: ['catholic-blessing'],
    familyCustoms: ['extended-family-celebration'],
    guestCount: 150,
    childrenCount: 20,
    adultCount: 130,
    specialNeeds: [],
    duration: 6,
    timeOfDay: 'evening',
    seasonality: 'year-round',
    spaceDimensions: { width: 15, depth: 20, height: 4, indoorOutdoor: 'indoor' },
    existingElements: ['dance-floor', 'sound-system'],
    spaceConstraints: [],
    balloonSystems: true,
    photoBackdrops: true,
    interactiveProps: false,
    ceremonialElements: true,
    giftDisplayAreas: true,
    entertainmentProps: true,
    colorScheme: 'cultural-palette',
    customColors: ['#FF69B4', '#FFD700', '#FFFFFF'],
    materialPreferences: ['silk', 'satin', 'flowers'],
    sustainabilityLevel: 'moderate',
    ageAppropriateActivities: true,
    photoOpportunities: 3,
    interactiveZones: 2,
    safetyRequirements: ['supervised-activities'],
    budget: 15000,
    setupTime: 8,
    cleanupComplexity: 'moderate',
    transportability: 'multiple-trips',
    surpriseElements: true,
    personalizedTouches: true,
    keepsakeElements: true,
    documentationSupport: true
  };
  
  return quinceTemplate.generateQuinceañera(testQuinceParams);
}

export function createTestBarMitzvah(): THREE.Group {
  const mitzvahTemplate = new BarBatMitzvahTemplate();
  
  const testMitzvahParams: CelebratoryParameters = {
    celebrationType: 'bar-bat-mitzvah',
    ageGroup: 'teen',
    theme: 'cultural-traditional',
    culture: 'jewish',
    culturalTraditions: ['torah-reading', 'kiddush-blessing', 'family-celebration'],
    religiousConsiderations: ['kosher-requirements', 'sabbath-observance'],
    familyCustoms: ['multi-generational-celebration'],
    guestCount: 80,
    childrenCount: 15,
    adultCount: 65,
    specialNeeds: ['wheelchair-accessibility'],
    duration: 4,
    timeOfDay: 'afternoon',
    seasonality: 'year-round',
    spaceDimensions: { width: 12, depth: 15, height: 3.5, indoorOutdoor: 'indoor' },
    existingElements: ['bimah', 'seating-arrangements'],
    spaceConstraints: ['religious-requirements'],
    balloonSystems: true,
    photoBackdrops: true,
    interactiveProps: true,
    ceremonialElements: true,
    giftDisplayAreas: true,
    entertainmentProps: false,
    colorScheme: 'cultural-palette',
    customColors: ['#0000FF', '#FFFFFF', '#C0C0C0'],
    materialPreferences: ['natural-materials', 'traditional-fabrics'],
    sustainabilityLevel: 'high',
    ageAppropriateActivities: true,
    photoOpportunities: 2,
    interactiveZones: 1,
    safetyRequirements: ['kosher-safe-materials'],
    budget: 8000,
    setupTime: 6,
    cleanupComplexity: 'moderate',
    transportability: 'multiple-trips',
    surpriseElements: false,
    personalizedTouches: true,
    keepsakeElements: true,
    documentationSupport: true
  };
  
  return mitzvahTemplate.generateBarBatMitzvah(testMitzvahParams);
}

export function createTestDoljanchi(): THREE.Group {
  const doljanchTemplate = new KoreanDoljanchTemplate();
  
  const testDoljanchParams: CelebratoryParameters = {
    celebrationType: 'birthday-child',
    ageGroup: 'toddler',
    theme: 'cultural-traditional',
    culture: 'korean',
    culturalTraditions: ['doljabi-ceremony', 'rainbow-rice-cake', 'hanbok-wearing'],
    religiousConsiderations: [],
    familyCustoms: ['family-blessing', 'elder-respect'],
    guestCount: 30,
    childrenCount: 5,
    adultCount: 25,
    specialNeeds: ['child-safe-environment'],
    duration: 3,
    timeOfDay: 'afternoon',
    seasonality: 'year-round',
    spaceDimensions: { width: 8, depth: 10, height: 3, indoorOutdoor: 'indoor' },
    existingElements: ['family-seating'],
    spaceConstraints: ['child-safety'],
    balloonSystems: true,
    photoBackdrops: true,
    interactiveProps: true,
    ceremonialElements: true,
    giftDisplayAreas: true,
    entertainmentProps: true,
    colorScheme: 'cultural-palette',
    customColors: ['#FF0000', '#0000FF', '#FFFF00', '#FFFFFF', '#000000'],
    materialPreferences: ['natural-materials', 'child-safe'],
    sustainabilityLevel: 'high',
    ageAppropriateActivities: true,
    photoOpportunities: 2,
    interactiveZones: 2,
    safetyRequirements: ['child-safe-materials', 'supervised-play'],
    budget: 3000,
    setupTime: 4,
    cleanupComplexity: 'simple',
    transportability: 'single-trip',
    surpriseElements: true,
    personalizedTouches: true,
    keepsakeElements: true,
    documentationSupport: true
  };
  
  return doljanchTemplate.generateDoljanchi(testDoljanchParams);
}

// Note: Classes are already exported with their declarations above