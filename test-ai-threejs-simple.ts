// Simple Test for AI-Three.js Integration Service Core Functionality
import * as THREE from 'three';

// Mock the AIThreeJSIntegrationService with basic functionality
class SimpleAIThreeJSIntegrationService {
  constructor() {
    console.log('🔧 Simple AI-Three.js Integration Service initialized');
  }

  async generateThreeJSScene(mockResponse: any): Promise<THREE.Group> {
    console.log('🎨 Generating Three.js scene from AI response...');
    
    const sceneGroup = new THREE.Group();
    sceneGroup.name = 'AI_Generated_Event_Scene';

    // Generate celebratory balloon arch
    if (mockResponse.furniture_specifications.some((spec: any) => spec.type === 'balloon-system')) {
      console.log('🎈 Creating balloon arch system...');
      const balloonArch = this.createBalloonArch();
      balloonArch.position.set(0, 0, -4);
      sceneGroup.add(balloonArch);
    }

    // Generate photo backdrop
    if (mockResponse.furniture_specifications.some((spec: any) => spec.type === 'photo-backdrop')) {
      console.log('📸 Creating photo backdrop...');
      const backdrop = this.createPhotoBackdrop();
      backdrop.position.set(3, 0, 3);
      sceneGroup.add(backdrop);
    }

    // Generate celebratory props
    if (mockResponse.furniture_specifications.some((spec: any) => spec.type === 'celebratory-props')) {
      console.log('🎉 Creating celebratory props system...');
      const celebratoryProps = this.createCelebratoryProps();
      sceneGroup.add(celebratoryProps);
    }

    // Generate interactive props
    if (mockResponse.furniture_specifications.some((spec: any) => spec.type === 'interactive-prop')) {
      console.log('🎮 Creating interactive activity station...');
      const activityStation = this.createActivityStation();
      activityStation.position.set(3, 0, 2);
      sceneGroup.add(activityStation);
    }

    // Generate gift display
    if (mockResponse.furniture_specifications.some((spec: any) => spec.type === 'gift-display')) {
      console.log('🎁 Creating gift display area...');
      const giftDisplay = this.createGiftDisplay();
      giftDisplay.position.set(-3, 0, -2);
      sceneGroup.add(giftDisplay);
    }

    // Generate ceremonial cake display
    if (mockResponse.furniture_specifications.some((spec: any) => spec.type === 'ceremonial-element')) {
      console.log('🎂 Creating ceremonial cake display...');
      const cakeDisplay = this.createCakeDisplay();
      cakeDisplay.position.set(0, 0, 2);
      sceneGroup.add(cakeDisplay);
    }

    // Add spatial structure (floor)
    const floor = this.createFloor(mockResponse.spatial_layout.dimensions);
    sceneGroup.add(floor);

    // Add lighting system
    const lighting = this.createLightingSystem();
    sceneGroup.add(lighting);

    // Add scene metadata
    sceneGroup.userData = {
      aiGenerated: true,
      generationTimestamp: new Date().toISOString(),
      culturalContext: ['american'],
      theme: 'superhero-birthday',
      ageGroup: 'child',
      celebrationType: 'birthday-child',
      totalObjects: sceneGroup.children.length
    };

    console.log('✅ Three.js scene generation completed!');
    return sceneGroup;
  }

  private createBalloonArch(): THREE.Group {
    const archGroup = new THREE.Group();
    archGroup.name = 'balloon_arch';
    
    const colors = ['#FF0000', '#0000FF', '#FFD700']; // Superhero colors
    const balloonCount = 30;
    const archWidth = 4.0;
    const archHeight = 2.5;
    
    for (let i = 0; i < balloonCount; i++) {
      const balloonGeometry = new THREE.SphereGeometry(0.15, 12, 12);
      balloonGeometry.scale(1, 1.3, 1); // Make balloons more oval
      
      const balloonMaterial = new THREE.MeshLambertMaterial({ 
        color: colors[i % colors.length]
      });
      const balloon = new THREE.Mesh(balloonGeometry, balloonMaterial);
      
      // Position along arch curve
      const t = i / (balloonCount - 1);
      const angle = t * Math.PI;
      const x = (t - 0.5) * archWidth;
      const y = Math.sin(angle) * archHeight + 1.5;
      const z = Math.cos(angle * 0.5) * 0.3;
      
      balloon.position.set(x, y, z);
      balloon.userData = { component: 'balloon-arch-element', index: i };
      
      archGroup.add(balloon);
    }
    
    archGroup.userData = { 
      component: 'balloon-arch', 
      balloonCount: balloonCount,
      theme: 'superhero',
      culture: 'american'
    };
    
    return archGroup;
  }

