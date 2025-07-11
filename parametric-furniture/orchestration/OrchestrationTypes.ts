// Orchestration System Type Definitions
import * as THREE from 'three';

// Master orchestration interfaces
export interface OrchestrationContext {
  eventId: string;
  timestamp: number;
  version: string;
  culturalContext: CulturalContext;
  spatialContext: SpatialContext;
  technicalContext: TechnicalContext;
  experienceContext: ExperienceContext;
}

export interface CulturalContext {
  primaryCulture: string;
  secondaryCultures: string[];
  authenticityLevel: 'strict' | 'adaptive' | 'interpretive' | 'fusion';
  culturalAdvisors?: string[];
  sensitivityRequirements: string[];
  educationalGoals: string[];
  ceremonyProtocols: Record<string, any>;
  symbolism: Record<string, string>;
  taboos: string[];
  blessings: string[];
}

export interface SpatialContext {
  totalArea: number;
  usableArea: number;
  zones: SpatialZone[];
  circulation: CirculationPath[];
  sightlines: Sightline[];
  acousticProperties: AcousticProperties;
  naturalFeatures: NaturalFeature[];
  constraints: SpatialConstraint[];
  accessibility: AccessibilityFeature[];
}

export interface SpatialZone {
  id: string;
  purpose: 'entry' | 'ceremony' | 'dining' | 'mingling' | 'stage' | 'service' | 'children' | 'quiet' | 'photo';
  area: number;
  capacity: number;
  culturalSignificance?: 'sacred' | 'honored' | 'functional' | 'transitional';
  boundaries: THREE.Vector3[];
  height: number;
  privacy: 'public' | 'semi-private' | 'private' | 'sacred';
  activities: string[];
  timeOfUse: string[];
  environmentalNeeds: string[];
}

export interface CirculationPath {
  id: string;
  from: string; // Zone ID
  to: string; // Zone ID
  width: number;
  length: number;
  priority: 'primary' | 'secondary' | 'emergency';
  accessibility: boolean;
  culturalProtocol?: 'processional' | 'casual' | 'restricted';
  waypoints: THREE.Vector3[];
  clearanceHeight: number;
}

export interface Sightline {
  from: THREE.Vector3;
  to: THREE.Vector3;
  importance: 'critical' | 'important' | 'nice-to-have';
  purpose: 'ceremony' | 'safety' | 'social' | 'aesthetic';
  obstructions: THREE.Vector3[];
  culturalMeaning?: string;
}

export interface AcousticProperties {
  reverberation: number; // RT60 in seconds
  noiseFloor: number; // dB
  soundIsolation: number; // dB
  sweetSpots: THREE.Vector3[];
  deadZones: THREE.Vector3[];
  naturalAmplification: boolean;
  culturalAcoustics?: 'intimate' | 'ceremonial' | 'conversational' | 'performative';
}

export interface NaturalFeature {
  id: string;
  type: 'tree' | 'water' | 'stone' | 'elevation' | 'view' | 'garden';
  position: THREE.Vector3;
  dimensions: THREE.Vector3;
  culturalSignificance?: string;
  seasonalChanges: boolean;
  preservation: 'must-preserve' | 'work-around' | 'can-modify' | 'can-remove';
}

export interface SpatialConstraint {
  id: string;
  type: 'structural' | 'legal' | 'cultural' | 'environmental' | 'safety';
  area: THREE.Vector3[];
  restriction: string;
  severity: 'absolute' | 'strong' | 'moderate' | 'preference';
  workaround?: string;
}

export interface AccessibilityFeature {
  id: string;
  type: 'ramp' | 'elevator' | 'wide-path' | 'rest-area' | 'accessible-seating' | 'visual-aid' | 'audio-aid';
  position: THREE.Vector3;
  dimensions: THREE.Vector3;
  serves: string[]; // Zone IDs
  complianceLevel: 'ADA' | 'enhanced' | 'universal';
  culturalAdaptation?: string;
}

