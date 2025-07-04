import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface NeoStatsProps {
  stats: {
    total: number;
    hazardous: number;
    safe: number;
    averageSize: number;
  };
}

export const NeoStats: React.FC<NeoStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="card text-center">
        <div className="text-3xl font-bold text-cosmic-blue mb-2">
          {stats.total}
        </div>
        <div className="text-gray-300">Total Objects</div>
      </div>

      <div className="card text-center">
        <div className="text-3xl font-bold text-red-500 mb-2">
          {stats.hazardous}
        </div>
        <div className="text-gray-300 flex items-center justify-center gap-1">
          <AlertTriangle className="h-4 w-4" />
          Potentially Hazardous
        </div>
      </div>

      <div className="card text-center">
        <div className="text-3xl font-bold text-green-500 mb-2">
          {stats.safe}
        </div>
        <div className="text-gray-300">Safe Objects</div>
      </div>

      <div className="card text-center">
        <div className="text-3xl font-bold text-stellar-gold mb-2">
          {stats.averageSize.toFixed(2)}
        </div>
        <div className="text-gray-300">Avg Size (km)</div>
      </div>
    </div>
  );
};
