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
