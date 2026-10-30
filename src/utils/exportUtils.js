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
