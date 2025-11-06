import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Upload, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CreateAssignment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    batches: [] as string[],
    dueDate: '',
    dueTime: '',
    totalMarks: '',
    assignmentType: '',
    difficultyLevel: '',
    instructions: '',
    enableLateSubmission: false,
    latePenalty: '',
    status: 'published' as 'draft' | 'published' | 'scheduled',
    scheduledDate: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState(false);

  const BATCHES = ['CS-A', 'CS-B', 'CS-C', 'All'];
  const ASSIGNMENT_TYPES = ['Individual', 'Group', 'Lab', 'Project'];
  const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'];
  const SUBJECTS = ['Data Structures', 'Web Development', 'Database Management', 'Operating Systems', 'Algorithms'];

  const handleBatchToggle = (batch: string) => {
    setFormData(prev => ({
      ...prev,
      batches: prev.batches.includes(batch)
        ? prev.batches.filter(b => b !== batch)
        : [...prev.batches, batch]
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { ...formData, files: uploadedFiles });
    alert(`Assignment ${formData.status === 'draft' ? 'saved as draft' : formData.status === 'scheduled' ? 'scheduled' : 'published'} successfully!`);
    navigate('/assignments');
  };

  return (
    <MainLayout>
      <div className="px-6 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Link to="/assignments" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Assignments
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Create New Assignment</h1>
        </div>

        {/* Tabs */}
        <Tabs value={preview ? 'preview' : 'edit'} onValueChange={v => setPreview(v === 'preview')} className="bg-white rounded-lg border border-slate-200">
          <TabsList className="border-b border-slate-200 bg-slate-50 w-full justify-start rounded-none px-6 py-0">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          {/* Edit Tab */}
          <TabsContent value="edit" className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Assignment Details Section */}
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Assignment Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium text-slate-700">Assignment Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Quantum Mechanics Problem Set 1"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-slate-700">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed instructions, grading criteria, and any other relevant information..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Target Audience & Schedule Section */}
              <div className="border-t border-slate-200 pt-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Target Audience & Schedule</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 block mb-3">Assign to Batch/Class *</Label>
                    <div className="flex flex-wrap gap-3">
                      {BATCHES.map(batch => (
                        <label key={batch} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={formData.batches.includes(batch)}
                            onCheckedChange={() => handleBatchToggle(batch)}
                          />
                          <span className="text-sm text-slate-700">{batch}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-sm font-medium text-slate-700">Subject *</Label>
                    <Select value={formData.subject} onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}>
                      <SelectTrigger id="subject" className="mt-1">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="dueDate" className="text-sm font-medium text-slate-700">Due Date *</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dueTime" className="text-sm font-medium text-slate-700">Due Time</Label>
                      <Input
                        id="dueTime"
                        type="time"
                        value={formData.dueTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, dueTime: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="totalMarks" className="text-sm font-medium text-slate-700">Total Marks *</Label>
                      <Input
                        id="totalMarks"
                        type="number"
                        placeholder="100"
                        value={formData.totalMarks}
                        onChange={(e) => setFormData(prev => ({ ...prev, totalMarks: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Assignment Type & Difficulty */}
              <div className="border-t border-slate-200 pt-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Assignment Type & Difficulty</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type" className="text-sm font-medium text-slate-700">Assignment Type</Label>
                    <Select value={formData.assignmentType} onValueChange={(value) => setFormData(prev => ({ ...prev, assignmentType: value }))}>
                      <SelectTrigger id="type" className="mt-1">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {ASSIGNMENT_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="difficulty" className="text-sm font-medium text-slate-700">Difficulty Level</Label>
                    <Select value={formData.difficultyLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, difficultyLevel: value }))}>
                      <SelectTrigger id="difficulty" className="mt-1">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {DIFFICULTY_LEVELS.map(level => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Supporting Materials */}
              <div className="border-t border-slate-200 pt-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Supporting Materials</h2>
                
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="fileInput"
                  />
                  <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center">
                    <Upload className="h-12 w-12 text-slate-400 mb-2" />
                    <p className="text-slate-600 text-center">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-500 mt-1">PDF, DOCX, PPTX, or ZIP (MAX. 25MB)</p>
                  </label>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                        <span className="text-sm text-slate-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                          className="text-danger-600 hover:text-danger-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="border-t border-slate-200 pt-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Additional Instructions</h2>
                <Textarea
                  placeholder="Any additional instructions for students..."
                  rows={3}
                  value={formData.instructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                />
              </div>

              {/* Late Submission */}
              <div className="border-t border-slate-200 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Enable Late Submission</Label>
                    <p className="text-xs text-slate-500 mt-1">Allow students to submit after the due date with penalty</p>
                  </div>
                  <Switch
                    checked={formData.enableLateSubmission}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enableLateSubmission: checked }))}
                  />
                </div>

                {formData.enableLateSubmission && (
                  <div className="mt-4">
                    <Label htmlFor="penalty" className="text-sm font-medium text-slate-700">Late Penalty (%)</Label>
                    <Input
                      id="penalty"
                      type="number"
                      placeholder="10"
                      value={formData.latePenalty}
                      onChange={(e) => setFormData(prev => ({ ...prev, latePenalty: e.target.value }))}
                      className="mt-1 max-w-xs"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="border-t border-slate-200 pt-6 flex gap-3 justify-end">
                <Button variant="outline">Cancel</Button>
                <Button variant="outline">Save as Draft</Button>
                <Button variant="outline" className="text-primary-600">Schedule for Later</Button>
                <Button className="bg-success-600 hover:bg-success-700 text-white">Publish Assignment</Button>
              </div>
            </form>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-slate-50 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{formData.title || 'Assignment Title'}</h2>
                <p className="text-slate-600 mb-4">{formData.subject || 'Subject'} • {formData.batches.join(', ') || 'Batches'}</p>
                <p className="text-slate-700">{formData.description || 'Assignment description will appear here'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600">Due Date</p>
                  <p className="text-lg font-semibold text-slate-900">{formData.dueDate || 'Not set'}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600">Total Marks</p>
                  <p className="text-lg font-semibold text-slate-900">{formData.totalMarks || '0'}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
