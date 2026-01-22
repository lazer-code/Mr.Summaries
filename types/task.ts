export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category?: string;
  createdAt: Date;
}

export interface TaskFormData {
  title: string;
  description?: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  category?: string;
}

export type CalendarView = "month" | "week" | "day";
