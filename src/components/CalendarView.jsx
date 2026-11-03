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

export default function CalendarView() {
  const { tasks, getSubject, settings, toggleTaskStatus } = useApp();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(todayISO());

  const weekStartsOn = settings.weekStartsOn;
  const weeks = monthMatrix(year, month, weekStartsOn);
  const days = weekdayNames(weekStartsOn);
  const today = todayISO();

  const tasksByDate = {};
  tasks.forEach((t) => {
    if (!t.dueDate) return;
    if (!tasksByDate[t.dueDate]) tasksByDate[t.dueDate] = [];
    tasksByDate[t.dueDate].push(t);
  });
