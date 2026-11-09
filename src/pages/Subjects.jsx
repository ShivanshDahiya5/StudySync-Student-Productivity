import { useMemo, useState } from 'react';
import { Plus, BookOpen, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SubjectCard from '../components/SubjectCard';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { subjectStats } from '../utils/taskUtils';

function SubjectModal({ open, onClose, subject }) {
  const { addSubject, updateSubject, subjectColors } = useApp();
  const isEditing = Boolean(subject);

  const [name, setName] = useState('');
  const [color, setColor] = useState(subjectColors[0]);
  const [error, setError] = useState('');
  const [initialized, setInitialized] = useState(false);

  // Sync form values each time the modal opens.
  if (open && !initialized) {
    setName(subject?.name || '');
    setColor(subject?.color || subjectColors[0]);
    setError('');
    setInitialized(true);
  }
  if (!open && initialized) setInitialized(false);

  const submit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Subject name is required.');
      return;
    }
    if (trimmed.length > 60) {
      setError('Name must be under 60 characters.');
      return;
    }
    const result = isEditing ? updateSubject(subject.id, trimmed, color) : addSubject(trimmed, color);
    if (result === null || result === false) {
      setError('A subject with this name already exists.');
      return;
    }
    onClose();
  };