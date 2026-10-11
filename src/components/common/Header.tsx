import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Moon,
  Sun,
  Bell,
  Menu,
  X,
  ExternalLink,
  Calculator,
  Dna,
  BotMessageSquare,
  Sparkles,
} from 'lucide-react';
import { PageId, ReferenceTopic } from '../../types';
import { REFERENCE_TOPICS } from '../../data/referenceData';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId, extra?: { topicId?: string; prompt?: string }) => void;
  onToggleMobileMenu: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onSelectTopic: (topic: ReferenceTopic) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onToggleMobileMenu,
  theme,
  onToggleTheme,
  onSelectTopic,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close search/notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered search results
  const matchingTopics = searchQuery.trim()
    ? REFERENCE_TOPICS.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.shortDefinition.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const calculatorMatches = searchQuery.trim()
    ? [
        { name: 'Molarity Calculator', type: 'M = n / V', id: 'molarity' },
        { name: 'Dilution Calculator', type: 'C₁V₁ = C₂V₂', id: 'dilution' },
        { name: 'PCR Master Mix Calculator', type: 'Reaction Setup', id: 'pcr' },
      ].filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const pageTitles: Record<PageId, { title: string; subtitle: string }> = {
    home: { title: 'Welcome to BioAssist Pro', subtitle: 'Biotechnology Learning & Research Assistant' },
    dashboard: { title: 'Research Dashboard', subtitle: 'Overview of calculations, references, and assistant activity' },
    calculator: { title: 'Quick Lab Calculator', subtitle: 'Molarity, serial dilution, and PCR reaction calculations' },
    reference: { title: 'CRISPR & Genetic Engineering Guide', subtitle: 'Searchable scientific references and mechanisms' },
    chat: { title: 'BioAssist AI Lab Assistant', subtitle: 'Conversational scientific explanations and protocol guidance' },
    saved: { title: 'Saved References', subtitle: 'Bookmarked topics and stored assistant insights' },
    activity: { title: 'Recent Activity', subtitle: 'Audit log of calculations and sessions' },
    settings: { title: 'Settings & Workspace', subtitle: 'Preferences, units, and system storage' },
  };

  const handleSelectSearchResult = (topic: ReferenceTopic) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    onSelectTopic(topic);
    onNavigate('reference');
  };

  const handleSelectCalcResult = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    onNavigate('calculator');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-[#112234]/90 backdrop-blur-md border-b border-[#E1E8EF] dark:border-[#1E344D] px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          aria-label="Toggle navigation menu"
          className="p-2 -ml-2 rounded-lg text-[#68778A] hover:text-[#12304A] dark:hover:text-white md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm md:text-base font-bold text-[#12304A] dark:text-white truncate">
            {pageTitles[currentPage]?.title || 'BioAssist Pro'}
          </h1>
          <p className="text-[11px] text-[#68778A] dark:text-[#94A3B8] hidden sm:block truncate">
            {pageTitles[currentPage]?.subtitle}
          </p>
        </div>
      </div>

      {/* Center: Global Search Field */}
      <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#68778A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search tools, concepts, and references…"
            className="w-full pl-9 pr-8 py-1.5 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl text-xs text-[#243447] dark:text-white placeholder-[#68778A] focus:outline-none focus:ring-2 focus:ring-[#16A6A1]/40 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#68778A] hover:text-[#12304A] dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && searchQuery.trim().length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl shadow-lg p-2 z-50 max-h-96 overflow-y-auto">
            {calculatorMatches.length > 0 && (
              <div className="mb-2">
                <span className="text-[10px] font-semibold text-[#68778A] px-2 uppercase tracking-wider">
                  Calculators
                </span>
                <div className="mt-1 space-y-0.5">
                  {calculatorMatches.map((c) => (
                    <button
                      key={c.id}
                      onClick={handleSelectCalcResult}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-[#F1F5F9] dark:hover:bg-[#1A2E44] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Calculator className="w-3.5 h-3.5 text-[#16A6A1]" />
                        <span className="font-medium text-[#12304A] dark:text-white">{c.name}</span>
                      </div>
                      <span className="text-[10px] text-[#68778A] font-mono">{c.type}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {matchingTopics.length > 0 && (
              <div>
                <span className="text-[10px] font-semibold text-[#68778A] px-2 uppercase tracking-wider">
                  Reference Guide Topics
                </span>
                <div className="mt-1 space-y-0.5">
                  {matchingTopics.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleSelectSearchResult(t)}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-[#F1F5F9] dark:hover:bg-[#1A2E44] flex items-start gap-2"
                    >
                      <Dna className="w-3.5 h-3.5 text-[#16A6A1] mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-[#12304A] dark:text-white truncate">
                          {t.title}
                        </p>
                        <p className="text-[10px] text-[#68778A] truncate">{t.shortDefinition}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {matchingTopics.length === 0 && calculatorMatches.length === 0 && (
              <div className="py-4 text-center text-xs text-[#68778A]">
                No matching reference entries or calculators found for "{searchQuery}".
              </div>
            )}

            <div className="pt-2 border-t border-[#E1E8EF] dark:border-[#1E344D] mt-2">
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  onNavigate('chat', { prompt: `Explain this biotechnology concept: ${searchQuery}` });
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-[#16A6A1] hover:bg-[#16A6A1]/10 font-medium"
              >
                <div className="flex items-center gap-2">
                  <BotMessageSquare className="w-3.5 h-3.5" />
                  <span>Ask BioAssist AI about "{searchQuery}"</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right: Actions (Notifications, Theme Toggle, Profile Menu) */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            aria-label="View notifications and daily tips"
            className="p-2 rounded-xl text-[#68778A] hover:text-[#12304A] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#1E344D] transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#16A6A1]" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl shadow-lg p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#E1E8EF] dark:border-[#1E344D]">
                <span className="text-xs font-bold text-[#12304A] dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#16A6A1]" />
                  Scientific Workspace Updates
                </span>
                <span className="text-[10px] text-[#68778A]">BioAssist Pro v1.0</span>
              </div>
              <div className="mt-2.5 space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D]">
                  <p className="font-semibold text-[#12304A] dark:text-white text-[11px]">
                    Quick Lab Calculator Active
                  </p>
                  <p className="text-[10px] text-[#68778A] mt-0.5">
                    Molarity, C₁V₁=C₂V₂ serial dilution, and PCR setup tools are verified and ready.
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D]">
                  <p className="font-semibold text-[#12304A] dark:text-white text-[11px]">
                    CRISPR & Red Biotech Library
                  </p>
                  <p className="text-[10px] text-[#68778A] mt-0.5">
                    24 peer-reviewed reference topics loaded with interactive simulators and quizzes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 rounded-xl text-[#68778A] hover:text-[#12304A] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#1E344D] transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Quick Launch Assistant */}
        <button
          onClick={() => onNavigate('chat')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#16A6A1] hover:bg-[#118480] text-white text-xs font-semibold shadow-xs transition-all"
        >
          <BotMessageSquare className="w-3.5 h-3.5" />
          <span>Ask AI</span>
        </button>
      </div>
    </header>
  );
};
