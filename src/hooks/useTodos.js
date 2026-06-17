import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { validateTodoText } from "../utils/validateTodoText";
import { STORAGE_KEY } from "../utils/constants";

/**
 * useTodos
 * Owns the todo list state and every mutation on it. App.jsx (and any
 * component that needs it) just calls these functions — none of them
 * need to know HOW todos are stored or validated.
 *
 * Centralising mutations here (instead of inline setState calls scattered
 * across components) means there's exactly one place that can produce a
 * malformed todo, which makes future bugs much easier to track down.
 */
export function useTodos() {
  const [todos, setTodos, storageError] = useLocalStorage(STORAGE_KEY, []);

  const addTodo = useCallback(
    (rawText) => {
      const result = validateTodoText(rawText);
      if (!result.ok) return result;

      const newTodo = {
        id: crypto.randomUUID(),
        text: result.value,
        completed: false,
        createdAt: Date.now(),
      };

      // Functional update — safe even if multiple state updates batch
      // together, since we never read stale `todos` from closure.
      setTodos((prev) => [newTodo, ...prev]);
      return { ok: true };
    },
    [setTodos]
  );

  const editTodo = useCallback(
    (id, rawText) => {
      const result = validateTodoText(rawText);
      if (!result.ok) return result;

      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, text: result.value } : todo
        )
      );
      return { ok: true };
    },
    [setTodos]
  );

  const deleteTodo = useCallback(
    (id) => {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    },
    [setTodos]
  );

  const toggleTodo = useCallback(
    (id) => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    },
    [setTodos]
  );

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }, [setTodos]);

  /** Reorders the list by id — used by drag-and-drop (dnd-kit gives us
   *  the dragged id and the id it landed on, not raw indices). */
  const reorderTodos = useCallback(
    (activeId, overId) => {
      if (activeId === overId) return; // dropped on itself — no-op
      setTodos((prev) => {
        const fromIndex = prev.findIndex((t) => t.id === activeId);
        const toIndex = prev.findIndex((t) => t.id === overId);
        if (fromIndex === -1 || toIndex === -1) return prev; // defensive: ids not found

        const next = [...prev];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        return next;
      });
    },
    [setTodos]
  );

  return {
    todos,
    storageError,
    addTodo,
    editTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
    reorderTodos,
  };
}
