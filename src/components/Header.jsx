/**
 * Header
 * Pure presentational component — title + a live count of remaining tasks.
 * Takes the count as a prop rather than computing it itself, so it stays
 * dumb and doesn't need to know about the todos array shape at all.
 */
function Header({ remainingCount }) {
  return (
    <header className="mb-8">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-text">
        Tasks
      </h1>
      <p className="mt-1 text-sm text-text-muted">
        {remainingCount === 0
          ? "All clear — nothing left to do."
          : `${remainingCount} task${remainingCount === 1 ? "" : "s"} remaining`}
      </p>
    </header>
  );
}

export default Header;
