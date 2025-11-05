import { ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SAMPLE_TIMETABLE, SUBJECT_COLORS, TimeSlot } from '@/lib/sample-data';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export function WeeklyTimetable() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const isTodayInWeek = DAYS_ORDER.includes(today);

  const getTodayClasses = () => {
    return SAMPLE_TIMETABLE.filter(slot => slot.day === today);
  };

  const getColor = (subject: string) => {
    return SUBJECT_COLORS[subject] || 'bg-slate-100 text-slate-800 border-slate-300';
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">Weekly Timetable</h3>
          <p className="text-xs text-slate-500 mt-1">Current week schedule</p>
        </div>
        <Link to="/timetable" className="text-primary-600 hover:text-primary-700">
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="p-6">
        {isTodayInWeek ? (
          <div>
            <div className="mb-4">
              <p className="text-sm font-medium text-slate-700 mb-2">Today's Classes</p>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-600">{today}</span>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              {getTodayClasses().length > 0 ? (
                getTodayClasses().map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{slot.subject}</p>
                          <p className="text-xs text-slate-500 mt-1">{slot.time}</p>
                        </div>
                        <span className={cn('text-xs font-medium px-2 py-1 rounded border', getColor(slot.subject))}>
                          {slot.batch}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-2">Room: {slot.room}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-slate-500">No classes scheduled for today</p>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 pt-4">
              <p className="text-sm font-medium text-slate-700 mb-3">Upcoming This Week</p>
              <div className="space-y-2">
                {SAMPLE_TIMETABLE
                  .filter(slot => DAYS_ORDER.indexOf(slot.day) > DAYS_ORDER.indexOf(today))
                  .slice(0, 3)
                  .map((slot) => (
                    <div key={slot.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{slot.subject}</p>
                        <p className="text-xs text-slate-500">{slot.day} • {slot.time}</p>
                      </div>
                      <span className={cn('text-xs font-medium px-2 py-1 rounded border', getColor(slot.subject))}>
                        {slot.batch}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-slate-500">No classes this weekend</p>
          </div>
        )}

        <Button variant="outline" className="w-full mt-4" asChild>
          <Link to="/timetable">View Full Week Schedule</Link>
        </Button>
      </div>
    </div>
  );
}
