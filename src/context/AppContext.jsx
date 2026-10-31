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
