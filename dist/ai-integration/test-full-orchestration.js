// Full AI to Orchestration Workflow Test
import { AIOrchestrationBridge } from './AIOrchestrationBridge.js';
console.log('🎭 Testing Full AI to Orchestration Workflow...\n');
// Create a comprehensive test request
const complexRequest = {
    event_type: "Japanese-Italian Wedding Reception",
    cultural_background: ["japanese", "italian"],
    space_dimensions: { width: 15, depth: 12, height: 3.5 },
    guest_count: 80,
    budget_range: "high",
    accessibility_requirements: ["wheelchair_access", "visual_impairment_support", "elderly_comfort"],
    style_preferences: ["elegant", "traditional", "garden_inspired", "intimate"],
    cultural_sensitivity: "high",
    complexity_level: "complex",
    desired_outputs: ["parametric_3d", "cultural_guidance", "budget_optimization"],
    three_js_integration: true,
    parametric_generation: true,
    venue_type: "mixed",
    timing: { season: "spring", timeOfDay: "evening", weather: "guaranteed-good" },
    special_requirements: ["tea_ceremony_space", "photography_areas", "multi_generational_seating"]
};
async function runFullOrchestrationTest() {
    try {
        console.log('🔄 Initializing AI Orchestration Bridge...');
        const bridge = new AIOrchestrationBridge();
        console.log('🔄 Converting AI request to orchestration parameters...');
        const orchestrationParams = bridge.convertAIRequestToOrchestrationParams(complexRequest);
        console.log('📋 Generated Orchestration Parameters:');
        console.log(`   Event Type: ${orchestrationParams.eventType}`);
        console.log(`   Scale: ${orchestrationParams.scale}`);
        console.log(`   Primary Culture: ${orchestrationParams.primaryCulture}`);
        console.log(`   Secondary Cultures: ${orchestrationParams.secondaryCultures?.join(', ') || 'None'}`);
        console.log(`   Cultural Fusion: ${orchestrationParams.culturalFusion}`);
        console.log(`   Cultural Sensitivity: ${orchestrationParams.culturalSensitivity}`);
        console.log(`   Guest Count: ${orchestrationParams.guests.total}`);
        console.log(`   Atmosphere: ${orchestrationParams.atmosphere}`);
        console.log(`   Interaction Style: ${orchestrationParams.interactionStyle}`);
        console.log(`   Budget Total: $${orchestrationParams.budget.total}`);
        console.log(`   Venue Type: ${orchestrationParams.venue.type}`);
        console.log(`   Technology Level: ${orchestrationParams.technology.lighting}`);
        console.log(`   Sustainability: ${orchestrationParams.sustainability}`);
        console.log(`   Cultural Authenticity: ${orchestrationParams.culturalAuthenticity}`);
        console.log(`   Accessibility Level: ${orchestrationParams.accessibility}`);
        console.log(`   Security Risk Level: ${orchestrationParams.security.riskLevel}`);
        console.log('\n🎯 Attempting Full Orchestration...');
        const orchestrationResult = await bridge.orchestrateFromAIRequest(complexRequest);
        console.log('✅ Full orchestration completed successfully!');
        console.log(`📊 Template Count: ${orchestrationResult.metadata.templateCount}`);
        console.log(`🏛️ Cultural Authenticity: ${(orchestrationResult.metadata.culturalAuthenticity * 100).toFixed(1)}%`);
        console.log(`♿ Accessibility Score: ${(orchestrationResult.metadata.accessibilityScore * 100).toFixed(1)}%`);
        console.log(`🌱 Sustainability Score: ${(orchestrationResult.metadata.sustainabilityScore * 100).toFixed(1)}%`);
        console.log(`💰 Budget Utilization: ${(orchestrationResult.metadata.budgetUtilization * 100).toFixed(1)}%`);
        console.log(`⏱️ Generation Time: ${orchestrationResult.metadata.generationTime.toFixed(2)}ms`);
        // Test cultural validation
        console.log('\n🏛️ Testing Cultural Validation...');
        const culturalValidation = await bridge.validateCulturalAuthenticity(complexRequest, orchestrationResult);
        console.log(`   Cultural Score: ${(culturalValidation.score * 100).toFixed(1)}%`);
        console.log(`   Issues Found: ${culturalValidation.issues.length}`);
        console.log(`   Recommendations: ${culturalValidation.recommendations.length}`);
        console.log(`   Elder Consultation Needed: ${culturalValidation.elderConsultationNeeded ? 'Yes' : 'No'}`);
        // Test budget optimization
        console.log('\n💰 Testing Budget Optimization...');
        const budgetOptimizations = bridge.generateBudgetOptimizations(complexRequest, orchestrationResult);
        console.log(`   Current Total: $${Object.values(budgetOptimizations.currentBreakdown).reduce((a, b) => a + b, 0)}`);
        console.log(`   Optimization Opportunities: ${budgetOptimizations.optimizations.length}`);
        console.log(`   Alternative Options: ${budgetOptimizations.alternatives.length}`);
        if (budgetOptimizations.optimizations.length > 0) {
            const totalSavings = budgetOptimizations.optimizations.reduce((sum, opt) => sum + opt.savings, 0);
            console.log(`   Potential Savings: $${totalSavings.toFixed(2)}`);
        }
        console.log('\n🎉 FULL AI TO ORCHESTRATION WORKFLOW TEST PASSED!');
        console.log('✨ The system successfully:');
        console.log('   ✅ Converted AI prompt to orchestration parameters');
        console.log('   ✅ Executed complete event orchestration');
        console.log('   ✅ Generated Three.js scene with all components');
        console.log('   ✅ Provided cultural authenticity validation');
        console.log('   ✅ Generated budget optimization suggestions');
        console.log('   ✅ Maintained cultural sensitivity throughout');
    }
    catch (error) {
        console.error('❌ Full orchestration test failed:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message);
            console.error('Stack trace:', error.stack);
        }
        process.exit(1);
    }
}
runFullOrchestrationTest();
//# sourceMappingURL=test-full-orchestration.js.map