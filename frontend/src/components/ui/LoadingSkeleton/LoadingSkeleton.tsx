import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'card';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}) => {
  const baseClasses = 'skeleton animate-pulse bg-gray-700 rounded';

  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 w-full';
      case 'circular':
        return 'rounded-full';
      case 'card':
        return 'h-48 w-full rounded-xl';
      default:
        return '';
    }
  };

  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${getVariantClasses()}`}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : '100%',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      style={style}
    />
  );
};

export const ApodSkeleton: React.FC = () => (
  <div className="card space-y-4">
    <LoadingSkeleton
      variant="rectangular"
      height="300px"
      className="rounded-lg"
    />
    <div className="space-y-3">
      <LoadingSkeleton variant="text" height="28px" width="80%" />
      <LoadingSkeleton variant="text" lines={3} />
      <div className="flex justify-between items-center">
        <LoadingSkeleton variant="text" width="120px" />
        <LoadingSkeleton
          variant="rectangular"
          width="100px"
          height="36px"
          className="rounded-lg"
        />
      </div>
    </div>
  </div>
);

export const NeoCardSkeleton: React.FC = () => (
  <div className="card space-y-3">
    <div className="flex justify-between items-start">
      <LoadingSkeleton variant="text" width="60%" height="24px" />
      <LoadingSkeleton
        variant="rectangular"
        width="80px"
        height="24px"
        className="rounded-full"
      />
    </div>
    <LoadingSkeleton variant="text" lines={2} />
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <LoadingSkeleton variant="text" width="50%" />
        <LoadingSkeleton variant="text" width="70%" />
      </div>
      <div className="space-y-2">
        <LoadingSkeleton variant="text" width="60%" />
        <LoadingSkeleton variant="text" width="80%" />
      </div>
    </div>
  </div>
);

export const ChartSkeleton: React.FC = () => (
  <div className="card">
    <div className="space-y-4">
      <LoadingSkeleton variant="text" width="40%" height="24px" />
      <LoadingSkeleton
        variant="rectangular"
        height="300px"
        className="rounded-lg"
      />
      <div className="flex justify-center space-x-4">
        <LoadingSkeleton
          variant="rectangular"
          width="80px"
          height="20px"
          className="rounded"
        />
        <LoadingSkeleton
          variant="rectangular"
          width="100px"
          height="20px"
          className="rounded"
        />
        <LoadingSkeleton
          variant="rectangular"
          width="90px"
          height="20px"
          className="rounded"
        />
      </div>
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="card">
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4 pb-2 border-b border-gray-700">
        <LoadingSkeleton variant="text" width="80%" />
        <LoadingSkeleton variant="text" width="60%" />
        <LoadingSkeleton variant="text" width="70%" />
        <LoadingSkeleton variant="text" width="50%" />
      </div>

      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="grid grid-cols-4 gap-4 py-2">
          <LoadingSkeleton variant="text" width="90%" />
          <LoadingSkeleton variant="text" width="70%" />
          <LoadingSkeleton variant="text" width="80%" />
          <LoadingSkeleton variant="text" width="60%" />
        </div>
      ))}
    </div>
  </div>
);
