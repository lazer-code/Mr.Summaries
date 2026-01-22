"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { NotebookFormData } from "@/types/notebook";

interface NotebookCreateFormProps {
  onClose: () => void;
  onSubmit: (data: NotebookFormData) => void;
}

export function NotebookCreateForm({ onClose, onSubmit }: NotebookCreateFormProps) {
  const [formData, setFormData] = useState<NotebookFormData>({
    title: "",
    subject: "",
    author: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
        {/* Header */}
        <div className="border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:border-gray-700 dark:from-gray-800 dark:to-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create New Notebook
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
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Notebook Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Calculus II Notes"
                className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-800"
              />
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="subject"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g., MATH 201"
                className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-800"
              />
            </div>

            {/* Author */}
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

            <p className="text-sm text-gray-500 dark:text-gray-400">
              A blank notebook with one page will be created.
            </p>
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
              Create Notebook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
