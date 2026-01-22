"use client";

import { useState } from "react";
import { X, MapPin, Clock, Calendar } from "lucide-react";
import { EventFormData } from "@/types/event";

interface EventFormProps {
  onClose: () => void;
  onSubmit: (data: EventFormData) => void;
  initialDate?: Date;
}

export function EventForm({ onClose, onSubmit, initialDate }: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    startDate: initialDate || new Date(),
    endDate: initialDate || new Date(),
    startTime: "",
    endTime: "",
    location: "",
    type: "event",
    color: "#3b82f6",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: "startDate" | "endDate") => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [name]: new Date(e.target.value) }));
  };

  // Format date for input value (YYYY-MM-DD)
  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const eventTypes = [
    { value: "event", label: "Event" },
    { value: "class", label: "Class" },
    { value: "meeting", label: "Meeting" },
    { value: "deadline", label: "Deadline" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
        {/* Header */}
        <div className="border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:border-gray-700 dark:from-gray-800 dark:to-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create New Event
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
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Team Meeting, Guest Lecture"
                className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-800"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Add more details about this event..."
                className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-800"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Start Date */}
              <div>
                <label
                  htmlFor="startDate"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Start Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    required
                    value={formatDateForInput(formData.startDate)}
                    onChange={handleDateChange("startDate")}
                    className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-800"
                  />
                </div>
              </div>

              {/* End Date */}
              <div>
                <label
                  htmlFor="endDate"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  End Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    required
                    value={formatDateForInput(formData.endDate)}
                    onChange={handleDateChange("endDate")}
                    className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-800"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Start Time */}
              <div>
                <label
                  htmlFor="startTime"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Start Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-800"
                  />
                </div>
              </div>

              {/* End Time */}
              <div>
                <label
                  htmlFor="endTime"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  End Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-800"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Event Type */}
              <div>
                <label
                  htmlFor="type"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Event Type *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-800"
                >
                  {eventTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color */}
              <div>
                <label
                  htmlFor="color"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Color
                </label>
                <input
                  type="color"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="h-10 w-full rounded-lg border-2 border-gray-200 bg-white px-2 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:focus:border-blue-400 dark:focus:ring-blue-800"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Conference Room A, Zoom, Building 5"
                  className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-800"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-3">
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
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
