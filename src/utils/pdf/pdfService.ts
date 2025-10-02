import { PDFApiService } from '../api/pdfService';

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

export class PDFService {
  /**
   * Generate PDF receipt as blob for email attachment (reusable for mailing service)
   */
  static async generateDonationReceiptBlob(
    donation: DonationData,
    organizationInfo?: OrganizationInfo
  ): Promise<Blob> {
    return PDFApiService.generateDonationReceiptBlob(donation, organizationInfo);
  }

  /**
   * Generate and download a PDF receipt for a donation
   */
  static async generateDonationReceipt(
    donation: DonationData,
    organizationInfo?: OrganizationInfo
  ): Promise<void> {
    return PDFApiService.generateDonationReceipt(donation, organizationInfo);
  }

  /**
   * Generate a simple text-based PDF receipt (alternative method)
   * Note: This method is kept for backward compatibility but now uses the API
   */
  static generateSimpleReceipt(
    donation: DonationData,
    organizationInfo?: OrganizationInfo
  ): void {
    // For simple receipts, we'll use the same API endpoint
    PDFApiService.generateDonationReceipt(donation, organizationInfo).catch(error => {
      console.error('Error generating simple receipt:', error);
    });
  }
}
