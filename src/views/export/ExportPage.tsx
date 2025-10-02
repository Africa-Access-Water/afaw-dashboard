import { useState, useMemo } from 'react';
import ExportDashboard from '../../components/export/ExportDashboard';
import { donations } from '../../utils/data/DonationData';
import { donors } from '../../utils/data/DonorData';

const ExportPage = () => {
  // Get current month date range
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // Date range state
  const [dateRange, setDateRange] = useState({
    startDate: currentMonthStart.toISOString().split('T')[0],
    endDate: currentMonthEnd.toISOString().split('T')[0]
  });

  // Filter donations and donors based on date range
  const filteredDonations = useMemo(() => {
    return donations.filter(donation => {
      const donationDate = new Date(donation.created_at);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate + 'T23:59:59.999Z');
      
      return donationDate >= startDate && donationDate <= endDate;
    });
  }, [dateRange]);

  const filteredDonors = useMemo(() => {
    // Get unique donors from filtered donations
    const donorEmails = new Set(filteredDonations.map(d => d.email));
    return donors.filter(donor => donorEmails.has(donor.email));
  }, [filteredDonations]);

  // Calculate statistics for filtered data
  const stats = useMemo(() => {
    const totalAmount = filteredDonations.reduce((sum, d) => sum + d.amount, 0);
    const uniqueDonors = new Set(filteredDonations.map(d => d.email)).size;
    const averageDonation = filteredDonations.length > 0 ? totalAmount / filteredDonations.length : 0;

    return {
      totalDonations: filteredDonations.length,
      totalAmount,
      uniqueDonors,
      averageDonation
    };
  }, [filteredDonations]);

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h6 className="text-lg font-semibold text-gray-800 mb-4">Select Date Range</h6>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const now = new Date();
                const start = new Date(now.getFullYear(), now.getMonth(), 1);
                const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                setDateRange({
                  startDate: start.toISOString().split('T')[0],
                  endDate: end.toISOString().split('T')[0]
                });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              This Month
            </button>
            <button
              onClick={() => {
                const now = new Date();
                const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const end = new Date(now.getFullYear(), now.getMonth(), 0);
                setDateRange({
                  startDate: start.toISOString().split('T')[0],
                  endDate: end.toISOString().split('T')[0]
                });
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Last Month
            </button>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Selected Range:</strong> {new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()}
            <span className="ml-4 text-blue-600">({filteredDonations.length} donations found)</span>
          </p>
        </div>
      </div>

      <ExportDashboard 
        donations={filteredDonations}
        donors={filteredDonors}
      />
      
      {/* Additional Export Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Export Cards */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h6 className="text-lg font-semibold text-gray-800 mb-4">Quick Exports</h6>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Filtered Donations</p>
                <p className="text-sm text-gray-600">{stats.totalDonations} records</p>
              </div>
              <span className="text-green-600 font-semibold">CSV</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Filtered Donors</p>
                <p className="text-sm text-gray-600">{stats.uniqueDonors} records</p>
              </div>
              <span className="text-green-600 font-semibold">CSV</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">PDF Receipts</p>
                <p className="text-sm text-gray-600">Professional receipts</p>
              </div>
              <span className="text-red-600 font-semibold">PDF</span>
            </div>
          </div>
        </div>

        {/* Export Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h6 className="text-lg font-semibold text-gray-800 mb-4">Export Statistics</h6>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Donations:</span>
              <span className="font-semibold">{stats.totalDonations}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-semibold">${stats.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Unique Donors:</span>
              <span className="font-semibold">{stats.uniqueDonors}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Donation:</span>
              <span className="font-semibold">${stats.averageDonation.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date Range:</span>
              <span className="font-semibold">
                {new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Export Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h6 className="text-lg font-semibold text-blue-800 mb-3">Export Instructions</h6>
        <div className="text-blue-700 space-y-2">
          <p><strong>CSV Exports:</strong> Use for data analysis, record keeping, and integration with external systems like Excel, Google Sheets, or accounting software.</p>
          <p><strong>PDF Receipts:</strong> Professional receipts for donors, tax purposes, and official documentation.</p>
          <p><strong>Summary Reports:</strong> Comprehensive analytics including trends and payment method breakdowns.</p>
          <p><strong>Monthly Trends:</strong> Track donation patterns over time to identify seasonal trends and growth opportunities.</p>
        </div>
      </div>
    </div>
  );
};

export default ExportPage;





