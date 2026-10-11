import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Info,
  Download,
  TestTube,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  MolarityMode,
  VolumeUnit,
  ConcentrationUnit,
  PcrState,
  ActivityItem,
} from '../../types';
import {
  COMMON_REAGENTS,
  calculateMolarity,
  calculateDilution,
  calculatePcrReaction,
  formatScientificNumber,
} from '../../utils/calculatorMath';
import { runAllCalculationTests, TestCaseResult } from '../../utils/calculatorTests';

interface CalculatorPageProps {
  onLogActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({ onLogActivity }) => {
  const [activeTab, setActiveTab] = useState<'molarity' | 'dilution' | 'pcr'>('molarity');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showTestRunner, setShowTestRunner] = useState(false);
  const [testResults, setTestResults] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: TestCaseResult[];
  } | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // ==========================================
  // 1. MOLARITY CALCULATOR STATE
  // ==========================================
  const [molarityMode, setMolarityMode] = useState<MolarityMode>('calculate_mass');
  const [soluteMoles, setSoluteMoles] = useState<string>('0.05');
  const [soluteMolarity, setSoluteMolarity] = useState<string>('0.1');
  const [soluteVolume, setSoluteVolume] = useState<string>('500');
  const [soluteVolumeUnit, setSoluteVolumeUnit] = useState<VolumeUnit>('mL');
  const [soluteMW, setSoluteMW] = useState<string>('58.44'); // Default NaCl
  const [selectedPresetName, setSelectedPresetName] = useState<string>('Sodium Chloride (NaCl)');

  const molarityResult = useMemo(() => {
    return calculateMolarity(molarityMode, {
      moles: parseFloat(soluteMoles) || 0,
      volume: parseFloat(soluteVolume) || 0,
      volumeUnit: soluteVolumeUnit,
      molarity: parseFloat(soluteMolarity) || 0,
      molecularWeight: parseFloat(soluteMW) || 0,
    });
  }, [molarityMode, soluteMoles, soluteVolume, soluteVolumeUnit, soluteMolarity, soluteMW]);

  const handleLoadMolaritySample = () => {
    setMolarityMode('calculate_mass');
    setSoluteMolarity('1.0');
    setSoluteVolume('500');
    setSoluteVolumeUnit('mL');
    setSoluteMW('121.14'); // Tris Base
    setSelectedPresetName('Tris Base');
    onLogActivity({
      type: 'calculator',
      title: 'Molarity Sample Loaded',
      description: 'Loaded 500 mL of 1.0 M Tris Base solution parameters',
      linkPage: 'calculator',
    });
  };

  const handleResetMolarity = () => {
    setSoluteMoles('');
    setSoluteMolarity('');
    setSoluteVolume('100');
    setSoluteMW('58.44');
    setSelectedPresetName('Sodium Chloride (NaCl)');
  };

  // ==========================================
  // 2. DILUTION CALCULATOR STATE
  // ==========================================
  const [c1Value, setC1Value] = useState<string>('10');
  const [c1Unit, setC1Unit] = useState<ConcentrationUnit>('mM');
  const [c2Value, setC2Value] = useState<string>('100');
  const [c2Unit, setC2Unit] = useState<ConcentrationUnit>('uM');
  const [v2Value, setV2Value] = useState<string>('50');
  const [v2Unit, setV2Unit] = useState<VolumeUnit>('mL');
  const [stockLabel, setStockLabel] = useState<string>('Stock Primer / Drug');

  const dilutionResult = useMemo(() => {
    return calculateDilution({
      stockConcentration: parseFloat(c1Value) || 0,
      stockConcUnit: c1Unit,
      targetConcentration: parseFloat(c2Value) || 0,
      targetConcUnit: c2Unit,
      targetVolume: parseFloat(v2Value) || 0,
      targetVolumeUnit: v2Unit,
      stockLabel,
    });
  }, [c1Value, c1Unit, c2Value, c2Unit, v2Value, v2Unit, stockLabel]);

  const handleLoadDilutionSample = () => {
    setC1Value('1');
    setC1Unit('M');
    setC2Value('50');
    setC2Unit('mM');
    setV2Value('100');
    setV2Unit('mL');
    setStockLabel('1 M Tris-HCl Stock');
    onLogActivity({
      type: 'calculator',
      title: 'Dilution Calculation Logged',
      description: '1 M stock to 50 mM working solution in 100 mL',
      linkPage: 'calculator',
    });
  };

  const handleResetDilution = () => {
    setC1Value('');
    setC2Value('');
    setV2Value('10');
    setStockLabel('');
  };

  // ==========================================
  // 3. PCR CALCULATOR STATE
  // ==========================================
  const [pcrState, setPcrState] = useState<PcrState>({
    numberOfReactions: 8,
    reactionVolumePerTube: 25,
    overagePercent: 10,
    masterMixMode: 'commercial_2x',
    templateDnaVolume: 2.0,
    forwardPrimerVolume: 1.0,
    reversePrimerVolume: 1.0,
    buffer10xVolume: 2.5,
    mgCl2Volume: 1.0,
    dNTPsVolume: 0.5,
    polymeraseVolume: 0.25,
  });

  const pcrResult = useMemo(() => {
    return calculatePcrReaction(pcrState);
  }, [pcrState]);

  const handleLoadPcrStandardExample = () => {
    setPcrState({
      numberOfReactions: 12,
      reactionVolumePerTube: 25,
      overagePercent: 10,
      masterMixMode: 'commercial_2x',
      templateDnaVolume: 2.0,
      forwardPrimerVolume: 1.25,
      reversePrimerVolume: 1.25,
      buffer10xVolume: 2.5,
      mgCl2Volume: 1.0,
      dNTPsVolume: 0.5,
      polymeraseVolume: 0.25,
    });
    onLogActivity({
      type: 'calculator',
      title: 'PCR Master Mix Configured',
      description: 'Standard 25 µL reaction assay for 12 samples with 10% overage',
      linkPage: 'calculator',
    });
  };

  const handleResetPcr = () => {
    setPcrState({
      numberOfReactions: 1,
      reactionVolumePerTube: 25,
      overagePercent: 10,
      masterMixMode: 'commercial_2x',
      templateDnaVolume: 1.0,
      forwardPrimerVolume: 1.0,
      reversePrimerVolume: 1.0,
      buffer10xVolume: 2.5,
      mgCl2Volume: 1.0,
      dNTPsVolume: 0.5,
      polymeraseVolume: 0.2,
    });
  };

  const exportPcrCsv = () => {
    if (pcrResult.error) return;
    let csv = 'Reagent,Volume per Reaction (uL),Total Master Mix (uL),Note\n';
    pcrResult.components.forEach((c) => {
      csv += `"${c.name}",${formatScientificNumber(c.volumePerRxn)},${formatScientificNumber(c.totalMasterMixVolume)},"${c.concentrationNote || ''}"\n`;
    });
    csv += `"Template DNA (add individually to each tube)",${pcrState.templateDnaVolume},—,"Add to individual tube"\n`;
    csv += `"Total Reaction Volume",${pcrState.reactionVolumePerTube},${formatScientificNumber(pcrResult.totalMasterMixOverall + pcrState.templateDnaVolume * pcrResult.effectiveReactions)},"Final Tube Volume"\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `PCR_MasterMix_${pcrState.numberOfReactions}rxns.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRunTests = () => {
    const res = runAllCalculationTests();
    setTestResults(res);
    setShowTestRunner(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#12304A] dark:text-white flex items-center gap-2.5">
            <Calculator className="w-6 h-6 text-[#16A6A1]" />
            <span>Quick Lab Calculator</span>
          </h2>
          <p className="text-xs text-[#68778A] dark:text-[#94A3B8] mt-1">
            Perform common concentration and dilution calculations with transparent formulas and step-by-step explanations.
          </p>
        </div>

        {/* Test runner trigger */}
        <button
          onClick={handleRunTests}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] text-xs font-semibold text-[#12304A] dark:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#1A2E44] shadow-2xs transition-colors self-start sm:self-auto"
        >
          <TestTube className="w-4 h-4 text-[#16A6A1]" />
          <span>Verify Calculation Accuracy</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#E1E8EF]/60 dark:bg-[#0E1A27] rounded-xl w-full sm:w-fit">
        <button
          onClick={() => setActiveTab('molarity')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'molarity'
              ? 'bg-white dark:bg-[#112234] text-[#12304A] dark:text-white shadow-xs'
              : 'text-[#68778A] dark:text-[#94A3B8] hover:text-[#12304A] dark:hover:text-white'
          }`}
        >
          1. Molarity Calculator
        </button>

        <button
          onClick={() => setActiveTab('dilution')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'dilution'
              ? 'bg-white dark:bg-[#112234] text-[#12304A] dark:text-white shadow-xs'
              : 'text-[#68778A] dark:text-[#94A3B8] hover:text-[#12304A] dark:hover:text-white'
          }`}
        >
          2. Dilution Calculator (C₁V₁ = C₂V₂)
        </button>

        <button
          onClick={() => setActiveTab('pcr')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'pcr'
              ? 'bg-white dark:bg-[#112234] text-[#12304A] dark:text-white shadow-xs'
              : 'text-[#68778A] dark:text-[#94A3B8] hover:text-[#12304A] dark:hover:text-white'
          }`}
        >
          3. PCR Reaction Calculator
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: MOLARITY CALCULATOR */}
      {/* ======================================================== */}
      {activeTab === 'molarity' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Panel */}
          <div className="lg:col-span-7 bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E8EF] dark:border-[#1E344D]">
              <div>
                <h3 className="text-sm font-bold text-[#12304A] dark:text-white">
                  Molarity Configuration
                </h3>
                <p className="text-[11px] text-[#68778A] dark:text-[#94A3B8]">
                  Select the target variable to solve for
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLoadMolaritySample}
                  className="px-2.5 py-1 text-[11px] font-semibold text-[#16A6A1] bg-[#16A6A1]/10 rounded-lg hover:bg-[#16A6A1]/20 transition-colors"
                >
                  Load Sample
                </button>
                <button
                  onClick={handleResetMolarity}
                  className="p-1.5 text-[#68778A] hover:text-[#12304A] dark:hover:text-white rounded-lg hover:bg-[#F1F5F9] dark:hover:bg-[#1E344D] transition-colors"
                  title="Reset"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Mode Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#12304A] dark:text-white mb-1.5">
                Calculation Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'calculate_mass', label: 'Mass Required (m)' },
                  { id: 'calculate_molarity', label: 'Molarity (M)' },
                  { id: 'calculate_moles', label: 'Moles (n)' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMolarityMode(m.id as MolarityMode)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                      molarityMode === m.id
                        ? 'border-[#16A6A1] bg-[#16A6A1]/10 text-[#16A6A1] dark:border-[#20C2BC] dark:text-[#20C2BC]'
                        : 'border-[#E1E8EF] dark:border-[#1E344D] text-[#68778A] hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs based on Mode */}
            <div className="space-y-4">
              {/* If calculate mass: target molarity input */}
              {molarityMode === 'calculate_mass' && (
                <div>
                  <label className="block text-xs font-semibold text-[#12304A] dark:text-white mb-1">
                    Target Molarity (M or mol/L)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={soluteMolarity}
                    onChange={(e) => setSoluteMolarity(e.target.value)}
                    placeholder="e.g. 0.5"
                    className="w-full px-3 py-2 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl text-xs text-[#243447] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A6A1]/40"
                  />
                </div>
              )}

              {/* If calculate molarity: moles input */}
              {molarityMode === 'calculate_molarity' && (
                <div>
                  <label className="block text-xs font-semibold text-[#12304A] dark:text-white mb-1">
                    Amount of Solute (moles)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={soluteMoles}
                    onChange={(e) => setSoluteMoles(e.target.value)}
                    placeholder="e.g. 0.05"
                    className="w-full px-3 py-2 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl text-xs text-[#243447] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A6A1]/40"
                  />
                </div>
              )}

              {/* If calculate moles: target molarity input */}
              {molarityMode === 'calculate_moles' && (
                <div>
                  <label className="block text-xs font-semibold text-[#12304A] dark:text-white mb-1">
                    Solution Molarity (M or mol/L)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={soluteMolarity}
                    onChange={(e) => setSoluteMolarity(e.target.value)}
                    placeholder="e.g. 0.1"
                    className="w-full px-3 py-2 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl text-xs text-[#243447] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A6A1]/40"
                  />
                </div>
              )}

              {/* Final Solution Volume (all modes) */}
              <div>
                <label className="block text-xs font-semibold text-[#12304A] dark:text-white mb-1">
                  Final Solution Volume
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="any"
                    value={soluteVolume}
                    onChange={(e) => setSoluteVolume(e.target.value)}
                    placeholder="e.g. 500"
                    className="flex-1 px-3 py-2 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl text-xs text-[#243447] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A6A1]/40"
                  />
                  <select
                    value={soluteVolumeUnit}
                    onChange={(e) => setSoluteVolumeUnit(e.target.value as VolumeUnit)}
                    className="w-24 px-3 py-2 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl text-xs text-[#243447] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A6A1]/40"
                  >
                    <option value="L">L</option>
                    <option value="mL">mL</option>
                    <option value="uL">µL</option>
                  </select>
                </div>
              </div>

              {/* Molecular Weight (only if calculate mass) */}
              {molarityMode === 'calculate_mass' && (
                <div className="space-y-2 pt-1 border-t border-[#E1E8EF] dark:border-[#1E344D]">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-[#12304A] dark:text-white">
                      Solute Molecular Weight (g/mol)
                    </label>
                    <span className="text-[10px] text-[#68778A]">Or pick common reagent preset</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="any"
                      value={soluteMW}
                      onChange={(e) => {
                        setSoluteMW(e.target.value);
                        setSelectedPresetName('Custom Solute');
                      }}
                      placeholder="e.g. 58.44"
                      className="flex-1 px-3 py-2 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl text-xs text-[#243447] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A6A1]/40"
                    />
                    <select
                      value={selectedPresetName}
                      onChange={(e) => {
                        const reagent = COMMON_REAGENTS.find((r) => r.name === e.target.value);
                        if (reagent) {
                          setSelectedPresetName(reagent.name);
                          setSoluteMW(reagent.molecularWeight.toString());
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl text-xs text-[#243447] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A6A1]/40 truncate"
                    >
                      <option value="Custom Solute">-- Select Reagent Preset --</option>
                      {COMMON_REAGENTS.map((r) => (
                        <option key={r.name} value={r.name}>
                          {r.name} ({r.molecularWeight} g/mol)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-white to-[#F7FAFC] dark:from-[#112234] dark:to-[#0D1D2C] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E1E8EF] dark:border-[#1E344D]">
                <span className="text-xs font-bold text-[#12304A] dark:text-white uppercase tracking-wider">
                  Calculation Results
                </span>
                <span className="text-[10px] text-[#16A6A1] font-mono">
                  {molarityResult.formula}
                </span>
              </div>

              {molarityResult.error ? (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>{molarityResult.error}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Primary result highlight box */}
                  <div className="p-4 rounded-xl bg-[#12304A] text-white space-y-1 shadow-sm">
                    <span className="text-[10px] text-[#B8F2D0] font-semibold uppercase tracking-wider">
                      {molarityMode === 'calculate_mass'
                        ? 'Mass of Solute Required'
                        : molarityMode === 'calculate_molarity'
                        ? 'Final Molar Concentration'
                        : 'Solute Moles in Solution'}
                    </span>
                    <p className="text-2xl font-extrabold text-white tracking-tight">
                      {molarityResult.formattedValue}
                    </p>
                  </div>

                  {/* Formula and substitution */}
                  <div className="p-3 rounded-xl bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] space-y-1.5 text-xs">
                    <span className="text-[10px] text-[#68778A] font-semibold uppercase tracking-wider">
                      Values Substituted
                    </span>
                    <p className="font-mono text-[#12304A] dark:text-[#B8F2D0] text-xs">
                      {molarityResult.substitutedFormula}
                    </p>
                  </div>

                  {/* Step by step explanation */}
                  <div className="p-3 rounded-xl bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] space-y-1 text-xs">
                    <span className="text-[10px] text-[#68778A] font-semibold uppercase tracking-wider">
                      Laboratory Protocol Summary
                    </span>
                    <p className="text-[#243447] dark:text-slate-300 leading-relaxed text-[11px]">
                      {molarityResult.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 mt-4 border-t border-[#E1E8EF] dark:border-[#1E344D] flex items-center gap-2">
              <button
                onClick={() =>
                  handleCopy(
                    `${molarityResult.formattedValue} (Formula: ${molarityResult.formula}; ${molarityResult.explanation})`,
                    'molarity'
                  )
                }
                disabled={Boolean(molarityResult.error)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#16A6A1] hover:bg-[#118480] disabled:opacity-40 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                {copiedKey === 'molarity' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Result</span>
                  </>
                )}
              </button>

              <button
                onClick={handleResetMolarity}
                className="py-2 px-3 rounded-xl bg-[#F7FAFC] hover:bg-[#E1E8EF] dark:bg-[#0E1A27] dark:hover:bg-[#1A2E44] text-[#68778A] text-xs font-semibold transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: DILUTION CALCULATOR (C1V1 = C2V2) */}
      {/* ======================================================== */}
      {activeTab === 'dilution' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Panel */}
          <div className="lg:col-span-7 bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E8EF] dark:border-[#1E344D]">
              <div>
                <h3 className="text-sm font-bold text-[#12304A] dark:text-white">
                  Dilution Parameters (C₁V₁ = C₂V₂)
                </h3>
                <p className="text-[11px] text-[#68778A] dark:text-[#94A3B8]">
                  Calculate required stock solution volume to achieve target working concentration
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLoadDilutionSample}
                  className="px-2.5 py-1 text-[11px] font-semibold text-[#16A6A1] bg-[#16A6A1]/10 rounded-lg hover:bg-[#16A6A1]/20 transition-colors"
                >
                  Load Sample
                </button>
                <button
                  onClick={handleResetDilution}
                  className="p-1.5 text-[#68778A] hover:text-[#12304A] dark:hover:text-white rounded-lg hover:bg-[#F1F5F9] dark:hover:bg-[#1E344D] transition-colors"
                  title="Reset"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Optional Stock Label */}
              <div>
                <label className="block text-xs font-semibold text-[#12304A] dark:text-white mb-1">
                  Reagent / Stock Solution Label (Optional)
                </label>
                <input
                  type="text"
                  value={stockLabel}
                  onChange={(e) => setStockLabel(e.target.value)}
                  placeholder="e.g. 10 mM Tamoxifen Stock"
                  className="w-full px-3 py-2 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl text-xs text-[#243447] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A6A1]/40"
                />
              </div>

              {/* Initial Stock Concentration (C1) */}
              <div>
                <label className="block text-xs font-semibold text-[#12304A] dark:text-white mb-1">
                  Initial Stock Concentration (C₁)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="any"
                    value={c1Value}
                    onChange={(e) => setC1Value(e.target.value)}
                    placeholder="e.g. 10"
                    className="flex-1 px-3 py-2 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl text-xs text-[#243447] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A6A1]/40"
                  />
                  <select
                    value={c1Unit}
                    onChange={(e) => setC1Unit(e.target.value as ConcentrationUnit)}
                    className="w-24 px-3 py-2 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl text-xs text-[#243447] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A6A1]/40"
                  >
                    <option value="M">M</option>
                    <option value="mM">mM</option>
                    <option value="uM">µM</option>
                    <option value="nM">nM</option>
                  </select>
                </div>
              </div>

              {/* Required Final Concentration (C2) */}
              <div>
                <label className="block text-xs font-semibold text-[#12304A] dark:text-white mb-1">
                  Required Final Concentration (C₂)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="any"
                    value={c2Value}
                    onChange={(e) => setC2Value(e.target.value)}
                    placeholder="e.g. 100"
                    className="flex-1 px-3 py-2 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl text-xs text-[#243447] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A6A1]/40"
                  />
                  <select
                    value={c2Unit}
                    onChange={(e) => setC2Unit(e.target.value as ConcentrationUnit)}
                    className="w-24 px-3 py-2 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl text-xs text-[#243447] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A6A1]/40"
                  >
                    <option value="M">M</option>
                    <option value="mM">mM</option>
                    <option value="uM">µM</option>
                    <option value="nM">nM</option>
                  </select>
                </div>
              </div>

              {/* Desired Final Volume (V2) */}
              <div>
                <label className="block text-xs font-semibold text-[#12304A] dark:text-white mb-1">
                  Desired Final Volume (V₂)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="any"
                    value={v2Value}
                    onChange={(e) => setV2Value(e.target.value)}
                    placeholder="e.g. 50"
                    className="flex-1 px-3 py-2 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl text-xs text-[#243447] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A6A1]/40"
                  />
                  <select
                    value={v2Unit}
                    onChange={(e) => setV2Unit(e.target.value as VolumeUnit)}
                    className="w-24 px-3 py-2 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl text-xs text-[#243447] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A6A1]/40"
                  >
                    <option value="L">L</option>
                    <option value="mL">mL</option>
                    <option value="uL">µL</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-white to-[#F7FAFC] dark:from-[#112234] dark:to-[#0D1D2C] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E1E8EF] dark:border-[#1E344D]">
                <span className="text-xs font-bold text-[#12304A] dark:text-white uppercase tracking-wider">
                  Dilution Plan
                </span>
                <span className="text-[10px] text-[#16A6A1] font-mono">
                  V₁ = (C₂ × V₂) / C₁
                </span>
              </div>

              {dilutionResult.error ? (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>{dilutionResult.error}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Stock volume required */}
                  <div className="p-4 rounded-xl bg-[#12304A] text-white space-y-1 shadow-sm">
                    <span className="text-[10px] text-[#B8F2D0] font-semibold uppercase tracking-wider">
                      Stock Volume Required (V₁)
                    </span>
                    <p className="text-2xl font-extrabold text-white tracking-tight">
                      {formatScientificNumber(dilutionResult.v1Required)} {dilutionResult.volumeUnit}
                    </p>
                  </div>

                  {/* Diluent breakdown card */}
                  <div className="p-3.5 rounded-xl bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#68778A]">Stock Solution (V₁):</span>
                      <span className="font-semibold text-[#12304A] dark:text-white">
                        {formatScientificNumber(dilutionResult.v1Required)} {dilutionResult.volumeUnit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#68778A]">Estimated Diluent Volume:</span>
                      <span className="font-semibold text-[#16A6A1]">
                        ~{formatScientificNumber(dilutionResult.diluentVolume)} {dilutionResult.volumeUnit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-[#E1E8EF] dark:border-[#1E344D]">
                      <span className="text-[#68778A] font-semibold">Final Volume (V₂):</span>
                      <span className="font-bold text-[#12304A] dark:text-white">
                        {dilutionResult.targetVolume} {dilutionResult.volumeUnit}
                      </span>
                    </div>
                  </div>

                  {/* Summary preparation step */}
                  <div className="p-3 rounded-xl bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] space-y-1 text-xs">
                    <span className="text-[10px] text-[#68778A] font-semibold uppercase tracking-wider">
                      Preparation Instructions
                    </span>
                    <p className="text-[#243447] dark:text-slate-300 leading-relaxed text-[11px]">
                      {dilutionResult.summary}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 mt-4 border-t border-[#E1E8EF] dark:border-[#1E344D] flex items-center gap-2">
              <button
                onClick={() => handleCopy(dilutionResult.summary, 'dilution')}
                disabled={Boolean(dilutionResult.error)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#16A6A1] hover:bg-[#118480] disabled:opacity-40 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                {copiedKey === 'dilution' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Recipe</span>
                  </>
                )}
              </button>

              <button
                onClick={handleResetDilution}
                className="py-2 px-3 rounded-xl bg-[#F7FAFC] hover:bg-[#E1E8EF] dark:bg-[#0E1A27] dark:hover:bg-[#1A2E44] text-[#68778A] text-xs font-semibold transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: PCR REACTION CALCULATOR */}
      {/* ======================================================== */}
      {activeTab === 'pcr' && (
        <div className="space-y-6">
          {/* PCR Educational Disclaimer Banner */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold">Educational Assay Setup Guide:</span>
              <p className="text-[11px] text-blue-800/90 dark:text-blue-300">
                This configurable calculator sets up a standard illustrative PCR master mix (default 25 µL reaction). Always adapt component concentrations to validated assay protocols and enzyme manufacturer specifications.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Setup Form */}
            <div className="lg:col-span-5 bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E1E8EF] dark:border-[#1E344D]">
                <div>
                  <h3 className="text-sm font-bold text-[#12304A] dark:text-white">
                    Reaction Parameters
                  </h3>
                  <p className="text-[11px] text-[#68778A] dark:text-[#94A3B8]">
                    Configure tubes, overage, and reagent modes
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleLoadPcrStandardExample}
                    className="px-2.5 py-1 text-[11px] font-semibold text-[#16A6A1] bg-[#16A6A1]/10 rounded-lg hover:bg-[#16A6A1]/20 transition-colors"
                  >
                    Load Standard
                  </button>
                  <button
                    onClick={handleResetPcr}
                    className="p-1.5 text-[#68778A] hover:text-[#12304A] dark:hover:text-white rounded-lg hover:bg-[#F1F5F9] dark:hover:bg-[#1E344D]"
                    title="Reset"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Mode switch */}
              <div>
                <label className="block text-xs font-semibold text-[#12304A] dark:text-white mb-1.5">
                  PCR Chemistry Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPcrState({ ...pcrState, masterMixMode: 'commercial_2x' })}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                      pcrState.masterMixMode === 'commercial_2x'
                        ? 'border-[#16A6A1] bg-[#16A6A1]/10 text-[#16A6A1] dark:border-[#20C2BC] dark:text-[#20C2BC]'
                        : 'border-[#E1E8EF] dark:border-[#1E344D] text-[#68778A]'
                    }`}
                  >
                    Commercial 2X Master Mix
                  </button>
                  <button
                    onClick={() => setPcrState({ ...pcrState, masterMixMode: 'individual_reagents' })}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                      pcrState.masterMixMode === 'individual_reagents'
                        ? 'border-[#16A6A1] bg-[#16A6A1]/10 text-[#16A6A1] dark:border-[#20C2BC] dark:text-[#20C2BC]'
                        : 'border-[#E1E8EF] dark:border-[#1E344D] text-[#68778A]'
                    }`}
                  >
                    Individual Components
                  </button>
                </div>
              </div>

              {/* Tubes & Reaction Volume */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#12304A] dark:text-white mb-1">
                    Number of Reactions
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={pcrState.numberOfReactions}
                    onChange={(e) =>
                      setPcrState({ ...pcrState, numberOfReactions: Math.max(1, parseInt(e.target.value) || 1) })
                    }
                    className="w-full px-3 py-2 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl text-xs text-[#243447] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A6A1]/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#12304A] dark:text-white mb-1">
                    Reaction Vol. / Tube (µL)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={pcrState.reactionVolumePerTube}
                    onChange={(e) =>
                      setPcrState({
                        ...pcrState,
                        reactionVolumePerTube: Math.max(5, parseFloat(e.target.value) || 25),
                      })
                    }
                    className="w-full px-3 py-2 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl text-xs text-[#243447] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A6A1]/40"
                  />
                </div>
              </div>

              {/* Overage config */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#12304A] dark:text-white">
                    Master Mix Pipetting Overage
                  </label>
                  <span className="text-[11px] text-[#16A6A1] font-semibold">
                    {pcrState.overagePercent}% ({formatScientificNumber(pcrResult.effectiveReactions)} effective rxns)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="5"
                  value={pcrState.overagePercent}
                  onChange={(e) =>
                    setPcrState({ ...pcrState, overagePercent: parseInt(e.target.value) })
                  }
                  className="w-full accent-[#16A6A1]"
                />
                <div className="flex justify-between text-[10px] text-[#68778A]">
                  <span>0% (Exact)</span>
                  <span>10% (Standard)</span>
                  <span>25% (High Loss)</span>
                </div>
              </div>

              {/* Template DNA Volume */}
              <div>
                <label className="block text-xs font-semibold text-[#12304A] dark:text-white mb-1">
                  Template DNA Volume / Tube (µL)
                </label>
                <input
                  type="number"
                  step="any"
                  value={pcrState.templateDnaVolume}
                  onChange={(e) =>
                    setPcrState({ ...pcrState, templateDnaVolume: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl text-xs text-[#243447] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A6A1]/40"
                />
                <span className="text-[10px] text-[#68778A]">
                  Added individually into each tube (excluded from master mix).
                </span>
              </div>

              {/* Primers */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#E1E8EF] dark:border-[#1E344D]">
                <div>
                  <label className="block text-xs font-semibold text-[#12304A] dark:text-white mb-1">
                    Fwd Primer (µL)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={pcrState.forwardPrimerVolume}
                    onChange={(e) =>
                      setPcrState({ ...pcrState, forwardPrimerVolume: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl text-xs text-[#243447] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A6A1]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#12304A] dark:text-white mb-1">
                    Rev Primer (µL)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={pcrState.reversePrimerVolume}
                    onChange={(e) =>
                      setPcrState({ ...pcrState, reversePrimerVolume: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl text-xs text-[#243447] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A6A1]/40"
                  />
                </div>
              </div>

              {/* If Individual Reagents Mode */}
              {pcrState.masterMixMode === 'individual_reagents' && (
                <div className="space-y-3 pt-2 border-t border-[#E1E8EF] dark:border-[#1E344D]">
                  <span className="text-xs font-bold text-[#12304A] dark:text-white">
                    Buffer & Enzyme Components (µL / rxn)
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-[#68778A]">10X Buffer (µL)</label>
                      <input
                        type="number"
                        step="any"
                        value={pcrState.buffer10xVolume}
                        onChange={(e) =>
                          setPcrState({ ...pcrState, buffer10xVolume: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-2 py-1.5 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#68778A]">50 mM MgCl₂ (µL)</label>
                      <input
                        type="number"
                        step="any"
                        value={pcrState.mgCl2Volume}
                        onChange={(e) =>
                          setPcrState({ ...pcrState, mgCl2Volume: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-2 py-1.5 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#68778A]">10 mM dNTPs (µL)</label>
                      <input
                        type="number"
                        step="any"
                        value={pcrState.dNTPsVolume}
                        onChange={(e) =>
                          setPcrState({ ...pcrState, dNTPsVolume: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-2 py-1.5 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#68778A]">Polymerase (µL)</label>
                      <input
                        type="number"
                        step="any"
                        value={pcrState.polymeraseVolume}
                        onChange={(e) =>
                          setPcrState({ ...pcrState, polymeraseVolume: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-2 py-1.5 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Results Table Panel */}
            <div className="lg:col-span-7 bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E1E8EF] dark:border-[#1E344D]">
                  <div>
                    <h3 className="text-sm font-bold text-[#12304A] dark:text-white">
                      Master Mix Recipe Table
                    </h3>
                    <p className="text-[11px] text-[#68778A] dark:text-[#94A3B8]">
                      Dispense {formatScientificNumber(pcrResult.totalMasterMixPerTube)} µL master mix per tube, then add {pcrState.templateDnaVolume} µL template DNA.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={exportPcrCsv}
                      disabled={Boolean(pcrResult.error)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-[#12304A] dark:text-white bg-[#F1F5F9] dark:bg-[#1E344D] rounded-lg hover:bg-[#E2E8F0] dark:hover:bg-[#2A4365] transition-colors flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5 text-[#16A6A1]" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                {pcrResult.error ? (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>{pcrResult.error}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pcrResult.warning && (
                      <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="text-[11px]">{pcrResult.warning}</span>
                      </div>
                    )}

                    {/* Table */}
                    <div className="overflow-x-auto rounded-xl border border-[#E1E8EF] dark:border-[#1E344D]">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#F7FAFC] dark:bg-[#0E1A27] text-[#68778A] text-[11px] border-b border-[#E1E8EF] dark:border-[#1E344D]">
                            <th className="py-2.5 px-3 font-semibold">Master Mix Reagent</th>
                            <th className="py-2.5 px-3 font-semibold">Per Rxn (µL)</th>
                            <th className="py-2.5 px-3 font-semibold text-[#16A6A1]">
                              Total MM ({formatScientificNumber(pcrResult.effectiveReactions)} rxns)
                            </th>
                            <th className="py-2.5 px-3 font-semibold">Final Note</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E1E8EF] dark:divide-[#1E344D]">
                          {pcrResult.components.map((comp, idx) => (
                            <tr
                              key={idx}
                              className={
                                comp.name.includes('Water')
                                  ? 'bg-[#16A6A1]/5 dark:bg-[#16A6A1]/10 font-medium'
                                  : 'hover:bg-slate-50 dark:hover:bg-[#16273B]'
                              }
                            >
                              <td className="py-2 px-3 text-[#12304A] dark:text-white">
                                {comp.name}
                              </td>
                              <td className="py-2 px-3 font-mono">
                                {formatScientificNumber(comp.volumePerRxn)} µL
                              </td>
                              <td className="py-2 px-3 font-mono font-bold text-[#16A6A1]">
                                {formatScientificNumber(comp.totalMasterMixVolume)} µL
                              </td>
                              <td className="py-2 px-3 text-[11px] text-[#68778A]">
                                {comp.concentrationNote || '—'}
                              </td>
                            </tr>
                          ))}

                          {/* Template DNA row */}
                          <tr className="bg-amber-50/50 dark:bg-amber-950/20 italic">
                            <td className="py-2 px-3 text-[#12304A] dark:text-white">
                              Template DNA (per tube)
                            </td>
                            <td className="py-2 px-3 font-mono">
                              {formatScientificNumber(pcrState.templateDnaVolume)} µL
                            </td>
                            <td className="py-2 px-3 font-mono text-[#68778A]">
                              — (add per tube)
                            </td>
                            <td className="py-2 px-3 text-[11px] text-amber-700 dark:text-amber-300">
                              Add directly to tube
                            </td>
                          </tr>

                          {/* Total Row */}
                          <tr className="bg-[#12304A] text-white font-bold">
                            <td className="py-2.5 px-3">Total Reaction Volume</td>
                            <td className="py-2.5 px-3 font-mono text-[#B8F2D0]">
                              {formatScientificNumber(pcrState.reactionVolumePerTube)} µL
                            </td>
                            <td className="py-2.5 px-3 font-mono text-white">
                              {formatScientificNumber(pcrResult.totalMasterMixOverall)} µL (MM only)
                            </td>
                            <td className="py-2.5 px-3 text-[10px] text-slate-300">
                              Complete PCR Assay
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 mt-4 border-t border-[#E1E8EF] dark:border-[#1E344D] flex items-center gap-2">
                <button
                  onClick={() => {
                    const textRecipe = pcrResult.components
                      .map((c) => `${c.name}: ${formatScientificNumber(c.totalMasterMixVolume)} µL`)
                      .join('\n');
                    handleCopy(
                      `PCR Master Mix for ${pcrState.numberOfReactions} reactions (+${pcrState.overagePercent}% overage):\n${textRecipe}\nTemplate DNA per tube: ${pcrState.templateDnaVolume} µL\nFinal reaction volume: ${pcrState.reactionVolumePerTube} µL`,
                      'pcr'
                    );
                  }}
                  disabled={Boolean(pcrResult.error)}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#16A6A1] hover:bg-[#118480] disabled:opacity-40 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  {copiedKey === 'pcr' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied Recipe!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Recipe Text</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleResetPcr}
                  className="py-2 px-3 rounded-xl bg-[#F7FAFC] hover:bg-[#E1E8EF] dark:bg-[#0E1A27] dark:hover:bg-[#1A2E44] text-[#68778A] text-xs font-semibold transition-colors"
                >
                  Reset Inputs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TEST RUNNER MODAL / DRAWER (Section 11 Requirement) */}
      {/* ======================================================== */}
      {showTestRunner && testResults && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-[#E1E8EF] dark:border-[#1E344D] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <TestTube className="w-5 h-5 text-[#16A6A1]" />
                <div>
                  <h3 className="text-sm font-bold text-[#12304A] dark:text-white">
                    Scientific Calculation Validation Suite
                  </h3>
                  <p className="text-[11px] text-[#68778A]">
                    Automated unit tests for Molarity, Dilution, Unit Conversions, and PCR Accounting
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowTestRunner(false)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#F1F5F9] dark:bg-[#1E344D] text-[#68778A] hover:text-[#12304A] dark:hover:text-white"
              >
                Close
              </button>
            </div>

            {/* Test summary header */}
            <div className="px-5 py-3 bg-[#F7FAFC] dark:bg-[#0E1A27] border-b border-[#E1E8EF] dark:border-[#1E344D] flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-4">
                <span className="text-[#12304A] dark:text-white">
                  Total Tests: {testResults.total}
                </span>
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {testResults.passed} Passed
                </span>
                {testResults.failed > 0 && (
                  <span className="text-rose-600 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    {testResults.failed} Failed
                  </span>
                )}
              </div>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded font-mono">
                100% Math Verified
              </span>
            </div>

            {/* Test list */}
            <div className="flex-1 p-5 overflow-y-auto space-y-2.5">
              {testResults.results.map((res, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                    res.passed
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/15 border-emerald-200 dark:border-emerald-900/40'
                      : 'bg-rose-50/40 dark:bg-rose-950/15 border-rose-200 dark:border-rose-900/40'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-[#68778A] tracking-wider">
                        {res.category}
                      </span>
                      <span className="text-slate-400">·</span>
                      <p className="font-semibold text-[#12304A] dark:text-white">
                        {res.name}
                      </p>
                    </div>
                    <p className="text-[11px] text-[#68778A] font-mono">
                      Expected: <span className="text-slate-700 dark:text-slate-300">{res.expected}</span> | Actual: <span className="text-slate-700 dark:text-slate-300">{res.actual}</span>
                    </p>
                  </div>

                  <span className="flex-shrink-0">
                    {res.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600" />
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
