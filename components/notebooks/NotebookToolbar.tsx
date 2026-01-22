"use client";

import { Pen, Eraser, Highlighter, Trash2, ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";
import { PageTemplate } from "@/types/notebook";

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
  template: PageTemplate;
  onTemplateChange: (template: PageTemplate) => void;
  onAddPage?: () => void;
  onRemovePage?: () => void;
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
  template,
  onTemplateChange,
  onAddPage,
  onRemovePage,
}: NotebookToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
      {/* Tools */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Tools:
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => onToolChange("pen")}
            className={`flex items-center justify-center rounded-lg p-2 transition-colors ${
              tool === "pen"
                ? "bg-blue-600 text-white dark:bg-blue-500"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
            title="Pen"
          >
            <Pen className="h-4 w-4" />
          </button>
          <button
            onClick={() => onToolChange("eraser")}
            className={`flex items-center justify-center rounded-lg p-2 transition-colors ${
              tool === "eraser"
                ? "bg-blue-600 text-white dark:bg-blue-500"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
            title="Eraser"
          >
            <Eraser className="h-4 w-4" />
          </button>
          <button
            onClick={() => onToolChange("highlighter")}
            className={`flex items-center justify-center rounded-lg p-2 transition-colors ${
              tool === "highlighter"
                ? "bg-blue-600 text-white dark:bg-blue-500"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
            title="Highlighter"
          >
            <Highlighter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-gray-200 dark:bg-gray-600" />

      {/* Colors */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Color:
        </span>
        <div className="flex gap-1">
          {COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => onColorChange(c.value)}
              className={`h-8 w-8 rounded-lg border-2 transition-all ${
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

      {/* Divider */}
      <div className="h-8 w-px bg-gray-200 dark:bg-gray-600" />

      {/* Stroke Width */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Width:
        </span>
        <div className="flex gap-1">
          {STROKE_WIDTHS.map((w) => (
            <button
              key={w.value}
              onClick={() => onStrokeWidthChange(w.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
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

      {/* Divider */}
      <div className="h-8 w-px bg-gray-200 dark:bg-gray-600" />

      {/* Page Template */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Template:
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => onTemplateChange("blank")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              template === "blank"
                ? "bg-blue-600 text-white dark:bg-blue-500"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Blank
          </button>
          <button
            onClick={() => onTemplateChange("ruled")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              template === "ruled"
                ? "bg-blue-600 text-white dark:bg-blue-500"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Ruled
          </button>
          <button
            onClick={() => onTemplateChange("grid")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              template === "grid"
                ? "bg-blue-600 text-white dark:bg-blue-500"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Grid
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-gray-200 dark:bg-gray-600" />

      {/* Page Navigation */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Page:
        </span>
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {currentPage} / {totalPages}
        </span>
        <div className="flex gap-1">
          <button
            onClick={onPreviousPage}
            disabled={currentPage === 1}
            className="flex items-center justify-center rounded-lg bg-gray-100 p-2 text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            title="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center rounded-lg bg-gray-100 p-2 text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            title="Next Page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        
        {/* Page Management Buttons */}
        {(onAddPage || onRemovePage) && (
          <div className="flex gap-1">
            {onAddPage && (
              <button
                onClick={onAddPage}
                className="flex items-center justify-center gap-1 rounded-lg bg-green-100 px-2 py-1.5 text-xs font-medium text-green-700 transition-colors hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                title="Add Page"
              >
                <Plus className="h-3 w-3" />
              </button>
            )}
            {onRemovePage && (
              <button
                onClick={onRemovePage}
                disabled={totalPages <= 1}
                className="flex items-center justify-center gap-1 rounded-lg bg-red-100 px-2 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                title="Remove Page"
              >
                <Minus className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-gray-200 dark:bg-gray-600" />

      {/* Clear Page */}
      <button
        onClick={onClearPage}
        className="flex items-center gap-1.5 rounded-lg border-2 border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
      >
        <Trash2 className="h-4 w-4" />
        Clear
      </button>
    </div>
  );
}
