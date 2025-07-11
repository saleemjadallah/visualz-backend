"""
Enhanced AI Prompt System for Parametric 3D Generation
Integrates cultural database, template orchestrator, and Three.js output
"""

from typing import Dict, List, Any, Optional, Union
from pydantic import BaseModel, Field
from enum import Enum
import json
import os
from pathlib import Path

class CulturalSensitivityLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    SACRED = "sacred"

class EventComplexity(str, Enum):
    SIMPLE = "simple"
    MODERATE = "moderate"
    COMPLEX = "complex"
    ENTERPRISE = "enterprise"

class OutputFormat(str, Enum):
    PARAMETRIC_3D = "parametric_3d"
    DETAILED_SPECIFICATIONS = "detailed_specifications"
    CULTURAL_GUIDANCE = "cultural_guidance"
    BUDGET_OPTIMIZATION = "budget_optimization"
    ORCHESTRATION_PARAMETERS = "orchestration_parameters"

class ParametricPromptRequest(BaseModel):
    event_type: str = Field(..., description="Type of event (wedding, corporate, cultural-ceremony, etc.)")
    cultural_background: List[str] = Field(..., description="Primary and secondary cultural backgrounds")
    space_dimensions: Dict[str, float] = Field(..., description="Width, depth, height in meters")
    guest_count: int = Field(..., description="Total number of expected guests")
    budget_range: str = Field(..., description="Budget category: low, medium, high, luxury")
    accessibility_requirements: List[str] = Field(default=[], description="Specific accessibility needs")
    style_preferences: List[str] = Field(default=[], description="Style and aesthetic preferences")
    cultural_sensitivity: CulturalSensitivityLevel = Field(default=CulturalSensitivityLevel.MEDIUM)
    complexity_level: EventComplexity = Field(default=EventComplexity.MODERATE)
    desired_outputs: List[OutputFormat] = Field(default=[OutputFormat.PARAMETRIC_3D])
    three_js_integration: bool = Field(default=True, description="Include Three.js code generation")
    parametric_generation: bool = Field(default=True, description="Use parametric template system")
    venue_type: str = Field(default="indoor", description="indoor, outdoor, mixed, covered-outdoor")
    timing: Dict[str, str] = Field(default={}, description="Season, time of day, weather expectations")
    special_requirements: List[str] = Field(default=[], description="Unique event requirements")

class OrchestrationIntegration(BaseModel):
    """Integration parameters for the EventOrchestrationMaster system"""
    template_priority: List[str] = Field(default=[], description="Priority order for template selection")
    cultural_fusion_allowed: bool = Field(default=True, description="Allow cultural fusion elements")
    sustainability_focus: bool = Field(default=True, description="Prioritize sustainable materials")
    interactive_elements: bool = Field(default=False, description="Include interactive experiences")
    quality_threshold: float = Field(default=0.8, description="Minimum quality score (0-1)")

