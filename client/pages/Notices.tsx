import { MainLayout } from '@/components/layout/MainLayout';
import { SAMPLE_NOTICES } from '@/lib/sample-data';
import { AlertCircle, Zap, Info } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { cn, robustSearch } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CATEGORIES = ['All', 'academic', 'administrative', 'events'];
const PRIORITIES = ['All', 'urgent', 'important', 'normal'];

export default function Notices() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mark as read
    localStorage.setItem('unseenNoticesCount', '0');
    window.dispatchEvent(new CustomEvent('noticesSeen'));
  }, []);

  const filteredNotices = useMemo(() => {
    return SAMPLE_NOTICES.filter(notice => {
      const matchesCategory = selectedCategory === 'All' || notice.category === selectedCategory;
      const matchesPriority = selectedPriority === 'All' || notice.priority === selectedPriority;
      const matchesSearch = robustSearch(searchTerm, [
        notice.title,
        notice.content,
        notice.category,
      ]);
      return matchesCategory && matchesPriority && matchesSearch;
    });
  }, [selectedCategory, selectedPriority, searchTerm]);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="h-5 w-5 text-danger-600" />;
      case 'important':
        return <Zap className="h-5 w-5 text-warning-600" />;
      default:
        return <Info className="h-5 w-5 text-primary-600" />;
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-danger-50 border-danger-200';
      case 'important':
        return 'bg-warning-50 border-warning-200';
      default:
        return 'bg-blue-50 border-blue-200';
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
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  return (
    <MainLayout>
      <div className="px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Notices & Announcements</h1>
          <p className="text-slate-600 mt-1">Stay informed with important announcements and notices</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map(priority => (
                    <SelectItem key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Notices List */}
        {filteredNotices.length > 0 ? (
          <div className="space-y-4">
            {filteredNotices.map(notice => (
              <div
                key={notice.id}
                className={cn(
                  'rounded-lg border p-6 cursor-pointer hover:shadow-md transition-shadow',
                  getPriorityBg(notice.priority)
                )}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getPriorityIcon(notice.priority)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-lg text-slate-900">{notice.title}</h3>
                      <span className="text-sm text-slate-600 whitespace-nowrap">
                        {formatDate(notice.date)}
                      </span>
                    </div>

                    <p className="text-slate-700 mb-3">{notice.content}</p>

                    {/* Category Badge */}
                    <div className="flex items-center gap-2">
                      <span className={cn('px-3 py-1 rounded-full text-xs font-medium', getCategoryColor(notice.category))}>
                        {notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
                      </span>
                      
                      {notice.priority !== 'normal' && (
                        <span className={cn('px-3 py-1 rounded-full text-xs font-medium', {
                          'bg-danger-100 text-danger-700': notice.priority === 'urgent',
                          'bg-warning-100 text-warning-700': notice.priority === 'important',
                        })}>
                          {notice.priority.charAt(0).toUpperCase() + notice.priority.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <p className="text-slate-600 text-lg">No notices found matching your criteria</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}