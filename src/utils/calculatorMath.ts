import {
  VolumeUnit,
  ConcentrationUnit,
  MolarityMode,
  PcrComponent,
  PcrState,
  ReagentPreset,
} from '../types';

// Standard biotechnology reagent molecular weights
export const COMMON_REAGENTS: ReagentPreset[] = [
  { name: 'Sodium Chloride (NaCl)', molecularWeight: 58.44, formula: 'NaCl', commonUse: 'PBS, saline buffers' },
  { name: 'Tris Base', molecularWeight: 121.14, formula: 'C4H11NO3', commonUse: 'Tris-HCl, TAE, TBE buffers' },
  { name: 'EDTA Disodium Salt', molecularWeight: 372.24, formula: 'C10H14N2Na2O8·2H2O', commonUse: 'TE buffer, chelating agent' },
  { name: 'SDS (Sodium Dodecyl Sulfate)', molecularWeight: 288.38, formula: 'NaC12H25SO4', commonUse: 'Protein lysis, SDS-PAGE' },
  { name: 'Glucose (Dextrose)', molecularWeight: 180.16, formula: 'C6H12O6', commonUse: 'Bacterial growth media' },
  { name: 'Magnesium Chloride (MgCl2)', molecularWeight: 95.21, formula: 'MgCl2', commonUse: 'PCR cofactor, enzyme buffers' },
  { name: 'Potassium Chloride (KCl)', molecularWeight: 74.55, formula: 'KCl', commonUse: 'PBS, enzyme storage buffers' },
  { name: 'Urea', molecularWeight: 60.06, formula: 'CH4N2O', commonUse: 'Denaturing PAGE, protein denaturation' },
  { name: 'HEPES', molecularWeight: 238.30, formula: 'C8H18N2O4S', commonUse: 'Biological buffering (pH 6.8-8.2)' },
  { name: 'Sodium Hydroxide (NaOH)', molecularWeight: 40.00, formula: 'NaOH', commonUse: 'pH adjustment, alkaline lysis' },
  { name: 'DTT (Dithiothreitol)', molecularWeight: 154.25, formula: 'C4H10O2S2', commonUse: 'Disulfide bond reduction' },
  { name: 'Ampicillin Sodium', molecularWeight: 371.39, formula: 'C16H18N3NaO4S', commonUse: 'Antibiotic selection (100 ug/mL)' },
];

// Unit conversion helpers
export function volumeToLiters(value: number, unit: VolumeUnit): number {
  switch (unit) {
    case 'L':
      return value;
    case 'mL':
      return value * 1e-3;
    case 'uL':
      return value * 1e-6;
    default:
      return value;
  }
}

export function litersToVolume(liters: number, targetUnit: VolumeUnit): number {
  switch (targetUnit) {
    case 'L':
      return liters;
    case 'mL':
      return liters * 1e3;
    case 'uL':
      return liters * 1e6;
    default:
      return liters;
  }
}

export function concentrationToMolar(value: number, unit: ConcentrationUnit): number {
  switch (unit) {
    case 'M':
      return value;
    case 'mM':
      return value * 1e-3;
    case 'uM':
      return value * 1e-6;
    case 'nM':
      return value * 1e-9;
    default:
      return value;
  }
}

export function molarToConcentration(molar: number, targetUnit: ConcentrationUnit): number {
  switch (targetUnit) {
    case 'M':
      return molar;
    case 'mM':
      return molar * 1e3;
    case 'uM':
      return molar * 1e6;
    case 'nM':
      return molar * 1e9;
    default:
      return molar;
  }
}

// Format numbers nicely with scientific formatting or fixed decimals
export function formatScientificNumber(val: number, sigFigs = 4): string {
  if (isNaN(val) || !isFinite(val)) return 'Invalid';
  if (val === 0) return '0';
  
  const absVal = Math.abs(val);
  if (absVal >= 0.001 && absVal < 10000) {
    // Return standard number with up to 4 significant digits or sensible decimals
    const rounded = Number(val.toPrecision(sigFigs));
    return rounded.toString();
  }
  return val.toExponential(sigFigs - 1);
}

