import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { WeeklyTimetable } from '@/components/dashboard/WeeklyTimetable';
import { NoticesBoard } from '@/components/dashboard/NoticesBoard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Users, AlertCircle, BarChart3, Bell } from 'lucide-react';
import { SAMPLE_STUDENTS, SAMPLE_ASSIGNMENTS, SAMPLE_NOTICES } from '@/lib/sample-data';

export default function Index() {
  // Calculate statistics
  const totalStudents = SAMPLE_STUDENTS.length;
  const pendingReviews = SAMPLE_ASSIGNMENTS.reduce((sum, a) => sum + a.pending + a.overdue, 0);
  const avgAttendance = Math.round(
    SAMPLE_STUDENTS.reduce((sum, s) => sum + s.attendance, 0) / SAMPLE_STUDENTS.length
  );
  const newNotices = SAMPLE_NOTICES.filter(n => n.priority === 'urgent' || n.priority === 'important').length;

  const atRiskStudents = SAMPLE_STUDENTS.filter(s => s.attendance < 60).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Welcome, Dr. Rajesh Kumar</h1>
          <p className="mt-2 text-slate-600">Here's what's happening in your classes today</p>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Students"
            value={totalStudents}
            subtitle="Across all batches"
            icon={Users}
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            title="Pending Reviews"
            value={pendingReviews}
            subtitle="Assignments to review"
            icon={AlertCircle}
            trend="up"
            trendValue="3 new"
            bgColor="bg-orange-100"
            iconColor="text-orange-600"
          />
          <StatCard
            title="Average Attendance"
            value={`${avgAttendance}%`}
            subtitle="Class attendance rate"
            icon={BarChart3}
            bgColor="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            title="New Notices"
            value={newNotices}
            subtitle="Urgent announcements"
            icon={Bell}
            bgColor="bg-red-100"
            iconColor="text-red-600"
          />
        </div>

        {/* At Risk Alert */}
        {atRiskStudents > 0 && (
          <div className="mb-8 p-4 rounded-lg bg-danger-50 border border-danger-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-danger-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-danger-900">Students At Risk</h3>
                <p className="text-sm text-danger-800 mt-1">
                  {atRiskStudents} student(s) have attendance below 60%. Consider reaching out to them.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Large Widgets */}
          <div className="lg:col-span-2 space-y-8">
            <WeeklyTimetable />
            <NoticesBoard />
          </div>

          {/* Right Column - Quick Actions */}
          <div>
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
}
