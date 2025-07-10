import OpenAI from 'openai';
import { 
  ParametricParameters, 
  UserFurnitureRequest, 
  CulturalProfile, 
  OptimizationConstraints,
  AIFurnitureAnalysis
} from '../types/index';
import { CulturalKnowledgeBase } from '../cultural/CulturalKnowledgeBase';

export class AIParameterAnalyzer {
  private openAI: OpenAI;
  private culturalDB: CulturalKnowledgeBase;
  private promptTemplates: Map<string, string> = new Map();

  constructor() {
    this.openAI = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY
    });
    this.culturalDB = new CulturalKnowledgeBase();
    this.initializePromptTemplates();
  }

  async analyzeUserRequirements(userInput: UserFurnitureRequest): Promise<AIFurnitureAnalysis> {
    // Build AI prompt with cultural context
    const culturalContext = this.culturalDB.getCulturalProfile(userInput.culture);
    const prompt = this.buildAnalysisPrompt(userInput, culturalContext);

    try {
      // Call OpenAI for intelligent parameter extraction
      const response = await this.openAI.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt()
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3 // Lower temperature for consistent results
      });

      const aiAnalysis = JSON.parse(response.choices[0].message.content || '{}');
      
      // Validate and sanitize the AI response
      return this.validateAndSanitizeAIResponse(aiAnalysis, userInput);
    } catch (error) {
      console.error('AI Analysis failed:', error);
      // Fallback to rule-based analysis
      return this.fallbackAnalysis(userInput);
    }
  }

  private buildAnalysisPrompt(
    userInput: UserFurnitureRequest, 
    culturalContext: CulturalProfile | undefined
  ): string {
    const culturalInfo = culturalContext ? `
Cultural Context (${userInput.culture}):
- Traditional Proportions: ${JSON.stringify(culturalContext.proportions)}
- Preferred Materials: ${culturalContext.materials.preferred.join(', ')}
- Aesthetic Elements: ${culturalContext.aesthetics.decorativeElements.join(', ')}
- Cultural Symbolism: ${JSON.stringify(culturalContext.aesthetics.symbolism)}
- Ergonomic Preferences: ${JSON.stringify(culturalContext.ergonomics)}
    ` : 'Cultural context not available.';

    return `
FURNITURE DESIGN ANALYSIS REQUEST

User Requirements:
- Event Type: ${userInput.eventType}
- Culture: ${userInput.culture}
- Guest Count: ${userInput.guestCount}
- Space Dimensions: ${userInput.spaceDimensions.width}m × ${userInput.spaceDimensions.depth}m × ${userInput.spaceDimensions.height}m
- Budget Range: ${userInput.budgetRange}
- Formality Level: ${userInput.formalityLevel}
- Special Requirements: ${userInput.specialRequirements}

${culturalInfo}

TASK: Analyze the user requirements and provide optimal parametric specifications for furniture pieces needed for this event. Consider cultural authenticity, ergonomic needs, spatial constraints, and budget limitations.

Required JSON Output Format:
{
  "furniture_pieces": [
    {
      "type": "chair|dining-table|coffee-table|sofa|bench|etc",
      "quantity": number,
      "priority": "essential|important|optional",
      "parameters": {
        "type": "furniture_type",
        "culture": "${userInput.culture}",
        "width": number_in_meters,
        "height": number_in_meters,
        "depth": number_in_meters,
        "style": "traditional|contemporary|rustic|elegant|minimalist|ornate",
        "formality": "${userInput.formalityLevel}",
        "primaryMaterial": "wood-oak|wood-pine|wood-cherry|wood-bamboo|fabric-cotton|fabric-linen|fabric-silk|fabric-wool|metal-brass|metal-steel|metal-copper|leather|ceramic|glass|stone",
        "secondaryMaterial": "optional_material_or_null",
        "culturalElements": ["element1", "element2", "element3"],
        "capacity": number_or_null,
        "ergonomicProfile": "petite|average|tall|accessible",
        "colorPalette": ["#hex1", "#hex2", "#hex3"],
        "decorativeIntensity": number_between_0_and_1,
        "craftsmanshipLevel": "simple|refined|masterwork"
      },
      "cultural_reasoning": "explanation of cultural choices",
      "functional_reasoning": "explanation of functional decisions"
    }
  ],
  "overall_theme": "description of unified design theme",
  "cultural_authenticity_notes": "important cultural considerations",
  "ergonomic_considerations": "accessibility and comfort notes",
  "spatial_optimization": "how furniture works within space constraints"
}
    `;
  }

  private getSystemPrompt(): string {
    return `
You are an expert furniture designer and cultural anthropologist with deep knowledge of traditional furniture design across cultures. You specialize in creating authentic, functional furniture that respects cultural traditions while meeting modern ergonomic and practical needs.

Your expertise includes:
- Traditional furniture proportions and construction methods across cultures
- Cultural symbolism and aesthetic principles in furniture design
- Ergonomic principles for different body types and usage patterns
- Material properties and cultural significance
- Space planning and furniture arrangement for different event types
- Budget-conscious design decisions across different price ranges

When analyzing furniture requirements, you must:
1. Prioritize cultural authenticity and respect for traditions
2. Ensure ergonomic comfort and accessibility
3. Consider spatial constraints and traffic flow
4. Balance aesthetic beauty with functional requirements
5. Respect budget constraints while maintaining quality
6. Provide specific, measurable parameters that can be used for parametric generation
7. Consider the specific event type and its cultural significance
8. Account for guest count and social dynamics

Cultural Guidelines:
- Japanese: Emphasize harmony, simplicity, natural materials, lower seating, minimal ornamentation
- Scandinavian: Focus on functionality, comfort, light colors, natural materials, hygge principles
- Italian: Incorporate luxury, ornate details, rich materials, classical proportions, craftsmanship
- French: Emphasize elegance, refinement, graceful curves, quality fabrics, sophisticated details
- Modern: Prioritize clean lines, minimal decoration, industrial materials, functional design

Budget Considerations:
- Low: Simple construction, basic materials, minimal decoration
- Medium: Quality materials, refined construction, moderate decoration
- High: Premium materials, excellent craftsmanship, detailed work
- Luxury: Finest materials, masterwork craftsmanship, elaborate details

Your responses must be technically precise, culturally sensitive, and practically implementable. Always output valid JSON.
    `;
  }

  async optimizeParameters(
    baseParameters: ParametricParameters,
    constraints: OptimizationConstraints
  ): Promise<ParametricParameters> {
    // AI-driven parameter optimization
    const optimizationPrompt = `
Given these furniture parameters:
${JSON.stringify(baseParameters, null, 2)}

And these constraints:
- Space limitations: ${constraints.spaceLimitations}
- Budget constraints: ${constraints.budgetConstraints}
- User accessibility needs: ${constraints.accessibilityNeeds}
- Cultural authenticity requirements: ${constraints.culturalRequirements}

Optimize the parameters to better meet the constraints while maintaining cultural authenticity and functional excellence.

Return the optimized parameters in the same JSON format as a ParametricParameters object.
    `;

    try {
      const response = await this.openAI.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: this.getSystemPrompt() },
          { role: "user", content: optimizationPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      });

      const optimized = JSON.parse(response.choices[0].message.content || '{}');
      return this.validateParametricParameters(optimized) ? optimized : baseParameters;
    } catch (error) {
      console.error('Parameter optimization failed:', error);
      return baseParameters;
    }
  }

  private validateAndSanitizeAIResponse(
    aiAnalysis: any, 
    userInput: UserFurnitureRequest
  ): AIFurnitureAnalysis {
    // Validate structure
    if (!aiAnalysis.furniture_pieces || !Array.isArray(aiAnalysis.furniture_pieces)) {
      return this.fallbackAnalysis(userInput);
    }

    // Sanitize furniture pieces
    const sanitizedPieces = aiAnalysis.furniture_pieces.map((piece: any) => {
      return {
        type: this.validateFurnitureType(piece.type),
        quantity: Math.max(1, Math.min(20, parseInt(piece.quantity) || 1)),
        priority: this.validatePriority(piece.priority),
        parameters: this.sanitizeParameters(piece.parameters, userInput),
        cultural_reasoning: piece.cultural_reasoning || 'AI analysis provided',
        functional_reasoning: piece.functional_reasoning || 'Functional requirements met'
      };
    });

    return {
      furniture_pieces: sanitizedPieces,
      overall_theme: aiAnalysis.overall_theme || 'Culturally authentic design',
      cultural_authenticity_notes: aiAnalysis.cultural_authenticity_notes || 'Cultural guidelines followed',
      ergonomic_considerations: aiAnalysis.ergonomic_considerations || 'Ergonomic standards met',
      spatial_optimization: aiAnalysis.spatial_optimization || 'Space efficiently utilized'
    };
  }

  private sanitizeParameters(params: any, userInput: UserFurnitureRequest): ParametricParameters {
    const culturalProfile = this.culturalDB.getCulturalProfile(userInput.culture);
    const defaultColors = culturalProfile?.aesthetics.colorPalette || ['#8B4513', '#D2691E'];
    
    return {
      type: this.validateFurnitureType(params.type),
      culture: userInput.culture,
      width: this.clampDimension(params.width, 0.3, 3.0),
      height: this.clampDimension(params.height, 0.3, 2.0),
      depth: this.clampDimension(params.depth, 0.3, 2.0),
      style: this.validateStyle(params.style),
      formality: userInput.formalityLevel,
      primaryMaterial: this.validateMaterial(params.primaryMaterial),
      secondaryMaterial: params.secondaryMaterial ? this.validateMaterial(params.secondaryMaterial) : undefined,
      culturalElements: Array.isArray(params.culturalElements) ? params.culturalElements.slice(0, 5) : [],
      capacity: params.capacity ? Math.max(1, Math.min(20, parseInt(params.capacity))) : undefined,
      ergonomicProfile: this.validateErgonomicProfile(params.ergonomicProfile),
      colorPalette: Array.isArray(params.colorPalette) ? params.colorPalette.slice(0, 4) : defaultColors,
      decorativeIntensity: this.clampValue(params.decorativeIntensity, 0, 1),
      craftsmanshipLevel: this.validateCraftsmanshipLevel(params.craftsmanshipLevel)
    };
  }

  private fallbackAnalysis(userInput: UserFurnitureRequest): AIFurnitureAnalysis {
    // Rule-based fallback when AI fails
    const culturalProfile = this.culturalDB.getCulturalProfile(userInput.culture);
    const defaultColors = culturalProfile?.aesthetics.colorPalette || ['#8B4513', '#D2691E'];
    
    const baseParameters: ParametricParameters = {
      type: 'chair',
      culture: userInput.culture,
      width: 0.5,
      height: culturalProfile?.proportions.seatHeight || 0.45,
      depth: 0.5,
      style: 'traditional',
      formality: userInput.formalityLevel,
      primaryMaterial: culturalProfile?.materials.preferred[0] || 'wood-oak',
      culturalElements: culturalProfile?.aesthetics.decorativeElements.slice(0, 3) || [],
      ergonomicProfile: 'average',
      colorPalette: defaultColors,
      decorativeIntensity: 0.5,
      craftsmanshipLevel: 'refined'
    };

    return {
      furniture_pieces: [{
        type: 'chair',
        quantity: Math.min(userInput.guestCount, 12),
        priority: 'essential',
        parameters: baseParameters,
        cultural_reasoning: 'Basic cultural guidelines applied',
        functional_reasoning: 'Standard seating requirements met'
      }],
      overall_theme: `${userInput.culture} traditional design`,
      cultural_authenticity_notes: 'Basic cultural principles applied',
      ergonomic_considerations: 'Standard ergonomic requirements met',
      spatial_optimization: 'Basic space utilization'
    };
  }

  private validateFurnitureType(type: any): any {
    const validTypes = ['chair', 'sofa', 'bench', 'dining-table', 'coffee-table', 'side-table', 'cabinet', 'shelf', 'chest'];
    return validTypes.includes(type) ? type : 'chair';
  }

  private validatePriority(priority: any): 'essential' | 'important' | 'optional' {
    const validPriorities = ['essential', 'important', 'optional'];
    return validPriorities.includes(priority) ? priority : 'important';
  }

  private validateStyle(style: any): any {
    const validStyles = ['traditional', 'contemporary', 'rustic', 'elegant', 'minimalist', 'ornate'];
    return validStyles.includes(style) ? style : 'traditional';
  }

  private validateMaterial(material: any): any {
    const validMaterials = ['wood-oak', 'wood-pine', 'wood-cherry', 'wood-bamboo', 'fabric-cotton', 'fabric-linen', 'fabric-silk', 'fabric-wool', 'metal-brass', 'metal-steel', 'metal-copper', 'leather', 'ceramic', 'glass', 'stone'];
    return validMaterials.includes(material) ? material : 'wood-oak';
  }

  private validateErgonomicProfile(profile: any): any {
    const validProfiles = ['petite', 'average', 'tall', 'accessible'];
    return validProfiles.includes(profile) ? profile : 'average';
  }

  private validateCraftsmanshipLevel(level: any): any {
    const validLevels = ['simple', 'refined', 'masterwork'];
    return validLevels.includes(level) ? level : 'refined';
  }

  private clampDimension(value: any, min: number, max: number): number {
    const num = parseFloat(value);
    return isNaN(num) ? min : Math.max(min, Math.min(max, num));
  }

  private clampValue(value: any, min: number, max: number): number {
    const num = parseFloat(value);
    return isNaN(num) ? (min + max) / 2 : Math.max(min, Math.min(max, num));
  }

  private validateParametricParameters(params: any): boolean {
    return params && 
           typeof params.type === 'string' &&
           typeof params.culture === 'string' &&
           typeof params.width === 'number' &&
           typeof params.height === 'number' &&
           typeof params.depth === 'number';
  }

  private initializePromptTemplates(): void {
    this.promptTemplates = new Map([
      ['tea-ceremony', 'Focus on low seating, natural materials, minimal decoration, and authentic Japanese proportions suitable for traditional tea ceremony.'],
      ['dinner-party', 'Emphasize comfortable seating, appropriate table height for dining, and formality level matching the occasion.'],
      ['business-meeting', 'Prioritize professional appearance, ergonomic comfort, and materials that convey competence and reliability.'],
      ['family-gathering', 'Focus on comfort, durability, and accommodating various age groups and accessibility needs.']
    ]);
  }

  getEventSpecificGuidance(eventType: string): string {
    return this.promptTemplates.get(eventType) || 'Apply general furniture design principles appropriate for the event context.';
  }
}