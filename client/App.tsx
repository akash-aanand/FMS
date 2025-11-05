import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Placeholder from "./pages/Placeholder";
import Students from "./pages/Students";
import Assignments from "./pages/Assignments";
import CreateAssignment from "./pages/CreateAssignment";
import AssignmentSubmissions from "./pages/AssignmentSubmissions";
import Attendance from "./pages/Attendance";
import TakeAttendance from "./pages/TakeAttendance";
import Notices from "./pages/Notices";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />

            {/* Students Routes */}
            <Route path="/students" element={<Students />} />
            <Route path="/students/:id" element={<Placeholder title="Student Profile" feature="studentProfile" />} />

            {/* Assignment Routes */}
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/assignments/create" element={<CreateAssignment />} />
          <Route path="/assignments/:assignmentId/submissions" element={<AssignmentSubmissions />} />
          <Route path="/assignments/:id" element={<Placeholder title="Assignment Details" feature="assignmentDetails" />} />

            {/* Attendance Routes */}
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/attendance/new" element={<TakeAttendance />} />

            {/* Analytics Route */}
            <Route path="/analytics" element={<Placeholder title="Attendance Analytics Dashboard" feature="analytics" />} />

            {/* Other Routes */}
            <Route path="/timetable" element={<Placeholder title="Weekly Timetable" feature="timetable" />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/submissions" element={<Placeholder title="Submission Queue" feature="submissions" />} />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
