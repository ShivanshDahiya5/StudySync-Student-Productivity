import { isTaskOverdue, todayISO, lastNDays } from './dateUtils';

export const PRIORITIES = ['Low', 'Medium', 'High'];
export const STATUSES = ['Pending', 'In Progress', 'Completed'];

/** Stable unique ID that works in every modern browser. */
export function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export const PRIORITY_RANK = { High: 3, Medium: 2, Low: 1 };

/**
 * Apply search, filters and sorting to a task list.
 * filters: { search, subjectId, priority, status, due (all|today|week|overdue|none) }
 * sort: 'dueDate' | 'priority' | 'createdAt' | 'title'
 */
export function filterAndSortTasks(tasks, filters = {}, sort = 'dueDate') {
  const { search = '', subjectId = 'all', priority = 'all', status = 'all', due = 'all' } = filters;
  const q = search.trim().toLowerCase();
  const today = todayISO();
