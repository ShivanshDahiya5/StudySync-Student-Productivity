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
