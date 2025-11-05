import { SAMPLE_STUDENTS } from '@/lib/sample-data';

export function AttendanceChart() {
  const goodAttendance = SAMPLE_STUDENTS.filter(s => s.attendance >= 75).length;
  const lowAttendance = SAMPLE_STUDENTS.filter(s => s.attendance >= 60 && s.attendance < 75).length;
  const atRisk = SAMPLE_STUDENTS.filter(s => s.attendance < 60).length;
  const total = goodAttendance + lowAttendance + atRisk;

  const data = [
    { name: 'Good (≥75%)', value: goodAttendance, percent: (goodAttendance / total) * 100, color: '#16a34a' },
    { name: 'Low (60-75%)', value: lowAttendance, percent: (lowAttendance / total) * 100, color: '#f59e0b' },
    { name: 'At Risk (<60%)', value: atRisk, percent: (atRisk / total) * 100, color: '#dc2626' },
  ];

  // Calculate SVG pie chart path
  let currentAngle = 0;
  const slices = data.map((item) => {
    const sliceAngle = (item.percent / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;

    const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
    const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
    const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
    const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

    const largeArc = sliceAngle > 180 ? 1 : 0;
    const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return { ...item, pathData };
  });

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
      <h3 className="font-semibold text-slate-900 mb-6">Attendance Distribution</h3>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Pie Chart SVG */}
        <div className="flex-1 flex items-center justify-center">
          <svg width="200" height="200" viewBox="0 0 100 100" className="max-w-xs">
            {slices.map((slice, index) => (
              <path
                key={index}
                d={slice.pathData}
                fill={slice.color}
                stroke="white"
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{item.name}</p>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
              <p className="text-sm font-bold text-slate-900 min-w-fit">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
