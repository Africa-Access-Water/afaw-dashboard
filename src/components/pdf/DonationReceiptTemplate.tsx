import React from 'react';
import afawLogo from '../../assets/images/logos/afaw-logo-black.svg';

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

interface DonationReceiptTemplateProps {
  donation: DonationData;
  organizationName?: string;
  organizationAddress?: string;
  organizationEmail?: string;
  organizationPhone?: string;
  organizationWebsite?: string;
  organizationRegNumber?: string;
  printDate?: string;
}

const DonationReceiptTemplate: React.FC<DonationReceiptTemplateProps> = ({
  donation,
  organizationName = "AFRICA ACCESS WATER",
  organizationAddress = "Lot 5676/M/6, Lusaka West, Lusaka, Zambia",
  organizationEmail = "template",
  organizationPhone = "+260 211 231 174 | +260 976 944 695",
  organizationWebsite = "www.africaaccesswater.org",
  organizationRegNumber = "Non-profit Organization, Company No. 120190001569",
  printDate
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  return (
    <div 
      id="donation-receipt" 
      className="bg-white p-8 max-w-4xl mx-auto font-sans"
      style={{ 
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        color: '#333'
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8 border-b-2 border-gray-200 pb-6">
        {/* Left side - Receipt Title */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">Donation Receipt</h1>
          <p className="text-lg font-semibold text-gray-700 mb-2">{organizationName}</p>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-600">Receipt No: </span>
              <span className="font-semibold text-gray-800">AFAW-ACKP-{donation.id.toString().padStart(3, '0')}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Date: </span>
              <span className="font-semibold text-gray-800">{formatDate(donation.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Right side - Organization Info */}
        <div className="flex-1 text-right">
          {/* Organization Logo */}
          <div className="mb-4">
            <div className="inline-block">
              <div className="mb-3 mx-auto">
                <img
                  src={afawLogo}
                  alt="AFRICA ACCESS WATER Logo"
                  className="max-h-28 max-w-[160px] object-contain mx-auto"
                  style={{
                    height: 'auto',   // let height adapt naturally
                    width: 'auto',    // keep proportions
                    display: 'block'
                  }}
                />
              </div>
            </div>
          </div>


          
          <div className="text-sm text-gray-600 space-y-1">
            <div>{organizationAddress}</div>
            <div>{organizationPhone}</div>
            <div>{organizationEmail}</div>
            <div>{organizationWebsite}</div>
            <div className="text-xs">{organizationRegNumber}</div>
          </div>
        </div>
      </div>

      {/* Transaction ID - if available */}
      {donation.transaction_id && (
        <div className="mb-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Transaction Information
            </h2>
            <div>
              <p className="text-sm text-gray-600 mb-1">Transaction ID:</p>
              <p className="font-semibold text-gray-800">
                {donation.transaction_id}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Donor Information */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Donor Information
        </h2>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Donor Name:</p>
              <p className="font-semibold text-gray-800 text-lg">
                {donation.name}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Email Address:</p>
              <p className="font-semibold text-gray-800">
                {donation.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Details */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Donation Details
        </h2>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Amount Donated:</p>
              <p className="font-bold text-green-600 text-2xl">
                ${donation.amount.toFixed(2)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Payment Method:</p>
              <p className="font-semibold text-gray-800">
                {donation.method}
              </p>
            </div>
          </div>
          
          {donation.message && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Donor Message:</p>
              <div className="bg-white p-4 rounded border-l-4 border-green-500">
                <p className="text-gray-800 italic">
                  "{donation.message}"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tax Information */}
      <div className="mb-8">
        <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
          <h3 className="font-semibold text-gray-800 mb-2">
            Tax Deductible Information
          </h3>
          <p className="text-sm text-gray-700">
            This donation is tax-deductible to the full extent allowed by law. 
            Please keep this receipt for your tax records. Our organization is a 
            registered 501(c)(3) non-profit organization.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 pt-6">
        {/* Red line */}
        <div className="w-full h-1 bg-red-500 mb-4"></div>
        <p className="text-sm text-gray-800 mb-2">
          Thank you for your Generous Donation!
        </p>
        <p className="text-sm text-gray-800">
          For any inquiries, please contact us at <strong>{organizationEmail}</strong>
        </p>
        
        {/* Print Date Watermark */}
        {printDate && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400 italic">
              Receipt generated on: {printDate}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationReceiptTemplate;

