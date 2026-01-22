"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";
import { SearchBar } from "@/components/summaries/SearchBar";
import { SummaryBlock } from "@/components/summaries/SummaryBlock";
import { SummaryModal } from "@/components/summaries/SummaryModal";
import { SummaryUploadForm } from "@/components/summaries/SummaryUploadForm";
import { Summary, SummaryFormData } from "@/types/summary";
import { getSummaries } from "@/lib/mock-data";

export default function SummariesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [summaries, setSummaries] = useState<Summary[]>(getSummaries());

  const filteredSummaries = getSummaries(searchTerm);

  const handleUpload = (data: SummaryFormData) => {
    const newSummary: Summary = {
      id: Date.now().toString(),
      courseNumber: data.courseNumber,
      courseName: data.courseName,
      title: data.title,
      author: data.author,
      content: data.content,
      uploadDate: new Date(),
      preview: data.content.substring(0, 150) + "...",
    };
    setSummaries([newSummary, ...summaries]);
    setShowUploadForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
            Summaries
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse and search course summaries
          </p>
        </div>

        {/* Search and Upload Section */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>
          <button
            onClick={() => setShowUploadForm(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <Upload className="h-5 w-5" />
            Upload Summary
          </button>
        </div>

        {/* Results Count */}
        {searchTerm && (
          <div className="mb-4 text-gray-600 dark:text-gray-400">
            Found {filteredSummaries.length} result{filteredSummaries.length !== 1 ? "s" : ""}
          </div>
        )}

        {/* Latest Summaries Section */}
        <div className="mb-4">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            {searchTerm ? "Search Results" : "Latest Summaries"}
          </h2>
        </div>

        {/* Summaries Grid */}
        {filteredSummaries.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSummaries.map((summary) => (
              <SummaryBlock
                key={summary.id}
                summary={summary}
                onClick={() => setSelectedSummary(summary)}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="text-center">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                No summaries found
              </p>
              <p className="mt-2 text-gray-500 dark:text-gray-500">
                Try a different search term or upload a new summary
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedSummary && (
        <SummaryModal
          summary={selectedSummary}
          onClose={() => setSelectedSummary(null)}
        />
      )}

      {showUploadForm && (
        <SummaryUploadForm
          onClose={() => setShowUploadForm(false)}
          onSubmit={handleUpload}
        />
      )}
    </div>
  );
}
