import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Loader2 } from 'lucide-react';

// Set worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface PdfTextRendererProps {
  url: string;
  rightAlign?: boolean;
}

export const PdfTextRenderer: React.FC<PdfTextRendererProps> = ({ url }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(800);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const width = entries[0].contentRect.width;
        const padding = window.innerWidth < 640 ? 16 : 48;
        const calculatedWidth = Math.max(240, Math.floor(width - padding));
        setContainerWidth(calculatedWidth);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  return (
    <div ref={containerRef} className="flex flex-col items-center w-full max-w-4xl mx-auto px-0 sm:px-2">
      <div className="w-full flex flex-col items-center gap-4 sm:gap-6 p-2 sm:p-8 bg-zinc-950/30 rounded-2xl sm:rounded-[2.5rem] border border-zinc-800/50 shadow-inner overflow-x-auto">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex flex-col items-center p-12 sm:p-24">
              <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-cyan-600 mb-4" />
              <span className="text-zinc-500 font-medium text-sm">טוען מסמך...</span>
            </div>
          }
          error={
            <div className="p-6 sm:p-12 text-red-400 text-center bg-red-900/10 rounded-2xl border border-red-900/20 text-sm">
              <p className="font-bold mb-1.5 sm:mb-2">שגיאה בטעינת הקובץ</p>
              <p className="text-xs sm:text-sm opacity-80">וודא שהקישור תקין או נסה להוריד את הקובץ ישירות.</p>
            </div>
          }
          className="flex flex-col items-center justify-center gap-4 sm:gap-8 w-full max-w-full"
        >
          {numPages && Array.from(new Array(numPages), (el, index) => (
            <div key={`page_${index + 1}`} className="shadow-lg sm:shadow-2xl rounded-lg sm:rounded-xl overflow-hidden border border-zinc-800 bg-white max-w-full">
              <Page 
                pageNumber={index + 1} 
                width={containerWidth}
                renderAnnotationLayer={true}
                renderTextLayer={true}
                className="max-w-full"
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
};

