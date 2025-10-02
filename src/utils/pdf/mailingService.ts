import { PDFService } from './pdfService';

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

/**
 * Service for generating PDF receipts for email attachments
 * This service can be used by your mailing service to generate receipts
 */
export class MailingService {
  /**
   * Generate a PDF receipt blob that can be attached to emails
   * @param donation - The donation data
   * @param organizationInfo - Organization information (optional, uses defaults if not provided)
   * @returns Promise<Blob> - PDF blob ready for email attachment
   */
  static async generateReceiptForEmail(
    donation: DonationData,
    organizationInfo?: OrganizationInfo
  ): Promise<Blob> {
    try {
      // Use the reusable PDF service to generate the blob
      const pdfBlob = await PDFService.generateDonationReceiptBlob(donation, organizationInfo);
      
      return pdfBlob;
    } catch (error) {
      console.error('Error generating receipt for email:', error);
      throw new Error('Failed to generate receipt for email');
    }
  }

  /**
   * Generate filename for the receipt PDF
   * @param donation - The donation data
   * @returns string - Formatted filename
   */
  static generateReceiptFilename(donation: DonationData): string {
    const date = new Date(donation.created_at).toISOString().split('T')[0];
    return `donation-receipt-${donation.id}-${date}.pdf`;
  }

  /**
   * Example usage for email service integration
   * This shows how you would use this in your mailing service
   */
  static async prepareEmailWithReceipt(
    donation: DonationData,
    organizationInfo?: OrganizationInfo
  ): Promise<{
    recipientEmail: string;
    recipientName: string;
    subject: string;
    body: string;
    attachment: {
      filename: string;
      content: Blob;
      contentType: string;
    };
  }> {
    try {
      // Generate the PDF receipt
      const pdfBlob = await this.generateReceiptForEmail(donation, organizationInfo);
      
      // Generate filename
      const filename = this.generateReceiptFilename(donation);
      
      // Prepare email data
      const emailData = {
        recipientEmail: donation.email,
        recipientName: donation.name,
        subject: `Donation Receipt - ${donation.id}`,
        body: `
Dear ${donation.name},

Thank you for your generous donation of $${donation.amount.toFixed(2)} to ${organizationInfo?.name || 'AFRICA ACCESS WATER'}.

Your donation receipt is attached to this email. Please keep this receipt for your tax records.

We appreciate your support in helping us provide access to clean water in Africa.

Best regards,
${organizationInfo?.name || 'AFRICA ACCESS WATER'} Team
        `.trim(),
        attachment: {
          filename,
          content: pdfBlob,
          contentType: 'application/pdf'
        }
      };

      return emailData;
    } catch (error) {
      console.error('Error preparing email with receipt:', error);
      throw new Error('Failed to prepare email with receipt');
    }
  }
}

// Example usage:
/*
// In your mailing service, you would use it like this:

import { MailingService } from './mailingService';

const donation = {
  id: 123,
  name: 'John Doe',
  email: 'john@example.com',
  amount: 100.00,
  message: 'Keep up the great work!',
  created_at: '2025-01-27T10:30:00Z',
  method: 'Credit Card',
  transaction_id: 'txn_123456789'
};

const organizationInfo = {
  name: 'AFRICA ACCESS WATER',
  address: 'Lot 5676/M/6, Lusaka West, Lusaka, Zambia',
  email: 'info@africaaccesswater.org',
  phone: '+260 211 231 174 | +260 976 944 695',
  website: 'www.africaaccesswater.org',
  regNumber: 'Non-profit Organization, Company No. 120190001569'
};

// Generate PDF blob for email attachment
const pdfBlob = await MailingService.generateReceiptForEmail(donation, organizationInfo);

// Or prepare complete email data
const emailData = await MailingService.prepareEmailWithReceipt(donation, organizationInfo);

// Then use emailData in your email service (SendGrid, AWS SES, etc.)
*/
