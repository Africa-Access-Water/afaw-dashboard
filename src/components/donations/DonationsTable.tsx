import React, { useState, useMemo, useEffect } from 'react';
import { Table, Badge, Button, Spinner } from 'flowbite-react';
// import { IconEye } from '@tabler/icons-react';
import SimpleBar from 'simplebar-react';
import DataTableFilters, { FilterConfig } from '../shared/DataTableFilters';
import PDFDownloadButton from '../pdf/PDFDownloadButton';
import { Donation, formatAmount } from '../../hooks/useDonationsData';
import { fetchProjects } from '../../utils/api/projectService';

interface DonationsTableProps {
  donations: Donation[];
  loading: boolean;
  itemsPerPage?: number;
}

const DonationsTable: React.FC<DonationsTableProps> = ({
  donations,
  loading,
  itemsPerPage = 20
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({ status: 'completed' });
  const [projects, setProjects] = useState<Array<{id: number, name: string}>>([]);
  
  // Separate state for applied filters (what's actually used for filtering)
  const [appliedSearchValue, setAppliedSearchValue] = useState('');
  const [appliedFilterValues, setAppliedFilterValues] = useState<Record<string, any>>({ status: 'completed' });

  // Fetch projects for dropdown
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectsData = await fetchProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    loadProjects();
  }, []);

  // Filter configurations
  const filterConfigs: FilterConfig[] = [
    {
      key: 'status',
      label: 'Payment Status',
      type: 'select',
      options: [
        { value: 'completed', label: 'Completed' },
        { value: 'failed', label: 'Failed' },
        { value: 'expired', label: 'Expired' }
      ]
    },
    {
      key: 'currency',
      label: 'Currency',
      type: 'select',
      options: [
        { value: 'USD', label: 'USD ($)' },
        { value: 'EUR', label: 'EUR (€)' },
        { value: 'GBP', label: 'GBP (£)' },
        { value: 'ZMW', label: 'ZMW (K)' },
        { value: 'INR', label: 'INR (₹)' },
        { value: 'ZAR', label: 'ZAR (R)' }
      ]
    },
    {
      key: 'project_name',
      label: 'Projects',
      type: 'select',
      options: [

        ...projects.map(project => ({
          value: project.name,
          label: project.name
        }))
      ]
    },
    {
      key: 'date_from',
      label: 'From Date',
      type: 'date'
    },
    {
      key: 'date_to',
      label: 'To Date',
      type: 'date'
    }
  ];

  // Filter and search logic - now uses applied filters
  const filteredDonations = useMemo(() => {
    // Pre-filter donations to only show completed, expired, and failed statuses
    let filtered = donations.filter(donation => 
      ['completed', 'expired', 'failed'].includes(donation.status)
    );

    // Search filter
    if (appliedSearchValue && appliedSearchValue.trim() !== '') {
      const searchLower = appliedSearchValue.toLowerCase().trim();
      filtered = filtered.filter(donation =>
        donation.donor_name?.toLowerCase().includes(searchLower) ||
        donation.donor_email?.toLowerCase().includes(searchLower) ||
        donation.project_name?.toLowerCase().includes(searchLower) ||
        donation.id.toString().includes(searchLower)
      );
    }

    // Apply filters
    Object.entries(appliedFilterValues).forEach(([key, value]) => {
      if (!value || value === '' || value === null || value === undefined) return;
      
      switch (key) {
        case 'status':
          filtered = filtered.filter(d => d.status === value);
          break;
        case 'currency':
          filtered = filtered.filter(d => d.currency === value);
          break;
        case 'project_name':
          if (value) {
            filtered = filtered.filter(d => 
              d.project_name === value
            );
          }
          break;
        case 'date_from':
          filtered = filtered.filter(d => new Date(d.created_at) >= new Date(value));
          break;
        case 'date_to':
          filtered = filtered.filter(d => new Date(d.created_at) <= new Date(value));
          break;
      }
    });

    return filtered;
  }, [donations, appliedSearchValue, appliedFilterValues]);

  // Pagination logic
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDonations = filteredDonations.slice(startIndex, startIndex + itemsPerPage);
  

  // Create stable empty object reference
  const emptyFilters = useMemo(() => ({}), []);
  
  // Reset page when applied filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [appliedSearchValue, appliedFilterValues]);

  const handleFilterChange = (key: string, value: any) => {
    setFilterValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilterValues({ status: 'completed' });
    setSearchValue('');
    setAppliedFilterValues({ status: 'completed' });
    setAppliedSearchValue('');
  };

  const handleApplyFilters = () => {
    setAppliedFilterValues(filterValues);
    setAppliedSearchValue(searchValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'failure';
      case 'expired': return 'gray';
      case 'initiated': return 'info';
      default: return 'gray';
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="xl" />
        <span className="ml-3 text-gray-600">Loading donations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Donations ({filteredDonations.length})
          </h3>
        </div>
        
      </div>

      {/* Filters */}
      <DataTableFilters
        filters={filterConfigs}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onApplyFilters={handleApplyFilters}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search by donor name, email or  project..."
        showApplyButton={true}
      />

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <SimpleBar className="max-h-[600px]">
          <div className="overflow-x-auto">
            <Table hoverable key={`table-${filteredDonations.length}-${currentPage}`}>
              <Table.Head>
                <Table.HeadCell>Donor</Table.HeadCell>
                <Table.HeadCell>Amount</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Project</Table.HeadCell>
                <Table.HeadCell>Date</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body key={`body-${paginatedDonations.length}-${paginatedDonations.map(d => d.id).join('-')}`} className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedDonations.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={6} className="text-center py-8 text-gray-500">
                      No donations found matching your filters
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  paginatedDonations.map((donation) => (
                    
                  <Table.Row key={donation.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {donation.donor_name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {donation.donor_email || 'No email'}
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="font-semibold text-green-600 dark:text-green-400">
                        {formatAmount(donation.amount, donation.currency)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {donation.currency.toUpperCase()}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={getStatusColor(donation.status)}>
                        {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="max-w-[200px]">
                        <div className="font-medium text-gray-900 dark:text-white truncate">
                          {donation.project_name || 'General Fund'}
                        </div>
                        {donation.interval && (
                          <div className="text-xs text-gray-500">
                            Every {donation.interval}
                          </div>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="text-sm">
                        {new Date(donation.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(donation.created_at).toLocaleTimeString()}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        <PDFDownloadButton
                          donation={{
                            id: donation.id,
                            name: donation.donor_name || 'Unknown',
                            email: donation.donor_email || '',
                            amount: donation.amount,
                            message: `Donation for ${donation.project_name || 'General Fund'}`,
                            created_at: donation.created_at,
                            transaction_id: donation.stripe_payment_intent,
                            method: 'Stripe'
                          }}
                          size="xs"
                        />
                      </div>
                    </Table.Cell>
                  </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table>
          </div>
        </SimpleBar>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center text-sm text-gray-700 dark:text-gray-400">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDonations.length)} of {filteredDonations.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              color="light"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-700 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="sm"
              color="light"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* No modal – actions are inline */}
    </div>
  );
};

export default DonationsTable;
