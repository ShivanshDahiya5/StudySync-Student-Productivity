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