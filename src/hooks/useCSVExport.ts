import { useState } from 'react';
import { CSVService } from '../utils/csv/csvService';

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

export const useCSVExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportDonations = async (donations: DonationData[]) => {
    try {
      setIsExporting(true);
      setError(null);
      CSVService.exportDonationsCSV(donations);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export donations';
      setError(errorMessage);
      console.error('CSV export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const exportDonors = async (donors: DonorData[]) => {
    try {
      setIsExporting(true);
      setError(null);
      CSVService.exportDonorsCSV(donors);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export donors';
      setError(errorMessage);
      console.error('CSV export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const exportSummaryReport = async (donations: DonationData[]) => {
    try {
      setIsExporting(true);
      setError(null);
      CSVService.exportSummaryReport(donations);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export summary report';
      setError(errorMessage);
      console.error('CSV export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const exportMonthlyTrends = async (donations: DonationData[]) => {
    try {
      setIsExporting(true);
      setError(null);
      CSVService.exportMonthlyTrends(donations);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export monthly trends';
      setError(errorMessage);
      console.error('CSV export error:', err);
    } finally {
      setIsExporting(false);
    }
  };


  return {
    isExporting,
    error,
    exportDonations,
    exportDonors,
    exportSummaryReport,
    exportMonthlyTrends,
    clearError: () => setError(null)
  };
};





