import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Toast from './Toast';
import ConfirmDialog from './ConfirmDialog';

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="app-shell">
            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onNavigate={() => setSidebarOpen(false)}
            />
            <div className="app-main">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="app-content">
                    <Outlet />
                </main>
            </div>
            <Toast />
            <ConfirmDialog />
        </div>
    );
}