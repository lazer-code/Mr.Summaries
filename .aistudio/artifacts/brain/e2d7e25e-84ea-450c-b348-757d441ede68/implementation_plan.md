# Course Year and Semester Integration Plan

Restore the **Year** and **Semester** input fields to the Course creation and editing modal, persist them to Appwrite, and render them as clean, informative badges on the home page course cards and the course detail header.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were clarified and confirmed with the user in Phase 1:

- **Year Input Format (Confirmed)**: Calendar year input (numeric input formatted for 4-digit years like `2024`, `2025`, `2026`, defaulting to the current calendar year for newly created courses).
- **Semester Options (Confirmed)**: Dedicated dropdown selector supporting **סמסטר א' (A)**, **סמסטר ב' (B)**, and **סמסטר קיץ (Summer)**.
- **Badge Visibility (Confirmed)**: Visible badges displayed on both Home course cards (enrolled and all courses) and the Course page header next to the course number.

---

### 1. Overview & Core Concept

- **What It Does**: Enables students and lecturers to categorize and filter courses by academic calendar year and semester term. Course creation and editing forms will capture both fields seamlessly, storing them directly into the Appwrite `courses` collection (`year` as integer, `Semester` as string), and displaying them neatly alongside the course number in the UI.
- **Target Audience**: Students navigating course material across semesters and instructors managing multi-term curricula.
- **Key Value**: Provides immediate chronological context without cluttering the course title, allowing students to distinguish different offerings of the same or recurring courses.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Course Creation / Edit Flow**:
   - In `CourseModal`, alongside "שם הקורס" (Course Name) and "מספר קורס" (Course Number), the form presents a two-column row:
     - **שנת לימוד (Year)**: Number input pre-filled with the current year (e.g. `2025`), with step/number validation.
     - **סמסטר (Semester)**: Dropdown select with clear, bilingual Hebrew/English options:
       - `סמסטר א'` (Value: `'A'`)
       - `סמסטר ב'` (Value: `'B'`)
       - `סמסטר קיץ` (Value: `'Summer'`)
   - Pre-fills correctly when editing existing courses (`course.year`, `course.Semester`).
   - Saves into the Appwrite database upon submit.

2. **Home Course Cards Display**:
   - Both "הקורסים שלי" (Enrolled) and "כל הקורסים" (All Courses) cards display badges next to the course number:
     - Course Number: `cyan-900/50 text-cyan-300 font-mono text-xs`
     - Year: `zinc-800 text-zinc-300 border border-zinc-700/60 font-mono text-xs` (e.g., `2025`)
     - Semester: `zinc-800 text-zinc-300 border border-zinc-700/60 text-xs` (e.g., `סמסטר א'`)

3. **Course Page Header Display**:
   - Next to or below the course title in `Course.tsx`:
     - Displays the course number badge followed by the year and formatted semester badge in a responsive flex row with clean typography separators.

#### Visual Styling & Layout
- **Tailwind Tokens & Contrast**: Adheres to the established dark mode theme (`zinc-900` surface, `cyan-400` highlights, `emerald` for enrolled status).
- **Badge Discipline**: Clean, compact metadata badges with subtle borders (`px-2 py-0.5 rounded-md text-xs`), avoiding bulky pills while maintaining distinct readable tags.
- **Semester Formatter Utility**: Helper function translating stored values `'A'` -> `'סמסטר א'`, `'B'` -> `'סמסטר ב'`, `'Summer'` -> `'סמסטר קיץ'` for graceful localized display.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Direct Appwrite Field Alignment (`year` & `Semester`)**:
  - *Chosen Approach*: Maintain exact compatibility with Appwrite collection attributes: `year` (integer) and `Semester` (string: `'A'`, `'B'`, `'Summer'`).
  - *Why*: Existing documents in Appwrite already utilize these exact casing and type conventions. Respecting the schema avoids breaking backward compatibility or requiring database migrations.
  - *Alternatives Considered*: Standardizing on lowercase `semester` — rejected to avoid mismatch with existing database entries.

- **Decision 2: Optional vs Required Fields**:
  - *Chosen Approach*: Year and Semester will be optional inputs during course creation/editing, but pre-filled with sensible defaults (current year) to encourage consistent tagging without blocking legacy courses without year/semester data.
  - *Why*: Existing courses in the database may not have year or semester populated; the UI will only render badges when those fields exist (`course.year`, `course.Semester`).

---

### 4. Technical Architecture & Data Strategy

#### Architecture & Component Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                       Appwrite Backend                       │
│                   courses Database Document                  │
│       { name, number, year: 2025, Semester: "A", ... }       │
└──────────────────────────────┬───────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌───────────────────────┐             ┌────────────────────────┐
│     CourseModal       │             │   Course Displays      │
│  - Year number input  │             │  - Home Course Cards   │
│  - Semester dropdown  │             │  - Course Page Header  │
│  - Save year/Semester │             │  - Format & Badges     │
└───────────────────────┘             └────────────────────────┘
```

#### Interactive Component & State Mapping
1. **`src/components/CourseModal.tsx`**:
   - Add state: `year` (string/number), `semester` (string).
   - In `useEffect`, populate `setYear(course.year ?? new Date().getFullYear())` and `setSemester(course.Semester || course.semester || 'A')`.
   - On save: Pass `year: year ? parseInt(year.toString(), 10) : null` and `Semester: semester || null` in the course payload to `api.createCourse` / `api.updateCourse`.
2. **`src/pages/Home.tsx`**:
   - In both enrolled courses map and all courses map, render year and semester badges adjacent to `course.number`.
3. **`src/pages/Course.tsx`**:
   - In the top course header, render year and semester badges alongside the course number tag.
4. **Helper Utility**:
   - Formatter function for semester display: `'A' -> 'סמסטר א'`, `'B' -> 'סמסטר ב'`, `'Summer' -> 'סמסטר קיץ'`.
