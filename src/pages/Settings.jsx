import { useRef, useState } from 'react';
import {
  Sun, Moon, User, Bell, Download, Upload, Trash2, Save, AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { buildBackup, downloadJSON, readFileAsJSON, validateBackup } from '../utils/exportUtils';

function Switch({ on, onChange, label }) {
  return (
    <button
      type="button"
      className={`switch${on ? ' on' : ''}`}
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
    >
      <span className="switch-knob" />
    </button>
  );
}

export default function Settings() {
  const {
    tasks, subjects, settings, updateSettings,
    importBackup, resetAllData, pushToast, confirmAction,
  } = useApp();

  const fileRef = useRef(null);
  const [nameDraft, setNameDraft] = useState(settings.displayName);
  const [nameError, setNameError] = useState('');

  const saveName = () => {
    const trimmed = nameDraft.trim();
    if (!trimmed) {
      setNameError('Display name cannot be empty.');
      return;
    }
    if (trimmed.length > 40) {
      setNameError('Keep it under 40 characters.');
      return;
    }
    setNameError('');
    updateSettings({ displayName: trimmed });
    pushToast('Profile saved.');
  };

  const exportData = () => {
    const backup = buildBackup(tasks, subjects, settings);
    const stamp = new Date().toISOString().slice(0, 10);
    downloadJSON(backup, `studysync-backup-${stamp}.json`);
    pushToast('Backup downloaded as JSON.');
  };

  const handleImportClick = () => fileRef.current?.click();

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const raw = await readFileAsJSON(file);
      const check = validateBackup(raw);
      if (!check.valid) {
        pushToast(check.error, 'error');
        return;
      }
      const ok = await confirmAction({
        title: 'Replace current data?',
        message: `Importing will replace your current data with ${check.data.tasks.length} task(s) and ${check.data.subjects.length} subject(s) from the backup. This cannot be undone.`,
        confirmLabel: 'Import & replace',
      });
      if (!ok) return;
      importBackup(raw);
    } catch (err) {
      pushToast(err.message || 'Could not import that file.', 'error');
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Settings</h1>
          <p>Personalize StudySync and manage your local data.</p>
        </div>
      </div>