class EnhancedAIPromptSystem:
    """
    Enhanced AI Prompt System that integrates:
    - Cultural database intelligence
    - Parametric template orchestration
    - Three.js 3D output formatting
    - Budget and accessibility optimization
    - EventOrchestrationMaster integration
    """
    
    def __init__(self):
        self.base_system_prompt = self._load_base_system_prompt()
        self.cultural_prompt_templates = self._load_cultural_templates()
        self.parametric_templates = self._load_parametric_templates()
        self.three_js_output_schema = self._load_three_js_schema()
        self.orchestration_templates = self._load_orchestration_templates()
        
    def _load_base_system_prompt(self) -> str:
        return """
        You are an advanced AI event designer with deep cultural intelligence, parametric 3D modeling expertise, and EventOrchestrationMaster integration capabilities. You combine:

        CORE EXPERTISE:
        - 20+ years interior design experience (Kelly Wearstler's Material Tray Method, Studio McGee's spatial planning)
        - Cultural anthropologist knowledge with authentic tradition understanding
        - Parametric 3D modeling for infinite design variations
        - Three.js scene optimization and real-time rendering
        - Accessibility compliance and inclusive design principles
        - Master-level template orchestration and system integration

        CULTURAL INTELLIGENCE DATABASE ACCESS:
        - Authentic proportions, materials, and symbolic meanings for 50+ cultures
        - Seasonal variations and regional adaptations
        - Sacred vs. secular design requirements
        - Cultural fusion best practices and sensitivity protocols
        - Elder consultation recommendations for authenticity validation
        - Community-based cultural validation processes

        PARAMETRIC GENERATION CAPABILITIES:
        - EventOrchestrationMaster for comprehensive event design
        - Dynamic furniture templates (ChairTemplate, TableTemplate, PlaygroundTemplate, etc.)
        - System templates (LightingTemplate, ClimateTemplate, SecurityTemplate, AVTemplate)
        - Structural elements (StructureTemplate, LandscapeTemplate)
        - Interactive experiences (InteractiveTemplate)
        - Budget-adaptive material selection with vendor integration
        - Accessibility feature integration across all templates

        ORCHESTRATION SYSTEM INTEGRATION:
        - Master-level coordination of 11+ parametric templates
        - Cultural framework establishment and validation
        - Spatial optimization with golden ratio and cultural spacing
        - Budget optimization across all design elements
        - Quality validation and cultural authenticity scoring
        - Experience design with emotional arc planning
        - Technical system integration (power, network, climate, security, AV)

        THREE.JS OUTPUT OPTIMIZATION:
        - Generate parametric code that creates Three.js compatible objects
        - Optimize for real-time rendering and manipulation
        - Include physics properties for collision detection
        - Provide material specifications with PBR properties
        - Enable drag-and-drop functionality with proper transforms
        - Support React Three Fiber component integration

        RESPONSE REQUIREMENTS:
        - Always include exact measurements and technical specifications
        - Provide cultural context and reasoning for design choices
        - Generate EventOrchestrationMaster parameters for comprehensive design
        - Include budget breakdown with vendor recommendations
        - Suggest accessibility enhancements and cultural sensitivity checks
        - Provide complete Three.js/React Three Fiber integration code
        """

    def _load_cultural_templates(self) -> Dict[str, str]:
        # Load cultural celebration templates
        cultural_celebrations = self._add_celebratory_cultural_templates()
        
        base_templates = {
            "japanese_formal": """
            CULTURAL CONTEXT: Japanese formal events (tea ceremony, wedding, business)
            ORCHESTRATION PARAMETERS:
            - primaryCulture: 'japanese'
            - culturalSensitivity: 'high'
            - ceremonyElements: ['tea-ceremony', 'seasonal-awareness', 'ma-negative-space']
            
            DESIGN PRINCIPLES:
            - Ma (negative space): 40% open space for contemplation
            - Wabi-sabi: Embrace natural imperfections and seasonal change
            - Seating: Floor-oriented (40-50cm height) with back support for elderly
            - Materials: Natural wood (hinoki, bamboo), earth tones, minimal metal
            - Lighting: Soft, diffused, 2700K warmth mimicking paper lanterns
            - Sacred elements: Consider kamiza (honored position) orientation
            
            EVENTORCHESTRATIONMASTER INTEGRATION:
            ```typescript
            const orchestrationParams: EventOrchestrationParameters = {
              eventType: 'tea-ceremony',
              primaryCulture: 'japanese',
              culturalSensitivity: 'high',
              atmosphere: 'contemplative',
              venue: {
                type: 'indoor',
                acoustics: 'excellent',
                naturalLight: 'moderate'
              },
              guests: {
                total: guestCount,
                culturalBackgrounds: ['japanese'],
                accessibility: accessibilityRequirements
              }
            };
            ```
            
            PARAMETRIC ADJUSTMENTS:
            - ChairTemplate: Reduce heights by 15-20cm, add back support
            - TableTemplate: Low tables (35-40cm) with floor cushion integration
            - LightingTemplate: Warm 2700K, diffused, paper lantern aesthetics
            - StructureTemplate: Sliding panels, natural wood frames
            """,
            
            "scandinavian_hygge": """
            CULTURAL CONTEXT: Scandinavian hygge celebrations (family, seasonal, intimate)
            ORCHESTRATION PARAMETERS:
            - primaryCulture: 'scandinavian'
            - atmosphere: 'intimate'
            - memorabilityGoals: ['cozy-togetherness', 'seasonal-celebration']
            
            DESIGN PRINCIPLES:
            - Hygge philosophy: Cozy comfort and warm togetherness
            - Light therapy: Combat seasonal darkness with layered lighting
            - Natural materials: Light woods (birch, pine), wool, linen textures
            - Color palette: Whites, soft grays, muted blues, natural wood tones
            - Furniture: Substantial comfort, curved edges, tactile warmth
            
            EVENTORCHESTRATIONMASTER INTEGRATION:
            ```typescript
            const orchestrationParams: EventOrchestrationParameters = {
              eventType: 'celebration',
              primaryCulture: 'scandinavian',
              atmosphere: 'intimate',
              timing: {
                season: 'winter',
                timeOfDay: 'evening'
              },
              technology: {
                lighting: 'adaptive'
              }
            };
            ```
            
            PARAMETRIC ADJUSTMENTS:
            - ChairTemplate: Deep cushions, curved edges, wool upholstery
            - LightingTemplate: Layered lighting, candle simulation, 1800K-3000K
            - ClimateTemplate: Enhanced heating zones, humidity control
            - InteractiveTemplate: Cozy reading nooks, family game areas
            """,
            
            "italian_celebration": """
            CULTURAL CONTEXT: Italian celebrations (wedding, family gathering, feast)
            ORCHESTRATION PARAMETERS:
            - primaryCulture: 'italian'
            - atmosphere: 'celebratory'
            - interactionStyle: 'mingling'
            - emotionalJourney: ['arrival-excitement', 'feast-abundance', 'celebration-joy']
            
            DESIGN PRINCIPLES:
            - La Dolce Vita: Elegant enjoyment and stylish comfort
            - Family hierarchy: Honor positions and generational seating
            - Abundance aesthetics: Rich textures, warm colors, generous proportions
            - Social interaction: Circular arrangements, conversation facilitation
            - Artisanal quality: Handcrafted details and traditional techniques
            
            EVENTORCHESTRATIONMASTER INTEGRATION:
            ```typescript
            const orchestrationParams: EventOrchestrationParameters = {
              eventType: 'celebration',
              primaryCulture: 'italian',
              atmosphere: 'celebratory',
              guests: {
                total: guestCount,
                culturalBackgrounds: ['italian'],
                vip: Math.ceil(guestCount * 0.1) // Honor positions
              },
              budget: {
                total: budgetAmount,
                breakdown: {
                  furniture: budgetAmount * 0.45,
                  staging: budgetAmount * 0.25,
                  floral: budgetAmount * 0.15,
                  technology: budgetAmount * 0.15
                }
              }
            };
            ```
            
            PARAMETRIC ADJUSTMENTS:
            - TableTemplate: Long family tables, abundant surface area
            - ChairTemplate: Elegant wooden chairs with comfortable cushions
            - LightingTemplate: Warm golden lighting, dramatic accent lights
            - FloralTemplate: Abundant arrangements, seasonal Italian flowers
            """,
            
            "modern_minimalist": """
            CULTURAL CONTEXT: Modern minimalist events (corporate, contemporary)
            ORCHESTRATION PARAMETERS:
            - primaryCulture: 'modern'
            - atmosphere: 'sophisticated'
            - interactionStyle: 'professional'
            
            DESIGN PRINCIPLES:
            - Less is more: Clean lines, functional beauty, essential elements
            - Technology integration: Smart systems, seamless connectivity
            - Sustainable materials: Eco-friendly choices, local sourcing
            - Accessibility first: Universal design principles
            - Flexible functionality: Modular, adaptable arrangements
            
            EVENTORCHESTRATIONMASTER INTEGRATION:
            ```typescript
            const orchestrationParams: EventOrchestrationParameters = {
              eventType: 'corporate',
              primaryCulture: 'modern',
              atmosphere: 'sophisticated',
              technology: {
                audioVisual: true,
                lighting: 'professional',
                interactive: true
              },
              priorities: ['sustainability', 'accessibility', 'technology-integration']
            };
            ```
            """,
            
            "cultural_fusion": """
            CULTURAL CONTEXT: Multi-cultural fusion events
            ORCHESTRATION PARAMETERS:
            - primaryCulture: 'modern'
            - secondaryCultures: [additional cultures]
            - culturalFusion: true
            - culturalSensitivity: 'high'
            
            DESIGN PRINCIPLES:
            - Respectful integration: Honor all traditions without appropriation
            - Bridging elements: Find common cultural values and aesthetics
            - Educational opportunities: Share cultural knowledge respectfully
            - Community involvement: Include cultural representatives in planning
            - Adaptive spaces: Flexible areas for different cultural practices
            
            EVENTORCHESTRATIONMASTER INTEGRATION:
            ```typescript
            const orchestrationParams: EventOrchestrationParameters = {
              eventType: 'cultural-ceremony',
              primaryCulture: primaryCulture,
              secondaryCultures: secondaryCultures,
              culturalFusion: true,
              culturalSensitivity: 'high',
              guests: {
                culturalBackgrounds: allCultures,
                languageSupport: requiredLanguages
              }
            };
            ```
            """
        }
        
        # Merge base templates with celebratory cultural templates
        base_templates.update(cultural_celebrations)
        return base_templates

    def _load_parametric_templates(self) -> Dict[str, str]:
        return {
            "chair_orchestration": """
            CHAIR TEMPLATE ORCHESTRATION:
            
            Use EventOrchestrationMaster to generate sophisticated chair arrangements:
            
            ```typescript
            // Chair parameters generated by orchestration system
            const chairParameters = await orchestrator.generateChairParameters(
              orchestrationParams,
              culturalFramework,
              templateStrategy
            );
            
            // Multiple chair types for different zones and purposes
            chairParameters.forEach(params => {
              const chair = new ChairTemplate().generateChair(params);
              chair.userData = {
                draggable: true,
                category: 'seating',
                culturalSignificance: params.culturalElements,
                accessibilityFeatures: params.ergonomicProfile,
                budgetTier: params.materialTier,
                orchestrationZone: params.zoneId
              };
            });
            ```
            """,
            
            "table_orchestration": """
            TABLE TEMPLATE ORCHESTRATION:
            
            Use EventOrchestrationMaster for intelligent table placement and sizing:
            
            ```typescript
            // Table parameters with cultural spacing and capacity optimization
            const tableParameters = await orchestrator.generateTableParameters(
              orchestrationParams,
              culturalFramework,
              templateStrategy
            );
            
            // Generate tables with cultural proportions and accessibility
            tableParameters.forEach(params => {
              const table = new TableTemplate().generateTable(params);
              table.userData = {
                draggable: true,
                resizable: true,
                category: 'surface',
                culturalProportions: params.culturalDimensions,
                accessibilityCompliant: params.accessibilityFeatures,
                capacityOptimized: params.optimizedCapacity
              };
            });
            ```
            """,
            
            "lighting_orchestration": """
            LIGHTING TEMPLATE ORCHESTRATION:
            
            Comprehensive lighting system through EventOrchestrationMaster:
            
            ```typescript
            // Lighting system with cultural ambiance and technical integration
            const lightingParameters = await orchestrator.generateLightingParameters(
              orchestrationParams,
              culturalFramework,
              templateStrategy
            );
            
            const lightingSystem = new LightingTemplate().generateLighting(lightingParameters);
            
            // Integrate with Three.js scene
            scene.add(lightingSystem.ambientLight);
            lightingSystem.taskLights.forEach(light => {
              light.userData.culturalMeaning = lightingParameters.traditionalElements;
              light.userData.accessibilityFeature = true;
              scene.add(light);
            });
            ```
            """,
            
            "system_orchestration": """
            SYSTEM TEMPLATE ORCHESTRATION:
            
            Climate, Security, AV, and other system templates:
            
            ```typescript
            // Climate system with cultural comfort preferences
            const climateParams = await orchestrator.generateClimateParameters(orchestrationParams);
            const climateSystem = new ClimateTemplate().generateClimateSystem(climateParams);
            
            // Security system with cultural sensitivity
            const securityParams = await orchestrator.generateSecurityParameters(orchestrationParams);
            const securitySystem = new SecurityTemplate().generateSecuritySystem(securityParams);
            
            // AV system with accessibility and cultural requirements
            const avParams = await orchestrator.generateAVParameters(orchestrationParams);
            const avSystem = new AVTemplate().generateAVSystem(avParams);
            
            // Landscape integration for outdoor/mixed venues
            if (orchestrationParams.venue.type !== 'indoor') {
              const landscapeParams = await orchestrator.generateLandscapeParameters(orchestrationParams);
              const landscapeDesign = new LandscapeTemplate().generateLandscape(landscapeParams);
            }
            ```
            """,

            "celebratory_generation": self._add_celebratory_props_template()
        }

    def _load_three_js_schema(self) -> Dict[str, Any]:
        return {
            "ai_threejs_integration": {
                "service": "AIThreeJSIntegrationService handles AI response to Three.js scene conversion",
                "scene_generation": "Converts AI design responses to parametric Three.js objects",
                "celebratory_support": "Full integration with CelebratoryTemplate and cultural specializations",
                "furniture_mapping": "AI specifications automatically mapped to parametric templates",
                "cultural_elements": "Authentic cultural decorations and ceremonial objects",
                "accessibility": "Built-in accessibility features and compliance checking",
                "interaction": "Drag-drop, resize, and real-time editing capabilities"
            },
            "integration_workflow": {
                "step1": "AI generates AIDesignResponse with spatial layout and specifications",
                "step2": "AIThreeJSIntegrationService.generateThreeJSScene() creates scene",
                "step3": "Parametric templates generate objects from AI parameters",
                "step4": "Cultural elements and celebratory props added automatically",
                "step5": "Accessibility features and interaction handlers enabled",
                "step6": "Complete Three.js scene ready for rendering and editing"
            }
        }

    def _load_orchestration_templates(self) -> Dict[str, str]:
        return {
            "master_orchestration": """
            EVENTORCHESTRATIONMASTER INTEGRATION:
            
            ```typescript
            import { EventOrchestrationMaster, EventOrchestrationParameters } from './orchestration';
            
            // Initialize orchestration system
            const orchestrator = new EventOrchestrationMaster();
            
            // Build comprehensive parameters from AI prompt analysis
            const orchestrationParams: EventOrchestrationParameters = {
              // Event Foundation
              eventType: determineEventType(promptRequest.event_type),
              scale: calculateScale(promptRequest.guest_count),
              duration: estimateEventDuration(promptRequest.event_type),
              
              // Cultural Foundation
              primaryCulture: promptRequest.cultural_background[0],
              secondaryCultures: promptRequest.cultural_background.slice(1),
              culturalFusion: promptRequest.cultural_background.length > 1,
              ceremonyElements: extractCeremonyElements(promptRequest),
              culturalSensitivity: promptRequest.cultural_sensitivity,
              
              // Space Definition
              venue: {
                type: promptRequest.venue_type,
                dimensions: promptRequest.space_dimensions,
                existingFeatures: [],
                restrictions: [],
                climate: 'controlled',
                acoustics: 'good',
                naturalLight: 'moderate'
              },
              
              // Guest Demographics
              guests: {
                total: promptRequest.guest_count,
                adults: Math.floor(promptRequest.guest_count * 0.8),
                children: Math.floor(promptRequest.guest_count * 0.15),
                elderly: Math.floor(promptRequest.guest_count * 0.05),
                vip: Math.floor(promptRequest.guest_count * 0.1),
                accessibility: promptRequest.accessibility_requirements,
                culturalBackgrounds: promptRequest.cultural_background,
                languageSupport: determineLanguageSupport(promptRequest.cultural_background)
              },
              
              // Experience Goals
              atmosphere: mapStyleToAtmosphere(promptRequest.style_preferences),
              interactionStyle: determineInteractionStyle(promptRequest.event_type),
              memorabilityGoals: extractMemorabilityGoals(promptRequest),
              emotionalJourney: designEmotionalJourney(promptRequest),
              
              // Technical Requirements
              technology: {
                audioVisual: promptRequest.complexity_level !== 'simple',
                streaming: false,
                recording: promptRequest.complexity_level === 'enterprise',
                interactive: promptRequest.complexity_level in ['complex', 'enterprise'],
                projection: false,
                lighting: mapComplexityToLighting(promptRequest.complexity_level)
              },
              
              // Environmental
              timing: {
                season: promptRequest.timing.season || 'spring',
                timeOfDay: promptRequest.timing.timeOfDay || 'evening',
                weather: promptRequest.timing.weather || 'variable'
              },
              
              // Budget
              budget: parseBudgetRange(promptRequest.budget_range),
              
              // Priorities
              priorities: determinePriorities(promptRequest),
              constraints: promptRequest.special_requirements
            };
            
            // Execute comprehensive orchestration
            const orchestrationResult = await orchestrator.orchestrateEvent(orchestrationParams);
            
            // Extract Three.js scene and components
            const threeJsScene = orchestrationResult.scene;
            const qualityMetrics = orchestrationResult.qualityMetrics;
            const budgetBreakdown = orchestrationResult.budgetBreakdown;
            const culturalValidation = orchestrationResult.culturalValidation;
            ```
            """,
            
            "react_integration": """
            REACT THREE FIBER INTEGRATION:
            
            ```tsx
            import { Canvas } from '@react-three/fiber';
            import { OrchestrationProvider, useOrchestration } from './hooks/useOrchestration';
            
            // Main Event Design Component
            function EventDesignCanvas({ orchestrationParams }: { orchestrationParams: EventOrchestrationParameters }) {
              return (
                <OrchestrationProvider params={orchestrationParams}>
                  <Canvas shadows camera={{ position: [0, 10, 10] }}>
                    <OrchestrationScene />
                    <Controls />
                    <Environment />
                  </Canvas>
                  <OrchestrationUI />
                </OrchestrationProvider>
              );
            }
            
            // Orchestration Scene Component
            function OrchestrationScene() {
              const { 
                orchestrationResult, 
                loading, 
                error,
                updateParameters,
                validateCulturalElements 
              } = useOrchestration();
              
              if (loading) return <LoadingSpinner />;
              if (error) return <ErrorBoundary error={error} />;
              
              return (
                <group>
                  {/* Render all orchestrated elements */}
                  {orchestrationResult.furniture.map(item => (
                    <FurnitureComponent key={item.id} item={item} />
                  ))}
                  
                  {orchestrationResult.lighting.map(light => (
                    <LightingComponent key={light.id} light={light} />
                  ))}
                  
                  {orchestrationResult.interactive.map(element => (
                    <InteractiveElement key={element.id} element={element} />
                  ))}
                  
                  {/* Cultural elements with validation */}
                  <CulturalElementsGroup 
                    elements={orchestrationResult.culturalElements}
                    validation={orchestrationResult.culturalValidation}
                  />
                </group>
              );
            }
            
            // Custom hooks for orchestration
            function useOrchestration() {
              const context = useContext(OrchestrationContext);
              
              return {
                ...context,
                updateParameters: (newParams: Partial<EventOrchestrationParameters>) => {
                  context.setParameters(prev => ({ ...prev, ...newParams }));
                },
                validateCulturalElements: () => {
                  return context.orchestrator.validateCulturalAuthenticity(
                    context.parameters,
                    context.result
                  );
                }
              };
            }
            ```
            """
        }

    def generate_enhanced_prompt(
        self, 
        request: ParametricPromptRequest,
        orchestration_config: Optional[OrchestrationIntegration] = None
    ) -> str:
        """
        Generate sophisticated prompt that integrates cultural database,
        parametric templates, EventOrchestrationMaster, and Three.js output
        """
        
        if orchestration_config is None:
            orchestration_config = OrchestrationIntegration()
        
        # Build cultural context
        cultural_context = self._build_cultural_context(request)
        
        # Build orchestration guidance
        orchestration_guidance = self._build_orchestration_guidance(request, orchestration_config)
        
        # Build parametric guidance
        parametric_guidance = self._build_parametric_guidance(request)
        
        # Build Three.js output specifications
        threejs_specifications = self._build_threejs_specifications(request)
        
        # Build accessibility requirements
        accessibility_guidance = self._build_accessibility_guidance(request)
        
        # Build budget optimization
        budget_guidance = self._build_budget_guidance(request)

        enhanced_prompt = f"""
        {self.base_system_prompt}

        ## EVENT DESIGN CHALLENGE

        **EVENT TYPE**: {request.event_type}
        **CULTURAL BACKGROUNDS**: {', '.join(request.cultural_background)}
        **SPACE DIMENSIONS**: Width: {request.space_dimensions.get('width', 'TBD')}m, Depth: {request.space_dimensions.get('depth', 'TBD')}m, Height: {request.space_dimensions.get('height', 'TBD')}m
        **GUEST COUNT**: {request.guest_count}
        **VENUE TYPE**: {request.venue_type}
        **BUDGET RANGE**: {request.budget_range}
        **ACCESSIBILITY NEEDS**: {', '.join(request.accessibility_requirements) if request.accessibility_requirements else 'Standard compliance'}
        **STYLE PREFERENCES**: {', '.join(request.style_preferences) if request.style_preferences else 'Open to suggestions'}
        **CULTURAL SENSITIVITY LEVEL**: {request.cultural_sensitivity.value}
        **COMPLEXITY LEVEL**: {request.complexity_level.value}
        **TIMING**: {request.timing}
        **SPECIAL REQUIREMENTS**: {', '.join(request.special_requirements) if request.special_requirements else 'None specified'}

        ## EVENTORCHESTRATIONMASTER INTEGRATION
        {orchestration_guidance}

        ## CULTURAL INTELLIGENCE INTEGRATION
        {cultural_context}

        ## PARAMETRIC TEMPLATE ORCHESTRATION
        {parametric_guidance}

        ## THREE.JS & REACT THREE FIBER INTEGRATION
        {threejs_specifications}

        ## ACCESSIBILITY REQUIREMENTS
        {accessibility_guidance}

        ## BUDGET OPTIMIZATION STRATEGY
        {budget_guidance}

        ## REQUIRED OUTPUT FORMAT

        Provide a comprehensive design solution that includes:

        1. **EVENTORCHESTRATIONMASTER PARAMETERS**: Complete TypeScript configuration for the orchestration system with all 11 templates properly parameterized.

        2. **CULTURAL DESIGN NARRATIVE**: Explain how the design honors and integrates the specified cultural traditions while meeting modern accessibility and comfort requirements.

        3. **ORCHESTRATION EXECUTION CODE**: JavaScript/TypeScript code that uses EventOrchestrationMaster to generate the complete event design.

        4. **REACT THREE FIBER COMPONENTS**: Complete React components with hooks for interactive 3D visualization and manipulation.

        5. **SPATIAL LAYOUT OPTIMIZATION**: Apply golden ratio, conversation distances (7-9 feet), traffic pathways (36+ inches), and cultural spatial requirements through the orchestration system.

        6. **MATERIAL AND COLOR SPECIFICATIONS**: Include exact Pantone/RAL codes, material textures, and cultural symbolic meanings integrated into the parametric templates.

        7. **COMPREHENSIVE SYSTEM INTEGRATION**: Lighting, climate, security, AV, and interactive systems orchestrated together with cultural sensitivity.

        8. **BUDGET BREAKDOWN WITH ALTERNATIVES**: Itemized costs with vendor recommendations and parametric material substitution options.

        9. **ACCESSIBILITY COMPLIANCE**: WCAG 2.1 AA compliance features integrated into all template parameters.

        10. **CULTURAL SENSITIVITY VALIDATION**: Real-time cultural appropriateness checking and community consultation recommendations.

        11. **QUALITY METRICS DASHBOARD**: Live quality scoring across cultural, spatial, technical, experience, accessibility, and sustainability dimensions.

        12. **IMPLEMENTATION ORCHESTRATION**: Setup sequence, vendor coordination, and day-of logistics generated by the orchestration system.

        Format all code for direct integration into a React Three Fiber application with TypeScript, proper error handling, and performance optimization.

        **CRITICAL REQUIREMENT**: All responses must generate working EventOrchestrationMaster parameters and demonstrate the complete orchestration workflow from cultural analysis through Three.js scene generation.
        """

        return enhanced_prompt

    def _build_orchestration_guidance(
        self, 
        request: ParametricPromptRequest, 
        config: OrchestrationIntegration
    ) -> str:
        """Build EventOrchestrationMaster integration guidance"""
        
        return f"""
        EVENTORCHESTRATIONMASTER INTEGRATION REQUIREMENTS:

        **ORCHESTRATION PRIORITIES**:
        1. Cultural authenticity and sensitivity (Weight: 30%)
        2. Guest comfort and accessibility (Weight: 25%)
        3. Event functionality and logistics (Weight: 20%)
        4. Budget optimization (Weight: 15%)
        5. Aesthetic excellence (Weight: 10%)

        **TEMPLATE ORCHESTRATION STRATEGY**:
        - Primary Templates: ChairTemplate, TableTemplate, LightingTemplate (always required)
        - System Templates: ClimateTemplate, SecurityTemplate, AVTemplate (based on complexity)
        - Specialized Templates: LandscapeTemplate, StructureTemplate, InteractiveTemplate (as needed)
        - Cultural Templates: FloralTemplate, StageTemplate (cultural events)

        **ORCHESTRATION PARAMETERS MAPPING**:
        ```typescript
        const orchestrationParams: EventOrchestrationParameters = {{
          // Map AI prompt request to orchestration parameters
          eventType: mapEventType('{request.event_type}'),
          scale: calculateEventScale({request.guest_count}),
          primaryCulture: '{request.cultural_background[0] if request.cultural_background else 'modern'}',
          secondaryCultures: {request.cultural_background[1:] if len(request.cultural_background) > 1 else []},
          culturalSensitivity: '{request.cultural_sensitivity.value}',
          
          venue: {{
            type: '{request.venue_type}',
            dimensions: {request.space_dimensions},
            climate: determineClimate('{request.venue_type}'),
            acoustics: 'good',
            naturalLight: 'moderate'
          }},
          
          guests: {{
            total: {request.guest_count},
            accessibility: {request.accessibility_requirements},
            culturalBackgrounds: {request.cultural_background}
          }},
          
          budget: parseBudgetRange('{request.budget_range}'),
          
          technology: {{
            lighting: mapComplexityToLighting('{request.complexity_level.value}'),
            audioVisual: {str(request.complexity_level != EventComplexity.SIMPLE).lower()},
            interactive: {str(config.interactive_elements).lower()}
          }},
          
          priorities: ['cultural-authenticity', 'accessibility', 'guest-comfort'],
          
          timing: {request.timing if request.timing else {}}
        }};
        ```

        **QUALITY VALIDATION REQUIREMENTS**:
        - Minimum quality threshold: {config.quality_threshold}
        - Cultural authenticity validation: Required
        - Accessibility compliance: WCAG 2.1 AA minimum
        - Budget optimization: Multi-tier material options
        - Sustainability scoring: {str(config.sustainability_focus).lower()}

        **ORCHESTRATION WORKFLOW**:
        1. Initialize EventOrchestrationMaster
        2. Establish cultural framework and validation
        3. Generate master spatial plan with zones
        4. Calculate optimal template instantiation order
        5. Generate parameters for each template with relationships
        6. Validate cultural authenticity and appropriateness
        7. Optimize budget allocation across templates
        8. Generate Three.js scene with all elements
        9. Provide quality metrics and improvement recommendations
        10. Output React Three Fiber components for interaction
        """

    def _build_cultural_context(self, request: ParametricPromptRequest) -> str:
        """Build cultural intelligence context based on the request"""
        
        cultural_contexts = []
        for culture in request.cultural_background:
            culture_key = f"{culture.lower()}_formal" if culture.lower() in ['japanese', 'scandinavian', 'italian'] else culture.lower()
            if culture_key in self.cultural_prompt_templates:
                cultural_contexts.append(self.cultural_prompt_templates[culture_key])
        
        # Add fusion guidance if multiple cultures
        if len(request.cultural_background) > 1:
            cultural_contexts.append(self.cultural_prompt_templates["cultural_fusion"])
        
        return "\n\n".join(cultural_contexts) if cultural_contexts else self.cultural_prompt_templates["modern_minimalist"]

    def _build_parametric_guidance(self, request: ParametricPromptRequest) -> str:
        """Build parametric template usage guidance"""
        
        if not request.parametric_generation:
            return "Use static design elements without parametric generation."
        
        guidance = """
        PARAMETRIC TEMPLATE ORCHESTRATION REQUIRED:

        Use EventOrchestrationMaster to coordinate all parametric templates:
        1. **FURNITURE ORCHESTRATION**: ChairTemplate, TableTemplate with cultural adaptations
        2. **SYSTEM ORCHESTRATION**: LightingTemplate, ClimateTemplate, SecurityTemplate, AVTemplate
        3. **STRUCTURAL ORCHESTRATION**: StructureTemplate for architectural elements
        4. **LANDSCAPE ORCHESTRATION**: LandscapeTemplate for outdoor integration
        5. **INTERACTIVE ORCHESTRATION**: InteractiveTemplate for engagement features
        6. **CULTURAL ORCHESTRATION**: FloralTemplate, StageTemplate for ceremonies
        7. **CELEBRATORY ORCHESTRATION**: CelebratoryTemplate for celebration props and themed decorations

        **ORCHESTRATION ADVANTAGES**:
        - Automatic cultural validation across all templates
        - Optimized spatial relationships and traffic flow
        - Budget optimization with material substitution
        - Accessibility integration in all components
        - Quality scoring and improvement recommendations
        - Real-time cultural appropriateness checking
        - Age-appropriate celebration elements and safety considerations
        """
        
        # Detect celebration events and add celebratory template
        celebration_keywords = [
            'birthday', 'anniversary', 'graduation', 'quinceañera', 'bar-mitzvah', 'bat-mitzvah',
            'celebration', 'party', 'milestone', 'doljanchi', 'baby-shower', 'sweet-sixteen'
        ]
        
        celebration_cultures = ['mexican', 'latin', 'jewish', 'korean', 'american']
        
        is_celebration = (
            any(keyword in request.event_type.lower() for keyword in celebration_keywords) or
            any(keyword in ' '.join(request.style_preferences).lower() for keyword in celebration_keywords) or
            any(culture in request.cultural_background for culture in celebration_cultures)
        )
        
        # Add specific orchestration templates
        template_keys = ["chair_orchestration", "table_orchestration", "lighting_orchestration", "system_orchestration"]
        
        if is_celebration:
            template_keys.append("celebratory_generation")
            guidance += "\n\n**CELEBRATION DETECTED**: Including CelebratoryTemplate for culturally-appropriate celebration props and themed decorations."
        
        for template_key in template_keys:
            if template_key in self.parametric_templates:
                guidance += "\n\n" + self.parametric_templates[template_key]
        
        # Add master orchestration template
        guidance += "\n\n" + self.orchestration_templates["master_orchestration"]
        
        return guidance

    def _build_threejs_specifications(self, request: ParametricPromptRequest) -> str:
        """Build Three.js and React Three Fiber specifications"""
        
        if not request.three_js_integration:
            return "Provide design specifications without Three.js code integration."
        
        base_specs = f"""
        THREE.JS & REACT THREE FIBER INTEGRATION:

        **ORCHESTRATION SCENE ARCHITECTURE**:
        ```tsx
        import {{ EventOrchestrationMaster }} from './orchestration';
        import {{ Canvas }} from '@react-three/fiber';
        
        function EventDesignApp() {{
          const [orchestrationResult, setOrchestrationResult] = useState(null);
          const [loading, setLoading] = useState(true);
          
          useEffect(() => {{
            async function orchestrateEvent() {{
              const orchestrator = new EventOrchestrationMaster();
              const result = await orchestrator.orchestrateEvent(orchestrationParams);
              setOrchestrationResult(result);
              setLoading(false);
            }}
            orchestrateEvent();
          }}, []);
          
          if (loading) return <LoadingIndicator />;
          
          return (
            <Canvas shadows camera={{{{ position: [0, 10, 10] }}}}>
              <OrchestrationScene result={{orchestrationResult}} />
              <OrbitControls />
              <Environment preset="sunset" />
            </Canvas>
          );
        }}
        ```

        **PERFORMANCE OPTIMIZATION**:
        - Instance rendering for repeated furniture elements
        - LOD (Level of Detail) based on camera distance
        - Frustum culling for large spaces
        - Texture atlas optimization for materials
        - Efficient shadow mapping for realistic lighting

        **INTERACTION SYSTEM**:
        - Drag-and-drop with physics constraints
        - Object snapping and alignment guides
        - Cultural information overlays on hover
        - Accessibility keyboard navigation
        - Voice command integration for screen readers

        **CULTURAL VALIDATION UI**:
        - Real-time cultural appropriateness scoring
        - Visual indicators for cultural significance
        - Elder consultation request system
        - Community feedback integration
        - Educational cultural information panels
        """
        
        # Add React integration template
        base_specs += "\n\n" + self.orchestration_templates["react_integration"]
        
        return base_specs

    def _build_accessibility_guidance(self, request: ParametricPromptRequest) -> str:
        """Build accessibility compliance guidance"""
        
        guidance = """
        ACCESSIBILITY ORCHESTRATION REQUIREMENTS (WCAG 2.1 AA):

        **UNIVERSAL DESIGN INTEGRATION**:
        - All template parameters include accessibility options
        - EventOrchestrationMaster validates accessibility compliance
        - Automatic wheelchair navigation path optimization
        - Visual, auditory, and cognitive accessibility features
        - Multi-language support through orchestration system

        **ORCHESTRATION ACCESSIBILITY FEATURES**:
        - ChairTemplate: Adjustable heights, back support, wheelchair spaces
        - TableTemplate: Height variation, wheelchair accessibility, easy access
        - LightingTemplate: High contrast modes, adjustable brightness
        - InteractiveTemplate: Screen reader compatibility, voice commands
        - SecurityTemplate: Discrete accessibility monitoring and assistance

        **THREE.JS ACCESSIBILITY INTEGRATION**:
        ```tsx
        // Accessibility features in React Three Fiber
        function AccessibleEventScene({ orchestrationResult }) {
          const { accessibilityMode, setAccessibilityMode } = useAccessibility();
          
          return (
            <group>
              {orchestrationResult.furniture.map(item => (
                <AccessibleFurniture 
                  key={item.id}
                  item={item}
                  accessibilityMode={accessibilityMode}
                  aria-label={item.culturalDescription}
                  tabIndex={0}
                />
              ))}
              
              <AccessibilityControls onModeChange={setAccessibilityMode} />
              <NavigationAids paths={orchestrationResult.accessiblePaths} />
            </group>
          );
        }
        ```
        """
        
        if request.accessibility_requirements:
            specific_requirements = "\n\n**SPECIFIC ACCESSIBILITY ORCHESTRATION**:\n"
            for requirement in request.accessibility_requirements:
                specific_requirements += f"- {requirement}: Integrated into all template parameters with validation\n"
            guidance += specific_requirements
        
        return guidance

    def _build_budget_guidance(self, request: ParametricPromptRequest) -> str:
        """Build budget optimization guidance with orchestration integration"""
        
        budget_ranges = {
            "low": "Under $2,000 - EventOrchestrationMaster optimizes for essential elements only",
            "medium": "$2,000-$8,000 - Balanced professional elements with cost optimization",
            "high": "$8,000-$20,000 - Premium materials with orchestrated luxury elements",
            "luxury": "Over $20,000 - Custom orchestration with artisanal and premium elements"
        }
        
        budget_description = budget_ranges.get(request.budget_range.lower(), "Custom budget optimization")
        
        return f"""
        BUDGET ORCHESTRATION STRATEGY: {budget_description}

        **EVENTORCHESTRATIONMASTER BUDGET OPTIMIZATION**:
        - Automatic material tier selection based on budget constraints
        - Template parameter optimization for cost efficiency
        - Vendor integration with real-time pricing
        - Alternative material suggestions with cultural validation
        - Phased implementation planning for budget flexibility

        **ORCHESTRATED BUDGET ALLOCATION**:
        ```typescript
        const budgetStrategy = orchestrator.optimizeBudget({{
          totalBudget: parseBudgetAmount('{request.budget_range}'),
          priorities: ['cultural-authenticity', 'accessibility', 'guest-comfort'],
          flexibility: 0.15, // 15% flexibility for adjustments
          sustainabilityPreference: true,
          localSourcingPreference: true
        }});
        
        // Budget allocation across templates
        const allocation = {{
          furniture: budgetStrategy.allocation.furniture, // 40-50%
          lighting: budgetStrategy.allocation.lighting,   // 15-20%
          systems: budgetStrategy.allocation.systems,     // 20-25%
          cultural: budgetStrategy.allocation.cultural,   // 10-15%
          contingency: budgetStrategy.allocation.contingency // 5-10%
        }};
        ```

        **ORCHESTRATED COST OPTIMIZATION FEATURES**:
        - Real-time vendor price comparison
        - Cultural authenticity vs. cost trade-off analysis
        - Rental vs. purchase recommendations
        - Local artisan vs. commercial supplier options
        - Phased implementation for budget spreading
        - Crowd-sourcing options for community events

        **BUDGET QUALITY VALIDATION**:
        - Minimum quality thresholds maintained regardless of budget
        - Cultural authenticity preserved at all budget levels
        - Accessibility compliance non-negotiable
        - Safety standards maintained across all price points
        - Sustainability options at every budget tier
        """

    def _add_celebratory_props_template(self) -> str:
        return """
        CELEBRATORY PROPS & THEMED DECORATIONS TEMPLATE INTEGRATION:
        
        Use CelebratoryTemplate.generateCelebratorySystem() with these parameters:
        - celebrationType: birthday-child, birthday-teen, birthday-adult, baby-shower, graduation, anniversary, quinceañera, bar-bat-mitzvah, cultural-milestone
        - ageGroup: toddler, child, teen, young-adult, adult, senior, multi-generational
        - theme: superhero, princess, sports, nature, space, unicorn, dinosaur, elegant, cultural-traditional, custom
        - culture: primary cultural background with authentic celebration traditions
        - culturalTraditions: specific customs and ceremonial elements to honor
        - religiousConsiderations: sacred elements and spiritual requirements
        - guestCount: total attendees for appropriate prop scaling
        - spaceDimensions: physical constraints for prop placement and safety
        - balloonSystems: culturally-appropriate balloon arrangements and displays
        - photoBackdrops: themed photography areas with cultural significance
        - interactiveProps: age-appropriate activities and engagement elements
        - ceremonialElements: traditional objects and ritual displays
        - giftDisplayAreas: culturally-appropriate presentation spaces
        - entertainmentProps: celebration-specific activity materials
        - colorScheme: theme-based, cultural-palette, or custom combinations
        - sustainabilityLevel: eco-conscious material selection and practices
        - safetyRequirements: age-specific and cultural safety considerations
        - personalizedTouches: custom elements reflecting individual/family traditions
        - keepsakeElements: memory-creation and documentation support
        
        CULTURAL CELEBRATION SPECIALIZATIONS:
        
        **Mexican/Latin Celebrations (Quinceañera, Piñata Parties):**
        - Papel picado banners in traditional celebration colors
        - Piñata systems with culturally-appropriate themes and materials
        - Luminarias for warm ambient lighting and welcome atmosphere
        - Marigold and vibrant floral arrangements with symbolic meaning
        - Traditional altar/honor spaces for ceremonial elements
        - Extended family accommodation and multi-generational comfort
        - Religious blessing areas with appropriate sacred elements
        - Vibrant color palettes reflecting joy and community celebration
        
        **Jewish Celebrations (Bar/Bat Mitzvah, Religious Holidays):**
        - Torah reading areas with appropriate ceremonial dignity
        - Kiddush blessing tables with traditional ritual objects
        - Star of David and Hebrew-inspired decorative elements
        - Blue and white color schemes honoring cultural traditions
        - Learning celebration displays emphasizing education and wisdom
        - Family heritage and memory display areas
        - Kosher-compliant materials and setup considerations
        - Multi-generational seating arrangements respecting hierarchy
        
        **Korean Celebrations (Doljanchi, Cultural Milestones):**
        - Doljabi ceremony tables with traditional object selection setup
        - Rainbow rice cake displays honoring colorful future symbolism
        - Hanbok display areas celebrating traditional dress
        - Obangsaek (five-color) decorations representing elemental protection
        - Longevity symbols (cranes, clouds) for blessing and prosperity
        - Family blessing spaces emphasizing elder respect and wisdom
        - Traditional pattern integration (Korean cloud motifs, geometric designs)
        - Harmonious color balance reflecting Korean aesthetic principles
        
        **American/Contemporary Celebrations:**
        - Theme-based prop systems (superhero, princess, sports, space)
        - Interactive activity stations appropriate for age groups
        - Photo opportunity creation with Instagram-worthy backdrops
        - Birthday cake ceremonial displays with candle arrangements
        - Balloon systems scaled to space and celebration magnitude
        - Gift display areas promoting generosity and thoughtfulness
        - Entertainment prop integration for engagement and fun
        - Flexible decoration systems accommodating diverse family traditions
        
        GENERATE THREE.JS CODE:
        ```javascript
        const celebratoryParams = {
            celebrationType: '[DETERMINED_TYPE]',
            ageGroup: '[TARGET_AGE_GROUP]',
            theme: '[SELECTED_THEME]',
            culture: '[PRIMARY_CULTURE]',
            culturalTraditions: '[SPECIFIC_CUSTOMS]',
            religiousConsiderations: '[SPIRITUAL_ELEMENTS]',
            guestCount: [TOTAL_ATTENDEES],
            spaceDimensions: {
                width: [SPACE_WIDTH],
                depth: [SPACE_DEPTH], 
                height: [SPACE_HEIGHT],
                indoorOutdoor: '[VENUE_TYPE]'
            },
            balloonSystems: [BOOLEAN],
            photoBackdrops: [BOOLEAN],
            interactiveProps: [BOOLEAN],
            ceremonialElements: [BOOLEAN],
            giftDisplayAreas: [BOOLEAN],
            entertainmentProps: [BOOLEAN],
            colorScheme: '[COLOR_APPROACH]',
            customColors: '[CULTURAL_PALETTE]',
            sustainabilityLevel: '[ECO_LEVEL]',
            safetyRequirements: '[AGE_SAFETY_NEEDS]',
            budget: [BUDGET_AMOUNT],
            personalizedTouches: [BOOLEAN],
            keepsakeElements: [BOOLEAN]
        };
        
        const celebratoryTemplate = new CelebratoryTemplate();
        const celebrationSystem = celebratoryTemplate.generateCelebratorySystem(celebratoryParams);
        
        // Add cultural-specific celebration templates for major milestones
        if (celebratoryParams.celebrationType === 'quinceañera') {
            const quinceTemplate = new QuinceañeraTemplate();
            const quinceSystem = quinceTemplate.generateQuinceañera(celebratoryParams);
            scene.add(quinceSystem);
        } else if (celebratoryParams.celebrationType === 'bar-bat-mitzvah') {
            const mitzvahTemplate = new BarBatMitzvahTemplate();
            const mitzvahSystem = mitzvahTemplate.generateBarBatMitzvah(celebratoryParams);
            scene.add(mitzvahSystem);
        } else if (celebratoryParams.celebrationType === 'birthday-child' && celebratoryParams.culture === 'korean') {
            const doljanchTemplate = new KoreanDoljanchTemplate();
            const doljanchSystem = doljanchTemplate.generateDoljanchi(celebratoryParams);
            scene.add(doljanchSystem);
        } else {
            scene.add(celebrationSystem);
        }
        
        // Add interaction properties for celebration elements
        celebrationSystem.traverse((object) => {
            if (object.userData.component && object.userData.component.includes('interactive')) {
                object.userData.draggable = true;
                object.userData.clickable = true;
                object.userData.culturalGuidance = object.userData.significance || 'Cultural celebration element';
            }
            if (object.userData.component && object.userData.component.includes('ceremonial')) {
                object.userData.sacred = true;
                object.userData.respectfulHandling = true;
            }
        });
        ```
        
        AGE-APPROPRIATE SAFETY INTEGRATION:
        - Toddler/Child: Soft materials, rounded edges, supervised interaction zones
        - Teen: Social media-ready photo opportunities, age-appropriate themes
        - Adult: Elegant sophistication, cultural authenticity, accessibility compliance
        - Multi-generational: Comfort for all ages, cultural bridge-building elements
        
        CULTURAL SENSITIVITY REQUIREMENTS:
        - Research authentic traditions and avoid stereotypical representations
        - Consult cultural database for appropriate colors, symbols, and arrangements
        - Respect religious and spiritual elements with proper ceremonial dignity
        - Include elder consultation recommendations for cultural authenticity
        - Balance traditional elements with contemporary accessibility needs
        - Consider seasonal and regional variations in cultural practices
        
        SUSTAINABILITY AND BUDGET OPTIMIZATION:
        - Prioritize reusable and biodegradable materials for environmental responsibility
        - Suggest rental options for expensive ceremonial items
        - Provide DIY alternatives for budget-conscious celebrations
        - Recommend local artisans and vendors for cultural authenticity
        - Include setup and breakdown time considerations for realistic planning
        - Balance luxury elements with practical celebration needs
        
        MEMORY CREATION AND DOCUMENTATION:
        - Design photo-opportunity zones with optimal lighting and backgrounds
        - Include keepsake element generation for lasting celebration memories
        - Plan documentation support areas for professional photography
        - Create surprise element integration for memorable celebration moments
        - Design personalized touch integration reflecting family traditions and values
        """

    def _add_celebratory_cultural_templates(self) -> dict:
        return {
            "quinceañera_celebration": """
            QUINCEAÑERA CULTURAL CELEBRATION CONTEXT:
            DESIGN PRINCIPLES:
            - Coming-of-age ceremony honoring transition from childhood to womanhood
            - Traditional throne/seating area for the quinceañera with ceremonial dignity
            - Ceremonial doll table representing childhood farewell
            - Formal dance area for traditional father-daughter dance and court presentation
            - Religious blessing space incorporating Catholic traditions when appropriate
            - Extended family accommodation emphasizing community celebration
            - Traditional Mexican color palettes: vibrant pinks, golds, whites, blues
            - Papel picado banners and luminarias creating festive atmosphere
            - Photography areas capturing formal portraits and candid celebration moments
            
            CEREMONIAL ELEMENT REQUIREMENTS:
            - Crown ceremony area for symbolic transition recognition
            - Shoe-changing ceremony space (flat to heels transition)
            - Court presentation area for damas and chambelanes
            - Gift display honoring family generosity and community support
            - Traditional music and dance integration
            - Floral arrangements emphasizing roses and traditional Mexican flowers
            """,
            
            "bar_bat_mitzvah_celebration": """
            BAR/BAT MITZVAH CULTURAL CELEBRATION CONTEXT:
            DESIGN PRINCIPLES:
            - Religious milestone celebrating entry into Jewish adulthood
            - Torah reading area with appropriate ceremonial respect and dignity
            - Kiddush blessing table with traditional ritual objects
            - Learning celebration emphasizing education, wisdom, and community responsibility
            - Family heritage display honoring generational traditions
            - Blue and white color scheme reflecting Jewish cultural identity
            - Multi-generational seating respecting family hierarchy and community elders
            - Kosher-compliant materials and setup considerations
            
            CEREMONIAL ELEMENT REQUIREMENTS:
            - Sacred object display areas (Torah elements, prayer items, family heirlooms)
            - Memory sharing spaces for family storytelling and wisdom transfer
            - Community gathering areas emphasizing collective celebration
            - Traditional Jewish symbols integration (Star of David, Hebrew elements)
            - Educational display areas highlighting learning achievements
            - Charity/mitzvah project recognition area
            """,
            
            "korean_doljanchi_celebration": """
            KOREAN DOLJANCHI (FIRST BIRTHDAY) CULTURAL CELEBRATION CONTEXT:
            DESIGN PRINCIPLES:
            - Traditional first birthday ceremony predicting child's future
            - Doljabi table with ceremonial objects for child selection
            - Rainbow rice cake display symbolizing colorful future
            - Hanbok display celebrating traditional Korean dress
            - Obangsaek (five-color) decorations representing elemental protection
            - Family blessing emphasis honoring elder wisdom and guidance
            - Traditional Korean aesthetic principles: harmony, balance, natural materials
            
            CEREMONIAL ELEMENT REQUIREMENTS:
            - Traditional object arrangement: books (scholar), money (wealth), thread (longevity), rice (abundance)
            - Longevity symbol integration: cranes, clouds, traditional Korean motifs
            - Respectful elder seating arrangements honoring hierarchical traditions
            - Photography areas capturing ceremonial moments and family blessings
            - Traditional Korean color harmony: red, blue, yellow, white, black
            - Child safety considerations maintaining cultural authenticity
            """
        }

