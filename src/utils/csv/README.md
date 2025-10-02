# CSV Export System for Donations and Donors

This module provides comprehensive CSV export functionality for donation and donor data in the AFAW Foundation dashboard.

## Features

- **Multiple Export Formats**: Donations, Donors, Summary Reports, Monthly Trends, Donor Engagement
- **Detailed Analytics**: Comprehensive insights and metrics
- **Professional Formatting**: Clean, structured CSV files ready for analysis
- **Error Handling**: Robust error handling with user feedback
- **Loading States**: Visual feedback during export operations

## Export Types

### 1. Donations Export
- **File**: `donations-export-{date}.csv`
- **Content**: All donation records with detailed information
- **Columns**:
  - Receipt ID
  - Donor Name
  - Email
  - Amount ($)
  - Payment Method
  - Donation Date
  - Donation Time
  - Message
  - Transaction ID

### 2. Donors Export
- **File**: `donors-export-{date}.csv`
- **Content**: All donor records with engagement metrics
- **Columns**:
  - Donor ID
  - Name
  - Email
  - Total Donated ($)
  - Donation Frequency
  - Last Donation Date
  - Last Donation Time
  - Days Since Last Donation

### 3. Summary Report
- **File**: `donation-summary-report-{date}.csv`
- **Content**: Comprehensive analytics and insights
- **Sections**:
  - Key Metrics (Total donations, amount, average, unique donors)
  - Payment Methods Breakdown
  - Monthly Breakdown
  - Top Donors Analysis

### 4. Monthly Trends
- **File**: `monthly-donation-trends-{date}.csv`
- **Content**: Month-by-month donation analysis
- **Columns**:
  - Month
  - Total Donations
  - Total Amount ($)
  - Average Amount ($)
  - Unique Donors

### 5. Donor Engagement
- **File**: `donor-engagement-report-{date}.csv`
- **Content**: Individual donor behavior analysis
- **Columns**:
  - Donor Name
  - Email
  - Total Donated ($)
  - Donation Count
  - Average Donation ($)
  - First Donation Date
  - Last Donation Date
  - Days Active
  - Engagement Level (Low/Medium/High)

## Components

### CSVService
- **Location**: `src/utils/csv/csvService.ts`
- **Purpose**: Core CSV generation and export functionality
- **Methods**:
  - `exportDonationsCSV()`: Export all donations
  - `exportDonorsCSV()`: Export all donors
  - `exportSummaryReport()`: Generate comprehensive summary
  - `exportMonthlyTrends()`: Export monthly analysis
  - `exportDonorEngagement()`: Export donor behavior analysis
  - `generateDonationSummary()`: Generate analytics data

### useCSVExport Hook
- **Location**: `src/hooks/useCSVExport.ts`
- **Purpose**: React hook for CSV export operations
- **Returns**:
  - `isExporting`: Boolean indicating export status
  - `error`: Error message if export fails
  - Export functions for each type
  - `clearError()`: Clear error state

### CSVExportButton
- **Location**: `src/components/export/CSVExportButton.tsx`
- **Purpose**: Button component for CSV exports
- **Props**:
  - `donations`: Array of donation data
  - `donors`: Array of donor data
  - `variant`: Export type ('donations', 'donors', 'summary', 'all')
  - `size`: Button size
  - `className`: Additional CSS classes

### ExportDashboard
- **Location**: `src/components/export/ExportDashboard.tsx`
- **Purpose**: Comprehensive export interface
- **Features**:
  - Summary statistics
  - PDF and CSV export options
  - Analytics reports
  - Export information

## Usage Examples

### Basic CSV Export
```tsx
import CSVExportButton from '../../components/export/CSVExportButton';

// Export donations
<CSVExportButton 
  donations={donations}
  variant="donations"
  size="sm"
/>

// Export donors
<CSVExportButton 
  donations={[]}
  donors={donors}
  variant="donors"
  size="sm"
/>
```

