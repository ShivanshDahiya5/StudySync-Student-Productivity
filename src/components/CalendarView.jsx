import { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, AlertTriangle, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  monthMatrix,
  monthLabel,
  weekdayNames,
  toISODate,
  todayISO,
  isTaskOverdue,
  formatTimestamp,
} from '../utils/dateUtils';
import { StatusBadge, PriorityBadge } from './TaskCard';
import EmptyState from './EmptyState';
