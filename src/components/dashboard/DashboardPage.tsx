import React from 'react';
import {
  Calculator,
  Dna,
  BotMessageSquare,
  Bookmark,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  FlaskConical,
  Activity,
  History,
} from 'lucide-react';
import { PageId, ActivityItem, ReferenceTopic } from '../../types';
import { REFERENCE_TOPICS } from '../../data/referenceData';

interface DashboardPageProps {
  onNavigate: (page: PageId, extra?: { topicId?: string; prompt?: string }) => void;
  savedTopicIds: Set<string>;
  recentActivities: ActivityItem[];
  onSelectTopic: (topic: ReferenceTopic) => void;
  onClearActivities: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  savedTopicIds,
  recentActivities,
  onSelectTopic,
  onClearActivities,
}) => {
  // Real stats calculation
  const calculationsCount = recentActivities.filter((a) => a.type === 'calculator').length;
  const queriesCount = recentActivities.filter((a) => a.type === 'chat').length;
  const bookmarksCount = savedTopicIds.size;

  // Curated recommended topics
  const recommendedTopics = REFERENCE_TOPICS.filter((t) =>
    ['crispr-cas9', 'base-editing', 'pcr', 'oncogenes-tumor-suppressors'].includes(t.id)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Welcome Panel */}
      <div className="rounded-2xl bg-gradient-to-br from-[#12304A] via-[#10293F] to-[#0A1C2C] text-white p-6 shadow-md border border-[#16A6A1]/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#B8F2D0]">
              <Sparkles className="w-4 h-4 text-[#B8F2D0]" />
              <span>BioAssist Pro Dashboard</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Welcome back to your research workspace.
            </h2>
            <p className="text-xs text-slate-300">
              Continue learning, review your saved references, or start a new calculation.
            </p>
          </div>

          <button
            onClick={() => onNavigate('calculator')}
            className="px-4 py-2 rounded-xl bg-[#16A6A1] hover:bg-[#118480] text-white text-xs font-semibold shadow-xs transition-all self-start sm:self-auto flex items-center gap-1.5"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Launch Calculator</span>
          </button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-[#12304A] dark:text-white uppercase tracking-wider">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            onClick={() => onNavigate('calculator')}
            className="p-3.5 rounded-xl bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] hover:border-[#16A6A1] dark:hover:border-[#16A6A1] transition-all text-left shadow-2xs group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#16A6A1]/10 text-[#16A6A1] flex items-center justify-center mb-2">
              <Calculator className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs font-bold text-[#12304A] dark:text-white group-hover:text-[#16A6A1] transition-colors">
              Calculate Molarity
            </p>
            <span className="text-[10px] text-[#68778A]">M = n / V or mass</span>
          </button>

          <button
            onClick={() => onNavigate('calculator')}
            className="p-3.5 rounded-xl bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] hover:border-[#16A6A1] dark:hover:border-[#16A6A1] transition-all text-left shadow-2xs group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#16A6A1]/10 text-[#16A6A1] flex items-center justify-center mb-2">
              <FlaskConical className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs font-bold text-[#12304A] dark:text-white group-hover:text-[#16A6A1] transition-colors">
              Calculate Dilution
            </p>
            <span className="text-[10px] text-[#68778A]">C₁V₁ = C₂V₂</span>
          </button>

          <button
            onClick={() => onNavigate('calculator')}
            className="p-3.5 rounded-xl bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] hover:border-[#16A6A1] dark:hover:border-[#16A6A1] transition-all text-left shadow-2xs group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#16A6A1]/10 text-[#16A6A1] flex items-center justify-center mb-2">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs font-bold text-[#12304A] dark:text-white group-hover:text-[#16A6A1] transition-colors">
              Build PCR Reaction
            </p>
            <span className="text-[10px] text-[#68778A]">Master mix setup</span>
          </button>

          <button
            onClick={() => onNavigate('reference')}
            className="p-3.5 rounded-xl bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] hover:border-[#16A6A1] dark:hover:border-[#16A6A1] transition-all text-left shadow-2xs group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#12304A]/10 dark:bg-white/10 text-[#12304A] dark:text-[#B8F2D0] flex items-center justify-center mb-2">
              <Dna className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs font-bold text-[#12304A] dark:text-white group-hover:text-[#16A6A1] transition-colors">
              Explore CRISPR
            </p>
            <span className="text-[10px] text-[#68778A]">Reference library</span>
          </button>

          <button
            onClick={() => onNavigate('chat')}
            className="p-3.5 rounded-xl bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] hover:border-[#16A6A1] dark:hover:border-[#16A6A1] transition-all text-left shadow-2xs group col-span-2 sm:col-span-1"
          >
            <div className="w-7 h-7 rounded-lg bg-[#B8F2D0]/30 text-[#12304A] dark:text-[#B8F2D0] flex items-center justify-center mb-2">
              <BotMessageSquare className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs font-bold text-[#12304A] dark:text-white group-hover:text-[#16A6A1] transition-colors">
              Ask BioAssist AI
            </p>
            <span className="text-[10px] text-[#68778A]">Protocol insights</span>
          </button>
        </div>
      </div>

      {/* Learning Progress & Metric Cards (Real User Data Only) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-[#16A6A1] flex items-center justify-center flex-shrink-0">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-bold text-[#12304A] dark:text-white">
              {bookmarksCount}
            </p>
            <p className="text-xs text-[#68778A] dark:text-[#94A3B8]">
              Saved Reference Topics
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-bold text-[#12304A] dark:text-white">
              {calculationsCount}
            </p>
            <p className="text-xs text-[#68778A] dark:text-[#94A3B8]">
              Calculations Recorded
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <BotMessageSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-bold text-[#12304A] dark:text-white">
              {queriesCount}
            </p>
            <p className="text-xs text-[#68778A] dark:text-[#94A3B8]">
              AI Discussions Initiated
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Recommended Topics & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recommended Educational Topics */}
        <div className="lg:col-span-7 bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#12304A] dark:text-white uppercase tracking-wider">
              Recommended Educational Topics
            </h3>
            <button
              onClick={() => onNavigate('reference')}
              className="text-xs text-[#16A6A1] font-semibold hover:underline"
            >
              Browse all 24 →
            </button>
          </div>

          <div className="space-y-2.5">
            {recommendedTopics.map((top) => (
              <div
                key={top.id}
                onClick={() => {
                  onSelectTopic(top);
                  onNavigate('reference');
                }}
                className="p-3 rounded-xl bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] hover:border-[#16A6A1] dark:hover:border-[#16A6A1] cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="space-y-0.5 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#12304A] dark:text-white">
                      {top.title}
                    </span>
                    <span className="text-[10px] text-[#16A6A1] font-medium">
                      {top.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#68778A] dark:text-[#94A3B8] truncate">
                    {top.shortDefinition}
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#68778A] flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Real Recent Activity */}
        <div className="lg:col-span-5 bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#12304A] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-[#16A6A1]" />
              <span>Recent Activity</span>
            </h3>
            {recentActivities.length > 0 && (
              <button
                onClick={onClearActivities}
                className="text-[10px] text-[#68778A] hover:text-rose-600 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {recentActivities.length === 0 ? (
            <div className="py-8 text-center space-y-1">
              <p className="text-xs font-semibold text-[#12304A] dark:text-white">
                No recent activity recorded.
              </p>
              <p className="text-[11px] text-[#68778A]">
                Calculations and queries performed in this session will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {recentActivities.slice(0, 5).map((act) => (
                <div
                  key={act.id}
                  onClick={() => onNavigate(act.linkPage)}
                  className="p-2.5 rounded-xl bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] text-xs flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-[#16273B] transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-[#12304A] dark:text-white truncate">
                      {act.title}
                    </p>
                    <p className="text-[10px] text-[#68778A] truncate">
                      {act.description}
                    </p>
                  </div>
                  <span className="text-[10px] text-[#68778A] flex-shrink-0">
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
