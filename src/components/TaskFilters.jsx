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

export default function TaskFilters({ filters, sort, onFiltersChange, onSortChange }) {
  const { subjects } = useApp();

  const update = (patch) => onFiltersChange({ ...filters, ...patch });

  const isFiltered =
    filters.search !== '' ||
    filters.subjectId !== 'all' ||
    filters.priority !== 'all' ||
    filters.status !== 'all' ||
    filters.due !== 'all';

  return (
    <div className="toolbar">
      <div className="grow" style={{ position: 'relative' }}>
        <Search
          size={16}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-faint)',
          }}
        />
