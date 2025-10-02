import { useState, useEffect } from 'react';
import { Spinner } from 'flowbite-react';
import { fetchDonations, fetchDonors } from '../../utils/api/donationService';
import { formatAmount } from '../../hooks/useDonationsData';

interface RecentDonation {
  id: number;
  donor_name: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  project_name?: string;
}

const RecentDonations = () => {
  const [donations, setDonations] = useState<RecentDonation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentDonations();
  }, []);

  const loadRecentDonations = async () => {
    try {
      // Fetch both donations and donors data
      const [donationsData, donorsData] = await Promise.all([
        fetchDonations(),
        fetchDonors()
      ]);

      // Enrich donations with donor information
      const enrichedDonations = donationsData.map((donation: any) => ({
        ...donation,
        amount: parseFloat(donation.amount) || 0,
        donor_name: donorsData.find((d: any) => d.id === donation.donor_id)?.name || 'Unknown',
        donor_email: donorsData.find((d: any) => d.id === donation.donor_id)?.email || 'Unknown'
      }));

      // Get top 5 most recent donations
      const recentDonations = enrichedDonations
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
      setDonations(recentDonations);
    } catch (error) {
      console.error('Error fetching recent donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      case 'expired': return 'bg-gray-500';
      case 'initiated': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="card-elevated card-spacing w-full">
        <h5 className="heading-5 mb-6">Recent Donations</h5>
        <div className="flex justify-center items-center py-8">
          <Spinner size="md" />
        </div>
      </div>
    );
  }

  return (
    <div className="card-elevated card-spacing w-full">
      <h5 className="heading-5 mb-6">Recent Donations</h5>
      <div className="flex flex-col mt-2">
        <ul>
          {donations.map((donation, index) => (
            <li key={donation.id}>
              <div className="flex gap-4 min-h-16">
                <div className="w-16 flex-shrink-0">
                  <p className="text-caption whitespace-nowrap">{formatTime(donation.created_at)}</p>
                </div>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`rounded-full ${getStatusColor(donation.status)} p-1.5 w-fit`}></div>
                  {index < donations.length - 1 && <div className="w-0.5 h-4 bg-border dark:bg-darkborder"></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body font-medium truncate">{donation.donor_name}</p>
                  <p className="text-caption whitespace-nowrap">
                    {formatAmount(donation.amount, donation.currency)}
                  </p>
                  {donation.project_name && (
                    <p className="text-caption text-primary truncate">
                      {donation.project_name}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
        {donations.length === 0 && (
          <div className="text-center py-8">
            <p className="text-body">No recent donations found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentDonations;
