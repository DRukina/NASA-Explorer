import React from 'react';
import { ExternalLink, Download } from 'lucide-react';
import type { ApodData } from '../../types/api';

interface ApodActionsProps {
  apod: ApodData;
}

export const ApodActions: React.FC<ApodActionsProps> = ({ apod }) => {
  const generateNasaUrl = (date: string) => {
    // Convert YYYY-MM-DD to YYMMDD format for NASA APOD URL
    const formattedDate = date.replace(/-/g, '').slice(2);
    return `https://apod.nasa.gov/apod/ap${formattedDate}.html`;
  };

  return (
    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-700">
      {apod.hdurl && (
        <a
          href={apod.hdurl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Download HD</span>
        </a>
      )}

      <a
        href={generateNasaUrl(apod.date)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-secondary flex items-center space-x-2"
      >
        <ExternalLink className="h-4 w-4" />
        <span>View on NASA</span>
      </a>
    </div>
  );
};
