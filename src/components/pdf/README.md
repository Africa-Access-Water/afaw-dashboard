# PDF Generation for Donations

This module provides comprehensive PDF generation functionality for donation receipts in the AFAW Foundation dashboard.

## Features

- **Single Donation Receipts**: Generate individual PDF receipts for each donation
- **Two PDF Formats**: 
  - Full HTML-to-PDF (styled, professional layout)
  - Simple text-based PDF (lightweight, fast generation)
- **Dynamic Content**: All donation data is dynamically populated
- **Professional Layout**: Includes organization branding and tax information
- **Error Handling**: Comprehensive error handling with user feedback
- **Loading States**: Visual feedback during PDF generation

## Components

### 1. DonationReceiptTemplate
- **Location**: `src/components/pdf/DonationReceiptTemplate.tsx`
- **Purpose**: React component that renders the donation receipt template
- **Features**: 
  - Professional styling with organization branding
  - Complete donor and donation information
  - Tax-deductible information
  - Responsive design

### 2. PDFDownloadButton
- **Location**: `src/components/pdf/PDFDownloadButton.tsx`
- **Purpose**: Button component for downloading individual donation receipts
- **Props**:
  - `donation`: Donation data object
  - `organizationInfo`: Organization details (optional)
  - `variant`: 'full' or 'simple' PDF format
  - `size`: Button size ('xs', 'sm', 'md', 'lg')
  - `className`: Additional CSS classes


## Services

### PDFService
- **Location**: `src/utils/pdf/pdfService.ts`
- **Methods**:
  - `generateDonationReceipt()`: Generate single receipt (HTML-to-PDF)
  - `generateSimpleReceipt()`: Generate simple text-based receipt

### usePDFGenerator Hook
- **Location**: `src/hooks/usePDFGenerator.ts`
- **Purpose**: Custom React hook for PDF generation
- **Returns**:
  - `isGenerating`: Boolean indicating if PDF is being generated
  - `error`: Error message if generation fails
  - `generateDonationReceipt()`: Function to generate single receipt
  - `generateSimpleReceipt()`: Function to generate simple receipt
  - `generateBatchReceipt()`: Function to generate batch receipts
  - `clearError()`: Function to clear error state

## Usage Examples

### Basic Usage in a Table
```tsx
import PDFDownloadButton from '../../components/pdf/PDFDownloadButton';

// In your table cell
<PDFDownloadButton 
  donation={donation}
  organizationInfo={{
    name: "AFAW Foundation",
    address: "123 Charity Street, Lusaka, Zambia",
    email: "info@afaw.org",
    phone: "+260 123 456 789"
  }}
  size="xs"
/>
```


### Using the Hook Directly
```tsx
import { usePDFGenerator } from '../../hooks/usePDFGenerator';

const MyComponent = () => {
  const { isGenerating, error, generateDonationReceipt } = usePDFGenerator();

  const handleDownload = async () => {
    await generateDonationReceipt(donation, organizationInfo);
  };

  return (
    <button onClick={handleDownload} disabled={isGenerating}>
      {isGenerating ? 'Generating...' : 'Download PDF'}
    </button>
  );
};
```

## Data Structure

### DonationData Interface
```typescript
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
```

### OrganizationInfo Interface
```typescript
interface OrganizationInfo {
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
}
```

## Dependencies

- `jspdf`: PDF generation library
- `html2canvas`: HTML to canvas conversion
- `react`: React framework
- `flowbite-react`: UI components

## File Naming Convention

Generated PDF files follow this naming pattern:
- Single receipts: `donation-receipt-{id}-{date}.pdf`
- Batch receipts: `donation-receipts-batch-{date}.pdf`

## Error Handling

The system includes comprehensive error handling:
- Network errors during PDF generation
- Missing donation data
- Invalid organization information
- Browser compatibility issues

All errors are displayed to the user with helpful messages.

## Browser Compatibility

- Chrome/Chromium: Full support
- Firefox: Full support
- Safari: Full support
- Edge: Full support

## Performance Considerations

- HTML-to-PDF generation may take 1-2 seconds per receipt
- Simple text-based PDFs generate much faster
- Batch generation processes receipts sequentially to avoid memory issues
- Large batches (50+ receipts) may take several minutes

## Customization

### Styling
The PDF template can be customized by modifying the `DonationReceiptTemplate` component:
- Colors and fonts
- Layout and spacing
- Organization branding
- Additional fields

### Organization Information
Organization details can be customized in the `organizationInfo` prop or set as defaults in the service.

## Testing

A demo page is available at `/pdf-demo` to test all PDF generation features with sample data.





