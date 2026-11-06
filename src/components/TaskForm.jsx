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

    const set = (field) => (e) => {
        const next = { ...values, [field]: e.target.value };
        setValues(next);
        if (touched) setErrors(validate(next, subjects));
    };

    const blur = (field) => () => {
        setTouched(true);
        setErrors(validate(values, subjects));
        void field;
    };

    const submit = (e) => {
        e.preventDefault();
        const found = validate(values, subjects);
        setErrors(found);
        setTouched(true);
        if (Object.keys(found).length > 0) return;

        const payload = {
            title: values.title.trim(),
            description: values.description.trim(),
            subjectId: values.subjectId,
            dueDate: values.dueDate,
            priority: values.priority,
            status: values.status,
        };

        if (isEditing) updateTask(task.id, payload);
        else addTask(payload);
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={isEditing ? 'Edit Task' : 'Add New Task'}
            footer={
                <>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" form="task-form" className="btn btn-primary">
                        {isEditing ? 'Save Changes' : 'Save Task'}
                    </button>
                </>
            }
        >
            {subjects.length === 0 ? (
                <div className="form-error" style={{ marginBottom: 14 }}>
                    <AlertCircle size={14} />
                    No subjects yet. Add a subject on the Subjects page before creating tasks.
                </div>
            ) : null}

            <form id="task-form" onSubmit={submit} noValidate>
                <div className="field">
                    <label className="form-label" htmlFor="task-title">
                        Title<span className="req">*</span>
                    </label>
                    <input
                        id="task-title"
                        className={`form-input${errors.title ? ' error' : ''}`}
                        value={values.title}
                        onChange={set('title')}
                        onBlur={blur('title')}
                        placeholder="e.g. Complete DBMS assignment"
                        autoFocus
                        aria-invalid={Boolean(errors.title)}
                    />
                    {errors.title ? (
                        <div className="form-error">
                            <AlertCircle size={13} /> {errors.title}
                        </div>
                    ) : null}
                </div>

                <div className="field">
                    <label className="form-label" htmlFor="task-desc">
                        Description
                    </label>
                    <textarea
                        id="task-desc"
                        className="form-textarea"
                        value={values.description}
                        onChange={set('description')}
                        placeholder="Optional notes or details…"
                        rows={3}
                    />
                </div>

                <div className="field-row">
                    <div className="field">
                        <label className="form-label" htmlFor="task-subject">
                            Subject<span className="req">*</span>
                        </label>
                        <select
                            id="task-subject"
                            className={`form-select${errors.subjectId ? ' error' : ''}`}
                            value={values.subjectId}
                            onChange={set('subjectId')}
                            onBlur={blur('subjectId')}
                            aria-invalid={Boolean(errors.subjectId)}
                        >
                            <option value="">Select a subject…</option>
                            {subjects.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                        {errors.subjectId ? (
                            <div className="form-error">
                                <AlertCircle size={13} /> {errors.subjectId}
                            </div>
                        ) : null}
                    </div>

                    <div className="field">
                        <label className="form-label" htmlFor="task-due">
                            Due date<span className="req">*</span>
                        </label>
                        <input
                            id="task-due"
                            type="date"
                            className={`form-input${errors.dueDate ? ' error' : ''}`}
                            value={values.dueDate}
                            onChange={set('dueDate')}
                            onBlur={blur('dueDate')}
                            aria-invalid={Boolean(errors.dueDate)}
                        />
                        {errors.dueDate ? (
                            <div className="form-error">
                                <AlertCircle size={13} /> {errors.dueDate}
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="field-row">
                    <div className="field">
                        <label className="form-label" htmlFor="task-priority">
                            Priority
                        </label>
                        <select
                            id="task-priority"
                            className="form-select"
                            value={values.priority}
                            onChange={set('priority')}
                        >
                            {PRIORITIES.map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <label className="form-label" htmlFor="task-status">
                            Status
                        </label>
                        <select
                            id="task-status"
                            className="form-select"
                            value={values.status}
                            onChange={set('status')}
                        >
                            {STATUSES.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </form>
        </Modal>
    );
}