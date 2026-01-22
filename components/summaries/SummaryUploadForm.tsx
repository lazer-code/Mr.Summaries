"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { SummaryFormData } from "@/types/summary";

interface SummaryUploadFormProps {
  onClose: () => void;
  onSubmit: (data: SummaryFormData) => void;
}

export function SummaryUploadForm({ onClose, onSubmit }: SummaryUploadFormProps) {
  const [formData, setFormData] = useState<SummaryFormData>({
    courseNumber: "",
    courseName: "",
    title: "",
    author: "",
    content: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
        {/* Header */}
        <div className="border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:border-gray-700 dark:from-gray-800 dark:to-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Upload Summary
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-h-[calc(90vh-140px)] overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Course Number */}
            <div>
              <label
                htmlFor="courseNumber"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Course Number *
              </label>
              <input
                type="text"
                id="courseNumber"
                name="courseNumber"
                required
                value={formData.courseNumber}
                onChange={handleChange}
                placeholder="e.g., MATH 201"
                className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-800"
              />
            </div>

            {/* Course Name */}
            <div>
              <label
                htmlFor="courseName"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Course Name *
              </label>
              <input
                type="text"
                id="courseName"
                name="courseName"
                required
                value={formData.courseName}
                onChange={handleChange}
                placeholder="e.g., Calculus II"
                className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-800"
              />
            </div>

            {/* Summary Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Summary Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Integration Techniques"
                className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-800"
              />
            </div>

            {/* Author Name */}
            <div>
              <label
                htmlFor="author"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Author Name *
              </label>
              <input
                type="text"
                id="author"
                name="author"
                required
                value={formData.author}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-800"
              />
            </div>

            {/* Content */}
            <div>
              <label
                htmlFor="content"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Content *
              </label>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Supports markdown, LaTeX math (use $ for inline, $$ for display), and tables
              </p>
              <textarea
                id="content"
                name="content"
                required
                value={formData.content}
                onChange={handleChange}
                rows={12}
                placeholder="# My Summary&#10;&#10;This is a summary with **bold** and *italic* text.&#10;&#10;Math equation: $E = mc^2$"
                className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 font-mono text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-800"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border-2 border-gray-300 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Upload Summary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