export interface TechnicalContext {
  power: PowerSystem;
  network: NetworkSystem;
  climate: ClimateSystem;
  security: SecuritySystem;
  audioVisual: AudioVisualSystem;
  lighting: LightingSystem;
  integration: IntegrationRequirements;
}

export interface PowerSystem {
  totalCapacity: number; // Watts
  distribution: PowerDistribution[];
  backup: boolean;
  sustainability: 'grid' | 'solar' | 'hybrid' | 'generator';
  efficiency: number; // 0-1
  monitoring: boolean;
}

export interface PowerDistribution {
  zone: string;
  capacity: number;
  outlets: THREE.Vector3[];
  voltage: number;
  phase: 'single' | 'three';
  dedicated: boolean;
}

export interface NetworkSystem {
  bandwidth: number; // Mbps
  latency: number; // ms
  coverage: NetworkCoverage[];
  backup: boolean;
  security: 'basic' | 'enterprise' | 'military';
  integration: string[];
}

export interface NetworkCoverage {
  zone: string;
  strength: number; // 0-1
  technology: 'wifi' | 'ethernet' | '5g' | 'fiber';
  capacity: number; // concurrent users
}

export interface ClimateSystem {
  zones: ClimateZone[];
  sustainability: number; // 0-1
  backup: boolean;
  seasonalAdaptation: boolean;
  culturalPreferences: Record<string, any>;
}

export interface ClimateZone {
  id: string;
  area: THREE.Vector3[];
  targetTemperature: number;
  targetHumidity: number;
  airflow: number;
  naturalVentilation: boolean;
  culturalComfort?: any;
}

export interface SecuritySystem {
  threatLevel: 'low' | 'medium' | 'high' | 'extreme';
  coverage: SecurityCoverage[];
  personnel: SecurityPersonnel[];
  technology: SecurityTechnology[];
  protocols: SecurityProtocol[];
  culturalSensitivity: string[];
}

export interface SecurityCoverage {
  zone: string;
  level: 'monitoring' | 'access-control' | 'active-security';
  visibility: 'hidden' | 'discrete' | 'visible' | 'prominent';
  culturalAdaptation?: string;
}

export interface SecurityPersonnel {
  role: 'coordinator' | 'access-control' | 'patrol' | 'emergency' | 'cultural-liaison';
  count: number;
  training: string[];
  culturalCompetency: boolean;
}

export interface SecurityTechnology {
  type: 'camera' | 'sensor' | 'access-control' | 'communication' | 'screening';
  positions: THREE.Vector3[];
  culturallyAppropriate: boolean;
  discretionLevel: 'hidden' | 'discrete' | 'visible';
}

export interface SecurityProtocol {
  scenario: string;
  response: string[];
  culturalConsiderations: string[];
  escalation: string[];
}

export interface AudioVisualSystem {
  zones: AVZone[];
  integration: AVIntegration;
  redundancy: 'single' | 'backup' | 'triple';
  culturalAdaptation: AVCulturalAdaptation;
}

export interface AVZone {
  id: string;
  purpose: 'ceremony' | 'presentation' | 'ambient' | 'emergency';
  equipment: AVEquipment[];
  coverage: THREE.Vector3[];
  quality: 'basic' | 'professional' | 'broadcast';
}

export interface AVEquipment {
  type: 'speaker' | 'microphone' | 'display' | 'camera' | 'mixer' | 'amplifier';
  position: THREE.Vector3;
  specifications: Record<string, any>;
  culturallyAppropriate: boolean;
}

export interface AVIntegration {
  lighting: boolean;
  climate: boolean;
  security: boolean;
  interactive: boolean;
  masterControl: boolean;
}

export interface AVCulturalAdaptation {
  equipmentVisibility: 'hidden' | 'integrated' | 'featured';
  soundProfile: 'natural' | 'enhanced' | 'immersive';
  visualApproach: 'minimal' | 'supporting' | 'dominant';
  interactionStyle: string[];
}

