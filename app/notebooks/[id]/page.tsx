"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, User } from "lucide-react";
import { getNotebookById } from "@/lib/mock-notebooks";
import { NotebookCanvas } from "@/components/notebooks/NotebookCanvas";
import { NotebookToolbar } from "@/components/notebooks/NotebookToolbar";
import { formatTimeAgo } from "@/lib/utils";
import { PageTemplate, Page } from "@/types/notebook";

export default function NotebookFullPage() {
  const params = useParams();
  const notebookId = params.id as string;
  
  const notebook = getNotebookById(notebookId);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [tool, setTool] = useState<"pen" | "eraser" | "highlighter">("pen");
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [template, setTemplate] = useState<PageTemplate>("ruled");
  const [pages, setPages] = useState<Page[]>([]);
  const [zoom, setZoom] = useState(100);
  const [showHeader, setShowHeader] = useState(false);
  const headerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load pages from localStorage on mount
  useEffect(() => {
    const storageKey = `notebook-${notebookId}-pages`;
    const savedPages = localStorage.getItem(storageKey);
    
    if (savedPages) {
      try {
        const parsedPages = JSON.parse(savedPages) as Page[];
        setPages(parsedPages);
        setTemplate(parsedPages[0]?.template || "ruled");
      } catch {
        // If parsing fails, use default pages
        setPages(notebook?.pages || []);
      }
    } else {
      // Use initial pages from notebook
      setPages(notebook?.pages || []);
    }
  }, [notebookId, notebook]);

  // Save pages to localStorage whenever they change
  useEffect(() => {
    if (pages.length > 0) {
      const storageKey = `notebook-${notebookId}-pages`;
      localStorage.setItem(storageKey, JSON.stringify(pages));
    }
  }, [pages, notebookId]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (headerTimeoutRef.current) {
        clearTimeout(headerTimeoutRef.current);
      }
    };
  }, []);

  if (!notebook) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <Link
            href="/notebooks"
            className="mb-8 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Notebooks
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Notebook not found
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              The notebook you&apos;re looking for doesn&apos;t exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentPage = pages[currentPageIndex];
  const totalPages = pages.length;

  const handleContentChange = (content: string) => {
    // Update the content of the current page
    const updatedPages = pages.map((page, index) =>
      index === currentPageIndex ? { ...page, content } : page
    );
    setPages(updatedPages);
  };

  const handleClearPage = () => {
    if (confirm("Are you sure you want to clear this page?")) {
      // Clear the content of the current page
      const updatedPages = pages.map((page, index) =>
        index === currentPageIndex ? { ...page, content: "" } : page
      );
      setPages(updatedPages);
    }
  };

  const handlePreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      setTemplate(pages[currentPageIndex - 1]?.template || "ruled");
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      setTemplate(pages[currentPageIndex + 1]?.template || "ruled");
    }
  };

  const handleAddPage = () => {
    const newPage = {
      id: `${Date.now()}-${pages.length + 1}`,
      pageNumber: pages.length + 1,
      content: "",
      template: "ruled" as PageTemplate,
    };
    setPages([...pages, newPage]);
  };

  const handleRemovePage = () => {
    if (pages.length <= 1) return;
    
    if (confirm("Are you sure you want to remove this page?")) {
      const newPages = pages.filter((_, index) => index !== currentPageIndex);
      // Renumber pages
      const renumberedPages = newPages.map((page, index) => ({
        ...page,
        pageNumber: index + 1,
      }));
      setPages(renumberedPages);
      
      // Adjust current page index
      if (currentPageIndex >= renumberedPages.length) {
        setCurrentPageIndex(renumberedPages.length - 1);
      }
      setTemplate(renumberedPages[Math.min(currentPageIndex, renumberedPages.length - 1)]?.template || "ruled");
    }
  };

  const handleTemplateChange = (newTemplate: PageTemplate) => {
    setTemplate(newTemplate);
    // Update the page template
    const updatedPages = pages.map((page, index) =>
      index === currentPageIndex ? { ...page, template: newTemplate } : page
    );
    setPages(updatedPages);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleZoomReset = () => {
    setZoom(100);
  };

  const handleCanvasTouchStart = (e: React.TouchEvent) => {
    // Handle touch events to toggle header visibility
    // Note: TouchEvent fires for any touch input (finger or stylus on some devices)
    if (e.touches.length > 0) {
      // Toggle header visibility
      if (showHeader) {
        setShowHeader(false);
        if (headerTimeoutRef.current) {
          clearTimeout(headerTimeoutRef.current);
          headerTimeoutRef.current = null;
        }
      } else {
        setShowHeader(true);
        // Set timeout to hide after 5 seconds
        if (headerTimeoutRef.current) {
          clearTimeout(headerTimeoutRef.current);
        }
        headerTimeoutRef.current = setTimeout(() => {
          setShowHeader(false);
          headerTimeoutRef.current = null;
        }, 5000);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Slim Top Bar - Hidden by default, shown on touch */}
      <div 
        className={`flex items-center justify-between border-b-2 border-gray-200 bg-white px-6 py-3 dark:border-gray-700 dark:bg-gray-800 transition-all duration-300 ease-in-out ${
          showHeader ? 'relative opacity-100 translate-y-0' : 'absolute -top-full opacity-0 pointer-events-none'
        }`}
        style={{ 
          zIndex: showHeader ? 10 : -1,
          width: '100%'
        }}
      >
        <Link
          href="/notebooks"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        
        <div className="flex items-center gap-3">
          <span className="inline-block rounded-lg bg-blue-600 px-3 py-1 text-sm font-semibold text-white">
            {notebook.subject}
          </span>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {notebook.title}
          </h1>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{notebook.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatTimeAgo(notebook.updatedDate)}</span>
          </div>
        </div>
      </div>

      {/* Horizontal Toolbar - Always visible */}
      <div className="border-b-2 border-gray-200 bg-white px-6 py-3 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl">
          <NotebookToolbar
            tool={tool}
            onToolChange={setTool}
            color={color}
            onColorChange={setColor}
            strokeWidth={strokeWidth}
            onStrokeWidthChange={setStrokeWidth}
            onClearPage={handleClearPage}
            currentPage={currentPageIndex + 1}
            totalPages={totalPages}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
            template={template}
            onTemplateChange={handleTemplateChange}
            onAddPage={handleAddPage}
            onRemovePage={handleRemovePage}
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onZoomReset={handleZoomReset}
          />
        </div>
      </div>

      {/* Fullscreen Canvas Area */}
      <div 
        className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900"
        onTouchStart={handleCanvasTouchStart}
      >
        <NotebookCanvas
          content={currentPage?.content}
          onContentChange={handleContentChange}
          tool={tool}
          color={color}
          strokeWidth={strokeWidth}
          template={template}
          zoom={zoom}
        />
      </div>
    </div>
  );
}