// 1. Molarity Calculator
export interface MolarityResult {
  value: number;
  formattedValue: string;
  unit: string;
  formula: string;
  substitutedFormula: string;
  explanation: string;
  error?: string;
}

export function calculateMolarity(
  mode: MolarityMode,
  params: {
    moles?: number;
    volume?: number;
    volumeUnit: VolumeUnit;
    molarity?: number;
    molecularWeight?: number;
  }
): MolarityResult {
  const { moles, volume, volumeUnit, molarity, molecularWeight } = params;

  if (volume === undefined || volume <= 0) {
    return {
      value: 0,
      formattedValue: '—',
      unit: '',
      formula: '',
      substitutedFormula: '',
      explanation: 'Please enter a positive solution volume.',
      error: 'Volume must be greater than zero.',
    };
  }

  const volInLiters = volumeToLiters(volume, volumeUnit);

  if (mode === 'calculate_molarity') {
    if (moles === undefined || moles < 0) {
      return {
        value: 0,
        formattedValue: '—',
        unit: 'M (mol/L)',
        formula: 'M = n / V',
        substitutedFormula: '',
        explanation: 'Enter the solute quantity in moles.',
        error: 'Moles must be non-negative.',
      };
    }

    const resultMolarity = moles / volInLiters;
    return {
      value: resultMolarity,
      formattedValue: `${formatScientificNumber(resultMolarity)} M`,
      unit: 'M (mol/L)',
      formula: 'M = n / V',
      substitutedFormula: `M = ${moles} mol / ${formatScientificNumber(volInLiters)} L`,
      explanation: `Dissolving ${moles} moles of solute in a final volume of ${volume} ${volumeUnit} (${formatScientificNumber(volInLiters)} L) produces a molar concentration of ${formatScientificNumber(resultMolarity)} M.`,
    };
  }

  if (mode === 'calculate_moles') {
    if (molarity === undefined || molarity < 0) {
      return {
        value: 0,
        formattedValue: '—',
        unit: 'mol',
        formula: 'n = M × V',
        substitutedFormula: '',
        explanation: 'Enter the target molarity.',
        error: 'Molarity must be non-negative.',
      };
    }

    const resultMoles = molarity * volInLiters;
    return {
      value: resultMoles,
      formattedValue: `${formatScientificNumber(resultMoles)} mol`,
      unit: 'mol',
      formula: 'n = M × V',
      substitutedFormula: `n = ${molarity} mol/L × ${formatScientificNumber(volInLiters)} L`,
      explanation: `A solution of ${molarity} M with a volume of ${volume} ${volumeUnit} (${formatScientificNumber(volInLiters)} L) contains ${formatScientificNumber(resultMoles)} moles of solute.`,
    };
  }

  if (mode === 'calculate_mass') {
    if (molarity === undefined || molarity < 0) {
      return {
        value: 0,
        formattedValue: '—',
        unit: 'g',
        formula: 'm = M × V × MW',
        substitutedFormula: '',
        explanation: 'Enter the target molarity.',
        error: 'Target molarity must be non-negative.',
      };
    }
    if (molecularWeight === undefined || molecularWeight <= 0) {
      return {
        value: 0,
        formattedValue: '—',
        unit: 'g',
        formula: 'm = M × V × MW',
        substitutedFormula: '',
        explanation: 'Enter the solute molecular weight (MW) in g/mol.',
        error: 'Molecular weight must be greater than zero.',
      };
    }

    const massGrams = molarity * volInLiters * molecularWeight;
    let formattedUnit = 'g';
    let displayMass = massGrams;

    if (massGrams < 0.001 && massGrams > 0) {
      displayMass = massGrams * 1e6;
      formattedUnit = 'µg';
    } else if (massGrams < 1 && massGrams >= 0.001) {
      displayMass = massGrams * 1e3;
      formattedUnit = 'mg';
    }

    return {
      value: massGrams,
      formattedValue: `${formatScientificNumber(massGrams)} g (${formatScientificNumber(displayMass)} ${formattedUnit})`,
      unit: 'g',
      formula: 'm = M × V × MW',
      substitutedFormula: `m = ${molarity} mol/L × ${formatScientificNumber(volInLiters)} L × ${molecularWeight} g/mol`,
      explanation: `To prepare ${volume} ${volumeUnit} of ${molarity} M solution, weigh out ${formatScientificNumber(massGrams)} g (${formatScientificNumber(displayMass)} ${formattedUnit}) of solute, dissolve in ~80% of the volume, and adjust final volume to ${volume} ${volumeUnit}.`,
    };
  }

  return {
    value: 0,
    formattedValue: '—',
    unit: '',
    formula: '',
    substitutedFormula: '',
    explanation: 'Invalid mode.',
    error: 'Unknown calculation mode.',
  };
}

