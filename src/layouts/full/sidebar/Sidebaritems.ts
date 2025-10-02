export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: any;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
}

import { uniqueId } from "lodash";

const SidebarContent: MenuItem[] = [
  {
    heading: "HOME",
    children: [
      {
        name: "Dashboard",
        icon: "solar:widget-add-line-duotone",
        id: uniqueId(),
        url: "/dashboard",
      },
      {
        name: "Manage Projects",
        icon: "solar:widget-add-line-duotone",
        id: uniqueId(),
        url: "/projects",
      },
    ],
  },
  {
    heading: "DONATION SYSTEM",
    children: [
      {
        name: "Donations",
        icon: "solar:wallet-linear",
        id: uniqueId(),
        url: "/donations",
      },
      {
        name: "Donors",
        icon: "solar:users-group-rounded-outline",
        id: uniqueId(),
        url: "/donors",
      },
    ],
  },
  {
    heading: "TEAM MANAGEMENT",
    children: [
      {
        name: "Team Members",
        icon: "solar:users-group-rounded-outline",
        id: uniqueId(),
        url: "/team",
      },
    ],
  },
  //Work in progress
  // {
  //   heading: "REPORTS",
  //   children: [
  //     {
  //       name: "Export & Reports",
  //       icon: "solar:download-linear",
  //       id: uniqueId(),
  //       url: "/export",
  //     },
  //   ],
  // }

];

export default SidebarContent;
