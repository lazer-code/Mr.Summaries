export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  dueTime?: string; // HH:mm format
  location?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category?: string;
  createdAt: Date;
}

export interface TaskFormData {
  title: string;
  description?: string;
  dueDate: Date;
  dueTime?: string; // HH:mm format
  location?: string;
  priority: "low" | "medium" | "high";
  category?: string;
}

export type CalendarView = "month" | "week" | "day";
