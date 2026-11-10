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

            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingRight: 20 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <TaskFilters
                            filters={filters}
                            sort={sort}
                            onFiltersChange={handleFiltersChange}
                            onSortChange={setSort}
                        />
                    </div>
                    <div className="view-toggle" role="group" aria-label="Change task view">
                        <button
                            type="button"
                            className={view === 'list' ? 'active' : ''}
                            onClick={() => setView('list')}
                            aria-label="List view"
                            aria-pressed={view === 'list'}
                        >
                            <ListChecks size={16} />
                        </button>
                        <button
                            type="button"
                            className={view === 'card' ? 'active' : ''}
                            onClick={() => setView('card')}
                            aria-label="Card view"
                            aria-pressed={view === 'card'}
                        >
                            <LayoutGrid size={16} />
                        </button>
                    </div>
                </div>

                <TaskList
                    tasks={visibleTasks}
                    view={view}
                    onEdit={openEdit}
                    onAdd={openAdd}
                    emptyTitle={tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}
                    emptyText={
                        tasks.length === 0
                            ? 'Create your first task — organize it by subject, priority and deadline.'
                            : 'No tasks match your current search or filters. Try clearing them.'
                    }
                />
            </div>

            <TaskForm
                open={formOpen}
                onClose={() => {
                    setFormOpen(false);
                    setEditingTask(null);
                }}
                task={editingTask}
            />
        </>
    );
}