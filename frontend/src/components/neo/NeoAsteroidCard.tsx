import React from 'react';
import { AlertTriangle, Calendar, Ruler, Zap } from 'lucide-react';
import {
  getAsteroidSize,
  getAsteroidDistance,
  getAsteroidVelocity,
} from '../../utils/neo';
import type { NearEarthObject } from '../../types/api';

interface NeoAsteroidCardProps {
  asteroid: NearEarthObject & { approachDate: string };
}

export const NeoAsteroidCard: React.FC<NeoAsteroidCardProps> = ({
  asteroid,
}) => {
  const avgSize = getAsteroidSize(asteroid);
  const distance = getAsteroidDistance(asteroid);
  const velocity = getAsteroidVelocity(asteroid);

  return (
    <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 border border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-white">{asteroid.name}</h4>
        {asteroid.is_potentially_hazardous_asteroid && (
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Hazardous
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2 text-gray-300">
          <Calendar className="h-4 w-4" />
          <span>Approach: {asteroid.approachDate}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Ruler className="h-4 w-4" />
          <span>Size: {avgSize.toFixed(2)} km</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Zap className="h-4 w-4" />
          <span>Speed: {velocity.toLocaleString()} km/h</span>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-400">
        Miss Distance: {(distance / 1000000).toFixed(2)} million km
      </div>
    </div>
  );
};