export interface LightingSystem {
  zones: LightingZone[];
  control: LightingControl;
  integration: LightingIntegration;
  culturalAdaptation: LightingCulturalAdaptation;
}

export interface LightingZone {
  id: string;
  purpose: 'ambient' | 'task' | 'accent' | 'decorative' | 'emergency' | 'ceremonial';
  fixtures: LightingFixture[];
  dimming: boolean;
  colorControl: boolean;
  scheduling: boolean;
}

export interface LightingFixture {
  type: 'pendant' | 'recessed' | 'track' | 'floor' | 'table' | 'decorative' | 'flood';
  position: THREE.Vector3;
  power: number;
  colorTemperature: number;
  beam: number; // degrees
  culturallyAppropriate: boolean;
}

export interface LightingControl {
  system: 'manual' | 'automated' | 'smart' | 'integrated';
  scenes: LightingScene[];
  scheduling: boolean;
  integration: string[];
}

export interface LightingScene {
  name: string;
  purpose: string;
  culturalMeaning?: string;
  settings: Record<string, any>;
  duration?: number;
  transition?: number;
}

export interface LightingIntegration {
  audiovisual: boolean;
  climate: boolean;
  security: boolean;
  interactive: boolean;
  natural: boolean;
}

export interface LightingCulturalAdaptation {
  colorPalette: string[];
  intensity: 'soft' | 'moderate' | 'bright' | 'dramatic';
  distribution: 'even' | 'layered' | 'focused' | 'ceremonial';
  timing: 'static' | 'dynamic' | 'responsive' | 'ritualistic';
}

export interface IntegrationRequirements {
  masterControl: boolean;
  automation: 'manual' | 'scheduled' | 'responsive' | 'intelligent';
  monitoring: 'basic' | 'comprehensive' | 'predictive';
  culturalProtocols: string[];
  emergencyOverrides: string[];
}

export interface ExperienceContext {
  userJourney: UserJourneyMap;
  emotionalArc: EmotionalArc;
  culturalMoments: CulturalMoment[];
  sensoryExperience: SensoryExperience;
  accessibility: AccessibilityExperience;
  sustainability: SustainabilityExperience;
  memorability: MemorabilityElements;
}

export interface UserJourneyMap {
  phases: JourneyPhase[];
  touchpoints: Touchpoint[];
  transitions: Transition[];
  culturalProtocols: CulturalProtocol[];
}

export interface JourneyPhase {
  id: string;
  name: string;
  duration: number;
  zones: string[];
  activities: string[];
  culturalSignificance?: string;
  emotionalGoal: string;
  sensoryElements: string[];
}

export interface Touchpoint {
  id: string;
  phase: string;
  type: 'arrival' | 'seating' | 'ceremony' | 'dining' | 'interaction' | 'departure';
  importance: 'critical' | 'important' | 'enhancement';
  culturalMeaning?: string;
  accessibility: boolean;
  multiSensory: boolean;
}

export interface Transition {
  from: string; // Phase ID
  to: string; // Phase ID
  method: 'natural' | 'guided' | 'announced' | 'ceremonial';
  duration: number;
  culturalProtocol?: string;
  signals: string[]; // Visual, audio, haptic cues
}

export interface CulturalProtocol {
  id: string;
  name: string;
  description: string;
  phases: string[];
  requirements: string[];
  significance: 'sacred' | 'traditional' | 'respectful' | 'celebratory';
  adaptability: 'strict' | 'flexible' | 'optional';
}

export interface EmotionalArc {
  phases: EmotionalPhase[];
  peaks: EmotionalPeak[];
  valleys: EmotionalValley[];
  resolution: string;
  culturalResonance: number; // 0-1
}

