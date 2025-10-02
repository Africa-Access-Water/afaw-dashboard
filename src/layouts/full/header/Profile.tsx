// Profile.tsx
import { useNavigate } from "react-router-dom";
import { Button, Dropdown } from "flowbite-react";
import { logout, getCurrentUser } from "src/utils/api/authService";

const Profile = () => {
  const navigate = useNavigate();
  const data = getCurrentUser();
  const user = data.user || {}; // Ensure user is defined

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
    // alert("You have been logged out successfully.");
  };

  return (
    <div className="relative group/menu">
      <Dropdown
        label=""
        className="rounded-sm w-60"
        dismissOnClick={false}
        renderTrigger={() => (
          <span className="h-10 w-10 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary">
            <img
              src={user.avatar_url || "/src/assets/images/profile/user-1.jpg"}
              alt="User Avatar"
              height="35"
              width="35"
              className="rounded-full"
            />
          </span>
        )}
      >
        <div className="p-3 text-dark">
          <div className="flex flex-col items-center gap-1">
            <img
              src={user.avatar_url || "/src/assets/images/profile/user-1.jpg"}
              alt="User Avatar"
              className="h-16 w-16 rounded-full"
            />
            <h3 className="font-semibold text-base">{user.name || "No Name"}</h3>
            <p className="text-sm text-gray-500">{user.email || "No Email"}</p>
            <p className="text-sm text-gray-500">{user.role || "No Role"}</p>
          </div>

          <Button
            size="sm"
            onClick={handleLogout}
            className="mt-4 w-full border border-primary text-primary bg-transparent hover:bg-lightprimary outline-none focus:outline-none"
          >
            Logout
          </Button>
        </div>
      </Dropdown>
    </div>
  );
};

export default Profile;
