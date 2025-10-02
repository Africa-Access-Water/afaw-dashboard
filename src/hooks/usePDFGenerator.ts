import { useState } from 'react';
import { PDFService } from '../utils/pdf/pdfService';

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

interface OrganizationInfo {
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
}

export const usePDFGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateDonationReceipt = async (
    donation: DonationData,
    organizationInfo?: OrganizationInfo
  ) => {
    try {
      setIsGenerating(true);
      setError(null);
      
      await PDFService.generateDonationReceipt(donation, organizationInfo);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate PDF';
      setError(errorMessage);
      console.error('PDF generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSimpleReceipt = (
    donation: DonationData,
    organizationInfo?: OrganizationInfo
  ) => {
    try {
      setError(null);
      PDFService.generateSimpleReceipt(donation, organizationInfo);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate PDF';
      setError(errorMessage);
      console.error('PDF generation error:', err);
    }
  };


  return {
    isGenerating,
    error,
    generateDonationReceipt,
    generateSimpleReceipt,
    clearError: () => setError(null)
  };
};

