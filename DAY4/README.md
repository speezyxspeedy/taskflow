# TaskFlow — Smart To-Do List

A modern, distraction-free To-Do and productivity application built as **Day 4 of my 365 Days Coding Challenge**.

`Day 4/365 — Building in Public.`

---

## 🚀 Project Overview

**TaskFlow** is designed for modern makers and professionals who want an elegant, high-performance daily planner without the clutter of heavyweight project management suites. It features a SaaS-grade dark/light theme, live progress analytics, priority tagging, due-date awareness (including overdue/today indicators), real-time search, multi-level filtering, and a lightweight toast notification system.

Built strictly with **Vanilla HTML5, CSS3, and modern JavaScript (ES6+)**, TaskFlow requires zero external dependencies, no libraries, and zero build configurations.

---

## ✨ Features

- **Dashboard Header**:
  - Clean brand mark with challenge badge.
  - Dynamically rendered localized current date (e.g., `Wed, Oct 7, 2026`).
  - Seamless Dark / Light mode toggle with smooth theme transition.
- **Real-Time Progress Card**:
  - Live task completion counter (`7 / 10 Tasks Completed`).
  - High-impact percentage indicator (`70%`).
  - Fluid animated progress bar with dynamic motivational feedback messages.
- **Dynamic Task Metrics (Stats Section)**:
  - 4 quick-glance metric cards: Total Tasks, Completed, Active, and High Priority counts.
- **Streamlined Task Creation**:
  - Clean input with validation (rejects blank entries with alert toasts).
  - Priority assignment (`Low`, `Medium`, `High`) with custom indicator styling.
  - Native due-date picker with intelligent status badges (`Overdue`, `Today`, `Tomorrow`).
- **Interactive Task List**:
  - Animated item entry and exit transitions.
  - Custom SVG checkmarks with strike-through completion styling.
  - Quick-action delete with smooth slide-out removal.
- **Real-Time Search & Status Filtering**:
  - Real-time search by task title with quick-clear button.
  - Filter by `All`, `Active`, and `Completed` tabs with dynamic task count badges.
  - Search and status filters operate simultaneously in composite harmony.
- **Polished Empty States**:
  - Distinct illustrations and copy for "No tasks yet" vs. "No matching tasks found".
- **Feedback & Notifications**:
  - Non-intrusive floating toast alerts for actions: task added, completed, marked active, deleted, and theme toggled.
- **Client-Side Persistence (`localStorage`)**:
  - Automatically preserves task list and selected visual theme across page reloads.
- **100% Responsive Design**:
  - Optimized layout for mobile phones, tablets, laptops, and ultra-wide desktop monitors.

---

## 🛠️ Tech Stack

- **HTML5**: Semantic document layout with accessible ARIA tags and form controls.
- **CSS3 (Vanilla)**:
  - CSS custom properties (variables) for theme switching.
  - Fluid flexbox and CSS grid layouts.
  - Micro-interactions, cubic-bezier transitions, and keyframe animations.
  - Mobile-first responsive media queries.
- **JavaScript (Vanilla ES6+)**:
  - Modular, readable architecture without framework dependencies.
  - Event delegation and DOM updates.
  - Clean state synchronization with `localStorage`.

---

## 📂 File Structure

```text
DAY4/
├── index.html       # Semantic HTML5 layout and accessibility markup
├── style.css        # Design tokens, dark/light themes, animations, SaaS styling
├── script.js        # Core state management, CRUD logic, search, filters, toasts
└── README.md        # Documentation and challenge reflection
```

---

## 🔧 Modular JavaScript Functions

The code is organized into focused, single-responsibility functions:

| Function | Description |
| :--- | :--- |
| `initApp()` | Bootstraps the application, loads stored data, sets defaults, renders UI |
| `initTheme()` / `toggleTheme()` | Handles theme detection, switching, and persisting preferences |
| `loadTasks()` / `saveTasks()` | Safely reads and writes task data to `localStorage` |
| `renderTasks()` | Filters and renders the active tasks and empty states to the DOM |
| `addTask(title, priority, dueDate)` | Validates and prepends new task items to the task list |
| `toggleTask(taskId)` | Flips completion state, updates UI counters, and triggers toast |
| `deleteTask(taskId)` | Triggers slide-out exit animation and removes task from state |
| `filterTasks(type)` | Switches active tab filter (`all`, `active`, `completed`) |
| `searchTasks(query)` | Executes instant real-time text query filtering |
| `updateStats()` | Recalculates total, completed, active, and high-priority counters |
| `updateProgress()` | Updates completion percentage and dynamic progress bar |
| `showToast(msg, type)` | Spawns auto-dismissing toast notifications |

---

## 💾 LocalStorage Implementation

Data is persisted in the user's browser using two primary keys:

1. **`taskflow_tasks`**: Stores an array of task objects:
   ```json
   [
     {
       "id": "task_1728321000_abc123",
       "title": "Practice C++",
       "priority": "high",
       "dueDate": "2026-10-07",
       "completed": false
     }
   ]
   ```
2. **`taskflow_theme`**: Stores either `'dark'` or `'light'`.

On initial launch, if no previous tasks exist, realistic starter tasks are seeded so the application is immediately interactive.

---

## 🚀 How to Run Locally

Because this application relies solely on standard web technologies, running it requires no build tools or package managers:

1. Clone or download this repository.
2. Open the directory:
   ```bash
   cd DAY4
   ```
3. Open `index.html` directly in any modern browser:
   - Double-click `index.html` in your file explorer, or
   - Use a local dev server such as Python:
     ```bash
     python -m http.server 3000
     ```
   - Or with Node `serve`:
     ```bash
     npx serve .
     ```
4. Access the app in your browser at `http://localhost:3000` (or `file://...`).

---

## 🧠 What I Learned (Day 4 Reflection)

1. **Composite Filtering**: Orchestrating text search and category status filters together in pure JavaScript without state drift or race conditions.
2. **SaaS Design Polish**: Crafting clean dark and light color systems using CSS variables with subtle borders and ambient gradients rather than harsh flat colors.
3. **Micro-interactions & UX**: Enhancing simple to-do interactions with exit animations, custom checkbox graphics, and toast notifications transforms a standard assignment into an intuitive product.
4. **Data Validation & Sanitization**: Protecting against empty strings and escaping user input to ensure resilient client-side rendering.

---

## 🔮 Future Improvements

- [ ] Drag-and-drop task reordering.
- [ ] Task categories / tags (e.g., Work, Personal, Fitness).
- [ ] Export and import tasks as JSON or CSV.
- [ ] Sound effects / haptic feedback toggles on task completion.

---

**Day 4 of 365 Days Coding Challenge.** Built with ❤️ and Vanilla Web Technologies.
