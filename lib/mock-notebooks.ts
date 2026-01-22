import { Notebook } from "@/types/notebook";

export const mockNotebooks: Notebook[] = [
  {
    id: "1",
    title: "Calculus II Notes",
    subject: "MATH 201",
    author: "Sarah Johnson",
    createdDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedDate: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    pages: [
      {
        id: "1-1",
        pageNumber: 1,
        content: "", // Empty for now
        thumbnail: undefined,
      },
    ],
  },
  {
    id: "2",
    title: "Physics Lab Observations",
    subject: "PHYS 102",
    author: "Michael Chen",
    createdDate: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    updatedDate: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    pages: [
      {
        id: "2-1",
        pageNumber: 1,
        content: "",
        thumbnail: undefined,
      },
      {
        id: "2-2",
        pageNumber: 2,
        content: "",
        thumbnail: undefined,
      },
    ],
  },
  {
    id: "3",
    title: "Algorithm Design Notes",
    subject: "CS 224",
    author: "Emily Rodriguez",
    createdDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    updatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    pages: [
      {
        id: "3-1",
        pageNumber: 1,
        content: "",
        thumbnail: undefined,
      },
    ],
  },
  {
    id: "4",
    title: "Organic Chemistry Mechanisms",
    subject: "CHEM 301",
    author: "David Park",
    createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    pages: [
      {
        id: "4-1",
        pageNumber: 1,
        content: "",
        thumbnail: undefined,
      },
      {
        id: "4-2",
        pageNumber: 2,
        content: "",
        thumbnail: undefined,
      },
      {
        id: "4-3",
        pageNumber: 3,
        content: "",
        thumbnail: undefined,
      },
    ],
  },
  {
    id: "5",
    title: "Economics Study Guide",
    subject: "ECON 101",
    author: "Jessica Lee",
    createdDate: new Date(Date.now() - 1 * 7 * 24 * 60 * 60 * 1000), // 1 week ago
    updatedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    pages: [
      {
        id: "5-1",
        pageNumber: 1,
        content: "",
        thumbnail: undefined,
      },
    ],
  },
  {
    id: "6",
    title: "Cell Biology Diagrams",
    subject: "BIO 205",
    author: "Amanda Thompson",
    createdDate: new Date(Date.now() - 2 * 7 * 24 * 60 * 60 * 1000), // 2 weeks ago
    updatedDate: new Date(Date.now() - 1 * 7 * 24 * 60 * 60 * 1000), // 1 week ago
    pages: [
      {
        id: "6-1",
        pageNumber: 1,
        content: "",
        thumbnail: undefined,
      },
      {
        id: "6-2",
        pageNumber: 2,
        content: "",
        thumbnail: undefined,
      },
    ],
  },
];

// Helper function to get notebooks (can be extended for filtering/searching)
export function getNotebooks(searchTerm?: string): Notebook[] {
  if (!searchTerm) {
    return mockNotebooks;
  }

  const term = searchTerm.toLowerCase();
  return mockNotebooks.filter(
    (notebook) =>
      notebook.title.toLowerCase().includes(term) ||
      notebook.subject.toLowerCase().includes(term) ||
      notebook.author.toLowerCase().includes(term)
  );
}

export function getNotebookById(id: string): Notebook | undefined {
  return mockNotebooks.find((notebook) => notebook.id === id);
}
