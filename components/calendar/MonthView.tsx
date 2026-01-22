"use client";

import { Task } from "@/types/task";
import { getDaysInMonth, getFirstDayOfMonth, isToday, isSameDay } from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";

interface MonthViewProps {
  currentDate: Date;
  tasks: Task[];
  onDateClick: (date: Date) => void;
}

export function MonthView({ currentDate, tasks, onDateClick }: MonthViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate calendar grid
  const calendarDays: (number | null)[] = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const getTasksForDay = (day: number | null) => {
    if (!day) return [];
    const date = new Date(year, month, day);
    return tasks.filter((task) => isSameDay(new Date(task.dueDate), date));
  };

  return (
    <div className="rounded-xl border-2 border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {days.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          const date = day ? new Date(year, month, day) : null;
          const dayTasks = getTasksForDay(day);

          return (
            <div
              key={index}
              onClick={() => date && onDateClick(date)}
              className={cn(
                "min-h-[80px] rounded-lg border-2 p-2 transition-all",
                day
                  ? "cursor-pointer border-gray-200 bg-white hover:border-blue-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500"
                  : "border-transparent bg-gray-50 dark:bg-gray-900/50",
                date && isToday(date) && "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30"
              )}
            >
              {day && (
                <>
                  <div
                    className={cn(
                      "text-sm font-semibold",
                      date && isToday(date)
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-900 dark:text-white"
                    )}
                  >
                    {day}
                  </div>
                  
                  {/* Task indicators */}
                  {dayTasks.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {dayTasks.slice(0, 2).map((task) => (
                        <div
                          key={task.id}
                          className={cn(
                            "truncate rounded px-1 py-0.5 text-xs",
                            task.completed && "bg-gray-200 text-gray-600 line-through dark:bg-gray-700 dark:text-gray-400",
                            !task.completed && task.priority === "high" && "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200",
                            !task.completed && task.priority === "medium" && "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
                            !task.completed && task.priority === "low" && "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                          )}
                        >
                          {task.title}
                        </div>
                      ))}
                      {dayTasks.length > 2 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          +{dayTasks.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
