import { AlertTriangle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ConfirmDialog() {
  const { confirmState, resolveConfirm } = useApp();

  if (!confirmState) return null;

  const { title, message, confirmLabel, cancelLabel, danger } = confirmState;
