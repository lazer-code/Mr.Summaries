import { Task } from "@/types/task";

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Study for MATH 201 Midterm",
    description: "Review integration techniques and practice problems from chapters 5-7",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    completed: false,
    priority: "high",
    category: "Exam",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    title: "Complete CS 224 Assignment 3",
    description: "Implement merge sort and quick sort algorithms with test cases",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    completed: false,
    priority: "high",
    category: "Assignment",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    title: "PHYS 102 Lab Report",
    description: "Write up Maxwell's equations lab with diagrams and calculations",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    completed: false,
    priority: "medium",
    category: "Lab Report",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    title: "Read ECON 101 Chapter 8",
    description: "Market structures and competition",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    completed: true,
    priority: "low",
    category: "Reading",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "5",
    title: "Group Project Meeting - CHEM 301",
    description: "Discuss reaction mechanisms presentation outline",
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    completed: false,
    priority: "medium",
    category: "Meeting",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "6",
    title: "Submit BIO 205 Lab Worksheet",
    description: "Cell cycle diagrams and checkpoint questions",
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago (overdue)
    completed: false,
    priority: "high",
    category: "Worksheet",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
  {
    id: "7",
    title: "Office Hours - Math Tutor",
    description: "Get help with double integrals",
    dueDate: new Date(),
    completed: true,
    priority: "medium",
    category: "Meeting",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "8",
    title: "Review Lecture Notes - All Courses",
    description: "Weekly review and summary creation",
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
    completed: false,
    priority: "low",
    category: "Study",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

// Helper functions
export function getTasks(filter?: { completed?: boolean; priority?: string }): Task[] {
  if (!filter) {
    return mockTasks;
  }

  return mockTasks.filter((task) => {
    if (filter.completed !== undefined && task.completed !== filter.completed) {
      return false;
    }
    if (filter.priority && task.priority !== filter.priority) {
      return false;
    }
    return true;
  });
}

export function getTaskById(id: string): Task | undefined {
  return mockTasks.find((task) => task.id === id);
}

export function getTasksForDate(date: Date): Task[] {
  return mockTasks.filter((task) => {
    const taskDate = new Date(task.dueDate);
    return (
      taskDate.getDate() === date.getDate() &&
      taskDate.getMonth() === date.getMonth() &&
      taskDate.getFullYear() === date.getFullYear()
    );
  });
}

export function getTasksForDateRange(startDate: Date, endDate: Date): Task[] {
  return mockTasks.filter((task) => {
    const taskDate = new Date(task.dueDate);
    return taskDate >= startDate && taskDate <= endDate;
  });
}
