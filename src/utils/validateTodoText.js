import { MAX_TODO_LENGTH } from "./constants";

/**
 * Validates raw todo text before it's allowed into state.
 * Pure function (no side effects) so it's trivially testable and reusable
 * between "add" and "edit" flows instead of duplicating the same checks.
 *
 * @param {string} text
 * @returns {{ ok: true, value: string } | { ok: false, error: string }}
 */
export function validateTodoText(text) {
  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return { ok: false, error: "Task can't be empty." };
  }

  if (trimmed.length > MAX_TODO_LENGTH) {
    return {
      ok: false,
      error: `Task is too long (${trimmed.length}/${MAX_TODO_LENGTH} characters).`,
    };
  }

  return { ok: true, value: trimmed };
}
