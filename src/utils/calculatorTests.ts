import {
  calculateMolarity,
  calculateDilution,
  calculatePcrReaction,
  volumeToLiters,
  litersToVolume,
  concentrationToMolar,
  molarToConcentration,
} from './calculatorMath';

export interface TestCaseResult {
  category: string;
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  details?: string;
}

export function runAllCalculationTests(): {
  total: number;
  passed: number;
  failed: number;
  results: TestCaseResult[];
} {
  const results: TestCaseResult[] = [];

  const floatEquals = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) <= eps * (Math.abs(b) + 1e-12);

  // 1. Volume Conversions
  {
    const l1 = volumeToLiters(500, 'mL');
    results.push({
      category: 'Unit Conversion',
      name: '500 mL to Liters',
      passed: floatEquals(l1, 0.5),
      expected: '0.5 L',
      actual: `${l1} L`,
    });

    const l2 = volumeToLiters(25, 'uL');
    results.push({
      category: 'Unit Conversion',
      name: '25 µL to Liters',
      passed: floatEquals(l2, 0.000025),
      expected: '0.000025 L',
      actual: `${l2} L`,
    });

    const backL = litersToVolume(0.002, 'uL');
    results.push({
      category: 'Unit Conversion',
      name: '0.002 L to µL',
      passed: floatEquals(backL, 2000),
      expected: '2000 µL',
      actual: `${backL} µL`,
    });
  }

  // 2. Concentration Conversions
  {
    const m1 = concentrationToMolar(50, 'mM');
    results.push({
      category: 'Unit Conversion',
      name: '50 mM to Molar',
      passed: floatEquals(m1, 0.05),
      expected: '0.05 M',
      actual: `${m1} M`,
    });

    const m2 = concentrationToMolar(500, 'nM');
    results.push({
      category: 'Unit Conversion',
      name: '500 nM to Molar',
      passed: floatEquals(m2, 5e-7),
      expected: '5e-7 M',
      actual: `${m2} M`,
    });

    const backC = molarToConcentration(0.001, 'uM');
    results.push({
      category: 'Unit Conversion',
      name: '0.001 M to µM',
      passed: floatEquals(backC, 1000),
      expected: '1000 µM',
      actual: `${backC} µM`,
    });
  }

  // 3. Molarity Calculations
  {
    // Mode: calculate_molarity (0.5 mol in 2 L = 0.25 M)
    const res1 = calculateMolarity('calculate_molarity', {
      moles: 0.5,
      volume: 2,
      volumeUnit: 'L',
    });
    results.push({
      category: 'Molarity',
      name: 'Calculate M: 0.5 mol in 2 L = 0.25 M',
      passed: floatEquals(res1.value, 0.25),
      expected: '0.25 M',
      actual: `${res1.value} M`,
    });

    // Mode: calculate_moles (1.5 M in 500 mL = 0.75 mol)
    const res2 = calculateMolarity('calculate_moles', {
      molarity: 1.5,
      volume: 500,
      volumeUnit: 'mL',
    });
    results.push({
      category: 'Molarity',
      name: 'Calculate Moles: 1.5 M in 500 mL = 0.75 mol',
      passed: floatEquals(res2.value, 0.75),
      expected: '0.75 mol',
      actual: `${res2.value} mol`,
    });

    // Mode: calculate_mass (1 M NaCl, MW=58.44 g/mol in 1 L = 58.44 g)
    const res3 = calculateMolarity('calculate_mass', {
      molarity: 1.0,
      volume: 1.0,
      volumeUnit: 'L',
      molecularWeight: 58.44,
    });
    results.push({
      category: 'Molarity',
      name: 'Calculate Mass: 1 M NaCl (58.44 g/mol) in 1 L = 58.44 g',
      passed: floatEquals(res3.value, 58.44),
      expected: '58.44 g',
      actual: `${res3.value} g`,
    });

    // Zero volume edge case handling
    const resZero = calculateMolarity('calculate_molarity', {
      moles: 1,
      volume: 0,
      volumeUnit: 'mL',
    });
    results.push({
      category: 'Molarity Edge Case',
      name: 'Prevent Division by Zero (Volume = 0)',
      passed: Boolean(resZero.error),
      expected: 'Error present',
      actual: resZero.error || 'No error detected',
    });
  }

  // 4. Dilution Calculations (C1V1 = C2V2)
  {
    // Dilute 10 M stock to 1 M in 100 mL -> V1 = 10 mL, diluent = 90 mL
    const dil1 = calculateDilution({
      stockConcentration: 10,
      stockConcUnit: 'M',
      targetConcentration: 1,
      targetConcUnit: 'M',
      targetVolume: 100,
      targetVolumeUnit: 'mL',
    });
    results.push({
      category: 'Dilution (C1V1=C2V2)',
      name: '10 M stock to 1 M in 100 mL -> V1 = 10 mL',
      passed: floatEquals(dil1.v1Required, 10) && floatEquals(dil1.diluentVolume, 90),
      expected: 'V1 = 10 mL, Diluent = 90 mL',
      actual: `V1 = ${dil1.v1Required} mL, Diluent = ${dil1.diluentVolume} mL`,
    });

    // Mixed units: 1 M stock to 50 mM in 20 mL -> C2 = 0.05 M, V1 = 1 mL
    const dil2 = calculateDilution({
      stockConcentration: 1,
      stockConcUnit: 'M',
      targetConcentration: 50,
      targetConcUnit: 'mM',
      targetVolume: 20,
      targetVolumeUnit: 'mL',
    });
    results.push({
      category: 'Dilution (C1V1=C2V2)',
      name: 'Mixed Units: 1 M stock to 50 mM in 20 mL -> V1 = 1 mL',
      passed: floatEquals(dil2.v1Required, 1),
      expected: 'V1 = 1 mL',
      actual: `V1 = ${dil2.v1Required} mL`,
    });

    // Invalid dilution: C2 > C1 (Impossible dilution)
    const dilFail = calculateDilution({
      stockConcentration: 10,
      stockConcUnit: 'mM',
      targetConcentration: 50,
      targetConcUnit: 'mM',
      targetVolume: 100,
      targetVolumeUnit: 'mL',
    });
    results.push({
      category: 'Dilution Edge Case',
      name: 'Validation: C2 > C1 (Impossible dilution detection)',
      passed: Boolean(dilFail.error),
      expected: 'Validation error thrown',
      actual: dilFail.error || 'Failed to detect invalid concentration',
    });
  }

  // 5. PCR Reaction Setup Calculations
  {
    // 25 uL reaction, 2X master mix (12.5 uL), template (2 uL), primers (1 uL each) -> Water = 8.5 uL
    const pcr1 = calculatePcrReaction({
      numberOfReactions: 10,
      reactionVolumePerTube: 25,
      overagePercent: 10, // 10% overage = 11 effective reactions
      masterMixMode: 'commercial_2x',
      templateDnaVolume: 2.0,
      forwardPrimerVolume: 1.0,
      reversePrimerVolume: 1.0,
      buffer10xVolume: 2.5,
      mgCl2Volume: 1.0,
      dNTPsVolume: 0.5,
      polymeraseVolume: 0.25,
    });

    const expectedWaterPerRxn = 25 - (12.5 + 2.0 + 1.0 + 1.0); // 8.5 uL
    const expectedTotalWater = 8.5 * 11; // 93.5 uL
    results.push({
      category: 'PCR Accounting',
      name: '2X Master Mix Water Balance: 25 µL rxn -> 8.5 µL water',
      passed: floatEquals(pcr1.waterVolumePerRxn, expectedWaterPerRxn),
      expected: '8.5 µL',
      actual: `${pcr1.waterVolumePerRxn} µL`,
    });

    results.push({
      category: 'PCR Accounting',
      name: 'Master Mix 10% Overage Factor (10 rxns * 1.1 = 11 rxns total)',
      passed: floatEquals(pcr1.effectiveReactions, 11),
      expected: '11 effective rxns',
      actual: `${pcr1.effectiveReactions} effective rxns`,
    });

    results.push({
      category: 'PCR Accounting',
      name: 'Total Master Mix Water with Overage (8.5 µL * 11 = 93.5 µL)',
      passed: floatEquals(pcr1.totalWaterMasterMix, expectedTotalWater),
      expected: '93.5 µL',
      actual: `${pcr1.totalWaterMasterMix} µL`,
    });

    // Overflow check: Reagents exceeding reaction volume
    const pcrOverflow = calculatePcrReaction({
      numberOfReactions: 1,
      reactionVolumePerTube: 20,
      overagePercent: 0,
      masterMixMode: 'commercial_2x',
      templateDnaVolume: 15,
      forwardPrimerVolume: 2,
      reversePrimerVolume: 2,
      buffer10xVolume: 2,
      mgCl2Volume: 1,
      dNTPsVolume: 1,
      polymeraseVolume: 0.5,
    });
    // 2X mix = 10, template = 15, primers = 4 -> total 29 > 20
    results.push({
      category: 'PCR Edge Case',
      name: 'Detect Reagents Exceeding Total Reaction Volume',
      passed: Boolean(pcrOverflow.error),
      expected: 'Volume overflow error thrown',
      actual: pcrOverflow.error || 'Failed to detect volume overflow',
    });
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;

  return {
    total: results.length,
    passed,
    failed,
    results,
  };
}
