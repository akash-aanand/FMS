import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Check, X } from 'lucide-react';
import { SAMPLE_STUDENTS, SAMPLE_TIMETABLE } from '@/lib/sample-data';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const BATCHES = ['CS-A', 'CS-B', 'CS-C'];

export default function TakeAttendance() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedBatch, setSelectedBatch] = useState('CS-A');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceMarks, setAttendanceMarks] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Get students for selected batch
  const batchStudents = SAMPLE_STUDENTS.filter(s => s.batch === selectedBatch);

  // Filter students by search term
  const filteredStudents = batchStudents.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get subjects for selected batch from timetable
  const batchSubjects = Array.from(
    new Set(
      SAMPLE_TIMETABLE
        .filter(slot => slot.batch === selectedBatch)
        .map(slot => slot.subject)
    )
  );

  // Initialize attendance marks
  const handleStudentToggle = (studentId: string) => {
    setAttendanceMarks(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const presentCount = Object.values(attendanceMarks).filter(Boolean).length;
  const absentCount = filteredStudents.length - presentCount;

  const handleMarkAll = (present: boolean) => {
    const newMarks: Record<string, boolean> = { ...attendanceMarks };
    filteredStudents.forEach(student => {
      newMarks[student.id] = present;
    });
    setAttendanceMarks(newMarks);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      date: selectedDate,
      batch: selectedBatch,
      subject: selectedSubject,
      attendance: attendanceMarks,
      notes,
    });
    // Here you would save the attendance data
    alert('Attendance marked successfully!');
  };

  return (
    <MainLayout>
      <div className="px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <Link to="/attendance" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Attendance
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Mark Attendance</h1>
          <p className="text-slate-600 mt-1">Take today's attendance for your class</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date & Batch Selection */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Attendance Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Date *</label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="h-10"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Batch/Class *</label>
                <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BATCHES.map(batch => (
                      <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Subject/Period</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {batchSubjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Student Attendance */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Student Attendance</h2>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkAll(true)}
                  className="text-success-600 border-success-200 hover:bg-success-50"
                >
                  Mark All Present
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkAll(false)}
                  className="text-danger-600 border-danger-200 hover:bg-danger-50"
                >
                  Mark All Absent
                </Button>
              </div>
            </div>

            {/* Grid Layout - Two columns on larger screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-h-96 overflow-y-auto">
              {batchStudents.map(student => (
                <div
                  key={student.id}
                  onClick={() => handleStudentToggle(student.id)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  {/* Student Photo/Avatar */}
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center font-medium text-primary-600 text-sm flex-shrink-0">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>

                  {/* Student Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm">{student.name}</p>
                    <p className="text-xs text-slate-500">{student.rollNumber}</p>
                  </div>

                  {/* Toggle Button */}
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center transition-colors flex-shrink-0',
                      attendanceMarks[student.id]
                        ? 'bg-success-100'
                        : 'bg-slate-100'
                    )}
                  >
                    {attendanceMarks[student.id] ? (
                      <Check className="h-5 w-5 text-success-600" />
                    ) : (
                      <X className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border-t border-slate-200 pt-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-slate-600">Total Students</p>
                  <p className="text-2xl font-bold text-slate-900">{batchStudents.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-success-600 font-medium">Present</p>
                  <p className="text-2xl font-bold text-success-600">{presentCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-danger-600 font-medium">Absent</p>
                  <p className="text-2xl font-bold text-danger-600">{absentCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <label className="text-sm font-medium text-slate-700 block mb-2">Class Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes or comments for this class..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" asChild>
              <Link to="/attendance">Cancel</Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="text-primary-600"
              onClick={() => {
                console.log('Draft saved');
                alert('Attendance saved as draft!');
              }}
            >
              Save as Draft
            </Button>
            <Button
              type="submit"
              className="bg-success-600 hover:bg-success-700 text-white"
            >
              Submit Attendance
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
