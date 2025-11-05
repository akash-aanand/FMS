import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';

interface PlaceholderProps {
  title: string;
  feature: string;
}

const FEATURE_DESCRIPTIONS: Record<string, string> = {
  students: 'Manage student information, search by name or roll number, view attendance status, and filter by batch.',
  studentProfile: 'View comprehensive student profile with academic performance, attendance history, assignments, and behavioral notes.',
  assignments: 'Track all assignments, monitor submission progress, view grades, and download submissions.',
  createAssignment: 'Create and publish assignments with due dates, attachment support, and batch assignment.',
  assignmentDetails: 'View detailed assignment information, student submissions, grades, and feedback.',
  attendance: 'View attendance analytics with charts, identify at-risk students, and monitor trends.',
  takeAttendance: 'Mark daily attendance for classes with batch and subject selection.',
  analytics: 'Comprehensive attendance analytics with multiple views and export functionality.',
  timetable: 'View and manage the weekly timetable for all batches and subjects.',
  notices: 'Browse all notices and announcements with category and priority filtering.',
  submissions: 'Queue of student assignment submissions awaiting review and grading.',
};

export default function Placeholder({ title, feature }: PlaceholderProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-lg bg-primary-100 p-4">
              <Zap className="h-12 w-12 text-primary-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-4">{title}</h1>

          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            {FEATURE_DESCRIPTIONS[feature] ||
              'This feature is coming soon. Continue building your Faculty Management System.'}
          </p>

          <div className="bg-white border border-slate-200 rounded-lg p-8 mb-8">
            <p className="text-slate-700 mb-4">
              Ready to implement this feature? You can prompt the assistant to build this page with all its functionality, filters, and interactions.
            </p>
            <p className="text-sm text-slate-600">
              The dashboard and core infrastructure are in place. Each feature page can be fully customized based on your specific requirements.
            </p>
          </div>

          <Button asChild className="bg-primary-600 hover:bg-primary-700 text-white">
            <Link to="/">Return to Dashboard</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
