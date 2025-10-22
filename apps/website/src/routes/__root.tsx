import { Outlet, createRootRoute } from "@tanstack/react-router";
import { SidebarProvider, useSidebar } from "@link-saver/ui";
import { AppSidebar } from "./../components/AppSidebar";

import { PanelLeftIcon } from "lucide-react";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <div>Page Not Found</div>,
});

function RootComponent() {
  const Opener = () => {
    const { toggleSidebar } = useSidebar();
    return <PanelLeftIcon onClick={toggleSidebar} />;
  };

  return (
    <SidebarProvider className="flex w-full" id="sideBarProvider">
      <AppSidebar />

      <main className="flex w-full flex-col gap-2 p-2">
        <Opener />

        <div className="text-center flex flex-1 border rounded-md">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
