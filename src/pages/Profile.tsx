import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../services/api';
import { User, Mail, Shield, BookOpen, Trash2, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, isAdmin, updateName, updateEmail } = useAuthStore();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState(''); // Needed for email update
  
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;
      try {
        // Fetch all enrollments for this user
        const enrollmentRes = await api.getEnrollments(user.$id);

        if (enrollmentRes.total > 0) {
          const enrolled = await Promise.all(enrollmentRes.documents.map(async (enrollment: any) => {
            try {
              const course = await api.getCourse(enrollment.courseID);
              return { ...course, enrollmentId: enrollment.$id };
            } catch (e) {
              return null;
            }
          }));
          
          setEnrolledCourses(enrolled.filter(c => c !== null));
        } else {
          setEnrolledCourses([]);
        }
      } catch (error) {
        console.error('Error fetching enrolled courses', error);
      }
    };
    fetchCourses();
  }, [user]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingName(true);
    setMessage({ text: '', type: '' });
    try {
      await updateName(name);
      setMessage({ text: 'השם עודכן בהצלחה', type: 'success' });
    } catch (error: any) {
      setMessage({ text: error.message || 'שגיאה בעדכון השם', type: 'error' });
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setMessage({ text: 'יש להזין סיסמה כדי לעדכן אימייל', type: 'error' });
      return;
    }
    setIsUpdatingEmail(true);
    setMessage({ text: '', type: '' });
    try {
      await updateEmail(email, password);
      setMessage({ text: 'האימייל עודכן בהצלחה', type: 'success' });
      setPassword('');
    } catch (error: any) {
      setMessage({ text: error.message || 'שגיאה בעדכון האימייל', type: 'error' });
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const removeCourse = async (enrollmentId: string) => {
    try {
      await api.deleteEnrollment(enrollmentId);
      setEnrolledCourses(prev => prev.filter(c => c.enrollmentId !== enrollmentId));
    } catch (error) {
      console.error('Error removing course', error);
    }
  };

  if (!user) {
    return <div className="text-center py-12">יש להתחבר כדי לצפות בפרופיל.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 px-1 sm:px-0" dir="rtl">
      <div className="flex items-center gap-3.5 sm:gap-4 mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-cyan-900/50 rounded-2xl sm:rounded-full flex items-center justify-center text-cyan-400 shrink-0">
          <User className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-50">הפרופיל שלי</h1>
          <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2">
            <Shield className={`w-4 h-4 ${isAdmin ? 'text-emerald-500' : 'text-zinc-400'}`} />
            <span className={`text-xs sm:text-sm font-medium ${isAdmin ? 'text-emerald-400' : 'text-zinc-400'}`}>
              סטטוס: {isAdmin ? 'מנהל מערכת' : 'משתמש רגיל'}
            </span>
          </div>
        </div>
      </div>

      {message.text && (
        <div className={`p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm ${message.type === 'success' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800' : 'bg-red-900/30 text-red-400 border border-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
        {/* Update Name */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/60 backdrop-blur-xl p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-zinc-800/50 shadow-sm"
        >
          <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-500 shrink-0" />
            עדכון פרטים
          </h2>
          <form onSubmit={handleUpdateName} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-zinc-300 mb-1.5">שם מלא</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 sm:px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-100 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-sm min-h-[44px]"
              />
            </div>
            <button
              type="submit"
              disabled={isUpdatingName || name === user.name}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 active:bg-cyan-800 disabled:opacity-50 transition-colors text-xs sm:text-sm font-medium min-h-[44px] cursor-pointer"
            >
              <Save className="w-4 h-4 shrink-0" />
              <span>{isUpdatingName ? 'שומר...' : 'שמור שם'}</span>
            </button>
          </form>
        </motion.div>

        {/* Update Email */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/60 backdrop-blur-xl p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-zinc-800/50 shadow-sm"
        >
          <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-500 shrink-0" />
            עדכון אימייל
          </h2>
          <form onSubmit={handleUpdateEmail} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-zinc-300 mb-1.5">אימייל חדש</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                dir="ltr"
                className="w-full px-3.5 sm:px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-100 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-sm min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-zinc-300 mb-1.5">סיסמה נוכחית (לאימות)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                dir="ltr"
                className="w-full px-3.5 sm:px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-100 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-sm min-h-[44px]"
              />
            </div>
            <button
              type="submit"
              disabled={isUpdatingEmail || !password || email === user.email}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 active:bg-cyan-800 disabled:opacity-50 transition-colors text-xs sm:text-sm font-medium min-h-[44px] cursor-pointer"
            >
              <Save className="w-4 h-4 shrink-0" />
              <span>{isUpdatingEmail ? 'שומר...' : 'שמור אימייל'}</span>
            </button>
          </form>
        </motion.div>
      </div>

      {/* Manage Courses */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-zinc-900/60 backdrop-blur-xl p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-zinc-800/50 shadow-sm"
      >
        <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-500 shrink-0" />
          ניהול קורסים
        </h2>
        
        {enrolledCourses.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {enrolledCourses.map(course => (
              <div key={course.$id} className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-zinc-800/50 border border-zinc-700/50 gap-3">
                <div className="min-w-0 flex-1">
                  <Link to={`/course/${course.$id}`} className="font-semibold text-cyan-400 hover:underline text-sm sm:text-base break-words block">
                    {course.name}
                  </Link>
                  <div className="text-xs sm:text-sm text-zinc-400 mt-0.5">{course.number}</div>
                </div>
                <button
                  onClick={() => removeCourse(course.enrollmentId)}
                  className="p-2.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 active:bg-red-900/30 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shrink-0"
                  title="הסר קורס"
                  aria-label="הסר קורס"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-400 text-sm">לא נרשמת לאף קורס עדיין.</p>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
