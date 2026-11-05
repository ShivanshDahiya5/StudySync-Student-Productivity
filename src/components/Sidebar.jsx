import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ListChecks,
  CalendarDays,
  BookOpen,
  BarChart3,
  Settings,
  GraduationCap,
} from 'lucide-react';

const SECTIONS = [
  {
    label: 'Overview',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/tasks', label: 'My Tasks', icon: ListChecks },
      { to: '/calendar', label: 'Calendar', icon: CalendarDays },
    ],
  },
  {
    label: 'Manage',
    items: [
      { to: '/subjects', label: 'Subjects', icon: BookOpen },
      { to: '/analytics', label: 'Analytics', icon: BarChart3 },
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];