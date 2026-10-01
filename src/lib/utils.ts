import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's default scale names. Papercraft adds its own
 * shadow and radius tokens, so we register them here — otherwise `shadow-paper-md`
 * would be mistaken for a shadow *color* and never be overridden by `shadow-lg`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      shadow: ["paper-flat", "paper-xs", "paper-sm", "paper-md", "paper-lg", "paper-inset"],
      radius: ["paper", "paper-md"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
