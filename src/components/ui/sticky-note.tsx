import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const stickyNoteVariants = cva(
  "relative flex min-h-40 w-full max-w-60 flex-col gap-2 p-4 font-editorial text-base leading-6 text-stone-900 shadow-paper-sm",
  {
    variants: {
      color: {
        yellow: "bg-yellow-200",
        pink: "bg-pink-200",
        blue: "bg-sky-200",
        green: "bg-lime-200",
      },
      tilt: {
        none: "",
        left: "-rotate-2",
        right: "rotate-2",
      },
      taped: {
        true: "washi-tape",
        false: "",
      },
    },
    defaultVariants: {
      color: "yellow",
      tilt: "left",
      taped: false,
    },
  },
);

type StickyNoteProps = Omit<React.ComponentProps<"div">, "color"> & VariantProps<typeof stickyNoteVariants>;

function StickyNote({ className, color, tilt, taped, ...props }: StickyNoteProps) {
  return (
    <div data-slot="sticky-note" className={cn(stickyNoteVariants({ color, tilt, taped }), className)} {...props} />
  );
}

export { StickyNote, stickyNoteVariants, type StickyNoteProps };
