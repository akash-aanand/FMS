import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Placeholder from "./pages/Placeholder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          {/* Students Routes */}
          <Route path="/students" element={<Placeholder title="Students List & Search" feature="students" />} />
          <Route path="/students/:id" element={<Placeholder title="Student Profile" feature="studentProfile" />} />

          {/* Assignment Routes */}
          <Route path="/assignments" element={<Placeholder title="Assignment Tracking Dashboard" feature="assignments" />} />
          <Route path="/assignments/create" element={<Placeholder title="Create Assignment" feature="createAssignment" />} />
          <Route path="/assignments/:id" element={<Placeholder title="Assignment Details" feature="assignmentDetails" />} />

          {/* Attendance Routes */}
          <Route path="/attendance" element={<Placeholder title="Attendance Analytics" feature="attendance" />} />
          <Route path="/attendance/new" element={<Placeholder title="Take Attendance" feature="takeAttendance" />} />

          {/* Analytics Route */}
          <Route path="/analytics" element={<Placeholder title="Attendance Analytics Dashboard" feature="analytics" />} />

          {/* Other Routes */}
          <Route path="/timetable" element={<Placeholder title="Weekly Timetable" feature="timetable" />} />
          <Route path="/notices" element={<Placeholder title="All Notices" feature="notices" />} />
          <Route path="/submissions" element={<Placeholder title="Submission Queue" feature="submissions" />} />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
