import React, { useEffect, useState, useMemo, useDeferredValue, useCallback } from 'react';
import { motion, type Variants } from 'motion/react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Plus, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { useBreadcrumbStore } from '../store/useBreadcrumbStore';
import { CourseModal } from '../components/CourseModal';
import { 
  formatSemester, 
  formatYear, 
  groupCoursesByYearAndSemester,
  YearCourseGroup 
} from '../utils/courseFormatters';

interface GroupedCourseSectionProps {
  groups: YearCourseGroup[];
  enrolledCourseIds: string[];
  enrollments: Record<string, string>;
  toggleEnrollment: (courseId: string, enrollmentId: string | null) => void;
  isEnrolledList?: boolean;
  emptyMessage: string;
  user: any;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
    },
  },
};

const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
};

const GroupedCourseSection: React.FC<GroupedCourseSectionProps> = ({
  groups,
  enrolledCourseIds,
  enrollments,
  toggleEnrollment,
  isEnrolledList = false,
  emptyMessage,
  user,
}) => {
  if (groups.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-zinc-800/40 backdrop-blur-md border border-zinc-700/50 shadow-sm text-center">
        <p className="text-zinc-400 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      {groups.map((yearGroup) => (
        <div key={yearGroup.yearLabel} className="space-y-4 sm:space-y-6">
          {/* כותרת שנה - ללא אייקון */}
          <div className="flex items-baseline gap-2 pb-2.5 border-b border-zinc-800">
            <h3 className="text-lg sm:text-2xl font-bold text-zinc-100 tracking-tight">
              {yearGroup.yearLabel}
            </h3>
            <span className="text-xs text-zinc-500 font-medium">
              ({yearGroup.totalCoursesCount} {yearGroup.totalCoursesCount === 1 ? 'קורס' : 'קורסים'})
            </span>
          </div>

          {/* סמסטרים בתוך השנה */}
          <div className="space-y-5 sm:space-y-6 sm:pr-2">
            {yearGroup.semesters.map((semGroup) => (
              <div key={semGroup.semesterKey} className="space-y-2.5 sm:space-y-3">
                {/* כותרת סמסטר */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400/90 shrink-0"></div>
                  <h4 className="text-xs sm:text-base font-semibold text-cyan-300">
                    {semGroup.semesterLabel}
                  </h4>
                  <span className="text-xs text-zinc-500">
                    ({semGroup.courses.length})
                  </span>
                </div>

                {/* בלוקי קורסים - מונפשים ברכות, גלויים, ברורים וממוינים אלפבתית */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
                  variants={gridContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {semGroup.courses.map((course) => {
                    const isEnrolled = enrolledCourseIds.includes(course.$id);
                    return (
                      <motion.div 
                        key={course.$id}
                        variants={cardVariants}
                        whileHover={{ y: -3, transition: { duration: 0.15 } }}
                        whileTap={{ scale: 0.99 }}
                        className="group relative p-4 sm:p-6 rounded-2xl bg-zinc-800/70 hover:bg-zinc-800/95 border border-zinc-700/60 hover:border-cyan-500/80 shadow-sm hover:shadow-lg hover:shadow-cyan-950/20 transition-colors duration-200 flex flex-col justify-between"
                      >
                        {/* קישור לחיץ על כל שטח הכרטיס */}
                        <Link 
                          to={`/course/${course.$id}`} 
                          className="absolute inset-0 z-0 rounded-2xl" 
                          aria-label={course.name}
                        />

                        {/* שורה עליונה: שם הקורס (לא נחתך) וכפתור שמירה למועדפים */}
                        <div className="relative z-10 flex items-start justify-between gap-3">
                          <Link to={`/course/${course.$id}`} className="min-w-0 flex-1">
                            <h3 className="text-base sm:text-xl font-bold text-zinc-100 group-hover:text-cyan-400 transition-colors leading-snug break-words">
                              {course.name}
                            </h3>
                          </Link>

                          {user && (
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleEnrollment(course.$id, enrollments[course.$id] || null);
                              }} 
                              className={`p-2 rounded-xl transition-colors cursor-pointer shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 -mt-2 sm:mr-0 sm:mt-0 ${
                                isEnrolled
                                  ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40'
                                  : 'text-zinc-400 hover:text-cyan-400 hover:bg-zinc-700/40'
                              }`}
                              title={isEnrolled ? 'הסר מהקורסים שלי' : 'הוסף לקורסים שלי'}
                              aria-label={isEnrolled ? 'הסר מהקורסים שלי' : 'הוסף לקורסים שלי'}
                            >
                              {isEnrolled ? (
                                <BookmarkCheck className="w-5 h-5" />
                              ) : (
                                <BookmarkPlus className="w-5 h-5" />
                              )}
                            </button>
                          )}
                        </div>

                        {/* נתוני הקורס: מספר קורס, שנה, סמסטר - מוצגים מתחת לשם הקורס */}
                        <div className="relative z-10 mt-3 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <span className={`text-xs font-mono px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md font-semibold ${
                            isEnrolledList 
                              ? 'bg-cyan-900/50 text-cyan-300 border border-cyan-800/60' 
                              : 'bg-zinc-800 text-zinc-300 border border-zinc-700/60'
                          }`}>
                            {course.number}
                          </span>
                          {course.year && (
                            <span className="text-xs bg-zinc-800/90 text-zinc-300 border border-zinc-700/60 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md font-medium">
                              {formatYear(course.year)}
                            </span>
                          )}
                          {(course.Semester || course.semester) && (
                            <span className="text-xs bg-zinc-800/90 text-zinc-300 border border-zinc-700/60 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md font-medium">
                              {formatSemester(course.Semester || course.semester)}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const CourseSkeleton = () => (
  <div className="space-y-6 sm:space-y-8 animate-pulse">
    <div className="h-7 w-32 bg-zinc-800/70 rounded-lg" />
    <div className="space-y-3">
      <div className="h-5 w-24 bg-zinc-800/50 rounded-md" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 sm:p-6 rounded-2xl bg-zinc-800/40 border border-zinc-700/40 space-y-4">
            <div className="h-6 w-3/4 bg-zinc-700/40 rounded-lg" />
            <div className="flex gap-2">
              <div className="h-5 w-16 bg-zinc-700/30 rounded-md" />
              <div className="h-5 w-14 bg-zinc-700/30 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut',
    },
  },
};

const Home = () => {
  const { user, isAdmin } = useAuthStore();
  const { cacheCourse } = useBreadcrumbStore();
  const [courses, setCourses] = useState<any[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [enrollments, setEnrollments] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      setErrorMsg(null);
      const res = await api.getCourses();
      const docs = res.documents || [];
      setCourses(docs);

      // Pre-seed breadcrumbs course cache
      docs.forEach((c: any) => {
        if (c.$id && c.name) {
          cacheCourse(c.$id, { name: c.name, number: c.number });
        }
      });

      // Fetch enrollments if user is logged in
      if (user) {
        try {
          const enrollRes = await api.getEnrollments(user.$id);
          const ids = enrollRes.documents.map((e: any) => e.courseID);
          const map: Record<string, string> = {};
          enrollRes.documents.forEach((e: any) => {
            map[e.courseID] = e.$id;
          });
          setEnrolledCourseIds(ids);
          setEnrollments(map);
        } catch (e: any) {
          console.error('Error fetching enrollments', e);
          if (e.code === 404) {
            console.warn('Collection "enrollments" not found. Check your collection ID.');
          } else if (e.message?.includes('index')) {
            console.warn('Missing index for "userID" in "enrollments" collection. Create it in Appwrite Console.');
          }
          setEnrolledCourseIds([]);
          setEnrollments({});
        }
      } else {
        setEnrolledCourseIds([]);
        setEnrollments({});
      }
    } catch (error: any) {
      console.error('Error fetching courses', error);
      if (error.message === 'Failed to fetch') {
        setErrorMsg('שגיאת רשת (CORS). עליך להוסיף את כתובת האתר הנוכחית (App URL) ל-Web Platforms בפרויקט Appwrite שלך: כנס ל-Appwrite -> הפרויקט שלך -> Add Platform -> Web App -> הכנס את הכתובת ללא לוכסן בסוף.');
      } else {
        setErrorMsg(error.message || 'Failed to fetch');
      }
    } finally {
      setIsInitialLoading(false);
    }
  }, [user]);

  const toggleEnrollment = async (courseId: string, enrollmentId: string | null) => {
    if (!user) return;

    try {
      if (enrollmentId) {
        await api.deleteEnrollment(enrollmentId);
        setEnrolledCourseIds(prev => prev.filter(id => id !== courseId));
        setEnrollments(prev => {
          const next = { ...prev };
          delete next[courseId];
          return next;
        });
      } else {
        const res = await api.createEnrollment(user.$id, courseId);
        setEnrolledCourseIds(prev => [...prev, courseId]);
        setEnrollments(prev => ({ ...prev, [courseId]: res.$id }));
      }
      fetchCourses();
    } catch (error) {
      console.error('Error toggling enrollment', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses, user]);

  const searchNormalized = deferredSearch.trim().toLowerCase();

  // Enrolled courses filtered by search and grouped by Year -> Semester -> Alphabetical
  const enrolledGroups = useMemo(() => {
    const list = courses.filter(c => {
      if (!enrolledCourseIds.includes(c.$id)) return false;
      if (!searchNormalized) return true;
      return (
        (c.name && c.name.toLowerCase().includes(searchNormalized)) ||
        (c.number && c.number.toLowerCase().includes(searchNormalized))
      );
    });
    return groupCoursesByYearAndSemester(list);
  }, [courses, enrolledCourseIds, searchNormalized]);

  // All / other courses filtered by search and grouped by Year -> Semester -> Alphabetical
  const allCourseGroups = useMemo(() => {
    const list = courses.filter(c => {
      if (user && enrolledCourseIds.includes(c.$id)) return false;
      if (!searchNormalized) return true;
      return (
        (c.name && c.name.toLowerCase().includes(searchNormalized)) ||
        (c.number && c.number.toLowerCase().includes(searchNormalized))
      );
    });
    return groupCoursesByYearAndSemester(list);
  }, [courses, enrolledCourseIds, user, searchNormalized]);

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center pt-2 sm:pt-10 px-1 sm:px-4" dir="rtl">
      <motion.div 
        className="w-full max-w-3xl z-30"
        variants={heroContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={heroItemVariants} className="text-center mb-6 sm:mb-8">
          <div className="relative inline-block">
            <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 blur-2xl opacity-60 rounded-full pointer-events-none" />
            <h1 className="relative text-3xl sm:text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Mr.Summaries
            </h1>
          </div>
          <p className="text-zinc-400 mt-2.5 text-xs sm:text-base max-w-md mx-auto leading-relaxed">
            סילבוסים, סיכומים, הגדרות ומשפטים ממוינים לפי שנים וסמסטרים
          </p>
        </motion.div>

        <motion.div variants={heroItemVariants} className="relative group">
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-cyan-400 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-4 pr-11 sm:pr-12 py-3 sm:py-4 border border-zinc-700/60 rounded-xl sm:rounded-2xl leading-5 bg-zinc-850 bg-zinc-800/70 backdrop-blur-xl placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/80 focus:border-cyan-500 text-sm sm:text-lg transition-all shadow-sm group-hover:shadow-md text-zinc-100 min-h-[48px]"
            placeholder="חיפוש קורסים לפי שם או מספר..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </motion.div>

        {isAdmin && (
          <motion.div variants={heroItemVariants} className="mt-4 flex justify-end">
            <button 
              onClick={() => setIsCourseModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 active:bg-cyan-800 transition-colors shadow-sm cursor-pointer font-medium text-sm min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              הוסף קורס
            </button>
          </motion.div>
        )}

        <motion.div variants={heroItemVariants} className="mt-8 sm:mt-10 space-y-10 sm:space-y-12 pb-24 sm:pb-32">
          {errorMsg && (
            <div className="p-4 bg-red-900/30 backdrop-blur-md border border-red-800 rounded-xl text-red-400 text-sm">
              <p className="font-bold mb-1">שגיאת התחברות ל-Appwrite:</p>
              <p className="font-mono text-xs sm:text-sm break-all" dir="ltr">{errorMsg}</p>
            </div>
          )}

          {isInitialLoading ? (
            <CourseSkeleton />
          ) : (
            <>
              {user && (
                <section>
                  <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-5 text-zinc-100 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                    הקורסים שלי
                  </h2>
                  <GroupedCourseSection
                    groups={enrolledGroups}
                    enrolledCourseIds={enrolledCourseIds}
                    enrollments={enrollments}
                    toggleEnrollment={toggleEnrollment}
                    isEnrolledList={true}
                    emptyMessage={searchNormalized ? 'לא נמצאו קורסים רשומים התואמים לחיפוש.' : 'אין קורסים רשומים עדיין.'}
                    user={user}
                  />
                </section>
              )}

              <section>
                <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-5 text-zinc-100 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400" />
                  {user ? 'קורסים נוספים' : 'כל הקורסים'}
                </h2>
                <GroupedCourseSection
                  groups={allCourseGroups}
                  enrolledCourseIds={enrolledCourseIds}
                  enrollments={enrollments}
                  toggleEnrollment={toggleEnrollment}
                  isEnrolledList={false}
                  emptyMessage={searchNormalized ? 'לא נמצאו קורסים התואמים את החיפוש.' : 'אין קורסים זמינים.'}
                  user={user}
                />
              </section>
            </>
          )}
        </motion.div>
      </motion.div>

      <CourseModal 
        isOpen={isCourseModalOpen} 
        onClose={() => setIsCourseModalOpen(false)} 
        onSave={fetchCourses} 
      />
    </div>
  );
};

export default Home;
