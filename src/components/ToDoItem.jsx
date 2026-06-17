import { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MAX_TODO_LENGTH } from "../utils/constants";

/**
 * ToDoItem
 * Renders one task. Owns its own "am I being edited right now" state —
 * App/ToDoList shouldn't need to know which row is mid-edit.
 *
 * Props are the minimal slice each component needs (ToDoList passes
 * these straight down) — see component README note in App.jsx for the
 * full data-flow diagram.
 */
function ToDoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(todo.text);
  const [editError, setEditError] = useState(null);
  const inputRef = useRef(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Autofocus + select-all the instant edit mode opens.
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  function startEditing() {
    if (todo.completed) return; // editing a completed task is confusing UX — block it
    setDraftText(todo.text);
    setEditError(null);
    setIsEditing(true);
  }

  function commitEdit() {
    const result = onEdit(todo.id, draftText);
    if (!result.ok) {
      setEditError(result.error);
      return;
    }
    setIsEditing(false);
  }

  function cancelEdit() {
    setDraftText(todo.text);
    setEditError(null);
    setIsEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") cancelEdit();
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`group flex items-start gap-3 rounded-lg border border-border
                  bg-surface-raised px-4 py-3 ${isDragging ? "opacity-50" : ""}`}
    >
      {/* Drag handle — deliberately separate from the row itself, so
          clicking text/checkbox never accidentally starts a drag. */}
      <button
        type="button"
        aria-label="Drag to reorder"
        className="mt-1 cursor-grab touch-none text-text-muted hover:text-text active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="3" cy="3" r="1.3" fill="currentColor" />
          <circle cx="3" cy="7" r="1.3" fill="currentColor" />
          <circle cx="3" cy="11" r="1.3" fill="currentColor" />
          <circle cx="9" cy="3" r="1.3" fill="currentColor" />
          <circle cx="9" cy="7" r="1.3" fill="currentColor" />
          <circle cx="9" cy="11" r="1.3" fill="currentColor" />
        </svg>
      </button>

      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Mark "${todo.text}" as ${todo.completed ? "active" : "completed"}`}
        className="mt-1.5 h-4 w-4 shrink-0 accent-accent"
      />

      <div className="min-w-0 flex-1">
        {isEditing ? (
          <>
            <input
              ref={inputRef}
              type="text"
              value={draftText}
              onChange={(e) => {
                setDraftText(e.target.value);
                if (editError) setEditError(null);
              }}
              onKeyDown={handleKeyDown}
              onBlur={commitEdit}
              maxLength={MAX_TODO_LENGTH + 20}
              aria-label="Edit task"
              aria-invalid={editError ? "true" : "false"}
              className="w-full rounded border border-accent bg-surface px-2 py-1 text-text"
            />
            {editError && (
              <p className="mt-1 text-xs text-danger" role="alert">
                {editError}
              </p>
            )}
          </>
        ) : (
          <p
            onDoubleClick={startEditing}
            className={`break-words ${
              todo.completed ? "text-text-muted line-through" : "text-text"
            }`}
            title="Double-click to edit"
          >
            {todo.text}
          </p>
        )}
      </div>

      {/* Action buttons fade in on hover/focus so the list stays clean
          at rest, but remain reachable via keyboard at all times. */}
      <div className="flex shrink-0 gap-1 opacity-60 group-hover:opacity-100 group-focus-within:opacity-100">
        {!isEditing && !todo.completed && (
          <button
            type="button"
            onClick={startEditing}
            aria-label="Edit task"
            className="rounded p-1.5 text-text-muted hover:bg-surface-hover hover:text-text"
          >
            <EditIcon />
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete task"
          className="rounded p-1.5 text-text-muted hover:bg-surface-hover hover:text-danger"
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M11.3 1.3a1.3 1.3 0 0 1 1.8 0l1.6 1.6a1.3 1.3 0 0 1 0 1.8L5.5 13.9l-3.8.9.9-3.8 8.7-8.7Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.5 4h11M5.5 4V2.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V4m-6.5 0v9.5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default ToDoItem;
