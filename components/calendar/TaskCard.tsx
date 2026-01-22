"use client";

import { Task } from "@/types/task";
import { formatDate } from "@/lib/calendar-utils";
import { CheckCircle2, Circle, Clock, AlertCircle, MapPin, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onToggleComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TaskCard({ task, onClick, onToggleComplete, onDelete }: TaskCardProps) {
  const isOverdue = !task.completed && new Date(task.dueDate) < new Date();
  const isToday = new Date(task.dueDate).toDateString() === new Date().toDateString();

  const priorityColors = {
    high: "border-red-400 bg-red-50 dark:bg-red-900/20",
    medium: "border-amber-400 bg-amber-50 dark:bg-amber-900/20",
    low: "border-blue-400 bg-blue-50 dark:bg-blue-900/20",
  };

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleComplete) {
      onToggleComplete(task.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(task.id);
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-xl border-2 p-4 shadow-sm transition-all duration-300 hover:shadow-md",
        task.completed && "opacity-60",
        !task.completed && priorityColors[task.priority],
        task.completed && "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleToggleComplete}
          className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110"
        >
          {task.completed ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          ) : (
            <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "font-semibold text-gray-900 dark:text-white",
              task.completed && "line-through text-gray-500 dark:text-gray-400"
            )}
          >
            {task.title}
          </h3>
          
          {task.description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            {/* Due Date */}
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className={cn(
                isOverdue && "text-red-600 dark:text-red-400 font-semibold",
                isToday && "text-blue-600 dark:text-blue-400 font-semibold"
              )}>
                {formatDate(task.dueDate)}
                {task.dueTime && ` at ${task.dueTime}`}
              </span>
            </div>

            {/* Location */}
            {task.location && (
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <MapPin className="h-3 w-3" />
                <span>{task.location}</span>
              </div>
            )}

            {/* Category */}
            {task.category && (
              <span className="rounded-full bg-gray-200 px-2 py-0.5 dark:bg-gray-700">
                {task.category}
              </span>
            )}

            {/* Priority Badge */}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-medium",
                task.priority === "high" && "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200",
                task.priority === "medium" && "bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200",
                task.priority === "low" && "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
              )}
            >
              {task.priority}
            </span>

            {/* Overdue Warning */}
            {isOverdue && (
              <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                <AlertCircle className="h-3 w-3" />
                <span className="font-semibold">Overdue</span>
              </div>
            )}
          </div>
        </div>

        {/* Delete Button */}
        {onDelete && (
          <button
            onClick={handleDelete}
            className="flex-shrink-0 rounded-lg p-1.5 text-red-600 transition-colors hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/20"
            title="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
