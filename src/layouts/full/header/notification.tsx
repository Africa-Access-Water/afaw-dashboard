import { Badge, Dropdown } from "flowbite-react";
import { Icon } from "@iconify/react";
import { Link } from "react-router";
import { Notifications } from "../../../utils/data/NotificationsData"; // Importing notification data

// Sample notifications: mixture of Contacts, Newsletters, and Donations


const Notification = () => {
  return (
    <div className="relative group/menu">
      <Dropdown
        label=""
        className="rounded-sm w-[300px] notification"
        dismissOnClick={false}
        renderTrigger={() => (
          <span
            className="h-10 w-10 hover:text-primary group-hover/menu:bg-lightprimary group-hover/menu:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer relative"
            aria-label="Notifications"
          >
            <Icon icon="solar:bell-linear" height={20} />
            <Badge className="h-2 w-2 rounded-full absolute end-2 top-1 bg-primary p-0" />
          </span>
        )}
      >
        {Notifications.map((item) => (
          <Dropdown.Item
            as={Link}
            key={item.id}
            to="#"
            className="px-3 py-3 flex items-center bg-hover group/link w-full gap-3 text-dark hover:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              
              <div className="flex flex-col">
                <p className="text-dark opacity-80 text-[13px] font-semibold">
                  {item.title}
                </p>
                <Badge
                  color={
                    item.type === "Donation"
                      ? "success"
                      : item.type === "Newsletter"
                      ? "info"
                      : "warning"
                  }
                  className="mt-1 text-xs"
                >
                  {item.type}
                </Badge>
              </div>
            </div>
          </Dropdown.Item>
        ))}
      </Dropdown>
    </div>
  );
};

export default Notification;
