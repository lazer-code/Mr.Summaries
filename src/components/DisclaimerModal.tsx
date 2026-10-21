import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../store/useAuthStore';
import { useLocation } from 'react-router-dom';

export const DisclaimerModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();
  const location = useLocation();
  const isGuest = localStorage.getItem('isGuest') === 'true';

  useEffect(() => {
    const hasSeenDisclaimer = sessionStorage.getItem('hasSeenDisclaimer');
    const isAuthPage = location.pathname === '/login';
    
    if (!hasSeenDisclaimer && !isAuthPage && (user || isGuest)) {
      setIsOpen(true);
    }
  }, [user, isGuest, location.pathname]);

  const handleClose = () => {
    sessionStorage.setItem('hasSeenDisclaimer', 'true');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-zinc-950/50 backdrop-blur-sm" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-zinc-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-zinc-800"
          >
            <div className="p-5 sm:p-8">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="p-2.5 sm:p-3 bg-amber-900/30 rounded-2xl text-amber-400">
                  <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-50">שימו לב</h2>
              </div>
              
              <div className="space-y-3 sm:space-y-4 text-zinc-300 leading-relaxed text-sm sm:text-base">
                <p className="font-medium text-base sm:text-lg">
                  בסיכומים עלול להופיע מידע לא מדוייק והשימוש בסיכומים הוא על אחריותכם בלבד.
                </p>
                <p className="text-xs sm:text-sm">
                  במידה ומצאתם טעות או יש משהו שברצונכם להוסיף, מוזמנים לפנות אלי במייל{' '}
                  <a 
                    href="mailto:shaked.levnat@gmail.com" 
                    className="text-cyan-400 font-semibold hover:underline inline-block"
                  >
                    shaked.levnat@gmail.com
                  </a>.
                </p>
              </div>

              <div className="mt-6 sm:mt-8">
                <button
                  onClick={handleClose}
                  className="w-full py-3.5 sm:py-4 px-6 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-cyan-600/20 active:scale-[0.98] min-h-[48px] text-sm sm:text-base cursor-pointer"
                >
                  הבנתי, המשך לאתר
                </button>
              </div>
            </div>
            
            <button 
              onClick={handleClose}
              className="absolute top-3 left-3 sm:top-4 sm:left-4 p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="סגור"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
