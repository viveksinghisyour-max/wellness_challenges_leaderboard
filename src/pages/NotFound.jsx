import React from 'react';
import { AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFound({ onGoHome }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-500 max-w-sm mb-6">
        The wellness view you are looking for does not exist or has been moved.
      </p>
      <Button variant="primary" onClick={onGoHome}>
        Return to Dashboard
      </Button>
    </div>
  );
}
