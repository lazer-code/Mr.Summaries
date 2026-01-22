"use client";

import { Pen, Eraser, Highlighter, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface NotebookToolbarProps {
  tool: "pen" | "eraser" | "highlighter";
  onToolChange: (tool: "pen" | "eraser" | "highlighter") => void;
  color: string;
  onColorChange: (color: string) => void;
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
  onClearPage: () => void;
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  showGrid: boolean;
  onShowGridChange: (show: boolean) => void;
}

const COLORS = [
  { name: "Black", value: "#000000" },
  { name: "Blue", value: "#2563eb" },
  { name: "Red", value: "#dc2626" },
  { name: "Green", value: "#16a34a" },
  { name: "Yellow", value: "#eab308" },
  { name: "Purple", value: "#9333ea" },
];

const STROKE_WIDTHS = [
  { name: "Thin", value: 2 },
  { name: "Medium", value: 4 },
  { name: "Thick", value: 8 },
];

export function NotebookToolbar({
  tool,
  onToolChange,
  color,
  onColorChange,
  strokeWidth,
  onStrokeWidthChange,
  onClearPage,
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
  showGrid,
  onShowGridChange,
}: NotebookToolbarProps) {
  return (
    <div className="space-y-4">
      {/* Tools */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Tools
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => onToolChange("pen")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition-colors ${
              tool === "pen"
                ? "bg-blue-600 text-white dark:bg-blue-500"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
            title="Pen"
          >
            <Pen className="h-5 w-5" />
          </button>
          <button
            onClick={() => onToolChange("eraser")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition-colors ${
              tool === "eraser"
                ? "bg-blue-600 text-white dark:bg-blue-500"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
            title="Eraser"
          >
            <Eraser className="h-5 w-5" />
          </button>
          <button
            onClick={() => onToolChange("highlighter")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition-colors ${
              tool === "highlighter"
                ? "bg-blue-600 text-white dark:bg-blue-500"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
            title="Highlighter"
          >
            <Highlighter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Colors */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Color
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => onColorChange(c.value)}
              className={`h-10 rounded-lg border-2 transition-all ${
                color === c.value
                  ? "border-blue-600 ring-2 ring-blue-200 dark:border-blue-400 dark:ring-blue-800"
                  : "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
              }`}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {/* Stroke Width */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Stroke Width
        </h3>
        <div className="flex gap-2">
          {STROKE_WIDTHS.map((w) => (
            <button
              key={w.value}
              onClick={() => onStrokeWidthChange(w.value)}
              className={`flex flex-1 items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                strokeWidth === w.value
                  ? "bg-blue-600 text-white dark:bg-blue-500"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {w.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Toggle */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <label className="flex cursor-pointer items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Show Grid
          </span>
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => onShowGridChange(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
          />
        </label>
      </div>

      {/* Page Navigation */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Page Navigation
        </h3>
        <div className="mb-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onPreviousPage}
            disabled={currentPage === 1}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>
          <button
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Clear Page */}
      <button
        onClick={onClearPage}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-600 transition-colors hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
      >
        <Trash2 className="h-5 w-5" />
        Clear Page
      </button>
    </div>
  );
}
