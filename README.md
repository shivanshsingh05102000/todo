# Tasks — React To-Do List

A to-do list app built with React + Vite, going past the base assignment spec
with drag-to-reorder, filters, inline editing, and persistence.

## Features

- Add, edit, delete, and complete tasks
- Inline edit (double-click a task, or use the edit icon) — `Enter` saves,
  `Escape` cancels
- Drag-and-drop reordering (mouse, touch, and keyboard accessible)
- Filter by All / Active / Completed
- "Clear completed" bulk action
- Persisted to `localStorage` — tasks survive a refresh
- Input validation: blocks empty/whitespace-only tasks and tasks over the
  character limit, with inline error messages
- Accessible: visible keyboard focus, `aria-label`s on icon buttons,
  `prefers-reduced-motion` respected

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (typically `http://localhost:5173`).

### Other scripts

```bash
npm run build     # production build, output in dist/
npm run preview   # preview the production build locally
npm run lint      # run eslint
```

## Project structure

```
src/
  components/      # presentational + interactive UI pieces
    Header.jsx
    AddTodoForm.jsx
    ToDoList.jsx
    ToDoItem.jsx
    FilterBar.jsx
  hooks/
    useTodos.js          # all CRUD + reorder logic, the single source of truth
    useLocalStorage.js   # generic persisted-state hook
  utils/
    constants.js
    validateTodoText.js  # shared validation for add + edit
  App.jsx           # composition root -- wires hooks to components
  index.css         # Tailwind import + design tokens
```

## Design notes

- **State lives in `useTodos`**, not in `App.jsx` directly -- keeps the
  component tree thin and the mutation logic in one place that's easy to
  reason about (and to extend later, e.g. swapping localStorage for an API).
- **Validation is centralised** in `validateTodoText`, used identically by
  both "add" and "edit" so the rules can't drift apart.
- **Reordering operates on todo `id`s**, not array indices, so it stays
  correct even when a filter is active and the visible list is a subset of
  the full one.
