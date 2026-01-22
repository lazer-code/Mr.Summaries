export interface Summary {
  id: string;
  courseNumber: string;
  courseName: string;
  title: string;
  author: string;
  uploadDate: Date;
  content: string; // Can be markdown or HTML with LaTeX
  preview: string; // Short preview of content
}

export interface SummaryFormData {
  courseNumber: string;
  courseName: string;
  title: string;
  author: string;
  content: string;
}
