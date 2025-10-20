import React from "react";
import {
  Button,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarGroupLabel,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@link-saver/ui";
import {
  Home,
  HomeIcon,
  LayoutDashboardIcon,
  SettingsIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

export const AppSidebar = () => {
  return (
    <Sidebar
      className="h-full"
      collapsible="icon"
      side="left"
      variant="sidebar"
    >
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Home />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Your App</span>
            <span className="text-xs text-muted-foreground">Dashboard</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarNavItem to="" icon={<HomeIcon />} label="Home" />

              <SidebarNavItem
                to="/dashboard"
                icon={<LayoutDashboardIcon />}
                label="Dashboard"
              />

              <SidebarNavItem
                to="/settings"
                icon={<SettingsIcon />}
                label="Settings"
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Button variant="outline" size="sm" className="w-full">
          <span>Account</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export const SidebarNavItem = ({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link to={to} className="flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
