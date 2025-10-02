import React from 'react';
import { Button, Dropdown } from 'flowbite-react';
import { useCSVExport } from '../../hooks/useCSVExport';

interface DonationData {
  id: number;
  name: string;
  email: string;
  amount: number;
  message?: string;
  created_at: string;
  method: string;
  transaction_id?: string;
}

interface DonorData {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  total_donated: number;
  frequency: string;
  last_donation: string;
}

interface CSVExportButtonProps {
  donations: DonationData[];
  donors?: DonorData[];
  variant?: 'donations' | 'donors' | 'summary' | 'monthly' | 'all';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const CSVExportButton: React.FC<CSVExportButtonProps> = ({
  donations,
  donors = [],
  variant = 'donations',
  size = 'sm',
  className = ''
}) => {
  const { isExporting, error, exportDonations, exportDonors, exportSummaryReport, exportMonthlyTrends } = useCSVExport();

  const handleExport = async (type: string) => {
    switch (type) {
      case 'donations':
        await exportDonations(donations);
        break;
      case 'donors':
        await exportDonors(donors);
        break;
      case 'summary':
        await exportSummaryReport(donations);
        break;
      case 'monthly':
        await exportMonthlyTrends(donations);
        break;
    }
  };

  if (variant === 'all') {
    return (
      <div className="relative">
        <Dropdown
          label={
            <div className="flex items-center gap-2">
              {isExporting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              <span>{isExporting ? 'Exporting...' : 'Export Data'}</span>
            </div>
          }
          size={size}
          className={className}
          disabled={isExporting}
        >
          <Dropdown.Item onClick={() => handleExport('donations')}>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Donations
            </div>
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleExport('donors')}>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Export Donors
            </div>
          </Dropdown.Item>
        </Dropdown>
        
        {error && (
          <div className="absolute top-full left-0 mt-1 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-xs whitespace-nowrap z-10">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        onClick={() => handleExport(variant)}
        disabled={isExporting}
        size={size}
        className={`${className} ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
        color="green"
      >
        {isExporting ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Exporting...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>
              {variant === 'donations' && 'Export Donations'}
              {variant === 'donors' && 'Export Donors'}
              {variant === 'summary' && 'Summary Report'}
              {variant === 'monthly' && 'Monthly Trends'}
            </span>
          </div>
        )}
      </Button>
      
      {error && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-xs whitespace-nowrap z-10">
          {error}
        </div>
      )}
    </div>
  );
};

export default CSVExportButton;





