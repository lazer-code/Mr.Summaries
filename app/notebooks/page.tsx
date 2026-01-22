import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function NotebooksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Back Button */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Coming Soon Content */}
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="rounded-full bg-blue-100 p-8 dark:bg-blue-900 mb-8">
            <BookOpen className="h-24 w-24 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Notebooks Platform
          </h1>
          <p className="mb-2 text-xl text-gray-600 dark:text-gray-300">
            Coming Soon
          </p>
          <p className="max-w-md text-gray-500 dark:text-gray-400">
            The digital note-taking platform with A4 notebook pages, stylus support,
            and rich formatting features will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}