# Example usage and testing
def create_sample_request() -> ParametricPromptRequest:
    """Create a sample request for testing"""
    return ParametricPromptRequest(
        event_type="Japanese-Italian Wedding Reception",
        cultural_background=["japanese", "italian"],
        space_dimensions={"width": 15.0, "depth": 12.0, "height": 3.5},
        guest_count=80,
        budget_range="medium",
        accessibility_requirements=["wheelchair_access", "visual_impairment_support", "elderly_comfort"],
        style_preferences=["elegant", "traditional", "garden_inspired", "intimate"],
        cultural_sensitivity=CulturalSensitivityLevel.HIGH,
        complexity_level=EventComplexity.COMPLEX,
        desired_outputs=[
            OutputFormat.PARAMETRIC_3D,
            OutputFormat.CULTURAL_GUIDANCE,
            OutputFormat.BUDGET_OPTIMIZATION,
            OutputFormat.ORCHESTRATION_PARAMETERS
        ],
        three_js_integration=True,
        parametric_generation=True,
        venue_type="mixed",
        timing={"season": "spring", "timeOfDay": "evening", "weather": "guaranteed-good"},
        special_requirements=["tea_ceremony_space", "photography_areas", "multi_generational_seating"]
    )

if __name__ == "__main__":
    # Test the enhanced prompt system
    prompt_system = EnhancedAIPromptSystem()
    sample_request = create_sample_request()
    
    orchestration_config = OrchestrationIntegration(
        template_priority=["chair", "table", "lighting", "floral", "interactive"],
        cultural_fusion_allowed=True,
        sustainability_focus=True,
        interactive_elements=True,
        quality_threshold=0.85
    )
    
    enhanced_prompt = prompt_system.generate_enhanced_prompt(sample_request, orchestration_config)
    
    print("Enhanced AI Prompt System for EventOrchestrationMaster Integration")
    print("=" * 80)
    print(enhanced_prompt)
    print("=" * 80)
    print(f"Prompt length: {len(enhanced_prompt)} characters")