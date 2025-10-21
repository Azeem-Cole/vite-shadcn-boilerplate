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
    <SidebarProvider className="flex w-full" id="sideBarProvider">
      <AppSidebar />
      
      <main className="flex w-full flex-col">
        <div>
          <Opener />
        </div>

        <div className="text-center flex-1 border rounded">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
