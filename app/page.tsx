"use client";

import { BookOpen, FileText, Calendar } from "lucide-react";
import { PlatformCard } from "@/components/home/PlatformCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white md:text-6xl">
            Mr.Summaries
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your Academic Knowledge Platform
          </p>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Access and share knowledge seamlessly
          </p>
        </div>

        {/* Platform Cards Grid */}
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            <PlatformCard
              title="Notebooks"
              description="Digital note-taking in a notebook form with stylus support and rich formatting"
              icon={<BookOpen className="h-12 w-12 text-blue-600 dark:text-blue-400" />}
              href="/notebooks"
              comingSoon
            />
            <PlatformCard
              title="Summaries"
              description="Browse and share course summaries with LaTeX support and rich content"
              icon={<FileText className="h-12 w-12 text-blue-600 dark:text-blue-400" />}
              href="/summaries"
            />
            <PlatformCard
              title="Calendar & Tasks"
              description="Manage your schedule and tasks with an integrated calendar view"
              icon={<Calendar className="h-12 w-12 text-blue-600 dark:text-blue-400" />}
              href="/calendar"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Built for students, by students</p>
        </div>
      </div>
    </div>
  );
}
