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
      <div className="card settings-section">
        <div className="card-header">
          <h2 className="card-title">
            <User size={17} aria-hidden="true" style={{ color: 'var(--primary)' }} />
            Profile &amp; appearance
          </h2>
        </div>
        <div style={{ marginTop: 14 }}>
          <div className="setting-row">
            <div className="setting-info">
              <h4>Display name</h4>
              <p>Used for the dashboard greeting and your avatar initials.</p>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div>
                <input
                  className={`form-input${nameError ? ' error' : ''}`}
                  style={{ width: 210 }}
                  value={nameDraft}
                  onChange={(e) => {
                    setNameDraft(e.target.value);
                    setNameError('');
                  }}
                  aria-label="Display name"
                  maxLength={40}
                />
                {nameError ? (
                  <div className="form-error">
                    <AlertCircle size={13} /> {nameError}
                  </div>
                ) : null}
              </div>
              <button type="button" className="btn btn-primary" onClick={saveName}>
                <Save size={15} /> Save
              </button>
            </div>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <h4>Dark theme</h4>
              <p>Switch between the light and dark interface. Your choice is remembered in this browser.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {settings.theme === 'dark' ? <Moon size={17} /> : <Sun size={17} />}
              <Switch
                on={settings.theme === 'dark'}
                onChange={(on) => updateSettings({ theme: on ? 'dark' : 'light' })}
                label="Toggle dark theme"
              />
            </div>
          </div>
