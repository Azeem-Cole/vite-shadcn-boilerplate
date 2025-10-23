import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarGroupLabel,
} from "@link-saver/ui";
import {
  Folder,
  HomeIcon,
  LayoutDashboardIcon,
  SettingsIcon,
} from "lucide-react";
import { AppSidebarFooter } from "./AppSideBar/Footer";
import { AppSidebarHeader } from "./AppSideBar/Header";
import { SidebarNavItem } from "./AppSideBar/NavItem";
import { IconApps } from "@tabler/icons-react";

export const AppSidebar = () => {
  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <AppSidebarHeader />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarNavItem to="/" icon={<HomeIcon />} label="Home" />

              <SidebarNavItem to="/sites" icon={<IconApps />} label="Sites" />
              <SidebarNavItem to="/folders" icon={<Folder />} label="Folders" />

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
