import { Bell } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 border-b border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-end h-20 px-6 gap-4">
        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button className="relative p-2 text-slate-600 hover:text-primary-600 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-danger-500 rounded-full"></span>
          </button>

          {/* Faculty Profile */}
          <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">Dr. Eleanor Vance</p>
              <p className="text-xs text-slate-500">Professor of History</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center font-medium text-primary-600 text-sm">
              EV
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
