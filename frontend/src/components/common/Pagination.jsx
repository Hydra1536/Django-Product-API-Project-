import React from "react";

export default function Pagination({ page, setPage, count, pageSize = 10 }) {
  const totalPages = Math.ceil(count / pageSize);

  if (totalPages <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="controls mt-4 justify-center">
      <button
        className="btn secondary"
        disabled={!canPrev}
        onClick={() => setPage((p) => p - 1)}
      >
        Prev
      </button>

      <span className="small">
        Page {page} of {totalPages}
      </span>

      <button
        className="btn secondary"
        disabled={!canNext}
        onClick={() => setPage((p) => p + 1)}
      >
        Next
      </button>
    </div>
  );
}
