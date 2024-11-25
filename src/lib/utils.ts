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

export const addOpacityToHex = (hex: string, opacity: number) => {
  hex = hex.replace('#', '');
  if (hex.length !== 6) {
    throw new Error('Invalid hex color format. Use #RRGGBB.');
  }
  const alpha = Math.round(opacity * 255);
  const alphaHex = alpha.toString(16).padStart(2, '0');
  return `#${hex}${alphaHex}`;
}