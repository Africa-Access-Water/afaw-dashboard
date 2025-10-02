import React from 'react';
import CardBox from '../shared/CardBox';
import CSVExportButton from './CSVExportButton';

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

interface ExportDashboardProps {
  donations: DonationData[];
  donors: DonorData[];
}

const ExportDashboard: React.FC<ExportDashboardProps> = ({
  donations,
  donors
}) => {
  const totalDonations = donations.length;
  const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const uniqueDonors = new Set(donations.map(d => d.email)).size;
  const averageDonation = totalDonations > 0 ? totalAmount / totalDonations : 0;

  return (
    <CardBox>
      <h5 className="card-title mb-6">Export & Reports</h5>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Summary Stats */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h6 className="text-sm font-medium text-blue-600 mb-1">Total Donations</h6>
              <p className="text-2xl font-bold text-blue-800">{totalDonations}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h6 className="text-sm font-medium text-green-600 mb-1">Total Amount</h6>
              <p className="text-2xl font-bold text-green-800">${totalAmount.toFixed(2)}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h6 className="text-sm font-medium text-purple-600 mb-1">Unique Donors</h6>
              <p className="text-2xl font-bold text-purple-800">{uniqueDonors}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h6 className="text-sm font-medium text-orange-600 mb-1">Average Donation</h6>
              <p className="text-2xl font-bold text-orange-800">${averageDonation.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* PDF Exports */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h6 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF Receipts
          </h6>
          <p className="text-gray-600 text-sm mb-4">
            Individual PDF receipts are available in the donations table
          </p>
          <div className="text-sm text-gray-500">
            Use the "Download PDF" button next to each donation for individual receipts
          </div>
        </div>

        {/* CSV Exports */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h6 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            CSV Data Export
          </h6>
          <p className="text-gray-600 text-sm mb-4">
            Export raw data for analysis and record keeping
          </p>
          <CSVExportButton 
            donations={donations}
            donors={donors}
            variant="all"
            size="sm"
          />
        </div>

        {/* Analytics Reports */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h6 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics Reports
          </h6>
          <p className="text-gray-600 text-sm mb-4">
            Detailed analysis, insights, and trend reports
          </p>
          <div className="space-y-2">
            <CSVExportButton 
              donations={donations}
              donors={donors}
              variant="summary"
              size="xs"
            />
            <CSVExportButton 
              donations={donations}
              donors={donors}
              variant="monthly"
              size="xs"
            />
          </div>
        </div>
      </div>

      {/* Export Information */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h6 className="font-semibold text-gray-800 mb-2">Export Information</h6>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>PDF Receipts:</strong> Professional receipts for tax purposes and donor records</li>
          <li>• <strong>CSV Data:</strong> Raw data for spreadsheet analysis and external systems</li>
          <li>• <strong>Summary Report:</strong> Comprehensive overview with key metrics and trends</li>
          <li>• <strong>Monthly Trends:</strong> Month-by-month donation patterns and growth</li>
        </ul>
      </div>
    </CardBox>
  );
};

export default ExportDashboard;





