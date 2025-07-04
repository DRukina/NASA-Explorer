import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { ApodData } from '../../types/api';

interface ApodMediaProps {
  apod: ApodData;
}

export const ApodMedia: React.FC<ApodMediaProps> = ({ apod }) => {
  if (apod.media_type === 'image') {
    return (
      <div className="relative group">
        <img
          src={apod.url}
          alt={apod.title}
          className="w-full h-auto rounded-lg shadow-lg"
          loading="lazy"
        />
        {apod.hdurl && (
          <a
            href={apod.hdurl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            title="View HD version"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="aspect-video">
      <iframe
        src={apod.url}
        title={apod.title}
        className="w-full h-full rounded-lg"
        allowFullScreen
      />
    </div>
  );
};
