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

    let result = tasks.filter((t) => {
    if (q && !`${t.title} ${t.description || ''}`.toLowerCase().includes(q)) return false;
    if (subjectId !== 'all' && t.subjectId !== subjectId) return false;
    if (priority !== 'all' && t.priority !== priority) return false;
    if (status !== 'all' && t.status !== status) return false;
    if (due === 'today' && t.dueDate !== today) return false;
    if (due === 'overdue' && !isTaskOverdue(t)) return false;
    if (due === 'none' && t.dueDate) return false;
    if (due === 'week' && t.dueDate) {
      const diff = (new Date(t.dueDate) - new Date(today)) / 86400000;
      if (diff < 0 || diff > 7) return false;
    }
    return true;
  });

  result = [...result].sort((a, b) => {
    switch (sort) {
      case 'priority':
        return PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority] || a.dueDate.localeCompare(b.dueDate);
      case 'createdAt':
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      case 'title':
        return a.title.localeCompare(b.title);
      case 'dueDate':
      default:
        return (a.dueDate || '9999').localeCompare(b.dueDate || '9999');
    }
  });

  return result;
}

/** Core statistics used by the dashboard and analytics page. */
export function computeStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const overdue = tasks.filter(isTaskOverdue).length;
  const pending = total - completed;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, pending, overdue, completionRate };
}
