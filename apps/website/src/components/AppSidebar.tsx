import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarGroupLabel,
} from "@link-saver/ui";
import { HomeIcon, LayoutDashboardIcon, SettingsIcon } from "lucide-react";
import { AppSidebarFooter } from "./AppSideBar/Footer";
import { AppSidebarHeader } from "./AppSideBar/Header";
import { SidebarNavItem } from "./AppSideBar/NavItem";

export const AppSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <AppSidebarHeader />

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

      <AppSidebarFooter />
    </Sidebar>
  );
};
