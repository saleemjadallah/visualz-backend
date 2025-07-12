// Parametric Stage/Entertainment Area Template
import * as THREE from 'three';
export class StageTemplate {
    constructor() {
        this.performanceSpecs = new Map();
        this.culturalStagingTraditions = new Map();
        this.technicalRequirements = new Map();
        this.initializePerformanceSpecs();
        this.initializeCulturalTraditions();
        this.initializeTechnicalRequirements();
    }
    generateStageSystem(parameters) {
        console.log(`🎭 Generating ${parameters.culture} stage for ${parameters.performanceType}...`);
        // Step 1: Calculate stage dimensions and requirements
        const stageSpecs = this.calculateStageRequirements(parameters);
        // Step 2: Generate main stage platform
        const stageSystem = new THREE.Group();
        const mainStage = this.generateMainStage(stageSpecs, parameters);
        // Step 3: Add technical equipment
        const audioSystem = this.generateAudioSystem(stageSpecs, parameters);
        const visualSystem = this.generateVisualSystem(stageSpecs, parameters);
        const lightingSystem = this.generateStageLighting(stageSpecs, parameters);
        // Step 4: Add cultural staging elements
        const culturalElements = this.addCulturalStageElements(parameters);
        // Step 5: Add accessibility features
        let accessibilityFeatures = [];
        if (parameters.accessibilityRequired) {
            accessibilityFeatures = this.generateAccessibilityFeatures(stageSpecs, parameters);
        }
        // Step 6: Assemble complete system
        stageSystem.add(mainStage, ...audioSystem, ...visualSystem, ...lightingSystem, ...culturalElements, ...accessibilityFeatures);
        // Step 7: Apply stage materials and finishes
        this.applyStageMaterials(stageSystem, parameters);
        stageSystem.userData = {
            type: 'stage-entertainment-system',
            performanceType: parameters.performanceType,
            culture: parameters.culture,
            capacity: parameters.audienceSize,
            specifications: stageSpecs,
            accessibilityCompliant: parameters.accessibilityRequired,
            estimatedCost: this.calculateStageCost(parameters, stageSpecs),
            generatedAt: Date.now()
        };
        console.log(`✨ ${parameters.culture} stage system generated successfully!`);
        return stageSystem;
    }
    calculateStageRequirements(params) {
        const performanceData = this.performanceSpecs.get(params.performanceType);
        const culturalData = this.culturalStagingTraditions.get(params.culture);
        // Calculate optimal stage dimensions
        const audienceAdjustment = Math.sqrt(params.audienceSize / 50); // Scale factor
        const stageWidth = Math.min(params.spaceDimensions.width * 0.3, performanceData.idealWidth * audienceAdjustment);
        const stageDepth = Math.min(params.spaceDimensions.depth * 0.2, performanceData.idealDepth * audienceAdjustment);
        const stageHeight = Math.min(params.spaceDimensions.maxHeight * 0.15, performanceData.idealHeight);
        return {
            dimensions: {
                width: stageWidth,
                depth: stageDepth,
                height: stageHeight
            },
            audienceViewingAngle: performanceData.viewingAngle,
            technicalRequirements: performanceData.technical,
            culturalAdaptations: culturalData.adaptations,
            powerRequirements: performanceData.power,
            acousticRequirements: performanceData.acoustics
        };
    }
    generateMainStage(specs, params) {
        const stageGroup = new THREE.Group();
        // Main platform
        const platformGeometry = new THREE.BoxGeometry(specs.dimensions.width, specs.dimensions.height, specs.dimensions.depth);
        const platformMaterial = new THREE.MeshLambertMaterial({ color: '#2F2F2F' });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.y = specs.dimensions.height / 2;
        platform.userData.component = 'stage-platform';
        // Apply cultural platform design
        const culturalPlatform = this.applyCulturalPlatformDesign(platform, params);
        // Stage access
        if (params.accessibilityRequired) {
            const ramp = this.createAccessibleRamp(specs.dimensions);
            stageGroup.add(ramp);
        }
        else {
            const steps = this.createStageSteps(specs.dimensions);
            stageGroup.add(...steps);
        }
        // Safety barriers if elevated
        if (specs.dimensions.height > 0.3) {
            const barriers = this.createSafetyBarriers(specs.dimensions);
            stageGroup.add(...barriers);
        }
        stageGroup.add(platform, ...culturalPlatform);
        return stageGroup;
    }
    createAccessibleRamp(dimensions) {
        const rampGroup = new THREE.Group();
        const rampWidth = 1.2; // ADA compliant 4 feet wide
        const rampLength = dimensions.height * 12; // 1:12 slope ratio
        // Main ramp surface
        const rampGeometry = new THREE.BoxGeometry(rampWidth, 0.05, rampLength);
        const rampMaterial = new THREE.MeshLambertMaterial({ color: '#4F4F4F' });
        const ramp = new THREE.Mesh(rampGeometry, rampMaterial);
        ramp.position.set(-(dimensions.width / 2) - (rampWidth / 2) - 0.1, dimensions.height / 2, rampLength / 2 - dimensions.depth / 2);
        ramp.rotation.x = -Math.atan(dimensions.height / rampLength);
        // Ramp handrails
        const handrails = this.createRampHandrails(rampWidth, rampLength, dimensions.height);
        handrails.forEach(handrail => {
            handrail.position.copy(ramp.position);
            handrail.rotation.copy(ramp.rotation);
            rampGroup.add(handrail);
        });
        rampGroup.add(ramp);
        rampGroup.userData.component = 'accessibility-ramp';
        return rampGroup;
    }
    createRampHandrails(width, length, height) {
        const handrails = [];
        // Left and right handrails
        for (let side = 0; side < 2; side++) {
            const handrailGeometry = new THREE.CylinderGeometry(0.02, 0.02, length, 8);
            const handrailMaterial = new THREE.MeshLambertMaterial({ color: '#666666' });
            const handrail = new THREE.Mesh(handrailGeometry, handrailMaterial);
            handrail.position.x = (side === 0 ? -1 : 1) * (width / 2 + 0.05);
            handrail.position.y = 0.9; // Standard handrail height
            handrail.rotation.z = Math.PI / 2;
            handrails.push(handrail);
        }
        return handrails;
    }
    createStageSteps(dimensions) {
        const steps = [];
        const stepHeight = 0.2; // 20cm per step
        const stepCount = Math.ceil(dimensions.height / stepHeight);
        const actualStepHeight = dimensions.height / stepCount;
        for (let i = 0; i < stepCount; i++) {
            const stepGeometry = new THREE.BoxGeometry(dimensions.width, actualStepHeight, 0.3 // 30cm deep steps
            );
            const stepMaterial = new THREE.MeshLambertMaterial({ color: '#3F3F3F' });
            const step = new THREE.Mesh(stepGeometry, stepMaterial);
            step.position.set(0, actualStepHeight * (i + 0.5), -(dimensions.depth / 2) - 0.15 - (i * 0.3));
            step.userData.component = 'stage-step';
            steps.push(step);
        }
        return steps;
    }
    createSafetyBarriers(dimensions) {
        const barriers = [];
        const barrierHeight = 1.1; // Standard safety height
        // Front barrier (optional, based on height)
        if (dimensions.height > 0.5) {
            const frontBarrier = this.createBarrierSegment(dimensions.width, barrierHeight);
            frontBarrier.position.set(0, dimensions.height + barrierHeight / 2, dimensions.depth / 2 + 0.05);
            barriers.push(frontBarrier);
        }
        // Side barriers
        const leftBarrier = this.createBarrierSegment(dimensions.depth, barrierHeight);
        leftBarrier.position.set(-dimensions.width / 2 - 0.05, dimensions.height + barrierHeight / 2, 0);
        leftBarrier.rotation.y = Math.PI / 2;
        const rightBarrier = this.createBarrierSegment(dimensions.depth, barrierHeight);
        rightBarrier.position.set(dimensions.width / 2 + 0.05, dimensions.height + barrierHeight / 2, 0);
        rightBarrier.rotation.y = Math.PI / 2;
        barriers.push(leftBarrier, rightBarrier);
        return barriers;
    }
    createBarrierSegment(length, height) {
        const barrierGroup = new THREE.Group();
        // Vertical posts
        const postCount = Math.ceil(length / 2) + 1;
        for (let i = 0; i < postCount; i++) {
            const postGeometry = new THREE.CylinderGeometry(0.03, 0.03, height, 8);
            const postMaterial = new THREE.MeshLambertMaterial({ color: '#666666' });
            const post = new THREE.Mesh(postGeometry, postMaterial);
            post.position.set((i / (postCount - 1) - 0.5) * length, 0, 0);
            barrierGroup.add(post);
        }
        // Horizontal rails
        const railGeometry = new THREE.CylinderGeometry(0.02, 0.02, length, 8);
        const railMaterial = new THREE.MeshLambertMaterial({ color: '#666666' });
        const topRail = new THREE.Mesh(railGeometry, railMaterial);
        topRail.position.y = height * 0.4;
        topRail.rotation.z = Math.PI / 2;
        const bottomRail = new THREE.Mesh(railGeometry, railMaterial);
        bottomRail.position.y = height * 0.1;
        bottomRail.rotation.z = Math.PI / 2;
        barrierGroup.add(topRail, bottomRail);
        barrierGroup.userData.component = 'safety-barrier';
        return barrierGroup;
    }
    generateAudioSystem(specs, params) {
        const audioSystem = [];
        if (params.audioRequirements !== 'silent') {
            // Main speakers
            const speakers = this.createSpeakerSystem(params, specs);
            audioSystem.push(...speakers);
            // Microphone setup
            if (params.performanceType === 'speaker' || params.performanceType === 'ceremony') {
                const micSystem = this.createMicrophoneSystem(params);
                audioSystem.push(micSystem);
            }
            // Mixing console
            const mixingConsole = this.createMixingConsole(params, specs);
            audioSystem.push(mixingConsole);
            // Hearing assistance system
            if (params.hearingAssistance) {
                const hearingLoop = this.createHearingAssistanceSystem(specs);
                audioSystem.push(hearingLoop);
            }
        }
        return audioSystem;
    }
    createSpeakerSystem(params, specs) {
        const speakers = [];
        const stageWidth = specs.dimensions.width;
        // Main left/right speakers
        const leftSpeaker = this.createMainSpeaker();
        leftSpeaker.position.set(-stageWidth / 2 - 1, specs.dimensions.height + 1.5, specs.dimensions.depth / 2);
        leftSpeaker.userData.component = 'left-main-speaker';
        const rightSpeaker = this.createMainSpeaker();
        rightSpeaker.position.set(stageWidth / 2 + 1, specs.dimensions.height + 1.5, specs.dimensions.depth / 2);
        rightSpeaker.userData.component = 'right-main-speaker';
        speakers.push(leftSpeaker, rightSpeaker);
        // Add subwoofers for music performances
        if (params.performanceType === 'live-music' || params.performanceType === 'dj-set') {
            const subwooferLeft = this.createSubwoofer();
            subwooferLeft.position.set(-stageWidth / 4, specs.dimensions.height + 0.3, specs.dimensions.depth / 2 + 0.5);
            const subwooferRight = this.createSubwoofer();
            subwooferRight.position.set(stageWidth / 4, specs.dimensions.height + 0.3, specs.dimensions.depth / 2 + 0.5);
            speakers.push(subwooferLeft, subwooferRight);
        }
        // Monitor speakers for performers
        if (params.performanceType === 'live-music') {
            const monitors = this.createMonitorSpeakers(stageWidth, specs.dimensions.height);
            speakers.push(...monitors);
        }
        return speakers;
    }
    createMainSpeaker() {
        const speakerGroup = new THREE.Group();
        // Speaker cabinet
        const cabinetGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.3);
        const cabinetMaterial = new THREE.MeshLambertMaterial({ color: '#1A1A1A' });
        const cabinet = new THREE.Mesh(cabinetGeometry, cabinetMaterial);
        // Speaker grille
        const grilleGeometry = new THREE.PlaneGeometry(0.35, 0.75);
        const grilleMaterial = new THREE.MeshLambertMaterial({
            color: '#333333',
            transparent: true,
            opacity: 0.8
        });
        const grille = new THREE.Mesh(grilleGeometry, grilleMaterial);
        grille.position.z = 0.16;
        // Brand/logo area
        const logoGeometry = new THREE.PlaneGeometry(0.2, 0.05);
        const logoMaterial = new THREE.MeshLambertMaterial({ color: '#666666' });
        const logo = new THREE.Mesh(logoGeometry, logoMaterial);
        logo.position.set(0, -0.3, 0.16);
        speakerGroup.add(cabinet, grille, logo);
        return speakerGroup;
    }
    createSubwoofer() {
        const subGroup = new THREE.Group();
        const subGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
        const subMaterial = new THREE.MeshLambertMaterial({ color: '#0A0A0A' });
        const sub = new THREE.Mesh(subGeometry, subMaterial);
        // Large driver grille
        const driverGeometry = new THREE.CircleGeometry(0.2, 16);
        const driverMaterial = new THREE.MeshLambertMaterial({ color: '#1A1A1A' });
        const driver = new THREE.Mesh(driverGeometry, driverMaterial);
        driver.position.z = 0.31;
        subGroup.add(sub, driver);
        subGroup.userData.component = 'subwoofer';
        return subGroup;
    }
    createMonitorSpeakers(stageWidth, stageHeight) {
        const monitors = [];
        // Floor monitors for performers
        for (let i = 0; i < 3; i++) {
            const monitor = new THREE.Group();
            const monitorGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.4);
            const monitorMaterial = new THREE.MeshLambertMaterial({ color: '#2A2A2A' });
            const monitorSpeaker = new THREE.Mesh(monitorGeometry, monitorMaterial);
            // Angled for performer visibility
            monitorSpeaker.rotation.x = -Math.PI / 6;
            monitor.add(monitorSpeaker);
            monitor.position.set((i - 1) * (stageWidth / 3), stageHeight + 0.1, -stageWidth / 6);
            monitor.userData.component = 'floor-monitor';
            monitors.push(monitor);
        }
        return monitors;
    }
    createMicrophoneSystem(params) {
        const micGroup = new THREE.Group();
        // Podium for speakers
        if (params.performanceType === 'speaker' || params.performanceType === 'presentation') {
            const podium = this.createPodium();
            micGroup.add(podium);
        }
        // Microphone stand
        const micStand = this.createMicrophoneStand();
        micGroup.add(micStand);
        micGroup.userData.component = 'microphone-system';
        return micGroup;
    }
    createPodium() {
        const podiumGroup = new THREE.Group();
        // Podium base
        const baseGeometry = new THREE.BoxGeometry(0.6, 1.0, 0.4);
        const baseMaterial = new THREE.MeshLambertMaterial({ color: '#8B4513' });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 0.5;
        // Lectern top
        const topGeometry = new THREE.BoxGeometry(0.65, 0.05, 0.45);
        const topMaterial = new THREE.MeshLambertMaterial({ color: '#654321' });
        const top = new THREE.Mesh(topGeometry, topMaterial);
        top.position.y = 1.025;
        // Slanted reading surface
        const surfaceGeometry = new THREE.BoxGeometry(0.5, 0.02, 0.3);
        const surfaceMaterial = new THREE.MeshLambertMaterial({ color: '#654321' });
        const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
        surface.position.set(0, 1.1, -0.05);
        surface.rotation.x = -Math.PI / 12;
        podiumGroup.add(base, top, surface);
        podiumGroup.userData.component = 'podium';
        return podiumGroup;
    }
    createMicrophoneStand() {
        const standGroup = new THREE.Group();
        // Stand base
        const baseGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 16);
        const baseMaterial = new THREE.MeshLambertMaterial({ color: '#2F2F2F' });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 0.025;
        // Stand pole
        const poleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.2, 8);
        const poleMaterial = new THREE.MeshLambertMaterial({ color: '#2F2F2F' });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.y = 0.6;
        // Microphone
        const micGeometry = new THREE.CapsuleGeometry(0.02, 0.1);
        const micMaterial = new THREE.MeshLambertMaterial({ color: '#1A1A1A' });
        const mic = new THREE.Mesh(micGeometry, micMaterial);
        mic.position.y = 1.2;
        mic.rotation.x = Math.PI / 2;
        // Boom arm (for flexibility)
        const boomGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.4, 8);
        const boomMaterial = new THREE.MeshLambertMaterial({ color: '#2F2F2F' });
        const boom = new THREE.Mesh(boomGeometry, boomMaterial);
        boom.position.set(0.2, 1.2, 0);
        boom.rotation.z = Math.PI / 6;
        standGroup.add(base, pole, mic, boom);
        standGroup.position.set(0, 0, -0.5);
        return standGroup;
    }
    createMixingConsole(params, specs) {
        const consoleGroup = new THREE.Group();
        // Main console surface
        const consoleGeometry = new THREE.BoxGeometry(1.5, 0.15, 1.0);
        const consoleMaterial = new THREE.MeshLambertMaterial({ color: '#2A2A2A' });
        const console = new THREE.Mesh(consoleGeometry, consoleMaterial);
        console.position.y = 0.9;
        // Control surface details
        const controlsGeometry = new THREE.PlaneGeometry(1.4, 0.9);
        const controlsMaterial = new THREE.MeshLambertMaterial({ color: '#1A1A1A' });
        const controls = new THREE.Mesh(controlsGeometry, controlsMaterial);
        controls.position.set(0, 0.976, 0);
        controls.rotation.x = -Math.PI / 2;
        // Support legs
        const legGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.9, 8);
        const legMaterial = new THREE.MeshLambertMaterial({ color: '#666666' });
        for (let i = 0; i < 4; i++) {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            const x = (i % 2 === 0 ? -1 : 1) * 0.7;
            const z = (i < 2 ? -1 : 1) * 0.45;
            leg.position.set(x, 0.45, z);
            consoleGroup.add(leg);
        }
        consoleGroup.add(console, controls);
        consoleGroup.position.set(-specs.dimensions.width - 2, 0, -specs.dimensions.depth - 1);
        consoleGroup.userData.component = 'mixing-console';
        return consoleGroup;
    }
    createHearingAssistanceSystem(specs) {
        // Create induction loop system for hearing assistance
        const loopGroup = new THREE.Group();
        // Transmitter unit
        const transmitterGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.2);
        const transmitterMaterial = new THREE.MeshLambertMaterial({ color: '#4A4A4A' });
        const transmitter = new THREE.Mesh(transmitterGeometry, transmitterMaterial);
        transmitter.position.set(-specs.dimensions.width - 1, 1.2, -specs.dimensions.depth - 0.5);
        loopGroup.add(transmitter);
        loopGroup.userData.component = 'hearing-assistance';
        return loopGroup;
    }
    generateVisualSystem(specs, params) {
        const visualSystem = [];
        if (params.visualRequirements !== 'minimal') {
            // Projection screens
            if (params.performanceType === 'presentation' || params.performanceType === 'ceremony') {
                const screen = this.createProjectionScreen(specs);
                visualSystem.push(screen);
                const projector = this.createProjector(specs);
                visualSystem.push(projector);
            }
            // LED displays for events
            if (params.visualRequirements === 'spectacular' || params.visualRequirements === 'immersive') {
                const ledDisplays = this.createLEDDisplays(specs);
                visualSystem.push(...ledDisplays);
            }
        }
        return visualSystem;
    }
    createProjectionScreen(specs) {
        const screenGroup = new THREE.Group();
        // Screen surface
        const screenGeometry = new THREE.PlaneGeometry(3, 2);
        const screenMaterial = new THREE.MeshLambertMaterial({ color: '#F8F8F8' });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, specs.dimensions.height + 2, -specs.dimensions.depth / 2 - 0.1);
        // Screen frame
        const frameGeometry = new THREE.PlaneGeometry(3.2, 2.2);
        const frameMaterial = new THREE.MeshLambertMaterial({ color: '#2A2A2A' });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.copy(screen.position);
        frame.position.z -= 0.01;
        screenGroup.add(frame, screen);
        screenGroup.userData.component = 'projection-screen';
        return screenGroup;
    }
    createProjector(specs) {
        const projectorGeometry = new THREE.BoxGeometry(0.4, 0.2, 0.3);
        const projectorMaterial = new THREE.MeshLambertMaterial({ color: '#2A2A2A' });
        const projector = new THREE.Mesh(projectorGeometry, projectorMaterial);
        // Position at optimal throw distance
        projector.position.set(0, specs.dimensions.height + 2.5, -specs.dimensions.depth / 2 - 4);
        projector.userData.component = 'projector';
        return projector;
    }
    createLEDDisplays(specs) {
        const displays = [];
        // Side LED panels
        for (let side = 0; side < 2; side++) {
            const panelGeometry = new THREE.PlaneGeometry(2, 3);
            const panelMaterial = new THREE.MeshBasicMaterial({ color: '#0A0A0A' });
            const panel = new THREE.Mesh(panelGeometry, panelMaterial);
            panel.position.set((side === 0 ? -1 : 1) * (specs.dimensions.width / 2 + 2), specs.dimensions.height + 1.5, 0);
            panel.rotation.y = (side === 0 ? 1 : -1) * Math.PI / 6;
            panel.userData.component = 'led-display';
            displays.push(panel);
        }
        return displays;
    }
    generateStageLighting(specs, params) {
        const lightingSystem = [];
        if (params.lightingIntegration) {
            // Stage wash lights
            const washLights = this.createStageWashLights(specs);
            lightingSystem.push(...washLights);
            // Spot lights for focus
            const spotLights = this.createSpotLights(specs);
            lightingSystem.push(...spotLights);
            // Lighting truss
            const truss = this.createLightingTruss(specs);
            lightingSystem.push(truss);
        }
        return lightingSystem;
    }
    createStageWashLights(specs) {
        const washLights = [];
        // Front wash from truss
        for (let i = 0; i < 4; i++) {
            const washLight = this.createWashLight();
            washLight.position.set((i - 1.5) * (specs.dimensions.width / 3), specs.dimensions.height + 3, specs.dimensions.depth + 2);
            washLight.rotation.x = -Math.PI / 4;
            washLights.push(washLight);
        }
        return washLights;
    }
    createWashLight() {
        const lightGroup = new THREE.Group();
        // Light fixture body
        const bodyGeometry = new THREE.CylinderGeometry(0.15, 0.12, 0.3, 12);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: '#2A2A2A' });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        // Lens
        const lensGeometry = new THREE.CircleGeometry(0.1, 16);
        const lensMaterial = new THREE.MeshBasicMaterial({
            color: '#FFFF88',
            transparent: true,
            opacity: 0.7
        });
        const lens = new THREE.Mesh(lensGeometry, lensMaterial);
        lens.position.y = -0.16;
        // Actual light source
        const stageLight = new THREE.SpotLight(0xFFFFFF, 1, 10, Math.PI / 6);
        stageLight.position.y = -0.15;
        stageLight.castShadow = true;
        lightGroup.add(body, lens, stageLight);
        lightGroup.userData.component = 'wash-light';
        return lightGroup;
    }
    createSpotLights(specs) {
        const spotLights = [];
        // Key spotlights for focal areas
        for (let i = 0; i < 2; i++) {
            const spotlight = this.createSpotlight();
            spotlight.position.set((i === 0 ? -1 : 1) * specs.dimensions.width / 3, specs.dimensions.height + 4, specs.dimensions.depth + 1);
            spotlight.rotation.x = -Math.PI / 3;
            spotLights.push(spotlight);
        }
        return spotLights;
    }
    createSpotlight() {
        const spotGroup = new THREE.Group();
        // More focused spotlight fixture
        const bodyGeometry = new THREE.CylinderGeometry(0.1, 0.08, 0.4, 12);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: '#1A1A1A' });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        // Spot light source
        const spotlight = new THREE.SpotLight(0xFFFFFF, 2, 8, Math.PI / 12);
        spotlight.position.y = -0.2;
        spotlight.castShadow = true;
        spotGroup.add(body, spotlight);
        spotGroup.userData.component = 'spotlight';
        return spotGroup;
    }
    createLightingTruss(specs) {
        const trussGroup = new THREE.Group();
        // Main truss beam
        const beamGeometry = new THREE.BoxGeometry(specs.dimensions.width + 4, 0.3, 0.3);
        const beamMaterial = new THREE.MeshLambertMaterial({ color: '#666666' });
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        beam.position.set(0, specs.dimensions.height + 3, specs.dimensions.depth + 2);
        // Support poles
        for (let i = 0; i < 2; i++) {
            const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
            const poleMaterial = new THREE.MeshLambertMaterial({ color: '#666666' });
            const pole = new THREE.Mesh(poleGeometry, poleMaterial);
            pole.position.set((i === 0 ? -1 : 1) * (specs.dimensions.width / 2 + 1.5), specs.dimensions.height + 1.5, specs.dimensions.depth + 2);
            trussGroup.add(pole);
        }
        trussGroup.add(beam);
        trussGroup.userData.component = 'lighting-truss';
        return trussGroup;
    }
    addCulturalStageElements(params) {
        const culturalElements = [];
        const culturalData = this.culturalStagingTraditions.get(params.culture);
        // Add culture-specific elements
        if (params.culture === 'japanese' && params.ceremony) {
            const torii = this.createToriiGate(params);
            if (torii)
                culturalElements.push(torii);
            const tatami = this.createTatamiStaging(params);
            if (tatami)
                culturalElements.push(tatami);
        }
        if (params.culture === 'italian' && culturalData.traditionalElements.includes('classical-columns')) {
            const columns = this.createClassicalColumns(params);
            culturalElements.push(...columns);
        }
        return culturalElements;
    }
    createToriiGate(params) {
        if (!params.traditionalElements.includes('torii-gate'))
            return null;
        const toriiGroup = new THREE.Group();
        // Vertical posts
        const postGeometry = new THREE.CylinderGeometry(0.15, 0.15, 3, 12);
        const postMaterial = new THREE.MeshLambertMaterial({ color: '#8B4513' });
        const leftPost = new THREE.Mesh(postGeometry, postMaterial);
        leftPost.position.set(-2, 1.5, 3);
        const rightPost = new THREE.Mesh(postGeometry, postMaterial);
        rightPost.position.set(2, 1.5, 3);
        // Horizontal beams
        const beamGeometry = new THREE.CylinderGeometry(0.12, 0.12, 4.5, 12);
        const beamMaterial = new THREE.MeshLambertMaterial({ color: '#654321' });
        const topBeam = new THREE.Mesh(beamGeometry, beamMaterial);
        topBeam.position.set(0, 3, 3);
        topBeam.rotation.z = Math.PI / 2;
        const lowerBeam = new THREE.Mesh(beamGeometry, beamMaterial);
        lowerBeam.position.set(0, 2.5, 3);
        lowerBeam.rotation.z = Math.PI / 2;
        toriiGroup.add(leftPost, rightPost, topBeam, lowerBeam);
        toriiGroup.userData = { type: 'torii-gate', culture: 'japanese' };
        return toriiGroup;
    }
    createTatamiStaging(params) {
        const tatamiGroup = new THREE.Group();
        // Traditional tatami mat texture on stage platform
        const tatamiGeometry = new THREE.PlaneGeometry(params.spaceDimensions.width * 0.8, params.spaceDimensions.depth * 0.6);
        const tatamiMaterial = new THREE.MeshLambertMaterial({
            color: '#DAA520',
            transparent: true,
            opacity: 0.8
        });
        const tatami = new THREE.Mesh(tatamiGeometry, tatamiMaterial);
        tatami.position.y = 0.01; // Slightly above stage surface
        tatami.rotation.x = -Math.PI / 2;
        tatamiGroup.add(tatami);
        tatamiGroup.userData = { type: 'tatami-staging', culture: 'japanese' };
        return tatamiGroup;
    }
    createClassicalColumns(params) {
        const columns = [];
        // Classical columns for Italian staging
        for (let i = 0; i < 2; i++) {
            const columnGroup = new THREE.Group();
            // Column shaft
            const shaftGeometry = new THREE.CylinderGeometry(0.2, 0.18, 2.5, 16);
            const shaftMaterial = new THREE.MeshLambertMaterial({ color: '#F8F8FF' });
            const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
            shaft.position.y = 1.25;
            // Capital
            const capitalGeometry = new THREE.CylinderGeometry(0.25, 0.2, 0.3, 16);
            const capitalMaterial = new THREE.MeshLambertMaterial({ color: '#F0F0F0' });
            const capital = new THREE.Mesh(capitalGeometry, capitalMaterial);
            capital.position.y = 2.65;
            // Base
            const baseGeometry = new THREE.CylinderGeometry(0.22, 0.25, 0.2, 16);
            const baseMaterial = new THREE.MeshLambertMaterial({ color: '#F0F0F0' });
            const base = new THREE.Mesh(baseGeometry, baseMaterial);
            base.position.y = 0.1;
            columnGroup.add(shaft, capital, base);
            columnGroup.position.set((i === 0 ? -1 : 1) * (params.spaceDimensions.width / 2 + 1), 0, -1);
            columns.push(columnGroup);
        }
        return columns;
    }
    generateAccessibilityFeatures(specs, params) {
        const accessibilityFeatures = [];
        // ASL interpreter platform
        if (params.hearingAssistance) {
            const interpreterPlatform = this.createInterpreterPlatform(specs);
            accessibilityFeatures.push(interpreterPlatform);
        }
        // Accessible seating indicators
        const accessibleSeatingMarkers = this.createAccessibleSeatingMarkers(params);
        accessibilityFeatures.push(...accessibleSeatingMarkers);
        return accessibilityFeatures;
    }
    createInterpreterPlatform(specs) {
        const platformGroup = new THREE.Group();
        // Small platform for ASL interpreter
        const platformGeometry = new THREE.BoxGeometry(1.5, 0.2, 1.5);
        const platformMaterial = new THREE.MeshLambertMaterial({ color: '#4F4F4F' });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.y = 0.1;
        // Position to the side of main stage
        platformGroup.add(platform);
        platformGroup.position.set(specs.dimensions.width / 2 + 2, 0, specs.dimensions.depth / 2);
        platformGroup.userData.component = 'interpreter-platform';
        return platformGroup;
    }
    createAccessibleSeatingMarkers(params) {
        const markers = [];
        // Wheelchair accessible seating markers
        for (let i = 0; i < 4; i++) {
            const markerGeometry = new THREE.PlaneGeometry(1, 1);
            const markerMaterial = new THREE.MeshLambertMaterial({
                color: '#0066CC',
                transparent: true,
                opacity: 0.3
            });
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.position.set((i % 2 === 0 ? -1 : 1) * 3, 0.01, (i < 2 ? 1 : 1) * 4);
            marker.rotation.x = -Math.PI / 2;
            marker.userData.component = 'accessible-seating-marker';
            markers.push(marker);
        }
        return markers;
    }
    applyCulturalPlatformDesign(platform, params) {
        const culturalElements = [];
        const culturalData = this.culturalStagingTraditions.get(params.culture);
        // Apply cultural color palette to platform
        if (platform instanceof THREE.Mesh) {
            const colorMap = {
                'natural-wood': 0x8B4513,
                'white': 0xFFFFFF,
                'black': 0x2F2F2F,
                'marble': 0xF8F8FF
            };
            const primaryColor = culturalData.colorPalette[0];
            if (colorMap[primaryColor]) {
                platform.material = new THREE.MeshLambertMaterial({ color: colorMap[primaryColor] });
            }
        }
        return culturalElements;
    }
    applyStageMaterials(system, params) {
        const culturalData = this.culturalStagingTraditions.get(params.culture);
        // Apply cultural material preferences
        system.traverse((child) => {
            if (child instanceof THREE.Mesh && child.userData.component === 'stage-platform') {
                // Apply cultural finishes based on traditions
                if (culturalData.adaptations.includes('natural-materials')) {
                    child.material = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
                }
            }
        });
    }
    calculateStageCost(params, specs) {
        const baseCost = 5000; // Base stage setup cost
        // Performance type multiplier
        const performanceMultipliers = {
            'live-music': 2.0,
            'dj-set': 1.5,
            'speaker': 1.0,
            'ceremony': 1.2,
            'presentation': 1.1
        };
        // Audio system costs
        const audioMultipliers = {
            'basic': 1.0,
            'professional': 2.5,
            'audiophile': 4.0,
            'silent': 0.1
        };
        // Accessibility features
        const accessibilityCost = params.accessibilityRequired ? 2000 : 0;
        const totalCost = baseCost *
            performanceMultipliers[params.performanceType] *
            audioMultipliers[params.audioRequirements] +
            accessibilityCost;
        return Math.round(totalCost);
    }
    initializePerformanceSpecs() {
        this.performanceSpecs.set('live-music', {
            idealWidth: 6,
            idealDepth: 4,
            idealHeight: 0.8,
            viewingAngle: 120,
            technical: ['sound-system', 'stage-lighting', 'power-distribution', 'monitors'],
            power: 8000, // Watts
            acoustics: ['sound-absorption', 'monitor-wedges', 'instrument-inputs']
        });
        this.performanceSpecs.set('dj-set', {
            idealWidth: 4,
            idealDepth: 3,
            idealHeight: 0.6,
            viewingAngle: 140,
            technical: ['dj-booth', 'sound-system', 'lighting-effects'],
            power: 6000,
            acoustics: ['subwoofers', 'main-speakers', 'booth-monitors']
        });
        this.performanceSpecs.set('speaker', {
            idealWidth: 3,
            idealDepth: 2,
            idealHeight: 0.3,
            viewingAngle: 180,
            technical: ['microphone', 'podium', 'basic-sound'],
            power: 1500,
            acoustics: ['speech-clarity', 'hearing-assistance']
        });
        this.performanceSpecs.set('ceremony', {
            idealWidth: 5,
            idealDepth: 3,
            idealHeight: 0.5,
            viewingAngle: 160,
            technical: ['ceremonial-elements', 'sound-system', 'cultural-staging'],
            power: 3000,
            acoustics: ['ambient-sound', 'speech-reinforcement']
        });
        this.performanceSpecs.set('presentation', {
            idealWidth: 4,
            idealDepth: 2.5,
            idealHeight: 0.4,
            viewingAngle: 170,
            technical: ['projection-screen', 'microphone', 'presentation-setup'],
            power: 2500,
            acoustics: ['speech-clarity', 'minimal-reverberation']
        });
    }
    initializeCulturalTraditions() {
        this.culturalStagingTraditions.set('japanese', {
            philosophy: 'Harmony and respect, elevated performance space',
            adaptations: ['elevated-platform', 'minimal-decoration', 'natural-materials'],
            traditionalElements: ['tatami-edging', 'bamboo-accents', 'torii-gate'],
            colorPalette: ['natural-wood', 'white', 'black'],
            spatialPrinciples: ['asymmetrical-balance', 'negative-space', 'natural-harmony'],
            ceremonyRequirements: ['purification-space', 'offering-area', 'meditation-zone']
        });
        this.culturalStagingTraditions.set('scandinavian', {
            philosophy: 'Functional beauty, natural simplicity, democratic access',
            adaptations: ['accessible-design', 'natural-lighting', 'minimal-technology'],
            traditionalElements: ['wood-finishes', 'clean-lines', 'functional-elements'],
            colorPalette: ['light-wood', 'white', 'natural-tones'],
            spatialPrinciples: ['democratic-viewing', 'functional-clarity', 'natural-integration']
        });
        this.culturalStagingTraditions.set('italian', {
            philosophy: 'Theatrical grandeur, artistic expression, classical beauty',
            adaptations: ['ornate-details', 'classical-proportions', 'dramatic-lighting'],
            traditionalElements: ['classical-columns', 'ornate-decorations', 'marble-finishes'],
            colorPalette: ['marble', 'gold-accents', 'rich-colors'],
            spatialPrinciples: ['classical-proportions', 'dramatic-focus', 'artistic-hierarchy']
        });
        this.culturalStagingTraditions.set('french', {
            philosophy: 'Theatrical elegance, sophisticated presentation, salon tradition',
            adaptations: ['ornate-details', 'salon-styling', 'sophisticated-materials'],
            traditionalElements: ['french-provincial', 'salon-furniture', 'elegant-drapery'],
            colorPalette: ['gold-accents', 'burgundy', 'cream'],
            spatialPrinciples: ['theatrical-hierarchy', 'salon-intimacy', 'sophisticated-staging'],
            ceremonyRequirements: ['salon-gatherings', 'cultural-presentations', 'artistic-performances']
        });
        this.culturalStagingTraditions.set('modern', {
            philosophy: 'Technological integration, flexible functionality, contemporary aesthetics',
            adaptations: ['modular-design', 'tech-integration', 'flexible-configuration'],
            traditionalElements: ['clean-geometry', 'tech-features', 'minimalist-design'],
            colorPalette: ['neutral-grays', 'black', 'accent-colors'],
            spatialPrinciples: ['geometric-clarity', 'technological-focus', 'adaptable-space']
        });
    }
    initializeTechnicalRequirements() {
        this.technicalRequirements = new Map();
        // Initialize technical requirements for different performance types
    }
}
