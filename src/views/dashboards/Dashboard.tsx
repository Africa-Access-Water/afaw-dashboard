import { Link } from 'react-router';
import Contacts from 'src/components/dashboard/Contacts';
import PostCards from 'src/components/dashboard/PostsCards';
import RecentDonations from 'src/components/dashboard/RecentDonations';

const Dashboard = () => {
  return (
    <div className="section-spacing">
      <div className="grid grid-cols-12 gap-6">

      <div className="lg:col-span-8 col-span-12">
        <Contacts />
      </div>

       <div className="lg:col-span-4 col-span-12 flex">
        <RecentDonations />
      </div>

      <div className="col-span-12">
        <PostCards />
      </div>


        <div className="flex justify-center align-middle gap-2 flex-wrap col-span-12 text-center">
          <p className="text-body">
            Design and Developed by{' '}
            <Link
              to="https://adminmart.com/"
              target="_blank"
              className="pl-1 text-primary underline decoration-primary"
            >
              adminmart.com
            </Link>
          </p>
          <p className="text-body">
            Distributed by
            <Link
              to="https://themewagon.com/"
              target="_blank"
              className="pl-1 text-primary underline decoration-primary"
            >
              ThemeWagon
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
