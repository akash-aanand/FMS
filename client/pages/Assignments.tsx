import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Edit, Download, Trash2, Calendar, X } from 'lucide-react';
import { SAMPLE_ASSIGNMENTS, Assignment } from '@/lib/sample-data';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const FILTER_OPTIONS = ['All', 'Active', 'Completed', 'Overdue'];
const BATCHES = ['All', 'CS-A', 'CS-B', 'CS-C'];
const SUBJECTS = ['All', 'Data Structures', 'Web Development', 'Database Management'];

export default function Assignments() {
  // Initialize assignments from localStorage or use sample data
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('assignments');
    return saved ? JSON.parse(saved) : SAMPLE_ASSIGNMENTS;
  });
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [viewingAssignment, setViewingAssignment] = useState<Assignment | null>(null);

  // Save assignments to localStorage whenever they change
  const updateAssignments = (newAssignments: Assignment[]) => {
    setAssignments(newAssignments);
    localStorage.setItem('assignments', JSON.stringify(newAssignments));
  };

  const getProgressPercentage = (assignment: Assignment) => {
    return Math.round((assignment.submitted / assignment.totalStudents) * 100);
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedBatch !== 'All' && assignment.batch !== selectedBatch) return false;
    if (selectedSubject !== 'All' && assignment.subject !== selectedSubject) return false;
    if (filterStatus === 'Overdue' && assignment.overdue === 0) return false;
    if (filterStatus === 'Completed' && assignment.pending > 0) return false;
    return matchesSearch;
  });

  const handleDeleteAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  const handleDownloadAssignments = (assignment: Assignment) => {
    const data = JSON.stringify(assignment, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', `${assignment.title.replace(/\s+/g, '_')}_details.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment({ ...assignment });
    setShowEditModal(true);
  };

  const handleSaveAssignment = () => {
    if (!editingAssignment) return;
    setAssignments(assignments.map(a => a.id === editingAssignment.id ? editingAssignment : a));
    setShowEditModal(false);
    setEditingAssignment(null);
    alert('Assignment updated successfully!');
  };

  const handleViewSubmissions = (assignment: Assignment) => {
    setViewingAssignment(assignment);
    setShowViewModal(true);
  };

  return (
    <MainLayout>
      <div className="px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Assignments Dashboard</h1>
            <p className="text-slate-600 mt-1">Track and manage all assignment submissions</p>
          </div>
          <Button asChild className="bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2">
            <Link to="/assignments/create">
              <Plus className="h-4 w-4" />
              New Assignment
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FILTER_OPTIONS.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BATCHES.map(batch => (
                    <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Assignment Cards Grid */}
        {filteredAssignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssignments.map(assignment => {
              const progress = getProgressPercentage(assignment);
              const dueDate = new Date(assignment.dueDate);
              const isOverdue = dueDate < new Date();

              return (
                <div key={assignment.id} className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  {/* Card Header */}
                  <div className="p-6 border-b border-slate-200">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">{assignment.title}</h3>
                      {isOverdue && assignment.overdue > 0 && (
                        <span className="px-2 py-1 bg-danger-100 text-danger-700 text-xs font-semibold rounded">
                          Overdue
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-1">Due: {dueDate.toLocaleDateString()}</p>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    {/* Tags */}
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        {assignment.subject}
                      </span>
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded">
                        {assignment.batch}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{assignment.submitted}</p>
                        <p className="text-xs text-success-600">Submitted</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{assignment.pending}</p>
                        <p className="text-xs text-warning-600">Pending</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{assignment.overdue}</p>
                        <p className="text-xs text-danger-600">Overdue</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-slate-700">Progress</p>
                        <p className="text-xs font-bold text-primary-600">{progress}% Submitted</p>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="pt-2 border-t border-slate-200">
                      <p className="text-xs text-slate-600">Total Students: {assignment.totalStudents}</p>
                    </div>
                  </div>

                  {/* Card Header Status Badge */}
                  {assignment.status && (
                    <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-semibold',
                          assignment.status === 'draft' ? 'bg-slate-200 text-slate-700' :
                          assignment.status === 'published' ? 'bg-success-100 text-success-700' :
                          'bg-blue-100 text-blue-700'
                        )}>
                          {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                        </span>
                        {assignment.status === 'scheduled' && assignment.scheduledDate && (
                          <span className="text-xs text-slate-600 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(assignment.scheduledDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Card Footer - Actions */}
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
                      onClick={() => handleViewSubmissions(assignment)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Submissions
                    </Button>
                    <button
                      className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                      title="Edit"
                      onClick={() => handleEditAssignment(assignment)}
                    >
                      <Edit className="h-4 w-4 text-slate-600" />
                    </button>
                    <button
                      className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                      title="Download"
                      onClick={() => handleDownloadAssignments(assignment)}
                    >
                      <Download className="h-4 w-4 text-slate-600" />
                    </button>
                    <button
                      className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                      title="Delete"
                      onClick={() => handleDeleteAssignment(assignment.id)}
                    >
                      <Trash2 className="h-4 w-4 text-danger-600" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <p className="text-slate-600">No assignments found matching your criteria</p>
          </div>
        )}

        {/* View Submissions Modal */}
        {showViewModal && viewingAssignment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full shadow-lg max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white">
                <h2 className="text-lg font-semibold text-slate-900">View Submissions - {viewingAssignment.title}</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-success-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-success-600 font-medium">Submitted</p>
                      <p className="text-3xl font-bold text-success-600">{viewingAssignment.submitted}</p>
                    </div>
                    <div className="bg-warning-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-warning-600 font-medium">Pending</p>
                      <p className="text-3xl font-bold text-warning-600">{viewingAssignment.pending}</p>
                    </div>
                    <div className="bg-danger-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-danger-600 font-medium">Overdue</p>
                      <p className="text-3xl font-bold text-danger-600">{viewingAssignment.overdue}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-slate-900 mb-3">Assignment Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-slate-600">Subject:</span> <span className="font-medium">{viewingAssignment.subject}</span></p>
                      <p><span className="text-slate-600">Batch:</span> <span className="font-medium">{viewingAssignment.batch}</span></p>
                      <p><span className="text-slate-600">Due Date:</span> <span className="font-medium">{new Date(viewingAssignment.dueDate).toLocaleDateString()}</span></p>
                      <p><span className="text-slate-600">Total Marks:</span> <span className="font-medium">{viewingAssignment.totalMarks}</span></p>
                      <p><span className="text-slate-600">Total Students:</span> <span className="font-medium">{viewingAssignment.totalStudents}</span></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end p-6 border-t border-slate-200">
                <Button variant="outline" onClick={() => setShowViewModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Assignment Modal */}
        {showEditModal && editingAssignment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full shadow-lg max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white">
                <h2 className="text-lg font-semibold text-slate-900">Edit Assignment</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Title</label>
                  <Input
                    type="text"
                    value={editingAssignment.title}
                    onChange={(e) => setEditingAssignment({ ...editingAssignment, title: e.target.value })}
                    className="h-10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Subject</label>
                    <Input
                      type="text"
                      value={editingAssignment.subject}
                      onChange={(e) => setEditingAssignment({ ...editingAssignment, subject: e.target.value })}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Batch</label>
                    <Input
                      type="text"
                      value={editingAssignment.batch}
                      onChange={(e) => setEditingAssignment({ ...editingAssignment, batch: e.target.value })}
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Due Date</label>
                    <Input
                      type="date"
                      value={editingAssignment.dueDate}
                      onChange={(e) => setEditingAssignment({ ...editingAssignment, dueDate: e.target.value })}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Total Marks</label>
                    <Input
                      type="number"
                      value={editingAssignment.totalMarks}
                      onChange={(e) => setEditingAssignment({ ...editingAssignment, totalMarks: parseInt(e.target.value) })}
                      className="h-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Status</label>
                  <Select
                    value={editingAssignment.status || 'published'}
                    onValueChange={(value) => setEditingAssignment({ ...editingAssignment, status: value as 'draft' | 'published' | 'scheduled' })}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Save as Draft</SelectItem>
                      <SelectItem value="published">Publish Now</SelectItem>
                      <SelectItem value="scheduled">Schedule for Later</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {editingAssignment.status === 'scheduled' && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Scheduled Date</label>
                    <Input
                      type="date"
                      value={editingAssignment.scheduledDate || ''}
                      onChange={(e) => setEditingAssignment({ ...editingAssignment, scheduledDate: e.target.value })}
                      className="h-10"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end p-6 border-t border-slate-200">
                <Button variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-primary-600 hover:bg-primary-700 text-white"
                  onClick={handleSaveAssignment}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
