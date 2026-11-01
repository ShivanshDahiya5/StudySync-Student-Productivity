import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS, validateBackup } from '../utils/exportUtils';
import { uid, computeStats } from '../utils/taskUtils';
import { todayISO } from '../utils/dateUtils';

const AppContext = createContext(null);

const DEFAULT_SUBJECT_COLORS = [
  '#6366f1', '#0ea5e9', '#10b981', '#f59e0b',
  '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6',
];

/** Starter subjects created only on the very first launch. */
function createStarterSubjects() {
  const now = new Date().toISOString();
  return [
    { id: uid(), name: 'Mathematics', color: DEFAULT_SUBJECT_COLORS[0], createdAt: now },
    { id: uid(), name: 'Computer Science', color: DEFAULT_SUBJECT_COLORS[1], createdAt: now },
    { id: uid(), name: 'Physics', color: DEFAULT_SUBJECT_COLORS[2], createdAt: now },
  ];
}

const DEFAULT_SETTINGS = {
  theme: 'light',
  displayName: 'Student',
  weekStartsOn: 0,
  notifications: true,
};

/** Merge stored settings with defaults so old saves never break the app. */
function normalizeSettings(stored) {
  return {
    ...DEFAULT_SETTINGS,
    ...(stored && typeof stored === 'object' ? stored : {}),
    theme: stored?.theme === 'dark' ? 'dark' : 'light',
    weekStartsOn: stored?.weekStartsOn === 1 ? 1 : 0,
    notifications: typeof stored?.notifications === 'boolean' ? stored.notifications : true,
  };
}

