import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import InventoryItems from "./inventory-items";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel>Inventory</SidebarGroupLabel>
          <SidebarGroupContent className="h-full bg-slate-700 flex flex-1 flex-col">
            <InventoryItems />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
