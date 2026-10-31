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
