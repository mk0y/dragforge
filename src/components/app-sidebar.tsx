import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import InventoryItems from "./inventory-items";
import ClearInventory from "./ui/clear-inventory";

export function AppSidebar() {
  return (
    <Sidebar variant="floating" className="pr-0">
      <SidebarContent className="overflow-visible">
        <div className="flex justify-between p-2">
          <SidebarHeader>Inventory</SidebarHeader>
          <ClearInventory />
        </div>
        <SidebarGroup className="flex-1">
          <div className="flex justify-between"></div>
          <SidebarGroupContent className="h-full bg-slate-700 flex flex-1 flex-col">
            <InventoryItems />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
