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
