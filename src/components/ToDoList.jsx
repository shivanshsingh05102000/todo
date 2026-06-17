import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import ToDoItem from "./ToDoItem";

/**
 * ToDoList
 * Renders the (already-filtered) list of todos and owns the drag-and-drop
 * context. Reordering only ever makes sense against the *unfiltered*
 * list in storage — App.jsx passes the full-list reorder handler down,
 * this component just reports which two ids moved.
 */
function ToDoList({ todos, onToggle, onDelete, onEdit, onReorder, emptyMessage }) {
  // PointerSensor needs a small move threshold so a plain click (to check
  // a box, say) isn't misread as a drag attempt.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return; // dropped outside any valid target
    onReorder(active.id, over.id);
  }

  if (todos.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-text-muted">
        {emptyMessage}
      </p>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={todos.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="flex flex-col gap-2">
          {todos.map((todo) => (
            <ToDoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

export default ToDoList;
