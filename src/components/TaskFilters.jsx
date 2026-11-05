import { Search, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRIORITIES, STATUSES } from '../utils/taskUtils';

const DUE_OPTIONS = [
  { value: 'all', label: 'Any deadline' },
  { value: 'today', label: 'Due today' },
  { value: 'week', label: 'Next 7 days' },
  { value: 'overdue', label: 'Overdue' },
];

const SORT_OPTIONS = [
  { value: 'dueDate', label: 'Sort: Deadline' },
  { value: 'priority', label: 'Sort: Priority' },
  { value: 'createdAt', label: 'Sort: Newest' },
  { value: 'title', label: 'Sort: Title' },
];
