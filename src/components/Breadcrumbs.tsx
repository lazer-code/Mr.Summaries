import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, Home, BookOpen, FileText, List, Bookmark, User, LogIn } from 'lucide-react';
import { useBreadcrumbStore, BreadcrumbItem } from '../store/useBreadcrumbStore';
import { motion } from 'motion/react';

const iconMap = {
  home: Home,
  course: BookOpen,
  summaries: FileText,
  summary: FileText,
  lecture: List,
  example: Bookmark,
  profile: User,
  login: LogIn,
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const { customItems, courseCache } = useBreadcrumbStore();

  const items = useMemo<BreadcrumbItem[]>(() => {
    // If a page provided custom items, use them
    if (customItems && customItems.length > 0) {
      return customItems;
    }

    const { pathname, search } = location;

    // Do not show breadcrumbs on the home page
    if (pathname === '/') {
      return [];
    }

    const baseItem: BreadcrumbItem = {
      label: 'דף הבית',
      to: '/',
      icon: 'home',
    };

    const segments = pathname.split('/').filter(Boolean);
    const tab = new URLSearchParams(search).get('tab');

    // /course/:id
    if (segments[0] === 'course' && segments[1]) {
      const courseId = segments[1];
      const courseInfo = courseCache[courseId];
      const courseName = courseInfo?.name || 'קורס';

      // /course/:id/summaries
      if (segments[2] === 'summaries') {
        return [
          baseItem,
          { label: courseName, to: `/course/${courseId}`, icon: 'course' },
          { label: 'סיכומים', icon: 'summaries' },
        ];
      }

      // Check tab query param
      const tabLabels: Record<string, { label: string; icon: keyof typeof iconMap }> = {
        summaries: { label: 'סיכומים', icon: 'summaries' },
        lectures: { label: 'הגדרות ומשפטים', icon: 'lecture' },
        examples: { label: 'דוגמאות', icon: 'example' },
        questions: { label: 'שאלות ותשובות', icon: 'lecture' },
        files: { label: 'קבצים', icon: 'summaries' },
      };

      if (tab && tabLabels[tab]) {
        return [
          baseItem,
          { label: courseName, to: `/course/${courseId}`, icon: 'course' },
          { label: tabLabels[tab].label, icon: tabLabels[tab].icon },
        ];
      }

      return [
        baseItem,
        { label: courseName, icon: 'course' },
      ];
    }

    // /summary/:id
    if (segments[0] === 'summary') {
      return [
        baseItem,
        { label: 'סיכומים', icon: 'summaries' },
        { label: 'צפייה בסיכום', icon: 'summary' },
      ];
    }

    // /lecture/:id
    if (segments[0] === 'lecture') {
      return [
        baseItem,
        { label: 'הגדרות ומשפטים', icon: 'lecture' },
        { label: 'צפייה בהרצאה', icon: 'lecture' },
      ];
    }

    // /example/:id
    if (segments[0] === 'example') {
      return [
        baseItem,
        { label: 'דוגמאות', icon: 'example' },
        { label: 'צפייה בדוגמה', icon: 'example' },
      ];
    }

    // /profile
    if (segments[0] === 'profile') {
      return [
        baseItem,
        { label: 'פרופיל אישי', icon: 'profile' },
      ];
    }

    // /login
    if (segments[0] === 'login') {
      return [
        baseItem,
        { label: 'התחברות', icon: 'login' },
      ];
    }

    return [baseItem];
  }, [location, customItems, courseCache]);

  if (items.length === 0 || location.pathname === '/') {
    return null;
  }

  return (
    <nav aria-label="נתיב ניווט (Breadcrumb)" className="mb-4 sm:mb-6" dir="rtl">
      <motion.ol
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs sm:text-sm text-zinc-400 bg-zinc-900/60 border border-zinc-800/80 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 backdrop-blur-md shadow-sm w-fit max-w-full"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const Icon = item.icon ? iconMap[item.icon] : null;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              {index > 0 && (
                <ChevronLeft
                  className="w-3.5 h-3.5 text-zinc-600 shrink-0 select-none"
                  aria-hidden="true"
                />
              )}

              {isLast || !item.to ? (
                <span
                  className="inline-flex items-center gap-1.5 text-zinc-100 font-semibold py-0.5 px-1.5 rounded-md bg-zinc-800/50 max-w-[160px] sm:max-w-[260px] md:max-w-[340px] truncate"
                  aria-current="page"
                  title={item.label}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 shrink-0 text-cyan-400" />}
                  <span className="truncate">{item.label}</span>
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800/40 transition-colors py-0.5 px-1.5 rounded-md max-w-[130px] sm:max-w-[200px] md:max-w-[260px] truncate"
                  title={item.label}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 shrink-0 text-zinc-400 group-hover:text-cyan-400" />}
                  <span className="truncate">{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </motion.ol>
    </nav>
  );
};
