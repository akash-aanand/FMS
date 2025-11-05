import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from '@/components/layout/Header';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center px-4">
        <div className="flex flex-col items-center justify-center max-w-md">
          <div className="text-6xl font-bold text-slate-300 mb-4">404</div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">
            Page Not Found
          </h1>
          <p className="text-slate-600 text-center mb-8">
            Sorry, we couldn't find the page you're looking for. The page might have been removed or you may have mistyped the URL.
          </p>
          <Button asChild className="bg-primary-600 hover:bg-primary-700 text-white">
            <Link to="/" className="flex items-center gap-2">
              Back to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
