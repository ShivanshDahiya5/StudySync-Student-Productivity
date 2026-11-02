import { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, CartesianGrid, PieChart, Pie, Cell,
} from 'recharts';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import EmptyState from '../components/EmptyState';
import {
  ListChecks, CheckCircle2, Clock, AlertTriangle,
  Percent, TrendingUp, Target, BarChart3,
} from 'lucide-react';
import {
  computeStats,
  weeklyCompletionTrend,
  subjectStats,
  PRIORITY_RANK,
} from '../utils/taskUtils';
import { isTaskOverdue, formatDate } from '../utils/dateUtils';
