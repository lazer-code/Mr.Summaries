export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  startTime?: string; // HH:mm format
  endTime?: string; // HH:mm format
  location?: string;
  type: "event" | "class" | "meeting" | "deadline" | "other";
  color?: string;
  recurring?: {
    frequency: "daily" | "weekly" | "monthly";
    until?: Date;
  };
  createdAt: Date;
}

export interface EventFormData {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  startTime?: string; // HH:mm format
  endTime?: string; // HH:mm format
  location?: string;
  type: "event" | "class" | "meeting" | "deadline" | "other";
  color?: string;
}
