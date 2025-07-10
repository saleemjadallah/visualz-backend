import { ParametricParameters, UserFurnitureRequest, OptimizationConstraints, AIFurnitureAnalysis } from '../types/index';
export declare class AIParameterAnalyzer {
    private openAI;
    private culturalDB;
    private promptTemplates;
    constructor();
    analyzeUserRequirements(userInput: UserFurnitureRequest): Promise<AIFurnitureAnalysis>;
    private buildAnalysisPrompt;
    private getSystemPrompt;
    optimizeParameters(baseParameters: ParametricParameters, constraints: OptimizationConstraints): Promise<ParametricParameters>;
    private validateAndSanitizeAIResponse;
    private sanitizeParameters;
    private fallbackAnalysis;
    private validateFurnitureType;
    private validatePriority;
    private validateStyle;
    private validateMaterial;
    private validateErgonomicProfile;
    private validateCraftsmanshipLevel;
    private clampDimension;
    private clampValue;
    private validateParametricParameters;
    private initializePromptTemplates;
    getEventSpecificGuidance(eventType: string): string;
}
//# sourceMappingURL=AIParameterAnalyzer.d.ts.map