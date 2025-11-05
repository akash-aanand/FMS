import { ChevronRight, AlertCircle, Info, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SAMPLE_NOTICES } from '@/lib/sample-data';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export function NoticesBoard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredNotices = selectedCategory
    ? SAMPLE_NOTICES.filter(n => n.category === selectedCategory)
    : SAMPLE_NOTICES.slice(0, 6);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="h-4 w-4 text-danger-600" />;
      case 'important':
        return <Zap className="h-4 w-4 text-warning-600" />;
      default:
        return <Info className="h-4 w-4 text-primary-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-danger-50 border-danger-200 text-danger-800';
      case 'important':
        return 'bg-warning-50 border-warning-200 text-warning-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic':
        return 'bg-primary-100 text-primary-700';
      case 'administrative':
        return 'bg-slate-100 text-slate-700';
      case 'events':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">Notices Board</h3>
          <p className="text-xs text-slate-500 mt-1">Latest announcements</p>
        </div>
        <Link to="/notices" className="text-primary-600 hover:text-primary-700">
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="p-6">
        {/* Filter Buttons */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              'px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors',
              !selectedCategory
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            )}
          >
            All
          </button>
          {['academic', 'administrative', 'events'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors capitalize',
                selectedCategory === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notices List */}
        <div className="space-y-3">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={cn(
                'p-4 rounded-lg border-l-4 transition-colors hover:shadow-sm',
                getPriorityColor(notice.priority)
              )}
              style={{
                borderLeftColor:
                  notice.priority === 'urgent'
                    ? 'rgb(220, 38, 38)'
                    : notice.priority === 'important'
                      ? 'rgb(217, 119, 6)'
                      : 'rgb(30, 144, 255)',
              }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getPriorityIcon(notice.priority)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-slate-900">{notice.title}</p>
                      <p className="text-sm text-slate-700 mt-1 line-clamp-2">{notice.content}</p>
                    </div>
                    <span className="text-xs text-slate-600 whitespace-nowrap">
                      {formatDate(notice.date)}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Badge
                      variant="secondary"
                      className={cn('text-xs', getCategoryColor(notice.category))}
                    >
                      {notice.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full mt-4" asChild>
          <Link to="/notices">View All Notices</Link>
        </Button>
      </div>
    </div>
  );
}
