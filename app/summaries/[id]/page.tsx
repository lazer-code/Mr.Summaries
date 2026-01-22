"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, User } from "lucide-react";
import { getSummaryById } from "@/lib/mock-data";
import { SummaryContent } from "@/components/summaries/SummaryContent";
import { formatTimeAgo } from "@/lib/utils";

export default function SummaryFullPage() {
  const params = useParams();
  const summaryId = params.id as string;
  
  const summary = getSummaryById(summaryId);

  if (!summary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <Link
            href="/summaries"
            className="mb-8 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Summaries
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Summary not found
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              The summary you&apos;re looking for doesn&apos;t exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <Link
          href="/summaries"
          className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Summaries
        </Link>

        {/* Header */}
        <div className="mb-8 rounded-2xl border-2 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 dark:border-gray-700 dark:from-gray-800 dark:to-gray-800">
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-block rounded-lg bg-blue-600 px-3 py-1 text-sm font-semibold text-white">
              {summary.courseNumber}
            </span>
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {summary.courseName}
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            {summary.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
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

        {/* Content */}
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <SummaryContent content={summary.content} />
        </div>
      </div>
    </div>
  );
}
