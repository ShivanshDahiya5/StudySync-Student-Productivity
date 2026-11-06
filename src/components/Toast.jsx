import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export default function Toast() {
  const { toasts, dismissToast } = useApp();

