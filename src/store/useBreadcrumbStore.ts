import { create } from 'zustand';

export interface BreadcrumbItem {
  label: string;
  to?: string;
  icon?: 'home' | 'course' | 'summaries' | 'summary' | 'lecture' | 'example' | 'profile' | 'login';
}

interface BreadcrumbState {
  customItems: BreadcrumbItem[] | null;
  setBreadcrumbs: (items: BreadcrumbItem[] | null) => void;
  courseCache: Record<string, { name: string; number?: string }>;
  cacheCourse: (id: string, info: { name: string; number?: string }) => void;
}

export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
  customItems: null,
  setBreadcrumbs: (items) => set({ customItems: items }),
  courseCache: {},
  cacheCourse: (id, info) =>
    set((state) => ({
      courseCache: { ...state.courseCache, [id]: info },
    })),
}));
