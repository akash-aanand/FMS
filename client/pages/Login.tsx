import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      // --- FIX: Check for the specific demo email and any password ---
      if (
        credentials.email === 'teacher@college.edu' &&
        credentials.password
      ) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', credentials.email);
        navigate('/');
      } else if (!credentials.email || !credentials.password) {
        setError('Please enter both email and password');
      } else {
        setError('Invalid email. Please use the demo credentials.');
      }
      // --- END FIX ---
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-600 p-3 rounded-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Faculty Management</h1>
          <p className="text-slate-400">Student Attendance & Assignment System</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Welcome Back</h2>

          {error && (
            <div className="mb-4 p-4 bg-danger-50 border border-danger-200 rounded-lg">
              <p className="text-danger-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="h-10"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="h-10"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white h-10 mt-6"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-600 text-center mb-3">Demo Credentials</p>
            <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1">
              <p className="text-slate-700"><span className="font-semibold">Email:</span> teacher@college.edu</p>
              <p className="text-slate-700"><span className="font-semibold">Password:</span> any password</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-400 text-sm mt-6">
          © 2024 Faculty Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
}