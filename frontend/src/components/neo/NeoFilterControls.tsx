import React from 'react';
import { FilterDropdown } from '../ui/FilterDropdown';
import type { FilterOptions } from '../../types/api';

interface NeoFilterControlsProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export const NeoFilterControls: React.FC<NeoFilterControlsProps> = ({
  filters,
  onFiltersChange,
}) => {
  const handleFilterChange = (
    key: keyof FilterOptions,
    value: FilterOptions[keyof FilterOptions]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="card relative z-10">
      <h3 className="text-xl font-semibold text-white mb-4">Filter & Sort</h3>
      <div className="flex flex-wrap gap-4">
        <FilterDropdown
          label="Filter by hazard"
          value={
            filters.hazardous === undefined
              ? 'all'
              : filters.hazardous.toString()
          }
          onChange={(e) =>
            handleFilterChange(
              'hazardous',
              e.target.value === 'all' ? undefined : e.target.value === 'true'
            )
          }
          options={[
            { value: 'all', label: 'All Objects' },
            { value: 'true', label: 'Potentially Hazardous' },
            { value: 'false', label: 'Safe Objects' },
          ]}
        />

        <FilterDropdown
          label="Sort by"
          value={filters.sortBy || 'date'}
          onChange={(e) =>
            handleFilterChange(
              'sortBy',
              e.target.value as FilterOptions['sortBy']
            )
          }
          options={[
            { value: 'date', label: 'Sort by Date' },
            { value: 'size', label: 'Sort by Size' },
            { value: 'distance', label: 'Sort by Distance' },
            { value: 'name', label: 'Sort by Name' },
          ]}
        />

        <FilterDropdown
          label="Sort order"
          value={filters.sortOrder || 'asc'}
          onChange={(e) =>
            handleFilterChange(
              'sortOrder',
              e.target.value as FilterOptions['sortOrder']
            )
          }
          options={[
            { value: 'asc', label: 'Ascending' },
            { value: 'desc', label: 'Descending' },
          ]}
        />
      </div>
    </div>
  );
};
