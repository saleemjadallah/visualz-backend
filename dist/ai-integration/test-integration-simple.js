// Simple Integration Test for AI + Orchestration
import { AIOrchestrationBridge } from './AIOrchestrationBridge';
console.log('🧪 Testing AI + Orchestration Integration...\n');
// Create a simple test request
const testRequest = {
    event_type: "Birthday Party",
    cultural_background: ["modern"],
    space_dimensions: { width: 10, depth: 8, height: 3 },
    guest_count: 30,
    budget_range: "medium",
    accessibility_requirements: ["wheelchair_access"],
    style_preferences: ["casual", "colorful"],
    cultural_sensitivity: "medium",
    complexity_level: "simple",
    desired_outputs: ["parametric_3d"],
    three_js_integration: true,
    parametric_generation: true,
    venue_type: "indoor",
    timing: { season: "summer", timeOfDay: "afternoon" },
    special_requirements: []
};
async function runSimpleTest() {
    try {
        console.log('🔄 Initializing AI Orchestration Bridge...');
        const bridge = new AIOrchestrationBridge();
        console.log('🔄 Converting AI request to orchestration parameters...');
        const orchestrationParams = bridge.convertAIRequestToOrchestrationParams(testRequest);
        console.log('📋 Orchestration Parameters Generated:');
        console.log(`   Event Type: ${orchestrationParams.eventType}`);
        console.log(`   Scale: ${orchestrationParams.scale}`);
        console.log(`   Primary Culture: ${orchestrationParams.primaryCulture}`);
        console.log(`   Guest Count: ${orchestrationParams.guests.total}`);
        console.log(`   Atmosphere: ${orchestrationParams.atmosphere}`);
        console.log(`   Budget Total: $${orchestrationParams.budget.total}`);
        console.log(`   Cultural Fusion: ${orchestrationParams.culturalFusion}`);
        console.log(`   Accessibility Requirements: ${orchestrationParams.guests.accessibility.join(', ')}`);
        console.log('\n✅ AI to Orchestration parameter conversion successful!');
        console.log('🎯 Integration test passed - ready for full orchestration!');
    }
    catch (error) {
        console.error('❌ Integration test failed:', error);
        process.exit(1);
    }
}
runSimpleTest();
//# sourceMappingURL=test-integration-simple.js.map