export interface EmotionalPhase {
  phase: string;
  targetEmotion: string;
  intensity: number; // 0-1
  culturalExpression: string;
  sensorySupport: string[];
  environmentalFactors: string[];
}

export interface EmotionalPeak {
  phase: string;
  moment: string;
  emotion: string;
  culturalSignificance: string;
  environmental: string[];
  duration: number;
}

export interface EmotionalValley {
  phase: string;
  purpose: 'rest' | 'reflection' | 'transition' | 'preparation';
  culturalMeaning?: string;
  duration: number;
}

export interface CulturalMoment {
  id: string;
  name: string;
  phase: string;
  significance: 'sacred' | 'traditional' | 'educational' | 'celebratory';
  duration: number;
  participants: 'all' | 'family' | 'elders' | 'children' | 'select';
  location: string; // Zone ID
  requirements: string[];
  adaptations: string[];
  explanation?: string; // For educational contexts
}

export interface SensoryExperience {
  visual: VisualExperience;
  auditory: AuditoryExperience;
  tactile: TactileExperience;
  olfactory: OlfactoryExperience;
  gustatory: GustatoryExperience;
  integration: SensoryIntegration;
}

export interface VisualExperience {
  colorPalette: ColorPalette;
  lighting: LightingExperience;
  textures: TextureExperience;
  patterns: PatternExperience;
  spacialVisuals: SpatialVisual[];
  culturalSymbols: CulturalSymbol[];
}

export interface ColorPalette {
  primary: string[];
  secondary: string[];
  accent: string[];
  cultural: Record<string, string>;
  seasonal: Record<string, string[]>;
  emotional: Record<string, string[]>;
}

export interface LightingExperience {
  naturalLight: LightingQuality;
  artificialLight: LightingQuality;
  transitions: LightingTransition[];
  culturalMeaning: Record<string, string>;
}

export interface LightingQuality {
  intensity: number; // 0-1
  temperature: number; // Kelvin
  distribution: 'even' | 'dramatic' | 'focused' | 'ambient';
  culturalAppropriate: boolean;
}

export interface LightingTransition {
  from: LightingQuality;
  to: LightingQuality;
  duration: number;
  trigger: string;
  culturalSignificance?: string;
}

export interface TextureExperience {
  materials: MaterialTexture[];
  contrasts: TextureContrast[];
  culturalTextures: CulturalTexture[];
  accessibility: boolean;
}

export interface MaterialTexture {
  material: string;
  texture: 'smooth' | 'rough' | 'soft' | 'hard' | 'warm' | 'cool';
  cultural: boolean;
  traditional: boolean;
  accessibility: boolean;
}

export interface TextureContrast {
  primary: string;
  secondary: string;
  purpose: 'visual' | 'tactile' | 'cultural' | 'functional';
  intensity: number; // 0-1
}

export interface CulturalTexture {
  name: string;
  material: string;
  significance: string;
  traditional: boolean;
  seasonal?: boolean;
}

export interface PatternExperience {
  geometric: GeometricPattern[];
  organic: OrganicPattern[];
  cultural: CulturalPattern[];
  scale: 'micro' | 'human' | 'architectural' | 'landscape';
}

export interface GeometricPattern {
  type: string;
  scale: number;
  repetition: 'regular' | 'varied' | 'organic';
  cultural: boolean;
}

export interface OrganicPattern {
  inspiration: string;
  scale: number;
  seasonal: boolean;
  cultural: boolean;
}

export interface CulturalPattern {
  name: string;
  origin: string;
  meaning: string;
  traditional: boolean;
  contemporary: boolean;
}

export interface SpatialVisual {
  type: 'vista' | 'frame' | 'reveal' | 'enclosure' | 'transition';
  position: THREE.Vector3;
  direction: THREE.Vector3;
  cultural: boolean;
  significance?: string;
}

