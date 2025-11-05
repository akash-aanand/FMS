export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  batch: string;
  email: string;
  phone: string;
  photo?: string;
  attendance: number;
  cgpa: number;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  priority: 'urgent' | 'important' | 'normal';
  category: 'academic' | 'administrative' | 'events';
  date: string;
}

export interface TimeSlot {
  id: string;
  day: string;
  time: string;
  subject: string;
  batch: string;
  room: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  batch: string;
  dueDate: string;
  totalMarks: number;
  submitted: number;
  pending: number;
  overdue: number;
  totalStudents: number;
}

// Sample Students
export const SAMPLE_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Arjun Sharma',
    rollNumber: 'CS001',
    batch: 'CS-A',
    email: 'arjun.sharma@college.edu',
    phone: '+91-9876543210',
    attendance: 92,
    cgpa: 8.5,
  },
  {
    id: '2',
    name: 'Priya Verma',
    rollNumber: 'CS002',
    batch: 'CS-A',
    email: 'priya.verma@college.edu',
    phone: '+91-9876543211',
    attendance: 88,
    cgpa: 8.2,
  },
  {
    id: '3',
    name: 'Rahul Singh',
    rollNumber: 'CS003',
    batch: 'CS-B',
    email: 'rahul.singh@college.edu',
    phone: '+91-9876543212',
    attendance: 65,
    cgpa: 7.1,
  },
  {
    id: '4',
    name: 'Neha Gupta',
    rollNumber: 'CS004',
    batch: 'CS-B',
    email: 'neha.gupta@college.edu',
    phone: '+91-9876543213',
    attendance: 78,
    cgpa: 7.8,
  },
  {
    id: '5',
    name: 'Amit Patel',
    rollNumber: 'CS005',
    batch: 'CS-C',
    email: 'amit.patel@college.edu',
    phone: '+91-9876543214',
    attendance: 55,
    cgpa: 6.5,
  },
];

// Sample Notices
export const SAMPLE_NOTICES: Notice[] = [
  {
    id: '1',
    title: 'Semester Exam Dates Announced',
    content: 'The semester examination schedule has been released. Please check the notice board for detailed dates.',
    priority: 'urgent',
    category: 'academic',
    date: '2024-11-05',
  },
  {
    id: '2',
    title: 'Assignment Submission Deadline Extended',
    content: 'The deadline for Data Structures assignment has been extended to November 10, 2024.',
    priority: 'important',
    category: 'academic',
    date: '2024-11-04',
  },
  {
    id: '3',
    title: 'Department Meeting on Friday',
    content: 'There will be a department meeting on Friday at 2:00 PM in Conference Room A.',
    priority: 'important',
    category: 'administrative',
    date: '2024-11-03',
  },
  {
    id: '4',
    title: 'Tech Symposium Registration Open',
    content: 'Annual tech symposium registration is now open. Students can register through the portal.',
    priority: 'normal',
    category: 'events',
    date: '2024-11-02',
  },
  {
    id: '5',
    title: 'Library Closure Notice',
    content: 'The library will be closed on November 8-9 for maintenance.',
    priority: 'normal',
    category: 'administrative',
    date: '2024-11-01',
  },
];

