import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
  const [activeId, setActiveId] = useState<string>('');
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -70% 0px' }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <>
      {/* Mobile collapsible TOC (< lg) */}
      <div className="block lg:hidden w-full mb-6" dir="rtl">
        <details className="group rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/70 p-3 sm:p-4 shadow-sm transition-all">
          <summary className="flex items-center justify-between cursor-pointer list-none select-none text-sm font-semibold text-zinc-200 min-h-[36px]">
            <div className="flex items-center gap-2">
              <List className="w-4 h-4 text-cyan-400" />
              <span>תוכן עניינים</span>
              <span className="text-xs text-zinc-500 font-normal">({items.length} סעיפים)</span>
            </div>
            <span className="text-xs text-cyan-400 group-open:rotate-180 transition-transform">
              ▼
            </span>
          </summary>
          <div className="pt-3 border-t border-zinc-800/60 mt-3 max-h-64 overflow-y-auto custom-scrollbar">
            <ul className="space-y-1.5 pr-1">
              {items.map((item) => (
                <li 
                  key={item.id}
                  style={{ paddingRight: `${Math.min((item.level - 1) * 12, 36)}px` }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`block py-1 text-xs sm:text-sm transition-colors hover:text-cyan-400 ${
                      activeId === item.id 
                        ? 'text-cyan-400 font-bold' 
                        : 'text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeId === item.id ? 'bg-cyan-400' : 'bg-zinc-600'}`} />
                      <span className="truncate">{item.title}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </details>
      </div>

      {/* Desktop sticky sidebar (>= lg) */}
      <nav 
        className={`sticky top-24 h-fit transition-all duration-300 ease-in-out shrink-0 z-20 ${
          isMinimized ? 'w-12 mr-2' : 'w-64 mr-8'
        } hidden lg:block`} 
        dir="rtl"
      >
        <div className="relative p-4 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 shadow-sm overflow-hidden min-h-[48px]">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="absolute top-3 left-2 p-1.5 rounded-xl hover:bg-zinc-800 transition-colors z-10 text-zinc-500 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
            title={isMinimized ? "הצג תוכן עניינים" : "מזער תוכן עניינים"}
          >
            {isMinimized ? <List className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <AnimatePresence mode="wait">
            {!isMinimized && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 pr-2">תוכן עניינים</h3>
                <ul className="space-y-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  {items.map((item) => (
                    <li 
                      key={item.id}
                      style={{ paddingRight: `${(item.level - 1) * 12}px` }}
                    >
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`block text-sm transition-all duration-200 hover:text-cyan-500 ${
                          activeId === item.id 
                            ? 'text-cyan-400 font-bold translate-x-[-4px]' 
                            : 'text-zinc-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <motion.div
                            initial={false}
                            animate={{ 
                              scale: activeId === item.id ? 1 : 0,
                              opacity: activeId === item.id ? 1 : 0
                            }}
                            className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0"
                          />
                          <span className="truncate">{item.title}</span>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </>
  );
};
