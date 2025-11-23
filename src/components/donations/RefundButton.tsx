import React, { useState } from 'react';
import { Button, Modal, Spinner, Alert } from 'flowbite-react';
import { IconCurrencyDollar, IconAlertTriangle } from '@tabler/icons-react';
import { processRefund } from '../../utils/api/donationService';

interface RefundButtonProps {
  paymentIntentId: string;
  donorName: string;
  amount: number;
  currency: string;
  donationId: number;
  onRefundSuccess?: () => void;
}

const RefundButton: React.FC<RefundButtonProps> = ({
  paymentIntentId,
  donorName,
  amount,
  currency,
  donationId,
  onRefundSuccess
}) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRefund = async () => {
    if (!paymentIntentId) {
      setError('No payment intent ID available for this donation.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await processRefund(paymentIntentId);
      setSuccess(true);

      setTimeout(() => {
        setShowModal(false);
        onRefundSuccess?.();
      }, 1500);
    } catch (err: any) {
      console.error('Refund error:', err);
      setError(err?.response?.data?.error || 'Failed to process refund.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setShowModal(false);
      setError(null);
      setSuccess(false);
    }
  };

  return (
    <>
      <Button
        size="xs"
        color="failure"
        onClick={() => setShowModal(true)}
        disabled={!paymentIntentId}
        title={paymentIntentId ? 'Refund donation' : 'Refund unavailable'}
      >
        Refund
      </Button>

      <Modal show={showModal} onClose={handleClose} size="md">
        <Modal.Header>Confirm Refund</Modal.Header>
        <Modal.Body>
          {error && (
            <Alert color="failure" className="mb-4">
              <span className="font-semibold">Error: </span>
              {error}
            </Alert>
          )}

          {success ? (
            <Alert color="success">
              Refund processed successfully. The donation will update shortly.
            </Alert>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <IconAlertTriangle className="text-yellow-600" size={28} />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold">This action cannot be undone.</p>
                  <p>The full donation amount will be refunded to the donor.</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>Donation ID</span>
                  <span className="font-semibold text-gray-900 dark:text-white">#{donationId}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>Donor</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{donorName}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>Amount</span>
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    {currency.toUpperCase()} {amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Payment Intent</span>
                  <span className="font-mono truncate max-w-[180px]" title={paymentIntentId}>
                    {paymentIntentId}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                After confirming, Stripe will process the refund immediately.
                The donor receives funds in 5-10 business days and our records
                update via the webhook.
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-3 w-full">
            <Button color="gray" onClick={handleClose} disabled={loading}>
              Close
            </Button>
            {!success && (
              <Button color="failure" onClick={handleRefund} disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Processing
                  </>
                ) : (
                  <>
                    <IconCurrencyDollar size={16} className="mr-1" />
                    Confirm Refund
                  </>
                )}
              </Button>
            )}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RefundButton;
