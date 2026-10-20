import React, { useEffect, useState, useMemo, useDeferredValue, useCallback } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Plus, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
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
  containerVariants: any;
  itemVariants: any;
}

const GroupedCourseSection: React.FC<GroupedCourseSectionProps> = ({
  groups,
  enrolledCourseIds,
  enrollments,
  toggleEnrollment,
  isEnrolledList = false,
  emptyMessage,
  user,
  containerVariants,
  itemVariants
}) => {
  if (groups.length === 0) {
    return (
      <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-zinc-800/40 backdrop-blur-md border border-zinc-700/50 shadow-sm opacity-60 text-center">
        <p className="text-zinc-400 text-sm">{emptyMessage}</p>
      </motion.div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-10">
      {groups.map((yearGroup) => (
        <div key={yearGroup.yearLabel} className="space-y-6">
          {/* כותרת שנה */}
          <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
            <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 font-bold text-sm shadow-sm shrink-0">
              {yearGroup.yearNumeric ? `ש${['א', 'ב', 'ג', 'ד'][yearGroup.yearNumeric - 1] || yearGroup.yearNumeric}` : '•'}
            </div>
            <div className="flex items-baseline gap-2.5">
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
                {yearGroup.yearLabel}
              </h3>
              <span className="text-xs text-zinc-500 font-medium">
                ({yearGroup.totalCoursesCount} {yearGroup.totalCoursesCount === 1 ? 'קורס' : 'קורסים'})
              </span>
            </div>
          </div>

          {/* סמסטרים בתוך השנה */}
          <div className="space-y-6 sm:pr-2">
            {yearGroup.semesters.map((semGroup) => (
              <div key={semGroup.semesterKey} className="space-y-3">
                {/* כותרת סמסטר */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400/90 shrink-0"></div>
                  <h4 className="text-sm sm:text-base font-semibold text-cyan-300">
                    {semGroup.semesterLabel}
                  </h4>
                  <span className="text-xs text-zinc-500">
                    ({semGroup.courses.length})
                  </span>
                </div>

                {/* גריד קורסים ממוין אלפבתית */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {semGroup.courses.map((course) => {
                    const isEnrolled = enrolledCourseIds.includes(course.$id);
                    return (
                      <motion.div key={course.$id} variants={itemVariants}>
                        <div className="block group p-6 rounded-2xl bg-zinc-800/40 backdrop-blur-md border border-zinc-700/50 shadow-sm hover:shadow-md hover:border-cyan-500 transition-all">
                          <div className="flex justify-between items-start mb-2">
                            <Link to={`/course/${course.$id}`} className="min-w-0 flex-1 ml-2">
                              <h3 className="text-xl font-semibold text-zinc-100 group-hover:text-cyan-400 transition-colors truncate">
                                {course.name}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-1.5 flex-wrap justify-end shrink-0">
                              <span className={`text-xs font-mono px-2 py-0.5 rounded-md ${
                                isEnrolledList 
                                  ? 'bg-cyan-900/50 text-cyan-300' 
                                  : 'bg-zinc-800 text-zinc-300 border border-zinc-700/60'
                              }`}>
                                {course.number}
                              </span>
                              {course.year && (
                                <span className="text-xs bg-zinc-800/90 text-zinc-300 border border-zinc-700/60 px-2 py-0.5 rounded-md">
                                  {formatYear(course.year)}
                                </span>
                              )}
                              {(course.Semester || course.semester) && (
                                <span className="text-xs bg-zinc-800/90 text-zinc-300 border border-zinc-700/60 px-2 py-0.5 rounded-md">
                                  {formatSemester(course.Semester || course.semester)}
                                </span>
                              )}
                              {user && (
                                <button 
                                  type="button"
                                  onClick={() => toggleEnrollment(course.$id, enrollments[course.$id] || null)} 
                                  className={`p-1 rounded-lg transition-colors mr-1 cursor-pointer ${
                                    isEnrolled
                                      ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40'
                                      : 'text-zinc-400 hover:text-cyan-400 hover:bg-zinc-700/40'
                                  }`}
                                  title={isEnrolled ? 'הסר מהקורסים שלי' : 'הוסף לקורסים שלי'}
                                >
                                  {isEnrolled ? (
                                    <BookmarkCheck className="w-5 h-5" />
                                  ) : (
                                    <BookmarkPlus className="w-5 h-5" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-zinc-400 group-hover:text-zinc-300 text-sm line-clamp-2 transition-colors">
                            לחץ לצפייה בסילבוס, סיכומים, הגדרות ומשפטים.
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

const Home = () => {
  const { user, isAdmin } = useAuthStore();
  const [courses, setCourses] = useState<any[]>([]);
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
      setCourses(res.documents);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  } as const;

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center pt-32" dir="rtl">
      <motion.div 
        initial={{ top: '40%', left: '50%', x: '-50%', y: '-50%', scale: 1, opacity: 1 }}
        animate={{ top: '10%', left: '50%', x: '-50%', y: '-50%', scale: 0.8, opacity: 0 }}
        transition={{ delay: 1, duration: 0.8, ease: "easeInOut" }}
        className="fixed z-40 pointer-events-none"
      >
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-r from-cyan-500 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm whitespace-nowrap">
          Mr.Summaries
        </h1>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-3xl z-30 mt-12"
      >
        <div className="relative group">
          <div className="absolute inset-y-0 right-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-400 mr-3" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-12 py-4 border border-zinc-700/50 rounded-2xl leading-5 bg-zinc-800/40 backdrop-blur-xl placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-lg transition-all shadow-sm group-hover:shadow-md text-zinc-100"
            placeholder="חיפוש קורסים וסיכומים..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isAdmin && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="mt-6 flex justify-end"
          >
            <button 
              onClick={() => setIsCourseModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              הוסף קורס
            </button>
          </motion.div>
        )}

        <div className="mt-12 space-y-12 pb-32">
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-red-900/30 backdrop-blur-md border border-red-800 rounded-xl text-red-400"
            >
              <p className="font-bold mb-1">שגיאת התחברות ל-Appwrite:</p>
              <p className="font-mono text-sm" dir="ltr">{errorMsg}</p>
            </motion.div>
          )}

          {user && (
            <section>
              <h2 className="text-2xl font-bold mb-6 text-zinc-100 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-cyan-500" />
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
                containerVariants={containerVariants}
                itemVariants={itemVariants}
              />
            </section>
          )}

          <section>
            <h2 className="text-2xl font-bold mb-6 text-zinc-100 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-zinc-500" />
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
              containerVariants={containerVariants}
              itemVariants={itemVariants}
            />
          </section>
        </div>
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
