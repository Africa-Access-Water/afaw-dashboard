import { Alert, Button } from 'flowbite-react';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import CardBox from '../../components/shared/CardBox';
import DonationsTable from '../../components/donations/DonationsTable';
import { useDonationsData } from '../../hooks/useDonationsData';

const Donations = () => {
  const { donations, loading, error, refetch } = useDonationsData();

  if (error) {
    return (
      <div className="space-y-6">
        <Alert color="failure" icon={IconAlertCircle}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Error Loading Data</h3>
              <p className="mt-1 text-sm">{error}</p>
            </div>
            <Button
              size="sm"
              color="failure"
              onClick={refetch}
              className="flex items-center gap-2"
            >
              <IconRefresh size={16} />
              Retry
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="section-spacing">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-2">Donations Dashboard</h1>
          <p className="text-body mt-1">
            Manage and track all donation activities
          </p>
        </div>
        <Button
          color="light"
          onClick={refetch}
          disabled={loading}
          className="btn-ghost flex items-center gap-2"
        >
          <IconRefresh size={16} className={loading ? 'animate-spin' : ''} />
          Refresh Data
        </Button>
      </div>

      {/* Main Content */}
      <CardBox>
        <DonationsTable
          donations={donations}
          loading={loading}
        />
      </CardBox>
    </div>
  );
};

export default Donations;