export interface CulturalSymbol {
  symbol: string;
  meaning: string;
  placement: THREE.Vector3;
  scale: number;
  prominence: 'subtle' | 'moderate' | 'prominent' | 'dominant';
  educational: boolean;
}

export interface AuditoryExperience {
  ambient: AmbientSound[];
  featured: FeaturedSound[];
  silence: SilenceMoment[];
  acoustics: AcousticDesign;
  cultural: CulturalAudio[];
}

export interface AmbientSound {
  source: 'natural' | 'artificial' | 'human' | 'ceremonial';
  volume: number; // dB
  frequency: number; // Hz
  cultural: boolean;
  continuous: boolean;
}

export interface FeaturedSound {
  type: 'music' | 'speech' | 'ceremony' | 'nature' | 'celebration';
  timing: string;
  duration: number;
  cultural: boolean;
  significance?: string;
}

export interface SilenceMoment {
  timing: string;
  duration: number;
  purpose: 'reverence' | 'transition' | 'reflection' | 'anticipation';
  cultural: boolean;
}

export interface AcousticDesign {
  reverberation: number;
  intimacy: number;
  clarity: number;
  warmth: number;
  cultural: boolean;
}

export interface CulturalAudio {
  element: string;
  significance: string;
  timing: string;
  traditional: boolean;
  educational: boolean;
}

export interface TactileExperience {
  materials: TactileMaterial[];
  temperatures: TemperatureExperience[];
  textures: TactileTexture[];
  cultural: CulturalTouch[];
}

export interface TactileMaterial {
  material: string;
  sensation: string;
  cultural: boolean;
  comfort: number; // 0-1
  accessibility: boolean;
}

export interface TemperatureExperience {
  zone: string;
  target: number; // Celsius
  variation: number;
  cultural: boolean;
  comfort: number; // 0-1
}

export interface TactileTexture {
  surface: string;
  feeling: string;
  cultural: boolean;
  accessibility: boolean;
}

export interface CulturalTouch {
  element: string;
  significance: string;
  appropriate: boolean;
  guidance?: string;
}

export interface OlfactoryExperience {
  natural: NaturalScent[];
  introduced: IntroducedScent[];
  cultural: CulturalScent[];
  intensity: number; // 0-1
  distribution: ScentDistribution[];
}

export interface NaturalScent {
  source: string;
  intensity: number; // 0-1
  pleasant: boolean;
  cultural: boolean;
  seasonal: boolean;
}

export interface IntroducedScent {
  type: string;
  purpose: 'ambiance' | 'cultural' | 'ceremonial' | 'practical';
  intensity: number; // 0-1
  timing: string;
  cultural: boolean;
}

export interface CulturalScent {
  name: string;
  significance: string;
  traditional: boolean;
  appropriate: boolean;
  timing?: string;
}

export interface ScentDistribution {
  zone: string;
  method: 'natural' | 'diffused' | 'concentrated';
  control: boolean;
  cultural: boolean;
}

export interface GustatoryExperience {
  cultural: CulturalTaste[];
  seasonal: SeasonalTaste[];
  ceremonial: CeremonialTaste[];
  accessibility: TasteAccessibility;
}

export interface CulturalTaste {
  element: string;
  significance: string;
  traditional: boolean;
  timing: string;
  preparation: string;
}

export interface SeasonalTaste {
  season: string;
  elements: string[];
  cultural: boolean;
  availability: boolean;
}

export interface CeremonialTaste {
  ceremony: string;
  elements: string[];
  significance: string;
  timing: string;
  protocol: string;
}

export interface TasteAccessibility {
  dietary: string[];
  allergies: string[];
  cultural: string[];
  religious: string[];
  alternatives: string[];
}

export interface SensoryIntegration {
  coordination: SensoryCoordination[];
  enhancement: SensoryEnhancement[];
  cultural: SensoryCultural[];
  accessibility: SensoryAccessibility;
}

export interface SensoryCoordination {
  senses: string[];
  timing: string;
  purpose: string;
  cultural: boolean;
  intensity: number; // 0-1
}

