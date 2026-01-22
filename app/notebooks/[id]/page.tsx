"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, User } from "lucide-react";
import { getNotebookById } from "@/lib/mock-notebooks";
import { NotebookCanvas } from "@/components/notebooks/NotebookCanvas";
import { NotebookToolbar } from "@/components/notebooks/NotebookToolbar";
import { formatTimeAgo } from "@/lib/utils";
import { PageTemplate } from "@/types/notebook";

export default function NotebookFullPage() {
  const params = useParams();
  const notebookId = params.id as string;
  
  const notebook = getNotebookById(notebookId);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [tool, setTool] = useState<"pen" | "eraser" | "highlighter">("pen");
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [template, setTemplate] = useState<PageTemplate>("ruled");
  const [pages, setPages] = useState(notebook?.pages || []);

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
    // In a real app, this would save to state/backend
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _content = content;
    console.log("Content changed for page", currentPage.pageNumber);
  };

  const handleClearPage = () => {
    if (confirm("Are you sure you want to clear this page?")) {
      // In a real app, this would clear the page content
      window.location.reload(); // Simple reload for now
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
      if (renumberedPages[currentPageIndex]) {
        setTemplate(renumberedPages[currentPageIndex]?.template || "ruled");
      }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <Link
          href="/notebooks"
          className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Notebooks
        </Link>

        {/* Header */}
        <div className="mb-8 rounded-2xl border-2 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 dark:border-gray-700 dark:from-gray-800 dark:to-gray-800">
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-block rounded-lg bg-blue-600 px-3 py-1 text-sm font-semibold text-white">
              {notebook.subject}
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            {notebook.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
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

        {/* Content Area */}
        <div className="flex gap-6">
          {/* Canvas Area */}
          <div className="flex-1 rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-900">
            <NotebookCanvas
              content={currentPage?.content}
              onContentChange={handleContentChange}
              tool={tool}
              color={color}
              strokeWidth={strokeWidth}
              template={template}
            />
          </div>

          {/* Toolbar Sidebar */}
          <div className="w-64">
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
