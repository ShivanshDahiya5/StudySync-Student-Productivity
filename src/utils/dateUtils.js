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

/** Whole days from today until the given ISO date (negative = past). */
export function daysUntil(iso, from = new Date()) {
  const target = parseISO(iso);
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return Math.round((target - start) / 86400000);
}

/** A task is overdue only when due date < today AND it is not completed. */
export function isTaskOverdue(task) {
  if (!task || !task.dueDate) return false;
  if (task.status === 'Completed') return false;
  return task.dueDate < todayISO();
}

/** "Due today", "Due in 3 days", "3 days overdue", etc. */
export function dueLabel(iso) {
  const diff = daysUntil(iso);
  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  if (diff > 1) return `Due in ${diff} days`;
  if (diff === -1) return '1 day overdue';
  return `${Math.abs(diff)} days overdue`;
}

/** Short weekday names, optionally starting on Monday. */
export function weekdayNames(weekStartsOn = 0) {
  const base = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return weekStartsOn === 1 ? [...base.slice(1), base[0]] : base;
}

/** Date of the first day of the week containing `date`. */
export function startOfWeek(date, weekStartsOn = 0) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay();
  const diff = weekStartsOn === 1 ? (day + 6) % 7 : day;
  d.setDate(d.getDate() - diff);
  return d;
}

/** Array of the last `count` days (oldest first) as { iso, date, label }. */
export function lastNDays(count) {
  const out = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    out.push({
