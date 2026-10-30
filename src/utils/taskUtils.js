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

/** Tasks due today (not completed). */
export function tasksDueToday(tasks) {
  const today = todayISO();
  return tasks.filter((t) => t.dueDate === today && t.status !== 'Completed');
}

/** Nearest upcoming deadlines (not completed, due date >= today). */
export function upcomingDeadlines(tasks, limit = 5) {
  const today = todayISO();
  return tasks
    .filter((t) => t.status !== 'Completed' && t.dueDate >= today)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, limit);
}

/** Most recently completed tasks (by completedAt). */
export function recentlyCompleted(tasks, limit = 5) {
  return tasks
    .filter((t) => t.status === 'Completed')
    .sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || ''))
    .slice(0, limit);
}

/** Completion trend for the last 7 days. */
export function weeklyCompletionTrend(tasks) {
  return lastNDays(7).map((day) => ({
    ...day,
    completed: tasks.filter(
      (t) => t.status === 'Completed' && t.completedAt && t.completedAt.slice(0, 10) === day.iso
    ).length,
    created: tasks.filter((t) => t.createdAt && t.createdAt.slice(0, 10) === day.iso).length,
  }));
}

/** Per-subject totals: { subjectId: { total, completed, pending } }. */
export function subjectStats(tasks) {
  const map = {};
  tasks.forEach((t) => {
    if (!map[t.subjectId]) map[t.subjectId] = { total: 0, completed: 0, pending: 0 };
    map[t.subjectId].total += 1;
    if (t.status === 'Completed') map[t.subjectId].completed += 1;
    else map[t.subjectId].pending += 1;
  });
  return map;
}
