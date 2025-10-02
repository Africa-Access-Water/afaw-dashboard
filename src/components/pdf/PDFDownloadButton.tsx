import React from 'react';
import { Button } from 'flowbite-react';
import { usePDFGenerator } from '../../hooks/usePDFGenerator';

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

interface OrganizationInfo {
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
}

interface PDFDownloadButtonProps {
  donation: DonationData;
  organizationInfo?: OrganizationInfo;
  variant?: 'full' | 'simple';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  donation,
  organizationInfo,
  variant = 'full',
  size = 'sm',
  className = ''
}) => {
  const { isGenerating, error, generateDonationReceipt, generateSimpleReceipt } = usePDFGenerator();

  const handleDownload = async () => {
    if (variant === 'simple') {
      generateSimpleReceipt(donation, organizationInfo);
    } else {
      await generateDonationReceipt(donation, organizationInfo);
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={handleDownload}
        disabled={isGenerating}
        size={size}
        className={`${className} ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
        color="blue"
      >
        {isGenerating ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Generating...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            <span>Download</span>
          </div>
        )}
      </Button>
      
      {error && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-xs whitespace-nowrap z-10">
          {error}
        </div>
      )}
    </div>
  );
};

export default PDFDownloadButton;

