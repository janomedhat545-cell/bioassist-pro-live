import React from 'react';
import {
  Settings,
  Moon,
  Sun,
  ShieldCheck,
  Trash2,
  Download,
  Info,
  CheckCircle2,
  HardDrive,
  Cpu,
} from 'lucide-react';
import { UserPreferences, VolumeUnit, ConcentrationUnit } from '../../types';

interface SettingsPageProps {
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
  onClearAllData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  preferences,
  onUpdatePreferences,
  onClearAllData,
}) => {
  const handleExportData = () => {
    const data = {
      preferences,
      chatConversations: localStorage.getItem('bioassist_chat_conversations'),
      savedBookmarks: localStorage.getItem('bioassist_saved_topics'),
      savedAnswers: localStorage.getItem('bioassist_saved_answers'),
      activityLog: localStorage.getItem('bioassist_activity_log'),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BioAssist_Pro_Data_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#12304A] dark:text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-[#16A6A1]" />
          <span>Workspace Settings</span>
        </h2>
        <p className="text-xs text-[#68778A] dark:text-[#94A3B8] mt-1">
          Customize interface themes, laboratory calculation units, and data privacy options.
        </p>
      </div>

      <div className="space-y-5">
        {/* 1. Theme and Display */}
        <div className="bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-[#12304A] dark:text-white uppercase tracking-wider">
            Appearance & Theme
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Light Mode', icon: <Sun className="w-4 h-4 text-amber-500" /> },
              { id: 'dark', label: 'Dark Mode', icon: <Moon className="w-4 h-4 text-indigo-400" /> },
              { id: 'system', label: 'System Default', icon: <Cpu className="w-4 h-4 text-[#16A6A1]" /> },
            ].map((th) => (
              <button
                key={th.id}
                onClick={() => onUpdatePreferences({ theme: th.id as any })}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all ${
                  preferences.theme === th.id
                    ? 'border-[#16A6A1] bg-[#16A6A1]/10 text-[#16A6A1] dark:border-[#20C2BC] dark:text-[#20C2BC]'
                    : 'border-[#E1E8EF] dark:border-[#1E344D] text-[#68778A] hover:border-slate-300'
                }`}
              >
                {th.icon}
                <span>{th.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Scientific Units Display Defaults */}
        <div className="bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-[#12304A] dark:text-white uppercase tracking-wider">
            Default Scientific Units
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#12304A] dark:text-white mb-1.5">
                Default Laboratory Volume Unit
              </label>
              <select
                value={preferences.defaultVolumeUnit}
                onChange={(e) => onUpdatePreferences({ defaultVolumeUnit: e.target.value as VolumeUnit })}
                className="w-full px-3 py-2 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl text-xs text-[#243447] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A6A1]/40"
              >
                <option value="uL">Microliters (µL) - Micro-scale</option>
                <option value="mL">Milliliters (mL) - Bench scale</option>
                <option value="L">Liters (L) - Preparative scale</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#12304A] dark:text-white mb-1.5">
                Default Concentration Unit
              </label>
              <select
                value={preferences.defaultConcUnit}
                onChange={(e) => onUpdatePreferences({ defaultConcUnit: e.target.value as ConcentrationUnit })}
                className="w-full px-3 py-2 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl text-xs text-[#243447] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A6A1]/40"
              >
                <option value="uM">Micromolar (µM) - Primer/probe scale</option>
                <option value="mM">Millimolar (mM) - Reagent scale</option>
                <option value="M">Molar (M) - Buffer salt stock scale</option>
                <option value="nM">Nanomolar (nM) - Trace assay scale</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Data & Privacy Management */}
        <div className="bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#12304A] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-[#16A6A1]" />
              <span>Data, Storage & Privacy</span>
            </h3>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
              Local-First Persistence
            </span>
          </div>

          <p className="text-xs text-[#68778A] dark:text-[#94A3B8] leading-relaxed">
            BioAssist Pro saves your bookmarks, preferences, and calculator logs strictly inside your browser's local client storage (<code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[11px]">localStorage</code>). No proprietary research data or laboratory calculations are stored in external cloud databases.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportData}
              className="px-3.5 py-2 rounded-xl bg-[#F7FAFC] hover:bg-[#E1E8EF] dark:bg-[#0E1A27] dark:hover:bg-[#1A2E44] border border-[#E1E8EF] dark:border-[#1E344D] text-xs font-semibold text-[#12304A] dark:text-white transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#16A6A1]" />
              <span>Export Workspace Data (JSON)</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset all stored local bookmarks, chats, and activity?')) {
                  onClearAllData();
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs font-semibold text-rose-700 dark:text-rose-300 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Local Data</span>
            </button>
          </div>
        </div>

        {/* 4. About BioAssist Pro & Scientific Disclaimer */}
        <div className="bg-[#12304A] text-white rounded-2xl p-5 border border-[#16A6A1]/20 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#B8F2D0]" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                About BioAssist Pro · Scientific Mission
              </h4>
            </div>
            <span className="text-[10px] text-slate-300 font-mono">v1.0.0</span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed">
            BioAssist Pro is designed to support biotechnology students, laboratory trainees, postgraduate researchers, and oncology scientists working in Red Biotechnology, with a particular focus on cancer research, genetic engineering, CRISPR technology, and molecular biology.
          </p>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 space-y-1">
            <span className="font-semibold text-[#B8F2D0] block">Educational & Research Disclaimer:</span>
            <p>
              Mathematical formulas, master mix recipes, and AI guidance provided are for educational and exploratory laboratory research planning. Always verify volumes and reagent concentrations against validated Standard Operating Procedures (SOPs), institutional biosafety guidelines, and manufacturer documentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
