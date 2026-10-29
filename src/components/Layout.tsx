import React, { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { LogOut, User, Mail, AlertTriangle } from 'lucide-react';
import { InteractiveBackground } from './InteractiveBackground';
import { AnimatePresence, motion } from 'motion/react';
import { DisclaimerModal } from './DisclaimerModal';

export const Layout = () => {
  const { user, logout, isLoading } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add('dark');
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-50">טוען...</div>;
  }

  return (
    <div className="min-h-screen text-zinc-50 transition-colors duration-300 relative flex flex-col" dir="rtl">
      <InteractiveBackground />
      <DisclaimerModal />
      <header className="fixed top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/75 backdrop-blur-xl">
        <div className="container mx-auto px-3 sm:px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link to="/" className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent py-1">
              Mr.Summaries
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-xl hover:bg-zinc-800/60 active:bg-zinc-800 transition-colors min-h-[44px]"
                  title="פרופיל משתמש"
                >
                  <User className="w-5 h-5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
                  <span className="text-sm font-medium hidden sm:inline-block max-w-[130px] truncate">{user.name || user.email}</span>
                </Link>
                <button 
                  onClick={logout} 
                  className="p-2.5 rounded-xl hover:bg-zinc-800/60 active:bg-zinc-800 transition-colors text-red-400 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer" 
                  title="התנתקות"
                  aria-label="התנתקות"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-cyan-600 text-white hover:bg-cyan-700 active:bg-cyan-800 transition-colors text-sm font-medium shadow-md shadow-cyan-600/20 min-h-[44px]"
              >
                <User className="w-4 h-4 shrink-0" />
                <span>התחברות</span>
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="container mx-auto px-3 sm:px-4 pt-20 sm:pt-24 pb-16 sm:pb-20 relative flex-grow max-w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="relative border-t border-zinc-800/50 bg-black/50 backdrop-blur-md py-6 px-3 sm:px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <div className="flex justify-center gap-2 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-zinc-300 leading-relaxed px-2">
              בסיכומים עלול להופיע מידע לא מדוייק והשימוש בסיכומים הוא על אחריותכם בלבד.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-x-2 gap-y-1.5 text-xs text-zinc-400 pt-1">
              <span>במידה ומצאתם טעות או יש משהו שברצונכם להוסיף, מוזמנים לפנות במייל:</span>
              <a 
                href="mailto:shaked.levnat@gmail.com" 
                className="inline-flex items-center gap-1.5 text-cyan-400 font-semibold hover:underline p-1 min-h-[36px] items-center"
                dir="ltr"
              >
                <Mail className="w-3.5 h-3.5" />
                shaked.levnat@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
