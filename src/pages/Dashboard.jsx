import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  ListChecks,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Percent,
  Zap,
  ArrowRight,
  CalendarClock,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from 'recharts';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import ChartCard from '../components/ChartCard';
import EmptyState from '../components/EmptyState';
import { StatusBadge, PriorityBadge } from '../components/TaskCard';
import {
  computeStats,
  tasksDueToday,
  upcomingDeadlines,
  recentlyCompleted,
  weeklyCompletionTrend,
  subjectStats,
  motivationalMessage,
} from '../utils/taskUtils';
import { isTaskOverdue, formatDate, dueLabel } from '../utils/dateUtils';
