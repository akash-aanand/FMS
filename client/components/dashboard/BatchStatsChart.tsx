import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SAMPLE_STUDENTS } from '@/lib/sample-data';

export function BatchStatsChart() {
  const batchStats = [
    {
      batch: 'CS-A',
      students: SAMPLE_STUDENTS.filter(s => s.batch === 'CS-A').length,
      avgAttendance: Math.round(
        SAMPLE_STUDENTS.filter(s => s.batch === 'CS-A').reduce((sum, s) => sum + s.attendance, 0) /
        SAMPLE_STUDENTS.filter(s => s.batch === 'CS-A').length
      ),
    },
    {
      batch: 'CS-B',
      students: SAMPLE_STUDENTS.filter(s => s.batch === 'CS-B').length,
      avgAttendance: Math.round(
        SAMPLE_STUDENTS.filter(s => s.batch === 'CS-B').reduce((sum, s) => sum + s.attendance, 0) /
        SAMPLE_STUDENTS.filter(s => s.batch === 'CS-B').length
      ),
    },
    {
      batch: 'CS-C',
      students: SAMPLE_STUDENTS.filter(s => s.batch === 'CS-C').length,
      avgAttendance: Math.round(
        SAMPLE_STUDENTS.filter(s => s.batch === 'CS-C').reduce((sum, s) => sum + s.attendance, 0) /
        SAMPLE_STUDENTS.filter(s => s.batch === 'CS-C').length
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
      <h3 className="font-semibold text-slate-900 mb-6">Batch-wise Statistics</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={batchStats}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="batch" />
          <YAxis />
          <Tooltip 
            contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
          />
          <Legend />
          <Bar dataKey="students" fill="#3b82f6" name="Total Students" />
          <Bar dataKey="avgAttendance" fill="#10b981" name="Avg Attendance %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
