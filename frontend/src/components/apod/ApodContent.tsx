import React from 'react';
import { Calendar } from 'lucide-react';
import { formatDisplayDate } from '../../utils/date';
import type { ApodData } from '../../types/api';

interface ApodContentProps {
  apod: ApodData;
}

export const ApodContent: React.FC<ApodContentProps> = ({ apod }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {apod.title}
        </h1>
        <div className="flex items-center space-x-2 text-gray-400">
          <Calendar className="h-4 w-4" />
          <span>{formatDisplayDate(apod.date)}</span>
        </div>
      </div>

      {apod.copyright && (
        <p className="text-sm text-gray-400">© {apod.copyright}</p>
      )}

      <div className="prose prose-invert max-w-none">
        <p className="text-gray-300 leading-relaxed">{apod.explanation}</p>
      </div>
    </div>
  );
};
