import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ListChecks,
    CalendarDays,
    BookOpen,
    BarChart3,
    Settings,
    GraduationCap,
} from 'lucide-react';

const SECTIONS = [
    {
        label: 'Overview',
        items: [
            { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
            { to: '/tasks', label: 'My Tasks', icon: ListChecks },
            { to: '/calendar', label: 'Calendar', icon: CalendarDays },
        ],
    },
    {
        label: 'Manage',
        items: [
            { to: '/subjects', label: 'Subjects', icon: BookOpen },
            { to: '/analytics', label: 'Analytics', icon: BarChart3 },
            { to: '/settings', label: 'Settings', icon: Settings },
        ],
    },
];

export default function Sidebar({ open, onClose, onNavigate }) {
    return (
        <>
            {open ? (
                <div className="sidebar-backdrop" onClick={onClose} aria-hidden="true" />
            ) : null}
            <aside className={`sidebar${open ? ' open' : ''}`} aria-label="Main navigation">
                <div className="sidebar-brand">
                    <div className="sidebar-logo">
                        <GraduationCap size={21} />
                    </div>
                    <div>
                        <div className="sidebar-brand-text">StudySync</div>
                        <div className="sidebar-brand-sub">Productivity Manager</div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {SECTIONS.map((section) => (
                        <div key={section.label}>
                            <div className="nav-section-label">{section.label}</div>
                            {section.items.map(({ to, label, icon: Icon, end }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    end={end}
                                    className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                                    onClick={onNavigate}
                                >
                                    <Icon size={18} aria-hidden="true" />
                                    {label}
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    StudySync v1.0 · Data stored locally
                </div>
            </aside>
        </>
    );
}