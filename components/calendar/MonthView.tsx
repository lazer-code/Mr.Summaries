"use client";

import { Task } from "@/types/task";
import { CalendarEvent } from "@/types/event";
import { getDaysInMonth, getFirstDayOfMonth, isToday, isSameDay } from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";

interface MonthViewProps {
  currentDate: Date;
  tasks: Task[];
  events?: CalendarEvent[];
  onDateClick: (date: Date) => void;
}

export function MonthView({ currentDate, tasks, events = [], onDateClick }: MonthViewProps) {
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

  const getEventsForDay = (day: number | null) => {
    if (!day) return [];
    const date = new Date(year, month, day);
    return events.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      // Check if the date falls within the event's date range
      return date >= new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate()) &&
             date <= new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate());
    });
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

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          const date = day ? new Date(year, month, day) : null;
          const dayTasks = getTasksForDay(day);
          const dayEvents = getEventsForDay(day);
          const totalItems = dayTasks.length + dayEvents.length;

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
                  
                  {/* Event and Task indicators */}
                  {totalItems > 0 && (
                    <div className="mt-1 space-y-1">
                      {/* Show events first */}
                      {dayEvents.slice(0, totalItems > 3 ? 1 : 2).map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            "truncate rounded px-1 py-0.5 text-xs font-medium",
                            event.type === "class" && "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200",
                            event.type === "meeting" && "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
                            event.type === "deadline" && "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200",
                            event.type === "event" && "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
                            event.type === "other" && "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200"
                          )}
                        >
                          📅 {event.title}
                        </div>
                      ))}
                      {/* Then show tasks */}
                      {dayTasks.slice(0, Math.max(0, 2 - dayEvents.slice(0, 2).length)).map((task) => (
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
                          ✓ {task.title}
                        </div>
                      ))}
                      {totalItems > 2 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          +{totalItems - 2} more
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
