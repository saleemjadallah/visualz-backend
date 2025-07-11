import * as THREE from 'three';
export interface ClimateParameters {
    eventType: 'indoor' | 'outdoor' | 'covered-outdoor' | 'mixed';
    season: 'spring' | 'summer' | 'autumn' | 'winter';
    climate: 'temperate' | 'tropical' | 'arid' | 'continental' | 'polar';
    guestCount: number;
    duration: number;
    activityLevel: 'seated' | 'standing' | 'active' | 'mixed';
    culture: 'japanese' | 'scandinavian' | 'italian' | 'modern' | 'traditional';
    comfortZones: 'uniform' | 'varied' | 'activity-based' | 'cultural-adaptive';
    temperatureRange: {
        min: number;
        max: number;
    };
    humidityControl: boolean;
    airQuality: 'standard' | 'enhanced' | 'medical-grade';
    powerAvailable: number;
    noiseLimits: number;
    sustainabilityFocus: boolean;
    energyEfficiency: 'standard' | 'high' | 'net-zero';
    weatherContingency: boolean;
    extremeWeatherPlanning: boolean;
    seasonalAdaptation: boolean;
    spaceDimensions: {
        width: number;
        depth: number;
        height: number;
        volume: number;
    };
    traditionalCooling: string[];
    seasonalPreferences: string[];
    culturalComfortNorms: string[];
}
export interface CulturalClimateData {
    philosophy: string;
    traditionalMethods: {
        cooling: string[];
        heating: string[];
        ventilation: string[];
        humidity: string[];
    };
    seasonalAdaptations: {
        [season: string]: {
            preferredTemperature: number;
            humidity: number;
            airflow: string;
            traditionalElements: string[];
        };
    };
    comfortPrinciples: {
        naturalVentilation: boolean;
        layeredControl: boolean;
        microclimates: boolean;
        outdoorConnection: boolean;
    };
    sustainabilityTraditions: string[];
    weatherWisdom: {
        predictions: string[];
        adaptations: string[];
        contingencies: string[];
    };
}
export declare class ClimateTemplate {
    private culturalData;
    private climateCalculations;
    private equipmentSpecs;
    private weatherData;
    constructor();
    generateClimateSystem(parameters: ClimateParameters): THREE.Group;
    private initializeCulturalData;
    private calculateClimateRequirements;
    private generateHVACSystems;
    private createMainHVACUnit;
    private designClimateZones;
    private generateNaturalVentilation;
    private generateHeatingElements;
    private generateCoolingElements;
    private generateWeatherProtection;
    private addCulturalClimateElements;
    private generateClimateControls;
    private generateSustainabilityFeatures;
    private applyClimateEffects;
    private calculateEnergyEfficiency;
    private calculateClimateAuthenticity;
    private initializeClimateCalculations;
    private initializeEquipmentSpecs;
    private initializeWeatherData;
}
export declare function createTestClimateSystem(): THREE.Group;
//# sourceMappingURL=ClimateTemplate.d.ts.map