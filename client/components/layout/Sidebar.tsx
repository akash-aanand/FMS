import { LayoutDashboard, Users, Calendar, BookOpen, BarChart3, Settings, LogOut, ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { SAMPLE_NOTICES } from '@/lib/sample-data';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface SidebarProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  isMobile: boolean;
}

const MENU_ITEMS_BASE = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Manage Students', path: '/students' },
  { icon: Calendar, label: 'Attendance', path: '/attendance' },
  { icon: BookOpen, label: 'Assignments', path: '/assignments' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Bell, label: 'Notices', path: '/notices' }, // Badge removed here, will be added dynamically
];

function SidebarNav({ collapsed }: { collapsed: boolean }) {
  const location = useLocation();
  const [unseenNotices, setUnseenNotices] = useState(() => {
    const savedCount = localStorage.getItem('unseenNoticesCount');
    return savedCount ? parseInt(savedCount, 10) : SAMPLE_NOTICES.length;
  });

  useEffect(() => {
    const handleNoticesSeen = () => {
      setUnseenNotices(0);
      localStorage.setItem('unseenNoticesCount', '0');
    };

    window.addEventListener('noticesSeen', handleNoticesSeen);
    
    // Sync on load
    const savedCount = localStorage.getItem('unseenNoticesCount');
    if (savedCount) {
      setUnseenNotices(parseInt(savedCount, 10));
    }

    return () => {
      window.removeEventListener('noticesSeen', handleNoticesSeen);
    };
  }, []);

  // Create dynamic menu items
  const menuItems = MENU_ITEMS_BASE.map(item => {
    if (item.path === '/notices') {
      return { ...item, badge: unseenNotices };
    }
    return item;
  });

  return (
    <>
      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const badge = (item as any).badge;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative',
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
              title={collapsed ? item.label : undefined}
            >
              <div className="relative">
                <Icon className="h-5 w-5 flex-shrink-0" />
                {badge && badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-danger-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </div>
              {!collapsed && <span className="text-sm font-medium flex-1">{item.label}</span>}
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
          onClick={() => {
            localStorage.removeItem('isLoggedIn');
            window.location.href = '/login';
          }}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </>
  );
}

export function Sidebar({ isOpen, onToggle, isMobile }: SidebarProps) {
  // On desktop, `isOpen` controls the expanded state.
  // On mobile, `isOpen` controls the sheet's open state.
  
  const collapsed = !isOpen; // For desktop

  const handleDesktopToggle = () => {
    onToggle(!isOpen); // Invert parent state
  };

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onToggle}>
        <SheetContent side="left" className="bg-slate-900 text-white p-0 w-64 border-r-0">
          {/* Mobile Header Section */}
          <div className="border-b border-slate-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">Dr. Eleanor Vance</p>
                <p className="text-xs text-slate-400">Computer Science</p>
              </div>
            </div>
          </div>
          <SidebarNav collapsed={false} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    // Desktop
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-slate-900 text-white transition-all duration-300 z-40',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header Section */}
      <div className="border-b border-slate-800 p-4 h-20 flex items-center justify-between">
          {!collapsed && (
            <div>
              <p className="font-semibold text-sm">Dr. Eleanor Vance</p>
              <p className="text-xs text-slate-400">Computer Science</p>
            </div>
          )}
          <button
            onClick={handleDesktopToggle}
            className={cn(
              "p-1.5 rounded-lg hover:bg-slate-800 transition-colors",
              collapsed && "mx-auto" // Center button when collapsed
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
      </div>
      <SidebarNav collapsed={collapsed} />
    </aside>
  );
}