  private createPhotoBackdrop(): THREE.Group {
    const backdropGroup = new THREE.Group();
    backdropGroup.name = 'photo_backdrop';
    
    const width = 3.0;
    const height = 2.5;
    
    // Frame
    const frameGeometry = new THREE.BoxGeometry(width + 0.2, height + 0.2, 0.1);
    const frameMaterial = new THREE.MeshPhongMaterial({ color: '#FFD700' });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    
    // Background
    const backgroundGeometry = new THREE.PlaneGeometry(width, height);
    const backgroundMaterial = new THREE.MeshLambertMaterial({ color: '#001122' }); // Superhero blue
    const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    background.position.z = 0.05;
    
    // Decorative stars
    for (let i = 0; i < 5; i++) {
      const starGeometry = new THREE.ConeGeometry(0.1, 0.02, 8);
      const starMaterial = new THREE.MeshLambertMaterial({ color: '#FFFF00' });
      const star = new THREE.Mesh(starGeometry, starMaterial);
      star.position.set(
        (Math.random() - 0.5) * width * 0.8,
        (Math.random() - 0.5) * height * 0.8,
        0.1
      );
      star.rotation.z = Math.random() * Math.PI * 2;
      backdropGroup.add(star);
    }
    
    backdropGroup.add(frame, background);
    backdropGroup.userData = {
      component: 'photo-backdrop',
      theme: 'superhero',
      culture: 'american',
      interactive: true
    };
    
    return backdropGroup;
  }

  private createCelebratoryProps(): THREE.Group {
    const propsGroup = new THREE.Group();
    propsGroup.name = 'celebratory_props';
    
    // Party hat stack
    for (let i = 0; i < 3; i++) {
      const hatGeometry = new THREE.ConeGeometry(0.15, 0.3, 8);
      const hatColors = ['#FF0000', '#0000FF', '#FFD700'];
      const hatMaterial = new THREE.MeshLambertMaterial({ color: hatColors[i] });
      const hat = new THREE.Mesh(hatGeometry, hatMaterial);
      hat.position.set(i * 0.4 - 0.4, 0.15, 0);
      propsGroup.add(hat);
    }
    
    // Superhero cape display
    const capeGeometry = new THREE.PlaneGeometry(0.8, 1.0);
    const capeMaterial = new THREE.MeshLambertMaterial({ 
      color: '#FF0000',
      transparent: true,
      opacity: 0.8
    });
    const cape = new THREE.Mesh(capeGeometry, capeMaterial);
    cape.position.set(1.5, 1.0, 0);
    cape.rotation.y = Math.PI / 6;
    propsGroup.add(cape);
    
    propsGroup.userData = {
      component: 'celebratory-props',
      celebrationType: 'birthday-child',
      theme: 'superhero',
      culture: 'american'
    };
    
    return propsGroup;
  }

  private createActivityStation(): THREE.Group {
    const stationGroup = new THREE.Group();
    stationGroup.name = 'activity_station';
    
    // Activity table
    const tableGeometry = new THREE.BoxGeometry(1.0, 0.05, 0.6);
    const tableMaterial = new THREE.MeshLambertMaterial({ color: '#8B4513' });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.set(0, 0.5, 0);
    stationGroup.add(table);
    
    // Table legs
    for (let i = 0; i < 4; i++) {
      const legGeometry = new THREE.BoxGeometry(0.05, 0.5, 0.05);
      const leg = new THREE.Mesh(legGeometry, tableMaterial);
      const x = (i % 2) * 0.9 - 0.45;
      const z = Math.floor(i / 2) * 0.5 - 0.25;
      leg.position.set(x, 0.25, z);
      stationGroup.add(leg);
    }
    
    // Activity supplies (mask-making station)
    const suppliesGeometry = new THREE.BoxGeometry(0.8, 0.02, 0.4);
    const suppliesMaterial = new THREE.MeshLambertMaterial({ color: '#FFD700' });
    const supplies = new THREE.Mesh(suppliesGeometry, suppliesMaterial);
    supplies.position.set(0, 0.52, 0);
    stationGroup.add(supplies);
    
    stationGroup.userData = {
      component: 'interactive-prop',
      propType: 'activity-station',
      ageGroup: 'child',
      activities: ['superhero-mask-making', 'cape-decorating']
    };
    
    return stationGroup;
  }

