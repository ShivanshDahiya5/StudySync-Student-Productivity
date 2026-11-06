import { ListTodo } from 'lucide-react';
import TaskCard from './TaskCard';
import EmptyState from './EmptyState';

export default function TaskList({ tasks, view = 'list', onEdit, onAdd, emptyTitle, emptyText }) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={ListTodo}
        title={emptyTitle || 'No tasks found'}
        text={emptyText || 'Try adjusting your filters, or create a new task to get started.'}
        actionLabel="Add Task"
        onAction={onAdd}
      />
    );
  }