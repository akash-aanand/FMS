import { LayoutDashboard, Users, Calendar, BookOpen, BarChart3, Settings, LogOut, ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { SAMPLE_NOTICES } from '@/lib/sample-data';

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
}

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Manage Students', path: '/students' },
  { icon: Calendar, label: 'Attendance', path: '/attendance' },
  { icon: BookOpen, label: 'Assignments', path: '/assignments' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Bell, label: 'Notices', path: '/notices', badge: SAMPLE_NOTICES.length },
];

export function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(!isOpen);
  const location = useLocation();

  const handleToggle = () => {
    setCollapsed(!collapsed);
    onToggle?.(!collapsed);
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-slate-900 text-white transition-all duration-300 z-40',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header Section */}
      <div className="border-b border-slate-800 p-4">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <p className="font-semibold text-sm">Dr. Eleanor Vance</p>
              <p className="text-xs text-slate-400">Computer Science</p>
            </div>
          )}
          <button
            onClick={handleToggle}
            className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer Menu */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-800 p-4 space-y-2">
        <button
          className={cn(
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-slate-300 hover:bg-slate-800 hover:text-white'
          )}
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </button>

        <button
          className={cn(
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-slate-300 hover:bg-slate-800 hover:text-white'
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
