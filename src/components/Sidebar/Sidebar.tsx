import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../shared/hooks/useTheme';

type NavItem = {
  id: 'coin' | 'gold';
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  activeTab: 'coin' | 'gold';
  onTabChange: (tab: 'coin' | 'gold') => void;
  currency: 'usd' | 'vnd';
  onCurrencyChange: (currency: 'usd' | 'vnd') => void;
  exchangeRate: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab, onTabChange, currency, onCurrencyChange, exchangeRate,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const NAV_ITEMS: NavItem[] = [
    { id: 'coin', label: t('sidebar.nav.coin'), icon: <span>₿</span> },
    { id: 'gold', label: t('sidebar.nav.gold'), icon: <span>★</span> },
  ];

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-800 border-r border-gray-100/80 dark:border-slate-700
        flex flex-col z-40 transition-transform duration-200 ease-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100/80">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-blue-500 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-bold">P</span>
          </div>
          <span className="ml-2.5 text-lg font-bold bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent tracking-tight">
            {t('sidebar.appTitle')}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setMobileOpen(false);
              }}
              className={`
                w-full px-4 py-2.5 rounded-xl text-left flex items-center gap-3
                transition-all duration-200
                ${activeTab === item.id
                  ? 'bg-gray-900 dark:bg-slate-700 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-slate-700/50 dark:hover:text-gray-100'
                }
              `}
            >
              <span className="w-5 h-5 flex items-center justify-center text-sm">
                {item.icon}
              </span>
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

         {/* Bottom Section: Currency Switcher */}
        <div className="p-4 border-t border-gray-100/80 dark:border-slate-700 space-y-3">
          <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold px-2">
            {t('sidebar.currency')}
          </div>
          <div className="flex bg-gray-50/80 rounded-xl p-1 gap-1">
            {(['usd', 'vnd'] as const).map((c) => (
              <button
                key={c}
                onClick={() => onCurrencyChange(c)}
                className={`
                  flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                  ${currency === c
                    ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }
                `}
              >
                {c.toUpperCase()}
              </button>
            ))}
          </div>
           <div className="bg-gray-50/80 dark:bg-slate-700/50 rounded-lg px-3 py-2 flex items-center justify-center gap-1">
             <span className="text-xs text-gray-400 dark:text-gray-400">{t('sidebar.exchangeRate.prefix')}</span>
             <span className="text-xs font-mono font-semibold text-gray-700 dark:text-gray-200">{exchangeRate.toLocaleString()}</span>
             <span className="text-xs text-gray-400 dark:text-gray-400">{t('sidebar.exchangeRate.suffix')}</span>
           </div>
          <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold px-2 mt-3">
            {t('sidebar.language')}
          </div>
           <div className="flex bg-gray-50/80 dark:bg-slate-700/50 rounded-xl p-1 gap-1">
             {(['en', 'vi'] as const).map((lng) => (
               <button
                 key={lng}
                 onClick={() => i18n.changeLanguage(lng)}
                 className={`
                   flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                   ${i18n.language === lng
                     ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-gray-100 shadow-sm'
                     : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                   }
                 `}
               >
                 {lng === 'en' ? '🇺🇸 EN' : '🇻🇳 VI'}
               </button>
             ))}
            </div>
           <button
             onClick={toggleTheme}
             className="w-full px-3 py-2 rounded-xl flex items-center justify-center gap-2
                        bg-gray-50/80 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700
                        transition-all duration-200"
           >
             {theme === 'dark' ? (
               <>
                 <span>☀️</span>
                 <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Light</span>
               </>
             ) : (
               <>
                 <span>🌙</span>
                 <span className="text-xs font-medium text-gray-700">Dark</span>
               </>
             )}
           </button>
         </div>
       </aside>

       {/* Mobile Header (visible only on mobile) */}
       <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border-b border-gray-100/80 dark:border-slate-700 flex items-center px-4 z-30">
         <button
           onClick={() => setMobileOpen(true)}
           className="p-2 -ml-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700"
         >
           {/* Hamburger icon */}
           <div className="w-5 h-5 flex flex-col justify-center gap-1">
             <span className="block h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full" />
             <span className="block h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full" />
             <span className="block h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full" />
           </div>
         </button>
        <span className="ml-2 text-sm font-bold bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
          {t('sidebar.appTitle')}
        </span>
      </div>
    </>
  );
};
