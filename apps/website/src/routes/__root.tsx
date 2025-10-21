import { Outlet, createRootRoute } from "@tanstack/react-router";
import { SidebarProvider, useSidebar } from "@link-saver/ui";
import { AppSidebar } from "./../components/AppSidebar";

import { PanelLeftIcon } from "lucide-react";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const Opener = () => {
    const { toggleSidebar } = useSidebar();
    return <PanelLeftIcon onClick={toggleSidebar} />;
  };

  return (
    <SidebarProvider className="h-full" id="sideBarProvider">
      <AppSidebar />
      <Opener />

      <main >
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
