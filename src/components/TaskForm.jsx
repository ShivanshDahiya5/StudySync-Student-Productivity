import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Modal from './Modal';
import { useApp } from '../context/AppContext';
import { PRIORITIES, STATUSES } from '../utils/taskUtils';
import { todayISO } from '../utils/dateUtils';

const EMPTY = {
  title: '',
  description: '',
  subjectId: '',
  dueDate: '',
  priority: 'Medium',
  status: 'Pending',
};

function validate(values, subjects) {
  const errors = {};
  if (!values.title.trim()) errors.title = 'Title is required.';
  else if (values.title.trim().length > 200) errors.title = 'Title must be under 200 characters.';
  if (!values.subjectId) {
    errors.subjectId = subjects.length === 0
      ? 'Create a subject first on the Subjects page.'
      : 'Please choose a subject.';
  }
  if (!values.dueDate) errors.dueDate = 'Due date is required.';
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(values.dueDate)) errors.dueDate = 'Enter a valid date.';
  return errors;
}

export default function TaskForm({ open, onClose, task, defaultSubjectId }) {
  const { subjects, addTask, updateTask } = useApp();
  const isEditing = Boolean(task);

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (task) {
      setValues({
        title: task.title,
        description: task.description || '',
        subjectId: task.subjectId,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
      });
    } else {
      setValues({ ...EMPTY, subjectId: defaultSubjectId || subjects[0]?.id || '', dueDate: todayISO() });
    }
    setErrors({});
    setTouched(false);
  }, [open, task, defaultSubjectId, subjects]);
