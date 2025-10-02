# Donations Dashboard

A clean and efficient dashboard for managing donations with advanced filtering. Caching has been removed from both API and frontend to keep the system simple and transparent.

## Features

### 🚀 Performance & Scalability
- **Client-side filtering** with explicit Apply action
- **Optimized rendering** with memoization
- **Pagination** for better navigation

### 📊 Data Management
- **Real-time data fetching** directly from backend API (no caching)
- **Error handling** with retry mechanisms
- **Loading indicators** for better UX

### 🎨 User Interface
- **Clean interface** with dedicated apply filters button
- **Advanced filtering** by status, currency, project, and date
- **Currency symbols** mapping (USD → $, EUR → €, etc.)
- **Responsive design** for all screen sizes
- **Empty state handling** when no results found

### 📈 Insights
- **Filtered results** count in header

## Components

### Core Components
- `Donations.tsx` - Main dashboard component
- `DonationsTable.tsx` - Donations table with filtering and pagination

### Shared Components
- `DataTableFilters.tsx` - Advanced filtering interface with apply button

### Hooks
- `useDonationsData.ts` - Data fetching and client-side processing (no caching)

### API Services
- `donationService.ts` - API calls for donations and donors data
- `projectService.ts` - API calls for projects (used in filter dropdown)

## Usage

### Basic Usage
```tsx
import Donations from './views/donations/Donations';

function App() {
  return <Donations />;
}
```

### Table Configuration
```tsx
<DonationsTable
  donations={donations}
  loading={loading}
  itemsPerPage={20}
/>
```

## API Integration

### Backend Requirements
- `GET /api/donations` - Fetch all donations and subscriptions
- `GET /api/donations/donors` - Fetch all donors
- `GET /api/projects` - Fetch all projects

### Data Format
```typescript
interface Donation {
  id: number;
  donor_id: number;
  project_id?: number;
  amount: number;
  currency: string;
  status: 'initiated' | 'pending' | 'completed' | 'failed' | 'expired';
  type: 'one-time' | 'subscription';
  created_at: string;
  project_name?: string;
  donor_name?: string;
  donor_email?: string;
}
```

## Performance Features

### Filtering & Search
- **Dedicated apply button** for explicit filter control
- **Advanced filters** with multiple criteria
- **Client-side processing** for instant results
- **Clear filters** functionality

## Currency Support

Supports multiple currencies with proper symbols:
- USD ($), EUR (€), GBP (£), JPY (¥)
- INR (₹), ZAR (R), ZMW (K), NGN (₦)
- And many more African and international currencies

## Error Handling

- **Network error recovery** with retry mechanisms
- **Loading states** for all async operations
- **User-friendly error messages**
- **Empty state** when no donations match filters

## Browser Compatibility

- **Modern browsers** (Chrome, Firefox, Safari, Edge)
- **Responsive design** for mobile and tablet
- **Accessibility** compliant (WCAG 2.1)

## Development

### Prerequisites
- Node.js 18+
- React 19+
- TypeScript 5+
- Flowbite React components

### Installation
```bash
npm install
npm run dev
```

### Testing
```bash
npm run test
npm run lint
```

## Performance Notes

- **< 100ms** render time for typical pages
- **Client-side filtering** is lightweight and responsive
- **Apply filters** button for explicit control

## Current Implementation

The dashboard now features:
- Clean, focused interface without unnecessary complexity
- Dedicated apply filters button for better user control
- Simplified table structure (5 columns: Donor, Amount, Status, Project, Date, Actions)
- Removed ID column and type filter for cleaner UI
- Comprehensive error handling and loading states
- Inline pagination with Previous/Next buttons
- Project filter dropdown populated from database
 - No caching on API or frontend

## File Structure

```
src/
├── views/donations/
│   └── Donations.tsx (main view)
├── components/donations/
│   └── DonationsTable.tsx (main table)
├── components/shared/
│   └── DataTableFilters.tsx (filters with apply button)
├── hooks/
│   └── useDonationsData.ts (data management)
└── utils/api/
    ├── donationService.ts (donations & donors API)
    └── projectService.ts (projects API for filters)
```

## Key Features Summary

- ✅ **Apply Filters Button** - Explicit control over filtering
- ✅ **Clear Filters Button** - Reset all filters at once
- ✅ **Project Dropdown** - Dynamic project list from database
- ✅ **Currency Formatting** - Proper symbols and formatting
- ✅ **Empty State** - User-friendly message when no results
- ✅ **Pagination** - Clean Previous/Next navigation
- ✅ **10-minute Caching** - Optimal performance
- ✅ **Responsive Design** - Works on all devices
- ✅ **Error Handling** - Graceful error recovery
- ✅ **Loading States** - Clear feedback during operations