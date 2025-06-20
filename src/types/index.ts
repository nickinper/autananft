export interface JournalEntry {
  id: string;
  date: string;
  sections?: JournalSections; // Legacy format
  entries?: FlexibleEntry[]; // New flexible format
  tags: string[];
  createdAt: string;
  updatedAt: string;
  consciousnessLevel?: number;
}

export interface FlexibleEntry {
  id: string;
  type: string; // User-defined entry type/subject
  details: string; // Entry content
  timestamp?: string;
}

export interface JournalSections {
  personalReflections: PersonalReflections;
  progressTracking: ProgressTracking;
  lessonsInsights: LessonsInsights;
  experiences: Experiences;
  planning: Planning;
  contextMedia: ContextMedia;
}

export interface PersonalReflections {
  emotionalSummary: string;
  streamOfConsciousness: string;
  spiritualInsights: string;
}

export interface ProgressTracking {
  learning: string;
  business: string;
  physicalActivity: string;
}

export interface LessonsInsights {
  lessonsLearned: string;
  devilsAdvocate: string;
  standoutMoments: string;
}

export interface Experiences {
  places: string;
  people: string;
  memorableMoments: string;
  patternRecognition: string;
}

export interface Planning {
  tomorrowsPlan: string;
  futureInspiration: string;
  reminders: string;
}

export interface ContextMedia {
  worldEvents: string;
  stockMarket: string;
  tags: string[];
}

export interface PandaNFT {
  id: string;
  journalEntryId: string;
  generatedAt: string;
  traits: PandaTraits;
  metadata: NFTMetadata;
  svgData?: string;
}

export interface PandaTraits {
  powerDomain: PowerDomain;
  consciousnessLevel: number;
  geometricForm: GeometricForm;
  emotionalProfile: EmotionalProfile;
  thoughtPatterns: ThoughtPatterns;
  energySignature: EnergySignature;
  evolutionPotential: number;
}

export enum PowerDomain {
  ELEMENTAL = 'ELEMENTAL',
  PSYCHIC = 'PSYCHIC',
  QUANTUM = 'QUANTUM',
  TECH = 'TECH',
  COSMIC = 'COSMIC'
}

export interface GeometricForm {
  shape: string;
  complexity: number;
  color: string;
  animation: string;
}

export interface EmotionalProfile {
  dominantEmotion: string;
  intensity: number;
  balance: number;
}

export interface ThoughtPatterns {
  abstractThinking: number;
  concreteThinking: number;
  patternRecognition: number;
}

export interface EnergySignature {
  frequency: number;
  amplitude: number;
  vibration: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  backstory: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}