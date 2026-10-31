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
