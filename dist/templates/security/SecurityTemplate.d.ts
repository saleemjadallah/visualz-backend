import * as THREE from 'three';
export interface SecurityParameters {
    riskLevel: 'low' | 'medium' | 'high' | 'vip' | 'public-event';
    threatProfile: string[];
    securityClearance: 'public' | 'private' | 'restricted' | 'classified';
    crowdSize: number;
    eventType: 'corporate' | 'celebration' | 'public-gathering' | 'private-ceremony';
    venueType: 'indoor' | 'outdoor' | 'mixed' | 'multi-building';
    duration: number;
    culture: 'japanese' | 'scandinavian' | 'italian' | 'modern' | 'international';
    culturalSensitivities: string[];
    traditionalSecurityMethods: string[];
    discretionLevel: 'invisible' | 'subtle' | 'visible' | 'prominent';
    accessControl: 'open' | 'ticketed' | 'invitation-only' | 'multi-tier' | 'vip-zones';
    credentialing: boolean;
    backgroundChecks: boolean;
    emergencyServices: boolean;
    medicalSupport: 'basic' | 'advanced' | 'full-medical-team';
    evacuationPlanning: boolean;
    weatherEmergency: boolean;
    surveillance: 'none' | 'basic' | 'comprehensive' | 'advanced-ai';
    communicationSystems: boolean;
    perimeeterSecurity: boolean;
    accessibilityCompliance: boolean;
    languageSupport: string[];
    culturalLiaisons: boolean;
    spaceDimensions: {
        width: number;
        depth: number;
        perimeter: number;
        exits: number;
    };
    jurisdiction: string;
    permits: string[];
    insurance: string[];
    liabilityLevel: 'standard' | 'high' | 'maximum';
}
export interface CulturalSecurityData {
    philosophy: string;
    traditionalMethods: {
        crowdManagement: string[];
        conflictResolution: string[];
        hospitalityBalance: string[];
        respectfulSecurity: string[];
    };
    culturalNorms: {
        privacy: string;
        authority: string;
        guestTreatment: string;
        emergencyResponse: string;
    };
    securityAesthetics: {
        visibility: 'hidden' | 'integrated' | 'prominent';
        materials: string[];
        signage: string[];
        uniforming: string[];
    };
    communicationStyles: {
        directness: 'subtle' | 'moderate' | 'direct';
        hierarchy: 'flat' | 'respectful' | 'formal';
        conflictAvoidance: string[];
    };
}
export declare class SecurityTemplate {
    private culturalData;
    private securityCalculations;
    private emergencyProtocols;
    private legalRequirements;
    constructor();
    generateSecuritySystem(parameters: SecurityParameters): THREE.Group;
    private initializeCulturalData;
    private calculateSecurityRequirements;
    private generateAccessControl;
    private createMainCheckpoint;
    private getCulturalSecurityColor;
    private getSecurityToGuestRatio;
    private designSecurityLayout;
    private generateSurveillance;
    private generateEmergencySystems;
    private generatePerimeterSecurity;
    private addCulturalSecurityElements;
    private generateCommunicationSystems;
    private generateMedicalSystems;
    private applySecurityAesthetics;
    private calculateSecurityCompliance;
    private calculateCulturalSecuritySensitivity;
    private calculateEmergencyReadiness;
    private initializeSecurityCalculations;
    private initializeEmergencyProtocols;
    private initializeLegalRequirements;
}
export declare function createTestSecuritySystem(): THREE.Group;
//# sourceMappingURL=SecurityTemplate.d.ts.map