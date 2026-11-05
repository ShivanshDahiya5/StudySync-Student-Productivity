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
        <input
          type="search"
          className="form-input"
          style={{ paddingLeft: 36 }}
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          placeholder="Search by title or description…"
          aria-label="Search tasks"
        />
      </div>

      <select
        className="form-select"
        style={{ width: 'auto' }}
        value={filters.subjectId}
        onChange={(e) => update({ subjectId: e.target.value })}
        aria-label="Filter by subject"
      >
        <option value="all">All subjects</option>
        {subjects.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        className="form-select"
        style={{ width: 'auto' }}
        value={filters.priority}
        onChange={(e) => update({ priority: e.target.value })}
        aria-label="Filter by priority"
      >
        <option value="all">All priorities</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <select
        className="form-select"
        style={{ width: 'auto' }}
        value={filters.status}
        onChange={(e) => update({ status: e.target.value })}
        aria-label="Filter by status"
      >
        <option value="all">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        className="form-select"
        style={{ width: 'auto' }}
        value={filters.due}
        onChange={(e) => update({ due: e.target.value })}
        aria-label="Filter by due date"
      >
        {DUE_OPTIONS.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>

      <select
        className="form-select"
        style={{ width: 'auto' }}
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort tasks"
      >
        {SORT_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      
      {isFiltered ? (
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() =>
            onFiltersChange({
              search: '',
              subjectId: 'all',
              priority: 'all',
              status: 'all',
              due: 'all',
            })
          }
        >
          <X size={14} /> Clear
        </button>
      ) : null}
    </div>
  );
}