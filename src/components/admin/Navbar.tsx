import React from 'react';
import { Plus, LayoutGrid, Layers, Inbox, BarChart3 } from 'lucide-react';

interface NavbarProps {
  currentTab: 'overview' | 'sites' | 'templates' | 'inbox';
  onTabChange: (tab: 'overview' | 'sites' | 'templates' | 'inbox') => void;
  onNewSiteClick: () => void;
  totalInquiries?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onNewSiteClick,
  totalInquiries = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg">
            EP
          </div>
          <span
            onClick={() => onTabChange('overview')}
            className="text-lg font-bold tracking-tight text-white cursor-pointer whitespace-nowrap select-none hover:text-amber-400 transition-colors"
          >
            EsnafPanel CMS
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-300">
          <button
            onClick={() => onTabChange('overview')}
            className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 py-1 ${
              currentTab === 'overview'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Genel Bakış
          </button>

          <button
            onClick={() => onTabChange('sites')}
            className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 py-1 ${
              currentTab === 'sites'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Müşteri Siteleri
          </button>

          <button
            onClick={() => onTabChange('templates')}
            className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 py-1 ${
              currentTab === 'templates'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            Hazır Şablonlar
          </button>

          <button
            onClick={() => onTabChange('inbox')}
            className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 py-1 relative ${
              currentTab === 'inbox'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Inbox className="w-4 h-4" />
            Gelen Talepler
            {totalInquiries > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                {totalInquiries}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNewSiteClick}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Yeni Müşteri Sitesi
          </button>
        </div>
      </div>
    </header>
  );
};