export interface SensoryEnhancement {
  primary: string;
  supporting: string[];
  amplification: number; // 0-1
  cultural: boolean;
}

export interface SensoryCultural {
  tradition: string;
  senses: string[];
  significance: string;
  timing: string;
  adaptability: 'strict' | 'flexible' | 'optional';
}

export interface SensoryAccessibility {
  accommodations: string[];
  alternatives: string[];
  enhancements: string[];
  cultural: boolean;
}

export interface AccessibilityExperience {
  physical: PhysicalAccessibility;
  sensory: SensoryAccessibility;
  cognitive: CognitiveAccessibility;
  cultural: CulturalAccessibility;
  universal: UniversalDesign;
}

export interface PhysicalAccessibility {
  mobility: MobilityAccessibility;
  seating: SeatingAccessibility;
  pathways: PathwayAccessibility;
  facilities: FacilityAccessibility;
}

export interface MobilityAccessibility {
  wheelchairAccess: boolean;
  walkingAids: boolean;
  restAreas: RestArea[];
  assistance: AssistanceService[];
  cultural: boolean;
}

export interface RestArea {
  location: THREE.Vector3;
  capacity: number;
  cultural: boolean;
  privacy: boolean;
}

export interface AssistanceService {
  type: string;
  availability: string;
  cultural: boolean;
  training: string[];
}

export interface SeatingAccessibility {
  wheelchairPositions: THREE.Vector3[];
  transferSeating: THREE.Vector3[];
  companion: boolean;
  sightlines: boolean;
  cultural: boolean;
}

export interface PathwayAccessibility {
  width: number;
  surface: string;
  gradient: number;
  handrails: boolean;
  cultural: boolean;
}

export interface FacilityAccessibility {
  restrooms: boolean;
  parking: boolean;
  dropOff: boolean;
  cultural: boolean;
}

export interface CognitiveAccessibility {
  wayfinding: WayfindingAccessibility;
  communication: CommunicationAccessibility;
  support: CognitiveSupport;
  cultural: boolean;
}

export interface WayfindingAccessibility {
  signage: SignageAccessibility;
  landmarks: LandmarkAccessibility;
  technology: TechnologyAccessibility;
  cultural: boolean;
}

export interface SignageAccessibility {
  visual: boolean;
  tactile: boolean;
  audio: boolean;
  multilingual: boolean;
  cultural: boolean;
}

export interface LandmarkAccessibility {
  visual: boolean;
  tactile: boolean;
  cultural: boolean;
  memorable: boolean;
}

export interface TechnologyAccessibility {
  apps: boolean;
  audio: boolean;
  haptic: boolean;
  cultural: boolean;
}

export interface CommunicationAccessibility {
  languages: string[];
  interpreters: boolean;
  translation: boolean;
  cultural: boolean;
  simple: boolean;
}

export interface CognitiveSupport {
  simplification: boolean;
  repetition: boolean;
  visual: boolean;
  cultural: boolean;
  personal: boolean;
}

export interface CulturalAccessibility {
  interpretation: boolean;
  education: boolean;
  guidance: boolean;
  respect: boolean;
  inclusion: boolean;
}

export interface UniversalDesign {
  principles: string[];
  implementation: string[];
  cultural: boolean;
  innovation: boolean;
  testing: boolean;
}

export interface SustainabilityExperience {
  environmental: EnvironmentalSustainability;
  cultural: CulturalSustainability;
  social: SocialSustainability;
  economic: EconomicSustainability;
  education: SustainabilityEducation;
}

export interface EnvironmentalSustainability {
  materials: SustainableMaterial[];
  energy: EnergyEfficiency;
  waste: WasteManagement;
  water: WaterManagement;
  carbon: CarbonFootprint;
}

