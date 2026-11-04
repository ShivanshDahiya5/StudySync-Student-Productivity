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
