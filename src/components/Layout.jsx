import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Toast from './Toast';
import ConfirmDialog from './ConfirmDialog';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
