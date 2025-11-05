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

  const maxStudents = Math.max(...batchStats.map(s => s.students));
  const maxAttendance = 100;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
      <h3 className="font-semibold text-slate-900 mb-6">Batch-wise Statistics</h3>

      <div className="space-y-8">
        {/* Bar Chart */}
        <div>
          <div className="flex items-end gap-8 h-64 mb-4">
            {batchStats.map((stat, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="flex gap-2 h-full items-end w-full">
                  {/* Students Bar */}
                  <div className="flex-1 bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600"
                    style={{ height: `${(stat.students / maxStudents) * 100}%` }}
                    title={`Students: ${stat.students}`}
                  >
                    <span className="text-xs text-white font-bold flex items-center justify-center h-full">
                      {stat.students}
                    </span>
                  </div>

                  {/* Attendance Bar */}
                  <div className="flex-1 bg-green-500 rounded-t-lg transition-all hover:bg-green-600"
                    style={{ height: `${(stat.avgAttendance / maxAttendance) * 100}%` }}
                    title={`Attendance: ${stat.avgAttendance}%`}
                  >
                    <span className="text-xs text-white font-bold flex items-center justify-center h-full">
                      {stat.avgAttendance}%
                    </span>
                  </div>
                </div>
                <p className="text-sm font-semibold text-slate-900">{stat.batch}</p>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-slate-700">Students</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-slate-700">Avg Attendance %</span>
            </div>
          </div>
        </div>

        {/* Stats Table */}
        <div className="border-t border-slate-200 pt-4">
          <div className="grid grid-cols-3 gap-4">
            {batchStats.map((stat, index) => (
              <div key={index} className="bg-slate-50 rounded-lg p-4">
                <p className="text-lg font-bold text-slate-900">{stat.batch}</p>
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-slate-600"><span className="font-medium">Students:</span> {stat.students}</p>
                  <p className="text-sm text-slate-600"><span className="font-medium">Avg Attendance:</span> {stat.avgAttendance}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
