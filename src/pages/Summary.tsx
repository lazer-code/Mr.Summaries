import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowRight, Edit2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useBreadcrumbStore } from '../store/useBreadcrumbStore';
import { motion } from 'motion/react';
import { NestedMarkdown } from '../components/NestedMarkdown';
import { ContentModal } from '../components/ContentModal';
import { TableOfContents } from '../components/TableOfContents';
import { PdfTextRenderer } from '../components/PdfTextRenderer';

const Summary = () => {
  const { id } = useParams();
  const { isAdmin } = useAuthStore();
  const { setBreadcrumbs, cacheCourse, courseCache } = useBreadcrumbStore();
  const [summary, setSummary] = useState<any>(null);
  const [content, setContent] = useState<string>('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tocItems, setTocItems] = useState<{ id: string, title: string, level: number }[]>([]);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await api.getSummary(id!);
      setSummary(res);

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
          console.error('Error fetching summary content:', e);
          if (e.message === 'Failed to fetch') {
            setContent('שגיאת רשת (CORS). עליך להוסיף את כתובת האתר הנוכחית (App URL) ל-Web Platforms בפרויקט Appwrite שלך.');
          } else {
            setContent('שגיאה בטעינת התוכן מהשרת.');
          }
        }
      } else {
        setContent('לא נמצא תוכן לסיכום זה.');
      }
    } catch (error: any) {
      if (error.code === 404) {
        setSummary(null);
      } else {
        console.error('Error fetching summary', error);
        setContent('שגיאה בטעינת התוכן.');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    if (!summary) return;

    const courseObj = Array.isArray(summary.courses) ? summary.courses[0] : summary.courses;
    const courseId = typeof courseObj === 'string' ? courseObj : courseObj?.$id || '';
    const courseObjName = typeof courseObj === 'object' ? courseObj?.name : '';

    const courseName = courseObjName || (courseId ? courseCache[courseId]?.name : '') || 'קורס';

    if (courseId && courseObjName) {
      cacheCourse(courseId, { name: courseObjName, number: courseObj?.number });
    } else if (courseId && !courseCache[courseId]) {
      api.getCourse(courseId).then((c) => {
        if (c && c.name) {
          cacheCourse(courseId, { name: c.name, number: c.number });
        }
      }).catch(() => {});
    }

    setBreadcrumbs([
      { label: 'דף הבית', to: '/', icon: 'home' },
      { label: courseName, to: courseId ? `/course/${courseId}` : undefined, icon: 'course' },
      { label: 'סיכומים', to: courseId ? `/course/${courseId}?tab=summaries` : undefined, icon: 'summaries' },
      { label: summary.name, icon: 'summary' },
    ]);
  }, [summary, courseCache, setBreadcrumbs, cacheCourse]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">טוען...</div>;
  }

  if (!summary) {
    return <div className="text-center text-red-500">סיכום לא נמצא</div>;
  }

  const getCourseId = () => {
    if (!summary?.courses) return '';
    if (typeof summary.courses === 'string') return summary.courses;
    if (Array.isArray(summary.courses)) {
      return summary.courses[0]?.$id || summary.courses[0] || '';
    }
    return summary.courses.$id || '';
  };

  const courseId = getCourseId();
  const courseNumber = summary?.courses?.number || (Array.isArray(summary?.courses) ? summary.courses[0]?.number : '');

  return (
    <div className="max-w-7xl mx-auto px-1 sm:px-4" dir="rtl">
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 justify-center">
        <div className="flex-grow max-w-5xl min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6 sm:mb-8">
            <div className="min-w-0 flex-1">
              {courseId ? (
                <Link to={`/course/${courseId}?tab=summaries`} className="inline-flex items-center gap-2 text-cyan-400 hover:underline mb-2 sm:mb-4 text-xs sm:text-sm font-medium min-h-[36px]">
                  <ArrowRight className="w-4 h-4 shrink-0" />
                  חזרה לסיכומים
                </Link>
              ) : (
                <Link to="/" className="inline-flex items-center gap-2 text-cyan-400 hover:underline mb-2 sm:mb-4 text-xs sm:text-sm font-medium min-h-[36px]">
                  <ArrowRight className="w-4 h-4 shrink-0" />
                  חזרה לדף הבית
                </Link>
              )}
              <h1 className="text-2xl sm:text-4xl font-bold text-zinc-50 mb-2 break-words leading-tight">
                {summary.name}
              </h1>
            </div>
            {isAdmin && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="self-start flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl hover:bg-zinc-700 active:bg-zinc-650 transition-colors border border-zinc-700/60 text-xs sm:text-sm font-medium min-h-[44px] cursor-pointer shrink-0"
              >
                <Edit2 className="w-4 h-4 shrink-0" />
                <span>ערוך סיכום</span>
              </button>
            )}
          </div>

          {pdfUrl ? (
            <PdfTextRenderer url={pdfUrl} rightAlign={summary.rightAlign} />
          ) : (
            <NestedMarkdown 
              content={content} 
              rightAlign={summary.rightAlign} 
              onTOCChange={setTocItems}
            />
          )}
        </div>

        {!pdfUrl && <TableOfContents items={tocItems} />}
      </div>

      <ContentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={fetchSummary} 
        item={summary}
        courseNumber={courseNumber}
        type="summary"
      />
    </div>
  );
};

export default Summary;