export function AppProvider({ children }) {
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEYS.tasks, []);
  const [subjects, setSubjects] = useLocalStorage(STORAGE_KEYS.subjects, null);
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS);

  // First launch: seed starter subjects once, then persist.
  const [activeSubjects, setActiveSubjects] = useState(() =>
    Array.isArray(subjects) ? subjects : subjects === null ? createStarterSubjects() : []
  );
  useEffect(() => {
    if (!Array.isArray(subjects)) {
      setSubjects(activeSubjects);
    }
  }, []);

  useEffect(() => {
    if (Array.isArray(subjects)) setActiveSubjects(subjects);
  }, [subjects]);

  const normalizedSettings = useMemo(() => normalizeSettings(settings), [settings]);

  /* ---------------- Theme ---------------- */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', normalizedSettings.theme);
  }, [normalizedSettings.theme]);

  /* ---------------- Toasts ---------------- */
  const [toasts, setToasts] = useState([]);
  const pushToast = useCallback((message, type = 'success') => {
    const id = uid();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);
  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* ---------------- Confirm dialog ---------------- */
  const [confirmState, setConfirmState] = useState(null);
  const confirmAction = useCallback(
    ({ title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = true }) =>
      new Promise((resolve) => {
        setConfirmState({ title, message, confirmLabel, cancelLabel, danger, resolve });
      }),
    []
  );
  const handleConfirmResolve = useCallback((result) => {
    setConfirmState((prev) => {
      if (prev) prev.resolve(result);
      return null;
    });
  }, []);

  /* ---------------- Task actions ---------------- */
  const addTask = useCallback(
    (data) => {
      const now = new Date().toISOString();
      const task = {
        id: uid(),
        title: data.title.trim(),
        description: (data.description || '').trim(),
        subjectId: data.subjectId,
        dueDate: data.dueDate,
        priority: data.priority,
        status: data.status,
        createdAt: now,
        completedAt: data.status === 'Completed' ? now : null,
      };
      setTasks((prev) => [task, ...prev]);
      pushToast(`Task "${task.title}" created.`);
      return task;
    },
    [setTasks, pushToast]
  );

  const updateTask = useCallback(
    (id, data) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          const status = data.status;
          return {
            ...t,
            title: data.title.trim(),
            description: (data.description || '').trim(),
            subjectId: data.subjectId,
            dueDate: data.dueDate,
            priority: data.priority,
            status,
            completedAt:
              status === 'Completed' ? t.completedAt || new Date().toISOString() : null,
          };
        })
      );
      pushToast('Task updated.');
    },
    [setTasks, pushToast]
  );

  const deleteTask = useCallback(
    async (task) => {
      const ok = await confirmAction({
        title: 'Delete task',
        message: `Are you sure you want to delete "${task.title}"? This cannot be undone.`,
        confirmLabel: 'Delete',
      });
      if (!ok) return false;
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      pushToast('Task deleted.', 'info');
      return true;
    },
    [confirmAction, setTasks, pushToast]
  );

  const toggleTaskStatus = useCallback(
    (id) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          const done = t.status !== 'Completed';
          return {
            ...t,
            status: done ? 'Completed' : 'Pending',
            completedAt: done ? new Date().toISOString() : null,
          };
        })
      );
    },
    [setTasks]
  );

  /* ---------------- Subject actions ---------------- */
  const addSubject = useCallback(
    (name, color) => {
      const trimmed = name.trim();
      if (subjectsExists(activeSubjects, trimmed)) {
        pushToast('A subject with that name already exists.', 'error');
        return null;
      }
      const subject = {
        id: uid(),
        name: trimmed,
        color:
          color ||
          DEFAULT_SUBJECT_COLORS[activeSubjects.length % DEFAULT_SUBJECT_COLORS.length],
        createdAt: new Date().toISOString(),
      };
      setActiveSubjects((prev) => {
        const next = [...prev, subject];
        setSubjects(next);
        return next;
      });
      pushToast(`Subject "${trimmed}" added.`);
      return subject;
    },
    [activeSubjects, setSubjects, pushToast]
  );

  const updateSubject = useCallback(
    (id, name, color) => {
      const trimmed = name.trim();
      if (subjectsExists(activeSubjects, trimmed, id)) {
        pushToast('A subject with that name already exists.', 'error');
        return false;
      }
      setActiveSubjects((prev) => {
        const next = prev.map((s) => (s.id === id ? { ...s, name: trimmed, color: color || s.color } : s));
        setSubjects(next);
        return next;
      });
      pushToast('Subject updated.');
      return true;
    },
    [activeSubjects, setSubjects, pushToast]
  );

  const deleteSubject = useCallback(
    async (subject) => {
      const linked = tasks.filter((t) => t.subjectId === subject.id).length;
      if (linked > 0) {
        await confirmAction({
          title: 'Subject has tasks',
          message: `"${subject.name}" still has ${linked} task${linked > 1 ? 's' : ''}. Reassign or delete those tasks first, then delete the subject.`,
          confirmLabel: 'Got it',
          cancelLabel: 'Close',
          danger: false,
        });
        return false;
      }
            const ok = await confirmAction({
        title: 'Delete subject',
        message: `Delete the subject "${subject.name}"? This cannot be undone.`,
        confirmLabel: 'Delete',
      });
      if (!ok) return false;
      setActiveSubjects((prev) => {
        const next = prev.filter((s) => s.id !== subject.id);
        setSubjects(next);
        return next;
      });
      pushToast('Subject deleted.', 'info');
      return true;
    },
    [tasks, confirmAction, setSubjects, pushToast]
  );

  /* ---------------- Settings ---------------- */
  const updateSettings = useCallback(
    (patch) => {
      setSettings((prev) => ({ ...normalizeSettings(prev), ...patch }));
    },
    [setSettings]
  );

  /* ---------------- Import / export / reset ---------------- */
  const importBackup = useCallback(
    (backup) => {
      const result = validateBackup(backup);
      if (!result.valid) {
        pushToast(result.error, 'error');
        return false;
      }
      const { tasks: t, subjects: s, settings: st } = result.data;
      setTasks(t);
      setActiveSubjects(s);
      setSubjects(s);
      if (st) setSettings(normalizeSettings(st));
      pushToast(`Import complete — ${t.length} task(s) and ${s.length} subject(s) restored.`);
      return true;
    },
    [setTasks, setSubjects, setSettings, pushToast]
  );

  const resetAllData = useCallback(async () => {
    const ok = await confirmAction({
      title: 'Reset all data',
      message:
        'This permanently deletes every task, subject and preference stored in this browser. This cannot be undone. Continue?',
      confirmLabel: 'Reset everything',
    });
    if (!ok) return false;
    setTasks([]);
    const fresh = createStarterSubjects();
    setActiveSubjects(fresh);
    setSubjects(fresh);
    setSettings(DEFAULT_SETTINGS);
    pushToast('All data has been reset.', 'info');
    return true;
  }, [confirmAction, setTasks, setSubjects, setSettings, pushToast]);

  /* ---------------- In-app reminders (work while the app is open) ---------------- */
  const [reminderSignature, setReminderSignature] = useState('');
  useEffect(() => {
    if (!normalizedSettings.notifications) return;
    const stats = computeStats(tasks);
    if (stats.total === 0) return;
    const signature = `${todayISO()}:${stats.overdue}:${tasks.filter((t) => t.dueDate === todayISO() && t.status !== 'Completed').length}`;
    if (signature !== reminderSignature) {
      if (reminderSignature !== '') {
        const dueToday = tasks.filter((t) => t.dueDate === todayISO() && t.status !== 'Completed').length;
        if (stats.overdue > 0) {
          pushToast(`Reminder: ${stats.overdue} overdue task${stats.overdue > 1 ? 's' : ''} waiting.`, 'error');
        } else if (dueToday > 0) {
          pushToast(`Reminder: ${dueToday} task${dueToday > 1 ? 's are' : ' is'} due today.`, 'info');
        }
      }
      setReminderSignature(signature);
    }
  }, [tasks, normalizedSettings.notifications, reminderSignature, pushToast]);

  /* ---------------- Derived helpers ---------------- */
  const getSubject = useCallback(
    (id) => activeSubjects.find((s) => s.id === id) || null,
    [activeSubjects]
  );

  const value = {
    tasks,
    subjects: activeSubjects,
    settings: normalizedSettings,
    toasts,
    confirmState,
    pushToast,
    dismissToast,
    confirmAction,
    resolveConfirm: handleConfirmResolve,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
