# Migration of Definitions & Claims to "Add Page" Flow

Move the creation and editing of **Definitions (הגדרות)** and **Claims (משפטים)** out of the heavy Course creation modal and into the streamlined **Add Page (הוסף דף)** workflow, keeping them as dedicated single-page resources per course.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product decisions were confirmed during the clarification phase:
> - **Single Dedicated Page**: Definitions and Claims remain single dedicated reference pages per course (stored on the course record via `definitionsID` and `claimsID`).
> - **Upsert on Add**: When an admin selects "הגדרות" or "משפטים" from "הוסף דף", if one already exists for the course, the modal opens pre-filled with the existing content ready for editing.
> - **Lean Course Modal**: The Course Creation/Edit modal now only manages core course metadata (name, course number, RTL toggle) and the Course Syllabus/Overview, stripping out the heavy secondary note fields.

---

## 1. Overview & Core Concept

Currently, creating or editing a course requires filling out or navigating past three large Markdown/PDF uploaders (Overview, Definitions, and Claims) all in a single modal. This creates unnecessary cognitive overload when setting up a course.

With this change:
- **Course Modal**: Becomes clean and lightweight. It only handles Course Name, Course Number, RTL preference, and Syllabus / Overview.
- **Add Page Modal (הוסף דף)**: Expanded from 3 options (Summary, Lecture, Example) to 5 options by adding **הגדרות (Definitions)** and **משפטים (Claims)** with dedicated icons.
- **Unified Content Editor (`ContentModal`)**: Handles Markdown and PDF uploads for Definitions and Claims, seamlessly saving file updates and linking them back to the active course.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Creating a Course**:
   - Admin opens "הוסף קורס" from Home.
   - Enters Name, Number, RTL, and optionally the Syllabus/Overview (Markdown or PDF).
   - Saves without being forced to deal with Definitions or Claims.

2. **Adding or Editing Definitions / Claims**:
   - From the Course page, admin clicks **"הוסף דף"** (Add Page).
   - The selection modal presents 5 distinct options:
     - 📄 **סיכום (Summary)**
     - 📋 **הרצאה (Lecture)**
     - 💡 **דוגמה (Example)**
     - 📖 **הגדרות (Definitions)**
     - 🔖 **משפטים (Claims / Theorems)**
   - Clicking **"הגדרות"** or **"משפטים"**:
     - If content already exists: Opens the editor with existing Markdown text or PDF details loaded.
     - If none exists yet: Opens a fresh editor.
   - On saving, the new file is stored in Appwrite Storage with cache-busting unique ID, and the Course document's `definitionsID` or `claimsID` is updated.
   - The course tabs immediately display the new tab and activate it.

3. **In-Tab Editing & Deletion**:
   - When viewing the "הגדרות" or "משפטים" tab on the course page, an **"ערוך דף"** (Edit) button allows quick modifications directly without needing to open the Add Page menu.
   - Deleting the note from the modal clears the file from storage and removes the tab from the course.

### Visual Styling & Tokens
- **Theme Consistency**: Preserves the dark obsidian aesthetic (`bg-zinc-900`, `border-zinc-800`, `text-zinc-50`).
- **Option Grid**: Add Page menu styled with interactive hover states (`hover:bg-zinc-800`, `border-zinc-700/60`), subtle cyan accents, and clear Hebrew typographic labels.
- **Responsive RTL Layout**: Full right-to-left layout with natural button padding and legible typography.

---

## 3. Key Product Decisions & Trade-Offs

- **Preserve Course-Level Attributes (`definitionsID`, `claimsID`)**:
  - *Why*: The backend Appwrite database does not have standalone `definitions` or `claims` collections. Storing them as references on the Course document preserves database compatibility while delivering the exact UX the user requested.
- **Pre-Fill Existing Content on Selection**:
  - *Why*: Because each course has one definitive set of Definitions and one set of Claims, selecting "הגדרות" when one already exists opens the existing content rather than creating an orphaned duplicate or blocking the user.
- **Cache-Busting Unique IDs for File Replacement**:
  - *Why*: Retains the robust file upload pattern established previously, creating the new file with `ID.unique()` before removing the previous file, preventing browser cache staleness.

---

## 4. Technical Architecture & Data Strategy

### System & State Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        Course Page                          │
│                                                             │
│  [Tabs: סילבוס | סיכומים | הרצאות | דוגמאות | הגדרות | משפטים]  │
│                                                             │
│    [ ערוך קורס ]                [ + הוסף דף ]                │
└──────────┬────────────────────────────┬─────────────────────┘
           │                            │
           ▼                            ▼
┌──────────────────────┐      ┌───────────────────────────────┐
│     CourseModal      │      │         AddPageModal          │
│                      │      │                               │
│  • Name & Number     │      │  • סיכום      (Summary)       │
│  • RTL Toggle        │      │  • הרצאה      (Lecture)       │
│  • Syllabus Overview │      │  • דוגמה      (Example)       │
│  (Definitions/Claims │      │  • הגדרות     (Definitions)   │
│   removed)           │      │  • משפטים     (Claims)        │
└──────────────────────┘      └───────────────┬───────────────┘
                                              │
                                              ▼
                              ┌───────────────────────────────┐
                              │         ContentModal          │
                              │                               │
                              │  Handles 5 types:             │
                              │  summary, lecture, example,   │
                              │  definitions, claims          │
                              │                               │
                              │  Saves to Appwrite Storage    │
                              │  Updates Course document with │
                              │  definitionsID / claimsID     │
                              └───────────────────────────────┘
```

### Component & Data Mapping

1. **`CourseModal`**:
   - Prune `definitions*` and `claims*` state variables, file handlers, and DOM sections.
   - When updating the course document, keep existing `definitionsID` and `claimsID` values intact so they are not wiped.
2. **`AddPageModal`**:
   - Expand `onSelect` callback type union to include `'definitions' | 'claims'`.
   - Add button options for "הגדרות" (BookOpen icon) and "משפטים" (Bookmark icon).
3. **`ContentModal`**:
   - Add label configs for `definitions` and `claims`.
   - Update submission handler: when `type === 'definitions'` or `type === 'claims'`, persist file to storage and update `course.definitionsID` or `course.claimsID`.
   - Update deletion handler: delete file and set `definitionsID: null` or `claimsID: null` on the course.
4. **`Course` Page**:
   - Wire `AddPageModal` selection for `definitions` and `claims` to pass existing file ID if present.
   - Add tab header "ערוך דף" action button when on `definitions` or `claims` tab for admins.
