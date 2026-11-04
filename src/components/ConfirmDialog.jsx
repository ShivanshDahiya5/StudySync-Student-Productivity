import { AlertTriangle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ConfirmDialog() {
  const { confirmState, resolveConfirm } = useApp();

  if (!confirmState) return null;

  const { title, message, confirmLabel, cancelLabel, danger } = confirmState;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      onClick={() => resolveConfirm(false)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') resolveConfirm(false);
      }}
    >
      <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body" style={{ paddingTop: 22 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div
              className={`stat-icon ${danger ? 'red' : 'sky'}`}
              aria-hidden="true"
            >
              {danger ? <AlertTriangle size={20} /> : <Info size={20} />}
            </div>
            <div>
              <h3 id="confirm-title" className="modal-title" style={{ marginBottom: 6 }}>
                {title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>{message}</p>
            </div>
          </div>
        </div>
