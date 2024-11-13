import { clsx, type ClassValue } from "clsx"
import { replace, split } from "ramda";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fromActiveId = (activeId: string) => {
  const parts = split("--", replace("draggable-from-", "", activeId));
  return [parts[0], parts[1]];
}