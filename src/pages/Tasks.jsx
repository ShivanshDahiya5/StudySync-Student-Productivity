import { useCallback, useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, ListChecks, LayoutGrid } from 'lucide-react';
import { useApp } from '../context/AppContext';
import TaskList from '../components/TaskList';
import TaskFilters from '../components/TaskFilters';
import TaskForm from '../components/TaskForm';
import { filterAndSortTasks } from '../utils/taskUtils';

const DEFAULT_FILTERS = {
  search: '',
  subjectId: 'all',
  priority: 'all',
  status: 'all',
  due: 'all',
};

export default function Tasks() {
  const { tasks } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState(() => ({
    ...DEFAULT_FILTERS,
    search: searchParams.get('q') || '',
  }));
  const [sort, setSort] = useState('dueDate');
  const [view, setView] = useState('list');
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const paramQuery = searchParams.get('q') || '';
  useEffect(() => {
    setFilters((prev) => (prev.search === paramQuery ? prev : { ...prev, search: paramQuery }));
  }, [paramQuery]);

  const handleFiltersChange = useCallback((next) => {
    setFilters(next);
    setSearchParams(
      next.search ? { q: next.search } : {},
      { replace: true }
    );
  }, [setSearchParams]);

  const visibleTasks = useMemo(
    () => filterAndSortTasks(tasks, filters, sort),
    [tasks, filters, sort]
  );

  const openAdd = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>My Tasks</h1>
          <p>
            {visibleTasks.length} of {tasks.length} task{tasks.length === 1 ? '' : 's'} shown
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Add Task
        </button>
      </div>
