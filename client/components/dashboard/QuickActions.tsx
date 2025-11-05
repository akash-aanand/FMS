import { CheckCircle2, FileText, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function QuickActions() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h3 className="font-semibold text-slate-900">Quick Actions</h3>
        <p className="text-xs text-slate-500 mt-1">Frequently used tasks</p>
      </div>

      <div className="p-6 space-y-3">
        <Button
          asChild
          className="w-full bg-primary-600 hover:bg-primary-700 text-white"
          size="lg"
        >
          <Link to="/attendance/new" className="flex items-center justify-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Take Today's Attendance
          </Link>
        </Button>

        <Button
          asChild
          className="w-full bg-success-600 hover:bg-success-700 text-white"
          size="lg"
        >
          <Link to="/assignments/create" className="flex items-center justify-center gap-2">
            <FileText className="h-5 w-5" />
            Create New Assignment
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="w-full"
          size="lg"
        >
          <Link to="/submissions" className="flex items-center justify-center gap-2">
            <Clock className="h-5 w-5" />
            View Submission Queue
          </Link>
        </Button>
      </div>
    </div>
  );
}