// 2. Dilution Calculator (C1V1 = C2V2)
export interface DilutionResult {
  v1Required: number; // in target volume unit
  v1InLiters: number;
  diluentVolume: number; // in target volume unit
  targetVolume: number;
  volumeUnit: VolumeUnit;
  c1Molar: number;
  c2Molar: number;
  formula: string;
  substitutedFormula: string;
  summary: string;
  error?: string;
  warning?: string;
}

export function calculateDilution(params: {
  stockConcentration: number;
  stockConcUnit: ConcentrationUnit;
  targetConcentration: number;
  targetConcUnit: ConcentrationUnit;
  targetVolume: number;
  targetVolumeUnit: VolumeUnit;
  stockLabel?: string;
}): DilutionResult {
  const {
    stockConcentration,
    stockConcUnit,
    targetConcentration,
    targetConcUnit,
    targetVolume,
    targetVolumeUnit,
    stockLabel,
  } = params;

  const defaultError: DilutionResult = {
    v1Required: 0,
    v1InLiters: 0,
    diluentVolume: 0,
    targetVolume,
    volumeUnit: targetVolumeUnit,
    c1Molar: 0,
    c2Molar: 0,
    formula: 'V₁ = (C₂ × V₂) / C₁',
    substitutedFormula: '',
    summary: '',
  };

  if (stockConcentration <= 0) {
    return { ...defaultError, error: 'Stock concentration (C₁) must be greater than zero.' };
  }
  if (targetConcentration <= 0) {
    return { ...defaultError, error: 'Target concentration (C₂) must be greater than zero.' };
  }
  if (targetVolume <= 0) {
    return { ...defaultError, error: 'Target volume (V₂) must be greater than zero.' };
  }

  const c1Molar = concentrationToMolar(stockConcentration, stockConcUnit);
  const c2Molar = concentrationToMolar(targetConcentration, targetConcUnit);
  const v2Liters = volumeToLiters(targetVolume, targetVolumeUnit);

  if (c2Molar > c1Molar) {
    return {
      ...defaultError,
      c1Molar,
      c2Molar,
      error: `Target concentration (${targetConcentration} ${targetConcUnit} = ${formatScientificNumber(c2Molar)} M) exceeds stock concentration (${stockConcentration} ${stockConcUnit} = ${formatScientificNumber(c1Molar)} M). A standard dilution can only decrease concentration; this preparation cannot be achieved by dilution alone.`,
    };
  }

  // V1 = (C2 * V2) / C1
  const v1Liters = (c2Molar * v2Liters) / c1Molar;
  const v1TargetUnit = litersToVolume(v1Liters, targetVolumeUnit);
  const diluentTargetUnit = targetVolume - v1TargetUnit;

  const reagentName = stockLabel?.trim() ? stockLabel.trim() : 'stock solution';

  return {
    v1Required: v1TargetUnit,
    v1InLiters: v1Liters,
    diluentVolume: Math.max(0, diluentTargetUnit),
    targetVolume,
    volumeUnit: targetVolumeUnit,
    c1Molar,
    c2Molar,
    formula: 'V₁ = (C₂ × V₂) / C₁',
    substitutedFormula: `V₁ = (${formatScientificNumber(c2Molar)} M × ${formatScientificNumber(v2Liters)} L) / ${formatScientificNumber(c1Molar)} M = ${formatScientificNumber(v1Liters)} L`,
    summary: `Pipette ${formatScientificNumber(v1TargetUnit)} ${targetVolumeUnit} of ${reagentName}. Add diluent to reach the final volume of ${targetVolume} ${targetVolumeUnit} (~${formatScientificNumber(Math.max(0, diluentTargetUnit))} ${targetVolumeUnit} diluent). Note: Mixing liquid volumes may not be perfectly additive; always bring to the final volume graduation mark.`,
  };
}

