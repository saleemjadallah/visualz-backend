import * as THREE from 'three';
export interface CelebratoryParameters {
    celebrationType: 'birthday-child' | 'birthday-teen' | 'birthday-adult' | 'baby-shower' | 'graduation' | 'anniversary' | 'quinceañera' | 'bar-bat-mitzvah' | 'cultural-milestone';
    ageGroup: 'toddler' | 'child' | 'teen' | 'young-adult' | 'adult' | 'senior' | 'multi-generational';
    theme: 'superhero' | 'princess' | 'sports' | 'nature' | 'space' | 'unicorn' | 'dinosaur' | 'elegant' | 'cultural-traditional' | 'custom';
    culture: 'american' | 'mexican' | 'korean' | 'japanese' | 'jewish' | 'indian' | 'african' | 'latin' | 'mixed-heritage';
    culturalTraditions: string[];
    religiousConsiderations: string[];
    familyCustoms: string[];
    guestCount: number;
    childrenCount: number;
    adultCount: number;
    specialNeeds: string[];
    duration: number;
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'all-day';
    seasonality: 'spring' | 'summer' | 'autumn' | 'winter' | 'year-round';
    spaceDimensions: {
        width: number;
        depth: number;
        height: number;
        indoorOutdoor: 'indoor' | 'outdoor' | 'mixed';
    };
    existingElements: string[];
    spaceConstraints: string[];
    balloonSystems: boolean;
    photoBackdrops: boolean;
    interactiveProps: boolean;
    ceremonialElements: boolean;
    giftDisplayAreas: boolean;
    entertainmentProps: boolean;
    colorScheme: 'theme-based' | 'cultural-palette' | 'pastel' | 'bright' | 'elegant' | 'custom';
    customColors: string[];
    materialPreferences: string[];
    sustainabilityLevel: 'basic' | 'moderate' | 'high' | 'eco-focused';
    ageAppropriateActivities: boolean;
    photoOpportunities: number;
    interactiveZones: number;
    safetyRequirements: string[];
    budget: number;
    setupTime: number;
    cleanupComplexity: 'simple' | 'moderate' | 'complex';
    transportability: 'single-trip' | 'multiple-trips' | 'delivery-required';
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
        symbols: {
            [symbol: string]: string;
        };
        colors: {
            [color: string]: string;
        };
        objects: {
            [object: string]: string;
        };
        arrangements: {
            [arrangement: string]: string;
        };
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
export declare class CelebratoryTemplate {
    private culturalData;
    private themeDatabase;
    private safetyStandards;
    private ageAppropriateGuidelines;
    constructor();
    generateCelebratorySystem(parameters: CelebratoryParameters): THREE.Group;
    private initializeCulturalData;
    private generateBalloonSystems;
    private createSuperheroBoulloonArch;
    private createPrincessBalloonClouds;
    private generatePhotoBackdrops;
    private createMainPhotoBackdrop;
    private createBackdropDecorations;
    private createComicBookElements;
    private createComicStar;
    private generateInteractiveProps;
    private createChildInteractiveProps;
    private createPinata;
    private createActivityTable;
    private createActivitySupplies;
    private generateCeremonialElements;
    private createCakeDisplayArea;
    private createThemeBirthdayCake;
    private createBirthdayCandles;
    private getThemeMainColor;
    private getThemeFrostingColor;
    private analyzeCelebrationRequirements;
    private designCelebrationLayout;
    private initializeThemeDatabase;
    private initializeSafetyStandards;
    private initializeAgeAppropriateGuidelines;
    private createCulturalBalloonDisplay;
    private createStandardBalloonArrangement;
    private createThemeFloatingBalloons;
    private createElegantBalloonColumns;
    private createAdditionalPhotoArea;
    private createFairyTaleElements;
    private createSpaceElements;
    private createNatureElements;
    private createTeenInteractiveProps;
    private createAdultInteractiveProps;
    private createThemedPlayProps;
    private addCulturalCelebrationElements;
    private generateThemedDecorations;
    private generateGiftDisplaySystems;
    private generateEntertainmentProps;
    private generatePersonalizedElements;
    private applyCelebrationAesthetics;
    private implementSafetyMeasures;
    private calculateCelebrationAuthenticity;
    private calculateSafetyCompliance;
    private calculateAgeAppropriateness;
    private calculateMemoryPotential;
    private createCulturalCeremonialElements;
    private createAgeSpecificCeremonialElements;
    private createCakeDecorations;
    private analyzeSafetyRequirements;
    private analyzeAgeRequirements;
    private analyzeSpaceRequirements;
    private defineActivityZones;
    private planPhotoOpportunities;
    private planCeremonialFocus;
    private defineSafetyZones;
}
export declare class QuinceañeraTemplate extends CelebratoryTemplate {
    generateQuinceañera(parameters: CelebratoryParameters): THREE.Group;
    private createQuinceañeraThrone;
    private createCeremonialDollTable;
    private createFormalDanceArea;
    private createQuinceTraditionalDecorations;
    private createPapelPicadoBanners;
    private createQuinceFloralArrangements;
    private createMemoryTable;
    private createLuminarias;
}
export declare class BarBatMitzvahTemplate extends CelebratoryTemplate {
    generateBarBatMitzvah(parameters: CelebratoryParameters): THREE.Group;
    private createTorahReadingArea;
    private createStarOfDavid;
    private createKiddushTable;
    private createJewishTraditionalDecorations;
    private createBlueWhiteDecorations;
    private createHebrewStyleBanners;
    private createHeritageDisplay;
    private createFamilyMemoryDisplay;
    private createLearningCelebrationArea;
}
export declare class KoreanDoljanchTemplate extends CelebratoryTemplate {
    generateDoljanchi(parameters: CelebratoryParameters): THREE.Group;
    private createDoljabiTable;
    private createRainbowRiceCakeDisplay;
    private createKoreanTraditionalDecorations;
    private createKoreanPatterns;
    private createLongevitySymbols;
    private createObangSaekDecorations;
    private createHanbokDisplay;
    private createFamilyBlessingArea;
}
export declare function createTestQuinceañera(): THREE.Group;
export declare function createTestBarMitzvah(): THREE.Group;
export declare function createTestDoljanchi(): THREE.Group;
//# sourceMappingURL=CelebratoryTemplate.d.ts.map