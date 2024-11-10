"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/hooks/app-store";
import { useStore } from "@/hooks/use-store";
import { Ellipsis } from "lucide-react";

const ClearInventory = () => {
  const appState = useStore(useAppStore, (state) => state);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Ellipsis size="12" className="rounded-full" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Inventory</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              if (appState?.clearInventory) {
                appState.clearInventory();
              }
            }}
          >
            <span>Clear the Inventory</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ClearInventory;
