export const formatSemester = (semester?: string | null): string => {
  if (!semester) return '';
  const s = String(semester).trim();
  if (s === 'A' || s === 'א' || s === "א'") return "סמסטר א'";
  if (s === 'B' || s === 'ב' || s === "ב'") return "סמסטר ב'";
  if (s.toLowerCase() === 'summer' || s === 'קיץ') return 'סמסטר קיץ';
  return s.startsWith('סמסטר') ? s : `סמסטר ${s}`;
};

export const getSemesterRank = (semester?: string | null): number => {
  if (!semester) return 999;
  const s = String(semester).trim().toLowerCase();
  if (s === 'a' || s === 'א' || s === "א'" || s === "סמסטר א'" || s === 'סמסטר א') return 1;
  if (s === 'b' || s === 'ב' || s === "ב'" || s === "סמסטר ב'" || s === 'סמסטר ב') return 2;
  if (s === 'summer' || s === 'קיץ' || s === 'סמסטר קיץ') return 3;
  return 4;
};

export const formatYear = (year?: number | string | null): string => {
  if (year === undefined || year === null || year === '') return '';
  const yStr = String(year).trim().replace(/['׳"]/g, '');
  if (yStr === '1' || yStr === 'א' || yStr === 'שנה א') return "שנה א׳";
  if (yStr === '2' || yStr === 'ב' || yStr === 'שנה ב') return "שנה ב׳";
  if (yStr === '3' || yStr === 'ג' || yStr === 'שנה ג') return "שנה ג׳";
  if (yStr === '4' || yStr === 'ד' || yStr === 'שנה ד') return "שנה ד׳";

  const num = Number(yStr);
  if (num === 1) return "שנה א׳";
  if (num === 2) return "שנה ב׳";
  if (num === 3) return "שנה ג׳";
  if (num === 4) return "שנה ד׳";

  return String(year).trim();
};

export const getYearNumeric = (year?: number | string | null): number | null => {
  if (year === undefined || year === null || year === '') return null;
  if (typeof year === 'number' && !isNaN(year)) return year;
  const s = String(year).trim().replace(/['׳"]/g, '');
  if (s === '1' || s === 'א' || s.includes('שנה א')) return 1;
  if (s === '2' || s === 'ב' || s.includes('שנה ב')) return 2;
  if (s === '3' || s === 'ג' || s.includes('שנה ג')) return 3;
  if (s === '4' || s === 'ד' || s.includes('שנה ד')) return 4;
  const parsed = parseInt(s, 10);
  return isNaN(parsed) ? null : parsed;
};

export type SortField = 'year' | 'semester' | 'name';
export type SortDirection = 'asc' | 'desc';

export interface SortCriterion {
  field: SortField;
  direction: SortDirection;
}

export interface SortCombinationOption {
  id: string;
  label: string;
  group: string;
  criteria: SortCriterion[];
}

export const SORT_COMBINATION_OPTIONS: SortCombinationOption[] = [
  // Year first combinations
  {
    id: 'year_desc_sem_asc_name_asc',
    label: 'שנת לימוד (ד׳←א׳) ← סמסטר (א׳←קיץ) ← שם (א׳←ת׳) [ברירת מחדל]',
    group: 'שנת לימוד בעדיפות ראשונה',
    criteria: [
      { field: 'year', direction: 'desc' },
      { field: 'semester', direction: 'asc' },
      { field: 'name', direction: 'asc' }
    ]
  },
  {
    id: 'year_asc_sem_asc_name_asc',
    label: 'שנת לימוד (א׳←ד׳) ← סמסטר (א׳←קיץ) ← שם (א׳←ת׳)',
    group: 'שנת לימוד בעדיפות ראשונה',
    criteria: [
      { field: 'year', direction: 'asc' },
      { field: 'semester', direction: 'asc' },
      { field: 'name', direction: 'asc' }
    ]
  },
  {
    id: 'year_desc_sem_desc_name_asc',
    label: 'שנת לימוד (ד׳←א׳) ← סמסטר (קיץ←א׳) ← שם (א׳←ת׳)',
    group: 'שנת לימוד בעדיפות ראשונה',
    criteria: [
      { field: 'year', direction: 'desc' },
      { field: 'semester', direction: 'desc' },
      { field: 'name', direction: 'asc' }
    ]
  },
  {
    id: 'year_asc_sem_desc_name_asc',
    label: 'שנת לימוד (א׳←ד׳) ← סמסטר (קיץ←א׳) ← שם (א׳←ת׳)',
    group: 'שנת לימוד בעדיפות ראשונה',
    criteria: [
      { field: 'year', direction: 'asc' },
      { field: 'semester', direction: 'desc' },
      { field: 'name', direction: 'asc' }
    ]
  },
  {
    id: 'year_desc_name_asc_sem_asc',
    label: 'שנת לימוד (ד׳←א׳) ← שם (א׳←ת׳) ← סמסטר (א׳←קיץ)',
    group: 'שנת לימוד בעדיפות ראשונה',
    criteria: [
      { field: 'year', direction: 'desc' },
      { field: 'name', direction: 'asc' },
      { field: 'semester', direction: 'asc' }
    ]
  },
  {
    id: 'year_asc_name_asc_sem_asc',
    label: 'שנת לימוד (א׳←ד׳) ← שם (א׳←ת׳) ← סמסטר (א׳←קיץ)',
    group: 'שנת לימוד בעדיפות ראשונה',
    criteria: [
      { field: 'year', direction: 'asc' },
      { field: 'name', direction: 'asc' },
      { field: 'semester', direction: 'asc' }
    ]
  },

  // Semester first combinations
  {
    id: 'sem_asc_year_desc_name_asc',
    label: 'סמסטר (א׳←קיץ) ← שנת לימוד (ד׳←א׳) ← שם (א׳←ת׳)',
    group: 'סמסטר בעדיפות ראשונה',
    criteria: [
      { field: 'semester', direction: 'asc' },
      { field: 'year', direction: 'desc' },
      { field: 'name', direction: 'asc' }
    ]
  },
  {
    id: 'sem_asc_year_asc_name_asc',
    label: 'סמסטר (א׳←קיץ) ← שנת לימוד (א׳←ד׳) ← שם (א׳←ת׳)',
    group: 'סמסטר בעדיפות ראשונה',
    criteria: [
      { field: 'semester', direction: 'asc' },
      { field: 'year', direction: 'asc' },
      { field: 'name', direction: 'asc' }
    ]
  },
  {
    id: 'sem_desc_year_desc_name_asc',
    label: 'סמסטר (קיץ←א׳) ← שנת לימוד (ד׳←א׳) ← שם (א׳←ת׳)',
    group: 'סמסטר בעדיפות ראשונה',
    criteria: [
      { field: 'semester', direction: 'desc' },
      { field: 'year', direction: 'desc' },
      { field: 'name', direction: 'asc' }
    ]
  },
  {
    id: 'sem_desc_year_asc_name_asc',
    label: 'סמסטר (קיץ←א׳) ← שנת לימוד (א׳←ד׳) ← שם (א׳←ת׳)',
    group: 'סמסטר בעדיפות ראשונה',
    criteria: [
      { field: 'semester', direction: 'desc' },
      { field: 'year', direction: 'asc' },
      { field: 'name', direction: 'asc' }
    ]
  },
  {
    id: 'sem_asc_name_asc_year_desc',
    label: 'סמסטר (א׳←קיץ) ← שם (א׳←ת׳) ← שנת לימוד (ד׳←א׳)',
    group: 'סמסטר בעדיפות ראשונה',
    criteria: [
      { field: 'semester', direction: 'asc' },
      { field: 'name', direction: 'asc' },
      { field: 'year', direction: 'desc' }
    ]
  },

  // Name first combinations
  {
    id: 'name_asc_year_desc_sem_asc',
    label: 'שם (א׳←ת׳) ← שנת לימוד (ד׳←א׳) ← סמסטר (א׳←קיץ)',
    group: 'שם הקורס בעדיפות ראשונה',
    criteria: [
      { field: 'name', direction: 'asc' },
      { field: 'year', direction: 'desc' },
      { field: 'semester', direction: 'asc' }
    ]
  },
  {
    id: 'name_asc_year_asc_sem_asc',
    label: 'שם (א׳←ת׳) ← שנת לימוד (א׳←ד׳) ← סמסטר (א׳←קיץ)',
    group: 'שם הקורס בעדיפות ראשונה',
    criteria: [
      { field: 'name', direction: 'asc' },
      { field: 'year', direction: 'asc' },
      { field: 'semester', direction: 'asc' }
    ]
  },
  {
    id: 'name_asc_sem_asc_year_desc',
    label: 'שם (א׳←ת׳) ← סמסטר (א׳←קיץ) ← שנת לימוד (ד׳←א׳)',
    group: 'שם הקורס בעדיפות ראשונה',
    criteria: [
      { field: 'name', direction: 'asc' },
      { field: 'semester', direction: 'asc' },
      { field: 'year', direction: 'desc' }
    ]
  },
  {
    id: 'name_desc_year_desc_sem_asc',
    label: 'שם (ת׳←א׳) ← שנת לימוד (ד׳←א׳) ← סמסטר (א׳←קיץ)',
    group: 'שם הקורס בעדיפות ראשונה',
    criteria: [
      { field: 'name', direction: 'desc' },
      { field: 'year', direction: 'desc' },
      { field: 'semester', direction: 'asc' }
    ]
  },
  {
    id: 'name_desc_sem_asc_year_desc',
    label: 'שם (ת׳←א׳) ← סמסטר (א׳←קיץ) ← שנת לימוד (ד׳←א׳)',
    group: 'שם הקורס בעדיפות ראשונה',
    criteria: [
      { field: 'name', direction: 'desc' },
      { field: 'semester', direction: 'asc' },
      { field: 'year', direction: 'desc' }
    ]
  }
];

export const DEFAULT_SORT_COMBINATION_ID = 'year_desc_sem_asc_name_asc';

export const compareCoursesByCriteria = (a: any, b: any, criteria: SortCriterion[]): number => {
  for (const criterion of criteria) {
    const { field, direction } = criterion;
    let diff = 0;

    if (field === 'year') {
      const yearA = getYearNumeric(a.year);
      const yearB = getYearNumeric(b.year);
      if (yearA !== null && yearB !== null) {
        if (yearA !== yearB) {
          diff = direction === 'asc' ? yearA - yearB : yearB - yearA;
        }
      } else if (yearA !== null && yearB === null) {
        diff = -1;
      } else if (yearA === null && yearB !== null) {
        diff = 1;
      }
    } else if (field === 'semester') {
      const semA = getSemesterRank(a.Semester || a.semester);
      const semB = getSemesterRank(b.Semester || b.semester);
      const hasSemA = semA !== 999;
      const hasSemB = semB !== 999;
      if (hasSemA && hasSemB) {
        if (semA !== semB) {
          diff = direction === 'asc' ? semA - semB : semB - semA;
        }
      } else if (hasSemA && !hasSemB) {
        diff = -1;
      } else if (!hasSemA && hasSemB) {
        diff = 1;
      }
    } else if (field === 'name') {
      const nameA = a.name || '';
      const nameB = b.name || '';
      const comp = nameA.localeCompare(nameB, 'he');
      if (comp !== 0) {
        diff = direction === 'asc' ? comp : -comp;
      }
    }

    if (diff !== 0) {
      return diff;
    }
  }

  // Stable secondary fallback
  return (a.name || '').localeCompare(b.name || '', 'he');
};

// Backward compatibility types & functions
export type SortCategory = 'year' | 'semester' | 'name';
export interface SortConfig {
  category: SortCategory;
  direction: SortDirection;
}

export const sortCoursesByConfig = (a: any, b: any, config: SortConfig): number => {
  const criteria: SortCriterion[] = [
    { field: config.category, direction: config.direction },
    ...(config.category !== 'year' ? [{ field: 'year' as SortField, direction: 'desc' as SortDirection }] : []),
    ...(config.category !== 'semester' ? [{ field: 'semester' as SortField, direction: 'asc' as SortDirection }] : []),
    ...(config.category !== 'name' ? [{ field: 'name' as SortField, direction: 'asc' as SortDirection }] : [])
  ];
  return compareCoursesByCriteria(a, b, criteria);
};

export const sortCourses = (a: any, b: any): number => {
  const defaultOption = SORT_COMBINATION_OPTIONS[0];
  return compareCoursesByCriteria(a, b, defaultOption.criteria);
};

export interface SemesterCourseGroup {
  semesterKey: string;
  semesterRank: number;
  semesterLabel: string;
  courses: any[];
}

export interface YearCourseGroup {
  yearNumeric: number | null;
  yearLabel: string;
  semesters: SemesterCourseGroup[];
  totalCoursesCount: number;
}

/**
 * Groups courses by academic year (שנה א׳, ב׳, ג׳, ד׳) in ascending order (שנה א first),
 * then by semester (סמסטר א׳, ב׳, קיץ), and sorts courses alphabetically by name.
 */
export const groupCoursesByYearAndSemester = (courses: any[]): YearCourseGroup[] => {
  const standardYears = [
    { num: 1, label: "שנה א׳" },
    { num: 2, label: "שנה ב׳" },
    { num: 3, label: "שנה ג׳" },
    { num: 4, label: "שנה ד׳" },
  ];

  const yearMap = new Map<number | 'other', { label: string; semMap: Map<string, SemesterCourseGroup> }>();

  for (const y of standardYears) {
    yearMap.set(y.num, {
      label: y.label,
      semMap: new Map(),
    });
  }

  for (const course of courses) {
    const rawYear = course.year;
    const yearNum = getYearNumeric(rawYear);

    const yearKey: number | 'other' = (yearNum !== null && yearNum >= 1 && yearNum <= 4)
      ? yearNum
      : (yearNum !== null ? yearNum : 'other');

    if (!yearMap.has(yearKey)) {
      const label = typeof yearKey === 'number' ? `שנה ${yearKey}` : 'קורסים נוספים';
      yearMap.set(yearKey, { label, semMap: new Map() });
    }

    const yearEntry = yearMap.get(yearKey)!;

    const rawSem = course.Semester || course.semester;
    const semRank = getSemesterRank(rawSem);
    let semKey = 'other';
    let semLabel = 'סמסטר כללי';

    if (semRank === 1) {
      semKey = 'A';
      semLabel = "סמסטר א׳";
    } else if (semRank === 2) {
      semKey = 'B';
      semLabel = "סמסטר ב׳";
    } else if (semRank === 3) {
      semKey = 'Summer';
      semLabel = "סמסטר קיץ";
    } else if (rawSem) {
      semKey = String(rawSem);
      semLabel = formatSemester(rawSem);
    }

    if (!yearEntry.semMap.has(semKey)) {
      yearEntry.semMap.set(semKey, {
        semesterKey: semKey,
        semesterRank: semRank,
        semesterLabel: semLabel,
        courses: [],
      });
    }

    yearEntry.semMap.get(semKey)!.courses.push(course);
  }

  const result: YearCourseGroup[] = [];

  const sortedYearKeys = Array.from(yearMap.keys()).sort((a, b) => {
    if (a === 'other') return 1;
    if (b === 'other') return -1;
    return (a as number) - (b as number);
  });

  for (const yKey of sortedYearKeys) {
    const entry = yearMap.get(yKey)!;

    // Standard order: Semester A (rank 1), Semester B (rank 2), Summer (rank 3), other (rank 4)
    const semList = Array.from(entry.semMap.values()).sort((a, b) => {
      if (a.semesterRank !== b.semesterRank) return a.semesterRank - b.semesterRank;
      return a.semesterLabel.localeCompare(b.semesterLabel, 'he');
    });

    let yearCount = 0;
    for (const sem of semList) {
      // Sort courses alphabetically by name in Hebrew
      sem.courses.sort((a, b) => (a.name || '').trim().localeCompare((b.name || '').trim(), 'he'));
      yearCount += sem.courses.length;
    }

    if (yearCount > 0) {
      result.push({
        yearNumeric: typeof yKey === 'number' ? yKey : null,
        yearLabel: entry.label,
        semesters: semList.filter(s => s.courses.length > 0),
        totalCoursesCount: yearCount,
      });
    }
  }

  return result;
};
