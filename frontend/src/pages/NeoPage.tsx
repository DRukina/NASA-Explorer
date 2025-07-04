import React, { useState } from 'react';
import {
  useNeo,
  useNeoChartData,
  useFilteredAsteroids,
  useNeoStatistics,
} from '../hooks/useNeo';
import { PageLayout } from '../components/layout/PageLayout';
import {
  ChartSkeleton,
  NeoCardSkeleton,
} from '../components/ui/LoadingSkeleton';
import { ErrorDisplay } from '../components/ui/ErrorBoundary';
import { NeoStats } from '../components/neo/NeoStats';
import { NeoCharts } from '../components/neo/NeoCharts';
import { NeoFilterControls } from '../components/neo/NeoFilterControls';
import { NeoAsteroidList } from '../components/neo/NeoAsteroidList';
import type { FilterOptions } from '../types/api';

const NeoPage: React.FC = () => {
  const { data: neoData, isLoading, error, refetch } = useNeo();
  const chartData = useNeoChartData(neoData);
  const stats = useNeoStatistics(neoData);

  const [filters, setFilters] = useState<FilterOptions>({
    hazardous: undefined,
    sortBy: 'date',
    sortOrder: 'asc',
  });

  const filteredAsteroids = useFilteredAsteroids(neoData, filters);

  const pieData = stats
    ? [
        { name: 'Safe', value: stats.safe, color: '#10B981' },
        {
          name: 'Potentially Hazardous',
          value: stats.hazardous,
          color: '#EF4444',
        },
      ]
    : [];

  return (
    <PageLayout title="Near Earth Objects">
      {isLoading && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <NeoCardSkeleton key={i} />
            ))}
          </div>
          <ChartSkeleton />
        </div>
      )}

      {error && (
        <ErrorDisplay error={error.message} onRetry={() => refetch()} />
      )}

      {neoData && stats && (
        <div className="space-y-8">
          {/* Stats Section */}
          <NeoStats stats={stats} />

          {/* Charts Section */}
          <NeoCharts chartData={chartData} pieData={pieData} />

          {/* Filter Controls Section */}
          <NeoFilterControls filters={filters} onFiltersChange={setFilters} />

          {/* Asteroid List Section */}
          {filteredAsteroids && (
            <NeoAsteroidList asteroids={filteredAsteroids} />
          )}
        </div>
      )}
    </PageLayout>
  );
};

export default NeoPage;
