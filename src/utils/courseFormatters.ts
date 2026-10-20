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
  const yStr = String(year).trim();
  if (yStr === '1' || yStr === 'א' || yStr === "א'" || yStr === 'שנה א' || yStr === "שנה א'") return "שנה א'";
  if (yStr === '2' || yStr === 'ב' || yStr === "ב'" || yStr === 'שנה ב' || yStr === "שנה ב'") return "שנה ב'";
  if (yStr === '3' || yStr === 'ג' || yStr === "ג'" || yStr === 'שנה ג' || yStr === "שנה ג'") return "שנה ג'";
  if (yStr === '4' || yStr === 'ד' || yStr === "ד'" || yStr === 'שנה ד' || yStr === "שנה ד'") return "שנה ד'";

  const num = Number(yStr);
  if (num === 1) return "שנה א'";
  if (num === 2) return "שנה ב'";
  if (num === 3) return "שנה ג'";
  if (num === 4) return "שנה ד'";

  return yStr;
};

export const getYearNumeric = (year?: number | string | null): number | null => {
  if (year === undefined || year === null || year === '') return null;
  if (typeof year === 'number' && !isNaN(year)) return year;
  const s = String(year).trim();
  if (s === '1' || s === 'א' || s === "א'" || s.includes('שנה א')) return 1;
  if (s === '2' || s === 'ב' || s === "ב'" || s.includes('שנה ב')) return 2;
  if (s === '3' || s === 'ג' || s === "ג'" || s.includes('שנה ג')) return 3;
  if (s === '4' || s === 'ד' || s === "ד'" || s.includes('שנה ד')) return 4;
  const parsed = parseInt(s, 10);
  return isNaN(parsed) ? null : parsed;
};

export const sortCourses = (a: any, b: any): number => {
  const yearA = getYearNumeric(a.year);
  const yearB = getYearNumeric(b.year);

  // 1. Year descending (higher degree year first; courses with year come before courses without)
  if (yearA !== null && yearB !== null) {
    if (yearB !== yearA) {
      return yearB - yearA;
    }
  } else if (yearA !== null && yearB === null) {
    return -1;
  } else if (yearA === null && yearB !== null) {
    return 1;
  }

  // 2. Semester ascending (סמסטר א' -> סמסטר ב' -> סמסטר קיץ)
  const semA = getSemesterRank(a.Semester || a.semester);
  const semB = getSemesterRank(b.Semester || b.semester);
  if (semA !== semB) {
    return semA - semB;
  }

  // 3. Name ascending (Hebrew alphabetical)
  const nameA = a.name || '';
  const nameB = b.name || '';
  return nameA.localeCompare(nameB, 'he');
};