export interface SustainableMaterial {
  material: string;
  source: 'local' | 'regional' | 'sustainable' | 'recycled' | 'renewable';
  cultural: boolean;
  traditional: boolean;
  impact: number; // 0-1, lower is better
}

export interface EnergyEfficiency {
  renewable: number; // 0-1 percentage
  efficiency: number; // 0-1
  monitoring: boolean;
  cultural: boolean;
  education: boolean;
}

export interface WasteManagement {
  reduction: number; // 0-1
  reuse: number; // 0-1
  recycling: number; // 0-1
  composting: number; // 0-1
  cultural: boolean;
}

export interface WaterManagement {
  conservation: number; // 0-1
  recycling: number; // 0-1
  natural: boolean;
  cultural: boolean;
  education: boolean;
}

export interface CarbonFootprint {
  baseline: number; // kg CO2
  reduction: number; // kg CO2
  offset: number; // kg CO2
  net: number; // kg CO2
  cultural: boolean;
}

export interface CulturalSustainability {
  preservation: CulturalPreservation;
  evolution: CulturalEvolution;
  transmission: CulturalTransmission;
  respect: CulturalRespect;
}

export interface CulturalPreservation {
  elements: string[];
  methods: string[];
  documentation: boolean;
  community: boolean;
  elders: boolean;
}

export interface CulturalEvolution {
  innovation: string[];
  adaptation: string[];
  fusion: string[];
  appropriateness: boolean;
  community: boolean;
}

export interface CulturalTransmission {
  education: boolean;
  demonstration: boolean;
  participation: boolean;
  storytelling: boolean;
  documentation: boolean;
}

export interface CulturalRespect {
  consultation: boolean;
  permission: boolean;
  attribution: boolean;
  accuracy: boolean;
  sensitivity: boolean;
}

export interface SocialSustainability {
  inclusion: SocialInclusion;
  equity: SocialEquity;
  community: CommunityBenefit;
  accessibility: SocialAccessibility;
}

export interface SocialInclusion {
  diversity: boolean;
  representation: boolean;
  participation: boolean;
  voice: boolean;
  respect: boolean;
}

export interface SocialEquity {
  access: boolean;
  opportunity: boolean;
  representation: boolean;
  resources: boolean;
  outcomes: boolean;
}

export interface CommunityBenefit {
  local: boolean;
  employment: boolean;
  skills: boolean;
  economic: boolean;
  cultural: boolean;
}

export interface SocialAccessibility {
  physical: boolean;
  economic: boolean;
  cultural: boolean;
  linguistic: boolean;
  technological: boolean;
}

export interface EconomicSustainability {
  local: LocalEconomic;
  fair: FairTrade;
  longTerm: LongTermValue;
  efficiency: EconomicEfficiency;
}

export interface LocalEconomic {
  sourcing: number; // 0-1 percentage local
  employment: number; // local jobs created
  business: number; // local businesses supported
  community: number; // community investment
  cultural: boolean;
}

export interface FairTrade {
  wages: boolean;
  conditions: boolean;
  cultural: boolean;
  community: boolean;
  certification: boolean;
}

export interface LongTermValue {
  durability: number; // years
  adaptability: boolean;
  reusability: boolean;
  cultural: boolean;
  community: boolean;
}

export interface EconomicEfficiency {
  costPerGuest: number;
  costPerHour: number;
  valueRatio: number; // value/cost
  cultural: boolean;
  sustainable: boolean;
}

export interface SustainabilityEducation {
  awareness: boolean;
  demonstration: boolean;
  participation: boolean;
  cultural: boolean;
  actionable: boolean;
}

export interface MemorabilityElements {
  moments: MemorableMoment[];
  artifacts: MemorableArtifact[];
  experiences: MemorableExperience[];
  sharing: SharingOpportunity[];
  legacy: LegacyElement[];
}

