import React, { useState, useMemo } from 'react';
import { Card, Badge, Button, Spinner, Modal, Table, TextInput } from 'flowbite-react';
import { IconUser, IconCalendar, IconCurrencyDollar, IconEye, IconSearch, IconAlertTriangle, IconClock } from '@tabler/icons-react';
import { Donor, Donation, formatAmount } from '../../hooks/useDonationsData';
import { fetchDonationsByDonor } from '../../utils/api/donationService';

interface DonorsCardsProps {
  donors: Donor[];
  loading: boolean;
}

const DonorsCards: React.FC<DonorsCardsProps> = ({ donors, loading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [donorDonations, setDonorDonations] = useState<Donation[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const handleDonorClick = async (donor: Donor) => {
    setSelectedDonor(donor);
    setIsModalOpen(true);
    
    // Fetch donations for this donor
    try {
      const donations = await fetchDonationsByDonor(donor.id);
      // Only show completed, expired, and failed donations
      const relevantDonations = donations.filter((donation: Donation) => 
        ['completed', 'expired', 'failed'].includes(donation.status)
      );
      setDonorDonations(relevantDonations);
    } catch (error) {
      console.error('Error fetching donor donations:', error);
      setDonorDonations([]);
    }
  };

  // Filter donors based on search
  const filteredDonors = useMemo(() => {
    if (!searchValue.trim()) {
      return donors;
    }
    
    const searchLower = searchValue.toLowerCase().trim();
    return donors.filter(donor =>
      donor.name?.toLowerCase().includes(searchLower) ||
      donor.email?.toLowerCase().includes(searchLower)
    );
  }, [donors, searchValue]);

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
        <span className="ml-3 text-gray-600">Loading donors...</span>
      </div>
    );
  }

  if (donors.length === 0) {
    return (
      <div className="text-center py-12">
        <IconUser size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Donors Found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          There are no donors in the system yet.
        </p>
      </div>
    );
  }

  return (
    <div className="section-spacing">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="heading-3">Donors</h1>
          <p className="text-body mt-1">
            {filteredDonors.length} {filteredDonors.length === 1 ? 'donor' : 'donors'} found
          </p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="mb-8">
        <div className="max-w-md">
          <TextInput
            icon={IconSearch}
            placeholder="Search donors by name or email..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="input-base"
          />
        </div>
      </div>

      {/* Donors Grid */}
      <div className="grid-responsive">
        {filteredDonors.map((donor) => (
          <Card
            key={donor.id}
            className="card-interactive animate-fade-in"
            onClick={() => handleDonorClick(donor)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <IconUser size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="heading-6">
                      {donor.name}
                    </h4>
                    {donor.has_failed_payments && (
                      <IconAlertTriangle size={16} className="text-error" />
                    )}
                    {donor.has_expired_payments && (
                      <IconAlertTriangle size={16} className="text-gray-500" />
                    )}
                  </div>
                  <p className="text-caption">
                    {donor.email}
                  </p>
                </div>
              </div>
              <IconEye size={20} className="text-gray-400" />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-label">Total Donated</span>
                  </div>
                  <span className="heading-6 text-success">
                    {donor.primary_currency 
                      ? formatAmount(donor.total_donated || 0, donor.primary_currency)
                      : (donor.total_donated || 0).toFixed(2)
                    }
                  </span>
                </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <IconCalendar size={16} className="text-primary" />
                  <span className="text-label">Last Donation</span>
                </div>
                <span className="text-body">
                  {donor.last_donation_date 
                    ? new Date(donor.last_donation_date).toLocaleDateString()
                    : 'N/A'
                  }
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-label">Donations</span>
                <div className="flex items-center space-x-1">
                  <Badge color="success" size="sm">
                    {donor.completed_donation_count || 0}
                  </Badge>
                  {(donor.failed_donation_count || 0) > 0 && (
                    <Badge color="failure" size="sm">
                      {donor.failed_donation_count}
                    </Badge>
                  )}
                  {(donor.expired_donation_count || 0) > 0 && (
                    <Badge color="gray" size="sm" className="bg-gray-500 text-white">
                      {donor.expired_donation_count}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* No Results Message */}
      {filteredDonors.length === 0 && searchValue.trim() && (
        <div className="text-center py-12">
          <IconSearch size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Donors Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            No donors match your search criteria.
          </p>
        </div>
      )}

      {/* Donor Details Modal */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} size="4xl">
        <Modal.Header>
          {selectedDonor && (
            <div>
              <h3 className="text-lg font-semibold">{selectedDonor.name}</h3>
              <p className="text-sm text-gray-500">{selectedDonor.email}</p>
            </div>
          )}
        </Modal.Header>
        <Modal.Body>
          {selectedDonor && (
            <div className="space-y-6">
              {/* Donor Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {selectedDonor.primary_currency 
                      ? formatAmount(selectedDonor.total_donated || 0, selectedDonor.primary_currency)
                      : (selectedDonor.total_donated || 0).toFixed(2)
                    }
                  </div>
                  <div className="text-sm text-gray-500">Total Donated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {selectedDonor.completed_donation_count || 0}
                  </div>
                  <div className="text-sm text-gray-500">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {selectedDonor.failed_donation_count || 0}
                  </div>
                  <div className="text-sm text-gray-500">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                    {selectedDonor.expired_donation_count || 0}
                  </div>
                  <div className="text-sm text-gray-500">Expired</div>
                </div>
              </div>

              {/* Donations Table */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Donation History</h4>
                {donorDonations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No donations found for this donor.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table hoverable>
                      <Table.Head>
                        <Table.HeadCell>Date</Table.HeadCell>
                        <Table.HeadCell>Amount</Table.HeadCell>
                        <Table.HeadCell>Status</Table.HeadCell>
                        <Table.HeadCell>Project</Table.HeadCell>
                      </Table.Head>
                      <Table.Body className="divide-y divide-gray-200 dark:divide-gray-700">
                        {donorDonations.map((donation) => (
                          <Table.Row key={donation.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell>
                              <div className="text-sm">
                                {new Date(donation.created_at).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(donation.created_at).toLocaleTimeString()}
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
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button color="light" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DonorsCards;
