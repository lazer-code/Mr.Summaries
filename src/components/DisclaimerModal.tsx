import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, X, Monitor, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';

export const DisclaimerModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dismissedRef = useRef(false);
  const location = useLocation();

  useEffect(() => {
    // Clear any persistent storage to ensure the disclaimer opens every time the site is loaded
    sessionStorage.removeItem('hasSeenDisclaimer');
  }, []);

  useEffect(() => {
    const isAuthPage = location.pathname === '/login';
    
    if (!dismissedRef.current && !isAuthPage) {
      setIsOpen(true);
    }
  }, [location.pathname]);

  const handleClose = () => {
    dismissedRef.current = true;
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-zinc-950/70 backdrop-blur-md" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-zinc-900/95 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-zinc-800"
          >
            <div className="p-5 sm:p-7">
              {/* Header */}
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                <div className="p-2.5 sm:p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400 shrink-0">
                  <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-zinc-50">שימו לב</h2>
                  <p className="text-xs sm:text-sm text-zinc-400">הודעה חשובה והמלצות גלישה</p>
                </div>
              </div>
              
              {/* Content */}
              <div className="space-y-3 sm:space-y-4 text-zinc-300 leading-relaxed text-sm sm:text-base">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-800/40 border border-zinc-800 text-zinc-200">
                  <p className="font-semibold text-base sm:text-lg text-amber-300/90 mb-1">
                    דיוק החומרים והסיכומים
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    בסיכומים עלול להופיע מידע שאינו מדוייק במאת האחוזים (100%), והשימוש בחומרי הלימוד ובסיכומים הוא על אחריותכם בלבד.
                  </p>
                </div>

                {/* Big screen recommendation */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/30 text-zinc-300 flex items-start gap-3">
                  <Monitor className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm">
                    <p className="font-semibold text-cyan-300 mb-0.5">
                      חוויית צפייה מיטבית
                    </p>
                    <p className="text-zinc-300 leading-relaxed">
                      האתר נראה ופועל במיטבו במסכים גדולים יותר כגון טאבלטים, מחשבים ניידים ומחשבים אישיים (PC).
                    </p>
                  </div>
                </div>

                {/* Contact email */}
                <div className="text-xs sm:text-sm text-zinc-400 px-1 pt-1 flex items-start gap-2">
                  <Mail className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <p>
                    מצאתם טעות או שיש משהו שתרצו להוסיף? מוזמנים לפנות במייל:{' '}
                    <a 
                      href="mailto:shaked.levnat@gmail.com" 
                      className="text-cyan-400 font-semibold hover:underline inline-block"
                      dir="ltr"
                    >
                      shaked.levnat@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 sm:mt-7">
                <button
                  onClick={handleClose}
                  className="w-full py-3 sm:py-3.5 px-6 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white font-bold rounded-2xl transition-all shadow-lg shadow-cyan-600/20 active:scale-[0.98] min-h-[48px] text-sm sm:text-base cursor-pointer"
                >
                  הבנתי, המשך לאתר
                </button>
              </div>
            </div>
            
            {/* Close Button */}
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
