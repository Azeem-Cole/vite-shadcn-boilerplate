import { Outlet, createRootRoute } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@link-saver/ui";
import { AppSidebar } from "./../components/AppSidebar";

import { PanelLeftIcon } from "lucide-react";
import { useState } from "react";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [count, setCount] = useState(0);

  const Opener = () => {
    const { toggleSidebar, state } = useSidebar();
    return <PanelLeftIcon onClick={toggleSidebar} />;
  };

  return (
    <SidebarProvider className="h-full" id="sideBarProvider">
      <AppSidebar />
      <main className="flex w-full flex-col">
        <div>
          <Opener />
          {/* <SidebarTrigger /> */}
        </div>

        <div className="text-center border-8 bg-red-200 overflow-hidden">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
