import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Button, SidebarProvider, useSidebar } from "@link-saver/ui";
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

      <main className="h-dvh w-dvw flex flex-col flex-1 gap-2 p-2 overflow-hidden ">
        <div className="flex flex-row gap-2 justify-between">
          <Opener />
          <Button>Sync with Browser</Button>
        </div>

        <div className="text-center flex flex-1 border rounded-md w-full h-full overflow-scroll shadow-(--shadow-md) ">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
