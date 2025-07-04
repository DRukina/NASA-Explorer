import React from 'react';
import { useApod } from '../hooks/useApod';
import { PageLayout } from '../components/layout/PageLayout';
import { ApodSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorDisplay } from '../components/ui/ErrorBoundary';
import { ApodMedia } from '../components/apod/ApodMedia';
import { ApodContent } from '../components/apod/ApodContent';
import { ApodActions } from '../components/apod/ApodActions';

const ApodPage: React.FC = () => {
  const { data: apod, isLoading, error, refetch } = useApod();

  return (
    <PageLayout title="Astronomy Picture of the Day" maxWidth="4xl">
      {isLoading && <ApodSkeleton />}

      {error && (
        <ErrorDisplay error={error.message} onRetry={() => refetch()} />
      )}

      {apod && (
        <div className="card">
          {/* Media Section */}
          <div className="mb-6">
            <ApodMedia apod={apod} />
          </div>

          {/* Content Section */}
          <ApodContent apod={apod} />

          {/* Actions Section */}
          <ApodActions apod={apod} />
        </div>
      )}
    </PageLayout>
  );
};

export default ApodPage;
