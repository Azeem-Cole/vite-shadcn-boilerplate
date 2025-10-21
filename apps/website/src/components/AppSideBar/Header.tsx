import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  DropdownMenu,
  DropdownMenuTrigger,
  SidebarMenuButton,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@link-saver/ui";
import { Square, ChevronDown } from "lucide-react";

export const AppSidebarHeader = () => (
  <SidebarHeader>
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              Select Workspace
              <ChevronDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
            <DropdownMenuItem>
              <span>Acme Inc</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Acme Corp.</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarHeader>
);
