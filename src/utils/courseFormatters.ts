export const formatSemester = (semester?: string | null): string => {
  if (!semester) return '';
  const s = String(semester).trim();
  if (s === 'A' || s === 'א' || s === "א'") return "סמסטר א'";
  if (s === 'B' || s === 'ב' || s === "ב'") return "סמסטר ב'";
  if (s.toLowerCase() === 'summer' || s === 'קיץ') return 'סמסטר קיץ';
  return s.startsWith('סמסטר') ? s : `סמסטר ${s}`;
};
