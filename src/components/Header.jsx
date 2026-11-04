import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TITLES = {
  '/': 'Dashboard',
  '/tasks': 'My Tasks',
  '/calendar': 'Calendar & Deadlines',
  '/subjects': 'Subjects',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
};

export default function Header({ onMenuClick }) {
  const { settings, updateSettings } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const title = TITLES[location.pathname] || 'StudySync';
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const initials = (settings.displayName || 'Student')
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