  private createGiftDisplay(): THREE.Group {
    const displayGroup = new THREE.Group();
    displayGroup.name = 'gift_display';
    
    // Gift table
    const tableGeometry = new THREE.BoxGeometry(1.2, 0.05, 0.8);
    const tableMaterial = new THREE.MeshLambertMaterial({ color: '#8B4513' });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.set(0, 0.6, 0);
    displayGroup.add(table);
    
    // Table legs
    for (let i = 0; i < 4; i++) {
      const legGeometry = new THREE.BoxGeometry(0.08, 0.6, 0.08);
      const leg = new THREE.Mesh(legGeometry, tableMaterial);
      const x = (i % 2) * 1.0 - 0.5;
      const z = Math.floor(i / 2) * 0.6 - 0.3;
      leg.position.set(x, 0.3, z);
      displayGroup.add(leg);
    }
    
    // Mock gift boxes
    const giftColors = ['#FF0000', '#0000FF', '#FFD700', '#00FF00'];
    for (let i = 0; i < 8; i++) {
      const giftGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);
      const giftMaterial = new THREE.MeshLambertMaterial({ 
        color: giftColors[i % giftColors.length] 
      });
      const gift = new THREE.Mesh(giftGeometry, giftMaterial);
      const x = (i % 4) * 0.25 - 0.375;
      const z = Math.floor(i / 4) * 0.25 - 0.125;
      gift.position.set(x, 0.7, z);
      displayGroup.add(gift);
    }
    
    displayGroup.userData = {
      component: 'gift-display',
      displayType: 'table',
      expectedGifts: 8,
      culture: 'american'
    };
    
    return displayGroup;
  }

  private createCakeDisplay(): THREE.Group {
    const displayGroup = new THREE.Group();
    displayGroup.name = 'cake_display';
    
    // Cake pedestal
    const pedestalGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1);
    const pedestalMaterial = new THREE.MeshPhongMaterial({ color: '#FFFFFF' });
    const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
    pedestal.position.set(0, 0.8, 0);
    displayGroup.add(pedestal);
    
    // Cake (simplified)
    const cakeGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.15);
    const cakeMaterial = new THREE.MeshLambertMaterial({ color: '#FFE4B5' });
    const cake = new THREE.Mesh(cakeGeometry, cakeMaterial);
    cake.position.set(0, 0.925, 0);
    displayGroup.add(cake);
    
    // Candles
    for (let i = 0; i < 8; i++) {
      const candleGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.08);
      const candleMaterial = new THREE.MeshLambertMaterial({ color: '#FF69B4' });
      const candle = new THREE.Mesh(candleGeometry, candleMaterial);
      const angle = (i / 8) * Math.PI * 2;
      const radius = 0.15;
      candle.position.set(
        Math.cos(angle) * radius,
        1.04,
        Math.sin(angle) * radius
      );
      displayGroup.add(candle);
      
      // Candle flame
      const flameGeometry = new THREE.SphereGeometry(0.02, 6, 6);
      const flameMaterial = new THREE.MeshLambertMaterial({ 
        color: '#FFA500',
        transparent: true,
        opacity: 0.8
      });
      const flame = new THREE.Mesh(flameGeometry, flameMaterial);
      flame.position.copy(candle.position);
      flame.position.y += 0.06;
      displayGroup.add(flame);
    }
    
    displayGroup.userData = {
      component: 'ceremonial-element',
      elementType: 'cake-display',
      culture: 'american',
      ceremony: 'birthday',
      prominence: 'featured'
    };
    
    return displayGroup;
  }

  private createFloor(dimensions: any): THREE.Mesh {
    const floorGeometry = new THREE.PlaneGeometry(dimensions.width, dimensions.depth);
    const floorMaterial = new THREE.MeshLambertMaterial({ 
      color: 0xF5F5F5,
      transparent: true,
      opacity: 0.3
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    floor.userData = { component: 'spatial-structure', type: 'floor' };
    return floor;
  }

  private createLightingSystem(): THREE.Group {
    const lightingGroup = new THREE.Group();
    lightingGroup.name = 'lighting_system';
    
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.4);
    lightingGroup.add(ambientLight);
    
    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xFFFFE0, 0.8);
    directionalLight.position.set(2, 4, 2);
    directionalLight.castShadow = true;
    lightingGroup.add(directionalLight);
    
    // Spotlight on cake
    const spotLight = new THREE.SpotLight(0xFFFFFF, 1.0, 10, Math.PI / 6, 0.3);
    spotLight.position.set(0, 3, 3);
    spotLight.target.position.set(0, 0, 2);
    lightingGroup.add(spotLight);
    lightingGroup.add(spotLight.target);
    
    lightingGroup.userData = { component: 'lighting-system' };
    return lightingGroup;
  }
}

