import React from 'react';
import {
  History,
  Trash2,
  Calculator,
  Dna,
  BotMessageSquare,
  BookmarkCheck,
  ArrowRight,
} from 'lucide-react';
import { ActivityItem, PageId } from '../../types';

interface RecentActivityPageProps {
  activities: ActivityItem[];
  onClearActivities: () => void;
  onNavigate: (page: PageId) => void;
}

export const RecentActivityPage: React.FC<RecentActivityPageProps> = ({
  activities,
  onClearActivities,
  onNavigate,
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#12304A] dark:text-white flex items-center gap-2.5">
            <History className="w-6 h-6 text-[#16A6A1]" />
            <span>Recent Workspace Activity</span>
          </h2>
          <p className="text-xs text-[#68778A] dark:text-[#94A3B8] mt-1">
            Real session timeline of your calculations, reference reviews, and AI consultations.
          </p>
        </div>

        {activities.length > 0 && (
          <button
            onClick={onClearActivities}
            className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Activity Log</span>
          </button>
        )}
      </div>

      {/* Activity Timeline */}
      {activities.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-6 space-y-2">
          <p className="text-sm font-semibold text-[#12304A] dark:text-white">
            Your research workspace is ready.
          </p>
          <p className="text-xs text-[#68778A]">
            Start using the Quick Lab Calculator or consult BioAssist AI to see your activity trail here.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {activities.map((act) => (
            <div
              key={act.id}
              onClick={() => onNavigate(act.linkPage)}
              className="p-3.5 rounded-2xl bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] hover:border-[#16A6A1] dark:hover:border-[#16A6A1] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0 pr-3">
                <div className="w-8 h-8 rounded-xl bg-[#F7FAFC] dark:bg-[#0E1A27] text-[#16A6A1] flex items-center justify-center flex-shrink-0">
                  {act.type === 'calculator' && <Calculator className="w-4 h-4" />}
                  {act.type === 'reference' && <Dna className="w-4 h-4" />}
                  {act.type === 'chat' && <BotMessageSquare className="w-4 h-4" />}
                  {act.type === 'bookmark' && <BookmarkCheck className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-[#12304A] dark:text-white group-hover:text-[#16A6A1] transition-colors truncate">
                    {act.title}
                  </p>
                  <p className="text-[11px] text-[#68778A] dark:text-[#94A3B8] truncate">
                    {act.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] text-[#68778A]">
                  {act.timestamp}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#68778A] group-hover:text-[#16A6A1] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
