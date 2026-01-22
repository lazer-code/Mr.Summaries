"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { SearchBar } from "@/components/summaries/SearchBar";
import { NotebookBlock } from "@/components/notebooks/NotebookBlock";
import { NotebookModal } from "@/components/notebooks/NotebookModal";
import { NotebookCreateForm } from "@/components/notebooks/NotebookCreateForm";
import { Notebook, NotebookFormData } from "@/types/notebook";
import { getNotebooks } from "@/lib/mock-notebooks";

export default function NotebooksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [notebooks, setNotebooks] = useState<Notebook[]>(getNotebooks());

  const filteredNotebooks = getNotebooks(searchTerm);

  const handleCreate = (data: NotebookFormData) => {
    const newNotebook: Notebook = {
      id: Date.now().toString(),
      title: data.title,
      subject: data.subject,
      author: data.author,
      createdDate: new Date(),
      updatedDate: new Date(),
      pages: [
        {
          id: `${Date.now()}-1`,
          pageNumber: 1,
          content: "",
          thumbnail: undefined,
        },
      ],
    };
    setNotebooks([newNotebook, ...notebooks]);
    setShowCreateForm(false);
  };

  const handleDeleteNotebook = (id: string) => {
    if (confirm("Are you sure you want to delete this notebook? This action cannot be undone.")) {
      setNotebooks(notebooks.filter(notebook => notebook.id !== id));
      if (selectedNotebook && selectedNotebook.id === id) {
        setSelectedNotebook(null);
      }
    }
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
            Notebooks
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse and create digital notebooks
          </p>
        </div>

        {/* Search and Create Section */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <SearchBar 
              value={searchTerm} 
              onChange={setSearchTerm}
              placeholder="Search by title, subject, or author..."
            />
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <Plus className="h-5 w-5" />
            Create Notebook
          </button>
        </div>

        {/* Results Count */}
        {searchTerm && (
          <div className="mb-4 text-gray-600 dark:text-gray-400">
            Found {filteredNotebooks.length} result{filteredNotebooks.length !== 1 ? "s" : ""}
          </div>
        )}

        {/* Latest Notebooks Section */}
        <div className="mb-4">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            {searchTerm ? "Search Results" : "Latest Notebooks"}
          </h2>
        </div>

        {/* Notebooks Grid */}
        {filteredNotebooks.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotebooks.map((notebook) => (
              <NotebookBlock
                key={notebook.id}
                notebook={notebook}
                onClick={() => setSelectedNotebook(notebook)}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="text-center">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                No notebooks found
              </p>
              <p className="mt-2 text-gray-500 dark:text-gray-500">
                Try a different search term or create a new notebook
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedNotebook && (
        <NotebookModal
          notebook={selectedNotebook}
          onClose={() => setSelectedNotebook(null)}
          onDelete={handleDeleteNotebook}
        />
      )}

      {showCreateForm && (
        <NotebookCreateForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
}