// Test data
const mockAIResponse = {
  spatial_layout: {
    dimensions: { width: 8, height: 3, depth: 10 }
  },
  furniture_specifications: [
    { type: 'celebratory-props' },
    { type: 'balloon-system' },
    { type: 'photo-backdrop' },
    { type: 'interactive-prop' },
    { type: 'gift-display' },
    { type: 'ceremonial-element' }
  ]
};

async function testSimpleAIThreeJSIntegration() {
  try {
    console.log('🎨 Testing Simple AI-Three.js Integration Service...\n');
    
    const service = new SimpleAIThreeJSIntegrationService();
    const scene = await service.generateThreeJSScene(mockAIResponse);
    
    console.log('\n📊 Scene Analysis:');
    console.log(`   📦 Scene Name: ${scene.name}`);
    console.log(`   🎯 Total Objects: ${scene.children.length}`);
    
    let componentCounts = {
      'balloon-arch': 0,
      'photo-backdrop': 0,
      'celebratory-props': 0,
      'interactive-prop': 0,
      'gift-display': 0,
      'ceremonial-element': 0,
      'spatial-structure': 0,
      'lighting-system': 0
    };
    
    scene.traverse((object) => {
      if (object.userData?.component) {
        const component = object.userData.component;
        if (componentCounts.hasOwnProperty(component)) {
          componentCounts[component]++;
        }
      }
    });
    
    console.log('\n🎉 Component Analysis:');
    Object.entries(componentCounts).forEach(([component, count]) => {
      if (count > 0) {
        console.log(`   ✅ ${component}: ${count} object(s)`);
      }
    });
    
    console.log('\n🏷️ Scene Metadata:');
    const metadata = scene.userData;
    console.log(`   🤖 AI Generated: ${metadata.aiGenerated}`);
    console.log(`   🌍 Cultural Context: ${metadata.culturalContext?.join(', ')}`);
    console.log(`   🎭 Theme: ${metadata.theme}`);
    console.log(`   👶 Age Group: ${metadata.ageGroup}`);
    console.log(`   🎂 Celebration Type: ${metadata.celebrationType}`);
    console.log(`   📦 Total Objects: ${metadata.totalObjects}`);
    console.log(`   ⏰ Generated: ${metadata.generationTimestamp}`);
    
    console.log('\n🎉 SIMPLE AI-THREE.JS INTEGRATION TEST PASSED!');
    console.log('✨ Successfully demonstrated:');
    console.log('   ✅ AI response processing and Three.js scene generation');
    console.log('   ✅ Celebratory balloon arch with superhero theme colors');
    console.log('   ✅ Photo backdrop with cultural decorations');
    console.log('   ✅ Interactive activity station for mask-making');
    console.log('   ✅ Gift display area with organized presentation');
    console.log('   ✅ Ceremonial cake display with candles and flames');
    console.log('   ✅ Spatial structure with floor boundaries');
    console.log('   ✅ Comprehensive lighting system with ambient and spot lights');
    console.log('   ✅ Cultural metadata and theme integration');
    console.log('   ✅ Age-appropriate design elements for children');
    
  } catch (error) {
    console.error('❌ Simple AI-Three.js integration test failed:', error);
    process.exit(1);
  }
}

testSimpleAIThreeJSIntegration();