import { useState } from "react";
import { MAX_TODO_LENGTH } from "../utils/constants";

/**
 * AddTodoForm
 * Owns its own input + error state — App doesn't need to know about
 * "draft text" at all, only the final validated todo via onAdd.
 */
function AddTodoForm({ onAdd }) {
  const [text, setText] = useState("");
  const [error, setError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const result = onAdd(text);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setText("");
    setError(null);
  }

  function handleChange(e) {
    setText(e.target.value);
    // Clear the error as soon as the user starts fixing it, instead of
    // leaving a stale "can't be empty" message while they're typing.
    if (error) setError(null);
  }

  const isNearLimit = text.length > MAX_TODO_LENGTH * 0.8;

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="What needs doing?"
          maxLength={MAX_TODO_LENGTH + 20} // soft buffer; validateTodoText is the real gate
          aria-label="New task"
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? "add-todo-error" : undefined}
          className="flex-1 rounded-lg border border-border bg-surface-raised px-4 py-2.5
                     text-text placeholder:text-text-muted
                     focus-visible:border-accent"
        />
        <button
          type="submit"
          className="rounded-lg bg-accent px-5 py-2.5 font-medium text-white
                     transition-colors hover:bg-accent-hover active:scale-[0.98]"
        >
          Add
        </button>
      </div>

      <div className="mt-1.5 flex justify-between text-xs">
        <span id="add-todo-error" className="text-danger" role="alert">
          {error}
        </span>
        {isNearLimit && (
          <span className="text-text-muted">
            {text.trim().length}/{MAX_TODO_LENGTH}
          </span>
        )}
      </div>
    </form>
  );
}

export default AddTodoForm;
