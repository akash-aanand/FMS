import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { SAMPLE_STUDENTS } from '@/lib/sample-data';

export function AttendanceChart() {
  const goodAttendance = SAMPLE_STUDENTS.filter(s => s.attendance >= 75).length;
  const lowAttendance = SAMPLE_STUDENTS.filter(s => s.attendance >= 60 && s.attendance < 75).length;
  const atRisk = SAMPLE_STUDENTS.filter(s => s.attendance < 60).length;

  const data = [
    { name: 'Good (≥75%)', value: goodAttendance, color: '#16a34a' },
    { name: 'Low (60-75%)', value: lowAttendance, color: '#f59e0b' },
    { name: 'At Risk (<60%)', value: atRisk, color: '#dc2626' },
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
      <h3 className="font-semibold text-slate-900 mb-6">Attendance Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => `${value} students`}
            contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-6 grid grid-cols-3 gap-4">
        {data.map((item, index) => (
          <div key={index} className="text-center">
            <div className="flex justify-center mb-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
            </div>
            <p className="text-sm font-medium text-slate-700">{item.value}</p>
            <p className="text-xs text-slate-500">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
