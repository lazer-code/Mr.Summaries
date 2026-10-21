import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowRight, Edit2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'motion/react';
import { NestedMarkdown } from '../components/NestedMarkdown';
import { ContentModal } from '../components/ContentModal';
import { PdfTextRenderer } from '../components/PdfTextRenderer';

const Lecture = () => {
  const { id } = useParams();
  const { isAdmin } = useAuthStore();
  const [lecture, setLecture] = useState<any>(null);
  const [content, setContent] = useState<string>('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLecture = useCallback(async () => {
    try {
      const res = await api.getLecture(id!);
      setLecture(res);

      if (res.fileID) {
        try {
          const file = await api.getFile(res.fileID);
          
          if (file.mimeType === 'application/pdf') {
            setPdfUrl(await api.getFileView(res.fileID));
            setContent('');
          } else {
            setPdfUrl(null);
            const urlToFetch = await api.getFileView(res.fileID);

            const fileRes = await fetch(urlToFetch, {
              credentials: 'include'
            });
            
            const contentType = fileRes.headers.get('content-type');
            const isHtml = contentType?.includes('text/html');
            
            if (fileRes.ok && !isHtml) {
              const text = await fileRes.text();
              setContent(text);
            } else {
              console.error('Fetch failed or returned HTML:', fileRes.status, contentType);
              setContent('לא ניתן לטעון את התוכן. ייתכן שאין הרשאות מתאימות.');
            }
          }
        } catch (e: any) {
          console.error('Error fetching lecture content:', e);
          if (e.message === 'Failed to fetch') {
            setContent('שגיאת רשת (CORS). עליך להוסיף את כתובת האתר הנוכחית (App URL) ל-Web Platforms בפרויקט Appwrite שלך.');
          } else {
            setContent('שגיאה בטעינת התוכן מהשרת.');
          }
        }
      } else {
        setContent('לא נמצא תוכן להרצאה זו.');
      }
    } catch (error: any) {
      if (error.code === 404) {
        setLecture(null);
      } else {
        console.error('Error fetching lecture', error);
        setContent('שגיאה בטעינת התוכן.');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLecture();
  }, [fetchLecture]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">טוען...</div>;
  }

  if (!lecture) {
    return <div className="text-center text-red-500">הרצאה לא נמצאה</div>;
  }

  const getCourseId = () => {
    if (!lecture?.courses) return '';
    if (typeof lecture.courses === 'string') return lecture.courses;
    if (Array.isArray(lecture.courses)) {
      return lecture.courses[0]?.$id || lecture.courses[0] || '';
    }
    return lecture.courses.$id || '';
  };

  const courseId = getCourseId();
  const courseNumber = lecture?.courses?.number || (Array.isArray(lecture?.courses) ? lecture.courses[0]?.number : '');

  return (
    <div className="max-w-5xl mx-auto px-1 sm:px-4" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6 sm:mb-8">
        <div className="min-w-0 flex-1">
          {courseId ? (
            <Link to={`/course/${courseId}?tab=lectures`} className="inline-flex items-center gap-2 text-cyan-400 hover:underline mb-2 sm:mb-4 text-xs sm:text-sm font-medium min-h-[36px]">
              <ArrowRight className="w-4 h-4 shrink-0" />
              חזרה להרצאות
            </Link>
          ) : (
            <Link to="/" className="inline-flex items-center gap-2 text-cyan-400 hover:underline mb-2 sm:mb-4 text-xs sm:text-sm font-medium min-h-[36px]">
              <ArrowRight className="w-4 h-4 shrink-0" />
              חזרה לדף הבית
            </Link>
          )}
          <h1 className="text-2xl sm:text-4xl font-bold text-zinc-50 mb-2 break-words leading-tight">
            {lecture.name}
          </h1>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="self-start flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl hover:bg-zinc-700 active:bg-zinc-650 transition-colors border border-zinc-700/60 text-xs sm:text-sm font-medium min-h-[44px] cursor-pointer shrink-0"
          >
            <Edit2 className="w-4 h-4 shrink-0" />
            <span>ערוך הרצאה</span>
          </button>
        )}
      </div>

      {pdfUrl ? (
        <PdfTextRenderer url={pdfUrl} rightAlign={lecture.rightAlign} />
      ) : (
        <NestedMarkdown 
          content={content} 
          rightAlign={lecture.rightAlign} 
        />
      )}

      <ContentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={fetchLecture} 
        item={lecture}
        courseNumber={courseNumber}
        type="lecture"
      />
    </div>
  );
};

export default Lecture;
