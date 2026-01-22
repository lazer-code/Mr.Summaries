export type PageTemplate = "blank" | "grid" | "ruled";

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  points: Point[];
  tool: "pen" | "eraser" | "highlighter";
  color: string;
  width: number;
  alpha: number;
}

export interface Page {
  id: string;
  pageNumber: number;
  content: string; // Drawing data as JSON string or base64
  thumbnail?: string; // Optional thumbnail preview
  template?: PageTemplate; // Page template (default: "ruled")
}

export interface Notebook {
  id: string;
  title: string;
  subject: string;
  author: string;
  createdDate: Date;
  updatedDate: Date;
  pages: Page[];
}

export interface NotebookFormData {
  title: string;
  subject: string;
  author: string;
}
