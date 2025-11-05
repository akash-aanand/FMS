import { Bell, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuToggle?: (open: boolean) => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
    onMenuToggle?.(!menuOpen);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-primary-600">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <span className="text-white text-sm">FM</span>
          </div>
          <span className="hidden sm:inline">Faculty Manager</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-1">
          <Link to="/" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors">
            Dashboard
          </Link>
          <Link to="/students" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors">
            Students
          </Link>
          <Link to="/assignments" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors">
            Assignments
          </Link>
          <Link to="/attendance" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors">
            Attendance
          </Link>
          <Link to="/analytics" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors">
            Analytics
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-slate-600 hover:text-primary-600 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-danger-500 rounded-full"></span>
          </button>

          {/* Faculty Profile */}
          <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">Dr. Rajesh Kumar</p>
              <p className="text-xs text-slate-500">Computer Science</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center font-medium text-primary-600">
              RK
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={handleMenuToggle}
            className="md:hidden p-2 text-slate-600 hover:text-primary-600"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <nav className="flex flex-col px-4 py-2">
            <Link
              to="/"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-primary-50 rounded-md transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/students"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-primary-50 rounded-md transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Students
            </Link>
            <Link
              to="/assignments"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-primary-50 rounded-md transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Assignments
            </Link>
            <Link
              to="/attendance"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-primary-50 rounded-md transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Attendance
            </Link>
            <Link
              to="/analytics"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-primary-50 rounded-md transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Analytics
            </Link>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-primary-50 rounded-md transition-colors mt-2 border-t border-slate-200 pt-3">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
