"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from "lucide-react";
import { MonthView } from "@/components/calendar/MonthView";
import { TaskCard } from "@/components/calendar/TaskCard";
import { TaskForm } from "@/components/calendar/TaskForm";
import { EventCard } from "@/components/calendar/EventCard";
import { EventForm } from "@/components/calendar/EventForm";
import { Task, TaskFormData } from "@/types/task";
import { CalendarEvent, EventFormData } from "@/types/event";
import { mockTasks } from "@/lib/mock-tasks";
import { getMonthName } from "@/lib/calendar-utils";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [filterCompleted, setFilterCompleted] = useState<"all" | "active" | "completed">("all");
  const [viewMode, setViewMode] = useState<"all" | "tasks" | "events">("all");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCreateTask = (data: TaskFormData) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      dueTime: data.dueTime,
      location: data.location,
      completed: false,
      priority: data.priority,
      category: data.category,
      createdAt: new Date(),
    };
    setTasks([newTask, ...tasks]);
  };

  const handleCreateEvent = (data: EventFormData) => {
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,
      type: data.type,
      color: data.color,
      createdAt: new Date(),
    };
    setEvents([newEvent, ...events]);
  };

  const handleToggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleUpdateTask = (data: TaskFormData) => {
    if (!editingTask) return;
    setTasks(tasks.map(task => 
      task.id === editingTask.id 
        ? { 
            ...task, 
            ...data,
            // Preserve immutable fields
            id: task.id,
            completed: task.completed,
            createdAt: task.createdAt
          }
        : task
    ));
    setEditingTask(null);
  };

  const handleUpdateEvent = (data: EventFormData) => {
    if (!editingEvent) return;
    setEvents(events.map(event => 
      event.id === editingEvent.id 
        ? { 
            ...event, 
            ...data,
            // Preserve immutable fields
            id: event.id,
            createdAt: event.createdAt
          }
        : event
    ));
    setEditingEvent(null);
  };

  // Get events for selected date or all events
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return date >= new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate()) &&
             date <= new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate());
    });
  };

  // Get tasks for selected date or all upcoming tasks
  const displayTasks = selectedDate
    ? tasks.filter((task) => {
        const taskDate = new Date(task.dueDate);
        return (
          taskDate.getDate() === selectedDate.getDate() &&
          taskDate.getMonth() === selectedDate.getMonth() &&
          taskDate.getFullYear() === selectedDate.getFullYear()
        );
      })
    : tasks.filter((task) => {
        if (filterCompleted === "active") return !task.completed;
        if (filterCompleted === "completed") return task.completed;
        return true;
      }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const displayEvents = selectedDate
    ? getEventsForDate(selectedDate)
    : events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const shouldShowTasks = viewMode === "all" || viewMode === "tasks";
  const shouldShowEvents = viewMode === "all" || viewMode === "events";

  const overdueTasks = tasks.filter(
    (task) => !task.completed && new Date(task.dueDate) < new Date()
  );

  const todayTasks = tasks.filter(
    (task) => !task.completed && new Date(task.dueDate).toDateString() === new Date().toDateString()
  );

  const upcomingTasks = tasks.filter(
    (task) => !task.completed && new Date(task.dueDate) > new Date()
  );

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
                Calendar & Tasks
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your schedule and tasks
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowEventForm(true)}
                className="flex items-center gap-2 rounded-xl border-2 border-blue-600 bg-white px-6 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-400 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
              >
                <CalendarIcon className="h-5 w-5" />
                New Event
              </button>
              <button
                onClick={() => setShowTaskForm(true)}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <Plus className="h-5 w-5" />
                New Task
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <div className="text-sm font-medium text-red-600 dark:text-red-400">Overdue</div>
            <div className="mt-1 text-3xl font-bold text-red-700 dark:text-red-300">
              {overdueTasks.length}
            </div>
          </div>
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Due Today</div>
            <div className="mt-1 text-3xl font-bold text-blue-700 dark:text-blue-300">
              {todayTasks.length}
            </div>
          </div>
          <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
            <div className="text-sm font-medium text-green-600 dark:text-green-400">Upcoming</div>
            <div className="mt-1 text-3xl font-bold text-green-700 dark:text-green-300">
              {upcomingTasks.length}
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            {/* Calendar Controls */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {getMonthName(month)} {year}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToday}
                  className="rounded-lg border-2 border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Today
                </button>
                <button
                  onClick={handlePreviousMonth}
                  className="rounded-lg border-2 border-gray-300 p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="rounded-lg border-2 border-gray-300 p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <MonthView
              currentDate={currentDate}
              tasks={tasks}
              events={events}
              onDateClick={handleDateClick}
            />
          </div>

          {/* Tasks Section */}
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedDate
                  ? `Items for ${selectedDate.toLocaleDateString()}`
                  : viewMode === "all" ? "All Items" : viewMode === "tasks" ? "All Tasks" : "All Events"}
              </h2>
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Clear
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            {!selectedDate && (
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() => setViewMode("all")}
                  className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                    viewMode === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setViewMode("tasks")}
                  className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                    viewMode === "tasks"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  Tasks
                </button>
                <button
                  onClick={() => setViewMode("events")}
                  className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                    viewMode === "events"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  Events
                </button>
              </div>
            )}

            {/* Filter Buttons (for tasks only) */}
            {!selectedDate && (viewMode === "all" || viewMode === "tasks") && (
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() => setFilterCompleted("all")}
                  className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                    filterCompleted === "all"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterCompleted("active")}
                  className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                    filterCompleted === "active"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilterCompleted("completed")}
                  className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                    filterCompleted === "completed"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  Completed
                </button>
              </div>
            )}

            {/* Task and Event List */}
            <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
              {shouldShowTasks && displayTasks.length > 0 && (
                <>
                  {viewMode === "all" && <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Tasks</h3>}
                  {displayTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => setEditingTask(task)}
                      onToggleComplete={handleToggleComplete}
                    />
                  ))}
                </>
              )}
              
              {shouldShowEvents && displayEvents.length > 0 && (
                <>
                  {viewMode === "all" && displayTasks.length > 0 && <div className="my-4 border-t border-gray-300 dark:border-gray-700" />}
                  {viewMode === "all" && <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Events</h3>}
                  {displayEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onClick={() => setEditingEvent(event)}
                    />
                  ))}
                </>
              )}

              {((shouldShowTasks && displayTasks.length === 0) && (shouldShowEvents && displayEvents.length === 0)) && (
                <div className="rounded-xl border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedDate ? "No items for this date" : 
                     viewMode === "all" ? "No items to display" :
                     viewMode === "tasks" ? "No tasks to display" :
                     "No events to display"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Form Modal - for both create and edit */}
      {(showTaskForm || editingTask) && (
        <TaskForm
          onClose={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          initialDate={selectedDate || undefined}
          initialTask={editingTask || undefined}
        />
      )}

      {/* Event Form Modal - for both create and edit */}
      {(showEventForm || editingEvent) && (
        <EventForm
          onClose={() => {
            setShowEventForm(false);
            setEditingEvent(null);
          }}
          onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
          initialDate={selectedDate || undefined}
          initialEvent={editingEvent || undefined}
        />
      )}
    </div>
  );
}
