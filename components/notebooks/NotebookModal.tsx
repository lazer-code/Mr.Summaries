"use client";

import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import { Notebook, PageTemplate } from "@/types/notebook";
import { NotebookCanvas } from "./NotebookCanvas";
import { NotebookToolbar } from "./NotebookToolbar";

interface NotebookModalProps {
  notebook: Notebook;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export function NotebookModal({ notebook, onClose, onDelete }: NotebookModalProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [tool, setTool] = useState<"pen" | "eraser" | "highlighter">("pen");
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [template, setTemplate] = useState<PageTemplate>(
    notebook.pages[currentPageIndex]?.template || "ruled"
  );
  const [pages, setPages] = useState(notebook.pages);

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

  const handleDelete = () => {
    if (onDelete) {
      onDelete(notebook.id);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 flex h-[90vh] w-full max-w-7xl overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
        {/* Header */}
        <div className="absolute left-0 right-0 top-0 z-10 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:border-gray-700 dark:from-gray-800 dark:to-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="inline-block rounded-lg bg-blue-600 px-3 py-1 text-sm font-semibold text-white">
                  {notebook.subject}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {notebook.title}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/20"
                  title="Delete notebook"
                >
                  <Trash2 className="h-6 w-6" />
                </button>
              )}
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex w-full pt-24">
          {/* Canvas Area */}
          <div className="flex-1 overflow-auto p-6">
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
          <div className="w-64 overflow-y-auto border-l-2 border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
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
