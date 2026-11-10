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

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit Subject' : 'Add Subject'}
      small
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="subject-form" className="btn btn-primary">
            {isEditing ? 'Save Changes' : 'Add Subject'}
          </button>
        </>
      }
    >
      <form id="subject-form" onSubmit={submit} noValidate>
        <div className="field">
          <label className="form-label" htmlFor="subject-name">
            Subject name<span className="req">*</span>
          </label>
          <input
            id="subject-name"
            className={`form-input${error ? ' error' : ''}`}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            placeholder="e.g. Operating Systems"
            autoFocus
            aria-invalid={Boolean(error)}
          />
          {error ? (
            <div className="form-error">
              <AlertCircle size={13} /> {error}
            </div>
          ) : null}
        </div>

        <div className="field" style={{ marginBottom: 4 }}>
          <span className="form-label" id="subject-color-label">
            Color
          </span>
          <div className="color-swatches" role="group" aria-labelledby="subject-color-label">
            {subjectColors.map((c) => (
              <button
                key={c}
                type="button"
                className={`color-swatch${color === c ? ' selected' : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
                aria-label={`Choose color ${c}`}
                aria-pressed={color === c}
              />
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default function Subjects() {
  const { subjects, tasks, deleteSubject } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const stats = useMemo(() => subjectStats(tasks), [tasks]);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (subject) => {
    setEditing(subject);
    setModalOpen(true);
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Subjects</h1>
          <p>Organize your tasks by course or category. {subjects.length} subject{subjects.length === 1 ? '' : 's'} total.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Add Subject
        </button>
      </div>

      {subjects.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={BookOpen}
            title="No subjects yet"
            text="Subjects group your tasks by course — for example Mathematics, Physics, or Computer Science. Add one to continue."
            actionLabel="Add your first subject"
            onAction={openAdd}
          />
        </div>
