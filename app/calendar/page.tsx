"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { MonthView } from "@/components/calendar/MonthView";
import { TaskCard } from "@/components/calendar/TaskCard";
import { TaskForm } from "@/components/calendar/TaskForm";
import { Task, TaskFormData } from "@/types/task";
import { mockTasks, getTasksForDate } from "@/lib/mock-tasks";
import { getMonthName } from "@/lib/calendar-utils";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [filterCompleted, setFilterCompleted] = useState<"all" | "active" | "completed">("all");

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
      completed: false,
      priority: data.priority,
      category: data.category,
      createdAt: new Date(),
    };
    setTasks([newTask, ...tasks]);
  };

  const handleToggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Get tasks for selected date or all upcoming tasks
  const displayTasks = selectedDate
    ? getTasksForDate(selectedDate)
    : tasks.filter((task) => {
        if (filterCompleted === "active") return !task.completed;
        if (filterCompleted === "completed") return task.completed;
        return true;
      }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

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
            <button
              onClick={() => setShowTaskForm(true)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <Plus className="h-5 w-5" />
              New Task
            </button>
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
              onDateClick={handleDateClick}
            />
          </div>

          {/* Tasks Section */}
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedDate
                  ? `Tasks for ${selectedDate.toLocaleDateString()}`
                  : "All Tasks"}
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

            {/* Filter Buttons */}
            {!selectedDate && (
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() => setFilterCompleted("all")}
                  className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                    filterCompleted === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterCompleted("active")}
                  className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                    filterCompleted === "active"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilterCompleted("completed")}
                  className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                    filterCompleted === "completed"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  Completed
                </button>
              </div>
            )}

            {/* Task List */}
            <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
              {displayTasks.length > 0 ? (
                displayTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => {}}
                    onToggleComplete={handleToggleComplete}
                  />
                ))
              ) : (
                <div className="rounded-xl border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedDate
                      ? "No tasks for this date"
                      : "No tasks to display"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          onClose={() => setShowTaskForm(false)}
          onSubmit={handleCreateTask}
          initialDate={selectedDate || undefined}
        />
      )}
    </div>
  );
}
