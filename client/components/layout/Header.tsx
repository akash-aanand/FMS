import { Bell, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface HeaderProps {
  isMobile?: boolean;
  sidebarOpen?: boolean; // Received from MainLayout
  onToggle?: () => void;
}

export function Header({ isMobile, sidebarOpen, onToggle }: HeaderProps) {
  return (
    <header className={cn(
      "fixed top-0 right-0 z-30 border-b border-slate-200 bg-white shadow-sm transition-all duration-300",
      isMobile ? "left-0" : (sidebarOpen ? "left-64" : "left-20")
    )}>
      <div className="flex items-center justify-between h-20 px-6 gap-4">
        {/* Left Section (Hamburger or Spacer) */}
        {isMobile ? (
          <button
            onClick={onToggle}
            className="p-2 text-slate-600 hover:text-primary-600 transition-colors -ml-2"
          >
            <Menu className="h-6 w-6" />
          </button>
        ) : (
          <div /> // Spacer to push content right
        )}
        
        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative p-2 text-slate-600 hover:text-primary-600 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-danger-500 rounded-full"></span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    You have 3 unread messages.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="grid gap-1">
                      <p className="text-sm font-medium">New assignment submitted</p>
                      <p className="text-sm text-muted-foreground">
                        'Arjun Sharma' submitted 'Data Structures Algo'.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="grid gap-1">
                      <p className="text-sm font-medium">New Notice Posted</p>
                      <p className="text-sm text-muted-foreground">
                        'Semester Exam Dates Announced'.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Faculty Profile */}
          <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">
                Dr. Eleanor Vance
              </p>
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