export interface MemorableMoment {
  id: string;
  name: string;
  phase: string;
  significance: 'peak' | 'transition' | 'surprise' | 'cultural' | 'personal';
  sensory: string[];
  cultural: boolean;
  photographable: boolean;
  shareable: boolean;
  duration: number;
}

export interface MemorableArtifact {
  item: string;
  significance: string;
  cultural: boolean;
  traditional: boolean;
  keepsake: boolean;
  story: string;
}

export interface MemorableExperience {
  experience: string;
  uniqueness: number; // 0-1
  cultural: boolean;
  participatory: boolean;
  emotional: string;
  shareable: boolean;
}

export interface SharingOpportunity {
  type: 'photo' | 'video' | 'story' | 'artifact' | 'experience';
  location: THREE.Vector3;
  timing: string;
  cultural: boolean;
  guidance: boolean;
  facilitated: boolean;
}

export interface LegacyElement {
  element: string;
  permanence: 'temporary' | 'lasting' | 'permanent';
  cultural: boolean;
  community: boolean;
  meaning: string;
  continuation: boolean;
}

// Quality and validation interfaces
export interface QualityMetrics {
  cultural: CulturalQuality;
  spatial: SpatialQuality;
  technical: TechnicalQuality;
  experience: ExperienceQuality;
  accessibility: AccessibilityQuality;
  sustainability: SustainabilityQuality;
  overall: OverallQuality;
}

export interface CulturalQuality {
  authenticity: number; // 0-100
  respect: number; // 0-100
  education: number; // 0-100
  appropriateness: number; // 0-100
  depth: number; // 0-100
  innovation: number; // 0-100
}

export interface SpatialQuality {
  efficiency: number; // 0-100
  flow: number; // 0-100
  comfort: number; // 0-100
  beauty: number; // 0-100
  functionality: number; // 0-100
  cultural: number; // 0-100
}

export interface TechnicalQuality {
  reliability: number; // 0-100
  performance: number; // 0-100
  integration: number; // 0-100
  efficiency: number; // 0-100
  maintainability: number; // 0-100
  scalability: number; // 0-100
}

export interface ExperienceQuality {
  emotional: number; // 0-100
  memorable: number; // 0-100
  engaging: number; // 0-100
  cultural: number; // 0-100
  sensory: number; // 0-100
  personal: number; // 0-100
}

export interface AccessibilityQuality {
  physical: number; // 0-100
  sensory: number; // 0-100
  cognitive: number; // 0-100
  cultural: number; // 0-100
  universal: number; // 0-100
  inclusion: number; // 0-100
}

export interface SustainabilityQuality {
  environmental: number; // 0-100
  cultural: number; // 0-100
  social: number; // 0-100
  economic: number; // 0-100
  longTerm: number; // 0-100
  regenerative: number; // 0-100
}

export interface OverallQuality {
  score: number; // 0-100
  category: 'exceptional' | 'excellent' | 'good' | 'acceptable' | 'needs-improvement';
  strengths: string[];
  improvements: string[];
  cultural: boolean;
  sustainable: boolean;
  accessible: boolean;
}

// Validation and recommendation interfaces
export interface ValidationResult {
  valid: boolean;
  score: number; // 0-100
  category: 'cultural' | 'spatial' | 'technical' | 'experience' | 'accessibility' | 'sustainability';
  issues: ValidationIssue[];
  recommendations: Recommendation[];
  cultural: boolean;
}

export interface ValidationIssue {
  severity: 'critical' | 'major' | 'minor' | 'suggestion';
  category: string;
  description: string;
  impact: string;
  cultural: boolean;
  solution?: string;
}

export interface Recommendation {
  type: 'enhancement' | 'optimization' | 'cultural' | 'accessibility' | 'sustainability';
  priority: 'high' | 'medium' | 'low';
  description: string;
  benefit: string;
  effort: 'low' | 'medium' | 'high';
  cost: number;
  cultural: boolean;
  timeline: string;
}

// Export all types - removed duplicate exports