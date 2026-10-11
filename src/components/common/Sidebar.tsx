import React from 'react';
import {
  Home,
  LayoutDashboard,
  Calculator,
  Dna,
  BotMessageSquare,
  Bookmark,
  History,
  Settings,
  ChevronRight,
  FlaskConical,
} from 'lucide-react';
import { PageId } from '../../types';
import { Logo } from './Logo';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  savedCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  savedCount = 0,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navItems: { id: PageId; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'calculator', label: 'Quick Lab Calculator', icon: <Calculator className="w-4 h-4" /> },
    { id: 'reference', label: 'CRISPR & Genetics', icon: <Dna className="w-4 h-4" /> },
    { id: 'chat', label: 'AI Lab Assistant', icon: <BotMessageSquare className="w-4 h-4" /> },
    { id: 'saved', label: 'Saved References', icon: <Bookmark className="w-4 h-4" />, badge: savedCount },
    { id: 'activity', label: 'Recent Activity', icon: <History className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleNavClick = (id: PageId) => {
    onNavigate(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container: 250px desktop fixed/sticky */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[250px] bg-white dark:bg-[#112234] border-r border-[#E1E8EF] dark:border-[#1E344D] flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#E1E8EF] dark:border-[#1E344D]">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center text-left hover:opacity-90 transition-opacity"
          >
            <Logo size={32} />
          </button>
        </div>

        {/* Tagline mini bar */}
        <div className="px-5 py-2.5 bg-[#F7FAFC] dark:bg-[#0E1A27] border-b border-[#E1E8EF] dark:border-[#1E344D] text-[11px] text-[#68778A] dark:text-[#94A3B8] font-medium flex items-center gap-1.5">
          <FlaskConical className="w-3.5 h-3.5 text-[#16A6A1]" />
          <span>Red Biotechnology Assistant</span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#12304A] text-white shadow-xs dark:bg-[#16A6A1] dark:text-white'
                    : 'text-[#243447] dark:text-[#CBD5E1] hover:bg-[#F1F5F9] dark:hover:bg-[#1A2E44]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={
                      isActive
                        ? 'text-[#B8F2D0] dark:text-white'
                        : 'text-[#16A6A1] dark:text-[#20C2BC]'
                    }
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-[#16A6A1] text-white'
                          : 'bg-[#E1E8EF] dark:bg-[#1E344D] text-[#243447] dark:text-[#CBD5E1]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-75" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom user profile card */}
        <div className="p-3 border-t border-[#E1E8EF] dark:border-[#1E344D] bg-[#FAFCFD] dark:bg-[#0E1A27]">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#16273B] border border-[#E1E8EF] dark:border-[#1E344D] shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#12304A] to-[#16A6A1] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                BP
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#12304A] dark:text-white truncate">
                  Scientist Workspace
                </p>
                <p className="text-[10px] text-[#68778A] dark:text-[#94A3B8] truncate">
                  Molecular Biology Lab
                </p>
              </div>
            </div>
            <button
              onClick={() => handleNavClick('settings')}
              title="Open Settings"
              className="p-1.5 rounded-lg text-[#68778A] hover:text-[#12304A] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#1E344D] transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
