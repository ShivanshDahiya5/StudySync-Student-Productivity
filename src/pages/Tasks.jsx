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
