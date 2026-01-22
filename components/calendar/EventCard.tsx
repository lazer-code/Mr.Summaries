"use client";

import { CalendarEvent } from "@/types/event";
import { formatDate } from "@/lib/calendar-utils";
import { Clock, MapPin, Calendar, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: CalendarEvent;
  onClick: () => void;
  onDelete?: (id: string) => void;
}

export function EventCard({ event, onClick, onDelete }: EventCardProps) {
  const isPast = new Date(event.endDate) < new Date();
  const isToday = 
    new Date(event.startDate).toDateString() === new Date().toDateString() ||
    new Date(event.endDate).toDateString() === new Date().toDateString();

  const typeColors = {
    event: "border-blue-400 bg-blue-50 dark:bg-blue-900/20",
    class: "border-purple-400 bg-purple-50 dark:bg-purple-900/20",
    meeting: "border-green-400 bg-green-50 dark:bg-green-900/20",
    deadline: "border-red-400 bg-red-50 dark:bg-red-900/20",
    other: "border-gray-400 bg-gray-50 dark:bg-gray-900/20",
  };

  const typeBadgeColors = {
    event: "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200",
    class: "bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-200",
    meeting: "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200",
    deadline: "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200",
    other: "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  };

  const formatTimeRange = () => {
    if (!event.startTime && !event.endTime) return null;
    if (event.startTime && event.endTime) {
      return `${event.startTime} - ${event.endTime}`;
    }
    return event.startTime || event.endTime;
  };

  const formatDateRange = () => {
    const startStr = formatDate(event.startDate);
    const endStr = formatDate(event.endDate);
    if (startStr === endStr) {
      return startStr;
    }
    return `${startStr} - ${endStr}`;
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(event.id);
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-xl border-2 p-4 shadow-sm transition-all duration-300 hover:shadow-md",
        isPast && "opacity-60",
        typeColors[event.type],
        isPast && "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800"
      )}
      style={event.color && !isPast ? { borderLeftWidth: '4px', borderLeftColor: event.color } : {}}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {event.title}
          </h3>
          
          {event.description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {event.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            {/* Date Range */}
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span className={cn(
                isToday && "text-blue-600 dark:text-blue-400 font-semibold"
              )}>
                {formatDateRange()}
              </span>
            </div>

            {/* Time Range */}
            {formatTimeRange() && (
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Clock className="h-3 w-3" />
                <span>{formatTimeRange()}</span>
              </div>
            )}

            {/* Location */}
            {event.location && (
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <MapPin className="h-3 w-3" />
                <span>{event.location}</span>
              </div>
            )}

            {/* Event Type Badge */}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-medium capitalize",
                typeBadgeColors[event.type]
              )}
            >
              {event.type}
            </span>
          </div>
        </div>

        {/* Delete Button */}
        {onDelete && (
          <button
            onClick={handleDelete}
            className="flex-shrink-0 rounded-lg p-1.5 text-red-600 transition-colors hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/20"
            title="Delete event"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
