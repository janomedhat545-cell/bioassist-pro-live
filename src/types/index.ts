export type PageId =
  | 'home'
  | 'dashboard'
  | 'calculator'
  | 'reference'
  | 'chat'
  | 'saved'
  | 'activity'
  | 'settings';

export type ReferenceCategory =
  | 'CRISPR Fundamentals'
  | 'Genetic Engineering'
  | 'Molecular Biology'
  | 'DNA Repair'
  | 'Gene Expression'
  | 'Cancer Research'
  | 'Laboratory Techniques'
  | 'Safety and Ethics';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ReferenceSource {
  title: string;
  source: string;
  year?: number;
  url?: string;
  doi?: string;
}

export interface ReferenceTopic {
  id: string;
  title: string;
  category: ReferenceCategory;
  difficulty: DifficultyLevel;
  shortDefinition: string;
  definition: string;
  coreMechanism: string;
  molecularComponents: string[];
  scientificSignificance: string;
  commonTerminology: { term: string; definition: string }[];
  educationalExamples: string;
  limitationsAndMisconceptions: string[];
  relatedTopicIds: string[];
  suggestedAiQuestions: string[];
  sources: ReferenceSource[];
}

export type MolarityMode = 'calculate_molarity' | 'calculate_moles' | 'calculate_mass';
export type VolumeUnit = 'L' | 'mL' | 'uL';
export type ConcentrationUnit = 'M' | 'mM' | 'uM' | 'nM';

export interface ReagentPreset {
  name: string;
  molecularWeight: number; // g/mol
  formula?: string;
  commonUse?: string;
}

export interface MolarityState {
  mode: MolarityMode;
  moles: string;
  volume: string;
  volumeUnit: VolumeUnit;
  molarity: string;
  molecularWeight: string;
  soluteName: string;
}

export interface DilutionState {
  stockConcentration: string;
  stockConcUnit: ConcentrationUnit;
  targetConcentration: string;
  targetConcUnit: ConcentrationUnit;
  targetVolume: string;
  targetVolumeUnit: VolumeUnit;
  stockLabel: string;
}

export interface PcrComponent {
  name: string;
  volumePerRxn: number; // in uL
  totalMasterMixVolume: number; // in uL
  concentrationNote?: string;
}

export interface PcrState {
  numberOfReactions: number;
  reactionVolumePerTube: number; // uL
  overagePercent: number; // e.g. 10%
  masterMixMode: 'commercial_2x' | 'individual_reagents';
  templateDnaVolume: number; // uL
  forwardPrimerVolume: number; // uL
  reversePrimerVolume: number; // uL
  // Individual components (only if individual_reagents)
  buffer10xVolume: number; // uL
  mgCl2Volume: number; // uL
  dNTPsVolume: number; // uL
  polymeraseVolume: number; // uL
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  mode?: 'live' | 'demo';
  saved?: boolean;
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

export interface ActivityItem {
  id: string;
  type: 'calculator' | 'reference' | 'chat' | 'bookmark';
  title: string;
  description: string;
  timestamp: string;
  linkPage: PageId;
  metadata?: Record<string, any>;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultVolumeUnit: VolumeUnit;
  defaultConcUnit: ConcentrationUnit;
  soundEffects: boolean;
  saveHistory: boolean;
}