// 3. PCR Reaction Calculator
export interface PcrCalculationResult {
  components: PcrComponent[];
  waterVolumePerRxn: number;
  totalWaterMasterMix: number;
  totalMasterMixPerTube: number;
  totalMasterMixOverall: number;
  effectiveReactions: number; // N * (1 + overage)
  error?: string;
  warning?: string;
}

export function calculatePcrReaction(state: PcrState): PcrCalculationResult {
  const {
    numberOfReactions,
    reactionVolumePerTube,
    overagePercent,
    masterMixMode,
    templateDnaVolume,
    forwardPrimerVolume,
    reversePrimerVolume,
    buffer10xVolume,
    mgCl2Volume,
    dNTPsVolume,
    polymeraseVolume,
  } = state;

  if (numberOfReactions <= 0) {
    return {
      components: [],
      waterVolumePerRxn: 0,
      totalWaterMasterMix: 0,
      totalMasterMixPerTube: 0,
      totalMasterMixOverall: 0,
      effectiveReactions: 0,
      error: 'Number of reactions must be at least 1.',
    };
  }

  if (reactionVolumePerTube <= 0) {
    return {
      components: [],
      waterVolumePerRxn: 0,
      totalWaterMasterMix: 0,
      totalMasterMixPerTube: 0,
      totalMasterMixOverall: 0,
      effectiveReactions: 0,
      error: 'Reaction volume per tube must be greater than zero.',
    };
  }

  const multiplier = numberOfReactions * (1 + Math.max(0, overagePercent) / 100);
  const components: PcrComponent[] = [];

  let nonWaterVolume = 0;

  if (masterMixMode === 'commercial_2x') {
    // 2X master mix is exactly half the total reaction volume
    const mm2xVol = reactionVolumePerTube * 0.5;
    components.push({
      name: '2X PCR Master Mix (Taq / High-Fidelity)',
      volumePerRxn: mm2xVol,
      totalMasterMixVolume: mm2xVol * multiplier,
      concentrationNote: '1X final',
    });
    nonWaterVolume += mm2xVol;

    // Primers
    components.push({
      name: 'Forward Primer (10 µM stock)',
      volumePerRxn: forwardPrimerVolume,
      totalMasterMixVolume: forwardPrimerVolume * multiplier,
      concentrationNote: `${formatScientificNumber((forwardPrimerVolume * 10) / reactionVolumePerTube)} µM final`,
    });
    nonWaterVolume += forwardPrimerVolume;

    components.push({
      name: 'Reverse Primer (10 µM stock)',
      volumePerRxn: reversePrimerVolume,
      totalMasterMixVolume: reversePrimerVolume * multiplier,
      concentrationNote: `${formatScientificNumber((reversePrimerVolume * 10) / reactionVolumePerTube)} µM final`,
    });
    nonWaterVolume += reversePrimerVolume;
  } else {
    // Individual reagents
    // Buffer (10X)
    const bufVol = buffer10xVolume > 0 ? buffer10xVolume : reactionVolumePerTube * 0.1;
    components.push({
      name: '10X PCR Reaction Buffer',
      volumePerRxn: bufVol,
      totalMasterMixVolume: bufVol * multiplier,
      concentrationNote: '1X final',
    });
    nonWaterVolume += bufVol;

    // MgCl2
    components.push({
      name: 'MgCl2 (50 mM stock)',
      volumePerRxn: mgCl2Volume,
      totalMasterMixVolume: mgCl2Volume * multiplier,
      concentrationNote: `${formatScientificNumber((mgCl2Volume * 50) / reactionVolumePerTube)} mM final`,
    });
    nonWaterVolume += mgCl2Volume;

    // dNTP mix
    components.push({
      name: 'dNTP Mix (10 mM each)',
      volumePerRxn: dNTPsVolume,
      totalMasterMixVolume: dNTPsVolume * multiplier,
      concentrationNote: `${formatScientificNumber((dNTPsVolume * 10) / reactionVolumePerTube)} mM final`,
    });
    nonWaterVolume += dNTPsVolume;

    // Primers
    components.push({
      name: 'Forward Primer (10 µM stock)',
      volumePerRxn: forwardPrimerVolume,
      totalMasterMixVolume: forwardPrimerVolume * multiplier,
      concentrationNote: `${formatScientificNumber((forwardPrimerVolume * 10) / reactionVolumePerTube)} µM final`,
    });
    nonWaterVolume += forwardPrimerVolume;

    components.push({
      name: 'Reverse Primer (10 µM stock)',
      volumePerRxn: reversePrimerVolume,
      totalMasterMixVolume: reversePrimerVolume * multiplier,
      concentrationNote: `${formatScientificNumber((reversePrimerVolume * 10) / reactionVolumePerTube)} µM final`,
    });
    nonWaterVolume += reversePrimerVolume;

    // DNA Polymerase
    components.push({
      name: 'DNA Polymerase (5 U/µL)',
      volumePerRxn: polymeraseVolume,
      totalMasterMixVolume: polymeraseVolume * multiplier,
      concentrationNote: `${formatScientificNumber(polymeraseVolume * 5)} U / rxn`,
    });
    nonWaterVolume += polymeraseVolume;
  }

  // Account for template DNA (added separately into each tube, not in master mix)
  nonWaterVolume += templateDnaVolume;

  const waterVolPerRxn = reactionVolumePerTube - nonWaterVolume;

  if (waterVolPerRxn < 0) {
    return {
      components,
      waterVolumePerRxn: waterVolPerRxn,
      totalWaterMasterMix: 0,
      totalMasterMixPerTube: 0,
      totalMasterMixOverall: 0,
      effectiveReactions: multiplier,
      error: `Sum of reagent volumes (${formatScientificNumber(nonWaterVolume)} µL) exceeds the requested total reaction volume (${reactionVolumePerTube} µL). Reduce reagent or template volumes, or increase the final tube volume.`,
    };
  }

  // Water component added to master mix
  components.push({
    name: 'Nuclease-Free Water (ddH2O)',
    volumePerRxn: waterVolPerRxn,
    totalMasterMixVolume: waterVolPerRxn * multiplier,
    concentrationNote: 'Balance to volume',
  });

  // Calculate master mix volumes (all reagents except template DNA)
  const masterMixPerTube = reactionVolumePerTube - templateDnaVolume;
  const totalMasterMixOverall = masterMixPerTube * multiplier;

  let warning: string | undefined;
  if (waterVolPerRxn < 1.0) {
    warning = 'Water volume per reaction is under 1.0 µL. Pipetting very small residual volumes may compromise accuracy.';
  }

  return {
    components,
    waterVolumePerRxn: waterVolPerRxn,
    totalWaterMasterMix: waterVolPerRxn * multiplier,
    totalMasterMixPerTube: masterMixPerTube,
    totalMasterMixOverall,
    effectiveReactions: multiplier,
    warning,
  };
}
