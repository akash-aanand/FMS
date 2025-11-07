import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Plus, X } from "lucide-react";
import { SAMPLE_STUDENTS } from "@/lib/sample-data";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

const BATCHES = ["All", "CS-A", "CS-B", "CS-C"];

// Generate mock attendance records
const generateAttendanceRecords = () => {
  const records: Record<
    string,
    { date: string; status: "present" | "absent" }[]
  > = {};

  SAMPLE_STUDENTS.forEach((student) => {
    records[student.id] = [];
    const daysInMonth = 22; // Classes in a month
    for (let i = 0; i < daysInMonth; i++) {
      const date = new Date(2024, 10, i + 1);
      // Based on overall attendance percentage
      const isPresent = Math.random() * 100 < student.attendance;
      records[student.id].push({
        date: date.toISOString().split("T")[0],
        status: isPresent ? "present" : "absent",
      });
    }
  });
  return records;
};

export default function Attendance() {
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceRecords] = useState(generateAttendanceRecords());
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [submissionStatus] = useState<Record<string, { submitted: boolean; submittedAt?: string; status: string }>>({
    '1': { submitted: true, submittedAt: '2024-11-05 09:30 AM', status: 'submitted' },
    '2': { submitted: true, submittedAt: '2024-11-04 10:15 AM', status: 'submitted' },
    '3': { submitted: false, status: 'draft' },
    '4': { submitted: true, submittedAt: '2024-11-05 02:00 PM', status: 'submitted' },
    '5': { submitted: false, status: 'draft' },
  });
  const itemsPerPage = 10;

  const filteredStudents = useMemo(() => {
    return SAMPLE_STUDENTS.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBatch =
        selectedBatch === "All" || student.batch === selectedBatch;

      return matchesSearch && matchesBatch;
    });
  }, [searchTerm, selectedBatch]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getAttendanceTrend = (studentId: string) => {
    const records = attendanceRecords[studentId];
    if (!records) return [];
    return records.slice(-7); // Last 7 days
  };

  const getAbsentCount = (studentId: string) => {
    const records = attendanceRecords[studentId];
    return records ? records.filter((r) => r.status === "absent").length : 0;
  };

  const handleExport = (format: "csv" | "pdf") => {
    if (format === "csv") {
      // Create CSV content
      const headers = [
        "Roll Number",
        "Student Name",
        "Batch",
        "Overall Attendance %",
        "Status",
      ];
      const rows = filteredStudents.map((student) => [
        student.rollNumber,
        student.name,
        student.batch,
        student.attendance,
        student.attendance >= 75
          ? "Good"
          : student.attendance >= 60
            ? "Low"
            : "At Risk",
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      // Create and download CSV file
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent),
      );
      element.setAttribute(
        "download",
        `attendance_${new Date().toISOString().split("T")[0]}.csv`,
      );
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <MainLayout>
      <div className="px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Attendance Records
            </h1>
            <p className="text-slate-600 mt-1">
              View and manage student attendance
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => handleExport("csv")}
            >
              <Download className="h-4 w-4" />
              Export to CSV
            </Button>
            <Button
              asChild
              className="bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
            >
              <Link to="/attendance/new">
                <Plus className="h-4 w-4" />
                Mark Attendance
              </Link>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search by Name or Roll No..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <Select
              value={selectedBatch}
              onValueChange={(value) => {
                setSelectedBatch(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BATCHES.map((batch) => (
                  <SelectItem key={batch} value={batch}>
                    {batch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Attendance List */}
        <div className="space-y-4">
          {paginatedStudents.length > 0 ? (
            paginatedStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center font-medium text-primary-600 text-sm">
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {student.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {student.rollNumber} • {student.batch}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={cn('px-3 py-1 rounded-full text-xs font-semibold', submissionStatus[student.id]?.submitted ? 'bg-success-100 text-success-700' : 'bg-slate-100 text-slate-700')}>
                      {submissionStatus[student.id]?.submitted ? 'Submitted' : 'Draft'}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedStudent(student.id);
                        setShowDetailModal(true);
                      }}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>

                {/* Attendance Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-600">Overall Attendance</p>
                    <p className="text-xl font-bold text-slate-900">
                      {student.attendance}%
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-600">Classes Absent</p>
                    <p className="text-xl font-bold text-danger-600">
                      {getAbsentCount(student.id)}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-600">Email</p>
                    <p className="text-sm text-slate-700 truncate">
                      {student.email}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-600">Phone</p>
                    <p className="text-sm text-slate-700">{student.phone}</p>
                  </div>
                </div>

                {/* Attendance Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-700">
                      Attendance Status
                    </p>
                    <span
                      className={cn("text-xs font-bold px-2 py-1 rounded", {
                        "bg-success-100 text-success-700":
                          student.attendance >= 75,
                        "bg-warning-100 text-warning-700":
                          student.attendance >= 60 && student.attendance < 75,
                        "bg-danger-100 text-danger-700":
                          student.attendance < 60,
                      })}
                    >
                      {student.attendance >= 75
                        ? "Good"
                        : student.attendance >= 60
                          ? "Low"
                          : "At Risk"}
                    </span>
                  </div>
                  <Progress value={student.attendance} className="h-2" />
                </div>

                {/* Recent Attendance Days */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs font-medium text-slate-700 mb-2">
                    Last 7 Days
                  </p>
                  <div className="flex gap-2">
                    {getAttendanceTrend(student.id).map((record, index) => (
                      <div
                        key={index}
                        className={cn(
                          "w-6 h-6 rounded text-xs flex items-center justify-center font-semibold text-white",
                          {
                            "bg-success-600": record.status === "present",
                            "bg-danger-600": record.status === "absent",
                          },
                        )}
                        title={`${new Date(record.date).toLocaleDateString()}: ${record.status}`}
                      >
                        {record.status === "present" ? "✓" : "✕"}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <p className="text-slate-600">No students found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 border-t border-slate-200 pt-4 flex items-center justify-between">
            <span className="text-sm text-slate-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of{" "}
              {filteredStudents.length} results
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                ←
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={
                      currentPage === page
                        ? "bg-primary-600 hover:bg-primary-700"
                        : ""
                    }
                  >
                    {page}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                →
              </Button>
            </div>
          </div>
        )}

        {/* Attendance Detail Modal */}
        {showDetailModal && selectedStudent && (() => {
          const student = SAMPLE_STUDENTS.find(s => s.id === selectedStudent);
          if (!student) return null;

          const records = attendanceRecords[selectedStudent] || [];
          const daysInMonth = 30;
          const presentCount = records.filter(r => r.status === 'present').length;
          const absentCount = records.filter(r => r.status === 'absent').length;

          return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full shadow-lg max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white">
                  <h2 className="text-lg font-semibold text-slate-900">Attendance Details - {student.name}</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-6">
                  {/* Student Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-600">Roll Number</p>
                      <p className="text-sm font-semibold text-slate-900">{student.rollNumber}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-600">Batch</p>
                      <p className="text-sm font-semibold text-slate-900">{student.batch}</p>
                    </div>
                    <div className="bg-success-50 rounded-lg p-3">
                      <p className="text-xs text-success-600 font-medium">Present</p>
                      <p className="text-2xl font-bold text-success-600">{presentCount}</p>
                    </div>
                    <div className="bg-danger-50 rounded-lg p-3">
                      <p className="text-xs text-danger-600 font-medium">Absent</p>
                      <p className="text-2xl font-bold text-danger-600">{absentCount}</p>
                    </div>
                  </div>

                  {/* 30-Day Grid */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Last 30 Days Attendance</h3>
                    <div className="grid grid-cols-10 gap-2">
                      {records.slice(0, daysInMonth).map((record, index) => {
                        const date = new Date(record.date);
                        const isPresent = record.status === 'present';
                        return (
                          <div
                            key={index}
                            className={cn(
                              'p-2 rounded text-center text-xs font-semibold text-white cursor-pointer hover:shadow-md transition-shadow',
                              isPresent ? 'bg-success-600 hover:bg-success-700' : 'bg-danger-600 hover:bg-danger-700'
                            )}
                            title={`${date.toLocaleDateString()}: ${isPresent ? 'Present' : 'Absent'}`}
                          >
                            <div className="font-bold">{date.getDate()}</div>
                            <div className="text-xs">{isPresent ? '✓' : '✕'}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex gap-6 mt-6 pt-6 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-success-600"></div>
                      <span className="text-sm text-slate-700">Present</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-danger-600"></div>
                      <span className="text-sm text-slate-700">Absent</span>
                    </div>
                  </div>

                  {/* Submission Status */}
                  {submissionStatus[selectedStudent] && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <h3 className="font-semibold text-slate-900 mb-4">Attendance Submission Details</h3>
                      <div className="space-y-3">
                        {/* Student Submission Status */}
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-slate-700 mb-2">Student Submission Status</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-slate-600">
                                {submissionStatus[selectedStudent].submitted
                                  ? `✓ Submitted`
                                  : '✗ Not Submitted (Draft)'}
                              </p>
                              {submissionStatus[selectedStudent].submitted && submissionStatus[selectedStudent].submittedAt && (
                                <p className="text-xs text-slate-500 mt-1">
                                  Submitted at: {submissionStatus[selectedStudent].submittedAt}
                                </p>
                              )}
                            </div>
                            <span className={cn('px-3 py-1 rounded-full text-xs font-semibold',
                              submissionStatus[selectedStudent].submitted
                                ? 'bg-success-100 text-success-700'
                                : 'bg-slate-200 text-slate-700'
                            )}>
                              {submissionStatus[selectedStudent].status}
                            </span>
                          </div>
                        </div>

                        {/* Teacher Submission (for marking attendance) */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <p className="text-sm font-medium text-blue-900 mb-2">Attendance Marked By Teacher</p>
                          <p className="text-xs text-blue-700">
                            Teacher submitted attendance record on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 justify-end p-6 border-t border-slate-200">
                  <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </MainLayout>
  );
}
