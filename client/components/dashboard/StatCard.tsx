import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
  bgColor?: string;
  iconColor?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  className,
  bgColor = 'bg-primary-50',
  iconColor = 'text-primary-600',
}: StatCardProps) {
  return (
    <div className={cn('rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            {trend && trendValue && (
              <span
                className={cn('text-xs font-medium', {
                  'text-success-600': trend === 'up',
                  'text-danger-600': trend === 'down',
                  'text-slate-500': trend === 'neutral',
                })}
              >
                {trend === 'up' && '↑ '}{trend === 'down' && '↓ '}{trendValue}
              </span>
            )}
          </div>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className={cn('rounded-lg p-3 flex items-center justify-center', bgColor)}>
          <Icon className={cn('h-6 w-6', iconColor)} />
        </div>
      </div>
    </div>
  );
}
