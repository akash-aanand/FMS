import { MainLayout } from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, Plus, MoreVertical, Eye, Edit, MessageCircle, X } from 'lucide-react';
import { SAMPLE_STUDENTS, Student } from '@/lib/sample-data';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BATCHES = ['All', 'CS-A', 'CS-B', 'CS-C'];
const ATTENDANCE_FILTERS = ['All', 'Good', 'Low', 'At Risk'];

export default function Students() {
  const [students, setStudents] = useState(SAMPLE_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedAttendance, setSelectedAttendance] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: '',
    rollNumber: '',
    batch: 'CS-A',
    email: '',
    phone: '',
    branch: '',
    semester: '',
    section: '',
    fathersName: '',
    attendance: 75,
    cgpa: 7.5,
  });
  const itemsPerPage = 10;

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesBatch = selectedBatch === 'All' || student.batch === selectedBatch;
      
      let matchesAttendance = true;
      if (selectedAttendance !== 'All') {
        if (selectedAttendance === 'Good' && student.attendance < 75) matchesAttendance = false;
        if (selectedAttendance === 'Low' && (student.attendance < 60 || student.attendance >= 75)) matchesAttendance = false;
        if (selectedAttendance === 'At Risk' && student.attendance >= 60) matchesAttendance = false;
      }

      return matchesSearch && matchesBatch && matchesAttendance;
    });
  }, [searchTerm, selectedBatch, selectedAttendance]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 75) return 'text-success-600 bg-success-50';
    if (attendance >= 60) return 'text-warning-600 bg-warning-50';
    return 'text-danger-600 bg-danger-50';
  };

  const getAttendanceBadge = (attendance: number) => {
    if (attendance >= 75) return 'bg-success-100 text-success-700';
    if (attendance >= 60) return 'bg-warning-100 text-warning-700';
    return 'bg-danger-100 text-danger-700';
  };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.rollNumber || !newStudent.email || !newStudent.phone) {
      alert('Please fill in all required fields');
      return;
    }

    const student: Student = {
      id: Date.now().toString(),
      name: newStudent.name,
      rollNumber: newStudent.rollNumber,
      batch: newStudent.batch || 'CS-A',
      email: newStudent.email,
      phone: newStudent.phone,
      branch: newStudent.branch,
      semester: newStudent.semester,
      section: newStudent.section,
      fathersName: newStudent.fathersName,
      attendance: newStudent.attendance || 75,
      cgpa: newStudent.cgpa || 7.5,
    };

    setStudents([...students, student]);
    setShowAddModal(false);
    setNewStudent({
      name: '',
      rollNumber: '',
      batch: 'CS-A',
      email: '',
      phone: '',
      branch: '',
      semester: '',
      section: '',
      fathersName: '',
      attendance: 75,
      cgpa: 7.5,
    });
  };

  const handleExportCSV = () => {
    const headers = ['Roll Number', 'Student Name', 'Batch', 'Branch', 'Semester', 'Section', 'Father\'s Name', 'Email', 'Phone', 'Attendance', 'CGPA'];
    const rows = filteredStudents.map(student => [
      student.rollNumber,
      student.name,
      student.batch,
      student.branch || '-',
      student.semester || '-',
      student.section || '-',
      student.fathersName || '-',
      student.email,
      student.phone,
      student.attendance,
      student.cgpa,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(col => `"${col}"`).join(',')),
    ].join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', `students_${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <MainLayout>
      <div className="px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Manage Students</h1>
            <p className="text-slate-600 mt-1">View, search, and export student information by batch and semester.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2" onClick={handleExportCSV}>
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2" onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4" />
              Add Student
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search by Name or Roll No..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
                <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={selectedBatch} onValueChange={(value) => { setSelectedBatch(value); setCurrentPage(1); }}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BATCHES.map(batch => (
                    <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedAttendance} onValueChange={(value) => { setSelectedAttendance(value); setCurrentPage(1); }}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ATTENDANCE_FILTERS.map(filter => (
                    <SelectItem key={filter} value={filter}>{filter}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">ROLL NUMBER</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">STUDENT NAME</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">CONTACT INFO</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">ATTENDANCE</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">STATUS</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedStudents.length > 0 ? (
                  paginatedStudents.map(student => (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{student.rollNumber}</td>
                      <td className="px-6 py-4 text-sm text-slate-900">{student.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>{student.email}</div>
                        <div className="text-xs text-slate-500">{student.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={cn('inline-block px-3 py-1 rounded-full text-sm font-semibold', getAttendanceBadge(student.attendance))}>
                          {student.attendance}%
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn('px-3 py-1 rounded-full text-xs font-medium', {
                          'bg-success-100 text-success-700': student.attendance >= 75,
                          'bg-warning-100 text-warning-700': student.attendance >= 60 && student.attendance < 75,
                          'bg-danger-100 text-danger-700': student.attendance < 60,
                        })}>
                          {student.attendance >= 75 ? 'Good' : student.attendance >= 60 ? 'Low' : 'At Risk'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="View Profile">
                            <Eye className="h-4 w-4 text-slate-600" />
                          </button>
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Edit">
                            <Edit className="h-4 w-4 text-slate-600" />
                          </button>
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Message">
                            <MessageCircle className="h-4 w-4 text-slate-600" />
                          </button>
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <MoreVertical className="h-4 w-4 text-slate-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      No students found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} results
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
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? 'bg-primary-600 hover:bg-primary-700' : ''}
                    >
                      {page}
                    </Button>
                  );
                })}
                {totalPages > 5 && <span className="px-2 py-1">...</span>}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  →
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Add Student Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full shadow-lg">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Add New Student</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Student Name *</label>
                  <Input
                    type="text"
                    placeholder="Enter student name"
                    value={newStudent.name || ''}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Roll Number *</label>
                  <Input
                    type="text"
                    placeholder="e.g., CS001"
                    value={newStudent.rollNumber || ''}
                    onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Branch</label>
                  <Input
                    type="text"
                    placeholder="e.g., Computer Science"
                    value={newStudent.branch || ''}
                    onChange={(e) => setNewStudent({ ...newStudent, branch: e.target.value })}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Semester</label>
                  <Input
                    type="text"
                    placeholder="e.g., 3"
                    value={newStudent.semester || ''}
                    onChange={(e) => setNewStudent({ ...newStudent, semester: e.target.value })}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Section</label>
                  <Input
                    type="text"
                    placeholder="e.g., A"
                    value={newStudent.section || ''}
                    onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Father's Name</label>
                  <Input
                    type="text"
                    placeholder="Enter father's name"
                    value={newStudent.fathersName || ''}
                    onChange={(e) => setNewStudent({ ...newStudent, fathersName: e.target.value })}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Email *</label>
                  <Input
                    type="email"
                    placeholder="student@college.edu"
                    value={newStudent.email || ''}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Phone *</label>
                  <Input
                    type="tel"
                    placeholder="+91-9876543210"
                    value={newStudent.phone || ''}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Batch</label>
                  <Select value={newStudent.batch || 'CS-A'} onValueChange={(value) => setNewStudent({ ...newStudent, batch: value })}>
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
              </div>

              <div className="flex gap-3 justify-end p-6 border-t border-slate-200">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-primary-600 hover:bg-primary-700 text-white"
                  onClick={handleAddStudent}
                >
                  Add Student
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
