import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile); // Closed by default on mobile, open on desktop

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={setSidebarOpen} 
        isMobile={isMobile}
      />
      <Header 
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className={cn(
        'transition-all duration-300 pt-20', 
        isMobile ? 'ml-0' : (sidebarOpen ? 'ml-64' : 'ml-20')
      )}>
        {children}
      </main>
    </div>
  );
}