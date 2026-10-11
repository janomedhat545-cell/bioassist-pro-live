import React from 'react';
import {
  Calculator,
  Dna,
  BotMessageSquare,
  ArrowRight,
  ShieldCheck,
  Microscope,
  Binary,
  Lightbulb,
  BookmarkCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { PageId, ActivityItem, ReferenceTopic } from '../../types';
import { getTodayTip } from '../../data/tipsData';
import { REFERENCE_TOPICS } from '../../data/referenceData';

interface LandingPageProps {
  onNavigate: (page: PageId, extra?: { topicId?: string; prompt?: string }) => void;
  recentActivities: ActivityItem[];
  savedTopics: ReferenceTopic[];
  onSelectTopic: (topic: ReferenceTopic) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  recentActivities,
  savedTopics,
  onSelectTopic,
}) => {
  const tipOfTheDay = getTodayTip();
  const linkedTopic = REFERENCE_TOPICS.find((t) => t.id === tipOfTheDay.referenceTopicId);

  const handleOpenTipReference = () => {
    if (linkedTopic) {
      onSelectTopic(linkedTopic);
      onNavigate('reference');
    } else {
      onNavigate('reference');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* A. Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#12304A] via-[#10293F] to-[#0A1C2C] text-white p-6 sm:p-8 md:p-10 shadow-lg border border-[#16A6A1]/20">
        {/* Subtle background molecular grid accent */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#B8F2D0_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16A6A1]/20 text-[#B8F2D0] text-xs font-semibold backdrop-blur-xs border border-[#16A6A1]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#B8F2D0]" />
              <span>BioAssist Pro · Red Biotechnology Workspace</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Welcome to <span className="text-[#B8F2D0]">BioAssist Pro</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-200 font-medium leading-snug">
              Your intelligent biotechnology workspace for molecular biology, cancer research, genetic engineering, and laboratory calculations.
            </p>

            <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed">
              Explore complex biological concepts, calculate laboratory concentrations, review genetic engineering fundamentals, and get AI-assisted explanations—all in one scientific workspace.
            </p>

            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('calculator')}
                className="px-5 py-2.5 rounded-xl bg-[#16A6A1] hover:bg-[#118480] text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2 group"
              >
                <Calculator className="w-4 h-4" />
                <span>Explore Lab Tools</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={() => onNavigate('chat')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs border border-white/20 transition-all flex items-center gap-2"
              >
                <BotMessageSquare className="w-4 h-4 text-[#B8F2D0]" />
                <span>Ask AI Assistant</span>
              </button>

              <button
                onClick={() => onNavigate('reference')}
                className="px-4 py-2.5 rounded-xl text-slate-300 hover:text-white text-xs font-semibold hover:bg-white/5 transition-all flex items-center gap-1.5"
              >
                <Dna className="w-4 h-4 text-[#16A6A1]" />
                <span>Explore CRISPR Guide</span>
              </button>
            </div>
          </div>

          {/* Hero Illustration: Scientific SVG Artwork */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-[320px] aspect-square rounded-2xl bg-[#0D2336]/60 border border-white/10 p-4 shadow-inner flex items-center justify-center">
              <svg
                viewBox="0 0 300 300"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background cell membrane aura */}
                <circle cx="150" cy="150" r="120" stroke="#16A6A1" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                <circle cx="150" cy="150" r="95" stroke="#B8F2D0" strokeWidth="1" opacity="0.2" />

                {/* Molecular Nodes */}
                <g opacity="0.4">
                  <line x1="50" y1="80" x2="100" y2="100" stroke="#B8F2D0" strokeWidth="1" />
                  <line x1="100" y1="100" x2="120" y2="60" stroke="#B8F2D0" strokeWidth="1" />
                  <line x1="220" y1="200" x2="250" y2="240" stroke="#16A6A1" strokeWidth="1" />
                  <circle cx="50" cy="80" r="3" fill="#B8F2D0" />
                  <circle cx="100" cy="100" r="4" fill="#16A6A1" />
                  <circle cx="120" cy="60" r="3" fill="#FFFFFF" />
                  <circle cx="220" cy="200" r="3.5" fill="#16A6A1" />
                  <circle cx="250" cy="240" r="3" fill="#B8F2D0" />
                </g>

                {/* Central DNA Double Helix Strands */}
                <path
                  d="M100 40 C140 90, 160 110, 200 150 C160 190, 140 210, 100 260"
                  stroke="#16A6A1"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M200 40 C160 90, 140 110, 100 150 C140 190, 160 210, 200 260"
                  stroke="#B8F2D0"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Base pairs with chemical hydrogen bond dashes */}
                <line x1="110" y1="60" x2="190" y2="60" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
                <line x1="125" y1="90" x2="175" y2="90" stroke="#B8F2D0" strokeWidth="2.5" opacity="0.9" />
                <line x1="140" y1="120" x2="160" y2="120" stroke="#FFFFFF" strokeWidth="2" opacity="0.8" />
                <line x1="145" y1="150" x2="155" y2="150" stroke="#16A6A1" strokeWidth="3" />
                <line x1="140" y1="180" x2="160" y2="180" stroke="#FFFFFF" strokeWidth="2" opacity="0.8" />
                <line x1="125" y1="210" x2="175" y2="210" stroke="#B8F2D0" strokeWidth="2.5" opacity="0.9" />
                <line x1="110" y1="240" x2="190" y2="240" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />

                {/* CRISPR Molecular Scissor overlay badge */}
                <g transform="translate(130, 130)">
                  <rect x="-10" y="-10" width="60" height="40" rx="8" fill="#12304A" stroke="#16A6A1" strokeWidth="1.5" />
                  <text x="20" y="15" fill="#B8F2D0" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    Cas9
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* B. Quick-access Feature Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#12304A] dark:text-white">
            Core Scientific Modules
          </h2>
          <span className="text-xs text-[#68778A] dark:text-[#94A3B8]">
            3 integrated tools
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Quick Lab Calculator */}
          <div className="bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#16A6A1]/10 dark:bg-[#16A6A1]/20 text-[#16A6A1] flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#12304A] dark:text-white">
                  Quick Lab Calculator
                </h3>
                <p className="text-xs text-[#68778A] dark:text-[#94A3B8] mt-1 line-clamp-2">
                  Calculate molarity, prepare dilution plans, and solve common laboratory concentration problems.
                </p>
              </div>

              {/* Clean unboxed metadata discipline */}
              <div className="flex items-center gap-2 text-[11px] text-[#16A6A1] dark:text-[#20C2BC] font-medium pt-1">
                <span>Molarity</span>
                <span aria-hidden="true" className="text-[#68778A]">·</span>
                <span>C₁V₁ = C₂V₂</span>
                <span aria-hidden="true" className="text-[#68778A]">·</span>
                <span>PCR Setup</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('calculator')}
              className="mt-5 w-full py-2 px-3 rounded-xl bg-[#F7FAFC] hover:bg-[#E1E8EF] dark:bg-[#0E1A27] dark:hover:bg-[#1A2E44] text-[#12304A] dark:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Open Calculator</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: CRISPR & Genetic Engineering */}
          <div className="bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#12304A]/10 dark:bg-white/10 text-[#12304A] dark:text-[#B8F2D0] flex items-center justify-center">
                <Dna className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#12304A] dark:text-white">
                  CRISPR & Genetic Engineering
                </h3>
                <p className="text-xs text-[#68778A] dark:text-[#94A3B8] mt-1 line-clamp-2">
                  Explore CRISPR-Cas systems, DNA editing concepts, gene expression, and genetic engineering terminology.
                </p>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#16A6A1] dark:text-[#20C2BC] font-medium pt-1">
                <span>CRISPR-Cas9</span>
                <span aria-hidden="true" className="text-[#68778A]">·</span>
                <span>DNA Repair</span>
                <span aria-hidden="true" className="text-[#68778A]">·</span>
                <span>Gene Editing</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('reference')}
              className="mt-5 w-full py-2 px-3 rounded-xl bg-[#F7FAFC] hover:bg-[#E1E8EF] dark:bg-[#0E1A27] dark:hover:bg-[#1A2E44] text-[#12304A] dark:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Open Reference Guide</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: AI Lab Assistant */}
          <div className="bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#B8F2D0]/30 text-[#12304A] dark:text-[#B8F2D0] flex items-center justify-center">
                <BotMessageSquare className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#12304A] dark:text-white">
                  AI Lab Assistant
                </h3>
                <p className="text-xs text-[#68778A] dark:text-[#94A3B8] mt-1 line-clamp-2">
                  Ask biotechnology questions and receive structured, educational explanations of molecular biology concepts and laboratory methods.
                </p>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#16A6A1] dark:text-[#20C2BC] font-medium pt-1">
                <span>Protocol Guidance</span>
                <span aria-hidden="true" className="text-[#68778A]">·</span>
                <span>Molecular Biology</span>
                <span aria-hidden="true" className="text-[#68778A]">·</span>
                <span>Learning</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('chat')}
              className="mt-5 w-full py-2 px-3 rounded-xl bg-[#F7FAFC] hover:bg-[#E1E8EF] dark:bg-[#0E1A27] dark:hover:bg-[#1A2E44] text-[#12304A] dark:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Start Conversation</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* C. Research Topic Explorer: Explore Red Biotechnology */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#12304A] dark:text-white">
              Explore Red Biotechnology
            </h2>
            <p className="text-xs text-[#68778A] dark:text-[#94A3B8]">
              Biomedical sciences, cancer oncology, and genome engineering
            </p>
          </div>
          <button
            onClick={() => onNavigate('reference')}
            className="text-xs text-[#16A6A1] hover:underline font-semibold"
          >
            View all 24 topics →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Topic 1: Cancer Biology */}
          <button
            onClick={() => {
              const t = REFERENCE_TOPICS.find((i) => i.id === 'oncogenes-tumor-suppressors');
              if (t) onSelectTopic(t);
              onNavigate('reference');
            }}
            className="text-left p-4 rounded-xl bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] hover:border-[#16A6A1] dark:hover:border-[#16A6A1] transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2.5">
              <Microscope className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-[#12304A] dark:text-white group-hover:text-[#16A6A1] transition-colors">
              Cancer Biology
            </h4>
            <p className="text-[11px] text-[#68778A] dark:text-[#94A3B8] mt-1 line-clamp-2">
              Oncogenes, tumor suppressors, apoptosis evasion, and molecular oncology.
            </p>
          </button>

          {/* Topic 2: Molecular Biology */}
          <button
            onClick={() => {
              const t = REFERENCE_TOPICS.find((i) => i.id === 'pcr');
              if (t) onSelectTopic(t);
              onNavigate('reference');
            }}
            className="text-left p-4 rounded-xl bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] hover:border-[#16A6A1] dark:hover:border-[#16A6A1] transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2.5">
              <Binary className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-[#12304A] dark:text-white group-hover:text-[#16A6A1] transition-colors">
              Molecular Biology
            </h4>
            <p className="text-[11px] text-[#68778A] dark:text-[#94A3B8] mt-1 line-clamp-2">
              DNA replication, transcription, PCR amplification, and electrophoresis.
            </p>
          </button>

          {/* Topic 3: Genetic Engineering */}
          <button
            onClick={() => {
              const t = REFERENCE_TOPICS.find((i) => i.id === 'recombinant-dna');
              if (t) onSelectTopic(t);
              onNavigate('reference');
            }}
            className="text-left p-4 rounded-xl bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] hover:border-[#16A6A1] dark:hover:border-[#16A6A1] transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5">
              <Dna className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-[#12304A] dark:text-white group-hover:text-[#16A6A1] transition-colors">
              Genetic Engineering
            </h4>
            <p className="text-[11px] text-[#68778A] dark:text-[#94A3B8] mt-1 line-clamp-2">
              Recombinant DNA, plasmids, cloning vectors, and gene transfer methods.
            </p>
          </button>

          {/* Topic 4: CRISPR Technology */}
          <button
            onClick={() => {
              const t = REFERENCE_TOPICS.find((i) => i.id === 'crispr-cas9');
              if (t) onSelectTopic(t);
              onNavigate('reference');
            }}
            className="text-left p-4 rounded-xl bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] hover:border-[#16A6A1] dark:hover:border-[#16A6A1] transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-2.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-[#12304A] dark:text-white group-hover:text-[#16A6A1] transition-colors">
              CRISPR Technology
            </h4>
            <p className="text-[11px] text-[#68778A] dark:text-[#94A3B8] mt-1 line-clamp-2">
              Guide RNA, Cas9 cleavage, DNA repair pathways, and specificity.
            </p>
          </button>
        </div>
      </section>

      {/* Grid: E. Tip of the Day & D. Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* E. Scientific Tip of the Day */}
        <div className="lg:col-span-5 bg-gradient-to-br from-white to-[#F7FAFC] dark:from-[#112234] dark:to-[#0D1D2C] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#12304A] dark:text-white">
              <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>Scientific Tip of the Day</span>
            </div>
            <span className="text-[10px] text-[#68778A] font-medium">
              {tipOfTheDay.category}
            </span>
          </div>

          <p className="text-xs text-[#243447] dark:text-slate-200 leading-relaxed font-medium">
            "{tipOfTheDay.fact}"
          </p>

          <div className="pt-2 flex items-center justify-between border-t border-[#E1E8EF] dark:border-[#1E344D] text-[11px]">
            <span className="text-[#68778A] text-[10px] italic">
              Source: {tipOfTheDay.sourceNote}
            </span>
            <button
              onClick={handleOpenTipReference}
              className="text-[#16A6A1] font-semibold hover:underline flex items-center gap-1"
            >
              <span>Learn more</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* D. Recent Activity Section */}
        <div className="lg:col-span-7 bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#12304A] dark:text-white">
              Recent Workspace Activity
            </h3>
            {recentActivities.length > 0 && (
              <button
                onClick={() => onNavigate('activity')}
                className="text-[11px] text-[#16A6A1] font-semibold hover:underline"
              >
                View full history ({recentActivities.length})
              </button>
            )}
          </div>

          {recentActivities.length === 0 ? (
            <div className="py-6 text-center space-y-1">
              <p className="text-xs font-semibold text-[#12304A] dark:text-white">
                Your research workspace is ready.
              </p>
              <p className="text-[11px] text-[#68778A] dark:text-[#94A3B8]">
                Start using a tool or save a reference to see it here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentActivities.slice(0, 3).map((act) => (
                <div
                  key={act.id}
                  onClick={() => onNavigate(act.linkPage)}
                  className="p-2.5 rounded-xl bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] flex items-center justify-between hover:bg-[#EDF2F7] dark:hover:bg-[#1A2E44] transition-colors cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[#16A6A1]">
                      {act.type === 'calculator' && <Calculator className="w-3.5 h-3.5" />}
                      {act.type === 'reference' && <Dna className="w-3.5 h-3.5" />}
                      {act.type === 'chat' && <BotMessageSquare className="w-3.5 h-3.5" />}
                      {act.type === 'bookmark' && <BookmarkCheck className="w-3.5 h-3.5" />}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#12304A] dark:text-white truncate">
                        {act.title}
                      </p>
                      <p className="text-[10px] text-[#68778A] dark:text-[#94A3B8] truncate">
                        {act.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#68778A] flex-shrink-0 ml-2">
                    {act.timestamp}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
