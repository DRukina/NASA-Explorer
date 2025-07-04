import React from 'react';
import { NeoAsteroidCard } from './NeoAsteroidCard';
import type { NearEarthObject } from '../../types/api';

interface NeoAsteroidListProps {
  asteroids: Array<NearEarthObject & { approachDate: string }>;
  maxDisplay?: number;
}

export const NeoAsteroidList: React.FC<NeoAsteroidListProps> = ({
  asteroids,
  maxDisplay = 20,
}) => {
  const displayedAsteroids = asteroids.slice(0, maxDisplay);
  const hasMore = asteroids.length > maxDisplay;

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-white mb-4">
        Asteroid Details ({asteroids.length} objects)
      </h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {displayedAsteroids.map((asteroid) => (
          <NeoAsteroidCard key={asteroid.id} asteroid={asteroid} />
        ))}

        {hasMore && (
          <div className="text-center text-gray-400 py-4">
            Showing first {maxDisplay} of {asteroids.length} objects
          </div>
        )}
      </div>
    </div>
  );
};
