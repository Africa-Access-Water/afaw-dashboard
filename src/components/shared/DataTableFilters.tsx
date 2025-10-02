import React from 'react';
import { Button, TextInput, Select, Badge } from 'flowbite-react';
import { IconSearch, IconFilter, IconX } from '@tabler/icons-react';

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface DataTableFiltersProps {
  filters: FilterConfig[];
  filterValues: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  onApplyFilters?: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  showActiveFilters?: boolean;
  showApplyButton?: boolean;
}

const DataTableFilters: React.FC<DataTableFiltersProps> = ({
  filters,
  filterValues,
  onFilterChange,
  onClearFilters,
  onApplyFilters,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  showActiveFilters = true,
  showApplyButton = false
}) => {
  const activeFilters = Object.entries(filterValues).filter(([_, value]) => 
    value !== '' && value !== null && value !== undefined
  );
  
  // Include search value in active filters count
  const hasActiveFilters = activeFilters.length > 0 || (searchValue && searchValue.trim() !== '');

  const getFilterDisplayValue = (key: string, value: any) => {
    const filter = filters.find(f => f.key === key);
    if (filter?.type === 'select') {
      const option = filter.options?.find(opt => opt.value === value);
      return option?.label || value;
    }
    return value;
  };

  return (
    <div className="space-y-4">
      {/* Search and Clear Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <TextInput
            icon={IconSearch}
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2">
          {showApplyButton && onApplyFilters && (
            <Button
              size="sm"
              color="blue"
              onClick={onApplyFilters}
              className="flex items-center gap-2"
            >
              <IconSearch size={16} />
              Apply Filters
            </Button>
          )}
          {hasActiveFilters && (
            <Button
              size="sm"
              color="light"
              onClick={onClearFilters}
              className="flex items-center gap-2"
            >
              <IconX size={16} />
              Clear Filters ({activeFilters.length + (searchValue && searchValue.trim() !== '' ? 1 : 0)})
            </Button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filters.map((filter) => (
          <div key={filter.key} className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {filter.label}
            </label>
            
            {filter.type === 'text' && (
              <TextInput
                placeholder={filter.placeholder || `Filter by ${filter.label.toLowerCase()}`}
                value={filterValues[filter.key] || ''}
                onChange={(e) => onFilterChange(filter.key, e.target.value)}
                className="w-full"
              />
            )}
            
            {filter.type === 'select' && (
              <Select
                value={filterValues[filter.key] || ''}
                onChange={(e) => onFilterChange(filter.key, e.target.value)}
                className="w-full"
              >
                <option value="">All {filter.label}</option>
                {filter.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
            
            {filter.type === 'date' && (
              <TextInput
                type="date"
                value={filterValues[filter.key] || ''}
                onChange={(e) => onFilterChange(filter.key, e.target.value)}
                className="w-full"
              />
            )}
            
            {filter.type === 'number' && (
              <TextInput
                type="number"
                placeholder={filter.placeholder || `Filter by ${filter.label.toLowerCase()}`}
                value={filterValues[filter.key] || ''}
                onChange={(e) => onFilterChange(filter.key, e.target.value)}
                className="w-full"
              />
            )}
          </div>
        ))}
      </div>

      {/* Active Filters Display */}
      {showActiveFilters && activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <IconFilter size={16} />
            Active filters:
          </span>
          {activeFilters.map(([key, value]) => (
            <Badge
              key={key}
              color="blue"
              className="flex items-center gap-1"
            >
              {filters.find(f => f.key === key)?.label}: {getFilterDisplayValue(key, value)}
              <button
                onClick={() => onFilterChange(key, '')}
                className="ml-1 hover:text-red-500"
              >
                <IconX size={12} />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataTableFilters;
