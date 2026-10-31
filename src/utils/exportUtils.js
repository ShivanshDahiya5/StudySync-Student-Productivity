import { PRIORITIES, STATUSES } from './taskUtils';

export const STORAGE_KEYS = {
  tasks: 'studysync.tasks',
  subjects: 'studysync.subjects',
  settings: 'studysync.settings',
};

export function buildBackup(tasks, subjects, settings) {
  return {
    app: 'StudySync',
    version: 1,
    exportedAt: new Date().toISOString(),
    data: { tasks, subjects, settings },
  };
}

export function downloadJSON(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function validateBackup(raw) {
  if (!raw || typeof raw !== 'object') {
    return { valid: false, error: 'The file does not contain a valid StudySync backup.' };
  }
  const data = raw.data && typeof raw.data === 'object' ? raw.data : raw;
  const tasks = data.tasks;
  const subjects = data.subjects;

  if (!Array.isArray(tasks) || !Array.isArray(subjects)) {
    return { valid: false, error: 'Backup is missing the tasks or subjects list.' };
  }

  const hex = /^#[0-9a-fA-F]{6}$/;
  const cleanSubjects = subjects
    .filter((s) => s && typeof s === 'object' && typeof s.name === 'string' && s.name.trim())
    .map((s) => ({
      id: String(s.id || ''),
      name: String(s.name).trim().slice(0, 60),
      color: hex.test(s.color) ? s.color : '#6366f1',
      createdAt: typeof s.createdAt === 'string' ? s.createdAt : new Date().toISOString(),
    }));
  const subjectIds = new Set(cleanSubjects.map((s) => s.id));

  const isoDate = /^\d{4}-\d{2}-\d{2}$/;
    const cleanTasks = tasks
    .filter((t) => t && typeof t === 'object' && typeof t.title === 'string' && t.title.trim())
    .map((t) => ({
      id: String(t.id || ''),
      title: String(t.title).trim().slice(0, 200),
      description: typeof t.description === 'string' ? t.description.slice(0, 2000) : '',
      subjectId: subjectIds.has(String(t.subjectId)) ? String(t.subjectId) : cleanSubjects[0]?.id || '',
      dueDate: isoDate.test(String(t.dueDate)) ? String(t.dueDate) : new Date().toISOString().slice(0, 10),
      priority: PRIORITIES.includes(t.priority) ? t.priority : 'Medium',
      status: STATUSES.includes(t.status) ? t.status : 'Pending',
      createdAt: typeof t.createdAt === 'string' ? t.createdAt : new Date().toISOString(),
      completedAt: typeof t.completedAt === 'string' ? t.completedAt : null,
    }));

  const settings =
    data.settings && typeof data.settings === 'object' && !Array.isArray(data.settings)
      ? data.settings
      : null;

  return { valid: true, data: { tasks: cleanTasks, subjects: cleanSubjects, settings } };
}
