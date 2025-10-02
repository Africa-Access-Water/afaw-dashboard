import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchDonations, fetchDonors } from '../utils/api/donationService';

// Types
export interface Donation {
  id: number;
  donor_id: number;
  project_id?: number;
  amount: number;
  currency: string;
  status: 'initiated' | 'pending' | 'completed' | 'failed' | 'expired';
  type: 'one-time' | 'subscription';
  stripe_checkout_session_id?: string;
  stripe_payment_intent?: string;
  stripe_subscription_id?: string;
  interval?: string;
  created_at: string;
  updated_at: string;
  project_name?: string;
  project_description?: string;
  donor_name?: string;
  donor_email?: string;
}

export interface Donor {
  id: number;
  name: string;
  email: string;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
  total_donated?: number;
  donation_count?: number;
  completed_donation_count?: number;
  failed_donation_count?: number;
  expired_donation_count?: number;
  has_failed_payments?: boolean;
  has_expired_payments?: boolean;
  last_donation_date?: string;
  primary_currency?: string | null;
}

// Caching removed (backend and frontend) to keep implementation simple

// Currency mapping
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  INR: '₹',
  ZAR: 'R',
  ZMW: 'K', // Zambian Kwacha
  NGN: '₦',
  KES: 'KSh',
  GHS: '₵',
  EGP: '£',
  MAD: 'د.م.',
  TND: 'د.ت',
  DZD: 'د.ج',
  LYD: 'ل.د',
  SDG: 'ج.س.',
  ETB: 'Br',
  UGX: 'USh',
  TZS: 'TSh',
  BWP: 'P',
  SZL: 'L',
  LSL: 'L',
  MZN: 'MT',
  AOA: 'Kz',
  MWK: 'MK',
  ZWL: 'Z$'
};

export const getCurrencySymbol = (currency: string): string => {
  return CURRENCY_SYMBOLS[currency.toUpperCase()] || currency.toUpperCase();
};

// Safe amount formatting utility
export const formatAmount = (amount: any, currency: string = 'USD'): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
  if (isNaN(numAmount)) return `${getCurrencySymbol(currency)}0.00`;
  return `${getCurrencySymbol(currency)}${numAmount.toFixed(2)}`;
};

// Main hook
export const useDonationsData = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Track last fetch time if needed later (not used currently)
  const [, setLastFetch] = useState<Date | null>(null);

  // Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch from API
      const [donationsData, donorsData] = await Promise.all([
        fetchDonations(),
        fetchDonors()
      ]);

      // Process and enrich data
      const enrichedDonations = donationsData.map((donation: any) => ({
        ...donation,
        amount: parseFloat(donation.amount) || 0, // Ensure amount is a number
        donor_name: donorsData.find((d: Donor) => d.id === donation.donor_id)?.name || 'Unknown',
        donor_email: donorsData.find((d: Donor) => d.id === donation.donor_id)?.email || 'Unknown'
      }));

      const enrichedDonors = donorsData
        .map((donor: any) => {
          // Only consider donations with completed, expired, or failed status
          const relevantDonations = enrichedDonations.filter((d: Donation) => 
            d.donor_id === donor.id && ['completed', 'expired', 'failed'].includes(d.status)
          );
          const completedDonations = relevantDonations.filter((d: Donation) => d.status === 'completed');
          const failedDonations = relevantDonations.filter((d: Donation) => d.status === 'failed');
          const expiredDonations = relevantDonations.filter((d: Donation) => d.status === 'expired');
          
          const totalDonated = completedDonations.reduce((sum: number, d: Donation) => sum + d.amount, 0);
          const lastDonation = completedDonations
            .sort((a: Donation, b: Donation) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

          // Get unique currencies from completed donations
          const uniqueCurrencies = [...new Set(completedDonations.map((d: Donation) => d.currency))];
          const primaryCurrency = uniqueCurrencies.length === 1 ? uniqueCurrencies[0] : null;

          return {
            ...donor,
            total_donated: totalDonated,
            donation_count: relevantDonations.length,
            completed_donation_count: completedDonations.length,
            failed_donation_count: failedDonations.length,
            expired_donation_count: expiredDonations.length,
            has_failed_payments: failedDonations.length > 0,
            has_expired_payments: expiredDonations.length > 0,
            last_donation_date: lastDonation?.created_at,
            primary_currency: primaryCurrency
          };
        })
        .filter((donor: any) => donor.completed_donation_count > 0) // Only show donors with at least one completed payment
        .sort((a: any, b: any) => (b.total_donated || 0) - (a.total_donated || 0)); // Sort by total donated (highest first)

      setDonations(enrichedDonations);
      setDonors(enrichedDonors);
      setLastFetch(new Date());


    } catch (err) {
      console.error('Error fetching donations data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Computed values
  const stats = useMemo(() => {
    const completedDonations = donations.filter(d => d.status === 'completed');
    const totalAmount = completedDonations.reduce((sum, d) => sum + d.amount, 0);
    const totalDonors = donors.length;
    const activeDonors = donors.filter(d => d.total_donated && d.total_donated > 0).length;
    
    // Group by currency
    const currencyStats = completedDonations.reduce((acc, donation) => {
      const currency = donation.currency.toUpperCase();
      if (!acc[currency]) {
        acc[currency] = { count: 0, total: 0 };
      }
      acc[currency].count += 1;
      acc[currency].total += donation.amount;
      return acc;
    }, {} as Record<string, { count: number; total: number }>);

    return {
      totalDonations: completedDonations.length,
      totalAmount,
      totalDonors,
      activeDonors,
      currencyStats,
      averageDonation: completedDonations.length > 0 ? totalAmount / completedDonations.length : 0
    };
  }, [donations, donors]);

  // Cache status removed

  return {
    donations,
    donors,
    loading,
    error,
    stats,
    refetch: () => fetchData(),
    refresh: () => fetchData()
  };
};
