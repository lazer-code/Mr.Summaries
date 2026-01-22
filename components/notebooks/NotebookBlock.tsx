"use client";

import { Notebook } from "@/types/notebook";
import { formatTimeAgo } from "@/lib/utils";
import { Clock, User, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

interface NotebookBlockProps {
  notebook: Notebook;
  onClick: () => void;
}

export function NotebookBlock({ notebook, onClick }: NotebookBlockProps) {
  const router = useRouter();
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = useRef(0);

  const handleClick = () => {
    clickCountRef.current += 1;

    if (clickCountRef.current === 1) {
      // First click - wait to see if there's a second click
      clickTimeoutRef.current = setTimeout(() => {
        // Single click - open modal
        onClick();
        clickCountRef.current = 0;
      }, 300); // 300ms delay to detect double click
    } else if (clickCountRef.current === 2) {
      // Double click - navigate to full page
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      clickCountRef.current = 0;
      router.push(`/notebooks/${notebook.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer rounded-xl border-2 border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:scale-105 hover:border-blue-400 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500"
    >
      {/* Subject Info */}
      <div className="mb-3 flex items-start justify-between">
        <div>
          <span className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            {notebook.subject}
          </span>
        </div>
      </div>

      {/* Notebook Title */}
      <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
        {notebook.title}
      </h2>

      {/* Thumbnail Preview */}
      <div className="mb-4 flex aspect-[210/297] items-center justify-center rounded-lg border-2 border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
        <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-500" />
      </div>

      {/* Meta Info */}
      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <User className="h-4 w-4" />
          <span>{notebook.author}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{formatTimeAgo(notebook.updatedDate)}</span>
        </div>
      </div>

      {/* Page Count */}
      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {notebook.pages.length} {notebook.pages.length === 1 ? "page" : "pages"}
      </div>
    </div>
  );
}
