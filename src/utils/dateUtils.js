export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Today's local calendar date as YYYY-MM-DD. */
export function todayISO() {
  return toISODate(new Date());
}

/** Parse a YYYY-MM-DD string into a local Date at midnight. */
export function parseISO(iso) {
  const [y, m, d] = String(iso).split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

/** Format as e.g. "Oct 25, 2026". */
export function formatDate(iso, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
  if (!iso) return '—';
  try {
    return parseISO(iso).toLocaleDateString(undefined, options);
  } catch {
    return '—';
  }
}

/** Format an ISO timestamp string as e.g. "Oct 25, 2026". */
export function formatTimestamp(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '—';
  }
}