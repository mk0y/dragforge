import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Ellipsis } from "lucide-react";
import InventoryItems from "./inventory-items";

export function AppSidebar() {
  return (
    <Sidebar variant="floating">
      <SidebarContent>
        <SidebarGroup className="flex-1">
          <div className="flex justify-between">
            <SidebarGroupLabel>Inventory</SidebarGroupLabel>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Ellipsis className="rounded-full" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Inventory</DropdownMenuLabel>
                <DropdownMenuItem>
                  <span>Clear the Inventory</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <SidebarGroupContent className="h-full bg-slate-700 flex flex-1 flex-col overflow-hidden">
            <InventoryItems />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
