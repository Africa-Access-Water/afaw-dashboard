# PDF Receipt Service

This service provides reusable PDF receipt generation for donation receipts that can be used in mailing services.

## Updated Features

- **New Header Layout**: Receipt information (Receipt No and Date) moved to header section
- **No Time Display**: Time has been removed from receipt information as requested
- **Updated Footer**: Simple footer with red line and contact information
- **Reusable Service**: Can be called from external mailing services

## Usage

### For Email Attachments (Mailing Service)

```typescript
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
```

### For Direct Download

```typescript
import { PDFService } from './pdfService';

// Generate and download PDF
await PDFService.generateDonationReceipt(donation, organizationInfo);

// Generate PDF blob (for programmatic use)
const pdfBlob = await PDFService.generateDonationReceiptBlob(donation, organizationInfo);
```

## Template Structure

The receipt template now includes:

1. **Header Section**:
   - Left: "Donation Receipt" title with Receipt No and Date
   - Right: Organization logo and contact information

2. **Main Content**:
   - Donor Information
   - Donation Details
   - Transaction Information (if available)
   - Tax Deductible Information

3. **Footer**:
   - Red line separator
   - Thank you message
   - Contact information

## Integration with Mailing Service

The `MailingService` class provides methods specifically designed for email integration:

- `generateReceiptForEmail()`: Returns a PDF blob ready for email attachment
- `generateReceiptFilename()`: Generates appropriate filename for the receipt
- `prepareEmailWithReceipt()`: Prepares complete email data including attachment

This makes it easy to integrate with any email service (SendGrid, AWS SES, etc.).
