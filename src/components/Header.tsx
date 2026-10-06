import React from 'react';
import { AppMode, Language, UserProfile } from '../types';
import { Globe, User, Terminal } from 'lucide-react';

interface HeaderProps {
  currentMode?: AppMode;
  onModeChange?: (mode: AppMode) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser?: UserProfile;
  onOpenUserDashboard?: () => void;
  onOpenAdminDashboard?: () => void;
  onOpenSlashCommands?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  currentUser,
  onOpenUserDashboard,
  onOpenSlashCommands
}) => {
  const isMyanmar = language === 'my';

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 border-b border-slate-800 px-3 py-2.5 sm:px-6 shadow-md">
      <div className="mx-auto flex flex-wrap max-w-7xl items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 p-[2px] shadow-sm">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <span className="font-black text-sm sm:text-base tracking-tighter bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent select-none">
                SK
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400 bg-clip-text text-base sm:text-xl font-black tracking-tight text-transparent whitespace-nowrap">
                Show Ai Studio.
              </h1>
            </div>
          </div>
        </div>

        {/* Right Action Controls: Slash Commands, Sign In & Language Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Slash Commands Button */}
          {onOpenSlashCommands && (
            <button
              type="button"
              onClick={onOpenSlashCommands}
              className="flex items-center gap-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/40 hover:border-cyan-400 px-3 py-1.5 text-xs text-cyan-300 hover:text-white transition-all shadow-sm cursor-pointer group"
              title="Open Slash Command Studio (/Character, /Background, /Clothes, /Reference, /Preset)"
            >
              <Terminal className="h-3.5 w-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              <span className="font-bold text-xs tracking-tight">/ Commands</span>
            </button>
          )}

          {/* User Dashboard / Sign In Button */}
          {onOpenUserDashboard && (
            <button
              type="button"
              onClick={onOpenUserDashboard}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-400/50 px-3 py-1.5 text-xs text-slate-200 hover:text-white transition-all shadow-sm cursor-pointer"
              title="Sign In / User Profile"
            >
              <User className="h-3.5 w-3.5 text-cyan-400" />
              <span className="font-bold text-xs tracking-tight">
                {currentUser?.name && currentUser.name !== 'Guest User' && currentUser.name !== 'Kyaw Win'
                  ? currentUser.name
                  : 'Sign In'}
              </span>
            </button>
          )}

          {/* Language Toggle */}
          <button
            onClick={() => onLanguageChange(isMyanmar ? 'en' : 'my')}
            className="flex items-center gap-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
            title="Toggle Language / ဘာသာစကား ပြောင်းရန်"
          >
            <Globe className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-medium text-[11px] sm:text-xs">{isMyanmar ? '🇲🇲' : '🇬🇧'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