### All Export Options
```tsx
<CSVExportButton 
  donations={donations}
  donors={donors}
  variant="all"
  size="sm"
/>
```

### Using the Hook Directly
```tsx
import { useCSVExport } from '../../hooks/useCSVExport';

const MyComponent = () => {
  const { isExporting, error, exportDonations } = useCSVExport();

  const handleExport = async () => {
    await exportDonations(donations);
  };

  return (
    <button onClick={handleExport} disabled={isExporting}>
      {isExporting ? 'Exporting...' : 'Export CSV'}
    </button>
  );
};
```

### Export Dashboard
```tsx
import ExportDashboard from '../../components/export/ExportDashboard';

<ExportDashboard 
  donations={donations}
  donors={donors}
  organizationInfo={organizationInfo}
/>
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

### DonorData Interface
```typescript
interface DonorData {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  total_donated: number;
  frequency: string;
  last_donation: string;
}
```

## Analytics Features

### Summary Report Analytics
- **Total Metrics**: Donations count, total amount, average donation, unique donors
- **Date Range**: Start and end dates of donation period
- **Payment Methods**: Breakdown by payment type (Card, Mobile Money, etc.)
- **Monthly Breakdown**: Month-by-month donation amounts
- **Top Donors**: Top 10 donors by total contribution

### Monthly Trends Analysis
- **Growth Tracking**: Month-over-month donation trends
- **Seasonal Patterns**: Identify peak donation periods
- **Donor Retention**: Track unique donor counts per month
- **Average Analysis**: Monthly average donation amounts

### Donor Engagement Analysis
- **Engagement Levels**: Categorize donors as Low/Medium/High engagement
- **Donation Patterns**: Track donation frequency and amounts
- **Retention Metrics**: Days between donations, total activity period
- **Behavioral Insights**: First and last donation dates, total contribution

## File Naming Convention

All exported files follow a consistent naming pattern:
- **Donations**: `donations-export-{YYYY-MM-DD}.csv`
- **Donors**: `donors-export-{YYYY-MM-DD}.csv`
- **Summary**: `donation-summary-report-{YYYY-MM-DD}.csv`
- **Trends**: `monthly-donation-trends-{YYYY-MM-DD}.csv`
- **Engagement**: `donor-engagement-report-{YYYY-MM-DD}.csv`

## Error Handling

The system includes comprehensive error handling:
- **Network Errors**: Connection issues during export
- **Data Validation**: Invalid or missing data
- **Browser Compatibility**: Cross-browser support
- **File Size Limits**: Large dataset handling

All errors are displayed to users with helpful messages and recovery options.

## Browser Compatibility

- **Chrome/Chromium**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support

## Performance Considerations

- **Large Datasets**: Optimized for datasets with thousands of records
- **Memory Usage**: Efficient memory management for large exports
- **Processing Time**: Fast CSV generation even for large datasets
- **User Experience**: Non-blocking exports with progress indicators

## Integration Points

### With PDF System
- Combined PDF and CSV export options
- Consistent data across both formats
- Unified export dashboard

### With Dashboard
- Export buttons in data tables
- Summary statistics display
- Real-time data integration

### With Analytics
- Export-ready analytics data
- Trend analysis capabilities
- Donor behavior insights

## Customization

### CSV Format
- Customizable column headers
- Configurable date formats
- Localized number formatting
- Custom field selection

### Analytics
- Adjustable engagement thresholds
- Customizable summary metrics
- Configurable trend periods
- Flexible donor categorization

## Testing

The system includes comprehensive testing capabilities:
- **Unit Tests**: Individual function testing
- **Integration Tests**: End-to-end export testing
- **Data Validation**: Export data accuracy verification
- **Error Scenarios**: Error handling validation

## Security Considerations

- **Data Privacy**: No sensitive data exposure
- **Access Control**: Admin-only export functionality
- **Data Sanitization**: Clean data export
- **Audit Trail**: Export activity logging





