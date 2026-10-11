import React, { useState, useMemo } from 'react';
import {
  Bookmark,
  Search,
  Trash2,
  ExternalLink,
  BotMessageSquare,
  Dna,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { ReferenceTopic, PageId } from '../../types';
import { REFERENCE_TOPICS } from '../../data/referenceData';

export interface SavedAiAnswerItem {
  id: string;
  title: string;
  content: string;
  savedAt: string;
}

interface SavedReferencesPageProps {
  savedTopicIds: Set<string>;
  savedAiAnswers: SavedAiAnswerItem[];
  onRemoveBookmark: (topicId: string) => void;
  onRemoveAiAnswer: (answerId: string) => void;
  onSelectTopic: (topic: ReferenceTopic) => void;
  onNavigate: (page: PageId, extra?: { topicId?: string; prompt?: string }) => void;
}

export const SavedReferencesPage: React.FC<SavedReferencesPageProps> = ({
  savedTopicIds,
  savedAiAnswers,
  onRemoveBookmark,
  onRemoveAiAnswer,
  onSelectTopic,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filterTabs = [
    'All',
    'CRISPR',
    'Molecular Biology',
    'Cancer Research',
    'Laboratory Calculations',
    'Saved AI Answers',
  ];

  // Bookmarked Reference topics
  const bookmarkedTopics = useMemo(() => {
    return REFERENCE_TOPICS.filter((t) => savedTopicIds.has(t.id));
  }, [savedTopicIds]);

  // Combined filtered items
  const filteredBookmarkedTopics = useMemo(() => {
    if (activeFilter === 'Saved AI Answers') return [];
    return bookmarkedTopics.filter((t) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.shortDefinition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        activeFilter === 'All' ||
        (activeFilter === 'CRISPR' && t.category.includes('CRISPR')) ||
        (activeFilter === 'Molecular Biology' && t.category.includes('Molecular')) ||
        (activeFilter === 'Cancer Research' && t.category.includes('Cancer')) ||
        (activeFilter === 'Laboratory Calculations' && t.category.includes('Laboratory'));

      return matchesSearch && matchesFilter;
    });
  }, [bookmarkedTopics, searchQuery, activeFilter]);

  const filteredAiAnswers = useMemo(() => {
    if (activeFilter !== 'All' && activeFilter !== 'Saved AI Answers') return [];
    return savedAiAnswers.filter((a) => {
      return (
        searchQuery.trim() === '' ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [savedAiAnswers, searchQuery, activeFilter]);

  const totalSavedCount = bookmarkedTopics.length + savedAiAnswers.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#12304A] dark:text-white flex items-center gap-2.5">
            <Bookmark className="w-6 h-6 text-[#16A6A1]" />
            <span>Saved References</span>
          </h2>
          <p className="text-xs text-[#68778A] dark:text-[#94A3B8] mt-1">
            Access your bookmarked biotechnology reference topics and saved BioAssist AI insights.
          </p>
        </div>

        <div className="text-xs text-[#68778A] font-semibold bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] px-3 py-1.5 rounded-xl shadow-2xs self-start sm:self-auto">
          {totalSavedCount} Saved Item{totalSavedCount !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#68778A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved references and AI insights…"
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl text-xs text-[#243447] dark:text-white placeholder-[#68778A] focus:outline-none focus:ring-2 focus:ring-[#16A6A1]/40 shadow-2xs"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeFilter === tab
                  ? 'bg-[#12304A] text-white dark:bg-[#16A6A1] shadow-2xs'
                  : 'bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] text-[#68778A] dark:text-[#94A3B8] hover:text-[#12304A] dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content list */}
      <div className="space-y-4">
        {/* Bookmarked Topics */}
        {filteredBookmarkedTopics.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#12304A] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Dna className="w-3.5 h-3.5 text-[#16A6A1]" />
              <span>Reference Topics ({filteredBookmarkedTopics.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBookmarkedTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-4 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-[#12304A] dark:text-white">
                        {topic.title}
                      </h4>
                      <button
                        onClick={() => onRemoveBookmark(topic.id)}
                        className="text-[#68778A] hover:text-rose-600 p-1 transition-colors"
                        title="Remove Bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-[#68778A] dark:text-[#94A3B8] line-clamp-2">
                      {topic.shortDefinition}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-[#68778A]">
                      <span className="text-[#16A6A1] font-semibold">{topic.category}</span>
                      <span>·</span>
                      <span>{topic.difficulty}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSelectTopic(topic);
                      onNavigate('reference');
                    }}
                    className="mt-4 w-full py-1.5 px-3 rounded-xl bg-[#F7FAFC] hover:bg-[#E1E8EF] dark:bg-[#0E1A27] dark:hover:bg-[#1A2E44] text-[#12304A] dark:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Open Reference</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved AI Answers */}
        {filteredAiAnswers.length > 0 && (
          <div className="space-y-3 pt-4">
            <h3 className="text-xs font-bold text-[#12304A] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <BotMessageSquare className="w-3.5 h-3.5 text-[#16A6A1]" />
              <span>Saved AI Explanations ({filteredAiAnswers.length})</span>
            </h3>

            <div className="space-y-3">
              {filteredAiAnswers.map((ans) => (
                <div
                  key={ans.id}
                  className="bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#E1E8EF] dark:border-[#1E344D]">
                    <span className="font-bold text-xs text-[#12304A] dark:text-white">
                      {ans.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#68778A]">{ans.savedAt}</span>
                      <button
                        onClick={() => onRemoveAiAnswer(ans.id)}
                        className="p-1 text-[#68778A] hover:text-rose-600 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-[#243447] dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                    {ans.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {filteredBookmarkedTopics.length === 0 && filteredAiAnswers.length === 0 && (
          <div className="py-16 text-center bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#16A6A1]/10 text-[#16A6A1] flex items-center justify-center mx-auto">
              <Bookmark className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-[#12304A] dark:text-white">
                No saved references yet.
              </h4>
              <p className="text-xs text-[#68778A] max-w-sm mx-auto">
                Bookmark articles in the CRISPR & Genetic Engineering guide or save helpful explanations from BioAssist AI to find them here.
              </p>
            </div>
            <button
              onClick={() => onNavigate('reference')}
              className="mt-2 px-4 py-2 rounded-xl bg-[#16A6A1] hover:bg-[#118480] text-white text-xs font-semibold transition-all inline-flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Browse Reference Topics</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
