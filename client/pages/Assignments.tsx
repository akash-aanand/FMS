import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Edit, Download, Trash2 } from 'lucide-react';
import { SAMPLE_ASSIGNMENTS } from '@/lib/sample-data';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';

const FILTER_OPTIONS = ['All', 'Active', 'Completed', 'Overdue'];
const BATCHES = ['All', 'CS-A', 'CS-B', 'CS-C'];
const SUBJECTS = ['All', 'Data Structures', 'Web Development', 'Database Management'];

export default function Assignments() {
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');

  const getProgressPercentage = (assignment: typeof SAMPLE_ASSIGNMENTS[0]) => {
    return Math.round((assignment.submitted / assignment.totalStudents) * 100);
  };

  const filteredAssignments = SAMPLE_ASSIGNMENTS.filter(assignment => {
    if (selectedBatch !== 'All' && assignment.batch !== selectedBatch) return false;
    if (selectedSubject !== 'All' && assignment.subject !== selectedSubject) return false;
    if (filterStatus === 'Overdue' && assignment.overdue === 0) return false;
    if (filterStatus === 'Completed' && assignment.pending > 0) return false;
    return true;
  });

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

                  {/* Card Footer - Actions */}
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Submissions
                    </Button>
                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors" title="Edit">
                      <Edit className="h-4 w-4 text-slate-600" />
                    </button>
                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors" title="Download">
                      <Download className="h-4 w-4 text-slate-600" />
                    </button>
                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors" title="Delete">
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
      </div>
    </MainLayout>
  );
}
