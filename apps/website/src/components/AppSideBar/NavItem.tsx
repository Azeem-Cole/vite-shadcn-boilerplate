import { SidebarMenuButton, SidebarMenuItem } from "@link-saver/ui";
import { Link } from "@tanstack/react-router";

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
