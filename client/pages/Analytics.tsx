import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, Users, AlertCircle, CheckCircle, BarChart3 as BarChartIcon } from 'lucide-react';
import { SAMPLE_STUDENTS } from '@/lib/sample-data';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BATCHES = ['All', 'CS-A', 'CS-B', 'CS-C'];

export default function Analytics() {
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedMetric, setSelectedMetric] = useState('attendance');

  const filteredStudents = useMemo(() => {
    return SAMPLE_STUDENTS.filter(s => selectedBatch === 'All' || s.batch === selectedBatch);
  }, [selectedBatch]);

  // Calculate analytics metrics
  const totalStudents = filteredStudents.length;
  const avgAttendance = Math.round(
    filteredStudents.reduce((sum, s) => sum + s.attendance, 0) / filteredStudents.length
  );
  const atRiskCount = filteredStudents.filter(s => s.attendance < 60).length;
  const excellentCount = filteredStudents.filter(s => s.attendance >= 85).length;
  const avgCGPA = (filteredStudents.reduce((sum, s) => sum + s.cgpa, 0) / filteredStudents.length).toFixed(2);

  // Attendance distribution
  const attendanceDistribution = {
    excellent: filteredStudents.filter(s => s.attendance >= 85).length,
    good: filteredStudents.filter(s => s.attendance >= 75 && s.attendance < 85).length,
    average: filteredStudents.filter(s => s.attendance >= 60 && s.attendance < 75).length,
    poor: filteredStudents.filter(s => s.attendance < 60).length,
  };

  // CGPA distribution
  const cgpaDistribution = {
    excellent: filteredStudents.filter(s => s.cgpa >= 8.5).length,
    good: filteredStudents.filter(s => s.cgpa >= 7.5 && s.cgpa < 8.5).length,
    average: filteredStudents.filter(s => s.cgpa >= 6.5 && s.cgpa < 7.5).length,
    poor: filteredStudents.filter(s => s.cgpa < 6.5).length,
  };

  const handleExportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      batch: selectedBatch,
      metrics: {
        totalStudents,
        averageAttendance: avgAttendance,
        atRiskStudents: atRiskCount,
        excellentAttendance: excellentCount,
        averageCGPA: avgCGPA,
      },
      attendanceDistribution,
      cgpaDistribution,
      students: filteredStudents.map(s => ({
        name: s.name,
        rollNumber: s.rollNumber,
        attendance: s.attendance,
        cgpa: s.cgpa,
        status: s.attendance >= 75 ? 'Good' : s.attendance >= 60 ? 'Low' : 'At Risk',
      })),
    };

    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2)));
    element.setAttribute('download', `analytics_report_${new Date().toISOString().split('T')[0]}.json`);
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
            <h1 className="text-3xl font-bold text-slate-900">Attendance Analytics</h1>
            <p className="text-slate-600 mt-1">Comprehensive analysis of student attendance and performance</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2" onClick={handleExportReport}>
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
          <Select value={selectedBatch} onValueChange={setSelectedBatch}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BATCHES.map(batch => (
                <SelectItem key={batch} value={batch}>{batch}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Students */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Students</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{totalStudents}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Average Attendance */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Average Attendance</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{avgAttendance}%</p>
              </div>
              <div className="bg-success-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-success-600" />
              </div>
            </div>
          </div>

          {/* At Risk Students */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">At Risk Students</p>
                <p className="text-3xl font-bold text-danger-600 mt-2">{atRiskCount}</p>
              </div>
              <div className="bg-danger-100 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-danger-600" />
              </div>
            </div>
          </div>

          {/* Average CGPA */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Average CGPA</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{avgCGPA}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Attendance Distribution Chart */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <BarChartIcon className="h-5 w-5" />
              Attendance Distribution
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Excellent (≥85%)', value: attendanceDistribution.excellent, color: 'bg-success-600', percent: Math.round((attendanceDistribution.excellent / totalStudents) * 100) },
                { label: 'Good (75-85%)', value: attendanceDistribution.good, color: 'bg-blue-600', percent: Math.round((attendanceDistribution.good / totalStudents) * 100) },
                { label: 'Average (60-75%)', value: attendanceDistribution.average, color: 'bg-warning-600', percent: Math.round((attendanceDistribution.average / totalStudents) * 100) },
                { label: 'Poor (<60%)', value: attendanceDistribution.poor, color: 'bg-danger-600', percent: Math.round((attendanceDistribution.poor / totalStudents) * 100) },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                    <span className="text-sm font-bold text-slate-900">{item.value} ({item.percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={cn('h-2 rounded-full transition-all', item.color)}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CGPA Distribution Chart */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <BarChartIcon className="h-5 w-5" />
              CGPA Distribution
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Excellent (≥8.5)', value: cgpaDistribution.excellent, color: 'bg-success-600', percent: Math.round((cgpaDistribution.excellent / totalStudents) * 100) },
                { label: 'Good (7.5-8.5)', value: cgpaDistribution.good, color: 'bg-blue-600', percent: Math.round((cgpaDistribution.good / totalStudents) * 100) },
                { label: 'Average (6.5-7.5)', value: cgpaDistribution.average, color: 'bg-warning-600', percent: Math.round((cgpaDistribution.average / totalStudents) * 100) },
                { label: 'Poor (<6.5)', value: cgpaDistribution.poor, color: 'bg-danger-600', percent: Math.round((cgpaDistribution.poor / totalStudents) * 100) },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                    <span className="text-sm font-bold text-slate-900">{item.value} ({item.percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={cn('h-2 rounded-full transition-all', item.color)}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Results Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-900">Detailed Student Results</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">ROLL NUMBER</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">STUDENT NAME</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">BATCH</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700">ATTENDANCE %</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700">CGPA</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{student.rollNumber}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{student.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{student.batch}</td>
                    <td className="px-6 py-4 text-center">
                      <div className={cn('inline-block px-3 py-1 rounded-full text-sm font-semibold', {
                        'bg-success-100 text-success-700': student.attendance >= 75,
                        'bg-warning-100 text-warning-700': student.attendance >= 60 && student.attendance < 75,
                        'bg-danger-100 text-danger-700': student.attendance < 60,
                      })}>
                        {student.attendance}%
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className={cn('inline-block px-3 py-1 rounded-full text-sm font-semibold', {
                        'bg-success-100 text-success-700': student.cgpa >= 8.0,
                        'bg-blue-100 text-blue-700': student.cgpa >= 7.0 && student.cgpa < 8.0,
                        'bg-warning-100 text-warning-700': student.cgpa >= 6.0 && student.cgpa < 7.0,
                        'bg-danger-100 text-danger-700': student.cgpa < 6.0,
                      })}>
                        {student.cgpa.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn('px-3 py-1 rounded-full text-xs font-medium', {
                        'bg-success-100 text-success-700': student.attendance >= 75 && student.cgpa >= 7.0,
                        'bg-warning-100 text-warning-700': student.attendance < 75 || student.cgpa < 7.0,
                        'bg-danger-100 text-danger-700': student.attendance < 60 || student.cgpa < 6.0,
                      })}>
                        {student.attendance >= 75 && student.cgpa >= 7.0 ? 'Excellent' : student.attendance < 60 || student.cgpa < 6.0 ? 'At Risk' : 'Average'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Report */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Analytics Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-slate-900 mb-3">Key Findings</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• <span className="font-medium">{excellentCount} students</span> have excellent attendance (≥85%)</li>
                <li>• <span className="font-medium">{atRiskCount} students</span> are at risk with attendance below 60%</li>
                <li>• Average attendance across all students is <span className="font-medium">{avgAttendance}%</span></li>
                <li>• Average CGPA is <span className="font-medium">{avgCGPA}</span> out of 10</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-slate-900 mb-3">Recommendations</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• Monitor students with attendance below 60% closely</li>
                <li>• Provide additional support to at-risk students</li>
                <li>• Recognize and appreciate excellent performers</li>
                <li>• Schedule regular review sessions for improvement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
