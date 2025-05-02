import {
  Calendar,
  DonutIcon,
  Home,
  Inbox,
  Menu,
  Search,
  Settings,
  SquareDashedBottomCodeIcon,
  Trash,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "File",
    url: "#",
    icon: Inbox,
  },

  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Trash",
    url: "#",
    icon: Trash,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function MainSidebar() {
  return (
    <Sidebar className="">
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 py-2">
            <DonutIcon /> <h1 className="text-xl font-bold">DocSphere</h1>
          </div>
          <Menu />
        </div>
      </SidebarHeader>
      <SidebarContent className="">
        <SidebarMenu className="mt-4">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="">
                <SquareDashedBottomCodeIcon />
                <span>Dashboard</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
          onClick={() => {
            sessionStorage.clear();
            window.location.href = "/";
          }}
        >
          Log out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
