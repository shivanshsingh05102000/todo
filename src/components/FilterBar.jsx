import { FILTERS } from "../utils/constants";

const FILTER_LABELS = {
  [FILTERS.ALL]: "All",
  [FILTERS.ACTIVE]: "Active",
  [FILTERS.COMPLETED]: "Completed",
};

/**
 * FilterBar
 * Filter tabs + a "clear completed" action. Receives the completed
 * count so the clear button can disable itself instead of being a
 * dead click when there's nothing to clear.
 */
function FilterBar({ activeFilter, onFilterChange, completedCount, onClearCompleted }) {
  return (
    <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm">
      <div className="flex gap-1" role="tablist" aria-label="Filter tasks">
        {Object.values(FILTERS).map((filter) => (
          <button
            key={filter}
            role="tab"
            aria-selected={activeFilter === filter}
            onClick={() => onFilterChange(filter)}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              activeFilter === filter
                ? "bg-surface-hover text-text"
                : "text-text-muted hover:text-text"
            }`}
          >
            {FILTER_LABELS[filter]}
          </button>
        ))}
      </div>

      <button
        onClick={onClearCompleted}
        disabled={completedCount === 0}
        className="text-text-muted hover:text-danger disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-text-muted"
      >
        Clear completed{completedCount > 0 ? ` (${completedCount})` : ""}
      </button>
    </div>
  );
}

export default FilterBar;
