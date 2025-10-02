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
  website?: string;
  regNumber?: string;
}

import { API_BASE_URL } from '../../config';

/**
 * Core PDF API functions
 */
export const generateDonationReceipt = async (
  donation: DonationData,
  organizationInfo?: OrganizationInfo
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pdf/download-receipt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...donation, organizationInfo }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const pdfBlob = await response.blob();
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;

    const date = new Date(donation.created_at).toISOString().split('T')[0];
    link.download = `donation-receipt-${donation.id}-${date}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF from API:', error);
    throw new Error('Failed to generate PDF receipt from server');
  }
};

export const generateDonationReceiptBlob = async (
  donation: DonationData,
  organizationInfo?: OrganizationInfo
): Promise<Blob> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pdf/download-receipt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...donation, organizationInfo }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.blob();
  } catch (error) {
    console.error('Error generating PDF blob from API:', error);
    throw new Error('Failed to generate PDF receipt blob from server');
  }
};

/**
 * Backward-compatible object export
 */
export const PDFApiService = {
  generateDonationReceipt,
  generateDonationReceiptBlob,
};

/**
 * Higher-level service using PDFApiService
 */
export const PDFService = {
  generateDonationReceiptBlob: async (
    donation: DonationData,
    organizationInfo?: OrganizationInfo
  ): Promise<Blob> => PDFApiService.generateDonationReceiptBlob(donation, organizationInfo),

  generateDonationReceipt: async (
    donation: DonationData,
    organizationInfo?: OrganizationInfo
  ): Promise<void> => PDFApiService.generateDonationReceipt(donation, organizationInfo),

  generateSimpleReceipt: (
    donation: DonationData,
    organizationInfo?: OrganizationInfo
  ): void => {
    PDFApiService.generateDonationReceipt(donation, organizationInfo).catch(error => {
      console.error('Error generating simple receipt:', error);
    });
  }
};
