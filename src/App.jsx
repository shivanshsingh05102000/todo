import { useMemo, useState } from "react";
import { useTodos } from "./hooks/useTodos";
import { FILTERS } from "./utils/constants";
import Header from "./components/Header";
import AddTodoForm from "./components/AddTodoForm";
import ToDoList from "./components/ToDoList";
import FilterBar from "./components/FilterBar";

/*
 * Data flow (for whoever reads this next):
 *
 *   useTodos()  --- owns state + CRUD/reorder logic ---+
 *        |                                              |
 *        v                                              v
 *   App.jsx -- owns: which filter tab is active -- derives visibleTodos
 *        |
 *        +--> Header        (display only: remaining count)
 *        +--> AddTodoForm   (calls addTodo, shows its own validation error)
 *        +--> ToDoList      (calls toggle/delete/edit/reorder per row)
 *        +--> FilterBar     (calls onFilterChange / clearCompleted)
 *
 * Nothing below App touches localStorage or validation directly --
 * that's all inside useTodos / validateTodoText, one layer down.
 */
function App() {
  const {
    todos,
    storageError,
    addTodo,
    editTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
    reorderTodos,
  } = useTodos();

  const [filter, setFilter] = useState(FILTERS.ALL);

  const visibleTodos = useMemo(() => {
    if (filter === FILTERS.ACTIVE) return todos.filter((t) => !t.completed);
    if (filter === FILTERS.COMPLETED) return todos.filter((t) => t.completed);
    return todos;
  }, [todos, filter]);

  const remainingCount = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos]
  );
  const completedCount = todos.length - remainingCount;

  const emptyMessage =
    todos.length === 0
      ? "No tasks yet -- add your first one above."
      : filter === FILTERS.ACTIVE
      ? "Nothing active -- everything's done."
      : "No completed tasks yet.";

  return (
    <div className="mx-auto min-h-screen max-w-lg px-4 py-12">
      <Header remainingCount={remainingCount} />

      <AddTodoForm onAdd={addTodo} />

      {storageError && (
        <p className="mb-4 rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger">
          Couldn't save to local storage -- your tasks won't persist after a
          refresh. (Private browsing or storage may be disabled.)
        </p>
      )}

      <ToDoList
        todos={visibleTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onEdit={editTodo}
        onReorder={reorderTodos}
        emptyMessage={emptyMessage}
      />

      <FilterBar
        activeFilter={filter}
        onFilterChange={setFilter}
        completedCount={completedCount}
        onClearCompleted={clearCompleted}
      />
    </div>
  );
}

export default App;
