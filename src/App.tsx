import React, { useState, useEffect } from 'react';
import { PageId, ReferenceTopic, ActivityItem, UserPreferences } from './types';
import { REFERENCE_TOPICS } from './data/referenceData';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { CalculatorPage } from './components/calculator/CalculatorPage';
import { ReferenceGuidePage } from './components/reference/ReferenceGuidePage';
import { ChatbotPage } from './components/chat/ChatbotPage';
import { SavedReferencesPage, SavedAiAnswerItem } from './components/saved/SavedReferencesPage';
import { RecentActivityPage } from './components/activity/RecentActivityPage';
import { SettingsPage } from './components/settings/SettingsPage';

export const App: React.FC = () => {
  // Current screen state
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<ReferenceTopic | null>(null);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | undefined>();

  // Preferences & Theme
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('bioassist_preferences');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      theme: 'light',
      defaultVolumeUnit: 'uL',
      defaultConcUnit: 'mM',
      soundEffects: false,
      saveHistory: true,
    };
  });

  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>(() => {
    if (preferences.theme === 'dark') return 'dark';
    if (preferences.theme === 'light') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Apply theme class to document element
  useEffect(() => {
    const root = document.documentElement;
    if (activeTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [activeTheme]);

  const handleToggleTheme = () => {
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    setActiveTheme(newTheme);
    setPreferences((prev) => ({ ...prev, theme: newTheme }));
  };

  const handleUpdatePreferences = (updated: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem('bioassist_preferences', JSON.stringify(next));
      } catch {}
      if (updated.theme) {
        if (updated.theme === 'dark') setActiveTheme('dark');
        else if (updated.theme === 'light') setActiveTheme('light');
        else {
          setActiveTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        }
      }
      return next;
    });
  };

  // Saved Bookmarks state
  const [savedTopicIds, setSavedTopicIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('bioassist_saved_topics');
      if (saved) return new Set(JSON.parse(saved));
    } catch {}
    return new Set(['crispr-cas9', 'pcr']); // default initial bookmarks
  });

  // Saved AI Answers
  const [savedAiAnswers, setSavedAiAnswers] = useState<SavedAiAnswerItem[]>(() => {
    try {
      const saved = localStorage.getItem('bioassist_saved_answers');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Recent Activities
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem('bioassist_activity_log');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'act_init_1',
        type: 'reference',
        title: 'Explored CRISPR-Cas9 System',
        description: 'Reviewed SpCas9 mechanism and 5\'-NGG-3\' PAM targeting',
        timestamp: 'Today',
        linkPage: 'reference',
      },
    ];
  });

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bioassist_saved_topics', JSON.stringify(Array.from(savedTopicIds)));
    } catch {}
  }, [savedTopicIds]);

  useEffect(() => {
    try {
      localStorage.setItem('bioassist_saved_answers', JSON.stringify(savedAiAnswers));
    } catch {}
  }, [savedAiAnswers]);

  useEffect(() => {
    try {
      localStorage.setItem('bioassist_activity_log', JSON.stringify(recentActivities));
    } catch {}
  }, [recentActivities]);

  const handleToggleBookmark = (topicId: string) => {
    setSavedTopicIds((prev) => {
      const next = new Set(prev);
      const isBookmarked = next.has(topicId);
      if (isBookmarked) {
        next.delete(topicId);
      } else {
        next.add(topicId);
        const topic = REFERENCE_TOPICS.find((t) => t.id === topicId);
        if (topic) {
          handleLogActivity({
            type: 'bookmark',
            title: `Bookmarked ${topic.title}`,
            description: topic.category,
            linkPage: 'saved',
          });
        }
      }
      return next;
    });
  };

  const handleSaveAiAnswer = (title: string, content: string) => {
    const newAnswer: SavedAiAnswerItem = {
      id: `ai_ans_${Date.now()}`,
      title,
      content,
      savedAt: new Date().toLocaleDateString(),
    };
    setSavedAiAnswers((prev) => [newAnswer, ...prev]);
    handleLogActivity({
      type: 'bookmark',
      title: 'Saved BioAssist AI Explanation',
      description: title,
      linkPage: 'saved',
    });
  };

  const handleRemoveAiAnswer = (answerId: string) => {
    setSavedAiAnswers((prev) => prev.filter((a) => a.id !== answerId));
  };

  const handleLogActivity = (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    const newItem: ActivityItem = {
      ...activity,
      id: `act_${Date.now()}`,
      timestamp: 'Just now',
    };
    setRecentActivities((prev) => [newItem, ...prev.slice(0, 40)]);
  };

  const handleClearActivities = () => {
    setRecentActivities([]);
    try {
      localStorage.removeItem('bioassist_activity_log');
    } catch {}
  };

  const handleClearAllData = () => {
    setSavedTopicIds(new Set());
    setSavedAiAnswers([]);
    setRecentActivities([]);
    try {
      localStorage.removeItem('bioassist_saved_topics');
      localStorage.removeItem('bioassist_saved_answers');
      localStorage.removeItem('bioassist_activity_log');
      localStorage.removeItem('bioassist_chat_conversations');
    } catch {}
  };

  const handleNavigate = (page: PageId, extra?: { topicId?: string; prompt?: string }) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (extra?.topicId) {
      const topic = REFERENCE_TOPICS.find((t) => t.id === extra.topicId);
      if (topic) setSelectedTopic(topic);
    }
    if (extra?.prompt) {
      setChatInitialPrompt(extra.prompt);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] dark:bg-[#0B1724] text-[#243447] dark:text-[#E2E8F0] flex flex-col md:flex-row antialiased">
      {/* Persistent Left Sidebar: 250px on desktop */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        savedCount={savedTopicIds.size + savedAiAnswers.length}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-[250px] flex flex-col min-h-screen min-w-0">
        {/* Top Header */}
        <Header
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          theme={activeTheme}
          onToggleTheme={handleToggleTheme}
          onSelectTopic={(t) => {
            setSelectedTopic(t);
            setCurrentPage('reference');
          }}
        />

        {/* Page Views Container */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {currentPage === 'home' && (
            <LandingPage
              onNavigate={handleNavigate}
              recentActivities={recentActivities}
              savedTopics={REFERENCE_TOPICS.filter((t) => savedTopicIds.has(t.id))}
              onSelectTopic={(t) => setSelectedTopic(t)}
            />
          )}

          {currentPage === 'dashboard' && (
            <DashboardPage
              onNavigate={handleNavigate}
              savedTopicIds={savedTopicIds}
              recentActivities={recentActivities}
              onSelectTopic={(t) => setSelectedTopic(t)}
              onClearActivities={handleClearActivities}
            />
          )}

          {currentPage === 'calculator' && (
            <CalculatorPage onLogActivity={handleLogActivity} />
          )}

          {currentPage === 'reference' && (
            <ReferenceGuidePage
              onNavigate={handleNavigate}
              savedTopicIds={savedTopicIds}
              onToggleBookmark={handleToggleBookmark}
              selectedTopic={selectedTopic}
              onSelectTopic={setSelectedTopic}
            />
          )}

          {currentPage === 'chat' && (
            <ChatbotPage
              initialPrompt={chatInitialPrompt}
              onClearInitialPrompt={() => setChatInitialPrompt(undefined)}
              onLogActivity={handleLogActivity}
              onSaveAnswer={handleSaveAiAnswer}
              savedAnswerIds={new Set(savedAiAnswers.map((a) => a.id))}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'saved' && (
            <SavedReferencesPage
              savedTopicIds={savedTopicIds}
              savedAiAnswers={savedAiAnswers}
              onRemoveBookmark={handleToggleBookmark}
              onRemoveAiAnswer={handleRemoveAiAnswer}
              onSelectTopic={(t) => {
                setSelectedTopic(t);
                setCurrentPage('reference');
              }}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'activity' && (
            <RecentActivityPage
              activities={recentActivities}
              onClearActivities={handleClearActivities}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsPage
              preferences={preferences}
              onUpdatePreferences={handleUpdatePreferences}
              onClearAllData={handleClearAllData}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