// Weekly Timetable for current week
export const SAMPLE_TIMETABLE: TimeSlot[] = [
  // Monday
  { id: '1', day: 'Monday', time: '09:00 - 10:00', subject: 'Data Structures', batch: 'CS-A', room: 'A101' },
  { id: '2', day: 'Monday', time: '10:00 - 11:00', subject: 'Web Development', batch: 'CS-B', room: 'B201' },
  { id: '3', day: 'Monday', time: '11:00 - 12:00', subject: 'Database Management', batch: 'CS-C', room: 'C301' },
  { id: '4', day: 'Monday', time: '14:00 - 15:00', subject: 'Data Structures Lab', batch: 'CS-A', room: 'Lab1' },
  
  // Tuesday
  { id: '5', day: 'Tuesday', time: '09:00 - 10:00', subject: 'Algorithms', batch: 'CS-B', room: 'B202' },
  { id: '6', day: 'Tuesday', time: '10:00 - 11:00', subject: 'Web Development', batch: 'CS-A', room: 'A102' },
  { id: '7', day: 'Tuesday', time: '11:00 - 12:00', subject: 'Operating Systems', batch: 'CS-C', room: 'C302' },
  { id: '8', day: 'Tuesday', time: '14:00 - 15:00', subject: 'Algorithms Lab', batch: 'CS-B', room: 'Lab2' },
  
  // Wednesday
  { id: '9', day: 'Wednesday', time: '09:00 - 10:00', subject: 'Database Management', batch: 'CS-A', room: 'A103' },
  { id: '10', day: 'Wednesday', time: '10:00 - 11:00', subject: 'Operating Systems', batch: 'CS-B', room: 'B203' },
  { id: '11', day: 'Wednesday', time: '11:00 - 12:00', subject: 'Web Development', batch: 'CS-C', room: 'C303' },
  { id: '12', day: 'Wednesday', time: '14:00 - 15:00', subject: 'Web Lab', batch: 'CS-C', room: 'Lab3' },
  
  // Thursday
  { id: '13', day: 'Thursday', time: '09:00 - 10:00', subject: 'Data Structures', batch: 'CS-B', room: 'B204' },
  { id: '14', day: 'Thursday', time: '10:00 - 11:00', subject: 'Algorithms', batch: 'CS-C', room: 'C304' },
  { id: '15', day: 'Thursday', time: '11:00 - 12:00', subject: 'Database Management', batch: 'CS-B', room: 'B204' },
  { id: '16', day: 'Thursday', time: '14:00 - 15:00', subject: 'Database Lab', batch: 'CS-A', room: 'Lab1' },
  
  // Friday
  { id: '17', day: 'Friday', time: '09:00 - 10:00', subject: 'Web Development', batch: 'CS-A', room: 'A104' },
  { id: '18', day: 'Friday', time: '10:00 - 11:00', subject: 'Operating Systems', batch: 'CS-A', room: 'A104' },
  { id: '19', day: 'Friday', time: '11:00 - 12:00', subject: 'Algorithms', batch: 'CS-A', room: 'A104' },
];

// Sample Assignments
export const SAMPLE_ASSIGNMENTS: Assignment[] = [
  {
    id: '1',
    title: 'Data Structures Implementation',
    subject: 'Data Structures',
    batch: 'CS-A',
    dueDate: '2024-11-10',
    totalMarks: 100,
    submitted: 22,
    pending: 3,
    overdue: 0,
    totalStudents: 25,
  },
  {
    id: '2',
    title: 'Web Application Project',
    subject: 'Web Development',
    batch: 'CS-B',
    dueDate: '2024-11-15',
    totalMarks: 150,
    submitted: 18,
    pending: 5,
    overdue: 2,
    totalStudents: 25,
  },
  {
    id: '3',
    title: 'Database Design Case Study',
    subject: 'Database Management',
    batch: 'CS-C',
    dueDate: '2024-11-12',
    totalMarks: 80,
    submitted: 24,
    pending: 1,
    overdue: 0,
    totalStudents: 25,
  },
];

export const SUBJECT_COLORS: Record<string, string> = {
  'Data Structures': 'bg-blue-100 text-blue-800 border-blue-300',
  'Web Development': 'bg-purple-100 text-purple-800 border-purple-300',
  'Database Management': 'bg-green-100 text-green-800 border-green-300',
  'Operating Systems': 'bg-orange-100 text-orange-800 border-orange-300',
  'Algorithms': 'bg-red-100 text-red-800 border-red-300',
  'Data Structures Lab': 'bg-indigo-100 text-indigo-800 border-indigo-300',
  'Algorithms Lab': 'bg-pink-100 text-pink-800 border-pink-300',
  'Web Lab': 'bg-cyan-100 text-cyan-800 border-cyan-300',
  'Database Lab': 'bg-yellow-100 text-yellow-800 border-yellow-300',
};
