// Centralised so filter values can't drift between components (typo-proofing).
export const FILTERS = {
  ALL: "all",
  ACTIVE: "active",
  COMPLETED: "completed",
};

export const MAX_TODO_LENGTH = 120;

export const STORAGE_KEY = "todo-app:tasks:v1";
// Versioned key — if the shape of a todo ever changes, bump to v2 so old,
// incompatible localStorage data doesn't get loaded and crash the app.
