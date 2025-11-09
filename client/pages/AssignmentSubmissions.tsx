import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  MessageCircle,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { SAMPLE_STUDENTS, SAMPLE_ASSIGNMENTS } from "@/lib/sample-data";
import { useParams, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Mock submission data
const generateSubmissionData = (assignment: (typeof SAMPLE_ASSIGNMENTS)[0]) => {
  const studentsInBatch = SAMPLE_STUDENTS.filter(s => assignment.batch.includes(s.batch));
  const submissions: any[] = [];
  const dueDate = new Date(assignment.dueDate);

  studentsInBatch.forEach((student, index) => {
    // Determine status based on index for demo data
    const totalSubmitted = assignment.submitted;
    const totalOverdue = assignment.overdue;
    
    let status: "submitted" | "overdue" | "pending";
    let submissionDate: string | null = null;

    if (index < totalSubmitted) {
      status = "submitted";
      submissionDate = new Date(dueDate.getTime() - Math.random() * 2 * 24 * 60 * 60 * 1000).toLocaleDateString();
    } else if (index < totalSubmitted + totalOverdue) {
      status = "overdue";
      submissionDate = new Date(dueDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000).toLocaleDateString();
    } else {
      status = "pending";
    }

    submissions.push({
      studentId: student.id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      batch: student.batch,
      email: student.email,
      submissionDate: submissionDate,
      submissionTime: submissionDate ? `${Math.floor(Math.random() * 23)}:${String(Math.floor(Math.random() * 59)).padStart(2, "0")}` : null,
      status: status,
      grade: null, // Start ungraded
      feedback: "", // Start with no feedback
      fileName: status !== 'pending' ? `assignment_${student.id}.pdf` : null,
    });
  });

  return submissions;
};

export default function AssignmentSubmissions() {
  const { assignmentId } = useParams();
  const assignment =
    SAMPLE_ASSIGNMENTS.find((a) => a.id === assignmentId) ||
    SAMPLE_ASSIGNMENTS[0];
  
  const submissions = useMemo(() => generateSubmissionData(assignment), [assignmentId, assignment]);

  const [filterStatus, setFilterStatus] = useState<
    "all" | "submitted" | "overdue" | "pending"
  >("all");

  // State for grades and feedback
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});

  const filteredSubmissions = submissions.filter((sub) => {
    if (filterStatus === "all") return true;
    // Special case: "submitted" tab should also show "overdue" submissions
    if (filterStatus === "submitted") return sub.status === "submitted" || sub.status === "overdue";
    return sub.status === filterStatus;
  });

  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return {
          bg: "bg-success-100",
          text: "text-success-700",
          label: "Submitted",
        };
      case "overdue":
        return {
          bg: "bg-warning-100",
          text: "text-warning-700",
          label: "Overdue",
        };
      case "pending":
        return { bg: "bg-slate-100", text: "text-slate-700", label: "Pending" };
      default:
        return { bg: "bg-slate-100", text: "text-slate-700", label: "Unknown" };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <CheckCircle className="h-5 w-5 text-success-600" />;
      case "overdue":
        return <AlertCircle className="h-5 w-5 text-warning-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-slate-400" />;
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/assignments"
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Assignments
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">
            Assignment Submissions
          </h1>
          <p className="text-slate-600 mt-1">{assignment.title}</p>
        </div>

        {/* Assignment Info */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-slate-600">Subject</p>
              <p className="text-lg font-semibold text-slate-900">
                {assignment.subject}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Batch</p>
              <p className="text-lg font-semibold text-slate-900">
                {assignment.batch}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Due Date</p>
              <p className="text-lg font-semibold text-slate-900">
                {new Date(assignment.dueDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Marks</p>
              <p className="text-lg font-semibold text-slate-900">
                {assignment.totalMarks}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <Tabs
          value={filterStatus}
          onValueChange={(value) =>
            setFilterStatus(value as "all" | "submitted" | "overdue" | "pending")
          }
          className="mb-6"
        >
          <TabsList>
            <TabsTrigger value="all">All ({submissions.length})</TabsTrigger>
            <TabsTrigger value="submitted">Submitted ({assignment.submitted + assignment.overdue})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({assignment.pending})</TabsTrigger>
            <TabsTrigger value="overdue">Overdue ({assignment.overdue})</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredSubmissions.length > 0 ? (
            filteredSubmissions.map((submission, index) => {
              const badgeInfo = getStatusBadge(submission.status);
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Student Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center font-medium text-primary-600 text-sm flex-shrink-0">
                        {submission.studentName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold text-slate-900">
                            {submission.studentName}
                          </p>
                          <span
                            className={cn(
                              "px-2 py-1 rounded text-xs font-medium",
                              badgeInfo.bg,
                              badgeInfo.text,
                            )}
                          >
                            {badgeInfo.label}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">
                          {submission.rollNumber} • {submission.batch}
                        </p>
                        <p className="text-sm text-slate-500">
                          {submission.email}
                        </p>

                        {/* Submission Details */}
                        {submission.status !== "pending" && (
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <p className="text-xs text-slate-600">
                              <span className="font-medium">Submitted:</span>{" "}
                              {submission.submissionDate} at{" "}
                              {submission.submissionTime}
                            </p>
                            {submission.grade && (
                              <p className="text-xs text-slate-600 mt-1">
                                <span className="font-medium">Grade:</span>{" "}
                                {submission.grade}/{assignment.totalMarks}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {submission.status !== "pending" && (
                        <button
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="h-5 w-5 text-slate-600" />
                        </button>
                      )}
                      <button
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Send Message"
                      >
                        <MessageCircle className="h-5 w-5 text-slate-600" />
                      </button>
                    </div>
                  </div>

                  {/* Grading Form */}
                  {(submission.status === "submitted" ||
                    submission.status === "overdue") && (
                    <form
                      className="mt-4 pt-4 border-t border-slate-200 space-y-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const grade = grades[submission.studentId] || "";
                        const feedback = feedbacks[submission.studentId] || "";
                        console.log({
                          studentId: submission.studentId,
                          grade,
                          feedback,
                        });
                        alert(
                          `Grade submitted for ${submission.studentName}: ${grade}`,
                        );
                      }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <Label htmlFor={`grade-${submission.studentId}`} className="text-xs font-medium">Grade</Label>
                          <Input
                            id={`grade-${submission.studentId}`}
                            type="text"
                            placeholder={`/ ${assignment.totalMarks}`}
                            value={grades[submission.studentId] || ""}
                            onChange={(e) => setGrades(prev => ({ ...prev, [submission.studentId]: e.target.value }))}
                            className="h-9 mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor={`feedback-${submission.studentId}`} className="text-xs font-medium">Feedback</Label>
                        <Textarea
                          id={`feedback-${submission.studentId}`}
                          placeholder="Provide feedback..."
                          rows={2}
                          value={feedbacks[submission.studentId] || ""}
                          onChange={(e) => setFeedbacks(prev => ({ ...prev, [submission.studentId]: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                      <Button type="submit" size="sm" className="bg-primary-600 hover:bg-primary-700">
                        Submit Grade
                      </Button>
                    </form>
                  )}

                  {/* Pending Action */}
                  {submission.status === "pending" && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-sm text-slate-600 mb-2">
                        No submission yet. Send a reminder?
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-primary-600"
                      >
                        Send Reminder Email
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <p className="text-slate-600">No submissions found</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}