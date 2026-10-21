import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Loader2, Eye, Edit3 } from 'lucide-react';
import { api } from '../services/api';
import { NestedMarkdown } from './NestedMarkdown';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  course?: any; // If provided, we are editing
}

const fetchFileContent = async (fileId: string) => {
  if (!fileId) return '';
  try {
    const url = await api.getFileView(fileId);
    const res = await fetch(url);
    const isHtml = res.headers.get('content-type')?.includes('text/html');
    if (res.ok && !isHtml) {
      return await res.text();
    }
    return fileId;
  } catch (e) {
    return fileId;
  }
};

const uploadContent = async (content: string, filename: string, oldFileId?: string) => {
  if (!content.trim()) {
    if (oldFileId) {
      try {
        await api.deleteFile(oldFileId);
      } catch (e) {}
    }
    return '';
  }

  const file = new File([content], filename, { type: 'text/markdown' });
  const res = await api.createFile(file);
  
  if (oldFileId) {
    try {
      await api.deleteFile(oldFileId);
    } catch (e) {}
  }

  return res.$id;
};

export const CourseModal: React.FC<CourseModalProps> = React.memo(({ isOpen, onClose, onSave, course }) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [year, setYear] = useState<number | string>(1);
  const [semester, setSemester] = useState<string>('A');
  const [rightAlign, setRightAlign] = useState(false);
  const [overviewContent, setOverviewContent] = useState('');
  const [overviewUrl, setOverviewUrl] = useState('');
  const [origOverview, setOrigOverview] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [error, setError] = useState('');
  
  const [overviewFileType, setOverviewFileType] = useState<'md' | 'pdf'>('md');
  const [newOverviewFile, setNewOverviewFile] = useState<File | null>(null);

  const handleDelete = async () => {
    if (!course || !confirm('האם אתה בטוח שברצונך למחוק קורס זה?')) return;
    setIsDeleting(true);
    setError('');
    try {
      const filesToDelete = [course.overviewID, course.definitionsID, course.claimsID].filter(Boolean);
      for (const fileId of filesToDelete) {
        try {
          await api.deleteFile(fileId);
        } catch (e) {
          console.error('Error deleting file:', e);
        }
      }
      await api.deleteCourse(course.$id);
      onSave();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'שגיאה במחיקת הקורס');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (course) {
        setName(course.name || '');
        setNumber(course.number || '');
        const initialYear = course.year !== undefined && course.year !== null
          ? (Number(course.year) >= 1 && Number(course.year) <= 4 ? Number(course.year) : course.year)
          : 1;
        setYear(initialYear);
        setSemester(course.Semester || course.semester || 'A');
        setRightAlign(course.rightAlign || false);
        
        const loadContents = async () => {
          setIsLoadingContent(true);

          const checkFileType = async (fileId: string) => {
            try {
              const file = await api.getFile(fileId);
              if (file.mimeType === 'application/pdf') return 'pdf';
              return 'md';
            } catch (e) {
              return 'md';
            }
          };

          const [ov, ovUrl] = await Promise.all([
            fetchFileContent(course.overviewID),
            course.overviewID ? api.getFileView(course.overviewID) : Promise.resolve('')
          ]);
          
          setOverviewFileType(await checkFileType(course.overviewID));
          setOverviewContent(ov);
          setOverviewUrl(ovUrl);
          setOrigOverview(ov);
          setIsLoadingContent(false);
        };
        loadContents();
      } else {
        setName('');
        setNumber('');
        setYear(1);
        setSemester('A');
        setRightAlign(false);
        setOverviewContent('');
        setOverviewUrl('');
        setOrigOverview('');
        setOverviewFileType('md');
        setNewOverviewFile(null);
      }
    }
  }, [course, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const courseNum = number.trim().replace(/[^a-zA-Z0-9._-]/g, '');
      const isNumberChanged = course && courseNum !== course.number?.trim().replace(/[^a-zA-Z0-9._-]/g, '');
      
      const uploadFile = async (contentOrFile: string | File, id: string, oldFileId: string, type: 'md' | 'pdf') => {
        if (type === 'pdf') {
          if (contentOrFile instanceof File) {
            const res = await api.createFile(contentOrFile);
            if (oldFileId) {
              try {
                await api.deleteFile(oldFileId);
              } catch (e) {}
            }
            return res.$id;
          }
          return oldFileId;
        } else {
          const content = contentOrFile instanceof File ? await contentOrFile.text() : contentOrFile;
          const filename = `${id}.${type}`;
          return await uploadContent(content, filename, oldFileId);
        }
      };

      let finalOvId = course?.overviewID || '';
      if (overviewFileType === 'pdf') {
        if (newOverviewFile) finalOvId = await uploadFile(newOverviewFile, `overview-${courseNum}`.toLowerCase(), finalOvId, 'pdf');
      } else if (overviewContent !== origOverview || isNumberChanged) {
        const id = `overview-${courseNum}`.toLowerCase();
        finalOvId = await uploadFile(overviewContent, id, finalOvId, overviewFileType);
      }

      const parsedYear = year ? parseInt(year.toString(), 10) : null;
      const data: any = {
        name,
        number: courseNum,
        year: isNaN(parsedYear as number) ? null : parsedYear,
        Semester: semester || null,
        rightAlign,
        overviewID: finalOvId
      };

      if (course) {
        if (course.definitionsID !== undefined) data.definitionsID = course.definitionsID;
        if (course.claimsID !== undefined) data.claimsID = course.claimsID;
        await api.updateCourse(course.$id, data);
      } else {
        data.definitionsID = null;
        data.claimsID = null;
        const docId = courseNum.trim();
        await api.createCourse(docId, data);
      }
      onSave();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'שגיאה בשמירת הקורס');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-6" dir="rtl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-7xl max-h-[92vh] sm:max-h-[90vh] flex flex-col bg-zinc-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-zinc-800 overflow-hidden"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-md shrink-0">
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-50">
                {course ? 'עריכת קורס' : 'הוספת קורס חדש'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                aria-label="סגור"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto flex-1">
              {error && (
                <div className="p-3.5 sm:p-4 bg-red-900/30 text-red-400 rounded-xl text-xs sm:text-sm border border-red-800">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-zinc-300 mb-1.5 sm:mb-2">שם הקורס</label>
                  <input
                    type="text"
                    required
                    disabled={isLoadingContent}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-100 focus:ring-2 focus:ring-cyan-500 outline-none transition-all disabled:opacity-50 text-sm min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-zinc-300 mb-1.5 sm:mb-2">מספר הקורס</label>
                  <input
                    type="text"
                    required
                    disabled={isLoadingContent}
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-100 focus:ring-2 focus:ring-cyan-500 outline-none transition-all disabled:opacity-50 text-sm min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-zinc-300 mb-1.5 sm:mb-2">שנת לימוד בתואר</label>
                  <select
                    disabled={isLoadingContent}
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-100 focus:ring-2 focus:ring-cyan-500 outline-none transition-all disabled:opacity-50 text-sm min-h-[44px]"
                  >
                    <option value={1}>שנה א'</option>
                    <option value={2}>שנה ב'</option>
                    <option value={3}>שנה ג'</option>
                    <option value={4}>שנה ד'</option>
                    {year && ![1, 2, 3, 4].includes(Number(year)) && (
                      <option value={year}>{`שנה ${year}`}</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-zinc-300 mb-1.5 sm:mb-2">סמסטר</label>
                  <select
                    disabled={isLoadingContent}
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-100 focus:ring-2 focus:ring-cyan-500 outline-none transition-all disabled:opacity-50 text-sm min-h-[44px]"
                  >
                    <option value="A">סמסטר א' (A)</option>
                    <option value="B">סמסטר ב' (B)</option>
                    <option value="Summer">סמסטר קיץ (Summer)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 min-h-[40px]">
                <input
                  type="checkbox"
                  id="rightAlign"
                  checked={rightAlign}
                  onChange={(e) => setRightAlign(e.target.checked)}
                  className="w-5 h-5 rounded border-zinc-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                />
                <label htmlFor="rightAlign" className="text-xs sm:text-sm font-medium text-zinc-300 cursor-pointer">
                  יישור לימין (RTL)
                </label>
              </div>

              {isLoadingContent ? (
                <div className="flex flex-col items-center justify-center py-12 text-cyan-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-4" />
                  <p className="text-sm">טוען תוכן...</p>
                </div>
              ) : (
                <div className="space-y-6 sm:space-y-8">
                  {/* Overview Section */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <h3 className="text-base sm:text-lg font-bold text-zinc-100">סילבוס / סקירה</h3>
                      <div className="flex items-center gap-1 bg-zinc-800 p-1 rounded-lg">
                        <button type="button" onClick={() => setOverviewFileType('md')} className={`px-2.5 sm:px-3 py-1 rounded-md text-xs transition-colors ${overviewFileType === 'md' ? 'bg-zinc-700 shadow-sm text-zinc-100' : 'text-zinc-500'}`}>Markdown</button>
                        <button type="button" onClick={() => setOverviewFileType('pdf')} className={`px-2.5 sm:px-3 py-1 rounded-md text-xs transition-colors ${overviewFileType === 'pdf' ? 'bg-zinc-700 shadow-sm text-zinc-100' : 'text-zinc-500'}`}>PDF</button>
                      </div>
                    </div>
                    {overviewFileType === 'pdf' ? (
                      <div className="p-4 sm:p-6 bg-amber-900/30 border border-amber-800 rounded-xl text-amber-200 text-sm">
                        <p className="font-bold mb-2">סילבוס זה הוא קובץ PDF.</p>
                        {course?.overviewID && overviewUrl && (
                          <a href={overviewUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline mb-4 block">הורד קובץ PDF קיים</a>
                        )}
                        <p>כדי לעדכן אותו, יש להעלות קובץ PDF חדש.</p>
                        <div className="mt-4">
                          <label className="cursor-pointer inline-flex items-center justify-center bg-cyan-600 text-white px-4 py-2 rounded-xl hover:bg-cyan-700 transition-colors text-xs sm:text-sm font-medium min-h-[44px]">
                            בחר קובץ PDF חדש
                            <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setNewOverviewFile(e.target.files?.[0] || null)} />
                          </label>
                          {newOverviewFile && <p className="mt-2 text-xs sm:text-sm text-zinc-400">{newOverviewFile.name}</p>}
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-xs font-medium text-zinc-400 mb-1">עריכה</label>
                          <textarea
                            rows={8}
                            value={overviewContent}
                            onChange={(e) => setOverviewContent(e.target.value)}
                            className={`w-full px-3.5 sm:px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800 focus:ring-2 focus:ring-cyan-500 outline-none transition-all font-mono text-xs sm:text-sm resize-none ${rightAlign ? 'text-right' : 'text-left'}`}
                            dir={rightAlign ? 'rtl' : 'ltr'}
                            placeholder="# סילבוס הקורס..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-zinc-400 mb-1">תצוגה מקדימה</label>
                          <div className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-zinc-700 bg-zinc-800 h-[180px] sm:h-[200px] overflow-y-auto prose prose-invert max-w-none text-xs sm:text-sm">
                            {overviewContent ? <NestedMarkdown content={overviewContent} rightAlign={rightAlign} /> : <p className="text-zinc-400 italic text-center mt-8">אין תוכן להצגה</p>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-stretch sm:items-center gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting || !course}
                  className="w-full sm:w-auto px-5 py-2.5 bg-red-600/90 hover:bg-red-600 text-white rounded-xl disabled:opacity-50 transition-colors shadow-sm text-xs sm:text-sm font-medium min-h-[44px] cursor-pointer"
                >
                  {isDeleting ? 'מוחק...' : 'מחק קורס'}
                </button>
                <div className="flex items-center gap-2.5 sm:gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-none px-5 py-2.5 text-zinc-400 hover:bg-zinc-800 active:bg-zinc-850 rounded-xl transition-colors text-xs sm:text-sm font-medium min-h-[44px] cursor-pointer"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 active:bg-cyan-800 disabled:opacity-50 transition-colors shadow-sm text-xs sm:text-sm font-medium min-h-[44px] cursor-pointer"
                  >
                    <Save className="w-4 h-4 shrink-0" />
                    <span>{isSaving ? 'שומר...' : 'שמור קורס'}</span>
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});
