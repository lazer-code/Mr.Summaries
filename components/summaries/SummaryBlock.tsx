"use client";

import { Summary } from "@/types/summary";
import { formatTimeAgo } from "@/lib/utils";
import { Clock, User } from "lucide-react";

interface SummaryBlockProps {
  summary: Summary;
  onClick: () => void;
}

export function SummaryBlock({ summary, onClick }: SummaryBlockProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl border-2 border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:scale-105 hover:border-blue-400 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500"
    >
      {/* Course Info */}
      <div className="mb-3 flex items-start justify-between">
        <div>
          <span className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            {summary.courseNumber}
          </span>
          <h3 className="mt-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
            {summary.courseName}
          </h3>
        </div>
      </div>

      {/* Summary Title */}
      <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
        {summary.title}
      </h2>

      {/* Preview */}
      <p className="mb-4 line-clamp-3 text-gray-600 dark:text-gray-400">
        {summary.preview}
      </p>

      {/* Meta Info */}
      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <User className="h-4 w-4" />
          <span>{summary.author}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{formatTimeAgo(summary.uploadDate)}</span>
        </div>
      </div>
    </div>
  );
}
