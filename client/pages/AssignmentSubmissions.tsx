import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, MessageCircle, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { SAMPLE_STUDENTS, SAMPLE_ASSIGNMENTS } from '@/lib/sample-data';
import { useParams, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// Mock submission data
const generateSubmissionData = (assignment: typeof SAMPLE_ASSIGNMENTS[0]) => {
  const submissions = [];
  
  // Submitted students
  for (let i = 0; i < assignment.submitted; i++) {
    const student = SAMPLE_STUDENTS[i % SAMPLE_STUDENTS.length];
    submissions.push({
      studentId: student.id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      batch: student.batch,
      email: student.email,
      submissionDate: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      submissionTime: `${Math.floor(Math.random() * 23)}:${String(Math.floor(Math.random() * 59)).padStart(2, '0')}`,
      status: 'submitted' as const,
      grade: Math.floor(Math.random() * 40) + 60,
      feedback: 'Good work. Could improve on the implementation part.',
      fileName: `assignment_${i + 1}.pdf`
    });
  }

  // Overdue students
  for (let i = 0; i < assignment.overdue; i++) {
    const student = SAMPLE_STUDENTS[(assignment.submitted + i) % SAMPLE_STUDENTS.length];
    submissions.push({
      studentId: student.id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      batch: student.batch,
      email: student.email,
      submissionDate: new Date(Date.now() - (15 + Math.random() * 10) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      submissionTime: `${Math.floor(Math.random() * 23)}:${String(Math.floor(Math.random() * 59)).padStart(2, '0')}`,
      status: 'overdue' as const,
      grade: Math.floor(Math.random() * 35) + 50,
      feedback: 'Submitted late. -10% penalty applied.',
      fileName: `assignment_late_${i + 1}.pdf`
    });
  }

  // Pending students
  for (let i = 0; i < assignment.pending; i++) {
    const student = SAMPLE_STUDENTS[(assignment.submitted + assignment.overdue + i) % SAMPLE_STUDENTS.length];
    submissions.push({
      studentId: student.id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      batch: student.batch,
      email: student.email,
      submissionDate: null,
      submissionTime: null,
      status: 'pending' as const,
      grade: null,
      feedback: null,
      fileName: null
    });
  }

  return submissions;
};

export default function AssignmentSubmissions() {
  const { assignmentId } = useParams();
  const assignment = SAMPLE_ASSIGNMENTS.find(a => a.id === assignmentId) || SAMPLE_ASSIGNMENTS[0];
  const submissions = generateSubmissionData(assignment);
  const [filterStatus, setFilterStatus] = useState<'all' | 'submitted' | 'overdue' | 'pending'>('all');

  const filteredSubmissions = submissions.filter(sub => {
    if (filterStatus === 'all') return true;
    return sub.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return { bg: 'bg-success-100', text: 'text-success-700', label: 'Submitted' };
      case 'overdue':
        return { bg: 'bg-warning-100', text: 'text-warning-700', label: 'Overdue' };
      case 'pending':
        return { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Pending' };
      default:
        return { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Unknown' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <CheckCircle className="h-5 w-5 text-success-600" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-warning-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-slate-400" />;
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <Link to="/assignments" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Assignments
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Assignment Submissions</h1>
          <p className="text-slate-600 mt-1">{assignment.title}</p>
        </div>

        {/* Assignment Info */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-slate-600">Subject</p>
              <p className="text-lg font-semibold text-slate-900">{assignment.subject}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Batch</p>
              <p className="text-lg font-semibold text-slate-900">{assignment.batch}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Due Date</p>
              <p className="text-lg font-semibold text-slate-900">{new Date(assignment.dueDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Marks</p>
              <p className="text-lg font-semibold text-slate-900">{assignment.totalMarks}</p>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus('all')}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-colors',
              filterStatus === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            )}
          >
            All ({submissions.length})
          </button>
          <button
            onClick={() => setFilterStatus('submitted')}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-colors',
              filterStatus === 'submitted'
                ? 'bg-success-600 text-white'
                : 'bg-success-100 text-success-700 hover:bg-success-200'
            )}
          >
            Submitted ({assignment.submitted})
          </button>
          <button
            onClick={() => setFilterStatus('overdue')}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-colors',
              filterStatus === 'overdue'
                ? 'bg-warning-600 text-white'
                : 'bg-warning-100 text-warning-700 hover:bg-warning-200'
            )}
          >
            Overdue ({assignment.overdue})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-colors',
              filterStatus === 'pending'
                ? 'bg-slate-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            )}
          >
            Pending ({assignment.pending})
          </button>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredSubmissions.length > 0 ? (
            filteredSubmissions.map((submission, index) => {
              const badgeInfo = getStatusBadge(submission.status);
              return (
                <div key={index} className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    {/* Student Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center font-medium text-primary-600 text-sm flex-shrink-0">
                        {submission.studentName.split(' ').map(n => n[0]).join('')}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold text-slate-900">{submission.studentName}</p>
                          <span className={cn('px-2 py-1 rounded text-xs font-medium', badgeInfo.bg, badgeInfo.text)}>
                            {badgeInfo.label}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{submission.rollNumber} • {submission.batch}</p>
                        <p className="text-sm text-slate-500">{submission.email}</p>
                        
                        {/* Submission Details */}
                        {submission.status !== 'pending' && (
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <p className="text-xs text-slate-600">
                              <span className="font-medium">Submitted:</span> {submission.submissionDate} at {submission.submissionTime}
                            </p>
                            {submission.grade && (
                              <p className="text-xs text-slate-600 mt-1">
                                <span className="font-medium">Grade:</span> {submission.grade}/{assignment.totalMarks}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {submission.status !== 'pending' && (
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Download">
                          <Download className="h-5 w-5 text-slate-600" />
                        </button>
                      )}
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Send Message">
                        <MessageCircle className="h-5 w-5 text-slate-600" />
                      </button>
                    </div>
                  </div>

                  {/* Feedback Section */}
                  {submission.feedback && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-sm font-medium text-slate-900 mb-1">Feedback</p>
                      <p className="text-sm text-slate-600">{submission.feedback}</p>
                    </div>
                  )}

                  {/* Grade Input for Pending */}
                  {submission.status === 'pending' && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-sm text-slate-600 mb-2">No submission yet. Send a reminder?</p>
                      <Button size="sm" variant="outline" className="text-primary-600">
                        Send Reminder Email
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <p className="text-slate-600">No submissions found</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
