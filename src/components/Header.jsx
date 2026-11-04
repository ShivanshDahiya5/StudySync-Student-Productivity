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

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(`/tasks?q=${encodeURIComponent(query.trim())}`);
  };

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <header className="header">
      <button
        type="button"
        className="btn-icon mobile-toggle"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </button>

      <div className="header-title-block">
        <h1 className="header-title">{title}</h1>
        <div className="header-date">{today}</div>
      </div>

      <form className="header-search" onSubmit={submitSearch} role="search">
        <Search size={16} aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks…"
          aria-label="Search tasks"
        />
      </form>

